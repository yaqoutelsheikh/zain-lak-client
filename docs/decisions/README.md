# Decision Log â€” the project's WHY âš ï¸ required reading

**`docs/decisions/` is critical.** It is the WHY behind every locked
architectural call in this repo. **Read it before you try to understand or
modify the project**, and never reopen a settled decision without reading the
file that set it â€” doing so is a process violation. The constitution
(`../../AGENTS.md` + `../guides/`) is the WHAT and the HOW; this log is the WHY.

## Model â€” one file per session

Each file collects ALL decisions made during one working session, ordered, each
as its own `###` subsection. Files are **immutable** once written: a later
session supersedes an earlier decision by **restating it** with the new date and
reasoning â€” never edit a past session file's decisions.

## Index

| File | Session Â· date | Decisions it contains |
|---|---|---|
| [0001-project-bootstrap.md](0001-project-bootstrap.md) | Bootstrap Â· 2026-06-13 | web auth (Sanctum Bearer + in-memory token + httpOnly refresh cookie); `/v1` in base URL; permissions = `/auth/permissions`; resource vocab `storeÂ·listÂ·showÂ·updateÂ·destroy`; `queryKey`/`ApiResult` transport contract; `Can.Cannot` gate API; `src/i18n` path; create-down for missing `lib` modules; design-token scale in `globals.css`; scaffold is non-binding; `.env` operator-owned; this one-file-per-session model |
| [0002-scaffold-cleanup-and-locale-expansion.md](0002-scaffold-cleanup-and-locale-expansion.md) | Scaffold cleanup + locales Â· 2026-06-13 | supported locales = enÂ·arÂ·frÂ·de; scaffold reduced to a single Hello World page |
| [0003-visual-identity.md](0003-visual-identity.md) | Visual identity Â· 2026-06-13 | gold primary + gold-coordinated dark theme, both themes first-class, token-driven; Hello World redesigned as the design-bar showcase |
| [0004-catalog-listing.md](0004-catalog-listing.md) | Catalog listing · 2026-06-16 | first catalog pass uses typed local content, client-side search/filter/sort, and a sterile `/[locale]/catalog` route |

## How to record decisions

After any major feature, or any significant / irreversible decision:

1. Append a `###` subsection to the **current session's file** â€” or start a new
   session file (`NNNN-kebab-title.md`, next number) if this is a new session.
2. Each decision: `### Title` Â· **Date** Â· **Decision** Â· **Why** Â·
   **Alternatives rejected** (when there were real ones).
3. **Update the index table above in the same change.**
4. Never edit a past decision â€” supersede it by restating it in a newer file
   with the new date and reasoning.

