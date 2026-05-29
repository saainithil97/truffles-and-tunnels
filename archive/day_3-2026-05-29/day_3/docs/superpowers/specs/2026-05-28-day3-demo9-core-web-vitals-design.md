# Day 3, Demo 9 — "What are you actually shipping?" (Performance & Core Web Vitals)

**Date:** 2026-05-28
**Status:** Approved design
**Part of:** Day 3 — Demystifying Frontend Engineering. Ninth demo; turns the
day's conceptual beats (request lifecycle, render-blocking, layout/paint) into a
single measurable report card via Lighthouse, and forward-refs observability.

## Purpose

Show that everything covered today is **measurable**, and that the same numbers
drive Google's search ranking.

Students have learned *how* a page loads, mutates the DOM, gets styled, lays out,
and paints. Lighthouse measures all of it and grades it. The demo makes the
abstract concrete: a good-looking page can score poorly, and the report tells you
exactly why and what to fix first. The three Core Web Vitals (LCP, INP, CLS) give
the room a shared vocabulary for "fast," and the Opportunities/Diagnostics list
ties each earlier demo back to a real cost.

## Approach

**Runbook-only — no code is built.** Lighthouse audits a *real, existing* page,
so there is nothing to construct. The instructor runs Chrome DevTools →
Lighthouse against:

- **Primary target:** a willing student's deployed Day-2 landing page — their own
  code makes the findings land harder.
- **Fallback target:** Demo 1's Swiggy card at `http://localhost:8000/`, served
  by Demo 1's existing FastAPI server. Reliable and always available.

Audit in an **Incognito** window, **Mobile** form factor, all four categories
(Performance, Best Practices, SEO, Accessibility), **Navigation** mode.

## Files (`day_3/demo_9/`)

| File | Role |
|---|---|
| `README.md` | The complete runbook: Slido, audit steps, the three Core Web Vitals with thresholds, the Opportunities/Diagnostics walk, and the observability forward-ref. No code accompanies it. |

## Demo flow (lands in `README.md`)

0. **Slido** (before anything): "Biggest performance killer — images, JS, CSS,
   or fonts?" JS by interactivity/load impact; images by total bytes. Both
   defensible; the argument is the point. Resolved in step 4 by the report's own
   attribution.
1. **Run the audit:** DevTools → Lighthouse → Analyze page load. Read the four
   dials (Performance, Best Practices, SEO, Accessibility). Hook: a pretty page
   can score poorly — pretty ≠ fast.
2. **The three Core Web Vitals** (one sentence + "good" threshold each):
   - **LCP** — time until the biggest visible element renders; perceived load
     speed; **< 2.5s** good.
   - **INP** — click-to-visual-response delay; a slow React re-render or heavy
     handler kills it; **< 200ms** good.
   - **CLS** — how much the layout jumps while loading (e.g. an unsized image
     pushing text down); users hate it; **< 0.1** good.
3. **Why they matter:** Google uses Core Web Vitals as a search-ranking signal —
   measurable, sitting right in the report.
4. **Walk Opportunities & Diagnostics:** uncompressed images, render-blocking
   CSS/JS (literally Demo 3), unused JavaScript (what tree-shaking fights). Each
   is a concept from today with a price tag — a prioritised frontend health check.
5. **Forward-ref to observability:** in production you'd track these
   continuously; a deploy that tanks LCP 1.5s → 4s should alert. Sets up Day 4.

## Verification

- The runbook's audit steps are accurate against current Chrome DevTools
  Lighthouse (Navigation mode, four categories, Mobile, Incognito).
- LCP/INP/CLS definitions and the < 2.5s / < 200ms / < 0.1 "good" thresholds are
  correct.
- A practice run against the fallback target (Demo 1's card) completes and
  surfaces the four dials, the three vitals, and readable Opportunities entries.
- A backup screenshot of a completed report exists in case live Wi-Fi is flaky.

## Out of scope

- **Building any page to audit** — the demo audits real/existing pages (a
  student's Day-2 site or Demo 1's card); it constructs nothing.
- Field data / CrUX / a real RUM pipeline — observability is a forward-reference
  only, owned by Day 4.
- Deep remediation of any specific finding (image pipelines, code-splitting
  config) — Next.js handles most of this automatically; named, not configured.
- Programmatic Lighthouse (CI, the `lighthouse` CLI, PageSpeed API) — the demo is
  the interactive DevTools panel.
