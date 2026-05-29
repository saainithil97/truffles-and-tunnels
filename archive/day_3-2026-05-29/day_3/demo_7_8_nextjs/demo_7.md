# "Same page, three rendering strategies"

Identical Swiggy grid. Identical pixels. Three completely different journeys from your code to the user's eyes. View Source is the reveal — and the gap between what the server sent and what the user finally sees is where most modern web performance lives.

## Setup

Use the tab picker above the iframe to switch between `/ssg`, `/ssr`, and `/csr`.

1. View Source on each one (`Cmd+Opt+U` / `Ctrl+U`). **View Source does not work inside iframes** — click the iframe's ↗ button to pop the demo into its own tab first.
2. Compare what's in the raw HTML for each route.
3. On `/ssg`, reload a few times — the timestamp baked into the HTML never changes. On `/ssr`, it changes every reload. On `/csr`, the HTML has no timestamp at all (the browser writes one in after the JS runs).
4. Throttle to Slow 3G in DevTools and reload `/csr`. Watch the blank shell sit there while the JS bundle downloads.

## Compare and contrast

<p class="beat__lede">Same component tree, same data. Only the <em>when</em> changes.</p>

| | SSG (`/ssg`) | SSR (`/ssr`) | CSR (`/csr`) |
|---|---|---|---|
| **When is HTML built?** | Once, at `next build` | Per request, on the server | Per request, in the browser |
| **What's in View Source?** | Full grid | Full grid | Near-empty shell |
| **What does the user see first?** | Full content (from CDN) | Full content (after server work) | Loading spinner |
| **Who pays the CPU?** | Build server (once) | Server (every request) | User's device |
| **If JS is disabled?** | Still works (it's HTML) | Still works | Nothing — empty page |
| **SEO?** | Perfect | Perfect | Bad (crawlers see nothing) |
| **Cache story** | CDN-edge cached, blazingly fast | Per-request, cacheable with care | Static shell + dynamic data |
| **Best for** | Content that's the same for everyone | Personalised / per-request data | App-shell behind a login |

## The takeaway-shaped concepts

<p class="beat__lede">SSG, SSR, CSR are not three frameworks. They are three answers to one question: "where does the HTML come from?"</p>

- **SSG (Static Site Generation)** — `export const dynamic = 'force-static'`. The route shows as `○ Static` in the build output. Marketing pages, blog posts, product catalogues, docs. Bake it once and let the CDN do the rest.
- **SSR (Server-Side Rendering)** — `export const dynamic = 'force-dynamic'`. The route shows as `ƒ Dynamic`. Logged-in dashboards, per-locale landings, anything that depends on *who* is asking.
- **CSR (Client-Side Rendering)** — a `'use client'` page that `fetch`es data in a `useEffect`. The route still prerenders to a static shell, but the shell has no real content — the browser fills it in. This is the SPA from Demo 6.5 — same shape, same trade-offs.

## How they connect to Demo 6.5

<p class="beat__lede">CSR <em>is</em> the SPA you just saw. The server gives up and ships an empty shell; the browser does the work. SSG and SSR are answers to the problems that creates.</p>

- The CSR `/csr` route is a pure SPA with one extra page of content. View Source is empty for the same reason Demo 6.5's `index-spa.html` was empty.
- SSG and SSR put real HTML in View Source so crawlers, share-link previews, and slow phones see content immediately.
- After the first paint, all three become interactive React apps. The difference is what shipped first.

## Takeaways

- **Default to SSG when the content doesn't change per user.** Marketing pages, docs, product catalogues. Cheap, fast, SEO-friendly.
- **Reach for SSR when the page depends on *who* is asking and SEO matters.** Logged-in homepages, personalised feeds.
- **CSR is fine for app-shell experiences behind a login.** No SEO need, no first-paint pressure.
- **In View Source, SSG and SSR look identical.** The only tell is whether the timestamp changes on reload.
- **The choice is about the data shape, not the framework.** Same React component, three rendering strategies.
- **`next build` shows you which route is which** — `○ Static`, `ƒ Dynamic`, `λ Function`. Read the build output.
