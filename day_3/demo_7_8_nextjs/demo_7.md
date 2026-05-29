# "Three routes, three rendering strategies, each in its rightful habitat"

Same Next app, three pages — each one chosen for the strategy that fits *that page's content type*, not arbitrarily. A menu, a personalised feed, a cart. `View Source` on each tells you where the HTML came from, and why that's the right answer for that page.

## Setup

Tab picker above the iframe switches between `/menu`, `/feed`, and `/cart`. **View Source does not work inside iframes** — click ↗ to pop each route into its own tab first.

1. **`/menu` (SSG)** — Meghana Foods' full menu. Reload twice; the `generated at build` timestamp never changes.
2. **`/feed` (SSR)** — "Restaurants near you in Indiranagar." Reload twice; the `rendered on server at` timestamp changes, and the top 3 picks rotate.
3. **`/cart` (CSR)** — Your cart. View Source has no cart data — empty shell. Reload with **Slow 3G** in DevTools → watch the shell sit there while the JS bundle and JSON come down.

## Content

### `/menu` is SSG because the menu doesn't change

<p class="beat__lede">A restaurant's menu is the textbook SSG case. Same dishes, same prices, same description for every visitor. Build once, ship to a CDN, serve in &lt;100 ms anywhere in the world.</p>

- One line decides this: `export const dynamic = "force-static"` at the top of `app/menu/page.tsx`.
- At `next build`, Next runs the page once, captures the HTML, writes it to disk under `.next/`. Every visitor gets the same byte-identical file from the CDN. No server compute per request.
- View Source: every dish, price, and description is in the HTML. No loading state, no fetch waterfall.
- In production you'd add `generateStaticParams` so Next builds one menu page *per restaurant ID* at build time — 1, 100, 100,000 pages all baked once and served from the edge.

What it costs: rebuilding takes time, so menus that change every few minutes are not SSG (use ISR — see "going deeper"). Anything that changes per user is *never* SSG.

### `/feed` is SSR because the feed is personal

<p class="beat__lede">"Restaurants near you" depends on who's asking — location, login, time of day. Can't bake that at build time. So the server renders fresh HTML per request.</p>

- `export const dynamic = "force-dynamic"` is the opt-in. Next labels the route `ƒ Dynamic` in the build output.
- Every request hits the server, runs the page function, produces HTML, and ships it.
- View Source: looks identical in *shape* to `/menu` — the full feed in real HTML. Crawlers see content, slow phones see content. Reload — the timestamp and the top picks change, proving it was rendered just now.
- The personalisation in this demo is faked with a `Date.now() % N` rotation of the restaurants list. In production this is where you read a cookie, hit a DB, or call a recommendation engine. Same shape, more compute.

What it costs: server CPU per request. Caches help (Next's `revalidate`, CDN edge cache, request-level caching), but at base SSR is "pay CPU for freshness." Compare to `/menu` where you paid CPU once.

### `/cart` is CSR because the cart is yours

<p class="beat__lede">A cart is private, login-gated, and deeply interactive. Crawlers shouldn't see it; the public CDN can't cache it. So we ship a near-empty shell, let the browser do the fetch, and let the user's device do the rendering.</p>

- The page file starts with `'use client'`. Next still prerenders a static shell at build time — literally just the `<h1>` and the "loading" spinner — but the cart contents come from a `fetch('/api/cart')` in `useEffect`.
- View Source: no cart items, no totals, no item names. The interesting content is missing from the source on purpose.
- Open DevTools → Network. Reload. The page paints (just the shell). Then a request to `/api/cart` fires. JSON comes back. *Then* the cart items appear. That second wait is the CSR cost.
- Slow 3G makes this brutally visible: the shell paints instantly, but the cart is a spinner for several seconds while the JS bundle plus the JSON come down.

What it costs: empty first paint. CSR's "SPA tax" from Demo 6.5, applied to a single route. Reach for it only when SEO doesn't matter and the page is genuinely interactive.

### The three-row matrix

<p class="beat__lede">Same component model, three answers to "where does the HTML come from?"</p>

| | `/menu` (SSG) | `/feed` (SSR) | `/cart` (CSR) |
|---|---|---|---|
| **When is HTML built?** | Once, at `next build` | Per request, on the server | Per request, in the browser |
| **What's in View Source?** | Full content | Full content | Empty shell |
| **Server CPU per request** | Zero (CDN) | One render | Zero (just shell + JS) |
| **Cache story** | CDN edge, ~∞ TTL | Carefully (per-user) | N/A |
| **If JS is disabled?** | Still works | Still works | Loading forever |
| **SEO?** | Perfect | Perfect | Bad |
| **What kind of page?** | Same for everyone | Per-user, server-derivable | Per-user, deeply interactive |

The strategy is not the framework. SSG / SSR / CSR exist in Vue (Nuxt), Svelte (SvelteKit), Solid (SolidStart), Astro — all of them. Same three answers, different ecosystems. Pick by what kind of page you're building, not by what framework you like.

### Going deeper — ISR is the missing fourth answer

<p class="beat__lede">Sometimes a page is <em>almost</em> static — it changes hourly, daily, or whenever the marketing team edits a CMS entry. SSG is too cold (need to rebuild + redeploy). SSR is too hot (paying CPU on every visit). ISR sits between them.</p>

- **ISR (Incremental Static Regeneration)** — `export const revalidate = 60` in Next means "serve the cached HTML; in the background, regenerate every 60s." You get SSG's cache hit on the request, SSR's freshness within tolerance.
- Used for: news feeds, product catalogues that change a few times an hour, leaderboards.
- We left it off the demo to keep the trio clean, but it's worth knowing — most production apps use ISR on at least one route.

## Takeaways

- **The strategy is chosen by the page, not by the app.** SSG for "same for everyone," SSR for "per-request and SEO matters," CSR for "private + interactive."
- **`/menu` is SSG because menus don't change per visitor.** Build once, serve from CDN, every visitor pays zero server cost.
- **`/feed` is SSR because feeds are personal.** Fresh per request, still complete in View Source for crawlers.
- **`/cart` is CSR because carts are private and interactive.** Empty shell, browser fetches data, JS renders.
- **View Source is the X-ray.** Where the content is in the source tells you which strategy the route uses.
- **The same three answers exist in every framework class.** Nuxt, SvelteKit, SolidStart, Astro — same SSG/SSR/CSR vocabulary, different syntax.
- **ISR is the fourth answer** for content that's *almost* static. Worth knowing.
