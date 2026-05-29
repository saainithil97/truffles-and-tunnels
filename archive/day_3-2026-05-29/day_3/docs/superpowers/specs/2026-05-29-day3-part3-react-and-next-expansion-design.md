# Day 3, Part 3 — Expand "React and the modern frontend" with five new beats

**Date:** 2026-05-29
**Status:** Approved design
**Part of:** Day 3 — Demystifying Frontend Engineering. Builds on the previous spec (2026-05-29-day3-spa-demo-and-7-8-split-design.md) which added Demo 6.5 and split Demos 7/8/8.5. This spec fills out Part 3 with the framing content the arc currently lacks: what React *is* (library, not framework), where it runs, why Next.js exists, and what a bundler does.

## Purpose

Part 3 today runs: **Demo 6 (reconciler) → Demo 6.5 (SPA from scratch) → Verbal segments**. Students see the React reconciler and the browser-platform mechanics of an SPA, then are dropped straight into Demos 7/8/8.5 (Next.js rendering strategies) without a positioning beat that answers:

- *What kind of thing am I looking at?* — React is a library, not a framework. That's not a limitation; it's the design.
- *Where does React run?* — Anywhere JavaScript runs. Browser via `<script>`, browser via bundler, server, native.
- *Why Next.js?* — React deliberately omits routing, build, server rendering. Next bundles all of that.
- *How does Next sit on top of React?* — Next uses `react-dom/server` for SSG/SSR and `react-dom/client` for hydration. React stays React.
- *And what does the bundler actually do?* — Bundling, code splitting, tree shaking. These are not React concerns; they're bundler concerns. They apply equally in plain React + Vite as in Next.

Five new beats slot into Part 3 to answer these. Two are runbook-only verbal pages; three are runnable demos.

## The new Part 3 arc

Interleaved with the existing demos so each new beat lands a question raised by the demo just before it:

```
Demo 6          What React actually does (existing, reconciler)
   ↓
Demo 6.2  (V)   Why React is a library
   ↓
Demo 6.3  (D)   How and where React works   ← React on <script> tags, no build
   ↓
Demo 6.5        The page that never reloads (existing, SPA from scratch)
   ↓
Demo 6.6  (D)   Intro to Next.js             ← annotated file tree + iframe of /
   ↓
Demo 6.7  (D)   What a bundler actually does
   ↓
Demo 6.8  (V)   How Next works with React
   ↓
Verbal segments (existing, terminal aggregate page)
```

(V) = runbook-only verbal page; (D) = embedded or nextjs-separate demo with an iframe.

Two pairs structure the new content:

- **The library pair (6.2 → 6.3)**: after Demo 6 shows what React *does*, 6.2 frames *what React is* and 6.3 makes that frame physical with a `<script>`-tag React app. The reused Swiggy card from Demo 1 anchors the artifact to the spine.
- **The Next pair (6.6 → 6.7 → 6.8)**: after Demo 6.5 shows the hand-rolled SPA, 6.6 introduces Next as the framework that bundles everything React leaves out, 6.7 deep-dives the bundler piece specifically (because "0 KB JS" only makes sense if students know what bundling is), and 6.8 closes with the React-Next layered model.

## Content scope — each beat

### Demo 6.2 — "Why React is a library" (runbook-only)

**Aha:** React does one thing well — keeps your DOM in sync with your state — and deliberately omits everything else. That's the design. The "everything else" is what frameworks like Angular bundle and what Next packages on top of React.

**Sections on the demo page:**
- A 3-line "what React is and isn't" framing.
- **Library vs. framework — the inversion of control test.** A library: you call it. A framework: it calls you. React = library (you call `createRoot().render`). Angular = framework (lifecycle is its). Next = framework wrapped around React.
- **What React deliberately doesn't include** (table): routing, build/bundler, dev server, state management, styling, data fetching, server-rendering host. For each row: "what you pick instead."
- **Why this matters** — composability, ecosystem flexibility, the "React + your choice of everything" trade-off vs. "framework picks for you."
- Takeaways.

No iframe. ~600–800 words of markdown. The site renders runbook-only entries via the existing `DemoStatusCallout` callout pattern (the demo page replaces the iframe with a runbook hint card).

### Demo 6.3 — "How and where React works" (embedded)

