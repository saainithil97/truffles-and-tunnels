# Day 3, Demo 3 — "Why order matters" (Render blocking)

Companion artifacts for the third demo of Day 3. Full design:
`../docs/superpowers/specs/2026-05-28-day3-demo3-render-blocking-design.md`.

The **same Swiggy page, three ways** — differing only in where the
`<script>` tag sits. A deliberately slow script (`slow.js`, a ~2-second
synchronous busy-loop) makes the block last long enough to see and narrate. This
is the concrete payoff of Demo 1: now you know *why* some resources are
"render-blocking."

## What's here

- `slow.js` — blocks the main thread for ~2s on purpose; logs start/finish and
  drops a "✓ finished" banner.
- `version-a.html` — blocking `<script>` in `<head>` (no attributes).
- `version-b.html` — `<head>` `<script>` with `defer` (identical to A otherwise).
- `version-c.html` — plain `<script>` at the end of `<body>`.
- `index.html` — links the three.
- `server.py` — FastAPI static server that logs every request.
- `test_server.py` — pytest (serving + the script-tag differences).
- `requirements.txt` — `fastapi`, `uvicorn`, `httpx`, `pytest`.

## Setup & run

```bash
cd day_3/demo_3
python3 -m venv .venv && source .venv/bin/activate   # first time only
pip install -r requirements.txt                       # first time only
uvicorn server:app --host 127.0.0.1 --port 8000 --reload
```

Open `http://localhost:8000/` and keep the **Console** open to see `slow.js`
log when it starts and finishes.

## Demo flow

### 0. Slido (before anything)

> "You have a 500 KB JavaScript file. Where do you put the `<script>` tag —
> head or end of body — and why?"

### 1. Version A — blocking in the head

Turn on **Slow 3G** (DevTools → Network → throttling). Load
`http://localhost:8000/version-a.html`. The page is **blank for several
seconds** — the browser hit the `<script>` in `<head>`, **stopped parsing**,
downloaded it (slow on 3G), ran the 2-second loop — then the whole page appears
at once.

### 2. Version C — at the end of the body

Load `/version-c.html`. The content renders **immediately**, then the page
**freezes** for ~2s while the script runs. Better first paint — but notice the
download only *started* once the parser reached the end of the body.

### 3. Version B — defer

Load `/version-b.html`. Content renders **immediately** *and* the script was
downloading **in parallel** during parsing (look at the waterfall), executing
after the parse. Best of both.

### 4. Why this happens

A plain `<script>` blocks because it might modify the DOM mid-parse (classically
`document.write`), so the browser must pause parsing to run it. `defer` means
"download in parallel, but don't execute until the HTML is fully parsed."
(`async` is the cousin: download in parallel, run as soon as it arrives, order
not guaranteed — for independent scripts like analytics.)

### 5. Tie back to Demo 1

This is exactly what "render-blocking" meant in Demo 1's waterfall. And the
whole difference between A and B is one line:

```bash
diff version-a.html version-b.html
```

## Pre-session checklist

- [ ] `.venv` exists and `pip install -r requirements.txt` succeeds.
- [ ] `python -m pytest -q` passes (6 tests).
- [ ] `uvicorn server:app ...` runs; `http://localhost:8000/` lists the three.
- [ ] With Slow 3G on: A blanks then pops; C paints then freezes; B paints then
      runs. Practised once.
