# Build Sheet — What To Build

The single source of work. This file is the **fixed Build Protocol** below,
followed by **one block per feature**. A building session reads the matching
guide(s) (`../guides/`) AND the relevant product file(s) (`overview.md`,
`client.md`) AND this block, then executes. If a block is missing, or a
required line in it is blank or `-`, **STOP and ask** — never guess the missing
part and never invent a feature that has no block.

## Build Protocol (read first, every task)

1. **Read first.** Route through `AGENTS.md`: the matching guide(s) for the
   craft, `client.md` for any UI, and this task block. Reading is part of the
   task, not optional.
2. **Layers.** `lib → hooks → components → features → app`; imports point down;
   a feature never imports a feature; a component never imports a feature;
   `app/**` pages are sterile composition (`../guides/architecture.md`).
3. **Create-down.** A missing capability is created at its correct layer first
   (a `lib` module is born with its sibling test), then consumed — never
   inlined higher up.
4. **Style.** Tokens only (values in `src/styles/globals.css`), logical
   direction utilities only, zero comments, zero hardcoded user-facing strings
   (next-intl, all four locale files in the same commit), no manual
   `useMemo`/`useCallback`/`memo` (`../guides/style.md`, `i18n.md`).
5. **Data & identity.** `fetch(` only in `src/api/client.ts`; every call is a
   `resource()` registry entry; the access token is Bearer + in-memory;
   permissions are the dedicated `/auth/permissions` endpoint
   (`../guides/api.md`, `auth.md`).
6. **Gates (all green before commit).** `pnpm lint` (0) · `pnpm typecheck` (0)
   · `pnpm build` (when routing/config/deps change). No bypass — no
   rule-disable, `@ts-ignore`, `biome-ignore`, or `any`.
7. **Report.** Gate results; `git show --stat` per commit; guides + product
   files read; deviations; design-critique pass count for UI; anything left
   unverified.

## Status legend

| Status | Meaning |
|---|---|
| **READY** | Prerequisites met; a session can execute it end-to-end without asking. |
| **IN PROGRESS** | Being built now. |
| **DONE** | Shipped; gates green. |
| **BLOCKED** | A prerequisite or decision is missing — named in the block. |
| **BACKLOG** | Intent captured; not yet specced to READY. Gets a full block before build. |

## Locked platform decisions (apply everywhere)

1. **Auth transport = Bearer (Sanctum API-token).** Login returns a Sanctum
   personal-access token; the client holds it **in memory only**
   (`src/lib/auth/token.ts`) and sends `Authorization: Bearer …`. It survives a
   reload by re-minting from an **httpOnly refresh cookie** the backend sets at
   login (`api.auth.refresh`, `credentials: "include"`). Never
   `localStorage`/`sessionStorage`/JS-cookie. The backend authorizes every
   request; the proxy is never the security boundary.
2. **API versioning = base URL.** `NEXT_PUBLIC_API_URL` ends with `/v1`;
   `resource()` entry paths are **version-free** (`/auth/login`). **You must set
   `NEXT_PUBLIC_API_URL=<host>/v1` by hand in `.env`, `.env.example`, and
   `.env.production`** — the code default in `src/lib/env/client.ts` ends with
   `/v1`, but a value set in an env file overrides it, so without the suffix
   every auth call resolves to `<host>/auth/...` and 404s. See the API-versioning
   decision in `../decisions/0001-project-bootstrap.md`.
3. **Permissions = one source.** The dedicated `/auth/permissions` endpoint
   (`api.permissions`, already wired to `use-permission`). The session never
   carries permissions.
4. **Resource vocabulary.** `store · list · show · update · destroy` — the
   exact keys `resource()` emits; `need` strings are `<resource>.<action>`.

---

## Auth · Status: DONE

> First real task. Build against the standard endpoints as if the backend is
> already live. No `fetch` in any feature/component, no hardcoded URL or path
> anywhere — every call goes through the `resource()` DSL in `src/api`
> (`../guides/api.md`). Obey the Build Protocol above.

- **Goal:** A visitor can sign in, register, recover and reset a password, and
  confirm an account/code — across email/password and social providers —
  through one cohesive, beautifully designed auth surface.

### Progress

- [x] Promote permission predicates to `src/lib/permissions` with tests.
- [x] Add in-memory auth token holder and provider refresh wiring.
- [x] Add auth API entries and register them.
- [x] Add auth schemas, mode config, hook, feature component, and sterile pages.
- [x] Add `auth.*` translations to all four locale files.
- [x] Add confirm resend cooldown and reset/confirm query prefill.
- [x] Verify no auth token persistence and no `fetch(` outside `src/api/client.ts`.
- [x] Fix build warnings for workspace root and metadata.
- [x] Add `.env.production` with `/v1` API base URL and allow it in `.gitignore`.
- [x] Run gates: check, typecheck, tests, and webpack build.
- [x] Upgrade social provider buttons from generic icons to crisp brand icons.
- [x] Record the shadcn `form` CLI deviation.
- [x] Record unverified operator defaults: post-login redirect `/`, 6-digit code, 30s resend.
- [x] Final report and set Auth status to `DONE`.

### Deviations

- `shadcn@latest add form checkbox input-otp` generated `checkbox` and `input-otp`, but did not generate a `form` primitive in this Base UI registry. The auth surface uses `react-hook-form` directly and does not hand-write `src/components/ui/**`.

### Unverified Defaults

- Post-login redirect is `/`.
- Verification code length is `6`.
- Resend cooldown is `30s`.

### Final Report

