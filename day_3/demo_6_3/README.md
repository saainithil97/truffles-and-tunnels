# "How and where React works"

React is a *library*, not a framework — and this demo is what that looks like in practice. Two `<script>` tags from a CDN, one component, no build step. The same library that ships in big Next.js apps is the library running in this 30-line HTML page.

## Setup

The iframe above is `index.html` — a single static HTML file. Try this:

1. **View Source.** Three script tags + one `<script type="text/babel">` block. That's the entire app.
2. Click **Like**. The counter goes up; the button changes. That's `useState`.
3. Open DevTools → **Network**. Three requests from `unpkg.com` — `react.production.min.js`, `react-dom.production.min.js`, `@babel/standalone`. That's all React is, physically: a JavaScript file the browser downloads.
4. Open DevTools → **Elements**. The `<div id="root">` was empty in View Source; now it has the rendered card. The DOM is what React built; the source is what the server sent.

## Content

### The smallest possible React app

<p class="beat__lede">Three pieces. That's the whole architecture.</p>

- **`react`** — the reconciler. Exports `React`, `useState`, `useEffect`, `createElement`, the rest of the API. Knows nothing about the browser; it just produces and diffs a tree of element objects.
- **`react-dom`** — the renderer. Exports `createRoot`, `hydrateRoot`. Takes React's tree of objects and turns them into actual DOM nodes (or updates existing ones).
- **`@babel/standalone`** — *not part of React*. Just here so we can write JSX directly in this file. In a real app, a build step compiles JSX once at build time and Babel never ships. The 3 MB price tag is why.

The component itself is plain JavaScript that returns JSX, which Babel compiles to `React.createElement(...)` calls. `createRoot(element).render(<App />)` is the line that mounts it. That's the whole API surface used in this demo.

### A library, not a framework — the inversion-of-control test

<p class="beat__lede">There's a clean one-line test: a library is something you call; a framework is something that calls you.</p>

- **Library:** *your code is in charge*. You call `createRoot(...).render(<App />)` when you decide. React shows up only when invited.
- **Framework:** *the framework is in charge*. Angular instantiates your components on a lifecycle you don't own. Rails runs your controller method when a request comes in. You hand the framework your pieces; it decides when to call them.
- **React** passes the library test. The only React-owned moment is *inside* the render — once you call it, React drives reconciliation. Outside that, your code runs the show: you decide when to mount, what data to fetch, how to route.
- **Next.js** is a framework wrapped around React. Next decides when to call your page components, when to render them on the server, when to hydrate them in the browser. You hand Next your `app/page.tsx`; Next runs it.

Two ways to host the same React. That's the whole game.

### What React deliberately doesn't ship

<p class="beat__lede">React is intentionally small. Here's the list of things it doesn't ship — and the per-row "so what do I pick instead" answer.</p>

| Concern | React ships | What you pick |
|---|---|---|
| **Routing** | Nothing | React Router, TanStack Router, Next's file-based router |
| **Build / bundler** | Nothing | Vite (default these days), webpack, Parcel, Turbopack via Next |
| **Dev server with HMR** | Nothing | Vite's dev server, Next's dev server |
| **State management** | `useState` / `useReducer` for one component | Zustand, Redux, Jotai, TanStack Query, or "just `useState` + lift state up" |
| **Styling** | Nothing | CSS Modules, Tailwind, styled-components, emotion, vanilla CSS |
| **Data fetching** | Nothing | `fetch`, axios, TanStack Query, SWR, Apollo |
| **Server rendering host** | `react-dom/server` (the engine) | Next, Remix, Astro, your own Node process |
| **Form handling** | Nothing | React Hook Form, Formik, plain `useState` |
| **Animations** | Nothing | Framer Motion, GSAP, CSS transitions |

React owns one column: rendering. Everything else, you pick.

### Where else React runs

<p class="beat__lede">The reconciler is host-agnostic. Different renderers, different hosts.</p>

| Host | Renderer | What gets produced |
|---|---|---|
| **Browser, via `<script>` tag** (this demo) | `react-dom/client` | DOM nodes |
| **Browser, via bundler** (Vite, webpack, Turbopack) | `react-dom/client` | DOM nodes — same renderer, just delivered through a bundle |
| **Server** (Node, edge, Bun) | `react-dom/server` | An HTML string the server sends to the browser |
| **Native mobile** | React Native | Native iOS/Android views (no DOM, no browser) |
| **3D/WebGL** | react-three-fiber | THREE.js scene objects |
| **Terminal** | Ink | Text output via ANSI escapes |
| **PDFs, emails, …** | `@react-pdf/renderer`, mjml-react, etc. | Whatever that library knows how to produce |

Same `useState`. Same component model. Same diffing. The renderer is pluggable; that's the design.

### Why this matters

<p class="beat__lede">"React is a library" isn't a slogan — it's a design constraint with three consequences you'll feel every day.</p>

- **Composability.** Because React doesn't bring its own everything, you can compose it with whatever stack already exists. A React widget can live inside an old Rails app, a WordPress page, an existing webpack build, an Electron shell.
- **Ecosystem flexibility.** Different teams pick different routers, different state libraries, different data layers, and the React component model still works in all of them. That's why your last React job and your next one will probably look completely different above the component layer.
- **The trade-off.** A framework like Angular makes 80% of the decisions for you, which gets you to "first working app" faster. React's libraries-of-libraries approach forces you to decide more, which gets you customization at the cost of decision fatigue. Next.js (Demo 6.6) is React's "I'll make most of the decisions" mode — and that's the part of the day you're about to step into.

### Going deeper — when would you actually use script-tag React?

<p class="beat__lede">Rarely as the main app. Often as a widget.</p>

- **Embedding a small React widget in a non-React page** — a comments box on a blog, a calculator inside a marketing site, an admin tool inside an old PHP app. Two script tags and you have React, with no build pipeline to set up.
- **Quick prototypes / CodePen / docs samples** — every interactive example in the React docs is essentially this pattern (Babel-standalone + React + ReactDOM).
- **Teaching** (this demo).
- **What you would NOT use it for** — a production app with more than a couple components. You want a bundler so you can `import`, use npm packages, tree-shake, code-split. That's Demo 6.7.

## Takeaways

- **A library: you call it. A framework: it calls you.** React passes the library test. Next.js doesn't.
- **React owns rendering. Everything else you pick.** Routing, build, state, styling, data — separate decisions.
- **React is JS that the browser downloads.** Two `<script>` tags from a CDN is enough. Same library powers this 30-line page and the Next.js Swiggy app.
- **`react` is the reconciler. `react-dom` is the renderer.** They split for a reason — same reconciler, multiple renderers (server, native, 3D, …).
- **JSX needs a compiler.** In this demo, Babel-standalone does it in-browser (slow, fine for a demo). In every real app, your bundler does it at build time.
- **Composability is the payoff.** React works inside any host that can run JavaScript. That's why `<script>`-tag React is a real pattern, not a curiosity.
- **Real apps use a bundler.** Script tags are for widgets and demos. Demos 6.5–6.6 show what a real React/Next app's tooling looks like.