**Aha:** React runs anywhere JavaScript runs. Two `<script>` tags are enough. The same library that ships in big Next.js apps is the library running in this 30-line HTML page.

**Artifact:** one HTML file. `<script>` tags for `react.production.min.js` and `react-dom.production.min.js` from `unpkg.com` (the standard CDN React docs use), plus `@babel/standalone` so we can write JSX directly in a `<script type="text/babel">` block. A small `<App>` component renders the Swiggy restaurant card with a Like button — **the exact same UI as Demo 1**, now in React, so the visual anchor is the Day-3 spine. The Like button uses `useState` so students see React state in the tiniest possible host.

**Sections on the demo page:**
- Setup: "View Source. Three script tags, one component. That's it. No build, no bundler, no framework."
- **The smallest possible React app** — walk through the HTML: where React comes from, where ReactDOM comes from, what Babel-standalone does, what `createRoot` does.
- **Where else React runs** (table): browser via `<script>` tag (this demo), browser via bundler (Vite/webpack/Turbopack), server via `react-dom/server` (renders to HTML string — forward-ref to Demo 7's SSR), native via React Native (renders to native views). For each: what's the renderer.
- **Why this proves React is a library** — back-link to 6.2. The renderer is pluggable. The reconciler doesn't care where it runs.
- Takeaways.

Iframe loads the script-tag HTML page. Source section at the bottom shows `index.html` and `style.css`.

### Demo 6.6 — "Intro to Next.js" (nextjs-separate)

**Aha:** Next.js is the framework that bundles all the things React leaves out — routing, build, dev server, SSR, file-based pages, deployment. You wrote ~90 lines of router code in Demo 6.5 to fake what `<Link>` gives you for free; Next gives you that plus a dozen other things on top.

**Artifact:** the iframe loads `/` (the homepage) of the existing `demo_7_8_nextjs` Swiggy app — the same deployment that powers Demos 7/8/8.5. No new Vercel project. Uses `iframeUrlEnvVar: "NEXT_PUBLIC_DEMO_7_URL"` and `iframePathSuffix: "/"` (or empty — both work).

**Sections on the demo page:**
- Setup: "The iframe is the homepage of the Swiggy Next app. Pop it out to see real URLs, real navigation, no hand-rolled router."
- **What's in a Next.js project** — an annotated file tree as embedded HTML (mirrors the pattern Demo 3's README uses for embedded visualizations):
  ```
  app/
    layout.tsx       ← wraps every route (header, footer, fonts)
    page.tsx         ← the homepage (this iframe)
    ssg/page.tsx     ← /ssg route → Demo 7
    hybrid/page.tsx  ← /hybrid route → Demo 8
    restaurants/[id]/page.tsx  ← dynamic route → Demo 8.5
  components/        ← server + client components
  lib/restaurants.ts ← shared data (server can read DB; clients can't)
  next.config.ts     ← build config
  package.json
  ```
  Each line gets one-sentence callout.
- **Compare and contrast — Demo 6.5 (by hand) vs. Next**:

  | | Demo 6.5 hand-rolled SPA | Next.js |
  |---|---|---|
  | Routing | `pushState` + click handler, ~90 lines | File-based, free |
  | Build / bundler | None (script tag) | Turbopack, free |
  | Dev server | `python3 -m http.server` | `next dev` with HMR |
  | First-paint HTML | Empty shell | SSG / SSR (real content) |
  | Crawlers see | Nothing | Everything |
  | New "page" | Add a view + register a route | Create a file |
  | Deploy | Static host | `vercel deploy` |
  | Cost to start | ~150 LOC | One command |

