# Day 1 Web Demo Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the small set of teaching artifacts (a stdlib hello-world server, a FastAPI restaurants app with HTML rendering, and a runbook) needed to deliver the 20-minute "How the Web Works" demo described in `day_1/docs/superpowers/specs/2026-05-26-day1-web-demo-design.md`.

**Architecture:** Two standalone Python entry points share one port (`8000`) sequentially during the live demo. `hello.py` uses only `http.server` from the standard library (10 lines, no install). `server.py` uses FastAPI and serves two endpoints — `GET /restaurants` returning JSON and `GET /` returning an HTML page whose embedded JavaScript fetches that JSON and renders cards. A module-level integer counter is incremented on each request to both endpoints and surfaced both in the HTML page and the terminal log. A README captures the launch commands, the Cloudflare quick-tunnel command, the ngrok fallback, and the pre-session checklist.

**Tech Stack:** Python 3 (stdlib + FastAPI + Uvicorn), Cloudflare `cloudflared` quick tunnels (primary), ngrok (fallback), Chrome DevTools (for the Swiggy reveal).

**Test strategy:** This is a ~60-line teaching demo with no business logic worth unit-testing. Each task ends with manual verification: run the script, hit the endpoint, observe the expected output. The real acceptance test is the dry-run described in Task 7.

---

## File structure

All files live in `/Users/saainithil/Code/teach/day_1/`:

```
day_1/
├── hello.py              # Task 1 — stdlib http.server, ~10 lines
├── requirements.txt      # Task 2 — fastapi, uvicorn
├── server.py             # Tasks 3-5 — FastAPI app
├── README.md             # Task 6 — run instructions + checklist
└── docs/
    ├── superpowers/
    │   ├── specs/2026-05-26-day1-web-demo-design.md   (already committed)
    │   └── plans/2026-05-26-day1-web-demo.md          (this file)
```

The git repository root is `/Users/saainithil/Code/teach/` (already initialised). All `git` commands below run from that directory, but file paths in the plan are absolute for clarity.

---

## Task 1: Hello World stdlib server

**Goal:** Produce the Act A artifact — a ~10-line script using only the standard library that returns plain text on `GET /`.

**Files:**
- Create: `/Users/saainithil/Code/teach/day_1/hello.py`

- [ ] **Step 1: Create `hello.py` with the minimal stdlib server**

Write exactly this content to `/Users/saainithil/Code/teach/day_1/hello.py`:

```python
from http.server import BaseHTTPRequestHandler, HTTPServer


class Handler(BaseHTTPRequestHandler):
    def do_GET(self):
        self.send_response(200)
        self.send_header("Content-Type", "text/plain")
        self.end_headers()
        self.wfile.write(b"Hello, World!")


if __name__ == "__main__":
    HTTPServer(("0.0.0.0", 8000), Handler).serve_forever()
```

Rationale for each line is for the live demo, not the engineer — keep the file exactly as written. No docstrings, no comments. The students will read every line on screen.

- [ ] **Step 2: Run the server in a foreground terminal**

Run: `python3 /Users/saainithil/Code/teach/day_1/hello.py`

Expected: the process blocks with no output. It is now waiting for requests.

- [ ] **Step 3: Verify the server responds**

In a separate terminal, run: `curl -i http://localhost:8000/`

Expected output:
```
HTTP/1.0 200 OK
Server: BaseHTTP/0.6 Python/3.x.x
Date: ...
Content-Type: text/plain

Hello, World!
```

The original terminal (the one running `hello.py`) should now show a log line like:
```
127.0.0.1 - - [DD/Mon/YYYY HH:MM:SS] "GET / HTTP/1.1" 200 -
```

- [ ] **Step 4: Stop the server**

In the terminal running `hello.py`, press `Ctrl+C`. The process exits cleanly.

- [ ] **Step 5: Commit**

```bash
git -C /Users/saainithil/Code/teach add day_1/hello.py
git -C /Users/saainithil/Code/teach commit -m "Add Act A stdlib hello-world server"
```

---

## Task 2: Python dependencies

**Goal:** Pin the runtime dependencies used by `server.py` so the demo machine has a clean install command.

**Files:**
- Create: `/Users/saainithil/Code/teach/day_1/requirements.txt`

- [ ] **Step 1: Create `requirements.txt`**

