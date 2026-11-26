# Revenue Content And SEO Strategy Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Align the Pyme360 content funnel with the approved Home4Escape revenue-management CTA, document the keyword strategy, and strengthen the next SEO/content actions without presenting revenue management as a Pyme360 service.

**Architecture:** Pyme360 remains the editorial and discovery layer. Revenue-management articles link to the verified Home4Escape contact form with article-specific UTM parameters, while Pyme360 keeps its own rural diagnostic as a secondary CTA. Root and `public/` copies remain byte-identical. New keyword and service-page work is documented as an evidence-based backlog and is now annotated with local plus broader Keyword Planner checks.

**Tech Stack:** Static HTML, Markdown, JSON-LD, Node.js `node:assert`, PowerShell verification, existing root/public mirror workflow.

---

### Task 1: Add the revenue CTA regression contract

**Files:**
- Create: `tests/revenue-cta.test.cjs`

- [x] **Step 1: Write the failing test**

Assert that R01, R04 and R05 have the exact Home4Escape contact URL with article-specific UTM content, the approved CTA copy, the Pyme360 diagnostic CTA, root/public parity, and no Pyme360 revenue service schema.

- [x] **Step 2: Run the test and verify it fails**

Run: `node tests/revenue-cta.test.cjs` from `C:\Antigravity\pyme360-growth`.

Expected: FAIL because the current articles link to `https://home4escape.com` without the contact form and still use the Pyme360-only closing CTA.

### Task 2: Implement the approved revenue CTA in existing articles

**Files:**
- Modify: `blog/la-falacia-del-85-por-ciento-ocupacion/index.html`
- Modify: `blog/trampa-bajar-precios-temporada-baja/index.html`
- Modify: `blog/control-costes-hotel-rural/index.html`
- Modify: the matching files under `public/blog/`

- [x] **Step 1: Use the approved CTA and tracking contract**

Use `https://www.home4escape.com/contactar/?utm_source=pyme360&utm_medium=referral&utm_campaign=revenue_content&utm_content=<slug>` and the copy:

`¿Quieres revisar tus precios, temporadas y rentabilidad? Contacta con Home4Escape, el equipo especializado en estrategia comercial y revenue management para alojamientos.`

- [x] **Step 2: Keep Pyme360 as the secondary diagnostic path**

Keep the rural diagnostic link in the same CTA area with a secondary label; do not add a Pyme360 `Service` or `Offer` for revenue management.

- [x] **Step 3: Run the focused test**

Run: `node tests/revenue-cta.test.cjs`.

Expected: PASS.

### Task 3: Update editorial and operational documentation

**Files:**
- Modify: `articulos/PLAN-EDITORIAL-BLOG.md`
- Modify: `checklist.md` in the blog brief and change log

- [x] **Step 1: Record the verified form URL and CTA rule**

Update the revenue decision so R01, R04 and R05 use the Home4Escape contact form, with the approved CTA, article-specific UTM content, and the Pyme360 diagnostic as secondary CTA.

- [x] **Step 2: Record the Booking/Airbnb follow-up**

Mark O2-21 as the next eligible rural article for the same CTA only if its final content contains a revenue/pricing angle. Do not publish it without the existing NotebookLM review gate.

- [x] **Step 3: Run documentation consistency checks**

Search for stale wording that says the CTA must point only to the generic Home4Escape homepage or that revenue is a Pyme360 service.

### Task 4: Create the evidence-based keyword and URL map

**Files:**
- Create: `articulos/keyword-map-2026-11-26.md`

- [x] **Step 1: Map the attached study's keywords to current and missing URLs**

Include keyword, intent, funnel stage, current URL, recommended URL, CTA owner, status, and evidence source. Use `Pendiente de datos` for exact volume/KD when Search Console or Keyword Planner data is unavailable.

- [x] **Step 2: Separate completed work from the backlog**

Record existing `/seo-local/`, `/alojamientos-rurales/`, `/precios.html`, the 12 blog URLs, Schema, FAQ and `llms.txt` as implemented. Record missing service pages and content clusters as backlog.

### Task 5: Prepare the next content and service-page backlog

**Files:**
- Create: `articulos/briefs/` Markdown briefs for the next approved articles
- Create: `docs/seo-service-page-backlog.md`

- [x] **Step 1: Prepare briefs without publishing unreviewed articles**

Create briefs for Google Business Profile, Google Maps calls, direct bookings without Booking, motor versus channel manager, Google Vacation Rentals, and WhatsApp lead follow-up. Each brief must include search intent, proposed title, internal links, evidence requirements, and CTA.

- [x] **Step 2: Define service-page backlog**

Document the proposed design-web, advertising, social-content and brand-message pages, their target queries, required proof, and current fallback URL. Do not invent case studies or performance claims.

### Task 6: Verify technical SEO and local parity

**Files:**
- Verify: `sitemap.xml`, `public/sitemap.xml`, `llms.txt`, `public/llms.txt`
- Verify: all modified blog files and their `public/` mirrors

- [x] **Step 1: Run focused tests**

Run: `node tests/revenue-cta.test.cjs`, `node tests/blog.test.cjs`, `node tests/blog-articles.test.cjs`, and `node tests/seo-local.test.cjs`.

- [x] **Step 2: Run byte-parity verification**

Compare every modified source file with its `public/` mirror and fail on any difference.

- [x] **Step 3: Inspect the working tree**

Confirm that only the intended content, documentation and test files changed; preserve the existing unrelated `seo-local`, asset, `intur`, `marca-nomadas-jungle` and `scratch` changes.

### Task 7: External evidence and release gate

**Files:**
- Updated: `articulos/keyword-map-2026-11-26.md`

- [x] **Step 1: Validate exact and generic keyword demand**

Keyword Planner was checked on 2026-11-26 for Spanish queries in Santa Cruz de Tenerife province, Canarias and España. The initial local map returned 0–10 average monthly searches for its exact queries; a five-keyword expansion lot returned the same 0–10 interval in both Canarias and España. A broader generic batch surfaced 10–100 searches/month in Canarias and 100–1,000 in España for `marketing digital para pymes`, `SEO local`, `revenue management hoteles`, `motor de reservas` and `channel manager hoteles`. Public-campaign metrics were unavailable. Search Console for Home4Escape was also checked for 25/08/2026–24/11/2026: 156 clicks, 29.6k impressions, 0.5% CTR and average position 33.5; its top queries are currently dominated by Abades/Tenerife and should not be treated as revenue-management demand.

- [x] **Step 2: Review the local changes with José**

José autorizó la publicación del lote después de la verificación local. No se modificaron los formularios externos de Home4Escape.

- [ ] **Step 3: Run the O2-21 NotebookLM review**

- [x] The browser session opened the existing notebook `Validación de Mercados y Estrategias de Precios`, uploaded `articulos/borradores/2026-11-26-o2-21-booking-airbnb-turismo-rural.md`, and completed the editorial/factual review.
- [x] The review confirmed the neutral comparison, the Home4Escape/Pyme360 ownership boundary and the non-extrapolation of E3. Three safe wording changes were incorporated and recorded in `docs/superpowers/reviews/2026-11-26-o2-21-notebooklm-review.md`.
- [x] Resolve the general fiscal, data-protection and platform-terms checks with dated/official evidence and retain a case-specific professional-verification notice in the article.
- [x] José aprobó la publicación; los commits `883acd1` y `1b0b223` se subieron a `origin/main` y las cuatro URLs públicas fueron verificadas.
