# Day 3, Demos 7 / 8 / 8.5 — Rendering strategies, hydration & client-side routing

Companion app for the closing trio of Day 3. Full design:
`../docs/superpowers/specs/2026-05-28-day3-demo7-8-rendering-strategies-design.md`.

**One** Next.js App Router app (the stack students use for homework) renders the
**same Swiggy restaurant grid** several ways — so that **View Page Source** and
the **Network tab** reveal *when* and *where* the HTML is actually built. This is
the payoff of Demos 1–3: now that you know how one page loads, you can see how a
real framework decides whether to build it at build time, per request, or in the
browser.

## What's here

- `lib/restaurants.ts` — the canonical typed Swiggy dataset (15 restaurants).
- `components/` — `RestaurantCard` + `RestaurantGrid` (server components),
  `RestaurantSearch` + `FavouriteButton` (client components).
- `app/ssg`, `app/ssr`, `app/csr` — Demo 7: the same grid, three ways.
- `app/hybrid` — Demos 8 & 8.5: a server grid with a nested client search box,
  with cards that navigate client-side.
- `app/restaurants/[id]` — Demo 8.5: the detail page, prerendered per restaurant.
- `app/api/restaurants/route.ts` — the JSON API the CSR page fetches *from the
  browser*.

Built on **Next.js 16 + React 19 + Tailwind 4**, TypeScript, App Router.

## Setup & run

```bash
npm install        # first time only — node_modules is gitignored
npm run dev        # dev server, http://localhost:3000
```

Open `http://localhost:3000`. The home page links all four routes. Keep DevTools
(`Cmd+Opt+I`) open the whole time — the **Network** tab and **View Source**
(`Cmd+Opt+U`) are the demo, not the page.

> **Run Demo 7 against a PRODUCTION build, not `npm run dev`.** In dev mode every
> page (even `/ssg`) re-renders on each request, so the "frozen SSG timestamp"
> reveal won't land. SSG only freezes when it's prerendered at build time. Before
> the session:
>
> ```bash
> npm run build      # bakes /ssg once
> npm start          # serves the production build, http://localhost:3000
> ```
>
> Demo 8 and 8.5 work fine under either `npm run dev` or `npm start`. The
> hydration gap (Demo 8) is easiest to feel under `npm start` too.

> **View Source vs Inspect — say this once, up front.** *View Source*
> (`Cmd+Opt+U`) shows the raw HTML the server sent. *Inspect / Elements* shows
> the live DOM *after* JavaScript has run. The whole of Demo 7 lives in the gap
> between those two — so we use **View Source**, never Elements.

---

## Demo 7 — "The same page, three ways" (SSG vs SSR vs CSR)

Three routes, one identical-looking grid. The reveal is **View Page Source**.

### 0. Slido (before opening anything)

> "You're building a **blog**. Should each post be SSG, SSR, or CSR?"

Let them sit on it. (Answer at the end: **SSG** — content is the same for
everyone and rarely changes, so build it once.)

### 1. `/ssg` — Static, built at build time

Open `http://localhost:3000/ssg`, then **View Source** (`Cmd+Opt+U`). Every
restaurant name is right there in the HTML — `Meghana Foods`, `Truffles`, all of
them. Point at the **`generated at build:` timestamp**.

Now **reload** the page a few times. The grid is there instantly, and the
timestamp **never changes** — it was frozen when you ran `npm run build`. This
page isn't built when you visit; it was built once, ahead of time, and the same
HTML file is handed to every visitor. (This only holds against `npm start` — in
`npm run dev` every page re-renders, so run the production build for this beat.)

### 2. `/ssr` — Server-rendered, per request

Open `/ssr` and **View Source**. Same deal — every restaurant in the HTML, great
for crawlers. But look at the **`rendered on server at:` timestamp**, then
**reload**: it **changes every single time**. This HTML was built on the server
*at the moment you asked for it* — fresh per request.

