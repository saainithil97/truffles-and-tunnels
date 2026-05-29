# Day 3 — Restructure (burn-and-rebuild)

**Date:** 2026-05-29
**Branch:** `day3-demystify-frontend`
**Status:** Draft — awaiting user review

## Problem

The current Day 3 arc has bloated from 12 → 19 demos. Part 3 (React/Next) alone has seven sub-beats (6, 6.2, 6.3, 6.5, 6.6, 6.7, 6.8). What was originally one part for rendering strategies has split into three (Parts 4 / 5 / 5.5). New additions (Demo 2.75 event loop, 189-line wrap segment with three mini-pattern demos) keep accumulating. The pedagogical spine — *the browser is a platform; React/Next exist because the platform is hard; here's how a modern frontend ships* — is buried under organizational fragmentation.

## Goal

Restructure Day 3 around a tighter four-part spine that the audience can hold in their head, plus a closing Part 5 for the cross-cutting concerns (perf, security, audit). Reduce from 19 demos to 15. Preserve every existing demo's *code* as reference (archived), but rebuild the curriculum content and on-site beats from the new outline.

## Non-goals

- Not changing the site shell (Next.js components, theme, routing, section deck, picture-in-picture iframe). Layout stays intact.
- Not changing the workshop's running example (Swiggy restaurant card).
- Not changing demo-running infrastructure (FastAPI static servers, the Next.js sub-app for Demos 7/8).
- Not introducing new running examples, tooling, or platforms.

## Final structure

### Part 1 — Browser as a platform

- **Demo 1 — Network.** The request lifecycle. One Swiggy card is six requests; Slow 3G + DevTools Network tab makes it visible.
- **Demo 2 — Rendering engine: DOM is not the HTML.** View Source vs Elements tab; mutate the DOM from the console while source stays frozen.
- **Demo 3 — Rendering engine: order matters.** Render-blocking JS/CSS; same page three ways (`<head>` blocking, `<head>` + `defer`, end-of-`<body>`).
- **Demo 2.5 — Storage.** Cookies (sent every request) vs localStorage / sessionStorage (browser-only).
- **Verbal — Other browser APIs.** Five-minute tour: `fetch`, `IntersectionObserver`, `ResizeObserver`, `history`, Web Workers, `requestAnimationFrame`. No demo — pointers only.

### Part 2 — Why do we need React (or other libraries)?

- **Demo 4 — Issues with pure HTML+CSS+JS: the DOM is expensive.** 500 restaurant tiles; per-element update loop (layout thrash) vs batched update, timed live.
- **Demo 5 — Issues with pure HTML+CSS+JS: imperative tangles.** Vanilla Swiggy search/filter that stays clean until the PM piles on features.
- **Demo 6 — What React solves for.** JSX → `createElement` → plain objects; the diff makes minimal real-DOM updates. Same Demo 5 app, rebuilt in React.
- **Demo 6.3 — What React solves for: React in a script tag.** Two `<script>` tags from unpkg, one component, `useState`, no build. Proves React is a library, not a framework. *Absorbs the old Demo 6.2 "library, not framework" framing as the intro paragraph.*
- **Verbal — Other libraries and frameworks.** Vue, Svelte, Solid, Angular. What problem each one solves differently. No demo — pointers only.

### Part 3 — Single-Page Apps

- **Demo 6.5 — What's an SPA, why were they done?** One HTML shell + a tiny JS router (`pushState` + click interception + `popstate`). Side-by-side: fake MPA (full reload every click) vs SPA (Network goes silent after first load).
- **Demo 6.7 — How does a modern frontend stack build one?** What a bundler actually does. Real lodash size numbers (~70 KB vs ~2 KB), tree shaking, code splitting, `React.lazy`. Vite as the worked example.
- **Demo 6.6 — Why Next when React exists?** Intro to Next.js. Annotated file tree of the Swiggy Next app; file-based routing, free dev server, free SSR, free bundler, free `<Link>` SPA navigation. *Absorbs the old Demo 6.8 (layered model: Next → React DOM → React) as a closing diagram, and the old Demo 8.5 (`<Link>` SPA-feel navigation) as a "Next gives you SPA navigation without the SPA tax" beat.*

