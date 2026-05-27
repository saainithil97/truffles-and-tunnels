# Day 3, Demo 3 — "Why order matters" (Render blocking)

**Date:** 2026-05-28
**Status:** Approved design
**Part of:** Day 3 — Demystifying Frontend Engineering. Third demo; pays off
Demo 1's "render-blocking vs not" waterfall and continues the Swiggy spine.

## Purpose

Make render-blocking **visceral**, then explain **why** it happens.

The browser stops parsing the HTML the moment it hits a plain `<script>`,
because the script might modify the DOM it is still building (classically via
`document.write`). So it must pause, fetch, and run the script before
continuing. Placement and the `defer` attribute change that experience
completely. This is the concrete payoff of Demo 1, where some resources were
"render-blocking" and some were not — now students see why.

## Approach

Build the **same page three ways**, differing in **exactly one line** (the
script tag), and load each with Slow 3G on so the difference is impossible to
miss. A deliberately slow script makes the block last long enough to narrate.

- **`slow.js`** — a **~2 second synchronous busy-loop** (a `while` loop spinning
  until `Date.now()` advances 2000 ms). It blocks regardless of network speed;
  Slow 3G adds download time on top. It `console.log`s its start and end, then
  appends a visible "✓ slow.js finished after N ms" banner to the page. The
  banner append is **guarded**: if `document.body` does not yet exist (which is
  the case when the script runs in `<head>` before the body is parsed), it
  waits for `DOMContentLoaded`; otherwise it appends immediately.
- The three pages are **identical** except for the script tag — same inline
  `<style>`, same Swiggy-themed body content (a "Meghana Foods" heading and a
  couple of lines). Inline CSS and text mean the script is the **only external
  resource**, so the blank period has exactly one cause to reason about.

### The three versions

| File | Script tag | Behaviour on Slow 3G |
|---|---|---|
| `version-a.html` | `<script src="slow.js"></script>` in `<head>` | Page is **blank** for seconds (download + the 2s loop), then everything appears at once. The browser hit the script and stopped parsing. |
| `version-b.html` | `<script src="slow.js" defer></script>` in `<head>` | HTML renders **immediately**; the script downloaded **in parallel** during parsing and runs after parsing completes. Best of both. |
| `version-c.html` | plain `<script src="slow.js"></script>` just before `</body>` | Content renders **first** (the parser reaches the body before the script), **then** the page freezes ~2s while the script runs. The classic pre-`defer` trick — but the download only starts late. |

## Files (`day_3/demo_3/`)

| File | Role |
|---|---|
| `slow.js` | The ~2s synchronous busy-loop with console logging + guarded "finished" banner. |
| `version-a.html` | Blocking script in `<head>` (no attributes). |
| `version-b.html` | `<head>` script with `defer`. |
| `version-c.html` | Plain script at end of `<body>`. |
| `index.html` | Links the three versions with one-line descriptions. |
| `server.py` | FastAPI static server (Demo 1 pattern) with per-request terminal logging, so the `slow.js` request is visible. |
| `requirements.txt` | `fastapi`, `uvicorn`, `httpx`, `pytest`. |
| `test_server.py` | pytest: each page + `index.html` serve 200; `slow.js` serves with a javascript content-type; A has no `defer`, B has `defer`, and C's script tag appears after the body content. |
| `README.md` | The runbook (demo flow, Slido, run steps). |

## Demo flow (lands in `README.md`)

0. **Slido** (before anything): "You have a 500 KB JavaScript file. Where do you
   put the `<script>` tag — head or end of body — and why?"
1. Turn on **Slow 3G** (DevTools → Network → throttling). Load **A**
   (`version-a.html`): the page is blank for several seconds — the browser hit
   the script in `<head>`, stopped parsing, downloaded it (slow on 3G), ran the
   2s loop — then the whole page appears at once.
2. Load **C** (`version-c.html`): the content renders immediately, then the page
   **freezes** for ~2s while the script runs. Better first paint, but note the
   download only *started* once the parser reached the end of the body.
3. Load **B** (`version-b.html`): content renders immediately **and** the script
   was downloading in parallel during parsing (check the waterfall), executing
   after parse. Best of both.
4. **Why this happens:** a plain `<script>` blocks because it may modify the DOM
   mid-parse (e.g. `document.write`), so the browser must pause parsing to run
   it. `defer` means "download in parallel, but don't execute until the HTML is
   fully parsed." `async` gets a one-line mention: download in parallel, run as
   soon as it arrives (order not guaranteed) — for independent scripts like
   analytics.
5. **Tie back to Demo 1:** this is exactly what "render-blocking" meant in the
   waterfall. `diff version-a.html version-b.html` — one line is the whole
   difference.

## Verification

- `test_server.py` passes (pages + `slow.js` serve; script-tag attributes/order
  differ as specified).
- The three HTML files differ from each other in exactly the script tag line.
- `slow.js` blocks for ~2s when run (a quick manual load confirms the blank /
  freeze behaviour; the automated test only checks serving + markup).

## Out of scope

- A real network request inside `slow.js` (a busy-loop is the chosen device; it
  is deterministic and network-independent).
- `async` beyond a one-line conceptual mention.
- Module scripts (`type="module"`, which defer by default), preloading, or
  bundler behaviour — later/advanced material.
- Reusing Demo 1's external CSS/font/image (deliberately avoided so the script
  is the only external variable).
