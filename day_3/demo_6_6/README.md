# "Intro to Next.js"

You just wrote a 90-line SPA router by hand (Demo 6.5). You just saw React running in a `<script>` tag with no build (Demo 6.3). Now the third option: take React and put it inside a *framework* that brings the build, the router, the dev server, the production server, the deployment, all of it. That's Next.js — and the next four demos all live inside one.

## Setup

The iframe is `/` of the Swiggy Next.js app that powers Demos 7, 8, and 8.5. Same deployment, same code, same Vercel project.

1. Click the four cards in the iframe. Each one is a `<Link>` to a different route. **No page reload.** That's Next's client-side router — what you wrote by hand in Demo 6.5, but free.
2. Pop the iframe out (↗ button). The URL bar updates as you click. Copy any URL into a fresh tab — every one still works. (Try doing *that* with Demo 6.5's SPA — only the shell URL loads from a cold tab.)
3. View Source on `/` from the popped-out tab. Real HTML, the four card links right there. Not the empty shell from Demo 6.5.

## What's in a Next.js project

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
│   ├── <span style="color:#7cffb8">restaurants/[id]/page.tsx</span>  <span style="color:#888">← /restaurants/{id} → Demo 8.5 — dynamic route</span>
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

## Compare and contrast — Demo 6.5 SPA (by hand) vs. Next.js

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

## What you trade for it

<p class="beat__lede">Next gives you a lot. It also makes you eat its opinions.</p>

- **File-based routing isn't optional.** If you want `/foo`, you put `page.tsx` at `app/foo/`. Don't like it? You don't use Next.
- **Next-specific concepts.** `'use client'`, server components, the difference between `app/` and `pages/` (we use the new `app/` — the App Router), `generateStaticParams`, route handlers, middleware. None of these are React concepts — they're Next concepts. You spend the first week learning the new vocabulary.
- **Tighter ecosystem coupling.** Next picks Turbopack as the bundler, picks React Server Components as a default, picks `<Image>` as the image story, picks edge runtime as an option. Some of these decisions you can override; most you'd rather not.
- **Operational decisions.** A pure React + Vite app is a pile of static files — host it anywhere. A Next app needs Node (or Vercel's Functions/Edge runtimes) for anything beyond pure SSG. Hosting becomes a decision.

This is the framework trade-off from Demo 6.2. You take Next's opinions in exchange for never thinking about routing, build, dev server, or production server again.

## Forward-look

Demos 7, 8, and 8.5 each take one slice of this app and dig in.

- **Demo 7** — rendering strategies. The same Swiggy grid at `/ssg`, `/ssr`, `/csr`. View Source is the reveal.
- **Demo 8** — server vs. client components. `/hybrid` shows a server-rendered grid hosting a client-rendered search box, with badges on each.
- **Demo 8.5** — client-side routing. `<Link>` in action; the SPA pattern from Demo 6.5 with the SPA's downsides removed.

Before that, **Demo 6.7** shows what a bundler does (Next has one; plain React + Vite has one; the script-tag demo has none — and that gap is the lesson). Then **Demo 6.8** closes Part 3 with the layered model: where Next ends and React begins.

## Takeaways

- **Next.js is the framework option for React.** Same React, hosted by a framework that brings build, router, dev server, prod server, and conventions.
- **`app/` *is* your router.** Files become routes. `layout.tsx` wraps. `page.tsx` renders.
- **`'use client'` is a boundary, not a switch.** Push it down.
- **The Demo 6.5 contrast is the lesson.** You wrote 90 lines of router; `<Link>` is free. You served a static shell; Next ships real HTML. Same user-facing pattern, very different bill of materials.
- **The trade is opinions for velocity.** Next decides; you ship faster; you learn its vocabulary.
- **One Next deployment powers Demos 7, 8, 8.5.** What you see in this iframe is the same app, sliced into separate teaching demos in the next three.
