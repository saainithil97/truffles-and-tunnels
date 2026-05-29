# "How the pieces actually plug in"

You've seen the contract a library in this class offers. Now: where does it sit in your stack? React, Vue, Solid, Svelte — they all share *another* property beyond Demo 5's contract. They own one column — rendering — and leave the rest to you. That design choice is where the rest of Day 3 begins: it's what frameworks fill, and it's what tells you when to reach for one.

## Setup

The iframe above is `index.html` — a single static HTML file. Two `<script>` tags from a CDN, one component, no build step. The same library that ships in big Next.js apps is the library running in this 30-line page.

1. **View Source.** Three script tags + one `<script type="text/babel">` block. That's the entire app.
2. Click **Like**. The counter goes up. That's `useState`.
3. Open DevTools → **Network**. Three requests from `unpkg.com` — `react.production.min.js`, `react-dom.production.min.js`, `@babel/standalone`. Physically, that's all React is.
4. Open DevTools → **Elements**. The `<div id="root">` was empty in View Source; now it has the rendered card. The DOM is what React built; the source is what the server sent.

## Content

### A library, not a framework — the inversion-of-control test

<p class="beat__lede">A clean one-line test that holds across languages: a library is something <em>you</em> call; a framework is something that calls <em>you</em>.</p>

- **Library:** *your code is in charge.* You call `createRoot(...).render(<App />)` when you decide. The library shows up only when invited.
- **Framework:** *the framework is in charge.* Angular instantiates your components on a lifecycle you don't own. Rails calls your controller when a request comes in. You hand the framework your pieces; it decides when to call them.

| In this class | What it ships | Library or framework? |
|---|---|---|
| **React** | Reconciler + renderer | Library — you call `createRoot().render()` |
| **Vue (core)** | Reactivity + renderer | Library — you call `createApp().mount()` |
| **Solid** | Signals + renderer | Library — you call `render()` |
| **Svelte** | A compiler | Library — you import compiled components |
| **Angular** | All of the above + routing + DI + forms + … | **Framework** — Angular owns the lifecycle |
| **Next.js** | A wrapper around React | **Framework** — Next decides when your page runs |

Two design philosophies in the same class. **Demo 6.6** is what happens when you put a framework wrapper around the library.

### What these libraries deliberately don't ship

<p class="beat__lede">The library owns one column — rendering. The rest is yours to pick. That's the source of every "which X should I use" decision in a React codebase.</p>

| Concern | What the library ships | What you pick |
|---|---|---|
| **Routing** | Nothing | React Router / TanStack Router / Next's router / Vue Router / SvelteKit's router |
| **Build / bundler** | Nothing | Vite (default these days), webpack, Turbopack, esbuild |
| **State management** | `useState` / a `ref` / a signal for one component | Zustand, Redux, Jotai, Pinia, TanStack Query — or "just lift it up" |
| **Styling** | Nothing | CSS Modules, Tailwind, styled-components, vanilla CSS |
| **Data fetching** | Nothing | `fetch`, axios, TanStack Query, SWR |
| **Server rendering host** | An engine (`react-dom/server`, Vue's renderer-as-string) | Next, Remix, Astro, Nuxt, SvelteKit, your own Node process |
| **Form handling** | Nothing | React Hook Form, Formik, plain state |

This list is mostly the same whether you pick React, Vue, or Solid. The library says "I render; you compose." That **flexibility** is also what makes onboarding hard — every codebase has different answers to this table.

### The `<script>`-tag proof

<p class="beat__lede">"It's just a JavaScript file" is easy to say. Easier to see.</p>

The iframe above is the whole React surface in 30 lines: two `<script>` tags, one component, `useState`, `createRoot`. No build step, no bundler, no `node_modules`. The library is a file the browser downloads.

- **`react`** — the reconciler. Exports `useState`, `useEffect`, `createElement`. Knows nothing about the browser; it produces and diffs trees of element objects.
- **`react-dom`** — the renderer. Exports `createRoot`. Takes React's tree of objects and turns them into actual DOM nodes (or updates existing ones).
- **`@babel/standalone`** — *not part of React.* In this page it compiles JSX in-browser so we can skip the build step. In a real app, a bundler compiles JSX once at build time and Babel never ships.

In a real codebase you'd reach for a bundler so you can `import`, use npm packages, tree-shake, and code-split — that's **Demo 6.7**. But the script-tag mode is a real pattern: embedding a React widget in a non-React page (a comments box on a blog, a calculator in a marketing site, an admin tool in an old PHP app). Two `<script>` tags, no pipeline.

### The trade — and when to actually reach for one

<p class="beat__lede">"The library owns rendering, you pick the rest" is a deliberate trade. Here's what you buy, what you pay, and when to take it.</p>

**What you buy:**

- **Composability.** Because the library doesn't bring its own everything, you can drop it into whatever stack already exists. A React widget inside a Rails app, a Vue island in a WordPress page, a Solid component in an Electron shell.
- **Ecosystem flexibility.** Different teams pick different routers, state libraries, data layers — and the component model still works. That's why your last React job and your next one will look completely different above the component layer.
- **Long shelf life.** When a routing library falls out of fashion, you swap it without touching your components.

**What you pay:**

- **Decision fatigue.** Every new app starts with a 10-line checklist of choices. Angular makes those for you and gets you to "first working app" faster.
- **Setup work.** A new React app needs a bundler, a dev server, a router, an HMR setup. Each is fine on its own; together they're a stack you assemble.
- **Runtime cost.** ~45 KB of React + ReactDOM before your first line. Vue and Solid are smaller; Svelte often zero (it compiles). Worth it when the app is more than a button; not when the page is mostly static.

**When you take it:**

- **Vanilla** (or htmx, Alpine, 50 lines of your own) — page is mostly static, team is one person, you're learning the platform.
- **A library in this class** — state has more than a handful of pieces, components need to stay in sync, team is larger than one, app is going to grow.
- **A framework on top** (Next / Nuxt / SvelteKit) — you also need routing, server rendering, deployment, and an opinion about every row in the table above. **That's Part 3.**

Choose the simpler stack until it's about to run out, then upgrade. Most apps don't need a framework; many don't need a library at all.

## Takeaways

- **A library: you call it. A framework: it calls you.** React, Vue (core), Solid, Svelte pass the library test. Angular, Next.js don't.
- **The library owns rendering. Everything else, you pick.** Routing, build, state, styling, data — separate decisions. True of every library in this class.
- **The proof is one HTML file.** Two `<script>` tags, no build step. Same library as the big production apps.
- **Composability is the payoff; decision fatigue is the cost.** Frameworks trade the flexibility for fewer decisions. **Part 3** is what that trade looks like.
