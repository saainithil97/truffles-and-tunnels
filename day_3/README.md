# Day 3 — Demystifying Frontend Engineering

A sequence of short, mind-bending demos that take the black box of "a web page"
apart. Each demo is self-contained and builds on the last. The running example
stays on the course spine — the Swiggy restaurant card from Day 1.

## Demos

### Part 1 — The browser as a platform

- **[Demo 1 — Network](demo_1/README.md)** — the request lifecycle.
- **[Demo 2 — The DOM is not the HTML](demo_2/README.md)** — parsing and the live DOM.
- **[Demo 3 — Order matters: render-blocking JS and CSS](demo_3/README.md)** — script placement on Slow 3G.
- **[Demo 2.5 — Storage](demo_2_5/README.md)** — cookies vs localStorage / sessionStorage.
- **[Verbal — Other browser APIs](verbal-segments.md)** — quick tour: `fetch`, `IntersectionObserver`, `ResizeObserver`, `history`, Web Workers, `requestAnimationFrame`.

### Part 2 — Why do we need React (or other libraries)?

- **[Demo 4 — Pure JS hits a wall](demo_4/README.md)** — three pains vanilla leaves you: state↔UI drift, no composition vocabulary, the DOM punishes hot loops.
- **[Demo 5 — The shape of every library that fixes this](demo_5/README.md)** — describe state → UI, the library does the sync. React, Vue, Svelte, Solid all fit the same contract.
- **[Demo 6 — How the pieces actually plug in](demo_6/README.md)** — library vs framework, what these libraries deliberately don't ship, the `<script>`-tag proof, the trade.
- **[Verbal — Other libraries and frameworks](verbal-segments.md)** — Vue, Svelte, Solid, Angular, htmx — one distinctive choice each.

### Part 3 — Single-Page Apps

- **[Demo 6.5 — What's an SPA, why](demo_6_5/README.md)** — one HTML shell + a tiny JS router (`pushState` + click interception + `popstate`). And the dead end it leads to.
- **[Demo 6.6 — Intro to Next.js](demo_6_6/README.md)** — the framework option for React: file-based routing, `<Link>` SPA-nav without the SPA tax, the framework trade. One realisation of a class (Nuxt, SvelteKit, SolidStart).
- **[Demo 6.7 — What a bundler actually does](demo_6_7/README.md)** — open the bundler hood Next handed you. Same engine you'd reach for in plain React + Vite. Tree shaking, code splitting, `React.lazy`.

### Part 4 — Rendering strategies

- **[Demo 7 — SSG, SSR, CSR in their rightful habitats](demo_7_8_nextjs/demo_7.md)** — `/menu` (SSG: a restaurant menu, frozen at build), `/feed` (SSR: personalised "near you" feed, per-request), `/cart` (CSR: private + interactive, empty shell). The strategy is chosen by what the page is, not arbitrarily.
- **[Demo 8 — Server vs client components](demo_7_8_nextjs/demo_8.md)** — `/detail`: a server-rendered menu (zero JS) with two small client islands (search + Add-to-cart). Server trunk, client leaves; slow 3G makes the hydration gap visible.

### Part 5 — Perf, security, and the real world

- **[Demo 9 — Core Web Vitals](demo_9/README.md)** — Lighthouse; LCP / INP / CLS.
- **[Demo 10 — Frontend security](demo_10/README.md)** — XSS via `innerHTML`, the safe `textContent` path, a CORS error.
- **[Wrap — Swiggy DevTools audit](wrap/README.md)** — point DevTools at swiggy.com; code-split chunks, lazy images, the production waterfall.

## Design docs

Specs and plans for every Day 3 demo live under
[`docs/superpowers/`](docs/superpowers/).

## Running the demos

Most demos are a small FastAPI static server (Python). The pattern is the same
everywhere — from the demo's folder:

```bash
python3 -m venv .venv && source .venv/bin/activate   # first time only
pip install -r requirements.txt                       # first time only
uvicorn server:app --host 127.0.0.1 --port 8000 --reload
```

Then open `http://localhost:8000/`. Exceptions:

- **Demo 2** ships no code — it runs in the console on Demo 1's page and a real
  site.
- **Demos 5 & 6** are single HTML files with React vendored locally — just open
  them in the browser (no server).
- **Demos 7/8** are a Next.js app — `npm install` then `npm run build &&
  npm start` (Demo 7's frozen-SSG reveal needs the production build, not `dev`).
- **Demo 9** is runbook-only (run Lighthouse against a real page).

See each demo's README for its full script and pre-session checklist.
