# "How Next works with React"

You've seen React running in a script tag (Demo 6.3). You've seen Next.js wrapping a real app (Demo 6.6). You've seen what a bundler does (Demo 6.7). One question left before Demos 7/8/8.5 dig into rendering strategies: **how do Next and React actually fit together?**

Short answer: Next is a host. React is the engine. Next *uses* React the same way Demo 6.3's script tag did — by calling React's renderer. The difference is *when* Next calls it (server, browser, both) and *what else* Next does around it (router, build, deploy).

## Setup

No iframe — this is a 5-minute reading between Demo 6.7 and Demo 7. The diagram below is the whole picture; the rest of the page is the walk-through.

## The layered model

<figure class="beat__visual">
<pre>
┌─────────────────────────────────────────────────────────┐
│ <strong>Next.js</strong> (the framework)                              │
│   • file-based router (<code>app/foo/page.tsx</code> → <code>/foo</code>)         │
│   • build (Turbopack)                                   │
│   • dev server with HMR                                 │
│   • production server (Node / Edge / Vercel Functions)  │
│   • App Router conventions (<code>'use client'</code>, layouts, …)  │
│   ┌─────────────────────────────────────────────────┐   │
│   │ <strong>React DOM</strong> (the renderer)                     │   │
│   │   • <code>react-dom/server</code> → HTML strings            │   │
│   │   • <code>react-dom/client</code> → hydrate + update DOM    │   │
│   │   ┌─────────────────────────────────────────┐   │   │
│   │   │ <strong>React</strong> (the reconciler)               │   │   │
│   │   │   • <code>createElement</code> / JSX                │   │   │
│   │   │   • diffing                             │   │   │
│   │   │   • hooks (<code>useState</code>, <code>useEffect</code>, …)    │   │   │
│   │   └─────────────────────────────────────────┘   │   │
│   └─────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
</pre>
</figure>

Three layers:

- **React** is the reconciler. Pure logic — knows nothing about the browser. Given a tree of element objects, produces a diff against the previous tree. That's all `react` (the npm package) does.
- **React DOM** is *a* renderer. Knows how to turn React's diff into DOM operations. Has two halves: `react-dom/client` (the one that runs in the browser, attaches event handlers, applies updates) and `react-dom/server` (the one that runs on the server, produces an HTML string from React elements). React Native is a different renderer for the same reconciler.
- **Next.js** is a framework that *hosts* React DOM. It owns when and where the renderer runs, plus everything around it: routing, build, dev server, prod server, deploy.

The arrow always points the same way. Next calls React DOM. React DOM calls React. React produces a diff. React DOM applies the diff. Next never "uses React" directly — it always goes through React DOM.

## What runs where

<p class="beat__lede">Same React component, different moments. Same diffing, different renderer.</p>

### On `next build`

For every **SSG** route (default), Next calls `react-dom/server.renderToString(<Page />)`. The output is an HTML file written to disk under `.next/`. That file is what the CDN serves when you visit the route. **React ran once, at build time, on the build server.**

### On every request to an **SSR** route

Next calls `react-dom/server.renderToString(<Page />)` again — but live, this time, with whatever cookies / locale / user context the request brought. **React runs per request, on the production server.**

### On every request to **any** route

The browser receives HTML (whether SSG-built or SSR-built or a CSR shell). Then Next ships a JavaScript bundle. `react-dom/client.hydrateRoot(<Page />)` runs in the browser, walks the same React tree the server walked, and attaches event handlers to the existing DOM nodes the server already painted. **React runs once on the browser to "wake up" the page.** This is hydration. The gap between paint and hydration finishing is the hydration gap — Demo 8's Slow 3G reveal.

### On every client-side navigation via `<Link>`

Next's router intercepts the click, fetches a serialized React tree (an RSC payload) for the next route, hands it back to React for reconciliation, and React DOM swaps in only the changed sections. **No new server-rendered HTML document.** Same reconciler from Demo 6 — running in the browser, diffing two trees, producing minimal DOM updates.

That's the whole "where does React run in a Next app" map. Build server, production server (for SSR), browser (for hydration, for client-side navigation, for `useEffect`).

## Server components vs. client components, in one paragraph

<p class="beat__lede"><code>'use client'</code> is a Next-era directive that tells the build "below this point, ship React's <em>client</em> renderer and this component's JS to the browser."</p>

- Above the boundary: components run **only** in `react-dom/server`. They produce HTML. They ship **zero JavaScript** to the browser. They can read databases, call APIs, hit the filesystem.
- Below the boundary: components run in `react-dom/server` first (to produce the initial HTML) **and** in `react-dom/client` after (to hydrate and update). The boundary component plus everything it imports ships to the browser.
- The boundary is not a switch — it's a tree split. Push it down. Tiny client leaves, big server trunks. That's the lesson Demo 8 makes visible with its badges.

## What this means for your homework

<p class="beat__lede">Every React concept still applies inside Next.</p>

- Components are still functions of props.
- State is still `useState`. Effects are still `useEffect`. Hooks behave the same way.
- JSX still compiles to `React.createElement` (the bundler does it, not Babel-standalone — but the same compilation).
- The component tree, reconciliation, and diffing from Demo 6 are happening on every render.
- What changes is **where** they run (server for the initial render of server components; browser for everything after hydration) and **what wraps them** (Next's router, layouts, conventions).

If you can build a React component in plain React (Demo 6.3), you can build one in Next. The framework adds where and when; it doesn't replace what.

## Why this matters for the next three demos

<p class="beat__lede">Demos 7, 8, 8.5 each pick one layer of this stack and stare at it.</p>

- **Demo 7** — *where the server renders.* SSG (at build), SSR (per request), or CSR (not at all). All three are configurations of `react-dom/server`'s behavior.
- **Demo 8** — *the boundary.* Server components don't ship; client components do. The hydration gap on Slow 3G is `react-dom/client`'s gap.
- **Demo 8.5** — *client-side routing.* `<Link>` is the Next router's intercept, fetching an RSC payload, calling reconciliation. Same React, smarter host.

You now have the layered model. Demos 7/8/8.5 are tours through specific floors of the building.

## Takeaways

- **Next is a host. React is the engine.** Next calls React DOM, React DOM calls React, React produces a diff.
- **Same React, different `when` and `where`.** Build server (SSG), prod server (SSR), browser (hydration + client nav + effects).
- **`react-dom/server` and `react-dom/client` are different halves of one library.** Next uses both.
- **`'use client'` decides which half a component is rendered with on the browser side.** Above: server-only, zero JS. Below: hydrated client, ships JS.
- **Every React skill still applies.** Components, state, effects, JSX, hooks — all the same. Next adds where; it doesn't change what.
- **Demos 7/8/8.5 are the deep dive.** You now have the map.