### Part 4 — Rendering strategies

- **Demo 7 — SSG, CSR, SSR.** The identical Swiggy grid at `/ssg`, `/ssr`, `/csr`. View Source is the reveal — SSG and SSR ship full HTML, CSR ships an empty shell.
- **Demo 8 — Hydration: server vs client components.** `/hybrid` is a server-rendered grid with a client-rendered search box. Server/client badges; Slow 3G makes the hydration gap visible.

### Part 5 — Perf, security, and the real world

- **Demo 9 — Performance and Core Web Vitals.** A Lighthouse audit; LCP / INP / CLS and what moves them. Runbook-only.
- **Demo 10 — Frontend security.** A live XSS via `innerHTML` on a Swiggy reviews page (and the safe `textContent` path), plus a CORS error in the console.
- **Wrap — Swiggy DevTools audit.** Point DevTools at `swiggy.com`. Code-split chunks, lazy images, the production waterfall. Runbook only; the three mini-pattern demos (skeletons, optimistic, error boundary) move to a "what we didn't have time for" homework list at the end.

### Total

**15 demos + 2 verbal interludes + wrap audit = 18 segments** (was 19 demos + 1 verbal + wrap with 3 mini-demos = ~22 segments).

Per part: Part 1 = 4 demos + verbal. Part 2 = 4 demos + verbal. Part 3 = 3 demos. Part 4 = 2 demos. Part 5 = 2 demos + wrap.

## What gets cut

- **Demo 2.75 (event loop).** Off-spine for Part 1. Archived; could come back on Day 4 if there's a concurrency thread.
- **Demo 6.2 (library not framework).** Folded into Demo 6.3.
- **Demo 6.8 (layered model).** Folded into Demo 6.6.
- **Demo 8.5 (`<Link>` SPA-feel navigation).** Folded into Demo 6.6.
- **Wrap mini-demos** (skeletons, optimistic, error boundary). Become a homework bullet list in the wrap, not full demos.
- **Parts 4 / 5 / 5.5** as three separate single-demo parts. Re-merged into Part 4.

## Archive plan

Before rebuilding, snapshot the current Day 3 source and content to a one-shot dated directory at the repo root:

```
archive/day_3-2026-05-29/
  day_3/          # mirror of day_3/* excluding _archive
  site-content/   # mirror of site/content/day_3/*
  site-public/    # mirror of site/public/live-demos/*
```

- Outside the deploy tree (never picked up by `copy-content.mjs` or `curriculum.ts`).
- Committed as one commit (`archive: snapshot day_3 before 2026-05-29 restructure`).
- Source of truth for any "we already wrote that code, let's lift it" moments during the rebuild.

## Rebuild order

The user has asked for outline first, then content + demos.

1. Site outline — update `site/lib/curriculum.ts`, `site/app/days/3/page.tsx`, and `day_3/README.md` to the new 5-part shape with placeholder content per beat. The site renders empty stubs for each new/changed beat. This makes the new spine visible end-to-end before any content is written.
2. Content + demos beat-by-beat — each beat lands as a single commit: content file + demo source + curriculum wiring + `copy-content.mjs` run. Walk Part 1 → Part 5 in order.

Detailed step-by-step planning (which files change for each beat, what to lift from `archive/`, what to write fresh) belongs in the follow-on implementation plan, not this spec.

## Decisions still open

None — all major decisions resolved in brainstorming. Cuts, folds, archive plan, rebuild order all locked.

## Out of scope

- Day 1, Day 2, Day 4 — untouched.
- The `site/` Next.js app's visual layout, theme, navigation, section deck, or picture-in-picture iframe — untouched.
- The Swiggy running example — untouched.
- Hosting (Vercel projects, env vars, deploy config) — untouched.
