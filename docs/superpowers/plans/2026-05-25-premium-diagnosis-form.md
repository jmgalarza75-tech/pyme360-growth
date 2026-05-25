# Premium Diagnosis Form Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Restyle the public diagnosis form to match the stronger dark card treatment from `propuesta.html` while preserving the existing lead submission flow.

**Architecture:** Keep the public form fields and JavaScript payload unchanged so existing tests and Supabase integration still apply. Update `index.html` and `public/index.html` with light structural wrappers for field icons/help text, and update both CSS copies with the premium card, input, focus, CTA, and note styling.

**Tech Stack:** Static HTML, CSS, vanilla JavaScript, Node-based tests.

---

### Task 1: Regression Test

**Files:**
- Create: `tests/premium-form.test.cjs`

- [ ] Write a failing test that checks root and public HTML contain the premium form hooks.
- [ ] Check both CSS files contain premium card/input/focus/CTA rules.
- [ ] Run `node tests\premium-form.test.cjs` and confirm it fails before implementation.

### Task 2: Markup And CSS

**Files:**
- Modify: `index.html`
- Modify: `public/index.html`
- Modify: `assets/pyme360-public.css`
- Modify: `public/assets/pyme360-public.css`

- [ ] Add premium form classes/wrappers without changing input `name` attributes.
- [ ] Add select choices for sector using the existing `name="sector"`.
- [ ] Restyle `.lead-form`, labels, controls, CTA, and note to match `propuesta.html`.
- [ ] Bump CSS/JS asset query string to avoid Hostinger cache.

### Task 3: Verify And Upload

**Files:**
- Existing tests only.

- [ ] Run all public-site checks.
- [ ] Commit with a concise message.
- [ ] Push to `origin/main`.
