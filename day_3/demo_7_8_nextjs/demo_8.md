# "Server vs client components"

In the App Router, every component is a Server Component by default — its JavaScript never ships to the browser. You add `'use client'` only when a component needs state, effects, or event handlers. The tree above the boundary stays as zero-JS HTML.

`/detail` (the iframe above) is the canonical hybrid example: a server-rendered restaurant menu — every dish in the HTML, zero JS — wrapped around two small client islands: a search input and per-item Add-to-cart buttons.

## Setup

1. Read the badges on the iframe. 🟢 on the shell, the heading, the description, the menu items. 🔵 only on the small interactive surfaces.
2. View Source on `/detail` (pop the iframe into its own tab first). Every dish name and price is in the HTML — including the search box markup. The browser already had the page; the JS just adds interactivity.
3. Throttle to Slow 3G in DevTools and hard-refresh. The page paints almost immediately. Watch the search input for a beat. Now type. **Nothing happens for a moment, then it wakes up.** That's the hydration gap.
4. Type a query — the menu filters instantly. Tap **Add** on a dish — it gets persisted to localStorage. Open `/cart` in a new tab; your additions are merged into the cart.

## Content

### Server vs client — the difference is what ships

<p class="beat__lede">Both render HTML. Only one ships JavaScript to your browser.</p>

| | Server component (🟢) | Client component (🔵) |
|---|---|---|
| **Default?** | Yes (App Router default) | No — opt in with `'use client'` |
| **JS shipped to browser** | Zero bytes | The component's JS + everything it imports |
| **Can use `useState` / `useEffect`?** | No | Yes |
| **Can use event handlers?** | No | Yes |
| **Can read databases / call APIs directly?** | Yes (it runs on the server) | No (use `fetch` like any browser code) |
| **Where it runs** | Server (at build or request time) | Server first (initial HTML) **and** browser (after hydration) |
| **In this demo** | Page header, menu items, sections | Search box, Add buttons |

`'use client'` is a **boundary**, not a switch. Everything above it is server-only. Everything below it (including nested children) ships to the browser. Push that boundary as far down the tree as you can — tiny leaves of interactivity, big trunks of static HTML.

This is not just React's design. Astro's `client:` directives, Svelte 5's runes, Vue/Nuxt islands — all of them are converging on the same shape: server-by-default, opt into client where you actually need it.

### `/detail` is honestly server-trunk + client-leaves

<p class="beat__lede">Look at the component tree. The menu items themselves never enter the client bundle.</p>

```
DetailPage                          🟢 server
├ heading + restaurant info         🟢 server
├ MenuSearchIsland                   🔵 'use client' — input + filter logic
└ MenuList                          🟢 server — renders items
   └ MenuItem × 15                  🟢 server
      └ AddToCartButton              🔵 'use client' — per-item button
```

Two small client components, both isolated leaves. The 15 menu items themselves are server-rendered HTML — they never enter the JS bundle. The search island filters them by DOM manipulation (toggling `display: none` on the items the server painted), not by re-rendering them.

This is the right shape for most pages. Push the boundary down, not up. A common anti-pattern is to slap `'use client'` on the page file because *one* component below needs state — that pulls everything below it into the bundle for no reason.

### The hydration gap

<p class="beat__lede">Server-rendered HTML lands in your browser looking interactive — but it isn't, yet.</p>

- The server sends complete HTML. The browser paints it. Page looks ready.
- Meanwhile, React's JS bundle is still downloading.
- When it arrives, React parses it, walks the same tree the server built, and attaches event handlers to the existing DOM. This is **hydration**.
- Between "looks ready" and "actually works" is the hydration gap. On a fibre connection it's invisible. On Slow 3G it's a multi-second window where the search input drops keystrokes and the Add buttons don't fire.

| | "Looks ready" timeline | "Actually works" timeline |
|---|---|---|
| **What's required** | HTML arrives + CSS arrives | JS bundle arrives + React parses + handlers attached |
| **What the user sees** | The page, fully styled | Search and Add buttons respond |
| **Slow 3G** | ~500ms | ~3–5 seconds |
| **What goes wrong** | Nothing visible | Typing into search drops keystrokes; Add does nothing |

**Hydration mismatch errors** are the most common App Router bug. They happen when the server-rendered HTML doesn't exactly match what the client renders on first pass — random IDs, `Date.now()`, `window.something`. Render that stuff inside `useEffect`, never in the component body.

### Going deeper — what `'use client'` actually pulls in

<p class="beat__lede">It's not just the component. It's everything the component imports, transitively.</p>

A common mistake: a tiny client component imports a 200 KB charting library "just in case." That whole library is now in the route's JS bundle, even when the chart never renders. Push imports — and the boundary itself — as far down the tree as the design allows.

- A button that writes to `localStorage` and re-renders an icon — yes, `'use client'`. ~1 KB.
- A page that has *one* button that needs state — `'use client'` on the button, not on the page.
- An entire page wrapped in `'use client'` because it *might* show a chart someday — that's a code-splitting problem (`React.lazy` from Demo 6.7) plus a boundary problem.

The lesson from Demo 6.7 lands here: less JS in the bundle is less CPU on the user's phone, less battery, less time before "looks ready" becomes "actually works."

## Takeaways

- **Default to server components.** Zero JS in the bundle. They're the trunk.
- **`'use client'` is a boundary, not a switch.** Everything below it ships. Push it down.
- **Server components can read the database directly.** No `fetch`, no API route. They run on the server.
- **Client components can't be `async`.** Server components can — they're rendered once.
- **The hydration gap is real on slow networks.** Bake "actually works" into your perf budget, not just "looks ready."
- **The shape is universal.** Astro islands, Vue/Nuxt islands, Svelte 5 server components — all converging on server-trunk + client-leaves.
- **Push imports down with the boundary.** A 200 KB library imported by a tiny client leaf is in the bundle whether it renders or not.