- Gates: `pnpm check` passed, `pnpm typecheck` passed, `pnpm test` passed, `next build --webpack` passed.
- Tests: 4 files passed, 10 tests passed.
- Design critique passes: auth surface, responsive header, social provider buttons, OpenGraph/metadata.
- Remaining external dependency: backend endpoints are consumed as specified but not end-to-end verified against a live backend.
- Environment note: local Node is `22.12.0`; package engines request `>=24`.

### Prerequisites (in-task, create-down — do these first, no operator input needed)

1. **`src/lib/permissions/`** — promote the pure predicates (`can`, `canAll`,
   `canAny`, `toSet`) out of `src/hooks/use-permission.ts` into an isomorphic
   `lib` module (born with its sibling test); leave `usePermission()` as the
   React accessor that imports them. This is the canonical `Can` core
   (`../guides/auth.md`).
2. **In-memory token holder + wiring.** Add a tiny module-level token holder
   (e.g. `src/lib/auth/token.ts` — set/get/clear, **no persistence**) and wire
   `configure({ token, refresh })` in `src/app/[locale]/providers.tsx` (today
   only `context` is wired). `login`/`social` success sets the token;
   `logout` clears it and the query cache; `refresh` calls `api.auth.refresh`.
   On app boot, call `refresh` once to silently rehydrate the token from the
   httpOnly cookie — a `401` there simply means guest.
3. **shadcn primitives via CLI.** Present already: `button`, `input`, `label`,
   `select`, `dialog`, `popover`, `sonner`, `badge`, `skeleton`, `tabs`,
   `table`, `dropdown-menu`. Add the missing ones:
   `pnpm dlx shadcn@latest add form checkbox input-otp`. Never hand-write
   `components/ui/**`.
4. **Locale keys.** Add the `auth.*` namespace (labels, CTAs, validation,
   errors) to all four locale files (`messages/{en,ar,fr,de}.json`) in the same
   commit.

### Endpoints (standard — treat as live)

Base: `NEXT_PUBLIC_API_URL` (ends with `/v1`) + the version-free paths below.
Methods follow REST convention. Auth is public — **no `need` strings**.

| entry | method | path |
|---|---|---|
| `api.auth.login` | POST | `/auth/login` |
| `api.auth.logout` | POST | `/auth/logout` |
| `api.auth.register` | POST | `/auth/register` |
| `api.auth.recovery` | POST | `/auth/recovery` |
| `api.auth.reset` | POST | `/auth/reset` |
| `api.auth.confirm` | POST | `/auth/confirm` |
| `api.auth.session` | GET | `/auth/session` |
| `api.auth.refresh` | POST | `/auth/refresh` |
| `api.auth.socialLogin` | POST | `/auth/social-login/:provider` |

- `:provider` ∈ `google | facebook | github | apple | telegram`.
- Define these in one `src/api/auth.ts` via `resource("auth", { extra: … })` —
  non-CRUD, so **all explicit extras** (no auto CRUD). Register it in
  `src/api/registry.ts`. `login`/`register`/`recovery`/`reset`/`confirm`/
  `social` are `guest: true` (the request carries no token).
- **Permissions are NOT defined here.** The set is `api.permissions`
  (`/auth/permissions`), already in the registry and consumed by
  `use-permission` — the single source (decision 3). Do not add a second.
- `api.auth.session` returns the current identity. `api.auth.refresh` mints a
  fresh access token from the **httpOnly refresh cookie** — the one entry that
  sets `credentials: "include"`; every other entry is pure Bearer (no cookie).
  Login / refresh / logout depend on that cookie — see the Backend contract in
  `../guides/auth.md`.

### Fields & validation (the conventional set)

One Zod schema per mode in `features/auth/schema.ts`, consumed by
`react-hook-form` + zod resolver (locked stack). Reuse `lib/std/validate`
(`isEmail`, `isStrongPassword`); add a pure helper only if one is genuinely
missing. Fields:

- name · phone · email · password · confirm-password · affiliate code/name ·
  agree-to-terms (boolean, required true).
- Each mode uses the subset it needs. `confirm-password` must equal `password`;
  `agree-to-terms` must be accepted on register.

### Behavior (flows)

- **login** — email + password → on success the backend returns an access
  token (stored in memory via `configure({ token })`) and sets the httpOnly
  refresh cookie; redirect to the post-login route.
- **register** — name, phone, email, password, confirm-password, affiliate
  code/name (optional), agree-to-terms → success leads to the confirm step.
- **recovery** — email → backend sends a recovery code/link → leads to reset.
- **reset** — new password + confirm (with the recovery token/code) → success
  returns to login.
- **confirm** — a code (email or SMS) confirms the account/action; supports
  **resend** after a cooldown.
- **social-login** — one call per provider button; success behaves like login.
- **logout** — clears the in-memory token and the TanStack cache.
- `[OPERATOR INPUT]` exact post-login redirect route, code length, and resend
  cooldown — build with sensible defaults (**6-digit code, 30s resend, redirect
  to `/`**) and list them as unverified.

### Layer placement

