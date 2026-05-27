# Day 3 Demo 1 — Request Lifecycle Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a deliberately multi-resource Swiggy restaurant card (Meghana Foods) served by a FastAPI app, so that DevTools' Network tab reveals the real request waterfall and a Slow 3G reload makes the staged render visible.

**Architecture:** A FastAPI app whose only job is to serve static files and log every request to the terminal. Resources are kept in **separate external files** (HTML, CSS, JS, image) plus an **external cross-origin Google Font**, producing exactly six requests for one tiny card. The page is bait; the Network tab is the lesson.

**Tech Stack:** Python 3, FastAPI, uvicorn, Starlette `StaticFiles`. Tests with pytest + httpx (FastAPI `TestClient`). Image generated once with Pillow + numpy (build-time only).

**Testing approach:** The server is covered by automated pytest (routing, content-types, request logging). Static assets and DevTools/browser behaviors (FOUC, Slow 3G staging, the waterfall) are verified by inspection and a manual run — they have no meaningful unit test.

---

### Task 1: Dependencies

**Files:**
- Create: `day_3/requirements.txt`

- [ ] **Step 1: Write `day_3/requirements.txt`**

```text
fastapi
uvicorn[standard]
httpx
pytest
```

- [ ] **Step 2: Create and populate the virtualenv**

Run from `day_3/`:

```bash
cd day_3
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

Expected: installs succeed; `python -c "import fastapi, httpx, pytest"` exits 0.

- [ ] **Step 3: Commit**

```bash
git add day_3/requirements.txt
git commit -m "Day 3 Demo 1: add Python dependencies"
```

Note: `.venv/` is already gitignored at the repo root (carried over from Day 1).

---

### Task 2: The card markup (`index.html`)

**Files:**
- Create: `day_3/index.html`

- [ ] **Step 1: Write `day_3/index.html`**

```html
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Meghana Foods — Swiggy</title>

  <!-- Request #5: the Google Font stylesheet (cross-origin, fonts.googleapis.com).
       It will, in turn, trigger Request #6: the actual font file from
       fonts.gstatic.com. One request that causes another. -->
  <link rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&display=swap" />

  <!-- Request #2: our own stylesheet. Render-blocking — on Slow 3G the text
       shows in a plain system font until this arrives, then snaps into style. -->
  <link rel="stylesheet" href="/style.css" />
</head>
<body>
  <main class="card">
    <!-- Request #4: the heavy image — the last thing to fill in on Slow 3G. -->
    <img class="card__img" src="/meghana-biryani.jpg"
         alt="Meghana Foods biryani" width="600" height="400" />
    <div class="card__body">
      <h1 class="card__name">Meghana Foods</h1>
      <p class="card__cuisines">Biryani, Andhra</p>
      <p class="card__meta">
        <span class="rating">★ 4.3</span> · 40 mins · ₹500 for two
      </p>
      <button id="like" class="like" type="button">
        🤍 Like <span id="like-count">0</span>
      </button>
    </div>
  </main>

  <!-- Request #3: the behavior. Until this lands, the Like button does nothing. -->
  <script src="/app.js" defer></script>
</body>
</html>
```

- [ ] **Step 2: Verify the markup references all four local/external resources**

Run from `day_3/`:

```bash
grep -E "style.css|app.js|meghana-biryani.jpg|fonts.googleapis.com" index.html
```

Expected: four matching lines printed (one per resource).

- [ ] **Step 3: Commit**

```bash
git add day_3/index.html
git commit -m "Day 3 Demo 1: add Meghana Foods card markup"
```

---

### Task 3: The stylesheet (`style.css`)

**Files:**
- Create: `day_3/style.css`

- [ ] **Step 1: Write `day_3/style.css`**

```css
:root {
  --swiggy: #fc8019;
  --ink: #1c1c1c;
  --muted: #686b78;
  --rating: #1a8b3a;
}

* { box-sizing: border-box; }

body {
  margin: 0;
  min-height: 100vh;
  display: grid;
  place-items: center;
  background: #f4f4f5;
  /* The Google Font. Until fonts.googleapis.com + fonts.gstatic.com load, the
     browser falls back to the system font — visibly different on Slow 3G. */
  font-family: "Poppins", -apple-system, system-ui, sans-serif;
  color: var(--ink);
}

.card {
  width: 360px;
  background: #fff;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.12);
}

.card__img {
  display: block;
  width: 100%;
  height: 240px;
  object-fit: cover;
  background: #eee;
}

.card__body { padding: 16px 18px 20px; }

