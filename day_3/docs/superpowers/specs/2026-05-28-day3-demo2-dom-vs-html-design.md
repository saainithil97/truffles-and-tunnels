# Day 3, Demo 2 — "The DOM is not the HTML" (Parsing and the live DOM)

**Date:** 2026-05-28
**Status:** Approved design
**Part of:** Day 3 — Demystifying Frontend Engineering. This is the second demo;
it builds directly on Demo 1 (the request lifecycle / Swiggy card).

## Purpose

Separate two things students conflate:

- **The HTML** — the text the server sent. Frozen. Visible in **View Source**.
- **The DOM** — the live object tree the browser parsed the HTML into, holds in
  memory, and renders the screen from. Mutable. Visible in the **Elements** tab.

The punchline, landed three ways: **JavaScript changes the DOM, not the HTML.
The screen is a picture of the DOM. Refresh rebuilds the DOM from the untouched
HTML.**

## Narrative thread

Demo 1 ended with the Like button: clicking it changed the count on screen.
Demo 2 opens by pointing back at that — the count said `3` but View Source still
said `0`. "You already watched the DOM diverge from the HTML; you just didn't
have the words for it yet." From there, prove the distinction deliberately, then
let students vandalize a real site to feel that a page is not a sealed artifact
but a data structure they can reach into.

## What this demo ships

**A runbook only** — `day_3/demo_2/README.md`. There is no new application code.
The demo runs in the browser console on top of:

1. The Demo 1 Swiggy card (served by the existing `day_3/demo_1` server), and
2. A real, public site (Wikipedia by default).

## Demo flow (lands in the runbook)

0. **Slido** (before anything): "If you change something in the Elements tab,
   does the original HTML file on the server change?" Answer is no; the point is
   to force the HTML-vs-DOM distinction into the open.
1. **Bridge from Demo 1 (the hook):** on the card at `http://localhost:8000/`,
   click **Like** a few times → the on-screen count shows e.g. `3`. Then **View
   Source** (`Cmd+Opt+U` / right-click → View Page Source) → the markup still
   reads `<span id="like-count">0</span>`. "The screen says 3, the source says
   0. Nobody is lying — the screen is the DOM, the source is the HTML."
2. **Same, but not:** show **View Source** (the exact file we wrote) next to the
   **Elements** tab. "They look identical, right?" — set up the reveal that they
   are two different things.
3. **Mutate from the console:**
   `document.querySelector('h1').textContent = 'HACKED'`
   The card's `<h1>` is "Meghana Foods", so this resolves. The heading changes;
   Elements reflects it; View Source does **not**.
4. **Dramatic:**
   `document.body.innerHTML = '<h1>I deleted everything</h1>'`
   The whole page is wiped. "The DOM is the truth — whatever is in the DOM is
   what you see."
5. **The reveal (the concept that makes it click):** hit **Refresh** (`Cmd+R`).
   Everything is back. *Why?* The mutations lived only in the browser's memory;
   the server resent the same unchanged HTML, and the browser parsed a clean DOM
   from scratch. Source never changed, so refresh restores everything.
6. **Real-site playground:** open **Wikipedia** (stable, public, and refresh
   undoes everything — local-only, nobody else is affected). Curated, robust
   console snippets:
   - Change a headline: `document.querySelector('h1').textContent = 'My Encyclopedia'`
   - Recolor the page: `document.body.style.background = 'hotpink'`
   - Hide the navigation/header: target a Wikipedia chrome element and set
     `display:none`, with a resilient selector.
   Each snippet gets a **fallback**: if a selector misses (sites change their
   markup), right-click any element → **Inspect** → in the console use `$0`
   (DevTools' reference to the currently selected element), e.g.
   `$0.textContent = 'whatever'` or `$0.remove()`.
   College websites are fair game too, but their markup is unpredictable, so
   Wikipedia is the default.
7. **Reframe / defuse:** a page is not a sealed artifact — it is a data
   structure you can reach into and edit. This is **local-only**: it changes
   only your browser's in-memory DOM, nobody else sees it, and refresh resets
   it. (This also answers the inevitable "wait, is this hacking?" — no.)

## Conceptual sidebar (in the runbook)

- **HTML** = the recipe the server sent (static text in the HTTP response).
- **DOM** = the live tree the browser built from that text and keeps in memory;
  the rendered screen is a picture of the DOM.
- **View Source** shows the original served HTML. **Elements** shows the current
  DOM serialized back to HTML-looking text. They are equal only until the first
  script (or console command) runs; after that they diverge.

## Structure changes (part of this demo's work)

Day 3 now has more than one demo, so `day_3/` is reorganized:

- `git mv` Demo 1's files into **`day_3/demo_1/`**: `index.html`, `style.css`,
  `app.js`, `meghana-biryani.jpg`, `server.py`, `test_server.py`,
  `requirements.txt`, `README.md`.
- Recreate Demo 1's virtualenv at `day_3/demo_1/.venv` (the old `day_3/.venv` is
  gitignored and can be removed). Confirm `.venv/` is still gitignored at the
  new depth.
- Add **`day_3/demo_2/README.md`** — the runbook above. No code.
- Add **`day_3/README.md`** — a short Day 3 index linking both demos with
  one-line hooks and pointing at the shared `docs/superpowers/` specs/plans.
- Fix Demo 1's README relative reference to its spec (now one directory deeper:
  `../docs/superpowers/specs/2026-05-27-day3-request-lifecycle-design.md`).
- Specs and plans stay shared under `day_3/docs/superpowers/`.

## Verification (no automated tests — Demo 2 ships no code)

- Demo 1's pytest still passes when run from `day_3/demo_1/` with its venv.
- The Demo 1 server still serves the card from `day_3/demo_1/`.
- The console snippets are valid against the card's actual markup — the card has
  exactly one `<h1>` containing "Meghana Foods", so `querySelector('h1')`
  resolves, and the Like-count `<span>` reads `0` in source.
- The runbook's links (index → demo_1, index → demo_2, demo_1 → spec) resolve.

## Out of scope

- Any new application/page (we use Demo 1's card + real sites).
- Automated testing of live external sites (their markup changes; we provide
  robust selectors plus the `$0` fallback instead).
- Event listeners, frameworks, virtual DOM, or how React diffs the DOM — those
  are later material. Demo 2 is only HTML-vs-DOM and direct DOM mutation.
