# "The URL changes, the page doesn't reload"

Click a restaurant card. The URL changes. No full reload. Network tab shows a tiny payload, not a fresh HTML document. That's `<Link>`. Now copy that URL, paste into a fresh tab — the page still loads as a real document. That's `generateStaticParams`. Best of both worlds.

## Setup

The iframe is on `/restaurants` — a list of restaurants, each card is a `<Link>` to `/restaurants/[id]`.

1. Open DevTools → Network. Filter to "Doc" or "Fetch/XHR".
2. Click a restaurant card. **URL updates. No new HTML request.** What you see in Network is a small RSC payload (React Server Components) — not a full document.
3. Click the back button. URL goes back. No new request.
4. Now copy the detail page's URL (`/restaurants/r-meghana` or similar). Paste it in a fresh tab. **The page still loads** — because it was prerendered at build time.
5. Compare to Demo 6.5's SPA: try pasting `index-spa.html?view=restaurant` in a fresh tab. It works because the SPA reads the URL on init — but try changing the path itself (not a query) and the server 404s.

## Compare and contrast — Demo 6.5 SPA vs Next.js `<Link>`

<p class="beat__lede">Same "URL changes, page doesn't reload" feel. Two completely different mechanisms.</p>

| | Demo 6.5 SPA | Next.js `<Link>` (this demo) |
|---|---|---|
| **What ships to the browser** | One HTML shell + a JS router | Per-route prerendered HTML + the Next.js runtime |
| **First-load HTML content** | Empty shell | Full page (SSG / SSR) |
| **Click handler** | Hand-written `pushState` + view swap | Next.js router intercepts and fetches an RSC payload |
| **Prefetch on hover?** | No | Yes (Next.js prefetches the next route in the background) |
| **Direct URL load in a new tab?** | Only the shell URL works | Every route works (prerendered or built on demand) |
| **What crawlers see** | The empty shell | The actual route's HTML |
| **What if JS fails?** | App is dead after first load | Each route still loads as a real document |
| **Lines of routing code you wrote** | ~90 | ~0 (`<Link>` does it) |

## Why this is the best of both worlds

<p class="beat__lede">An SPA's only advantage over a real-document navigation is feel — clicks are instant after the first load. <code>Link</code> keeps that feel and brings back everything SPAs gave up.</p>

- The first paint comes from prerendered HTML, so crawlers, share-link previews, and slow phones get real content. The SPA's "View Source is empty" problem goes away.
- After the first paint, `<Link>` clicks are intercepted, the next route's RSC payload is fetched (just the data, not a full page), and the page is updated in place. The SPA's "feels instant" stays.
- Hover-prefetching makes the next click feel pre-warmed. By the time you click, the data is already in the browser.
- And every URL still works as a direct document load — copy/paste a link, refresh the page, hit it from a search result. Each one is a real page.

`<Link>` is not magic. It's the SPA pattern you wrote by hand in Demo 6.5, wrapped in a few extra niceties (prefetching, automatic route fetching, automatic loading states), built on top of a base layer (prerendered routes) that the SPA didn't have.

## Going deeper — what `<Link>` actually does

<p class="beat__lede">Conceptually, three things, in order.</p>

- **On render**, the Next.js router scans for `<Link>` elements in the viewport and prefetches their RSC payloads in the background. By the time you hover, the data might already be cached.
- **On click**, the router calls `preventDefault()`, calls `history.pushState` (sound familiar?), and fetches the destination's RSC payload if it isn't already cached.
- **On payload arrival**, React reconciles the new route's tree against the current one and swaps only what changed. The shared layout (header, nav) stays mounted; only the part that differs gets re-rendered.

That's exactly what the SPA in Demo 6.5 did, except:
- The router is provided, not hand-rolled.
- The "payload" is a serialized React tree, not a chunk of HTML.
- The destination URL is a real, server-routable URL — so direct loads, share links, and crawlers all work.

## Takeaways

- **`<Link>` gives you SPA feel without the SPA tax.** Direct URLs work. Crawlers work. First paint isn't empty.
- **Hover-prefetching is on by default.** Your next click is often pre-warmed.
- **The route is always real.** If your URLs only work *after* an SPA boots, that's a sign you're using the wrong tool.
- **Use `<Link>` for in-app navigation. Use `<a>` for external links.** The router only intercepts `<Link>`.
- **Layouts persist across navigations.** A `layout.tsx` doesn't re-render when child routes change — only the changed segment does. That's not just performance, it's the right model for shells with sidebars, headers, persistent state.
- **The SPA pattern from Demo 6.5 is still under the hood.** `<Link>` is `pushState` + RSC fetch + tree reconciliation, packaged.
