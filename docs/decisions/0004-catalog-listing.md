# 0004 — Catalog Listing

- **Session:** Catalog & Listing
- **Date:** 2026-06-16

---

### 1. Catalog first pass uses typed local content

- **Date:** 2026-06-16
- **Decision:** The first Catalog & Listing surface is backed by typed local content in `src/features/catalog/config.ts`, with client-side search, type filtering, and sorting. The public route is `/[locale]/catalog`, composed from one `<Catalog />` feature.
- **Why:** The product task explicitly excludes backend catalog endpoints for this pass while requiring a real browse surface. Local typed content lets the UI, filters, i18n, and layout ship now while preserving a shape that can later map to API-backed rails.
- **Alternatives rejected:**
  - **Backend registry entries now** — rejected because catalog endpoints are out of scope for this task.
  - **Static text-only catalog** — rejected because the task requires working search, filters, sort, mixed listing cards, and an empty state.
  - **Product-detail routes now** — rejected because product detail and purchase/booking are a separate backlog item.
