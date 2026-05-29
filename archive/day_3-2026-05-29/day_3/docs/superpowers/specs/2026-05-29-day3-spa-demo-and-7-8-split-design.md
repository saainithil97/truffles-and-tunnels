# Day 3 — A standalone SPA demo, and splitting Demos 7 / 8 / 8.5 into separate sections

**Date:** 2026-05-29
**Status:** Approved design
**Part of:** Day 3 — Demystifying Frontend Engineering. Inserts a new "what is an SPA?" beat between Demos 6 and 7, and breaks the existing single-section bundle (`demo_7_8_nextjs`) into three pedagogically distinct sections. No change to the Next.js app's deployment surface.

## Purpose

Two things, in this order:

1. **Give students a concrete object for the word "SPA"** before they meet rendering strategies. Today the curriculum jumps from "React makes UIs declarative" (Demo 6) straight to "here are three rendering strategies" (the bundled `demo_7_8_nextjs`). Students haven't yet seen *the thing those strategies are strategies for* — an app that boots a JS shell and then never reloads. Without that anchor, SSG/SSR/CSR land as arbitrary categories instead of as answers to the SPA's actual problems.
2. **Split the bundled section into three** so each rendering-strategy concept gets its own page anchored on a single compare-and-contrast. Today `demo_7_8_nextjs` tries to teach SSG-vs-SSR-vs-CSR, server-vs-client components + hydration, and client-side routing all on one site page. The student can't tell which "aha" goes with which artifact.

The narrative arc after this change:

> **6.5** shows what an SPA is. **7** shows how the server can do more of the work (SSG, SSR) so you don't pay the SPA's "empty shell first" cost. **8** shows React lets you mix server and client in the same tree. **8.5** shows that once the page is loaded, navigation still feels SPA-fast — best of both worlds.

## Approach

### Demo 6.5 — "The page that never reloads" (new)

Standalone, vanilla JS, no framework. Mirrors the pattern of Demos 3 and 5: multiple HTML entries surfaced via the iframe tab picker, students compare in DevTools.

**Two entries:**

- **A — "Fake MPA"**: three separate HTML files (`index-mpa.html`, `restaurant-mpa.html`, `cart-mpa.html`). Every nav link is a real `<a href>`. DevTools Network shows a new HTML request per click; the page flashes white between navs; scroll position resets.
- **B — "SPA"**: one `index-spa.html` + `app.js`. A click handler on `data-link` anchors intercepts navigation, calls `history.pushState`, swaps the `<main>` contents, fires a `popstate` listener so back/forward work. After the initial load, the Network tab is silent. View Source shows the empty shell (`<main id="app"></main>` + a script tag); the Elements tab shows whatever route is currently rendered.

**The "aha":** *you can build something that feels like a multi-page app without ever leaving the page.* This is what an SPA is. The browser's History API + a `<main>` swap is enough.

**Compare-and-contrast on the demo page:** one table — *what's in View Source · what's in the Network tab after the first load · scroll position · what happens if JS fails · what crawlers see · feels fast?* — with MPA and SPA columns.

**Stays on the Swiggy spine:** three routes — home (restaurant list), restaurant detail, cart. Re-uses tiny snippets of Demo 1's restaurant-card markup so it visually anchors to the spine.

**Runbook beats:**
1. Open A. Click around. DevTools Network shows three HTML loads. Page flashes.
2. Open B. Click around. URL bar updates, no new requests, no flash. Use back/forward — works.
3. View Source on B's home route, then on B's `/restaurant`. Same HTML. The page content lives only in the live DOM.
4. Disable JS in DevTools, reload B. Empty page. Re-enable, reload A. Still works. (Sets up the SEO/CSR problem the next demo solves.)

### Splitting Demos 7 / 8 / 8.5

The existing Next.js app at `day_3/demo_7_8_nextjs/` and its Vercel deployment (env var `NEXT_PUBLIC_DEMO_7_URL`) are untouched as deployment artifacts. Their *site presentation* fragments into three sections.

#### Demo 7 — "Same page, three rendering strategies" (SSG vs SSR vs CSR)

