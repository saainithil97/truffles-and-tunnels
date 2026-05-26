# Day 1 — "How the Web Works" Demo

**Audience:** ~130 second-year CS students, joining remotely from home at 6 PM.
**Format:** Lecture-demo over video call. Light follow-along (students open a URL on their phones once); no setup expected on their end.
**Slot:** 20 minutes inside a 60-minute session. The first 40 minutes are a separate case study on decomposing Swiggy into capabilities; this demo lives at the end and connects to it.
**Single sentence the demo answers:** *"You decomposed Swiggy into capabilities. A capability, mechanically, is a server that answers requests. Let me show you one."*

## Goals

1. Students leave with a correct **mental model** of the web: a client sends a request to a server, the server sends back a response, and the browser renders the response.
2. The model is built from things students **saw with their own eyes**, not from a vocabulary list.
3. Students recognise that **Swiggy is doing the same thing** they just watched, only at scale.

## Non-goals

- Teaching HTTP methods, status codes, headers, HTTPS/TLS, REST, packet-level networking, or DNS internals. These belong in later sessions.
- Hands-on coding by students. They have laptops/phones but no setup.

## Constraints

- **20 minutes total**, including a 2-minute buffer.
- **Mixed audience**: some students have built small web things, others have never run a server.
- **Remote delivery**: students are on their own networks at home, so any "students hit my server" moment must work over the public internet.
- **Minimal jargon on Day 1**: only introduce a term when a student has *seen* the thing it labels.

## Demo arc

Four acts, four ramps in abstraction. Each act introduces at most one or two new ideas, and every idea is grounded in something visible on screen.

| Act | Duration | Tech | What's on screen | Concepts introduced |
|---|---|---|---|---|
| **A. Hello World** | ~3 min | Python stdlib `http.server` | A ~10-line script in an editor, a terminal running the script, a browser hitting `http://localhost:8000` and showing the text "Hello, World!" | server, request, response, port |
| **B. Make it real** | ~5 min | FastAPI on the same `localhost:8000` | `GET /restaurants` returning JSON; `GET /` returning an HTML page that fetches `/restaurants` and renders restaurant cards | API, JSON, client/server |
| **C. Go public** | ~6 min | Cloudflare quick tunnel pointed at `localhost:8000` | A public HTTPS URL dropped in chat; students open it on phones; terminal shows the wave of incoming requests; the in-page hit counter climbs | internet, IP, tunnel (and NAT aside if asked) |
| **D. Swiggy reveal** | ~4 min | Chrome DevTools on `swiggy.com/restaurants` | The Network tab filtered to Fetch/XHR; the response JSON of Swiggy's `dapi/restaurants/list/v5` call; side-by-side comparison with our `/restaurants` response | DNS, reinforcement of every prior term |

Remaining ~2 minutes are buffer for transitions, one or two questions, or the NAT aside.

### Act A — Hello World (~3 min)

A bare-minimum Python script, no external libraries, returns plain text:

```python
from http.server import BaseHTTPRequestHandler, HTTPServer

class Handler(BaseHTTPRequestHandler):
    def do_GET(self):
        self.send_response(200)
        self.send_header("Content-Type", "text/plain")
        self.end_headers()
        self.wfile.write(b"Hello, World!")

HTTPServer(("0.0.0.0", 8000), Handler).serve_forever()
```

Steps:
1. Show the file open in an editor — every line is readable.
2. Run `python3 hello.py` in a terminal. The script blocks, signalling "I'm waiting."
3. Open `http://localhost:8000` in a browser. Text appears.
4. Reload a few times. Each reload prints a line in the terminal (default `BaseHTTPRequestHandler` logging).

Terms named here (each in one sentence, after the visible behaviour):
- **Server**: a program that waits and answers when something asks it.
- **Request / response**: the asking and the answer.
- **Port**: the `:8000` is the apartment number on the machine — one laptop can run many servers, the port picks which one.

