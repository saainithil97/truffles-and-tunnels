# Day 3 Demo 3 — Render Blocking Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship `day_3/demo_3/` — the same Swiggy page served three ways (blocking `<head>` script, `<head>` + `defer`, end-of-`<body>`) plus a deliberately slow script, so Slow 3G makes render-blocking visceral.

**Architecture:** Three near-identical inline-CSS HTML pages differing only in the `<script>` tag, one `slow.js` that blocks ~2s synchronously, an index page, and a small FastAPI static server (Demo 1 pattern) with per-request logging. Self-contained with its own venv, like `demo_1/`.

**Tech Stack:** Static HTML/CSS/JS; FastAPI + uvicorn + Starlette `StaticFiles`; pytest + httpx.

**Testing approach:** The server and the page markup get automated pytest coverage (serving + the script-tag differences that define the demo). The actual blank/freeze render behaviour is a browser-runtime effect verified by a manual load — it has no meaningful unit test.

---

### Task 1: Dependencies + venv

**Files:**
- Create: `day_3/demo_3/requirements.txt`

- [ ] **Step 1: Write `day_3/demo_3/requirements.txt`**

```text
fastapi
uvicorn[standard]
httpx
pytest
```

- [ ] **Step 2: Create the folder, venv, install**

Run from repo root `/Users/saainithil/Code/teach`:

```bash
mkdir -p day_3/demo_3
cd day_3/demo_3
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```
If pip is blocked by sandbox/network, retry with the Bash tool param `dangerouslyDisableSandbox: true`.

- [ ] **Step 3: Confirm `.venv/` is gitignored**

Run from repo root:
```bash
git check-ignore day_3/demo_3/.venv && echo "ignored OK"
```
Expected: prints the path then `ignored OK`.

- [ ] **Step 4: Commit**

```bash
git add day_3/demo_3/requirements.txt
git commit -m "Day 3 Demo 3: add Python dependencies"
```

---

### Task 2: The slow script (`slow.js`)

**Files:**
- Create: `day_3/demo_3/slow.js`

- [ ] **Step 1: Write `day_3/demo_3/slow.js`**

```javascript
// Demo 3: a deliberately slow script. It blocks the main thread with a ~2s
// synchronous busy-loop — no network needed, so the block is guaranteed. While
// this loop runs, the browser can do nothing else: no parsing, no painting, no
// clicks. That is what "render-blocking" feels like.
(function () {
  var BLOCK_MS = 2000;
  var start = Date.now();
  console.log("[slow.js] started — blocking for " + BLOCK_MS + "ms");

  // Spin until BLOCK_MS has elapsed. (A real page would never do this on
  // purpose; we do it to simulate a heavy synchronous script.)
  while (Date.now() - start < BLOCK_MS) {
    /* burn CPU */
  }

  var took = Date.now() - start;
  console.log("[slow.js] finished after " + took + "ms");

  function addBanner() {
    var d = document.createElement("div");
    d.className = "done";
    d.textContent = "✓ slow.js finished after " + took + "ms";
    document.body.appendChild(d);
  }

  // When this runs in <head>, <body> doesn't exist yet — wait for it. Otherwise
  // (end of body, or defer) the body is ready, so add the banner now.
  if (document.body) {
    addBanner();
  } else {
    document.addEventListener("DOMContentLoaded", addBanner);
  }
})();
```

- [ ] **Step 2: Commit**

```bash
git add day_3/demo_3/slow.js
git commit -m "Day 3 Demo 3: add ~2s blocking slow.js"
```

---

### Task 3: The three pages + index

**Files:**
- Create: `day_3/demo_3/version-a.html`
- Create: `day_3/demo_3/version-b.html`
- Create: `day_3/demo_3/version-c.html`
- Create: `day_3/demo_3/index.html`

The three version pages are **identical except the `<script>` tag**. A and B
differ only by the `defer` attribute (a clean one-line diff); C has no script in
`<head>` and a plain script just before `</body>`.