- Embedded iframe with a tab picker over the same deployment: `/ssg`, `/ssr`, `/csr`. Mirrors Demo 3's three-version pattern.
- **Compare-and-contrast** on the demo page: a 3-column table — *when is HTML built · what's in View Source · what does the user see first · who pays the CPU · what happens if JS is disabled · SEO story · cache story.*
- **The "aha":** same pixels, three completely different journeys from your code to the user's eyes.
- **Runbook:** the existing one — right-click → View Source on each route, observe the differences.

#### Demo 8 — "Server components vs client components" (and the hydration gap)

- Embedded iframe of `/hybrid` only.
- **Visual markers in the route** (this is the one Next.js code change in this design): each component gets a small inline badge — `🟢 Server component (0 KB JS)` for the grid wrapper / list items, `🔵 Client component (~N KB)` for the search box. Badges are rendered as small `<span>`s next to or above the component, styled to be unmistakable but unobtrusive. The byte count for the client badge is approximate and hand-authored — we are not wiring up real bundle introspection.
- **Compare-and-contrast** on the demo page: a side-by-side describing what `'use client'` does and doesn't do, anchored on the visible badges in the iframe.
- **The hydration gap** is shown the same way it is today: Slow 3G + hard refresh, observe the dead beat between paint and interactivity. The demo page calls this out explicitly as a second compare-and-contrast: *"looks ready" timeline vs "actually works" timeline.*
- **The "aha":** `'use client'` is a boundary, not a switch. Everything above it ships zero JS.

#### Demo 8.5 — "The URL changes, the page doesn't reload"

- Embedded iframe of `/restaurants` (the list → detail navigation).
- **Compare-and-contrast** on the demo page links directly back to Demo 6.5: 6.5 built routing from scratch with `pushState` and a `<main>` swap; here Next.js's `<Link>` does the same thing, *plus* prefetches the next route on hover, *plus* every URL still works as a direct document load (because the detail routes are prerendered via `generateStaticParams`).
- **Runbook:** navigate around in the iframe — URL changes, no full reload, Network shows tiny RSC payloads instead of full HTML. Then copy a `/restaurants/[id]` URL, paste in a fresh tab — still loads as a real page. Compare to Demo 6.5 part B: same URL pasted in a fresh tab would 404 (no server route exists).
- **The "aha":** Next.js gives you SPA navigation feel *without* the SPA's "URLs only work after JS boots" tax.

This demo depends on 6.5's existence for its core compare-and-contrast. Execution order respects that.

## Architecture changes

### New source files

- **`day_3/demo_6_5/`** — new directory.
  - `index-mpa.html`, `restaurant-mpa.html`, `cart-mpa.html`
  - `index-spa.html`
  - `style.css` (shared)
  - `app.js` (SPA only)
  - `README.md` — the runbook + script.
- **`day_3/demo_7_8_nextjs/demo_7.md`**, **`demo_8.md`**, **`demo_8_5.md`** — three pedagogical content files, one per split section. Each one contains the compare-and-contrast for its section. The existing `day_3/demo_7_8_nextjs/README.md` stays where it is and reverts to its original role: developer documentation for the deployment (setup, env, build commands). It is no longer the source for any site content page.

### Next.js app code change (Demo 8 visual markers)

`day_3/demo_7_8_nextjs/app/hybrid/page.tsx` and any components it composes: add the server/client badges as described under Demo 8. No new dependencies, no new routes, no change to data fetching. The component tree stays as-is — only small badge nodes get added.

### Site curriculum (`site/lib/curriculum.ts`)

