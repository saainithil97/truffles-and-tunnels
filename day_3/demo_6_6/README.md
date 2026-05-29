# "Intro to Next.js"

You just wrote a 90-line SPA router by hand (Demo 6.5). In Demo 6 you saw React running in a `<script>` tag with no build. Now the third option: take React and put it inside a *framework* that brings the router, the build, the dev server, the production server, the deployment — all of it. That's Next.js, and the next three demos all live inside one.

## Setup

The iframe is `/` of the Swiggy Next.js app that powers Demos 7 and 8. Same deployment, same code, same Vercel project.

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
├── <span style="color:#fc8019">components/</span>                    <span style="color:#888">← reusable components</span>
│   ├── <span style="color:#7cffb8">RestaurantCard.tsx</span>
│   ├── <span style="color:#7cffb8">RestaurantSearch.tsx</span>
│   └── <span style="color:#7cffb8">FavouriteButton.tsx</span>
├── <span style="color:#fc8019">lib/</span>
│   └── <span style="color:#7cffb8">restaurants.ts</span>             <span style="color:#888">← data (server can read it directly; clients via fetch)</span>
├── <span style="color:#7cffb8">next.config.ts</span>                 <span style="color:#888">← Next-level config (rewrites, images, env, …)</span>
├── <span style="color:#7cffb8">package.json</span>                   <span style="color:#888">← npm deps: react, react-dom, next, tailwind</span>
├── <span style="color:#7cffb8">tsconfig.json</span>                  <span style="color:#888">← TypeScript config</span>
└── <span style="color:#7cffb8">postcss.config.mjs</span>              <span style="color:#888">← Tailwind / PostCSS pipeline</span>
</pre>
</figure>

Two rules the file tree is telling you:

- **`app/` *is* the router.** A `page.tsx` at `app/foo/page.tsx` is the route `/foo`. A `page.tsx` at `app/restaurants/[id]/page.tsx` is the dynamic route `/restaurants/anything`. You don't register routes; you create files. File-routing is Next's convention; SvelteKit does the same with `src/routes/`, Nuxt with `pages/`, SolidStart with `routes/`, Astro with `src/pages/`. The vocabulary is shared across the framework class.
- **`layout.tsx` wraps everything below it.** The root `app/layout.tsx` wraps every page. A nested `app/dashboard/layout.tsx` would wrap only `/dashboard/*` pages. Persistent UI (sidebars, headers, providers) goes in a layout — it doesn't re-render when you navigate within its subtree.

### Compare and contrast — Demo 6.5 SPA (by hand) vs. Next.js

<p class="beat__lede">You wrote one version yourself. Next gives you the other.</p>

| | Demo 6.5 hand-rolled SPA | Next.js |
|---|---|---|
| **Routing** | `pushState` + click handler, ~90 lines | File-based, free |
| **Build / bundler** | None (script tag) | Turbopack, free |
| **Dev server with HMR** | `python3 -m http.server` | `next dev` |
| **First-paint HTML** | Empty shell | Real content (Demo 7) |
| **Crawlers see** | Nothing | Everything |
| **New "page"** | Add a view + register a route in `app.js` | Create a file under `app/` |
| **Data fetching on server** | Impossible (no server) | Server component reads DB directly |
| **API routes** | Separate backend or static JSON | `app/api/*/route.ts` next to your pages |
| **Deploy** | `python3 -m http.server` on any host | `vercel deploy` or `npm run build && npm start` |
| **Lines of "infrastructure" code you write** | ~150 LOC to start | One command (`npx create-next-app`) |
| **Lock-in** | None | Significant — you adopt Next conventions |

This is the framework trade from Demo 6, made concrete. The same trade exists for Nuxt (around Vue), SvelteKit (around Svelte), SolidStart (around Solid). Same shape, different ecosystem.

### `<Link>` gives you SPA navigation without the SPA tax

<p class="beat__lede">Click a restaurant card. The URL changes. No full reload. Copy that URL, paste into a fresh tab — the page still loads as a real document. <code>&lt;Link&gt;</code> is the SPA pattern from Demo 6.5, wrapped, with the SPA tax removed.</p>

An SPA's only advantage over a real-document navigation is feel — clicks are instant after the first load. `<Link>` keeps that feel and brings back everything SPAs gave up.

- **On render**, the Next router scans for `<Link>` elements in the viewport and prefetches their data in the background. By the time you hover, the data might already be cached.
- **On click**, the router calls `preventDefault()`, calls `history.pushState` (sound familiar?), and fetches the destination's payload if it isn't already cached.
- **On payload arrival**, React reconciles the new route's tree against the current one and swaps only what changed. The shared layout (header, nav) stays mounted; only the part that differs gets re-rendered.

That's the SPA pattern from Demo 6.5, except: the router is provided, not hand-rolled; the destination URL is a real server-routable URL, so direct loads, share links, and crawlers all work.

Vue's `<router-link>`, Svelte's progressive-enhancement `<a>`, Solid Start's `<A>` — all do the same job in their respective frameworks.

### What you trade for it

<p class="beat__lede">Next gives you a lot. It also makes you eat its opinions.</p>

- **File-based routing isn't optional.** If you want `/foo`, you put `page.tsx` at `app/foo/`. Don't like it? You don't use Next.
- **Next-specific concepts.** `'use client'`, server components, route handlers, middleware. None of these are React concepts — they're Next concepts. You spend the first week learning the vocabulary.
- **Tighter ecosystem coupling.** Next picks Turbopack as the bundler, picks React Server Components as a default, picks `<Image>` as the image story. Some you can override; most you'd rather not.
- **Operational decisions.** A pure React + Vite app is a pile of static files — host it anywhere. A Next app needs Node (or Vercel's Functions/Edge runtimes) for anything beyond pure SSG. Hosting becomes a decision.

This is the framework trade you read about in Demo 6. Next is one realisation of it. Choose the framework that matches the rest of your stack: Next for React, Nuxt for Vue, SvelteKit for Svelte, SolidStart for Solid. Same packaging, different ecosystem.

### Forward-look

Now you have the framework. Three demos peel back what's inside it.

- **Demo 6.7** — the bundler Next handed you for free. Same engine you'd reach for in a non-Next React project (Vite). What it's actually doing to your code.
- **Demo 7** — rendering strategies. The same Swiggy grid at `/ssg`, `/ssr`, `/csr`. View Source is the reveal.
- **Demo 8** — server vs. client components. `/hybrid` shows a server-rendered grid hosting a client-rendered search box, with badges on each.

## Takeaways

- **Next.js is the framework option for React.** Same React, hosted by a framework that brings build, router, dev server, prod server, and conventions.
- **`app/` *is* your router.** Files become routes. `layout.tsx` wraps. `page.tsx` renders. Nuxt, SvelteKit, SolidStart, Astro all share the file-routing idea.
- **`<Link>` gives you SPA feel without the SPA tax.** Direct URLs work. Crawlers work. First paint isn't empty. Hover-prefetching is on by default.
- **Layouts persist across navigations.** A `layout.tsx` doesn't re-render when child routes change.
- **The trade is opinions for velocity.** Next decides; you ship faster; you learn its vocabulary.
- **Next is one realisation of the framework class.** Same job, different ecosystem — Nuxt (Vue), SvelteKit (Svelte), SolidStart (Solid), Astro (multi-framework).