No other concepts. If a student asks about HTML, JSON, or APIs, defer: *"In 2 minutes."*

### Act B — Make it real (~5 min)

Stop the stdlib script. Start FastAPI on the same port `8000`. (Same port matters in Act C — see below.)

Two endpoints:

- `GET /restaurants` → returns JSON of the form:
  ```json
  {
    "restaurants": [
      {"name": "Truffles", "cuisines": ["American", "Burgers"], "rating": 4.5,
       "delivery_time_mins": 30, "cost_for_two": 300},
      {"name": "Meghana Foods", "cuisines": ["Biryani", "Andhra"], "rating": 4.3,
       "delivery_time_mins": 40, "cost_for_two": 500}
    ]
  }
  ```
  Field names (`name`, `cuisines`, `rating`) deliberately mirror Swiggy's actual API for the Act D payoff.

- `GET /` → returns a small HTML page with a `<script>` that calls `fetch('/restaurants')` and renders cards into the DOM. Page also displays a hit counter (server-side global, incremented on each request).

Steps:
1. Open `http://localhost:8000/restaurants` → show raw JSON. *"This is the data. No styling. Just facts."*
2. Open `http://localhost:8000/` → cards appear. *"Same data, drawn as a page. The page asked the server for `/restaurants` and rendered each entry as a card."*
3. Reload `/` a couple of times. Counter increments. Terminal log lines appear for each request.

Terms named here:
- **API**: a server endpoint that returns data. Our `/restaurants` is an API.
- **JSON**: the data format we just saw — keys and values in braces.
- **Client / server**: name the pair once. The browser is the client. The laptop is the server. *Do not* say REST yet.

### Act C — Go public (~6 min)

Run `cloudflared tunnel --url http://localhost:8000` in a second terminal. Cloudflare prints a public URL like `https://swift-llama-42.trycloudflare.com`. Drop the URL in the Zoom chat.

Steps:
1. *"Open it on your phone right now."* Pause for ~10 seconds.
2. Watch the terminal. Log lines stream in — each line a different IP from a different student. The hit counter climbs visibly.
3. Switch to a tab showing the page on the public URL. Counter reads "Visitor #87, #88, #89…" climbing.
4. *Wow moment beat*: let the silence sit. *"Every line you see is one of you. From your home WiFi, your hostel, your mobile data. All hitting this laptop in my room."*
5. (Optional, only if a student asks "why couldn't we just use your IP?") The **NAT aside**:
   > "Your laptop has an IP like `192.168.x.x`, but so does mine — that's a *private* IP, it only means something inside your house. The IP you see when you Google 'what's my IP' is your router's IP, and even that's often shared with hundreds of customers by the ISP. So even if you tried to type my router's IP, your packet would reach my router and the router wouldn't know which device to forward it to. Cloudflare solves this by making my laptop reach out to them first, and routing traffic back through that open connection."

Terms named here:
- **Internet**: the public network connecting all our home networks.
- **IP**: the address of a machine on a network. Sketched, not deep-dived.
- **Tunnel**: what Cloudflare set up — a way for the public internet to reach a private laptop.

### Act D — Swiggy reveal (~4 min)

Open `https://www.swiggy.com/restaurants` in a browser with DevTools already open. Network tab, filter set to Fetch/XHR.

Steps:
1. Reload the page. Watch the Network tab fill with requests.
2. Find the request to `dapi/restaurants/list/v5/...`. Click it → Response tab → show the JSON.
3. Open Act B's `/restaurants` response side-by-side. Point at the matching field names: `name`, `cuisines`, `rating`.
4. *"This capability — 'show restaurants' — that you decomposed an hour ago: this is what it is. A server returns JSON. A browser draws cards."*
5. **DNS** in one breath: *"When you typed `swiggy.com`, your browser first asked 'where is `swiggy.com`?' and got back an IP. That lookup is called DNS. We didn't see DNS for our laptop demo because Cloudflare gave us a real domain."*
6. Close: *"That's how the web works. The rest of the semester is details."*