- Add a new `Demo` entry `demo_6_5`, `kind: "embedded"`, with **two `iframeEntries`**: `{ label: "MPA (full reload)", path: "index-mpa.html" }` and `{ label: "SPA (no reload)", path: "index-spa.html" }`. Inside each entry students click around — MPA links navigate to `restaurant-mpa.html` / `cart-mpa.html` as real page loads; SPA stays on `index-spa.html` and swaps content. Default `iframePath` is `index-mpa.html` so students see the MPA first (concrete, familiar). Source files surfaced in the Source section: `index-spa.html`, `app.js`, `style.css`. Insert between `demo_6` and the rendering-strategies block in `day3Demos`.
- Replace the single `demo_7_8_nextjs` entry with **three** new entries: `demo_7`, `demo_8`, `demo_8_5`. All three keep `kind: "nextjs-separate"` and `iframeUrlEnvVar: "NEXT_PUBLIC_DEMO_7_URL"`.
- **Schema extension** (small): `nextjs-separate` demos today load the env var's root URL. Add a `iframePathSuffix?: string` field for single-route deep-linking (e.g. `/hybrid`, `/restaurants`), and let `iframeEntries[].path` carry a suffix when `iframeUrlEnvVar` is set (so Demo 7's tab picker can deep-link to `/ssg`, `/ssr`, `/csr` on the same deployment). The demo page composes the iframe URL as `envValue + suffix`. Document this in `lib/curriculum.ts` near the existing `iframePath` / `iframeUrlEnvVar` comments. Confirm the demo page renderer (`site/app/days/3/demos/[slug]/page.tsx`) reads both fields.
- Update `day3Parts`:
  - Add `demo_6_5` to the end of Part 3's `demoSlugs`.
  - Replace the existing "Parts 4–5 — Rendering strategies, hydration, routing" entry with three parts:
    - "Part 4 — Rendering strategies" → `["demo_7"]`
    - "Part 5 — Hydration & component boundaries" → `["demo_8"]`
    - "Part 5.5 — Client-side routing" → `["demo_8_5"]`
- Update `findDay3Item` and `allDay3Slugs` only if needed (they iterate over `day3Demos` already, so adding/removing entries in that array is sufficient).

### Build pipeline (`site/scripts/copy-content.mjs`)

The current `markdownDemos = [id, ...]` array assumes a one-to-one mapping: `day_3/<id>/README.md` → `site/content/day_3/<id>.md`. That breaks for the split, where three site content files come from three non-`README.md` source files in the same source directory.

Generalize the array to entries of the shape `{ src: string, dest: string }`:

- `src` is relative to `day_3/` (e.g. `"demo_6_5/README.md"`, `"demo_7_8_nextjs/demo_7.md"`).
- `dest` is the filename written under `site/content/day_3/` (e.g. `"demo_6_5.md"`, `"demo_7.md"`).

Replace every existing entry with the new shape (no implicit defaults — list every demo explicitly to keep the source of truth obvious). Add entries for `demo_6_5`, `demo_7`, `demo_8`, `demo_8_5`. Drop the old `demo_7_8_nextjs` entry.