- [ ] **Step 1: Write `day_3/demo_3/version-a.html`** (blocking script in `<head>`)

```html
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Render blocking — Meghana Foods</title>
  <style>
    * { box-sizing: border-box; }
    body { margin: 0; min-height: 100vh; display: grid; place-items: center;
      background: #f4f4f5; font-family: -apple-system, system-ui, sans-serif; color: #1c1c1c; }
    .card { width: 380px; background: #fff; border-radius: 16px; padding: 24px 26px;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.12); }
    h1 { margin: 0 0 4px; font-size: 1.5rem; }
    .sub { margin: 0 0 14px; color: #686b78; }
    .body { margin: 0; color: #333; line-height: 1.5; }
    code { background: #f0f0f0; padding: 1px 5px; border-radius: 4px; }
    .done { margin-top: 16px; padding: 8px 12px; background: #1a8b3a; color: #fff;
      border-radius: 8px; font-weight: 600; }
  </style>
  <script src="slow.js"></script>
</head>
<body>
  <main class="card">
    <h1>Meghana Foods</h1>
    <p class="sub">Biryani, Andhra · ★ 4.3 · 40 mins · ₹500 for two</p>
    <p class="body">Plain HTML with inline CSS — the only external resource is
      <code>slow.js</code>. So if this page sits blank, there's exactly one thing
      to blame: the script.</p>
  </main>
</body>
</html>
```

- [ ] **Step 2: Write `day_3/demo_3/version-b.html`** (identical to A but `defer`)

```html
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Render blocking — Meghana Foods</title>
  <style>
    * { box-sizing: border-box; }
    body { margin: 0; min-height: 100vh; display: grid; place-items: center;
      background: #f4f4f5; font-family: -apple-system, system-ui, sans-serif; color: #1c1c1c; }
    .card { width: 380px; background: #fff; border-radius: 16px; padding: 24px 26px;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.12); }
    h1 { margin: 0 0 4px; font-size: 1.5rem; }
    .sub { margin: 0 0 14px; color: #686b78; }
    .body { margin: 0; color: #333; line-height: 1.5; }
    code { background: #f0f0f0; padding: 1px 5px; border-radius: 4px; }
    .done { margin-top: 16px; padding: 8px 12px; background: #1a8b3a; color: #fff;
      border-radius: 8px; font-weight: 600; }
  </style>
  <script src="slow.js" defer></script>
</head>
<body>
  <main class="card">
    <h1>Meghana Foods</h1>
    <p class="sub">Biryani, Andhra · ★ 4.3 · 40 mins · ₹500 for two</p>
    <p class="body">Plain HTML with inline CSS — the only external resource is
      <code>slow.js</code>. So if this page sits blank, there's exactly one thing
      to blame: the script.</p>
  </main>
</body>
</html>
```

- [ ] **Step 3: Write `day_3/demo_3/version-c.html`** (no head script; plain script before `</body>`)

```html
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Render blocking — Meghana Foods</title>
  <style>
    * { box-sizing: border-box; }
    body { margin: 0; min-height: 100vh; display: grid; place-items: center;
      background: #f4f4f5; font-family: -apple-system, system-ui, sans-serif; color: #1c1c1c; }
    .card { width: 380px; background: #fff; border-radius: 16px; padding: 24px 26px;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.12); }
    h1 { margin: 0 0 4px; font-size: 1.5rem; }
    .sub { margin: 0 0 14px; color: #686b78; }
    .body { margin: 0; color: #333; line-height: 1.5; }
    code { background: #f0f0f0; padding: 1px 5px; border-radius: 4px; }
    .done { margin-top: 16px; padding: 8px 12px; background: #1a8b3a; color: #fff;
      border-radius: 8px; font-weight: 600; }
  </style>
</head>
<body>
  <main class="card">
    <h1>Meghana Foods</h1>
    <p class="sub">Biryani, Andhra · ★ 4.3 · 40 mins · ₹500 for two</p>
    <p class="body">Plain HTML with inline CSS — the only external resource is
      <code>slow.js</code>. So if this page sits blank, there's exactly one thing
      to blame: the script.</p>
  </main>
  <script src="slow.js"></script>
</body>
</html>
```