Write exactly this content to `/Users/saainithil/Code/teach/day_1/requirements.txt`:

```
fastapi>=0.110,<1.0
uvicorn[standard]>=0.27,<1.0
```

The `uvicorn[standard]` extra installs `watchfiles` so `--reload` works during prep.

- [ ] **Step 2: Install into the active Python environment**

Run: `pip install -r /Users/saainithil/Code/teach/day_1/requirements.txt`

Expected: pip reports successful install of `fastapi`, `uvicorn`, `starlette`, `pydantic`, and their transitive deps. Final line says "Successfully installed ...".

- [ ] **Step 3: Verify imports work**

Run: `python3 -c "import fastapi, uvicorn; print(fastapi.__version__, uvicorn.__version__)"`

Expected: two version numbers printed on one line, no traceback.

- [ ] **Step 4: Commit**

```bash
git -C /Users/saainithil/Code/teach add day_1/requirements.txt
git -C /Users/saainithil/Code/teach commit -m "Add FastAPI + Uvicorn dependencies for Day 1 server"
```

---

## Task 3: FastAPI `/restaurants` JSON endpoint

**Goal:** Stand up the FastAPI app with the `/restaurants` JSON endpoint only. HTML page and counter come in later tasks. This isolates "does the API return JSON" from "does the page render."

**Files:**
- Create: `/Users/saainithil/Code/teach/day_1/server.py`

- [ ] **Step 1: Create `server.py` with the JSON endpoint**

Write exactly this content to `/Users/saainithil/Code/teach/day_1/server.py`:

```python
from fastapi import FastAPI

app = FastAPI()

RESTAURANTS = [
    {
        "name": "Truffles",
        "cuisines": ["American", "Burgers"],
        "rating": 4.5,
        "delivery_time_mins": 30,
        "cost_for_two": 300,
    },
    {
        "name": "Meghana Foods",
        "cuisines": ["Biryani", "Andhra"],
        "rating": 4.3,
        "delivery_time_mins": 40,
        "cost_for_two": 500,
    },
    {
        "name": "Empire Restaurant",
        "cuisines": ["North Indian", "Kebabs"],
        "rating": 4.2,
        "delivery_time_mins": 35,
        "cost_for_two": 400,
    },
    {
        "name": "A2B - Adyar Ananda Bhavan",
        "cuisines": ["South Indian", "Sweets"],
        "rating": 4.4,
        "delivery_time_mins": 25,
        "cost_for_two": 250,
    },
    {
        "name": "Burger King",
        "cuisines": ["Burgers", "American"],
        "rating": 4.1,
        "delivery_time_mins": 30,
        "cost_for_two": 350,
    },
    {
        "name": "Chai Point",
        "cuisines": ["Beverages", "Snacks"],
        "rating": 4.3,
        "delivery_time_mins": 20,
        "cost_for_two": 200,
    },
]


@app.get("/restaurants")
async def get_restaurants():
    return {"restaurants": RESTAURANTS}
```

Notes for the engineer:
- Field names (`name`, `cuisines`, `rating`) deliberately mirror Swiggy's actual API so the Act D side-by-side reads cleanly. Do not rename them.
- Six restaurants is enough to fill the screen without scrolling. Recognisable Indian brands are intentional.

- [ ] **Step 2: Start the server**

Run: `uvicorn --app-dir /Users/saainithil/Code/teach/day_1 server:app --host 0.0.0.0 --port 8000 --reload`

Expected: Uvicorn prints `Uvicorn running on http://0.0.0.0:8000`. The process blocks.

- [ ] **Step 3: Verify `/restaurants` returns JSON**

In a separate terminal, run: `curl -s http://localhost:8000/restaurants | python3 -m json.tool`

Expected: pretty-printed JSON object with one key `restaurants` whose value is an array of 6 objects. First object's `name` is `"Truffles"`.

- [ ] **Step 4: Stop the server**

`Ctrl+C` in the Uvicorn terminal.

- [ ] **Step 5: Commit**

```bash
git -C /Users/saainithil/Code/teach add day_1/server.py
git -C /Users/saainithil/Code/teach commit -m "Add FastAPI /restaurants JSON endpoint"
```

---

## Task 4: HTML page that fetches and renders cards

