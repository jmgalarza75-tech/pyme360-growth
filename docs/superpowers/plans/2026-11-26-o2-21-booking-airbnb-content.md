# O2-21 Booking Airbnb Rural Content Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Prepare a source-aware O2-21 article draft that compares Booking and Airbnb for rural accommodation owners, explains dependency and margin review, and routes revenue-related conversion to Home4Escape without presenting revenue as a Pyme360 service.

**Architecture:** Keep the Markdown draft as the editorial source and create a local HTML mirror only after the NotebookLM review and official-source checks. Local maquetación is not publication: no commit, push, deployment or external form change is included.

**Tech Stack:** Markdown, existing Pyme360 editorial rules, PowerShell `rg` checks, existing CTA regression test for the already published revenue articles.

---

### Task 1: Expand the O2-21 production brief

**Files:**
- Modify: `articulos/briefs/2026-11-26-next-content-briefs.md` section 7

- [x] **Step 1: Add the approved editorial angle**

Extend section 7 with the working title `Booking o Airbnb en turismo rural: cómo comparar canales sin perder margen`, the reader problem, the six-section outline from the approved design, and the rule that the article must not recommend one OTA by default.

- [x] **Step 2: Add evidence requirements**

List the sources required before publication: current official Booking partner/commission documentation, current official Airbnb host-fee documentation, official direct-booking or channel-management documentation when referenced, and the existing Pyme360 study `articulos/estudios/E3-reserva-directa-alojamientos-rurales.md` as an internal evidence source with its sample limitations preserved.

- [x] **Step 3: Add publication gates**

Record that every current fee, contractual condition, legal statement or platform feature must be sourced and dated; do not publish universal figures; NotebookLM review and José's editorial approval are required before publication.

### Task 2: Write the Markdown article draft

**Files:**
- Create: `articulos/borradores/2026-11-26-o2-21-booking-airbnb-turismo-rural.md`

- [x] **Step 1: Write the opening and comparison framework**

Use the title from Task 1, explain that the issue is not being present on an OTA but failing to measure what each channel contributes, and compare channels through demand, margin, operational load, customer relationship and direct-booking capacity.

- [x] **Step 2: Write the margin-review section without invented figures**

Give the reader a calculation framework using price paid by the guest, discounts, platform fees, cleaning/turnover, payment costs, taxes and management time. Use `[DATO PENDIENTE: confirmar tratamiento exacto ...]` wherever a platform-specific current rule is needed. Do not state a generic commission percentage.

- [x] **Step 3: Write the dependency signals and action plan**

Include practical signals such as concentration of bookings in one channel, inability to identify repeat guests, lack of a direct-booking path, calendar gaps hidden by gross occupancy, and prices changed without reviewing net margin. End with a sequence: measure, compare, improve direct path, keep useful channels, review by season.

- [x] **Step 4: Add the two CTA paths**

Add the approved Home4Escape CTA only after the section about prices, channels and profitability, using:

`https://www.home4escape.com/contactar/?utm_source=pyme360&utm_medium=referral&utm_campaign=revenue_content&utm_content=o2-21-booking-airbnb-turismo-rural`

and the approved copy. Add the Pyme360 rural diagnostic as the secondary path. State clearly that revenue management is provided by Home4Escape, not Pyme360.

### Task 3: Run source and editorial checks

**Files:**
- Check: `articulos/borradores/2026-11-26-o2-21-booking-airbnb-turismo-rural.md`
- Check: `articulos/briefs/2026-11-26-next-content-briefs.md`
- Check: `articulos/estudios/E3-reserva-directa-alojamientos-rurales.md`

- [x] **Step 1: Check prohibited claims and stale CTA wording**

Run:

```powershell
rg -n -i "eliminar comisiones|garantiza|llena la temporada|más ocupación|comisión del [0-9]|servicio de Pyme360.*revenue|Home4Escape.*homepage" articulos/borradores/2026-11-26-o2-21-booking-airbnb-turismo-rural.md articulos/briefs/2026-11-26-next-content-briefs.md
```

Expected: no unsupported promise, hard-coded commission percentage or stale generic-homepage CTA.

- [x] **Step 2: Check source markers and CTA ownership**

Run:

```powershell
rg -n "DATO PENDIENTE|home4escape.com/contactar|revenue management|Pyme360|E3-reserva-directa" articulos/borradores/2026-11-26-o2-21-booking-airbnb-turismo-rural.md
```

Expected: the draft contains dated official links for platform facts, the exact Home4Escape form URL, the CTA ownership disclaimer, the professional-verification notice, and the internal E3 study reference.

- [x] **Step 3: Run the existing regression test**

Run: `node tests/revenue-cta.test.cjs`

Expected: `Revenue CTA contract passed for R01, R04 and R05`. This confirms that preparing O2-21 has not altered the already approved R01/R04/R05 contract.

### Task 4: Local maquetación without publication

**Files:**
- Create: `blog/booking-airbnb-turismo-rural/index.html`
- Create: `public/blog/booking-airbnb-turismo-rural/index.html`
- Modify: `blog/index.html`, `public/blog/index.html`, `sitemap.xml`, `public/sitemap.xml`, `llms.txt`, `public/llms.txt`, `tests/blog-articles.test.cjs`

- [x] **Step 1: Keep approval and publication gates explicit**

Keep the Markdown source and local HTML marked as pending editorial approval. Local HTML and index metadata are not a production publication.

- [x] **Step 2: Report the review handoff**

Hand José the draft path, the unresolved source markers, and the exact decision needed before maquetación: approve the factual source set and the final angle.

- [x] **Step 3: Record the NotebookLM review and safe wording changes**

The browser review confirmed the neutral angle, the Home4Escape/Pyme360 boundary and the E3 limitation. The report and three non-controversial wording changes are recorded in `docs/superpowers/reviews/2026-11-26-o2-21-notebooklm-review.md`. Official AEAT/AEPD evidence was checked; the article retains professional-verification language and publication remains gated on José's approval.