- [ ] **Step 4: Write `day_3/demo_3/index.html`**

```html
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Demo 3 — Render blocking</title>
  <style>
    body { font-family: -apple-system, system-ui, sans-serif; max-width: 640px;
      margin: 3rem auto; padding: 0 1rem; color: #222; line-height: 1.55; }
    h1 { margin-bottom: 0.25rem; }
    a { color: #cc5200; font-weight: 600; }
    li { margin: 0.6rem 0; }
    code { background: #f0f0f0; padding: 1px 5px; border-radius: 4px; }
  </style>
</head>
<body>
  <h1>Demo 3 — Why order matters</h1>
  <p>Same page, three ways. They differ only in where the
    <code>&lt;script&gt;</code> tag sits. Turn on <strong>Slow 3G</strong>
    (DevTools → Network → throttling) and load each:</p>
  <ul>
    <li><a href="/version-a.html">Version A</a> — blocking script in
      <code>&lt;head&gt;</code>. Page stays blank until the script loads and runs.</li>
    <li><a href="/version-b.html">Version B</a> — <code>&lt;head&gt;</code> script
      with <code>defer</code>. Renders immediately; the script runs after parsing.</li>
    <li><a href="/version-c.html">Version C</a> — plain script at the end of
      <code>&lt;body&gt;</code>. Renders first, then freezes while the script runs.</li>
  </ul>
  <p>Open the Console to see <code>slow.js</code> log when it starts and finishes.</p>
</body>
</html>
```

- [ ] **Step 5: Verify A and B differ by exactly one line (the `defer`)**

Run from `day_3/demo_3/`:
```bash
diff version-a.html version-b.html
```
Expected: a single changed line — `<script src="slow.js"></script>` vs
`<script src="slow.js" defer></script>`.

- [ ] **Step 6: Commit**

```bash
git add day_3/demo_3/version-a.html day_3/demo_3/version-b.html day_3/demo_3/version-c.html day_3/demo_3/index.html
git commit -m "Day 3 Demo 3: add the three script-placement pages + index"
```

---

### Task 4: Server + tests (`server.py`)

**Files:**
- Create: `day_3/demo_3/server.py`
- Test: `day_3/demo_3/test_server.py`

All HTML files and `slow.js` already exist (Tasks 2–3), so the route tests get 200s.

- [ ] **Step 1: Write the failing test `day_3/demo_3/test_server.py`**

```python
from fastapi.testclient import TestClient

import server

client = TestClient(server.app)


def test_index_serves():
    res = client.get("/")
    assert res.status_code == 200
    assert "Why order matters" in res.text


def test_all_three_versions_serve():
    for name in ("version-a.html", "version-b.html", "version-c.html"):
        res = client.get("/" + name)
        assert res.status_code == 200
        assert "Meghana Foods" in res.text


def test_slow_js_served_as_javascript():
    res = client.get("/slow.js")
    assert res.status_code == 200
    assert "javascript" in res.headers["content-type"]


def test_version_a_has_blocking_head_script():
    html = client.get("/version-a.html").text
    head = html.split("</head>")[0]
    assert '<script src="slow.js"></script>' in head  # in head, no defer


def test_version_b_head_script_has_defer():
    html = client.get("/version-b.html").text
    head = html.split("</head>")[0]
    assert 'src="slow.js" defer' in head


def test_version_c_script_is_after_body_content():
    html = client.get("/version-c.html").text
    head = html.split("</head>")[0]
    assert "slow.js" not in head  # not in <head>
    assert html.index("Meghana Foods") < html.index('src="slow.js"')
```