| layer | what to add | path |
|---|---|---|
| `lib/std` | reuse `validate`; add a pure helper only if genuinely missing | `src/lib/std/validate` |
| `lib/permissions` | the `Can` core promoted from `use-permission` (prerequisite 1) | `src/lib/permissions` |
| `lib/auth` | in-memory token holder (prerequisite 2) | `src/lib/auth` |
| `api` | `resource("auth", { extra })` + register it | `src/api/auth.ts`, `src/api/registry.ts` |
| `hooks` | `use-auth` — wraps the auth mutations over TanStack (login/register/recovery/reset/confirm/social/logout), exposes status + typed submit; **general** because pages and the layout (logout) consume it | `src/hooks/use-auth.ts` |
| `stores` | none — identity is not client state; it is the in-memory token + TanStack cache (`../guides/state.md`, `auth.md`) | - |
| `components/ui` | only via CLI (prerequisite 3) | `src/components/ui/elements` |
| `components/custom` | shared composites only if genuinely cross-feature (e.g. `social-buttons`, `otp-input`); otherwise keep them self | `src/components/custom` |
| `features/auth` | the one feature; see anatomy below | `src/features/auth/**` |
| `app/[locale]` | the five sterile routes composing `features/auth` with a `mode` (+ params) | `src/app/[locale]/(auth)/…` |
| `messages` (all locales) | every visible string + field/validation message, namespaced `auth.*`, all locale files same commit | `messages/{en,ar,fr,de}.json` |
| `tests` | deferred (mirror path reserved) — `tests/features/auth/…` | - |

### `features/auth` anatomy (exports ONE component)

    features/auth/
      components/        self parts: AuthCard, AuthHeader, fields, SocialButtons, OtpInput, TermsCheckbox
      hooks/             self hooks if any (mode-specific glue)
      schema.ts          zod schema per mode
      config.ts          per-mode meta: which fields, which providers, copy keys, redirect
      types.ts           AuthMode + form types
      index.ts           exports the single <Auth> component

- **`<Auth mode={…} />`** is the only public export. `mode ∈ login | register |
  recover | reset | confirm`. The component reads `config.ts` for the mode
  (fields shown, providers, title/cta keys) and renders the right form via
  `react-hook-form` + the mode's zod schema, calling `use-auth`.
- **Configurable via props + meta**, overridable at the use-site (enabled
  providers, default affiliate code from a referral link).
- Pages pass the mode; the feature owns everything else.

### Pages (sterile — compose the feature)

Each route mounts `<Auth>` with its mode and nothing else (no markup in pages):

- `/[locale]/login` → `<Auth mode="login" />`
- `/[locale]/register` → `<Auth mode="register" />`
- `/[locale]/recover` → `<Auth mode="recover" />`
- `/[locale]/reset` → `<Auth mode="reset" />` (reads token/code from params)
- `/[locale]/confirm` → `<Auth mode="confirm" />` (reads channel/code params)

### Error handling (per `../guides/errors.md`)

- `422 validation_failed` → map `error.fields` onto the form inputs (never a
  toast); messages localized under `auth.*`.
- `401 unauthenticated` (bad credentials) → inline form error, one clear
  sentence, not a stack/code. (The transport's refresh path is for expired
  tokens on authenticated calls, not for a failed login.)
- `429 rate_limited` → one calm "slow down" toast with the retry delay;
  `client.ts` owns the backoff.
- `5xx` / network → retryable error state or toast with retry.
- Every message: what failed + what to do next; no codes, no jargon.

### States

loading (submit pending → button busy, inputs locked) · empty (n/a — forms) ·
error (inline field + form-level per above) · no-permission (n/a — public).

### Design notes (per `client.md` — this is the product's face)

- Non-flat auth card with real depth — use the elevation tokens
  (`shadow-lg`/`shadow-xl`), a generous radius (`rounded-2xl`/`rounded-3xl`),
  and the `bg-surface` sheen; not a bare boxed form.
- Entrance animation; per-field focus states (`shadow-focus`); buttons with
  designed hover/active/busy; social buttons crisp and consistent (2D brand
  icons).
- Strong type hierarchy, clear labels, visible validation; OTP input is a
  polished segmented control.
- Full light/dark and LTR/RTL parity; reduced-motion respected.
- Run **multiple design-critique passes** before delivery — do not ship the
  first render.

### Out of scope (future tasks)

Real backend wiring beyond consuming the standard endpoints; remember-me /
device management; captcha; password-strength meter UI (unless trivial via
existing tokens); the edge `auth.ts` redirect guard (it depends on the open
edge session-signal decision flagged in `../guides/auth.md` — guests/private
redirects are deferred and do not block this surface).

### Acceptance

- No `fetch` and no URL/path string outside `src/api`; all calls via
  `resource()` entries; paths version-free (`/auth/...`, never `/v1/...`).
- One `<Auth>` component drives all five modes; five sterile pages compose it
  with only a `mode` (+ params).
- `react-hook-form` + zod per mode; the conventional field set present;
  `confirm-password` / `agree-to-terms` enforced.
- Access token held in memory only (`src/lib/auth/token.ts`), rehydrated via
  the httpOnly refresh cookie; nothing in `localStorage`/`sessionStorage`;
  permissions read from `api.permissions` (no second source introduced).
- Errors handled exactly per `errors.md` (422 on fields, others as specified).
- All copy localized in all four locale files; logical properties throughout.
- Design bar met with multiple passes; `pnpm lint` · `typecheck` · `build` all
  green; report includes the pass count and the `[OPERATOR INPUT]` defaults
  left unverified.

---

## Storefront Home · Status: DONE

> Public storefront landing. Build the actual customer-facing home surface,
> not a marketing placeholder. The page should make the tenant feel active,
> trustworthy, and ready to sell or book across products, services, tours,
> hotels, tickets, and real-estate listings. No backend dependency is required
> for this first home pass; use curated, typed local content that can later be
> replaced by API-backed rails.

- **Goal:** A visitor can understand what Zain Lak offers, browse featured
  collections, see representative product/service/listing rails, and find trust
  and support cues from the public home page.

### Progress

- [x] Add `home.*` locale namespace for the storefront sections in all four locale files.
- [x] Add local typed home content/config at the feature layer.
- [x] Build the Storefront Home feature with hero, collection rails, featured cards, trust strip, and footer handoff.
- [x] Compose the feature from `/[locale]` with a sterile page.
- [x] Run design critique passes for desktop/mobile and LTR/RTL.
- [x] Run gates: check, typecheck, tests if added, and webpack build.
- [x] Final report and set Storefront Home status to `DONE`.

