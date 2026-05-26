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