> "SSG and SSR look identical in the browser and identical in View Source. The
> difference is *when* the HTML was built — once, ahead of time, vs. freshly on
> every request. The timestamp is the only tell."

### 3. `/csr` — Client-rendered, in the browser

Open `/csr` and **View Source**. This time **there are no restaurant names in the
HTML at all** — just an empty shell and a spinner. Scroll the source; it's not
there. Then switch back to the rendered page: the grid *is* there.

What happened: the server sent a near-empty page, the browser ran the
JavaScript, and *only then* did it `fetch('/api/restaurants')` and draw the
cards. Open the **Network tab** and reload — you'll see the document arrive
first (tiny), then a separate `restaurants` request fire *after* the JS runs.
That second request is the data.

### 4. The SEO connection

> "A search-engine crawler reads the HTML the server sends — the same thing
> *View Source* shows. On `/ssg` and `/ssr`, every restaurant is in that HTML,
> so Google can index it. On `/csr`, the crawler sees an **empty shell** — no
> names, no content. Many crawlers won't run your JavaScript, so a CSR page can
> be effectively invisible to search. That's why a public, content-heavy site
> reaches for SSG or SSR."

### 5. The CORS seed (homework warning)

> "Notice that on `/csr` the **browser** made the data call. On SSG/SSR the
> *server* fetched the data, and servers don't enforce CORS. But the moment the
> **browser** calls an API, the browser enforces **CORS** — it will block a call
> to a different origin unless that server explicitly allows it. You'll hit this
> in the homework when your React app calls an API on another domain. Remember
> this beat — it's the same idea: *who* makes the request decides the rules."

### 6. Close the Slido + the follow-up

Reveal: **blog → SSG**. Then the follow-up:

> "And a user's **personal order-history dashboard**?"

> "**SSR or CSR** — it's per-user and changes constantly, so you can't bake one
> version at build time. SSR if you want it in the HTML (logged-in, fast first
> paint); CSR if it's behind a login and SEO doesn't matter."

---

## Demo 8 — "The real world is a hybrid" (Hydration + server/client components)

Real apps aren't purely one strategy. `/hybrid` is a **server-rendered** grid
with a **client** search box living inside it.

### 1. It's all in the HTML

Open `http://localhost:3000/hybrid` and **View Source**. Both the **search
input** and **every restaurant card** are in the HTML — all server-rendered.
Then type in the box: the list filters live. So the page was server-rendered
*and* it's interactive.

### 2. Map the boundary (say it at the whiteboard)

> "In the App Router, components are **server components by default** — their
> JavaScript is *never shipped to the browser*. You only add `'use client'` when
> a component needs interactivity (state, clicks, effects), and you push that
> boundary **as far down the tree as possible** so you ship as little JS as you
> can."

Concretely, in this page:

| Component | Type | Why |
|---|---|---|
| `app/layout.tsx` (shell + nav) | **Server** | Static markup, no interactivity. |
| `app/hybrid/page.tsx` (page shell) | **Server** | Just renders HTML + passes data down. |
| `RestaurantGrid` / `RestaurantCard` | **Server** | Pure display; ship zero JS. |
| `RestaurantSearch` (the input) | **Client** | Needs `useState` + `onChange`. |
| `FavouriteButton` (on the detail page) | **Client** | Needs click state. |

Only the two leaves are `'use client'`. Everything else is HTML with no JS cost.

### 3. The hydration gap (the money beat)

The HTML arrives interactive-looking, but the search box doesn't actually *work*
until React loads and **hydrates** it — wires the server HTML up to the client
JavaScript. On fast localhost that's instant. To *see* the gap:

1. DevTools → **Network** → throttling → **Slow 3G**.
2. Tick **Disable cache** (so the JS bundle really re-downloads).
3. **Hard refresh** (`Cmd+Shift+R`) and watch the search box.

The page **paints immediately** (server HTML), but for a beat the box is
**dead** — type and nothing filters. Then the JS lands, React hydrates, and the
box suddenly **wakes up**. That dead beat is the hydration gap.

