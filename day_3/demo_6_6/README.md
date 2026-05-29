# "Intro to Next.js"

You just wrote a 90-line SPA router by hand (Demo 6.5). You just saw React running in a `<script>` tag with no build (Demo 6.3). Now the third option: take React and put it inside a *framework* that brings the build, the router, the dev server, the production server, the deployment, all of it. That's Next.js — and the next four demos all live inside one.

## Setup

The iframe is `/` of the Swiggy Next.js app that powers Demos 7, 8, and 8.5. Same deployment, same code, same Vercel project.

1. Click the four cards in the iframe. Each one is a `<Link>` to a different route. **No page reload.** That's Next's client-side router — what you wrote by hand in Demo 6.5, but free.
2. Pop the iframe out (↗ button). The URL bar updates as you click. Copy any URL into a fresh tab — every one still works. (Try doing *that* with Demo 6.5's SPA — only the shell URL loads from a cold tab.)
3. View Source on `/` from the popped-out tab. Real HTML, the four card links right there. Not the empty shell from Demo 6.5.

## Content

### What's in a Next.js project

<p class="beat__lede">Open the folder. Next is convention-over-configuration — what each file/folder is named is what it does.</p>

<figure class="beat__visual">
<pre>
day_3/demo_7_8_nextjs/
├── <span style="color:#fc8019">app/</span>                           <span style="color:#888">← every route lives here (App Router convention)</span>
│   ├── <span style="color:#7cffb8">layout.tsx</span>                 <span style="color:#888">← wraps every page (header, footer, fonts, providers)</span>
│   ├── <span style="color:#7cffb8">page.tsx</span>                   <span style="color:#888">← /  — the homepage (this iframe)</span>
│   ├── <span style="color:#7cffb8">globals.css</span>                <span style="color:#888">← global styles, imported once in layout.tsx</span>
│   ├── <span style="color:#7cffb8">ssg/page.tsx</span>               <span style="color:#888">← /ssg  → Demo 7 — static at build time</span>
│   ├── <span style="color:#7cffb8">ssr/page.tsx</span>               <span style="color:#888">← /ssr  → Demo 7 — rendered per request</span>
│   ├── <span style="color:#7cffb8">csr/page.tsx</span>               <span style="color:#888">← /csr  → Demo 7 — empty shell, browser fills in</span>
│   ├── <span style="color:#7cffb8">hybrid/page.tsx</span>            <span style="color:#888">← /hybrid → Demo 8 — server shell + client island</span>
│   ├── <span style="color:#7cffb8">restaurants/[id]/page.tsx</span>  <span style="color:#888">← /restaurants/{id} — dynamic route (Link nav below)</span>
│   └── <span style="color:#7cffb8">api/restaurants/route.ts</span>   <span style="color:#888">← API endpoint, returns JSON</span>
├── <span style="color:#fc8019">components/</span>                    <span style="color:#888">← reusable components (server + client)</span>
│   ├── <span style="color:#7cffb8">RestaurantCard.tsx</span>         <span style="color:#888">← server component (zero JS to browser)</span>
│   ├── <span style="color:#7cffb8">RestaurantSearch.tsx</span>       <span style="color:#888">← <em>'use client'</em> — has state, ships JS</span>
│   └── <span style="color:#7cffb8">FavouriteButton.tsx</span>        <span style="color:#888">← <em>'use client'</em> — has onClick, ships JS</span>
├── <span style="color:#fc8019">lib/</span>
│   └── <span style="color:#7cffb8">restaurants.ts</span>             <span style="color:#888">← data (server can read it directly; clients via fetch)</span>
├── <span style="color:#7cffb8">next.config.ts</span>                 <span style="color:#888">← Next-level config (rewrites, images, env, …)</span>
├── <span style="color:#7cffb8">package.json</span>                   <span style="color:#888">← npm deps: react, react-dom, next, tailwind</span>
├── <span style="color:#7cffb8">tsconfig.json</span>                  <span style="color:#888">← TypeScript config</span>
└── <span style="color:#7cffb8">postcss.config.mjs</span>              <span style="color:#888">← Tailwind / PostCSS pipeline</span>
</pre>
</figure>

Three rules of thumb the file tree is telling you:

- **`app/` is the router.** A `page.tsx` at `app/foo/page.tsx` is the route `/foo`. A `page.tsx` at `app/restaurants/[id]/page.tsx` is the dynamic route `/restaurants/anything`. You don't register routes; you create files.
- **`layout.tsx` wraps everything below it.** The root `app/layout.tsx` wraps every page. A nested `app/dashboard/layout.tsx` would wrap only `/dashboard/*` pages. Persistent UI (sidebars, headers, providers) goes in a layout — it doesn't re-render when you navigate within its subtree.
- **`'use client'` is a boundary, not a switch.** Top of file. Everything above it (parents, importers) is server-only and ships zero JS. Everything below it (this component + everything it imports) ships to the browser. Push the boundary down to keep bundles small.

### Compare and contrast — Demo 6.5 SPA (by hand) vs. Next.js

<p class="beat__lede">You wrote one version yourself. Next gives you the other.</p>

| | Demo 6.5 hand-rolled SPA | Next.js |
|---|---|---|
| **Routing** | `pushState` + click handler, ~90 lines | File-based, free |
| **Build / bundler** | None (script tag) | Turbopack, free |
| **Dev server with HMR** | `python3 -m http.server` | `next dev` |
| **First-paint HTML** | Empty shell | SSG / SSR — real content |
| **Crawlers see** | Nothing | Everything |
| **New "page"** | Add a view + register a route in `app.js` | Create a file under `app/` |
| **Data fetching on server** | Impossible (no server) | Server component reads DB directly |
| **API routes** | Separate backend or static JSON | `app/api/*/route.ts` next to your pages |
| **Deploy** | `python3 -m http.server` on any host | `vercel deploy` or `npm run build && npm start` |
| **Lines of "infrastructure" code you write** | ~150 LOC to start | One command (`npx create-next-app`) |
| **Lock-in** | None | Significant — you adopt Next conventions |

### Next gives you SPA navigation for free

<p class="beat__lede">Click a restaurant card. The URL changes. No full reload. Copy that URL, paste into a fresh tab — the page still loads as a real document. <code>&lt;Link&gt;</code> is the SPA pattern from Demo 6.5, wrapped, with the SPA tax removed.</p>

An SPA's only advantage over a real-document navigation is feel — clicks are instant after the first load. `<Link>` keeps that feel and brings back everything SPAs gave up.

- **On render**, the Next.js router scans for `<Link>` elements in the viewport and prefetches their RSC payloads in the background. By the time you hover, the data might already be cached.
- **On click**, the router calls `preventDefault()`, calls `history.pushState` (sound familiar?), and fetches the destination's RSC payload if it isn't already cached.
- **On payload arrival**, React reconciles the new route's tree against the current one and swaps only what changed. The shared layout (header, nav) stays mounted; only the part that differs gets re-rendered.

That's the SPA pattern from Demo 6.5, except: the router is provided not hand-rolled; the 'payload' is a serialized React tree not a chunk of HTML; the destination URL is a real server-routable URL, so direct loads, share links, and crawlers all work.

### The layered model — how Next and React fit together

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

#### What runs where

<p class="beat__lede">Same React component, different moments. Same diffing, different renderer.</p>

#### On `next build`

For every **SSG** route (default), Next calls `react-dom/server.renderToString(<Page />)`. The output is an HTML file written to disk under `.next/`. That file is what the CDN serves when you visit the route. **React ran once, at build time, on the build server.**

#### On every request to an **SSR** route

Next calls `react-dom/server.renderToString(<Page />)` again — but live, this time, with whatever cookies / locale / user context the request brought. **React runs per request, on the production server.**

#### On every request to **any** route

The browser receives HTML (whether SSG-built or SSR-built or a CSR shell). Then Next ships a JavaScript bundle. `react-dom/client.hydrateRoot(<Page />)` runs in the browser, walks the same React tree the server walked, and attaches event handlers to the existing DOM nodes the server already painted. **React runs once on the browser to "wake up" the page.** This is hydration. The gap between paint and hydration finishing is the hydration gap — Demo 8's Slow 3G reveal.

#### On every client-side navigation via `<Link>`

Next's router intercepts the click, fetches a serialized React tree (an RSC payload) for the next route, hands it back to React for reconciliation, and React DOM swaps in only the changed sections. **No new server-rendered HTML document.** Same reconciler from Demo 6 — running in the browser, diffing two trees, producing minimal DOM updates.

That's the whole "where does React run in a Next app" map. Build server, production server (for SSR), browser (for hydration, for client-side navigation, for `useEffect`).

#### Server components vs. client components, in one paragraph

<p class="beat__lede"><code>'use client'</code> is a Next-era directive that tells the build "below this point, ship React's <em>client</em> renderer and this component's JS to the browser."</p>

- Above the boundary: components run **only** in `react-dom/server`. They produce HTML. They ship **zero JavaScript** to the browser. They can read databases, call APIs, hit the filesystem.
- Below the boundary: components run in `react-dom/server` first (to produce the initial HTML) **and** in `react-dom/client` after (to hydrate and update). The boundary component plus everything it imports ships to the browser.
- The boundary is not a switch — it's a tree split. Push it down. Tiny client leaves, big server trunks. That's the lesson Demo 8 makes visible with its badges.

#### Every React skill still applies

<p class="beat__lede">Every React concept still applies inside Next.</p>

- Components are still functions of props.
- State is still `useState`. Effects are still `useEffect`. Hooks behave the same way.
- JSX still compiles to `React.createElement` (the bundler does it, not Babel-standalone — but the same compilation).
- The component tree, reconciliation, and diffing from Demo 6.3 are happening on every render.
- What changes is **where** they run (server for the initial render of server components; browser for everything after hydration) and **what wraps them** (Next's router, layouts, conventions).

If you can build a React component in plain React (Demo 6.3), you can build one in Next. The framework adds where and when; it doesn't replace what.

### What you trade for it

<p class="beat__lede">Next gives you a lot. It also makes you eat its opinions.</p>

- **File-based routing isn't optional.** If you want `/foo`, you put `page.tsx` at `app/foo/`. Don't like it? You don't use Next.
- **Next-specific concepts.** `'use client'`, server components, the difference between `app/` and `pages/` (we use the new `app/` — the App Router), `generateStaticParams`, route handlers, middleware. None of these are React concepts — they're Next concepts. You spend the first week learning the new vocabulary.
- **Tighter ecosystem coupling.** Next picks Turbopack as the bundler, picks React Server Components as a default, picks `<Image>` as the image story, picks edge runtime as an option. Some of these decisions you can override; most you'd rather not.
- **Operational decisions.** A pure React + Vite app is a pile of static files — host it anywhere. A Next app needs Node (or Vercel's Functions/Edge runtimes) for anything beyond pure SSG. Hosting becomes a decision.

This is the framework trade-off you read about in the previous demo.

### Forward-look

Two more beats in Part 4 take this same app and dig in.

- **Demo 7** — rendering strategies. The same Swiggy grid at `/ssg`, `/ssr`, `/csr`. View Source is the reveal.
- **Demo 8** — server vs. client components. `/hybrid` shows a server-rendered grid hosting a client-rendered search box, with badges on each.

You now have the framework (this demo), the layered model (above), and the navigation primitive (above). Demos 7 and 8 tour through what runs where, with this same app.

## Takeaways

- **Next.js is the framework option for React.** Same React, hosted by a framework that brings build, router, dev server, prod server, and conventions.
- **`app/` *is* your router.** Files become routes. `layout.tsx` wraps. `page.tsx` renders.
- **`'use client'` is a boundary, not a switch.** Push it down. Tiny client leaves, big server trunks.
- **`<Link>` gives you SPA feel without the SPA tax.** Direct URLs work. Crawlers work. First paint isn't empty. Hover-prefetching is on by default.
- **Layouts persist across navigations.** A `layout.tsx` doesn't re-render when child routes change.
- **Next is a host. React is the engine.** Next calls React DOM. React DOM calls React. React produces a diff.
- **Same React, different `when` and `where`.** Build server (SSG), prod server (SSR), browser (hydration + client nav + effects).
- **`'use client'` decides which half a component is rendered with on the browser side.** Above: server-only, zero JS. Below: hydrated client, ships JS.
- **Every React skill still applies.** Components, state, effects, JSX, hooks — all the same. Next adds where; it doesn't change what.
- **The Demo 6.5 contrast is the lesson.** You wrote 90 lines of router; `<Link>` is free. You served a static shell; Next ships real HTML.
- **The trade is opinions for velocity.** Next decides; you ship faster; you learn its vocabulary.