.card__name { margin: 0 0 4px; font-size: 1.35rem; font-weight: 700; }
.card__cuisines { margin: 0 0 10px; color: var(--muted); font-size: 0.95rem; }
.card__meta { margin: 0 0 16px; color: var(--muted); font-size: 0.95rem; }
.rating { color: var(--rating); font-weight: 600; }

.like {
  font: inherit;
  font-weight: 600;
  cursor: pointer;
  border: 1.5px solid var(--swiggy);
  color: var(--swiggy);
  background: #fff;
  border-radius: 10px;
  padding: 8px 14px;
  transition: background 0.15s, color 0.15s;
}
.like:hover { background: var(--swiggy); color: #fff; }
.like.is-liked { background: var(--swiggy); color: #fff; }
```

- [ ] **Step 2: Commit**

```bash
git add day_3/style.css
git commit -m "Day 3 Demo 1: add card stylesheet"
```

---

### Task 4: The behavior (`app.js`)

**Files:**
- Create: `day_3/app.js`

- [ ] **Step 1: Write `day_3/app.js`**

```javascript
// Request #3 in the waterfall. The card already looks finished before this file
// arrives — but the Like button does nothing until this code runs. On Slow 3G
// you can click it and watch nothing happen, then it "comes alive" once the JS
// lands. Pretty != working.
(function () {
  const button = document.getElementById("like");
  const count = document.getElementById("like-count");
  let likes = 0;

  button.addEventListener("click", function () {
    likes += 1;
    count.textContent = String(likes);
    button.classList.add("is-liked");
    // The button's first child is the leading text node ("🤍 Like ").
    button.firstChild.textContent = "❤ Liked ";
  });
})();
```

- [ ] **Step 2: Commit**

```bash
git add day_3/app.js
git commit -m "Day 3 Demo 1: add Like-counter behavior"
```

---

### Task 5: The heavy image (`meghana-biryani.jpg`)

**Files:**
- Create: `day_3/meghana-biryani.jpg`

The image must be ~300–500 KB so it is visibly the *last* thing to fill in on
Slow 3G. It is generated locally (stylized, not copyrighted, offline-safe).
Pillow + numpy are build-time only — they are **not** added to `requirements.txt`.

- [ ] **Step 1: Install the build-time image tools (in the venv)**

Run from `day_3/` (venv active):

```bash
pip install pillow numpy
```

- [ ] **Step 2: Generate the image**

Run from `day_3/`:

```bash
python3 - <<'PY'
import numpy as np
from PIL import Image, ImageDraw

W, H = 1280, 853
top = np.array([252, 160, 60], dtype=float)     # warm Swiggy orange
bottom = np.array([140, 30, 20], dtype=float)    # deep biryani red
grad = np.linspace(0, 1, H)[:, None, None]
base = top * (1 - grad) + bottom * grad          # (H, 1, 3)
arr = np.tile(base, (1, W, 1))
# Photographic noise — resists JPEG compression so the file stays a few
# hundred KB (that heft is the point: it loads last on Slow 3G).
arr += np.random.normal(0, 18, (H, W, 3))
arr = np.clip(arr, 0, 255).astype("uint8")

img = Image.fromarray(arr, "RGB")
draw = ImageDraw.Draw(img)
draw.text((60, H - 150), "Meghana Foods", fill=(255, 255, 255))
draw.text((60, H - 110), "Biryani  *  Andhra", fill=(255, 235, 215))
img.save("meghana-biryani.jpg", quality=88)
print("saved meghana-biryani.jpg")
PY
```

- [ ] **Step 3: Verify the file size is in the target band**

Run from `day_3/`:

```bash
ls -l meghana-biryani.jpg | awk '{print $5 " bytes"}'
```

Expected: between ~300000 and ~600000 bytes. If it is well under 300 KB, raise
`quality` (e.g. 92) and/or noise std; if well over 600 KB, lower `quality`
(e.g. 80). Re-run Step 2 until it lands in band.

- [ ] **Step 4: Commit**

```bash
git add day_3/meghana-biryani.jpg
git commit -m "Day 3 Demo 1: add generated biryani image"
```

---

### Task 6: The server + automated tests (`server.py`)

**Files:**
- Create: `day_3/server.py`
- Test: `day_3/test_server.py`

All four static files from Tasks 2–5 must already exist so the route tests can
get `200`s.

- [ ] **Step 1: Write the failing test `day_3/test_server.py`**

```python
from fastapi.testclient import TestClient

import server

client = TestClient(server.app)


def test_root_serves_card_html():
    res = client.get("/")
    assert res.status_code == 200
    assert "Meghana Foods" in res.text


def test_stylesheet_served_with_css_type():
    res = client.get("/style.css")
    assert res.status_code == 200
    assert "text/css" in res.headers["content-type"]


def test_script_served_with_js_type():
    res = client.get("/app.js")
    assert res.status_code == 200
    assert "javascript" in res.headers["content-type"]


def test_image_served_with_image_type():
    res = client.get("/meghana-biryani.jpg")
    assert res.status_code == 200
    assert res.headers["content-type"].startswith("image/")


def test_every_request_is_logged():
    before = server.request_count
    client.get("/")
    client.get("/style.css")
    assert server.request_count == before + 2
```

- [ ] **Step 2: Run the test to verify it fails**

Run from `day_3/` (venv active):

```bash
python -m pytest test_server.py -v
```

Expected: FAIL — `ModuleNotFoundError: No module named 'server'`.

- [ ] **Step 3: Write `day_3/server.py`**

```python
"""Day 3, Demo 1 — the request lifecycle.

A deliberately tiny page (one Swiggy restaurant card) whose every resource is a
separate file, so the browser's Network tab shows the real request waterfall.

This server's only job is to hand back static files — and to log every request
to the terminal, so the terminal shows the same requests you see in DevTools.
"The server answered each one."
"""

from pathlib import Path

from fastapi import FastAPI, Request
from fastapi.staticfiles import StaticFiles

HERE = Path(__file__).parent

app = FastAPI()

request_count = 0


@app.middleware("http")
async def log_requests(request: Request, call_next):
    global request_count
    request_count += 1
    print(f"[{request_count}] -> {request.method} {request.url.path}", flush=True)
    return await call_next(request)


# Serve every file in this directory. `html=True` makes "/" return index.html;
# style.css, app.js and the image are then served at their own paths — each a
# distinct request in the waterfall.
app.mount("/", StaticFiles(directory=HERE, html=True), name="site")
```

- [ ] **Step 4: Run the test to verify it passes**

Run from `day_3/` (venv active):

```bash
python -m pytest test_server.py -v
```

Expected: PASS — all 5 tests green.

- [ ] **Step 5: Commit**

```bash
git add day_3/server.py day_3/test_server.py
git commit -m "Day 3 Demo 1: add static-file server with request logging"
```

---

### Task 7: The runbook (`README.md`)

**Files:**
- Create: `day_3/README.md`

- [ ] **Step 1: Write `day_3/README.md`**

````markdown
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
- `meghana-biryani.jpg` — a generated ~300–500 KB image (the "fills in last"
  beat).
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
````

- [ ] **Step 2: Commit**

```bash
git add day_3/README.md
git commit -m "Day 3 Demo 1: add runbook and demo script"
```

---

### Task 8: Full manual verification

No new files. This task confirms the browser-runtime behaviors the automated
tests can't reach.

- [ ] **Step 1: Start the server**

Run from `day_3/` (venv active):

```bash
uvicorn server:app --host 127.0.0.1 --port 8000 --reload
```

- [ ] **Step 2: Verify the waterfall**

In Chrome: open `http://localhost:8000/`, DevTools → Network → reload. Confirm:
- The card renders (image, Poppins font, orange Like button).
- 6 requests appear (HTML, style.css, app.js, image, fonts.googleapis.com,
  fonts.gstatic.com), plus a `/favicon.ico` request.
- The terminal printed a numbered log line for each served request.

- [ ] **Step 3: Verify the Slow 3G staging**

DevTools → Network → throttling → **Slow 3G** → reload. Confirm the four stages
(unstyled text → styles snap in → image fills in → Like button becomes
clickable). Clicking Like increments the count and turns the button solid.

- [ ] **Step 4: Reset throttling**

DevTools → Network → throttling → **No throttling**. (So the next demo isn't
accidentally slow.)

---

## Self-review notes

- **Spec coverage:** card (Tasks 2–5); 6 requests incl. external font (Task 2);
  render-blocking CSS / FOUC (Task 3 + Task 8); JS-last interactivity
  (Task 4 + Task 8); heavy image (Task 5); server + terminal logging (Task 6);
  Slido beat + waterfall + Slow 3G script + checklist (Task 7); favicon beat
  (Task 7); local-only, no tunnel (Task 7). All spec sections mapped.
- **No placeholders:** every code/command step contains the real content.
- **Type consistency:** `server.app` and `server.request_count` are referenced
  by the tests exactly as defined in Task 6; element ids `like` / `like-count`
  match between `index.html` (Task 2) and `app.js` (Task 4); the image filename
  `meghana-biryani.jpg` matches across Tasks 2, 5, 6, 7.
