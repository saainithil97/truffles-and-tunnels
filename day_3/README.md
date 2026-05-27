# Day 3 — Demystifying Frontend Engineering

A sequence of short, mind-bending demos that take the black box of "a web page"
apart. Each demo is self-contained and builds on the last. The running example
stays on the course spine — the Swiggy restaurant card from Day 1.

## Demos

- **[Demo 1 — "What just happened?"](demo_1/README.md)** — the request
  lifecycle. One tiny Swiggy card is really six network requests; the DevTools
  Network tab and a Slow 3G reload make the render pipeline visible.
- **[Demo 2 — "The DOM is not the HTML"](demo_2/README.md)** — parsing and the
  live DOM. View Source (what the server sent) vs the Elements tab (the live
  object the browser built), proven by mutating the DOM from the console while
  the source stays frozen — then vandalizing a real site for fun.
- **[Demo 3 — "Why order matters"](demo_3/README.md)** — render blocking. The
  same page served three ways (blocking `<head>` script, `<head>` + `defer`,
  end-of-`<body>`); Slow 3G makes the cost of script placement impossible to
  miss.

## Design docs

Specs and plans for every Day 3 demo live under
[`docs/superpowers/`](docs/superpowers/).

## Running the demos

Demo 1 (and the page Demo 2 builds on) is served by the Demo 1 FastAPI app:

```bash
cd demo_1
python3 -m venv .venv && source .venv/bin/activate   # first time only
pip install -r requirements.txt                       # first time only
uvicorn server:app --host 127.0.0.1 --port 8000 --reload
```

Then open `http://localhost:8000/`. See each demo's README for its full script.
