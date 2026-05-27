# Day 3, Demos 7 / 8 / 8.5 — Rendering strategies, hydration & client-side routing

**Date:** 2026-05-28
**Status:** Approved design
**Part of:** Day 3 — Demystifying Frontend Engineering. The closing trio of
demos; moves from "how does a single page load" (Demos 1–3) to "how does a real
framework decide *when* and *where* HTML is built." Continues the Swiggy spine.

## Purpose

Make the three rendering strategies — **SSG**, **SSR**, **CSR** — and the two
concepts that glue them together — **hydration** and **client-side routing** —
visible and concrete, using the tool students already trust: **View Page
Source** and the **Network tab**.

One Next.js App Router app powers all three demos:

- **Demo 7 — "The same page, three ways."** The identical Swiggy grid at `/ssg`,
  `/ssr`, `/csr`. View Source is the reveal: SSG and SSR ship full HTML; CSR
  ships an empty shell.
- **Demo 8 — "The real world is a hybrid."** `/hybrid` is a server-rendered grid
  with a client search box nested inside it. Slow 3G makes the **hydration gap**
  visible — HTML paints, the box is dead for a beat, then wakes up.
- **Demo 8.5 — "The URL is a lie."** Clicking a card navigates to
  `/restaurants/[id]` with no full-document request — the client router swaps
  content via the History API. Open-in-new-tab proves the page still works as a
  full server load.

## Approach

Build the stack students use for homework: **Next.js App Router + TypeScript +
Tailwind** (scaffolded with `create-next-app`). One typed dataset
(`lib/restaurants.ts`) feeds every route, so the *rendering strategy* is the only
variable — exactly the "same page, differ in one thing" device from Demo 3.

- **SSG** = `export const dynamic = 'force-static'` + a build-time timestamp
  baked into the HTML. The route shows as `○ Static` in the build output.
- **SSR** = `export const dynamic = 'force-dynamic'` + `new Date().toISOString()`
  rendered server-side per request. Shows as `ƒ Dynamic`.
- **CSR** = a `'use client'` page that `fetch`es `/api/restaurants` in a
  `useEffect` with a loading spinner. The route still prerenders to a `○ Static`
  shell, but the shell has no restaurant names — the browser fills them in.
- **Hydration** = a server page (`/hybrid`) passing the list to a `'use client'`
  search component. The hydration gap is shown via **Slow 3G + hard refresh**;
  no framework hacking. (Browser throttling is the chosen device; an artificial
  bundle-execution delay was considered and rejected as a framework hack.)
- **Client-side routing** = `next/link` cards → `/restaurants/[id]` detail page,
  pre-rendered per id via `generateStaticParams` so direct URLs (open-in-new-tab)
  load as full pages.

Next.js 16 note: `dynamic` route-segment config still works under the default
config (it is only removed when *Cache Components* is enabled, which it is not).
`params` is now a Promise and is awaited in the detail page.

## Files (`day_3/demo_7_8_nextjs/`)

| File | Role |
|---|---|
| `lib/restaurants.ts` | The canonical typed Swiggy dataset (15 restaurants) + `getRestaurant`. |
| `components/RestaurantCard.tsx` | Server component; one card, links to the detail page. |
| `components/RestaurantGrid.tsx` | Server component; the grid of cards. |
| `components/RestaurantSearch.tsx` | **Client** component; the search input that filters the server-rendered list (Demo 8). |
| `components/FavouriteButton.tsx` | **Client** component; the "Add to favourites" toggle (server/client boundary example). |
| `app/layout.tsx` | Server component; root shell + nav. No Google fonts (offline-safe build). |
| `app/page.tsx` | Server component; signpost home page linking the routes. |
| `app/ssg/page.tsx` | `force-static`; build-time timestamp + grid (Demo 7). |
| `app/ssr/page.tsx` | `force-dynamic`; per-request timestamp + grid (Demo 7). |
| `app/csr/page.tsx` | `'use client'`; fetches `/api/restaurants` in the browser (Demo 7). |
| `app/api/restaurants/route.ts` | `force-dynamic` JSON API the CSR page calls from the browser. |
| `app/hybrid/page.tsx` | Server page hosting the client search (Demos 8 & 8.5). |
| `app/restaurants/[id]/page.tsx` | Async detail page; `generateStaticParams` prerenders all 15 (Demo 8.5). |
| `README.md` | The runbook (setup, Demo 7 / 8 / 8.5 flows, Slido blockquotes, checklist). |

## Demo flow (lands in `README.md`)

- **Demo 7:** Open `/ssg`, `/ssr`, `/csr`; View Source each. SSG/SSR = full HTML;
  SSR timestamp changes on reload; CSR = empty shell. SEO + CORS seed notes.
  Slido: blog → SSG; personal dashboard → SSR/CSR.
- **Demo 8:** `/hybrid` — View Source shows grid + search box. Type to filter.
  Slow 3G + hard refresh shows the hydration gap. Map server vs client
  components. Slido: "click does nothing for 2s then works" → hydration.
- **Demo 8.5:** From `/hybrid`, click a card → Network tab shows an RSC payload,
  not a full document. Back button works. Open-in-new-tab = full load. Tight
  5-min connector on the History API + the router intercepting clicks.

## Verification

- `npm install` then `npm run build` compiles with **no errors**.
- Build route table confirms the strategies are wired: `/ssg` is `○ Static`,
  `/ssr` is `ƒ Dynamic`, `/restaurants/[id]` is `●` (SSG, 15 prerendered),
  `/api/restaurants` is `ƒ Dynamic`.
- View Source per route behaves as described (full HTML vs empty shell).
- Against `npm start` (production build): `/ssg`'s timestamp is identical across
  requests (frozen at build) while `/ssr`'s changes per request. Under
  `npm run dev` every page re-renders, so Demo 7 must be run against the
  production build — the README states this prominently.

## Out of scope

- Real databases / external APIs (the dataset is in-memory and typed).
- Authentication, per-user data (the dashboard Slido is conceptual only).
- Incremental Static Regeneration, streaming/Suspense, Server Actions, Cache
  Components — later/advanced material.
- Hacking the framework to force a hydration delay; Slow 3G throttling is used
  instead.
- Sourced photos; food emoji + CSS gradients only.
