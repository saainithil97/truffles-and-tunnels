# Day 3, Demo 4 — "The expensive DOM" (Layout, reflow, and paint)

Companion artifacts for the fourth demo of Day 3. Full design:
`../docs/superpowers/specs/2026-05-28-day3-demo4-layout-paint-design.md`.

Changing the DOM isn't free. Every time you move or resize an element, the
browser has to **recompute layout** (where everything sits — "reflow") and
**repaint** the affected pixels. Do it once and nobody notices. Do it 500 times
in a loop, reading layout in between, and you get **layout thrash** — the
browser reflowing over and over because you keep asking. That's the real reason
hand-rolled DOM updates get slow at scale, and **the core problem React was
built to solve**: updating a complex UI efficiently is hard when done manually.
(Not "HTML is hard to write" — it's "keeping the screen in sync without
thrashing is hard.")

The page has **500 restaurant tiles** and two buttons that resize them to the
*same look* — one tile-by-tile, one in a single pass — with on-screen timings so
the contrast is quantitative and repeatable.

## What's here

- `index.html` — the controls, the two timing readouts, and an empty grid that
  `app.js` fills with 500 tiles.
- `style.css` — the grid + tile styles, and a single `.grid.big` rule that's the
  whole "fast" path (CSS resizes every tile from one class toggle).
- `app.js` — builds the 500 tiles; the **slow** handler loops over every tile
  writing inline sizes *and reading `offsetWidth`* each iteration (forcing a
  synchronous reflow 500 times); the **fast** handler toggles one class. Both
  timed with `performance.now()`.
- `server.py` — FastAPI static server that logs every request (Demo 1/3 pattern).
- `test_server.py` — pytest (serving + content-types + logging).
- `requirements.txt` — `fastapi`, `uvicorn`, `httpx`, `pytest`.

## Setup & run

```bash
cd day_3/demo_4
python3 -m venv .venv && source .venv/bin/activate   # first time only
pip install -r requirements.txt                       # first time only
uvicorn server:app --host 127.0.0.1 --port 8000 --reload
```

Open `http://localhost:8000/`.

## Demo flow

### 0. Slido (before anything)

> "You need to update **100 list items** on screen. Do you (A) update them one
> by one, or (B) rebuild the whole list as HTML and replace it all at once?"

Let them vote. The answer is **B** — one layout pass instead of 100 — but hold
the twist for the end (section 5): B is faster yet *loses scroll position,
focus, and in-progress animations*. That tension is exactly what the virtual DOM
resolves, and it's the bridge to Demo 6.

### 1. Turn on Paint flashing

DevTools → `Cmd+Shift+P` → "Show Rendering" → enable **Paint flashing**.
Interact with any page (scroll, hover a button) — the **green flashes** are
repaints. Now they can *see* paint happen.

### 2. Resize each (slow), while recording

Open `http://localhost:8000/`. Open the **Performance** tab and start recording
(`Cmd+E`). Click **"Resize each (slow)"**. Stop the recording.

- Point at the timeline: a long stripe of alternating **Layout → Paint → Layout
  → Paint** bars — purple/green, over and over.
- Read the on-page number: tens to hundreds of **ms** for one button click.

> "That's 500 individual layout recalculations. Each time we change one tile's
> size *and then read its width*, the browser can't be lazy — it has to reflow
> the whole grid right now to give us an honest answer, *then* we change the
> next tile and ask again. Write, reflow, write, reflow… 500 times. That's
> layout thrash."

### 3. Resize all (batched / fast)

Click **Reset**, then **"Resize all (batched / fast)"** (record it too if you
like).

- The tiles grow to the exact same size — but the timing readout is a tiny
  fraction of the slow one, and the timeline shows **one** Layout and **one**
  Paint.

> "Same visual result. We toggled a single class on the container and let CSS
> resize all 500 tiles in one pass — one layout, one paint. The browser batches
> work *for* us as long as we don't keep interrupting it to read layout."

### 4. The takeaway

Both buttons end in the identical picture; only the *method* differs, and the
numbers are not close. Manually keeping a complex UI in sync — touching elements
one at a time — is how real apps get slow.

> "This is the core problem React was built to solve. Not 'HTML is hard to
> write' — it's 'updating a complex UI efficiently, without thrashing layout, is
> hard to do by hand.'"

### 5. Pay off the Slido (forward-ref to Demo 6)

Back to the vote. **B** (rebuild and replace) wins on raw speed — one layout pass
beats 100. *But*: blow away the list and rebuild it and you've **lost the user's
scroll position, the input they had focused, any animation mid-flight**. So the
honest answer is "B is faster but naïve replacement breaks the experience."

> "What you actually want is to compute the *new* list, diff it against the old
> one, and touch only the handful of nodes that truly changed — getting B's
> single-pass speed without throwing away A's state. That diffing is the
> **virtual DOM**. We'll see it in Demo 6."

## Pre-session checklist

- [ ] `.venv` exists and `pip install -r requirements.txt` succeeds.
- [ ] `python -m pytest -q` passes (7 tests).
- [ ] `uvicorn server:app ...` runs; the 500-tile grid renders at
      `http://localhost:8000/`.
- [ ] Paint flashing enabled once and the green repaints confirmed.
- [ ] Clicked **Resize each (slow)** — readout is clearly large (tens–hundreds
      of ms) and the Performance timeline shows repeated Layout/Paint bars.
- [ ] Clicked **Reset** then **Resize all (batched)** — same final look, far
      smaller readout, a single Layout/Paint. Contrast practised once.
- [ ] Display sleep / Caffeinate enabled for the session duration.

## Notes for the live session

- Exact ms vary by machine; the **ratio** (slow ≫ fast) is the point, not the
  absolute numbers. Run it once on the demo machine so you know your figures.
- If the slow click feels too quick to narrate, click it twice — or mention the
  grid could be scaled past 500. Don't push so high the tab hangs.
