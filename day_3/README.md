# Day 3, Demo 1 — "What just happened?" (The request lifecycle)

Companion artifacts for the first demo of Day 3. Full design:
`docs/superpowers/specs/2026-05-27-day3-request-lifecycle-design.md`.

A single Swiggy restaurant card (Meghana Foods, reused from Day 1) whose every
resource is a separate file — so DevTools' Network tab reveals the real request
waterfall. The page is bait; **the Network tab is the demo.**

## What's here

- `index.html` — the card markup, referencing the external CSS, JS, image, and
  an external Google Font.
- `style.css` — external, render-blocking styles (causes the FOUC beat).
- `app.js` — the in-memory "❤ Like" counter (the "not clickable until JS lands"
  beat).
- `meghana-biryani.jpg` — a real ~300–500 KB biryani photo (the "fills in last"
  beat). See **Image credit** below.
- `server.py` — FastAPI app that serves the files and logs every request to the
  terminal.
- `test_server.py` — pytest coverage for routing, content-types, and logging.
- `requirements.txt` — `fastapi`, `uvicorn`, `httpx`, `pytest`.

## One-time setup

```bash
cd day_3
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

`.venv/` is gitignored. **Activate it in every new terminal** (`source .venv/bin/activate`).

## Running the demo

```bash
uvicorn server:app --host 127.0.0.1 --port 8000 --reload
```

Open `http://localhost:8000/`. The terminal logs every request the browser
makes — the same set you'll see in DevTools.

## Demo flow

### 0. Slido shock (before opening anything)

> "How many network requests does it take to load **google.com**'s homepage?"

Students guess 5–10. The real answer is **50–70+**. Reveal it live: open
`https://www.google.com`, DevTools → Network → reload, read the request count
at the bottom of the panel.

### 1. The waterfall

Open `http://localhost:8000/`. DevTools (`Cmd+Opt+I`) → **Network** tab →
reload. Walk it:

- **6 requests** for this tiny card:
  1. `/` (HTML) 2. `/style.css` 3. `/app.js` 4. `/meghana-biryani.jpg`
  5. the font **CSS** from `fonts.googleapis.com`
  6. the font **file** from `fonts.gstatic.com`
- Point out which start in **parallel** vs. which **wait**: request #6 (the font
  file) can't start until #5 (the font CSS) tells the browser it exists — one
  request *causes* another.
- #5 and #6 are **cross-origin** — different domains than ours.
- There's also a **`/favicon.ico`** request nobody asked for — the browser asks
  on its own (it 404s; we don't ship one).

### 2. The Slow 3G reveal

DevTools → Network → throttling dropdown → **Slow 3G** → reload. Narrate the
staged render, now slow enough to *see*:

1. **bare unstyled text** first (HTML parsed, `style.css` not here yet) →
2. **styles snap in** (FOUC resolves; the system font swaps to Poppins) →
3. the **image fills in** last →
4. the **Like button comes alive** once `app.js` lands — click it *before* JS
   arrives and nothing happens; click after and the count ticks up.

## Pre-session checklist (run earlier in the day)

- [ ] `.venv` exists and `pip install -r requirements.txt` succeeds inside it.
- [ ] `python -m pytest test_server.py -v` passes (5 tests).
- [ ] `uvicorn server:app ...` runs; card renders at `http://localhost:8000/`.
- [ ] Network tab shows the 6 requests (+ favicon) on reload.
- [ ] Slow 3G throttling produces the visible staged render.
- [ ] External Google Font loads (needs live internet). **Save a fallback
      screenshot of the waterfall** in case Google is flaky.
- [ ] google.com Network-tab reveal practised once; screenshot saved as backup.
- [ ] Display sleep / Caffeinate enabled for the session duration.

## Notes for the live session

- This is a **local, screen-shared** demo — no public tunnel (unlike Day 1).
- The terminal request log mirrors the Network tab: a nice beat — "the server
  answered every one of these."

## Image credit

`meghana-biryani.jpg` — "Hyderabadi Dum Biryani" by **Mahi Tatavarty**, from
Wikimedia Commons, licensed **CC BY-SA 4.0**. EXIF stripped and re-saved; not
otherwise modified.
<https://commons.wikimedia.org/wiki/File:%22Hyderabadi_Dum_Biryani%22.jpg>