> "This is the exact 'pretty ≠ working' beat from Demo 1's Like button — but now
> it's a whole React app. The HTML painted, but the JavaScript that makes it
> *do* something hadn't loaded and hydrated yet."

(We rely on Slow 3G throttling — no framework hacks. Turn throttling back to
**No Throttling** and untick **Disable cache** afterward.)

### 4. Slido

> "You click a button and **nothing happens for 2 seconds**, then it suddenly
> works. What's going on?"

> "**Hydration isn't complete.** The HTML painted, but React's JavaScript hadn't
> loaded and wired up the button yet. Once it hydrated, the click worked."

---

## Demo 8.5 — "The URL is a lie" (Client-side routing)

A tight 5-minute connector. Stay on `/hybrid`.

### 1. Click a card — watch the Network tab

Open the **Network** tab, clear it, then **click any restaurant card**. The URL
changes to `/restaurants/3` and the detail page appears — but there is **no full
HTML document request**. You'll see only a small **RSC / data payload** (filter
by Fetch/XHR). No reload, no white flash. The page never actually navigated in
the browser's old sense.

### 2. The back button still works

Hit the browser **Back** button — it returns to `/hybrid` instantly, again with
no full document load. The history is real even though no pages were reloaded.

> "Next's `<Link>` **intercepts the click**, calls the **History API**
> (`pushState`) to change the URL, fetches just the new page's data, and swaps
> the content in place. The back button works because that's a real history
> entry (`popstate`). The URL looks like a navigation — but no page was ever
> reloaded. *The URL is a lie* (in the best way)."

### 3. The kicker — open in a new tab

**Right-click a card → Open in New Tab.** *Now* you get a **full page load** —
the Network tab shows a real HTML document for `/restaurants/3`, server-rendered
from scratch.

> "This is why SSR/SSG still matter even in a single-page app. Client-side
> routing only kicks in *after* the first page loads. The **first** load of
> *any* URL — someone pasting a link, a crawler, open-in-new-tab — must work
> without your client router. Every one of our detail pages is prerendered, so
> direct URLs just work."

---

## Pre-session checklist (run earlier in the day)

- [ ] `npm install` completed (node_modules is gitignored — must run once).
- [ ] `npm run build` succeeds; route table shows `/ssg` as `○ (Static)`,
      `/ssr` as `ƒ (Dynamic)`, `/restaurants/[id]` as `●` (SSG), and
      `/api/restaurants` as `ƒ (Dynamic)`.
- [ ] For Demo 7: `npm run build` then `npm start` running (SSG freezes only in
      the production build — `npm run dev` re-renders every page).
- [ ] Home page at `http://localhost:3000` links all routes.
- [ ] **View Source** practised: `/ssg` + `/ssr` show full HTML; `/csr` shows an
      empty shell (no restaurant names).
- [ ] Against `npm start`: `/ssr` timestamp changes on reload; `/ssg` timestamp
      does not.
- [ ] `/csr` Network tab shows the `restaurants` fetch firing *after* the JS.
- [ ] `/hybrid` search filters; Slow 3G + Disable cache + hard refresh shows the
      hydration gap (box dead for a beat). Practised once.
- [ ] Clicking a card = RSC payload, no full document; Back works;
      open-in-new-tab = full load. Practised once.
- [ ] Throttling set back to **No Throttling** and **Disable cache** unticked.
- [ ] Display sleep / Caffeinate enabled for the session.

## Notes for the live session

- Local, screen-shared — no public tunnel.
- The "View Source vs Inspect" distinction is load-bearing for Demo 7. Use
  **View Source** (`Cmd+Opt+U`); the Elements panel shows the post-JS DOM and
  will *spoil* the CSR reveal (it'll show the cards).
- If you want a no-network build/run, this app uses no external fonts or images
  (food emoji + CSS gradients only), so `npm run build` works offline once
  `npm install` has run.
