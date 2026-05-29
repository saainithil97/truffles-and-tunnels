# "Server components vs client components"

In the App Router, every component is a Server Component by default — its JavaScript never ships to the browser. You add `'use client'` only when a component needs state, effects, or event handlers. The whole tree above the boundary stays as zero-JS HTML.

## Setup

The iframe is on `/hybrid` — a server-rendered grid (the cards and the heading) with a client-rendered search box inside it. Each component in the iframe is labelled with a small badge: 🟢 for server components, 🔵 for client components.

1. Open the iframe and read the badges. The page shell, the heading, and every restaurant card are 🟢 server. The search box is 🔵 client.
2. View Source on `/hybrid` (pop the iframe into its own tab first). Every restaurant name is in the HTML — including the search box markup.
3. Throttle to Slow 3G and hard-refresh. The page paints almost immediately. Watch the search box for a beat. Now type into it. **Nothing happens for a moment, then it wakes up.** That's the hydration gap.

## Compare and contrast — server vs client components

<p class="beat__lede">Both render HTML. Only one ships JavaScript to your browser.</p>

| | Server component (🟢) | Client component (🔵) |
|---|---|---|
| **Default?** | Yes (App Router default) | No — opt in with `'use client'` |
| **JS shipped to browser** | Zero bytes | The component's JS + everything it imports |
| **Can use `useState` / `useEffect`?** | No | Yes |
| **Can use event handlers?** | No | Yes |
| **Can read databases / call APIs directly?** | Yes (it runs on the server) | No (use `fetch` like any browser code) |
| **Where it runs** | Server (at build or request time) | Server first (initial HTML) **and** browser (after hydration) |
| **Marker in this demo** | 🟢 badge | 🔵 badge |

`'use client'` is a **boundary**, not a switch. Everything above it is server-only. Everything below it (including nested children) ships to the browser. Push that boundary as far down the tree as you can — tiny leaves of interactivity, big trunks of static HTML.

## The hydration gap

<p class="beat__lede">Server-rendered HTML lands in your browser looking interactive — but it isn't, yet.</p>

- The server sends complete HTML. The browser paints it. Page looks ready.
- Meanwhile, React's JS bundle is still downloading.
- When it arrives, React parses it, re-renders the component tree in memory, and attaches event handlers to the existing DOM. This is **hydration**.
- Between "looks ready" and "actually works" is the hydration gap. On a fibre connection it's invisible. On Slow 3G it's a multi-second window where buttons don't click and inputs don't accept text.

| | "Looks ready" timeline | "Actually works" timeline |
|---|---|---|
| **What's required** | HTML arrives + CSS arrives | JS bundle arrives + React parses + handlers attached |
| **What the user sees** | The page, fully styled | The page, but now responsive to clicks |
| **Slow 3G** | ~500ms | ~3-5 seconds |
| **What goes wrong** | Nothing visible | Clicking the search box drops keystrokes |

**Hydration mismatch errors** are the most common App Router bug. They happen when the server-rendered HTML doesn't exactly match what the client renders on first pass — random IDs, `Date.now()`, `window.something`. Render that stuff inside `useEffect`, never in the component body.

## Takeaways

- **Default to server components.** Zero JS in the bundle. They're the trunk.
- **`'use client'` is a boundary, not a switch.** Everything below it ships. Push it down.
- **Server components can read the database directly.** No `fetch`, no API route. They run on the server.
- **Client components can't be `async`** (they re-render). Server components can — they're rendered once.
- **The hydration gap is real on slow networks.** Bake "actually works" into your perf budget, not just "looks ready."
- **Don't reach for `'use client'` because you can't think of a reason not to.** Reach for it because the component needs `useState`, an effect, or an event handler. Anything else stays server-only.
