# Day 3, Demo 1 — "What just happened?" (The request lifecycle)

**Date:** 2026-05-27
**Status:** Approved design
**Part of:** Day 3 — Demystifying Frontend Engineering (a sequence of demos/acts;
this is the first).

## Purpose

Make the invisible visible. A single tiny page is not one thing the browser
"opens" — it is *many* network requests, fetched in parallel and in sequence,
then assembled into a render. Day 1 showed Swiggy's restaurant list arriving
over the network at a high level; Day 3 zooms into **one restaurant card** and
watches exactly what the browser does to paint it.

The page itself is bait. **The Network tab in DevTools is the star of the demo.**

## Narrative thread

> "Day 1 we saw Swiggy's restaurant list come over the network. Today we zoom
> into one card and watch exactly what the browser does to paint it."

Staying on the Swiggy spine keeps Day 3 continuous with Day 1's case study and
with the Q&A app being built across the course.

## The card

A single **Swiggy-style restaurant card**, reusing a restaurant from Day 1's
list for continuity — **Meghana Foods (Biryani)**. It reads as "the same Swiggy
from Day 1, now rendered as one real card on a real page."

Card contents: restaurant name, cuisines, rating, delivery time, cost for two,
and a food/restaurant **image**.

## Why these specific resources

The page deliberately pulls in multiple resource *types* so the waterfall has
something to show. Each resource is its **own external file** — that is the
entire point; nothing is inlined (this is the opposite of Day 1's `server.py`,
which inlined CSS and JS into one HTML string).

The result is exactly **6 requests** for the card:

1. `GET /` → the HTML document
2. `GET /style.css` → external stylesheet
3. `GET /app.js` → external JavaScript
4. `GET /<dish image>` → the restaurant/food image
5. `GET fonts.googleapis.com/css2?...` → the Google Font **stylesheet**
6. `GET fonts.gstatic.com/...woff2` → the actual font **file**, chained off #5
   and **cross-origin**

Plus a bonus beat: the browser auto-requests `/favicon.ico` — a 7th request
*nobody asked for*.

### Teaching beats baked into the resources

- **Chained, cross-origin font** (#5 → #6): the font is two requests, on two
  different domains. One request triggers another. This is one of the strongest
  "oh, *that's* what's happening" moments — keep the font **external**
  (`fonts.googleapis.com`), do not self-host.
- **Render-blocking CSS** (`style.css` in `<head>`): on Slow 3G the browser
  shows **unstyled text first**, then it snaps into style (FOUC, flash of
  unstyled content).
- **Interactivity arrives last** (`app.js`): the card can *look* finished while
  still not being clickable, because the JS hasn't landed yet. "Pretty ≠
  working."
- **The image is heavy on purpose** (~300–500 KB): so it is visibly the *last*
  thing to fill in on Slow 3G, after text and styles are already there.

## Files (`day_3/`)

Reuses the Day 1 FastAPI + uvicorn pattern (familiar tooling, "a server answers
requests" thread), but serves resources as **separate static files**.

| File | Role / teaching purpose |
|---|---|
| `server.py` | FastAPI app. Serves `/` (HTML) and the static files. **Logs every request to the terminal** with a running counter, so the terminal shows the same requests as the Network tab — "the server answered each one." |
| `index.html` | The restaurant card markup. References the external CSS, JS, image, and Google Font in `<head>`/`<body>`. |
| `style.css` | External styles — card layout, image framing, the `font-family` that uses the Google Font. Render-blocking in `<head>`. |
| `app.js` | Adds the **"❤ liked" counter** — a button + count, in-memory, increments on click. Wired so that on Slow 3G the card looks done but is not clickable until JS lands. |
| `<dish image>` | A real food/restaurant image, ~300–500 KB on purpose. **Generated locally** (stylized, not copyrighted) — no licensing concern and offline-safe. |
| `requirements.txt` | `fastapi`, `uvicorn`. |
| `README.md` | Run steps, pre-session checklist, the Slido beat, and the demo script. |

## Demo flow (lands in `README.md`)

1. **Slido shock** (before opening anything): "How many network requests does it
   take to load google.com's homepage?" Students guess 5–10. Real answer is
   50–70+. Reveal it live in DevTools on `google.com`.
2. Open our card at `http://localhost:8000/`. Open DevTools → Network tab →
   reload. Walk the **waterfall**:
   - 6 requests for this tiny card.
   - Point out which start in **parallel** and which **wait** (the chained font
     file waits for the font CSS).
   - The **cross-origin** font requests (different domains).
   - The **favicon** request nobody asked for.
3. **Throttle to Slow 3G** (DevTools → Network → throttling) → reload. Narrate
   the staged render, made slow enough to *see*:
   - bare **unstyled text** first →
   - **styles snap in** (FOUC resolves) →
   - **image fills in** last →
   - **button becomes clickable** once JS lands.

## Decisions (locked)

- **Local instructor demo only** — no public tunnel. This is a screen-shared
  DevTools walk-through; cloudflared/ngrok add nothing here, so they are cut
  from the README (unlike Day 1).
- **External Google Font** — for the chained, cross-origin teaching beat.
  Mitigate live-internet risk with a pre-session checklist item and a fallback
  screenshot of the waterfall.
- **Generated local image** — stylized, offline-safe, no licensing concern.
- **Meghana Foods (Biryani)** card, reused from Day 1.
- Spec lives in `day_3/docs/superpowers/specs/`, matching the Day 1/Day 2
  per-day convention.

## Pre-session checklist (to live in README)

- [ ] `.venv` exists and `pip install -r requirements.txt` succeeds inside it.
- [ ] `uvicorn server:app ...` runs; card renders at `http://localhost:8000/`.
- [ ] Network tab shows the 6 requests (+ favicon) on reload.
- [ ] Slow 3G throttling produces the visible staged render.
- [ ] External Google Font loads (live internet); fallback waterfall screenshot
      saved in case Google is flaky.
- [ ] google.com Network-tab reveal practised once; screenshot saved as backup.
- [ ] Display sleep / Caffeinate enabled for the session duration.

## Out of scope (for this demo)

- Public tunnel / students loading it on their own machines.
- Multiple cards or a grid (one card keeps the waterfall legible).
- Persistence of the "liked" count (in-memory client-side only).
- Anything about rendering strategies (SSR/SSG/CSR), the Next.js scaffold, or
  the Q&A app spec — those belong to later acts/demos of Day 3.