**Goal:** Add the `GET /` endpoint that returns an HTML page. The page contains inline CSS for restaurant cards and an inline script that calls `fetch('/restaurants')` and inserts cards into the DOM.

**Files:**
- Modify: `/Users/saainithil/Code/teach/day_1/server.py`

- [ ] **Step 1: Add `HTMLResponse` import and the `HTML_PAGE` constant**

Open `/Users/saainithil/Code/teach/day_1/server.py`. Change the first import line from:

```python
from fastapi import FastAPI
```

to:

```python
from fastapi import FastAPI
from fastapi.responses import HTMLResponse
```

Then immediately after the `RESTAURANTS = [...]` block (and before the `@app.get("/restaurants")` decorator), add the following constant:

```python
HTML_PAGE = """<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>Restaurants near you</title>
<style>
  body { font-family: -apple-system, system-ui, sans-serif; max-width: 900px; margin: 2rem auto; padding: 0 1rem; color: #222; }
  h1 { margin-bottom: 0.25rem; }
  .visitor { color: #888; font-size: 0.9rem; margin-bottom: 2rem; }
  .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 1rem; }
  .card { border: 1px solid #e3e3e3; border-radius: 8px; padding: 1rem; background: #fff; }
  .card h2 { margin: 0 0 0.5rem; font-size: 1.1rem; }
  .meta { color: #555; font-size: 0.9rem; line-height: 1.5; }
  .rating { color: #1a8b3a; font-weight: 600; }
</style>
</head>
<body>
<h1>Restaurants near you</h1>
<div class="visitor">You are visitor #__COUNT__</div>
<div id="grid" class="grid"></div>
<script>
  fetch('/restaurants')
    .then(r => r.json())
    .then(data => {
      const grid = document.getElementById('grid');
      for (const r of data.restaurants) {
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
          <h2>${r.name}</h2>
          <div class="meta">
            <div>${r.cuisines.join(', ')}</div>
            <div><span class="rating">★ ${r.rating}</span> &middot; ${r.delivery_time_mins} mins &middot; ₹${r.cost_for_two} for two</div>
          </div>
        `;
        grid.appendChild(card);
      }
    });
