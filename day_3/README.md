# Day 3 — Demystifying Frontend Engineering

A sequence of short, mind-bending demos that take the black box of "a web page"
apart. Each demo is self-contained and builds on the last. The running example
stays on the course spine — the Swiggy restaurant card from Day 1.

## Demos

### Part 1 — The browser as a platform

- **[Demo 1 — "What just happened?"](demo_1/README.md)** — the request
  lifecycle. One tiny Swiggy card is really six network requests; the DevTools
  Network tab, a Slow 3G reload, and a cache reveal make the render pipeline
  visible.
- **[Demo 2 — "The DOM is not the HTML"](demo_2/README.md)** — parsing and the
  live DOM. View Source (what the server sent) vs the Elements tab (the live
  object the browser built), proven by mutating the DOM from the console while
  the source stays frozen — then vandalizing a real site for fun.
- **[Demo 2.5 — "Your browser is holding your data"](demo_2_5/README.md)** —
  storage. Cookies (sent to the server every request) vs localStorage /
  sessionStorage (never leave the browser), shown on a Swiggy preferences +
  checkout page.
- **[Demo 3 — "Why order matters"](demo_3/README.md)** — render blocking. The
  same page served three ways (blocking `<head>` script, `<head>` + `defer`,
  end-of-`<body>`); Slow 3G makes the cost of script placement impossible to
  miss.

### Part 2 — Why frameworks exist

- **[Demo 4 — "The expensive DOM"](demo_4/README.md)** — layout, reflow, paint.
  500 restaurant tiles; a per-element update loop (layout thrash) vs one batched
  update, timed live. The problem React was built to solve.
- **[Demo 5 — "This is why React exists"](demo_5/README.md)** — imperative vs
  declarative. A vanilla-JS Swiggy search/filter that stays clean… until a PM
  piles on features and it tangles — then the same thing in React.

### Part 3 — React and the modern frontend

- **[Demo 6 — "What React actually does"](demo_6/README.md)** — virtual DOM,
  JSX, reconciliation. JSX → `createElement` → plain objects; the diff makes
  minimal real-DOM updates (shown via React DevTools + paint flashing on Demo
  5's app).
- **[Demo 6.2 — "Library, not framework"](demo_6_2/README.md)** — what React
  *is*, not what it does. The inversion-of-control test (a library: you call it;
  a framework: it calls you). The table of everything React deliberately omits
  (routing, build, state, styling, data, server-rendering host) with the "what
  do I pick instead" column. Sets up why Next exists.
- **[Demo 6.3 — "React in a script tag"](demo_6_3/README.md)** — proof that
  React is just a library: two `<script>` tags from unpkg.com, one component
  with `useState`, no build, no bundler. The same Swiggy card from Demo 1,
  rendered in React this time. Sets up "where React runs" — browser, server,
  native, anywhere there's a renderer.
- **[Demo 6.5 — "The page that never reloads"](demo_6_5/README.md)** — what an
  SPA actually is. One HTML shell + a tiny JS router (`pushState` + click
  interception + `popstate`). Side-by-side: a fake MPA where every click is a
  full reload, vs the SPA where the Network tab goes silent after the first
  load. The dead end that the next four demos are answers to.
- **[Verbal segments](verbal-segments.md)** — the spoken interludes: the Tooling
  Break (Node / npm / bundling), the Platform Tour (browser APIs), and CSS &
  Styling, plus the homework brief and the 60-second wrap-up recap.

### Part 4 — Rendering strategies

- **[Demo 7 — "Same page, three rendering strategies"](demo_7_8_nextjs/demo_7.md)** —
  SSG vs SSR vs CSR. The identical Swiggy grid at `/ssg`, `/ssr`, `/csr`. View
  Source is the reveal — SSG and SSR ship full HTML, CSR ships an empty shell.

### Part 5 — Hydration & component boundaries

- **[Demo 8 — "Server components vs client components"](demo_7_8_nextjs/demo_8.md)** —
  `/hybrid` is a server-rendered grid with a client-rendered search box.
  Server/client badges mark each component. Slow 3G makes the hydration gap
  visible.

### Part 5.5 — Client-side routing

- **[Demo 8.5 — "The URL changes, the page doesn't reload"](demo_7_8_nextjs/demo_8_5.md)** —
  Next.js's `<Link>` gives you SPA navigation feel without the SPA's "URLs only
  work after JS boots" tax. Compare back to Demo 6.5's hand-rolled SPA.

### Part 6 — Security, performance, and the platform

- **[Demo 9 — "What are you actually shipping?"](demo_9/README.md)** —
  performance & Core Web Vitals. A Lighthouse audit; LCP / INP / CLS and what
  moves them. Runbook-only (audits a real page).
- **[Demo 10 — "Don't trust the user, don't trust the page"](demo_10/README.md)**
  — frontend security. A live XSS via `innerHTML` on a Swiggy reviews page
  (and the safe `textContent` path), plus a CORS error in the console.

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
- **Demo 6.5** is two static folders (MPA + SPA). Open the HTML files directly
  with a static server: `python3 -m http.server 8765` in `day_3/demo_6_5/`,
  then visit `http://localhost:8765/index-mpa.html` or `index-spa.html`.
- **Demos 7/8/8.5** are a Next.js app — `npm install` then `npm run build &&
  npm start` (Demo 7's frozen-SSG reveal needs the production build, not `dev`).
- **Demo 9** is runbook-only (run Lighthouse against a real page).

See each demo's README for its full script and pre-session checklist.