### Final Report

- Built the customer-facing Storefront Home as a real feature, replacing the old placeholder experience.
- Added localized storefront copy for English, Arabic, French, and German.
- Added typed local content/config for hero, collections, product rails, trust cues, support handoff, and footer CTA.
- Implemented the feature under `src/features/home/**` with one public `<Home />` export and presentational local components.
- Composed `/[locale]` from `src/app/[locale]/page.tsx` with the single `<Home />` feature component.
- Verified LTR/RTL route anchors for `discover`, `catalog`, `bookings`, `deals`, and `support`.
- Ran gates successfully: `pnpm check`, `pnpm typecheck`, `pnpm test`, and `next build --webpack`.
- Remaining note: local Node is `v22.12.0` while the project engine requests `>=24`; this currently warns but does not block checks or build.

### Content Model

Create a local config owned by the feature. It should include:

- Hero copy keys, primary and secondary CTA hrefs.
- Featured collections with category/type labels.
- Product rails covering at least: physical product, digital product, service, tour/ticket, hotel, real-estate.
- Trust stats and short assurance items.
- Support/AI discovery handoff copy.

### Layer Placement

| layer | what to add | path |
|---|---|---|
| `features/home` | the one Storefront Home feature; exports one `<Home />` component | `src/features/home/**` |
| `app/[locale]` | sterile page composing `<Home />` only | `src/app/[locale]/page.tsx` |
| `messages` | `home.*` storefront copy in all locale files | `messages/{en,ar,fr,de}.json` |
| `tests` | pure config/content tests only if useful | `tests/features/home/**` |

### Feature Anatomy

    features/home/
      components/        hero, collection rail, product card, trust strip, footer handoff
      config.ts          typed local content and section order
      types.ts           product/listing/section types
      index.tsx          exports the single <Home> component

- **`<Home />`** is the only public export.
- Components remain presentational and local to the feature.
- No API calls in this pass.
- No page markup in `app/[locale]/page.tsx`.

### Design Notes

- Use the existing brand direction: teal primary on warm-neutral surfaces, with restrained accent moments.
- First viewport must clearly say `Zain Lak` and show the storefront value immediately.
- Do not use a generic landing hero. Build a usable storefront home with visible rails and cards.
- Use real depth: `bg-surface`, layered shadows, soft borders, strong radius, and polished hover states.
- Cards should adapt by product type, but stay one cohesive visual family.
- Use logical direction utilities throughout and verify Arabic layout.
- Use visual assets or rich product-card media treatments; avoid a flat text-only page.
- Run at least three design critique passes before marking complete.

### Out Of Scope

- Live backend data fetching.
- Cart, checkout, booking, product detail, catalog filters, wallet, support chat, or command search.
- Writing a full task block for any other backlog item.

### Acceptance

- `/[locale]` renders the new Storefront Home via one feature component.
- All visible copy is localized in all four locale files.
- No hardcoded user-facing strings in JSX.
- No `fetch(` or API calls are introduced.
- Layout works in LTR and RTL using logical utilities.
- The page has real storefront content: hero, featured collections, mixed product rails, trust cues, and support/AI handoff.
- Design bar met with documented critique pass count.
- Gates pass before setting this block to `DONE`.

---

## Catalog & Listing · Status: DONE

> Public browse surface for the storefront. Build a real catalog/listing
> experience that lets visitors scan, search, filter, and compare mixed
> product types without needing backend data in the first pass. Use typed local
> content owned by the feature, shaped so it can later be replaced by API-backed
> catalog endpoints.

- **Goal:** A visitor can browse a responsive catalog, search locally, filter
  by storefront type, switch sort intent, and open clear product/listing cards
  that cover physical products, digital products, services, tours/tickets,
  hotels, and real-estate listings.

### Progress

- [x] Add `catalog.*` locale namespace in all four locale files.
- [x] Add typed local catalog content/config at the feature layer.
- [x] Build pure filtering/sorting helpers with tests.
- [x] Build the Catalog feature with search, type tabs, sort control, responsive result grid, empty state, and mixed listing cards.
- [x] Compose the feature from `/[locale]/catalog` with a sterile page.
- [x] Wire home/header catalog links to the catalog route or keep anchors intentionally documented.
- [x] Run design critique passes for desktop/mobile and LTR/RTL.
- [x] Run gates: check, typecheck, tests, and webpack build.
- [x] Final report and set Catalog & Listing status to `DONE`.

### Final Report

- Built the public Catalog & Listing surface as one feature under `src/features/catalog/**`.
- Added `catalog.*` localized copy to English, Arabic, French, and German.
- Added typed local catalog content covering physical, digital, service, tour/ticket, hotel, and real-estate listing types.
- Added pure local filtering/sorting helpers and tests.
- Added `/[locale]/catalog` as a sterile route composing `<Catalog />` only.
- Wired the header Catalog link and home Catalog CTAs to `/catalog`.
- Design critique passes: 3, covering control density, mobile scanning, and LTR/RTL layout.
- Gates: `pnpm check`, `pnpm typecheck`, `pnpm test`, and `next build --webpack` passed.
- Remaining note: local Node is `v22.12.0` while the project engine requests `>=24`; this currently warns but does not block checks or build.

### Content Model

Create a local config owned by the feature. It should include:

- Search placeholder, section headings, empty-state copy, and result-count copy keys.
- Product type tabs covering: all, physical, digital, service, tour/ticket, hotel, real-estate.
- Sort options: featured, newest, price-low, price-high.
- Listing records with id, type, name key, description key, price key, location or delivery key, rating, badges, href, tone, and featured score.
- Filter metadata that can later map to URL query keys.

### URL & State

- Initial pass may filter local content client-side.
- Query keys are reserved now: `q`, `type`, `sort`.
- The default route is `/[locale]/catalog`.
- Default state: `q=""`, `type="all"`, `sort="featured"`.
- Keep URL updates shallow and readable once the feature is built.

### Layer Placement

| layer | what to add | path |
|---|---|---|
| `lib/catalog` | pure filter/sort helpers if logic becomes shared | `src/lib/catalog/**` |
| `features/catalog` | one Catalog feature; local components, config, types, and feature-private helpers | `src/features/catalog/**` |
| `app/[locale]` | sterile catalog route composing `<Catalog />` only | `src/app/[locale]/catalog/page.tsx` |
| `messages` | `catalog.*` copy in all locale files | `messages/{en,ar,fr,de}.json` |
| `tests` | pure helper/config tests | `tests/features/catalog/**` or `tests/lib/catalog/**` |

### Feature Anatomy

    features/catalog/
      components/        search bar, type tabs, sort control, listing card, result grid, empty state
      config.ts          typed local listing content and options
      filters.ts         feature-private pure filtering if not promoted to lib
      types.ts           listing, type, sort, filter-state types
      index.tsx          exports the single <Catalog> component

- **`<Catalog />`** is the only public export.
- Components remain presentational and local to the feature.
- No API calls in this pass.
- No page markup in `app/[locale]/catalog/page.tsx`.

### Design Notes

- This is an operational browse surface, not a marketing hero. Prioritize dense,
  scannable product information and efficient controls.
- Keep cards compact with stable dimensions, clear type badges, price/location
  cues, and polished hover/focus states.
- Use the existing teal primary and tokenized supporting tones; avoid a
  one-color catalog.
- Mobile uses stacked controls and a two-stage scan: search first, then tabs,
  then results.
- Desktop uses a restrained toolbar above the grid; no floating card inside a
  card.
- Use logical direction utilities and verify Arabic layout.
- Do not add checkout/cart behavior in this task.

### Out Of Scope

- Backend catalog endpoints.
- Product detail route.
- Cart, checkout, booking flow, wallet, favorites, or saved search.
- Advanced faceted filters, virtualized infinite scroll, or TanStack Virtual
  unless the first local result set grows enough to need it.

### Acceptance

- `/[locale]/catalog` renders the new Catalog feature via one feature component.
- All visible copy is localized in all four locale files.
- Local content covers all six required product/listing types.
- Search, type filter, and sort work on the local dataset.
- Empty state appears when filters match no results.
- No `fetch(` or API calls are introduced.
- Layout works in LTR and RTL using logical utilities.
- Gates pass before setting this block to `DONE`.

---

## Product Detail & Purchase/Booking · Status: DONE

> One adaptable detail surface for every storefront item type. Build the detail
> experience from typed local content first, with purchase/booking intent states
> but without checkout, payments, backend writes, or product-specific route
> forks. The surface must show how one product model can support physical,
> digital, service, tour/ticket, hotel, and real-estate details.

- **Goal:** A visitor can open a catalog item, understand its value, inspect
  type-specific details, choose a lightweight purchase or booking intent, and
  see the next action clearly without leaving the unified product-detail model.

### Progress

- [x] Add `product.*` locale namespace in all four locale files.
- [x] Add typed local product detail content/config at the feature layer.
- [x] Build pure detail resolution and option-state helpers with tests.
- [x] Build the Product Detail feature with media treatment, summary, type-specific facts, option picker, purchase/booking panel, trust cues, and related items.
- [x] Compose the feature from `/[locale]/catalog/[item]` with a sterile page.
- [x] Wire catalog cards to the detail route.
- [x] Run design critique passes for desktop/mobile and LTR/RTL.
- [x] Run gates: check, typecheck, tests, and webpack build.
- [x] Final report and set Product Detail & Purchase/Booking status to `DONE`.

### Final Report

- Built the adaptable Product Detail & Purchase/Booking surface as one feature under `src/features/product/**`.
- Added `product.*` localized copy to English, Arabic, French, and German.
- Added typed local product detail content covering physical, digital, service, tour/ticket, hotel, and real-estate item types.
- Added pure product resolution helpers and tests for slug lookup, related items, and default intent option.
- Built the detail feature with media treatment, summary, highlights, type-specific facts, option picker, purchase/booking intent panel, policies, trust cues, and related items.
- Added `/[locale]/catalog/[item]` as a sterile route composing `<Product />` only.
- Wired Catalog cards and related Product links to localized detail routes.
- Design critique passes: 3, covering route/i18n links, RTL logical classes, and responsive detail layout.
- Gates: `pnpm check`, `pnpm typecheck`, `pnpm test`, and `next build --webpack` passed.
- Remaining note: local Node is `v22.12.0` while the project engine requests `>=24`; this currently warns but does not block checks or build.

### Content Model

Create a local config owned by the feature. It should include:

- Product records keyed by slug matching catalog item ids.
- Shared detail fields: name, description, price, type, rating, media tone, badges, highlights, policies, trust cues, and related ids.
- Type-specific facts:
  - physical: delivery window, stock signal, warranty.
  - digital: access method, file type, license.
  - service: duration, availability, service area.
  - tour/ticket: departure, group size, pickup.
  - hotel: nights, room type, cancellation.
  - real-estate: location, bedrooms/area, lead capture note.