</script>
</body>
</html>
"""
```

- [ ] **Step 2: Add the `GET /` route**

At the bottom of the file, after the existing `@app.get("/restaurants")` handler, append:

```python


@app.get("/", response_class=HTMLResponse)
async def home():
    return HTMLResponse(HTML_PAGE.replace("__COUNT__", "0"))
```

The counter is hard-coded to `0` for now; Task 5 makes it live.

- [ ] **Step 3: Start the server**

Run: `uvicorn --app-dir /Users/saainithil/Code/teach/day_1 server:app --host 0.0.0.0 --port 8000 --reload`

- [ ] **Step 4: Verify the HTML page renders cards**

Open `http://localhost:8000/` in a browser.

Expected:
- Page title "Restaurants near you" at the top.
- Line "You are visitor #0" under the title.
- A grid of 6 cards. Each card shows the restaurant name, its cuisines, a green star rating, the delivery time, and the cost for two.
- No console errors in DevTools.

Also verify `http://localhost:8000/restaurants` still returns the JSON unchanged.

- [ ] **Step 5: Stop the server and commit**

`Ctrl+C` to stop Uvicorn, then:

```bash
git -C /Users/saainithil/Code/teach add day_1/server.py
git -C /Users/saainithil/Code/teach commit -m "Add HTML page that renders restaurant cards from /restaurants"
```

---

## Task 5: Live hit counter (server-side + terminal log)

**Goal:** Increment a module-level counter on every request to either endpoint. Substitute the current count into the HTML on each render. Log every request to the terminal in the format `[N] <client_ip> -> <path>` so the teacher can show the "wave of requests" during Act C.

**Files:**
- Modify: `/Users/saainithil/Code/teach/day_1/server.py`

- [ ] **Step 1: Add the `Request` import and the counter variable**

In `/Users/saainithil/Code/teach/day_1/server.py`, update the FastAPI import line from:

```python
from fastapi import FastAPI
```

to:

```python
from fastapi import FastAPI, Request
```

Then immediately after `app = FastAPI()`, add:

```python
hit_count = 0
```

- [ ] **Step 2: Update `get_restaurants` to count and log**

Replace the existing `get_restaurants` handler:

```python
@app.get("/restaurants")
async def get_restaurants():
    return {"restaurants": RESTAURANTS}
```

with:

```python
@app.get("/restaurants")
async def get_restaurants(request: Request):
    global hit_count
    hit_count += 1
    client_ip = request.client.host if request.client else "unknown"
    print(f"[{hit_count}] {client_ip} -> /restaurants", flush=True)
    return {"restaurants": RESTAURANTS}
```

- [ ] **Step 3: Update `home` to count, log, and substitute the live count**

Replace the existing `home` handler:

```python
@app.get("/", response_class=HTMLResponse)
async def home():
    return HTMLResponse(HTML_PAGE.replace("__COUNT__", "0"))
```

with:

```python
@app.get("/", response_class=HTMLResponse)
async def home(request: Request):
    global hit_count
    hit_count += 1
    client_ip = request.client.host if request.client else "unknown"
    print(f"[{hit_count}] {client_ip} -> /", flush=True)
    return HTMLResponse(HTML_PAGE.replace("__COUNT__", str(hit_count)))
```

- [ ] **Step 4: Start the server**

Run: `uvicorn --app-dir /Users/saainithil/Code/teach/day_1 server:app --host 0.0.0.0 --port 8000 --reload`

- [ ] **Step 5: Verify the counter and log**

In a browser, visit `http://localhost:8000/` three times (reload twice after the initial load).

Expected:
- First load shows "You are visitor #1" (or "#2" — Uvicorn's request logger may also issue a HEAD/favicon; that's fine, just confirm the number increases).
- The Uvicorn terminal shows lines like:
  ```
  [1] 127.0.0.1 -> /
  [2] 127.0.0.1 -> /
  ```
- Each `curl -s http://localhost:8000/restaurants` also adds a line `[N] 127.0.0.1 -> /restaurants` and bumps the count.

- [ ] **Step 6: Stop the server and commit**

`Ctrl+C`, then:

```bash
git -C /Users/saainithil/Code/teach add day_1/server.py
git -C /Users/saainithil/Code/teach commit -m "Add hit counter and per-request terminal logging"
```

---

## Task 6: README with run instructions and pre-session checklist

**Goal:** Capture every command the teacher will run during prep and during the live session, plus the ngrok fallback and the deflection notes from the spec. The README is the single source of truth at session time.

**Files:**
- Create: `/Users/saainithil/Code/teach/day_1/README.md`

- [ ] **Step 1: Write the README**

Write exactly this content to `/Users/saainithil/Code/teach/day_1/README.md`:

````markdown
# Day 1 — How the Web Works (Demo)

Companion artifacts for the 20-minute demo described in
`docs/superpowers/specs/2026-05-26-day1-web-demo-design.md`.

## What's here

- `hello.py` — Act A: stdlib `http.server` that returns plain text.
- `server.py` — Acts B and C: FastAPI app with `GET /restaurants` (JSON)
  and `GET /` (HTML page that fetches and renders cards). Hit counter
  is visible both in the page and in the terminal log.
- `requirements.txt` — `fastapi` and `uvicorn`.

## One-time setup

```bash
# Python deps
pip install -r requirements.txt

# Cloudflare quick-tunnel (primary)
brew install cloudflared
cloudflared --version

# ngrok (fallback) — only if you don't already have it
brew install ngrok
ngrok config add-authtoken <your-token>   # only required for ngrok
```

## Running the demo

### Act A — Hello World (localhost)

```bash
python3 hello.py
```

Then in a browser: `http://localhost:8000/`. Shows the text "Hello, World!".
`Ctrl+C` to stop when done.

### Acts B and C — FastAPI restaurants + going public

```bash
uvicorn --app-dir . server:app --host 0.0.0.0 --port 8000 --reload
```

Endpoints:
- `http://localhost:8000/restaurants` — raw JSON.
- `http://localhost:8000/` — HTML page with restaurant cards and the live
  visitor counter.

In a **second terminal**, expose the same port via Cloudflare:

```bash
cloudflared tunnel --url http://localhost:8000
```

Cloudflare prints a public URL such as
`https://swift-llama-42.trycloudflare.com`. Drop that URL in the Zoom chat.

**Fallback** if Cloudflare misbehaves:

```bash
ngrok http 8000
```

ngrok prints a public URL such as `https://abc123.ngrok-free.app`.
Note: ngrok free shows an interstitial click-through on first visit.

### Act D — Swiggy reveal

In Chrome:
1. Open `https://www.swiggy.com/restaurants`.
2. `Cmd+Opt+I` to open DevTools.
3. Network tab → filter to "Fetch/XHR" → reload the page.
4. Find the call to `dapi/restaurants/list/v5/...` → Response tab → show
   the JSON next to `http://localhost:8000/restaurants`.

## Pre-session checklist (run earlier in the day)

- [ ] `pip install -r requirements.txt` succeeds.
- [ ] `python3 hello.py` runs and serves at `http://localhost:8000/`.
- [ ] `uvicorn server:app ...` runs and serves cards at
      `http://localhost:8000/`.
- [ ] `cloudflared tunnel --url http://localhost:8000` returns a public
      URL.
- [ ] Open the public URL on a phone over **mobile data** (not home
      WiFi) — cards render.
- [ ] `ngrok http 8000` works as a fallback (or you know your token is
      configured).
- [ ] Swiggy DevTools workflow practised once. Pre-screenshot the
      Network tab in case the live page misbehaves.
- [ ] Display sleep / Caffeinate enabled for the session duration.

## Deflection lines for off-topic questions

- HTTPS / TLS, HTTP methods, status codes, REST, request headers — all
  *"That's session 2 or 3. Today we just want the skeleton."*
- Why can't you use your laptop's public IP? — short NAT aside, see the
  spec.
- DNS internals — *"Lookup table, more in a later session."*
````

- [ ] **Step 2: Commit**

```bash
git -C /Users/saainithil/Code/teach add day_1/README.md
git -C /Users/saainithil/Code/teach commit -m "Add Day 1 README with run instructions and pre-session checklist"
```

---

## Task 7: Full dry-run smoke test

**Goal:** Walk the demo end to end, exactly as the teacher will, and confirm every step in the spec works. This is the acceptance gate — do not skip.

**Files:** none modified.

- [ ] **Step 1: Verify Act A end to end**

```bash
python3 /Users/saainithil/Code/teach/day_1/hello.py
```

In another terminal:
```bash
curl -s http://localhost:8000/
```
Expected stdout: `Hello, World!`

`Ctrl+C` to stop.

- [ ] **Step 2: Verify Acts B and C end to end (local)**

```bash
uvicorn --app-dir /Users/saainithil/Code/teach/day_1 server:app --host 0.0.0.0 --port 8000 --reload
```

In a browser:
- `http://localhost:8000/restaurants` → JSON with 6 restaurants.
- `http://localhost:8000/` → 6 cards, counter visible and increments on
  reload.
- Terminal shows `[N] 127.0.0.1 -> /` lines per request.

Leave Uvicorn running for the next step.

- [ ] **Step 3: Verify the Cloudflare tunnel**

In a second terminal:
```bash
cloudflared tunnel --url http://localhost:8000
```

Expected: Cloudflare prints a banner including a line like
`Your quick tunnel has been created! Visit it at: https://<random>.trycloudflare.com`.

Open that URL **from a phone on mobile data** (to confirm it really
works from outside your home network). The restaurant cards should
render and the counter should increment on the Uvicorn terminal.

`Ctrl+C` to stop the tunnel, then `Ctrl+C` to stop Uvicorn.

- [ ] **Step 4: Verify the Swiggy reveal step**

In Chrome, open `https://www.swiggy.com/restaurants` with DevTools
(`Cmd+Opt+I`) → Network tab → filter "Fetch/XHR" → reload.

Find a request whose name starts with `list/v5`. Click it → Response
tab. Confirm the response is JSON and contains restaurant objects with
fields including `name`, `cuisines`, and a rating field. (Swiggy's
exact path nests these under `data.cards[].card.card.info` — point at
the words, not the path.)

If Swiggy has changed the call shape so badly that the reveal no
longer reads cleanly, fall back to a pre-recorded screenshot saved
earlier in the day.

- [ ] **Step 5: Final commit (no-op if nothing changed)**

Confirm the working tree is clean:

```bash
git -C /Users/saainithil/Code/teach status
```

Expected: `nothing to commit, working tree clean`. If anything is
modified, investigate before considering the plan done.
