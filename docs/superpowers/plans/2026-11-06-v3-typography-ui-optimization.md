# V3 Typography UI Optimization Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Align V3's typography and page rhythm with V2's editorial quality while preserving the Fernhollow flower scene and V3's Manrope body voice.

**Architecture:** Add V2's local Cormorant Garamond, Inter, and JetBrains Mono font files to V3. Keep Manrope for body copy and navigation, use Cormorant for display and section headings, and use JetBrains Mono for metadata labels. Apply the new system through a focused CSS layer at the end of the existing stylesheet so current page structure and content remain stable.

**Tech Stack:** Static HTML, ES modules, CSS, local WOFF2/TTF fonts, existing `scripts/serve.cjs` preview server.

---

### Task 1: Add the approved V2 font assets

**Files:**
- Create: `assets/fonts/cormorant-garamond-400.woff2`
- Create: `assets/fonts/cormorant-garamond-500.woff2`
- Create: `assets/fonts/cormorant-garamond-600.woff2`
- Create: `assets/fonts/inter-400.woff2`
- Create: `assets/fonts/inter-500.woff2`
- Create: `assets/fonts/jetbrains-mono-400.woff2`

- [x] Copy the six local files from `D:\AI工作区\20-代码\20261106-个人站V2\assets\fonts` into the V3 font directory using lowercase stable names.
- [x] Verify every copied file exists and has a non-zero size.

### Task 2: Establish the hybrid typography system

**Files:**
- Modify: `src/styles.css`

- [x] Add `@font-face` declarations for Cormorant Garamond weights 400/500/600, Inter weights 400/500, and JetBrains Mono 400.
- [x] Add `--display-font`, `--ui-font`, and `--mono-font` tokens while keeping Manrope as the V3 body font.
- [x] Apply Cormorant to display titles, page headings, project headings, section headings, resume headings, and card titles with a Chinese serif fallback.
- [x] Apply JetBrains Mono to metadata, eyebrow labels, project numbers, filters, dates, and resource domains.
- [x] Reduce display title tracking and normalize body line-height to match V2's tighter editorial rhythm.

### Task 3: Tune layout rhythm around the new font metrics

**Files:**
- Modify: `src/styles.css`

- [x] Rebalance home title size and caption spacing so Cormorant does not crowd the flower scene.
- [x] Tighten page intro, case header, section heading, and card title spacing on desktop.
- [x] Add mobile overrides for title sizes, Chinese fallback line-height, card headings, and metadata so the new font does not create overflow.

### Task 4: Validate all routes and typography behavior

**Files:**
- Test: `src/styles.css`, `src/app.js`, `src/content.js`, `src/library.js`, `src/library-pages.js`

- [ ] Run `npm run check`.
- [ ] Open home, work, one project detail, about, resume, contact, writing, and toolkit routes at `http://127.0.0.1:4176/`.
- [ ] Confirm computed font families for a display heading, body paragraph, and eyebrow label.
- [ ] Confirm no horizontal overflow at desktop and mobile widths, and confirm filters and contact dialogs still respond.
- [ ] Run `git diff --check` and report any remaining visual limitation before completion.