- [ ] **Step 2: Run the test to verify it fails**

Run from `day_3/demo_3/` (venv active):
```bash
python -m pytest test_server.py -v
```
Expected: FAIL — `ModuleNotFoundError: No module named 'server'`.

- [ ] **Step 3: Write `day_3/demo_3/server.py`**

```python
"""Day 3, Demo 3 — render blocking.

The same Swiggy page served three ways (version-a/b/c.html), differing only in
where the <script> tag sits. This server just hands back the static files and
logs every request, so you can watch when slow.js is fetched relative to the
page — in the terminal and in the Network tab.
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


# Serve every file in this directory. `html=True` makes "/" return index.html.
app.mount("/", StaticFiles(directory=HERE, html=True), name="site")
```

- [ ] **Step 4: Run the test to verify it passes**

Run from `day_3/demo_3/` (venv active):
```bash
python -m pytest test_server.py -v
```
Expected: PASS — 6 tests green.

- [ ] **Step 5: Commit**

```bash
git add day_3/demo_3/server.py day_3/demo_3/test_server.py
git commit -m "Day 3 Demo 3: add static server with request logging + tests"
```

---

### Task 5: The runbook (`README.md`)

**Files:**
- Create: `day_3/demo_3/README.md`

- [ ] **Step 1: Write `day_3/demo_3/README.md`**

````markdown
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
````

- [ ] **Step 2: Commit**

```bash
git add day_3/demo_3/README.md
git commit -m "Day 3 Demo 3: add runbook"
```

---

### Task 6: Wire into the Day 3 index + full verification

**Files:**
- Modify: `day_3/README.md`

- [ ] **Step 1: Add Demo 3 to the Day 3 index**

In `day_3/README.md`, under the `## Demos` list, after the Demo 2 bullet, add:

```markdown
- **[Demo 3 — "Why order matters"](demo_3/README.md)** — render blocking. The
  same page served three ways (blocking `<head>` script, `<head>` + `defer`,
  end-of-`<body>`); Slow 3G makes the cost of script placement impossible to
  miss.
```

- [ ] **Step 2: Run the tests from the new location**

Run from `day_3/demo_3/` (venv active):
```bash
python -m pytest -q
```
Expected: `6 passed`.

- [ ] **Step 3: Smoke-test serving**

Run from `day_3/demo_3/` (venv active):
```bash
(uvicorn server:app --host 127.0.0.1 --port 8000 > /tmp/d3.log 2>&1 &) && sleep 3
for p in "/" "/version-a.html" "/version-b.html" "/version-c.html" "/slow.js"; do
  curl -s -o /dev/null -w "$p -> %{http_code} %{content_type}\n" "http://127.0.0.1:8000$p"
done
pkill -f "uvicorn server:app"; sleep 1
```
Expected: all `200`; `slow.js` content-type contains `javascript`.

- [ ] **Step 4: Commit**

```bash
git add day_3/README.md
git commit -m "Day 3: link Demo 3 from the index"
```

---

## Self-review notes

- **Spec coverage:** slow.js ~2s busy-loop + guarded banner (Task 2); three
  pages differing only in the script tag, A↔B one-line diff (Task 3); index
  (Task 3); server with request logging (Task 4); tests for serving + the
  script-tag differences (Task 4); runbook with Slido + full flow + why + Demo 1
  tie-back (Task 5); index wiring + verification (Task 6). All spec sections
  mapped.
- **No placeholders:** every code/command step is complete.
- **Consistency:** `slow.js` filename, the exact head script strings
  (`<script src="slow.js"></script>` for A, `src="slow.js" defer` for B), and
  the "Meghana Foods"/"Why order matters" markers match between the page files
  (Task 3) and the test assertions (Task 4); the spec path used in the runbook
  (`../docs/superpowers/specs/2026-05-28-day3-demo3-render-blocking-design.md`)
  matches the committed spec filename.
