# Day 3 snapshot — 2026-05-29

A one-shot snapshot of `day_3/`, `site/content/day_3/`, and
`site/public/live-demos/` taken immediately before the restructure
specified in
[`day_3/docs/superpowers/specs/2026-05-29-day3-restructure-design.md`](../../day_3/docs/superpowers/specs/2026-05-29-day3-restructure-design.md).

This directory is **read-only reference material**. Nothing here is wired
into `copy-content.mjs` or `curriculum.ts`; the deploy never sees it.

## Why it exists

The restructure cuts Demo 2.75, folds Demo 6.2 into 6.3, folds Demos 6.8
and 8.5 into 6.6, and re-merges Parts 4 / 5 / 5.5 into one Part 4. The
underlying *code* of every existing demo is still useful — the cuts are
about pedagogical framing, not implementation quality. When rebuilding a
beat, lift code, prose fragments, and diagrams from here.

## Layout

- `day_3/` — mirror of the workshop tree at the snapshot moment.
- `site-content/` — mirror of `site/content/day_3/` (rendered markdown +
  per-demo `code/` staging dirs).
- `site-public/` — mirror of `site/public/live-demos/` (deployed static
  demo assets).

## How to look something up

To recover the old version of a demo's README or source:

    ls archive/day_3-2026-05-29/day_3/<demo_id>/

To recover the old rendered content the site was using:

    cat archive/day_3-2026-05-29/site-content/<demo_id>.md