- Option groups for the intent panel: quantity or package where relevant, date/time where relevant, and contact intent for real estate.
- CTA copy keys that adapt by type: buy, download, book service, reserve tour, book stay, request details.

### URL & State

- Route shape: `/[locale]/catalog/[item]`.
- `item` maps to local detail config by slug.
- Unknown slug renders the existing not-found behavior.
- UI state is client-only and ephemeral for this pass.
- Checkout/cart/booking submission is out of scope; CTAs are non-submitting intent actions until the dedicated Cart/Checkout and booking tasks exist.

### Layer Placement

| layer | what to add | path |
|---|---|---|
| `features/product` | one Product Detail feature; local components, config, types, and feature-private helpers | `src/features/product/**` |
| `app/[locale]` | sterile detail route composing `<Product />` only | `src/app/[locale]/catalog/[item]/page.tsx` |
| `messages` | `product.*` copy in all locale files | `messages/{en,ar,fr,de}.json` |
| `tests` | pure helper/config tests | `tests/features/product/**` |

### Feature Anatomy

    features/product/
      components/        media, summary, facts, option panel, trust cues, related rail
      config.ts          typed local detail content and section order
      helpers.ts         product resolution and option defaults
      types.ts           detail, facts, option, type, and intent types
      index.tsx          exports the single <Product> component

- **`<Product item={...} />`** is the only public export.
- Components remain presentational and local to the feature.
- No API calls in this pass.
- No page markup in `app/[locale]/catalog/[item]/page.tsx`.

### Design Notes

- The detail surface should feel commerce-ready without pretending checkout is complete.
- Desktop: two-column detail layout with media/facts and sticky-feeling action panel using normal layout, not fixed positioning.
- Mobile: media, summary, type facts, then action panel; no cramped split layout.
- Type-specific facts must be scannable and visually distinct from generic description.
- Keep product cards and related items cohesive with Catalog while making detail feel deeper and more premium.
- Use logical direction utilities and verify Arabic layout.
- Do not add a cart store, payment flow, or backend mutation in this task.

### Out Of Scope

- Live product endpoint.
- Cart store, checkout, payment, order creation, booking submission, saved favorites, or wallet payment.
- Reviews, Q&A, vendor profile, availability calendar engine, map embeds, or image upload.
- Separate pages per product type.

### Acceptance

- `/[locale]/catalog/[item]` renders the new Product Detail feature via one feature component.
- Catalog cards navigate to detail routes.
- All visible copy is localized in all four locale files.
- Local detail content covers all six required product/listing types.
- Unknown item slugs use not-found behavior.
- Type-specific facts and CTAs adapt by product type.
- No `fetch(` or API calls are introduced.
- Layout works in LTR and RTL using logical utilities.
- Gates pass before setting this block to `DONE`.

---

## Cart & Checkout · Status: DONE

> Ephemeral cart and checkout intent flow for the public storefront. Build a
> client-side cart experience that can collect mixed item types and guide the
> visitor through review, customer details, delivery/booking notes, payment
> hand-off placeholder, and confirmation. This pass must not create real orders
> or call payment/backend endpoints.

- **Goal:** A visitor can add or review intended product/service/booking items,
  adjust quantities/options, enter lightweight checkout details, see totals and
  next-step states, and land on a clear confirmation screen using local state.

### Progress

- [x] Add `cart.*` locale namespace in all four locale files.
- [x] Add ephemeral cart store with typed cart item model and pure total helpers with tests.
- [x] Wire Product Detail intent CTA to add/update cart state without backend calls.
- [x] Build Cart feature with item review, quantity controls, summary, empty state, and checkout entry.
- [x] Build Checkout feature with contact details, fulfillment notes, payment hand-off placeholder, and confirmation state.
- [x] Compose sterile pages for `/[locale]/cart` and `/[locale]/checkout`.
- [x] Add cart entry points in header/sheet and product intent panel.
- [x] Run design critique passes for desktop/mobile and LTR/RTL.
- [x] Run gates: check, typecheck, tests, and webpack build.
- [x] Final report and set Cart & Checkout status to `DONE`.

### Final Report

- Built the Cart & Checkout flow as local, client-only storefront intent surfaces.
- Added `cart.*` localized copy to English, Arabic, French, and German.
- Added an ephemeral typed cart store with add, update, remove, clear, and pure total helpers.
- Promoted reusable cart total helpers to `src/lib/cart/totals.ts` and covered them with tests.
- Wired Product Detail CTA actions to add or update cart items and route to `/cart` without backend calls.
- Built the Cart feature with item review, quantity controls, removal, summary totals, empty state, and checkout entry.
- Built the Checkout feature with contact fields, fulfillment notes, payment hand-off placeholder, local validation, and confirmation state.
- Added sterile localized routes for `/[locale]/cart` and `/[locale]/checkout`.
- Added cart entry points to the desktop header and mobile sheet with item count badges.
- Improved related UI found during this pass: localized selected values in catalog/product selects, shadcn-style product date picker with past dates disabled, and a polished home collections grid replacing the raw horizontal scrollbar.
- Design critique passes: desktop EN cart/checkout and mobile AR cart/checkout were captured with Edge headless; a checkout select localization issue was found and fixed.
- Gates passed: `biome check .`, `tsc --noEmit`, `vitest run` (8 files, 22 tests), and `next build --webpack`.
- Remaining note: local Node is `v22.12.0` while the project engine requests `>=24`; this currently warns but does not block checks or build.

### Content Model

Create local UI state and helper models for this pass:

- Cart item fields: id, product slug, type, name key, price key, numeric price, quantity, selected option key, selected date, tone, and metadata key.
- Totals: subtotal, estimated fees placeholder, grand total.
- Checkout fields: name, email, phone, notes, fulfillment preference, and payment method placeholder.
- Confirmation state: local confirmation id and summary copy.