- **What you trade for it** — opinions (file-based routing isn't optional), Next-specific concepts (`'use client'`, server components, App Router conventions), tighter coupling to the React ecosystem.
- Forward-links: the next three demos (7, 8, 8.5) dissect specific aspects of this same app.
- Takeaways.

No source files for this demo — the "source" is the existing Next app's structure, which the file-tree visualization captures.

### Demo 6.7 — "What a bundler actually does" (embedded)

**Aha:** Bundling, code splitting, and tree shaking are bundler concerns, not React concerns. They apply equally in plain React + Vite as in Next. And bundle size is the lever most modern web performance work pulls on — Demo 8's "0 KB JS" badge is meaningful precisely because this is the thing that matters.

**Artifact:** a single HTML page rendered as the iframe, showing a three-column compare-and-contrast (script tag / React+Vite / React+Next) plus a concrete tree-shaking visual (full `lodash` import vs. named `lodash/map` import, with their bundle sizes). The numbers are well-known and stamped at author-time (full lodash ~70 KB minified, single function ~2 KB); no live build is required for the demo page to teach.

**Sections on the demo page:**
- Setup framing: "You've seen Next has a bundler. Here's what a bundler is, what it does, and why bundle size matters."
- **The three worlds** — three-column compare:

  | | Script tag (Demo 6.3) | React + Vite/webpack | React + Next |
  |---|---|---|---|
  | **Bundler** | None | You pick (Vite default) | Turbopack, picked for you |
  | **Tree shaking** | Doesn't apply (everything global) | Automatic (ES modules) | Automatic |
  | **Code splitting** | No | Manual via `React.lazy()` + dynamic `import()` | Automatic per route + still `React.lazy()` for finer splits |
  | **`import` statements** | Not supported | First class | First class |
  | **npm packages** | Only via UMD CDN | First class | First class |
  | **Bundle size visibility** | View Source | Vite/webpack build report | `next build` route table |
  | **When to choose this** | Demos, tiny apps, embeds | React app behind a custom backend / static host | Production apps, SSR/SSG |

- **Tree shaking made physical** — side-by-side code blocks:
  ```
  import _ from 'lodash';                  →  ~70 KB
  _.map([1, 2, 3], x => x * 2);
  ```
  vs.
  ```
  import map from 'lodash/map';            →  ~2 KB
  map([1, 2, 3], x => x * 2);
  ```
  One line difference. 35× size difference. That's tree shaking.

- **Code splitting made physical** — a mocked Next build route table showing per-route chunk sizes:
  ```
  Route                          Size   First Load JS
  ○ /                            142 B   89.1 kB
  ● /ssg                         186 B   89.2 kB
  ƒ /api/restaurants             0 B     0 B
  ● /restaurants/[id]            1.2 kB  92.4 kB
  ○ /hybrid                      3.4 kB  94.6 kB  ← client-component bigger
  ```
  Callout: "Look at `/hybrid` — bigger because the client search box ships JS. The server-only routes are tiny. The `'use client'` boundary IS a code-splitting boundary."

- **`React.lazy` in 5 lines** — a tiny snippet showing how plain React apps opt into component-level splitting:
  ```javascript
  const Heavy = React.lazy(() => import('./Heavy'));
  // ...
  <Suspense fallback={<Spinner />}>
    <Heavy />
  </Suspense>
  ```
  Note: this is React's *only* bundler-aware API. The bundler does the actual splitting; React provides the runtime primitive.

- **Why this is in Part 3, not Part 6** — bundlers are framing for "React is a library" (the bundler is one of the things React doesn't include) and the prerequisite for understanding Demo 8's 0 KB badge. Performance audits (Demo 9) build on top.
- Takeaways.

**Optional, not required:** a small `vite-project/` subdirectory under `day_3/demo_6_7/` that students can `npm install && npm run build` themselves to reproduce the lodash numbers. Spec lists this as a stretch goal; the demo page works without it.

### Demo 6.8 — "How Next works with React" (runbook-only)

**Aha:** Next doesn't replace React. Next *uses* React the same way Demo 6.3's script tag did — by calling React's renderer. The difference is that Next calls `react-dom/server` to build HTML on the server, then `react-dom/client` to hydrate on the browser. Everything you know about React still applies.

**Sections on the demo page:**
- Framing: "Next is a host. React is the engine. Here's how they fit together."
- **The layered model** — embedded HTML/SVG layers diagram (nested boxes pattern):

  ```
  ┌─────────────────────────────────────────────────┐
  │ Next.js (the framework)                         │
  │   • file-based router                           │
  │   • build (turbopack)                           │
  │   • dev server with HMR                         │
  │   • request/response handling                   │
  │   • App Router conventions ('use client', etc.) │
  │   ┌─────────────────────────────────────────┐   │
  │   │ React DOM (the renderer)                │   │
  │   │   • react-dom/server (HTML strings)     │   │
  │   │   • react-dom/client (hydrate + update) │   │
  │   │   ┌─────────────────────────────────┐   │   │
  │   │   │ React (the reconciler)          │   │   │
  │   │   │   • createElement / JSX         │   │   │
  │   │   │   • diffing                     │   │   │
  │   │   │   • hooks / state               │   │   │
  │   │   └─────────────────────────────────┘   │   │
  │   └─────────────────────────────────────────┘   │
  └─────────────────────────────────────────────────┘
  ```

- **What runs where:**
  - On `next build`: Next walks routes and calls `react-dom/server.renderToString` for each SSG page. Output is static HTML files.
  - On each request to an SSR route: Next runs the page component on the server, calls `react-dom/server`, sends HTML.
  - On every request to any route: browser gets HTML, then `react-dom/client.hydrateRoot` attaches event handlers (the hydration gap from Demo 8).
  - On client navigation via `<Link>`: Next router intercepts, fetches an RSC payload, hands it to React for reconciliation. Same reconciler from Demo 6.

- **Server components vs. client components — the boundary explained**: `'use client'` is a Next/App-Router-era directive. It tells the build, "below this point, ship React + this component's JS to the browser." Above the boundary, components run only in `react-dom/server` and ship zero JS. Forward-link to Demo 8 for the visible artifact.

- **Takeaway-shaped framing**: every React concept students will use in homework still applies inside Next. Components are still functions of props. State is still `useState`. JSX still compiles to `createElement`. Next adds *where* and *when* the renderer runs; it does not change *what* gets rendered.

- Takeaways.

No iframe. ~600–800 words.

## Architecture

### Numbering and slugs

| Beat | Number | Slug | Kind | Iframe? |
|---|---|---|---|---|
| Demo 6 (existing) | 6 | `demo_6` | embedded | yes |
| 6.2 | 6.2 | `demo_6_2` | runbook-only | no |
| 6.3 | 6.3 | `demo_6_3` | embedded | yes (static HTML) |
| Demo 6.5 (existing) | 6.5 | `demo_6_5` | embedded | yes |
| 6.6 | 6.6 | `demo_6_6` | nextjs-separate | yes (`/` of existing Next deployment) |
| 6.7 | 6.7 | `demo_6_7` | embedded | yes (static comparison HTML) |
| 6.8 | 6.8 | `demo_6_8` | runbook-only | no |
| Verbal segments (existing) | — | `verbal-segments` | runbook-only | no |
| Demo 7 (existing) | 7 | `demo_7` | nextjs-separate | yes |

Decimal sort order keeps the arc: 6 < 6.2 < 6.3 < 6.5 < 6.6 < 6.7 < 6.8 < 7. Demos 6.2 and 6.8 use the same runbook-only kind as Demos 2 and 9 already do.

### New source files (under `day_3/`)

- **`demo_6_2/README.md`** — Beat A markdown.
- **`demo_6_3/index.html`** — script-tag React + ReactDOM + Babel-standalone + a small Swiggy-card component with `useState` for the Like button.
- **`demo_6_3/style.css`** — adapted Swiggy card styles, kept tiny.
- **`demo_6_3/README.md`** — Beat B markdown.
- **`demo_6_6/README.md`** — Beat C markdown with embedded HTML file-tree visualization and compare-and-contrast tables.
- **`demo_6_7/index.html`** — static viewer page rendering the three-column compare-and-contrast, the lodash import side-by-side, and the mocked Next route table.
- **`demo_6_7/style.css`** — styles for the viewer page.
- **`demo_6_7/README.md`** — Beat E markdown.
- **`demo_6_7/vite-project/`** — *optional* stretch goal. A tiny Vite project students can `npm install && npm run build` to reproduce the lodash numbers. Not required for the demo page to teach.
- **`demo_6_8/README.md`** — Beat D markdown with the embedded layered-architecture diagram.

### Site curriculum (`site/lib/curriculum.ts`)

Add five new `Demo` entries between the existing `demo_6` and `demo_7`:

```typescript
{ id: "demo_6_2", slug: "demo_6_2", shortTitle: "Demo 6.2 — Why React is a library",
  ..., kind: "runbook-only", runbookHint: "<short framing message>" },
{ id: "demo_6_3", slug: "demo_6_3", shortTitle: "Demo 6.3 — How and where React works",
  ..., kind: "embedded", iframePath: "/live-demos/demo_6_3/index.html",
  sourceFiles: [{ name: "index.html", language: "html" }, { name: "style.css", language: "css" }] },
{ id: "demo_6_6", slug: "demo_6_6", shortTitle: "Demo 6.6 — Intro to Next.js",
  ..., kind: "nextjs-separate", iframeUrlEnvVar: "NEXT_PUBLIC_DEMO_7_URL", iframePathSuffix: "/" },
{ id: "demo_6_7", slug: "demo_6_7", shortTitle: "Demo 6.7 — What a bundler actually does",
  ..., kind: "embedded", iframePath: "/live-demos/demo_6_7/index.html",
  sourceFiles: [{ name: "index.html", language: "html" }, { name: "style.css", language: "css" }] },
{ id: "demo_6_8", slug: "demo_6_8", shortTitle: "Demo 6.8 — How Next works with React",
  ..., kind: "runbook-only", runbookHint: "<short framing message>" },
```

(`shortTitle`, `title`, `summary`, `readmeSourcePath`, `contentFile`, `iframeNote` filled in implementation; see Demo 6.5's entry for tone reference.)

Insert positions in `day3Demos`:
- `demo_6_2`, `demo_6_3` between existing `demo_6` and `demo_6_5`.
- `demo_6_6`, `demo_6_7`, `demo_6_8` between existing `demo_6_5` and `demo_7`.

Update Part 3 in `day3Parts`:

```typescript
{
  heading: "Part 3 — React and the modern frontend",
  demoSlugs: [
    "demo_6", "demo_6_2", "demo_6_3", "demo_6_5",
    "demo_6_6", "demo_6_7", "demo_6_8",
    "verbal-segments",
  ],
},
```

(`verbal-segments` stays last and is excluded from the prev/next chain — same as today.)

### Build pipeline (`site/scripts/copy-content.mjs`)

- Five new entries in `markdownDemos` (each maps `<id>/README.md` → `<id>.md`).
- Add `demo_6_3` and `demo_6_7` to `staticDemos` so their HTML/CSS get staged into `site/public/live-demos/`.
- Add `demo_6_3` and `demo_6_7` to `demoSourceFiles` so their source files surface on the demo page's Source section.
- `demo_6_2`, `demo_6_6`, `demo_6_8` are markdown-only — no `staticDemos` or `demoSourceFiles` entry needed.

### Existing files touched

- **`day_3/README.md`** — expand the Part 3 section to list eight bullets in order (Demo 6, 6.2, 6.3, 6.5, 6.6, 6.7, 6.8, Verbal segments).
- **`day_3/verbal-segments.md`** — strip the "bundling" mention from the existing Tooling Break section so we don't duplicate Demo 6.7's coverage. Leave the rest of the Tooling Break (Node, npm, the broader build story) untouched.

## Data flow

No new server-side data flow. Demos 6.3 and 6.7 are static HTML pages served from `site/public/live-demos/`. Demo 6.6 iframes an existing Vercel deployment via the env-var schema from the prior spec.

The script-tag demo (6.3) loads React + ReactDOM + Babel from `unpkg.com` (the standard React docs CDN). Lock to the React 19 stable pin used elsewhere in the repo; if the site uses an older React in `package.json`, match that pin for consistency.

## Error handling

- **Demo 6.3**: if CDN scripts fail to load (offline), the page paints empty. We do not solve this — it's the demo's whole point that React comes from `<script>` tags. A small `<noscript>` block notes that JS is required.
- **Demo 6.6**: if `NEXT_PUBLIC_DEMO_7_URL` is unset (e.g. local dev without the env var), the existing "Demo not yet deployed" callout shows — same fallback as Demos 7, 8, 8.5.
- **Demo 6.7**: the viewer page is purely static — no failure modes beyond the usual "HTML loaded incorrectly," which we can ignore.

## Testing

No automated tests. Same workshop-content rationale as the prior spec. Each phase ends with a manual verification step:

1. **After Demo 6.2 lands**: `/days/3/demos/demo_6_2` renders the runbook-only callout and the section deck for the verbal content. Prev/next chain: `Demo 6 → 6.2 → 6.5`.
2. **After Demo 6.3 lands**: same route exists for `demo_6_3`; the iframe loads the script-tag React Swiggy card; the Like button increments on click; View Source on the iframe shows three script tags + one `<script type="text/babel">` block. Prev/next: `6.2 → 6.3 → 6.5`.
3. **After Demo 6.6 lands**: `/days/3/demos/demo_6_6` renders; the iframe loads `/` of the deployed Swiggy Next app (or the "not yet deployed" callout locally without the env var). Prev/next: `6.5 → 6.6 → 6.7`.
4. **After Demo 6.7 lands**: `/days/3/demos/demo_6_7` renders; the iframe shows the three-column compare, the lodash side-by-side, the mocked Next routes table. Prev/next: `6.6 → 6.7 → 6.8`. `verbal-segments.md`'s Tooling Break no longer mentions bundling.
5. **After Demo 6.8 lands**: `/days/3/demos/demo_6_8` renders; the layered-architecture diagram is visible. Prev/next: `6.7 → 6.8 → Demo 7` (because `verbal-segments` is excluded from the chain).
6. **Final**: `day_3/README.md` reads end-to-end, all eight Part-3 bullets are present in order.

## Open decisions deferred to implementation

- **React/ReactDOM/Babel CDN pin versions for Demo 6.3** — match whatever the site's `package.json` uses if reasonable; otherwise pick the current React 19 stable.
- **Exact wording of `runbookHint` strings** — spec lists "<short framing message>"; implementer picks the language to match Day 3's voice.
- **Vite project under `demo_6_7/vite-project/`** — stretch goal, not required. Implementer skips if it adds material time; demo page teaches the lesson without it.
- **Whether to lightly polish the Swiggy Next app's `/` homepage (`app/page.tsx`)** before iframing it in Demo 6.6 — if the homepage is currently bare, a one-line "Swiggy — pick a route" landing improves the demo. Optional; defer to implementer judgment.

## Out of scope

- Renumbering or restructuring Demos 7, 8, 8.5, 9, 10 — they keep their labels and parts.
- Touching the Next.js app's deployment topology — still one Vercel project, one env var.
- Building a real Vite project unless the implementer wants the stretch goal.
- Expanding the existing `verbal-segments.md` beyond removing the bundling line.
- Backwards-compatible redirects for any URLs — same workshop-content rationale as the prior spec.

## Execution order

Six phases. Each phase ships source files + curriculum wire-up + day_3/README bullet for one beat, ending with a manual verification step. Same interleaved pattern as the prior spec (which proved out cleanly).

1. **Demo 6.2 — Why React is a library**: `day_3/demo_6_2/README.md`, curriculum entry (`runbook-only`), Part 3 `demoSlugs` update, copy-content `markdownDemos` entry, `day_3/README.md` bullet. Verify the runbook-only page renders.
2. **Demo 6.3 — How and where React works**: source files (`index.html`, `style.css`, `README.md`), curriculum entry (`embedded` + `sourceFiles`), Part 3 `demoSlugs` update, copy-content `markdownDemos` + `staticDemos` + `demoSourceFiles` entries, `day_3/README.md` bullet. Verify iframe loads, Like button works, source surfaces.
3. **Demo 6.6 — Intro to Next.js**: `day_3/demo_6_6/README.md` (with embedded HTML file tree), curriculum entry (`nextjs-separate` + `iframePathSuffix: "/"`), Part 3 `demoSlugs` update, copy-content `markdownDemos` entry, `day_3/README.md` bullet. Verify iframe loads `/` of the Next deployment (or the deploy callout locally), compare-and-contrast renders, prev/next correct.
4. **Demo 6.7 — What a bundler actually does**: source files, curriculum entry (`embedded` + `sourceFiles`), Part 3 `demoSlugs` update, copy-content updates, `day_3/README.md` bullet, **plus** the `verbal-segments.md` bundling-line retirement. Verify viewer iframe renders, lodash side-by-side and Next routes table both visible.
5. **Demo 6.8 — How Next works with React**: `day_3/demo_6_8/README.md` (with embedded layered diagram), curriculum entry (`runbook-only`), Part 3 `demoSlugs` update, copy-content `markdownDemos` entry, `day_3/README.md` bullet. Verify runbook page renders and the diagram displays.
6. **Final polish**: read `day_3/README.md` end-to-end; confirm Part 3 lists eight bullets in order; confirm the prev/next chain `Demo 6 → 6.2 → 6.3 → 6.5 → 6.6 → 6.7 → 6.8 → Demo 7` works in the running site.

Each phase has its own implementation plan via the writing-plans skill.