## File structure

```
day_1/
├── hello.py              # Act A — stdlib http.server, ~10 lines
├── server.py             # Acts B-C — FastAPI: GET /restaurants + GET /
├── requirements.txt      # fastapi, uvicorn
├── README.md             # how to run + cloudflared command + ngrok fallback
└── docs/
    └── superpowers/
        └── specs/
            └── 2026-05-26-day1-web-demo-design.md
```

### `server.py` shape (~60 lines)

- Module-level constant `RESTAURANTS`: a list of ~6 restaurant dicts with fields matching Swiggy.
- Module-level `hit_count` integer for the counter.
- Module-level `HTML_PAGE` string containing the HTML/CSS/JS for the cards page.
- `GET /restaurants`: increments counter, logs `[count] client_ip → /restaurants`, returns `{"restaurants": RESTAURANTS}`.
- `GET /`: increments counter, logs, returns `HTML_PAGE` with the counter substituted in.
- Run with `uvicorn server:app --host 0.0.0.0 --port 8000 --reload`.

### HTML page shape (~40 lines)

- A heading ("Restaurants near you" or similar).
- A visible "You are visitor #N" line.
- A `<script>` block that on page load does `fetch('/restaurants')`, then for each restaurant builds a card with name, cuisines, rating (with a ⭐ glyph), delivery time, and cost for two.
- Minimal inline CSS — clean enough to look intentional, simple enough that students don't get distracted by it.

## Pre-session checklist

1. `pip install fastapi uvicorn` (in a venv or system Python).
2. Install `cloudflared` (`brew install cloudflared` on macOS). Verify with `cloudflared --version`.
3. Dry-run the whole 20-minute flow once. Most importantly: run `cloudflared tunnel --url http://localhost:8000`, get the URL, open it on a phone over mobile data, confirm restaurant cards render.
4. Install `ngrok` as fallback. If you have an auth token, configure it (`ngrok config add-authtoken <token>`).
5. Bookmark `https://www.swiggy.com/restaurants`. Pre-open DevTools, set Network tab filter to "Fetch/XHR".
6. Disable display sleep on the demo laptop for the session duration.

## Risks and mitigations

| Risk | Mitigation |
|---|---|
| Cloudflare tunnel fails to start (provider issue). | Have `ngrok http 8000` ready as fallback. Practice both commands. |
| Tunnel URL changes mid-demo if the tunnel restarts. | Start the tunnel once at the start of Act C and do not restart it. |
| Swiggy changes their DevTools-visible API names by demo day. | Take a screenshot of the Network tab earlier in the day as a backup slide. |
| Counter shows only 2–3 visitors because few students open the URL. | Encourage opens twice: drop the URL, wait, then ask everyone to refresh. |
| A student asks about HTTPS / REST / status codes / methods. | Pre-baked deflection: *"That's exactly what we'll cover in session 2 or 3 — today we just want the skeleton."* |
| Demo runs over 20 minutes. | Use the 2-min buffer for slack. If still over, cut the NAT aside — it is the most cuttable element. |
| Laptop sleeps mid-demo. | Caffeinate or equivalent enabled. Pre-checked in dry run. |

## Success criteria

The session is a success if, when asked at the end "what is a website, mechanically?", a representative student can answer something like:
> *"A server is a program somewhere on the internet that answers requests. When my browser opens a page, it asks the server for the page, then asks again for the data (JSON), then draws it on screen. Swiggy is doing this; my teacher's laptop was doing this."*

That answer is the design's only real target. Everything else (vocabulary, code recall, network details) is downstream.

## Deferred to later sessions

- HTTP methods (GET vs POST vs others)
- HTTP status codes
- Request/response headers
- HTTPS and TLS
- REST as a concept and design style
- Authentication and sessions
- Databases behind APIs
- DNS internals (recursive resolution, records, caching)
- TCP/IP, packets, routing, ISPs