### Behavior & Flow

- Cart state is ephemeral and client-only for this pass.
- Product Detail CTA adds or updates the selected item in the cart and can route to `/cart`.
- Cart page supports quantity changes and item removal.
- Empty cart page offers a return-to-catalog action.
- Checkout validates required contact fields locally and transitions to confirmation UI.
- Payment hand-off is a clearly labeled placeholder; no external payment request occurs.
- No order is created and no booking is submitted in this task.

### Layer Placement

| layer | what to add | path |
|---|---|---|
| `stores` | ephemeral cart store | `src/stores/cart.ts` |
| `features/cart` | cart review feature; components, helpers, types | `src/features/cart/**` |
| `features/checkout` | checkout flow feature; components, schema/helpers, types | `src/features/checkout/**` |
| `app/[locale]` | sterile cart and checkout routes | `src/app/[locale]/cart/page.tsx`, `src/app/[locale]/checkout/page.tsx` |
| `messages` | `cart.*` checkout/cart copy in all locale files | `messages/{en,ar,fr,de}.json` |
| `tests` | pure cart total/store helper tests | `tests/features/cart/**` or `tests/stores/**` |

### Design Notes

- Cart and checkout are operational flows; prioritize clarity, confidence, and dense but calm information.
- Cart desktop layout uses item list plus summary panel; mobile stacks summary after items.
- Checkout should feel like a real flow while making the payment placeholder honest and visible.
- Use crisp iconography, strong focus states, and stable controls for quantity and payment selection.
- Use logical direction utilities and verify Arabic layout.
- Do not add backend, payment SDK, order history, wallet payment, coupons, or saved addresses in this task.

### Out Of Scope

- Backend order creation.
- Payment gateway integration.
- Booking inventory validation.
- Coupons, wallet payment, saved addresses, invoices, refunds, order tracking, or account order history.
- Persistent cart across reloads.

### Acceptance

- `/[locale]/cart` and `/[locale]/checkout` render via sterile pages.
- Product detail intent CTA can add an item to the local cart.
- Cart supports quantity update, removal, summary totals, and empty state.
- Checkout validates local required fields and shows confirmation state.
- All visible copy is localized in all four locale files.
- No `fetch(`, backend order call, or payment SDK is introduced.
- Layout works in LTR and RTL using logical utilities.
- Gates pass before setting this block to `DONE`.

---

## Account & Wallet · Status: DONE

> Customer self-service area for the public storefront. Build the client-facing
> account surface that lets a signed-in visitor review profile details, order
> and booking history, wallet balances, coupon/reward state, and referral
> progress. This pass consumes standard API-shaped data through the registry;
> it must not invent local persisted account state or place server data in a
> store.

- **Goal:** A customer can open one polished account area, understand their
  identity and activity at a glance, review recent orders/bookings, inspect
  wallet balances and transactions, see coupons/rewards/referrals, and reach
  the right empty/error states without backend-specific UI leakage.

### Progress

- [x] Add `account.*` locale namespace in all four locale files.
- [x] Add typed API registry resources for account profile, orders, bookings, wallet, transactions, coupons, and referrals.
- [x] Add account query hooks over the registry with typed schemas and no feature-level `fetch`.
- [x] Build pure account formatting/status helpers with tests.
- [x] Build Account feature with overview, profile card, activity panels, wallet summary, coupons, referrals, skeletons, empty states, and retryable error states.
- [x] Compose sterile pages for `/[locale]/account`, `/[locale]/account/orders`, `/[locale]/account/wallet`, and `/[locale]/account/referrals`.
- [x] Wire account entry points in desktop header and mobile sheet to the account route.
- [x] Run design critique passes for desktop/mobile and LTR/RTL.
- [x] Run gates: check, typecheck, tests, and webpack build.
- [x] Final report and set Account & Wallet status to `DONE`.

### Final Report

- Built the client-facing Account & Wallet surface as one feature under `src/features/account/**`.
- Added typed account API schemas and registry entries for profile, orders, bookings, wallet, transactions, coupons, and referrals.
- Added TanStack Query hooks over the account registry resources with no feature-level `fetch`.
- Added pure account summary/status helpers and tests.
- Added localized `account.*` copy for English, Arabic, French, and German.
- Added sterile account routes for `/[locale]/account`, `/[locale]/account/orders`, `/[locale]/account/wallet`, and `/[locale]/account/referrals`.
- Wired desktop header and mobile sheet account entry points to `/account`.
- Design critique passes covered desktop and mobile in LTR/RTL; mobile account tabs were tightened into a stable two-column layout and horizontal overflow was verified at 390px and 1440px.
- Gates passed: `biome check .`, `tsc --noEmit`, `vitest run` (9 files, 27 tests), and `next build --webpack`.
- Remaining note: `biome check .` reports one info-level existing redundant fragment in `docs/product/index.tsx`; it does not fail the gate and is outside this task.
- Environment note: local Node is `v22.12.0` while the project engine requests `>=24`; this currently does not block checks or build.

### Operator Defaults

- Post-login account route defaults to `/account`.
- Order and booking history are shown together on the account overview, with a dedicated `/account/orders` detail surface.
- Wallet currency defaults to the API payload currency; local fallback copy uses USD only for mock-like empty placeholders if needed.
- Rewards and referrals are read-only in this task; claim, withdraw, payout, and coupon redemption mutations are deferred.
- If the backend is not running locally, build against typed registry contracts and designed query states; do not replace API hooks with local fake stores.

### Endpoints (standard — treat as live)