Add `demo_6_5` to `staticDemos` so its HTML/CSS/JS gets staged into `site/public/live-demos/demo_6_5/`. `demo_7_8_nextjs` stays absent from `staticDemos` (it's a Next.js app, not static).

### Day 3 source-of-truth README (`day_3/README.md`)

- Add a bullet for Demo 6.5 in Part 3, after Demo 6.
- Split the single bullet under "Parts 4–5 — Rendering strategies, hydration, routing" into three bullets: Demo 7 (rendering strategies), Demo 8 (hydration + component boundaries), Demo 8.5 (client-side routing). Reorganize headings to match the curriculum parts:
  - "Part 4 — Rendering strategies"
  - "Part 5 — Hydration & component boundaries"
  - "Part 5.5 — Client-side routing"

## Data flow

No new data flow. Demo 6.5 has no server — it ships as static files served by the same FastAPI static-server pattern Demos 1/3/4 use locally and by the existing live-demos copy on the site. The split of 7/8/8.5 is presentation-only; the Next.js app continues to read its existing `lib/restaurants.ts` dataset for every route.

## Error handling

Demo 6.5:
- The SPA's click handler only intercepts clicks on `<a data-link>` anchors with same-origin hrefs. External links, ctrl/cmd-click, middle-click, and right-click all fall through to default browser behavior — this is the standard pattern and worth a sentence on the demo page so students understand why it's not a foot-gun.
- If the SPA is loaded directly at `/restaurant` or `/cart` (deep link), there is no server route, so the browser 404s. We do not solve this — it is the **point** of the demo's contrast against Next.js in Demo 8.5.

Split sections:
- If `NEXT_PUBLIC_DEMO_7_URL` is unset at build time, all three new site entries fall back to whatever the existing renderer does today for an unconfigured `nextjs-separate` demo. No new failure mode is introduced.

## Testing

Manual verification on each step of the execution order:

1. **After Demo 6.5 lands:**
   - `npm run dev` in `site/`. Visit `/days/3/demos/demo_6_5`. Tab picker shows both entries (MPA and SPA).
   - In the MPA tabs, DevTools Network records new HTML requests on every nav.
   - In the SPA tab, DevTools Network is silent after the first load; URL updates; back/forward work.
   - View Source on the SPA shows the empty shell.
   - The compare-and-contrast table renders on the demo page.
   - `npm run build` succeeds. `site/public/live-demos/demo_6_5/` contains the four HTML files + CSS + JS.

2. **After the 7/8/8.5 split lands (no Next.js changes yet):**
   - `/days/3/demos/demo_7`, `/demo_8`, `/demo_8_5` all render.
   - Demo 7's tab picker deep-links into `/ssg`, `/ssr`, `/csr` of the deployed app.
   - Demo 8's iframe loads `/hybrid`.
   - Demo 8.5's iframe loads `/restaurants`.
   - Each demo page shows its own compare-and-contrast content.
   - The old `/days/3/demos/demo_7_8_nextjs` route no longer exists (the redirect, if any, is a non-goal — broken link is acceptable since the workshop hasn't been delivered with this URL exposed).

3. **After hybrid badges land:**
   - Open the deployed app's `/hybrid` route (or local prod build). Server-component badges and client-component badge are visible. The client byte count is a hand-authored approximation, not real introspection.

4. **After `day_3/README.md` cleanup:**
   - Markdown linting passes. Headings match the site's parts.

There are no automated tests for any of this — Day 3 is a workshop, not a product, and the existing demos have no test infrastructure. Manual runbooks are the verification surface.

## Open decisions deferred to implementation

- **Exact byte counts on the Demo 8 client badge.** Hand-authored, can be a round number ("~3 KB") — implementation can refine if there's an easy way to read the real bundle output, but not required.
- **Exact wording of compare-and-contrast tables.** Spec defines the columns and the rough shape; the implementer picks the language. Should match Day 3's voice: short, concrete, no jargon students don't already own.
- **Whether to add a "What if JS fails?" toggle inside the Demo 6.5 SPA tab itself,** or leave it as a DevTools runbook step. Defaults to runbook-step (simpler, lighter file).

## Out of scope

- Renaming or splitting the `day_3/demo_7_8_nextjs/` directory or its Vercel project. It stays as one deployment with one env var; only the *site presentation* fragments.
- Renumbering any demos other than introducing `demo_6_5`. Demos 7, 8, 8.5, 9, 10 keep their existing labels (site entries `demo_7`, `demo_8`, `demo_8_5`, `demo_9`, `demo_10`).
- Backwards-compatible redirects from the old `demo_7_8_nextjs` site URL. The workshop hasn't shipped with that URL in any external surface that matters; a broken link is acceptable.
- Any refactor of the existing Next.js app's routes, data layer, or component structure beyond adding the hybrid-route badges.
- Verbal segments and the `wrap` page — untouched.

## Execution order

Strictly sequential. Each step is independently verifiable before the next starts.

1. **Demo 6.5** — new source files in `day_3/demo_6_5/`, new curriculum entry, `copy-content.mjs` change (generalize `markdownDemos`, add 6.5 to `staticDemos`), `day_3/README.md` update for Part 3. Verify with the manual runbook above.
2. **Split 7/8/8.5 site entries** — schema extension (`iframePathSuffix` + suffix-aware `iframeEntries`), three new curriculum entries, three new content files (`day_3/demo_7_8_nextjs/demo_7.md`, `demo_8.md`, `demo_8_5.md`), `copy-content.mjs` mapping update, `day_3/README.md` parts split. Old `demo_7_8_nextjs` site entry deleted. The Next.js app is still untouched; new entries iframe existing routes. Verify all three pages render and deep-link correctly.
3. **Hybrid route badges** — the only Next.js app code change. Add server/client badges to `app/hybrid/page.tsx` (and any components it composes). Redeploy. Verify badges visible.
4. **`day_3/README.md` consolidation pass** — final polish of Part headings and bullets to match the four new sections. (Most of this happens in steps 1 and 2; this is the catch-up pass.)

Each step gets its own implementation plan via the writing-plans skill.
