# "Frontend at scale — what we couldn't fit"

You now know what the browser does, what React does, and how a page goes from bytes to pixels. But the actual job of a frontend engineer at Swiggy isn't "understand the browser." It's making the right calls *given* the browser, the network, and a million users none of whom have your laptop.

This wrap is the **live audit of swiggy.com** — you point DevTools at a real production site and call out the patterns you now know.

## Setup

Open two windows side by side: this page, and `https://swiggy.com` in another tab. You'll DevTools the second one.

1. Make sure you're not logged in on Swiggy (cleaner traces).
2. Open DevTools on the Swiggy tab.
3. Network tab → check **Disable cache** and **Preserve log** so reloads keep history.
4. Have **Application** and **Lighthouse** tabs ready to switch into.

## Recap — what we've covered, what we haven't

<p class="beat__lede">We taught you the platform. We didn't teach you the practice.</p>

Day 3 has built up the mental model:

- Demos 1–4 — **the browser**: requests, rendering pipeline, DOM, layout, paint.
- Demos 5–6 — **React**: declarative state, virtual DOM, reconciliation.
- Demos 7/8 — **rendering strategies**: SSG, SSR, CSR, hydration, routing.
- Demos 9–10 — **performance and security**: Core Web Vitals, XSS, CORS.

What we haven't covered, and what your first sprint at Swiggy *will* involve:

- Code splitting and lazy loading at the route level (so the 3 MB bundle doesn't ship to every page).
- Image optimisation, font-loading strategies, skeleton screens — the perceived-performance toolkit.
- Optimistic updates and rollback for any user action that talks to a server.
- Error boundaries and graceful degradation so one broken thing doesn't kill the page.
- WebSockets, A/B tests, RUM, design systems, accessibility — each its own discipline.

The audit makes the first five visible. The rest are homework — bookmark them, build them when you hit them.

## The Swiggy audit — DevTools on the real thing

<p class="beat__lede">Open swiggy.com. Reload with the Network tab open. We're going to point at the things you now know to look for.</p>

This is a runbook the presenter walks through live. Follow along in your own DevTools — it'll cement what you've learned.

### Network tab — the production waterfall

Reload the homepage with Network open and look for:

- **Code-split JS chunks.** Filter by **JS**. You'll see one or two big chunks plus a long tail of named chunks (`restaurants-*.js`, `checkout-*.js`, …). The homepage doesn't ship the checkout code — that loads only when you tap a restaurant. *This is route-level code splitting, exactly the thing you'd build with Next.js dynamic imports.*
- **Lazy-loaded images.** Scroll the page slowly. Watch new image requests fire as items enter the viewport. The browser API doing this is `IntersectionObserver`. The HTML attribute is `loading="lazy"`. *This is why a homepage with 200 food photos doesn't take 30 seconds to load.*
- **Image variants.** Click any food-image request. Look at the URL — there's a `?w=` or `_w_` somewhere telling the image CDN what size to deliver. Swiggy doesn't send a 2000 px photo to a 360 px phone. The CDN resizes and converts to WebP/AVIF in real time.
- **Fonts.** Filter by **Font**. Notice how few there are, and how the page text snaps from a system font to the brand font when the file arrives. That's `font-display: swap` — picking FOUT over FOIT. *Connects to "render-blocking" from Demo 3 — fonts can block paint too.*

### Application tab — what they're storing on your machine

- **Cookies** for `swiggy.com` — auth tokens, session ID, A/B test bucket. Notice the `HttpOnly` flag on the session cookie — JavaScript can't touch it (Demo 10's payoff).
- **Local Storage** — UI preferences, recent searches, location consent, cached menu fragments. *Open it and read what's there.* Half of these will surprise you.
- **Cache Storage** / **Service Worker** — if Swiggy has installed a service worker, you'll see cached responses here. Offline browsing for the menu is real.

### Lighthouse — the score

Run an audit (mobile, slow 4G). Look at the **LCP**, **INP**, **CLS** numbers — those are the Core Web Vitals from Demo 9. Click any failing metric → Lighthouse names the file or DOM node that's holding it back. *This is what Swiggy engineers stare at every morning.*

### View Source — SSR vs SPA

Right-click → **View Page Source** on the homepage. The HTML has *actual content* — restaurant names, prices, banner text — already there. That's server rendering (Demo 7/8 SSR). Compare with a route deeper into a single-page app section if you can find one — `View Source` shows an empty `<div id="root">` and the content only appears in **Elements**. *That's why SEO and shareable previews need SSR.*

## What we left for later

<p class="beat__lede">These don't fit Day 3's frame but they're the next things you'll hit.</p>

- **Skeleton screens** — placeholder shapes instead of spinners. Locks in the layout so the page doesn't jump when data arrives (CLS = 0). A spinner says "something's happening"; a skeleton says "*this* is happening, *here*". Half the perceived-performance toolkit.
- **Optimistic updates** — when you tap Add to cart, the count goes up *before* the server confirms. The UI tells a small lie that's right 99% of the time, and rolls back on the 1% it isn't. The reason your apps feel instant.
- **Error boundaries** — a React boundary catches a child component's render crash and shows a fallback instead of taking down the whole tree. Wrap every independently-renderable area. A broken promo banner shouldn't stop someone from ordering food.
- **WebSockets and real-time** — once you've placed an order, the tracking screen is a persistent connection, not polling. `new WebSocket(url)`. Different protocol, different mental model. Probably a Day 4 topic.
- **A/B testing and feature flags** — you and the person next to you may be seeing different Swiggy homepages right now. Every component has hidden branching. There's no good demo — it's an architectural concern.
- **RUM (Real User Monitoring)** — Lighthouse on your laptop measures *your* network. Production measures *every user*. Vitals get beaconed to an analytics endpoint on every page load. Connects to the observability session later in the workshop.
- **Accessibility** — semantic HTML, ARIA labels, keyboard navigation, focus management. Engineering decisions, not afterthoughts. Hundreds of thousands of Swiggy users depend on this working.
- **Design systems** — the shared component library (`<Button>`, `<Card>`, `<Modal>`) plus the rules around it. Frontend's constitution. Architectural, not demo-able.

We mention these so the names stop being unfamiliar. Each is a few days of learning when you hit it.

## Takeaways

- **A production frontend is a thousand small calls under one design.** None of them are hard individually. The skill is making them all at once and keeping the result coherent.
- **Network conditions are not your conditions.** Throttle your DevTools, run Lighthouse on mobile slow 4G, and trust the numbers over your fast-laptop feel.
- **Perceived performance is engineering.** Skeleton screens, optimistic updates, instant routing — all of them lie about how long things take. The lie is the feature.
- **Every component is a potential crash site.** Wrap them in error boundaries and assume something will fail today. It will.
- **Read other people's production code.** DevTools turns every site you use into a textbook. Open swiggy.com, zomato.com, github.com, this page — the patterns repeat. Once you can name them, you can build them.