Base: `NEXT_PUBLIC_API_URL` (ends with `/v1`) + version-free paths below.
All entries are authenticated Bearer requests and must be registered in
`src/api/registry.ts`.

| entry | method | path | need |
|---|---|---|---|
| `api.account.profile` | GET | `/account/profile` | `account.show` |
| `api.account.updateProfile` | PATCH | `/account/profile` | `account.update` |
| `api.account.orders` | GET | `/account/orders` | `orders.list` |
| `api.account.order` | GET | `/account/orders/:id` | `orders.show` |
| `api.account.bookings` | GET | `/account/bookings` | `bookings.list` |
| `api.account.wallet` | GET | `/account/wallet` | `wallet.show` |
| `api.account.transactions` | GET | `/account/wallet/transactions` | `wallet.transactions.list` |
| `api.account.coupons` | GET | `/account/coupons` | `coupons.list` |
| `api.account.referrals` | GET | `/account/referrals` | `referrals.show` |

### Content Model

Define response schemas and feature types for:

- Profile: id, name, email, phone, avatar URL, account status, joined date.
- Activity summary: total orders, active bookings, completed bookings, saved coupons, open support count if present.
- Order/booking item: id, code, title, type, status, date, total, currency, and href.
- Wallet: pending balance, withdrawable balance, total earned, currency, and last updated timestamp.
- Transaction: id, type, amount, currency, status, date, and description.
- Coupon: code, label, discount description, status, expiry date.
- Referral: referral code/link, invited count, conversion count, points, level/progress.
- UI states: loading skeletons, empty copy, retryable error copy, and no-permission copy.

### Behavior & Flow

- Account pages are authenticated customer surfaces. Guests are redirected by the existing auth/session behavior when available; otherwise show the existing login path.
- Account overview reads all top-level query hooks and renders partial data when one secondary panel fails.
- Profile update is limited to name, phone, and optional avatar hand-off if the endpoint exists; password/security management is out of scope.
- Orders and bookings are read-only history in this pass.
- Wallet shows balances and transactions only; withdrawals, payouts, and payment methods are out of scope.
- Coupons and referrals are read-only discovery/summary panels; redemption and reward claims are out of scope.
- Query errors render designed retryable states. `422` maps to fields only on profile update; `401` follows auth behavior; `403` renders permission-denied state.
- No server data is stored in Zustand. URL carries page-level tabs/search if introduced.

### Layer Placement

| layer | what to add | path |
|---|---|---|
| `api` | explicit account extras and schemas | `src/api/account.ts`, `src/api/registry.ts` |
| `hooks` | account query/mutation hooks over TanStack Query | `src/hooks/use-account.ts` |
| `lib/account` | pure status, currency, progress, and summary helpers | `src/lib/account/**` |
| `features/account` | one Account feature; local components, config, types | `src/features/account/**` |
| `app/[locale]` | sterile account routes | `src/app/[locale]/account/**/page.tsx` |
| `messages` | `account.*` account/wallet copy in all locale files | `messages/{en,ar,fr,de}.json` |
| `tests` | pure helper tests and hook contract tests if practical | `tests/lib/account/**`, `tests/features/account/**` |

### Feature Anatomy

    features/account/
      components/        shell, profile, activity, wallet, orders, coupons, referrals, states
      config.ts          tabs, route segments, status tone maps
      types.ts           UI model types derived from hook payloads
      index.tsx          exports the single <Account> component

- **`<Account view={...} />`** is the only public export.
- `view ? overview | orders | wallet | referrals`.
- Components remain presentational and local to the feature.
- Data enters through hooks; raw API calls never appear in the feature.
- Pages pass only the view; page files remain sterile.

### Design Notes

- Account is an operational self-service surface, not a marketing page.
- Use dense but calm dashboards: clear balance hierarchy, compact activity rows, and low-noise cards.
- Wallet values need strong numeric hierarchy and status color restraint.
- Mobile stacks panels in priority order: profile, wallet, activity, coupons/referrals.
- Desktop uses a two-column dashboard with a persistent account navigation rail or tab row inside the feature.
- Use crisp icons, designed loading skeletons, and retry actions; avoid blank panels.
- Use logical direction utilities and verify Arabic layout.
- Do not add dark-pattern reward visuals, casino-like points treatment, or fake financial actions.

### Out Of Scope

- Withdrawal/payout creation.
- Saved payment methods.
- Full order detail timeline, invoices, refunds, disputes, or delivery tracking.
- Password/security settings.
- Coupon redemption at checkout.
- Referral payout claims or affiliate dashboards.
- Admin/vendor/delivery account management.

### Acceptance

- `/[locale]/account`, `/[locale]/account/orders`, `/[locale]/account/wallet`, and `/[locale]/account/referrals` render via sterile pages.
- All visible copy is localized in all four locale files.
- API registry entries and hooks own all server communication.
- No `fetch(` appears outside `src/api/client.ts`.
- No account, wallet, order, coupon, or referral server data is stored in Zustand.
- Loading, empty, error, and no-permission states are designed and localized.
- Profile update maps validation errors to fields if implemented.
- Layout works in LTR and RTL using logical utilities.
- Gates pass before setting this block to `DONE`.

---

## Backlog (stubs — intent only, NOT READY)

Each gets a full block, specced to READY, before it is built. Do not build from
these one-liners. Order is indicative, not committed.

- **Search & Command · BACKLOG** — cmdk command palette + global search.
- **Support & AI · BACKLOG** — live chat, tickets, AI-assisted discovery.

> When picking up a backlog item: write its block (goal, endpoints, fields,
> flows, layer placement, errors, states, design notes, acceptance), resolve
> any `[OPERATOR INPUT]`, set Status to READY, then build.



