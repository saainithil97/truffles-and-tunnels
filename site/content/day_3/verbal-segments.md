# Verbal segments — the workshop's connective tissue

The demos are the spine of Day 3, but the bits between them are where the picture comes together. These short reads are the conceptual bridges — the tooling under your feet, the platform around you, the styling on top, and the homework that ties it all together. Treat them as required reading between demos.

## Tooling break — Node and npm

You've been writing JavaScript that runs *in the browser* all day. Now meet the plumbing that gets it there.

**Node.js.** JavaScript's engine is V8 — the thing inside Chrome that runs your scripts. **Node is V8 pulled out of the browser** and handed access to the filesystem and the network, so JavaScript can run as a server-side program. That's not abstract. When you run `next dev` to start the homework, you're starting a **Node process**. Your dev server *is* Node. There's no browser involved until you open a tab.

**npm, `package.json`, and `node_modules`.** npm is the package registry — the App Store for JavaScript libraries. `package.json` is your project's manifest: it lists every dependency you asked for, by name and version. When you run `npm install`, npm reads that list, downloads each library *and everything those libraries depend on*, and writes the whole tree into a folder called `node_modules`.

Open `node_modules` once and you'll see 50,000 files for a basic app. Don't panic — that's normal. It's every dependency-of-a-dependency-of-a-dependency. And don't commit it; it's in `.gitignore` for a reason. `package.json` is the recipe. `node_modules` is the groceries. You ship the recipe; anyone can re-fetch the groceries with one command.

**Bundling.** That's its own demo — see **Demo 6.7 — "What a bundler actually does"** in Part 3 for the bundler story (tree shaking, code splitting, the `next build` route table, how plain React + Vite handles it, and why Demo 8's "0 KB JS" badge is a bundle story). The headline: a bundler walks your `import` graph, compiles JSX, splits per route, drops unused code, and produces the handful of files the browser actually loads.

## Other browser APIs — the platform tour

The browser is not just a rendering engine. It ships a large collection of built-in APIs — things your JavaScript can call without installing anything. Most workshops skip this list because there are too many to demo. So instead: one paragraph per API, one concrete use case, and a Swiggy example where it fits. Read this once, then bookmark it for the day you need one.

- **`fetch`** — the modern way to make an HTTP request from JavaScript. `fetch('/api/restaurants').then(r => r.json())` is all you need. Reach for it whenever the page needs to talk to a backend *after* first load — loading more restaurants, submitting an order, refreshing a feed. It replaces the older `XMLHttpRequest`, which was verbose and callback-heavy.

- **`IntersectionObserver`** — tells you when an element scrolls into the viewport. This is exactly how a 500-restaurant listing lazy-loads images: don't download the photo until the card is about to appear on screen. One observer, one callback, no scroll-event listeners, no layout thrashing.

- **`ResizeObserver`** — tells you when an element changes size. Useful when a custom component needs to re-layout itself in response to its container shrinking — for example, a restaurant card that switches from a horizontal to a vertical layout at a certain width. Cleaner than polling or listening to `window.resize`.

- **`history` (pushState / popstate)** — change the URL bar without reloading the page. `history.pushState({}, '', '/restaurants/meghana-foods')` rewrites the URL; the `popstate` event fires when the user hits Back. This is the foundation of every single-page app. **Demo 6.5** is built on it directly; **Demo 6.6** (Next.js) wraps it into a `<Link>` component so you never call it by hand.

- **Web Workers** — move heavy computation off the main thread. If sorting 10,000 restaurant results by distance, parsing a large CSV, or running an image filter is making the UI freeze, hand the work to a Worker. It runs in a separate thread and posts results back when done. The page stays responsive.

- **`requestAnimationFrame`** — the right way to run an animation loop. Instead of `setInterval(draw, 16)` — which fights the display refresh — `requestAnimationFrame` calls your function right before the browser paints the next frame. Animations are smooth; you never overdraw.

- **`navigator.geolocation`** — how Swiggy knows your delivery address the moment you open the app. The browser prompts for permission, then hands your page a latitude and longitude. One API call; no GPS hardware to manage.

- **WebSocket** — a two-way pipe that stays open between browser and server. Once connected, either side can push a message at any time. Live order tracking ("your rider is 2 minutes away"), support chat, live score updates — anything where waiting for a user action to trigger a request is too slow.

- **Notifications** — the "Your order is on the way" banner that pops in the corner even when the tab is in the background. The browser asks permission once; after that your page can push a notification at any time.

- **Service Worker** — a script that sits between your app and the network and intercepts every request. It can serve assets from a local cache when the user is offline, pre-cache routes in the background, and handle push notifications. This is the technology behind "install to home screen" and airline apps that work in airplane mode.

- **Canvas / WebGL** — a pixel-drawing surface. The delivery map is Canvas (or a WebGL-accelerated map library built on Canvas). Charts, image filters, and browser games all live here.

You don't learn these on Day 3. You bookmark them. When you have a feature to build, check this list before reaching for a library — the platform usually already does it.

## Other libraries and frameworks — what else exists

React won most of today's airtime, but it is one point on a spectrum. Here is a quick tour of the alternatives you will encounter on job boards, in open-source repos, and in team tech-stack discussions.

**Vue** is often called the gentler React. The mental model is the same — declarative components, a virtual DOM, reactivity — but Vue packages each component as a single `.vue` file that holds the template, the script, and the styles together in one place. Many developers find the learning curve gentler and the docs better organised. Vue is widely used across China (Alibaba, Baidu) and many European product teams, and it shows up on almost every frontend job board.

**Svelte** is not a runtime library — it is a *compiler*. You write components that look vaguely like HTML with extra syntax; the build step turns them into lean, hand-written-looking DOM mutations with no framework code shipped to the browser. There is no virtual DOM at runtime. The result is smaller bundles and often faster interactions for highly dynamic UIs. The New York Times and Spotify's ad-tech team use it in production.

**Solid** looks like React at a glance — it uses JSX, and its API resembles hooks — but underneath it is fundamentally different. Instead of re-running components when state changes, Solid tracks state at the *signal* level: each piece of state is a fine-grained reactive primitive, and only the exact DOM nodes that depend on a signal update when it changes. Components run once. This makes Solid consistently faster than React for fine-grained updates. The community is smaller; the ecosystem is younger.

**Angular** is Google's full framework — not a library. It ships with an HTTP client, a router, a forms system, dependency injection, and its own module system. Where React hands you building blocks and lets you assemble your own architecture, Angular hands you a complete, opinionated blueprint. It has been TypeScript-first since before TypeScript was cool. It is the dominant choice for large enterprise teams who want one answer to every question and a long support lifecycle.

**htmx** takes a different philosophy entirely. There is no JavaScript framework — instead, you add attributes to your HTML (`hx-get="/restaurants"`, `hx-target="#results"`) and the library handles making the request and swapping the response into the page. The server renders HTML; htmx delivers it to the right place. It is popular with backend-heavy teams (Django, Rails, Laravel) who want richer interactions without committing to a full frontend framework.

React won the workshop tour because it is what you will most likely see at work and what Next.js is built on. But the choice between these is mostly about team taste and what you are optimising for — bundle size, learning curve, server-rendering posture. None of them are objectively wrong.

## CSS and styling — the third leg

You don't need to master CSS today. You need just enough to build the homework and to debug a layout when it goes sideways.

**The box model.** Every element on the page is a box, and every box has four layers, from the inside out: **content → padding → border → margin**. Content is the text or image. Padding is space *inside* the border. Border is the line. Margin is space *outside* the border that pushes other boxes away.

Open DevTools → Elements → hover an element. You'll see the box-model diagram: content in blue, padding in green, margin in orange. **Every layout bug you will ever hit comes back to this picture.** "Why is there a gap there?" Margin. "Why is the text touching the edge?" No padding. Learn to read this diagram and half of CSS debugging is done.

<svg width="600" height="240" xmlns="http://www.w3.org/2000/svg">
  <rect x="0" y="0" width="600" height="240" fill="#f5f5f5"/>
  <text x="300" y="25" font-family="ui-sans-serif" font-size="13" font-weight="600" text-anchor="middle" fill="#171717">The box model</text>
  <rect x="100" y="50" width="400" height="160" fill="#fde8d4" stroke="#fc8019" stroke-width="1" stroke-dasharray="4,3"/>
  <text x="115" y="68" font-family="ui-sans-serif" font-size="11" fill="#fc8019">margin</text>
  <rect x="150" y="80" width="300" height="100" fill="#ffffff" stroke="#171717" stroke-width="2"/>
  <text x="165" y="98" font-family="ui-sans-serif" font-size="11" fill="#171717">border</text>
  <rect x="180" y="105" width="240" height="50" fill="#f5f5f5" stroke="#a3a3a3" stroke-width="1" stroke-dasharray="3,3"/>
  <text x="195" y="121" font-family="ui-sans-serif" font-size="11" fill="#a3a3a3">padding</text>
  <rect x="240" y="120" width="120" height="20" fill="#fc8019"/>
  <text x="300" y="135" font-family="ui-sans-serif" font-size="11" text-anchor="middle" fill="#ffffff">content</text>
</svg>

**Flexbox.** A one-dimensional layout — a row or a column. It's how you line things up, and crucially how you center things (the eternal CSS struggle):

```css
display: flex;
align-items: center;      /* center on the cross axis */
justify-content: center;  /* center on the main axis */
```

Those three lines center anything inside anything. Memorize them.

**Grid.** Flexbox's two-dimensional sibling — rows *and* columns at once. When you build the restaurant listing in the homework, that wall of cards is a Grid: define your columns once, drop the cards in, and they flow into a neat responsive matrix.

**Tailwind.** Instead of writing CSS in a separate file, Tailwind gives you utility classes you put directly on the element: `flex items-center p-4 bg-gray-100`. Each class is one tiny style — `p-4` is padding, `flex` is `display:flex`, and so on. It looks ugly and wrong the first time — *why is there a paragraph of class names on my div?* — but it works great, you stop inventing class names, and the styles live right next to the markup. You'll use Tailwind in the homework.

**Bottom line.** Don't try to master CSS today. Use AI to generate your styles — it's genuinely good at it. But understand the **box model** and **Flexbox** yourself, because those are the two things you'll need to *debug* what the AI gives you.

## Homework — build a small Swiggy-style restaurant discovery app

Build a small restaurant discovery app in **Next.js (App Router)**, deploy it to **Vercel**, and submit a live URL. This is the stack from Demos 7 and 8 — server components, client components, the App Router.

**What it needs:**

- A **listing page at `/`** — a grid of restaurant cards. Each card has an emoji or placeholder image, the restaurant name, a list of cuisines, a rating, and a delivery time.
- A **search filter** at the top of the listing page — type into the box and the cards filter live to those matching the name or cuisine. This is the one piece that *has* to be a client component (it needs state and `onChange`); think about why.
- A **detail page at `/restaurants/[id]`** — clicking a card lands the user on that restaurant's page with the full info and a (fake) menu of a few items. Use a dynamic route segment.
- **Hardcoded data.** No backend, no database. A 15-restaurant array in `lib/data.ts` that both pages import. Swiggy-style: Meghana Foods, Truffles, Empire, Glen's Bakehouse, A2B, etc.
- **Styled with Tailwind.** Don't over-design. Clean grid, readable cards, hover state on the cards.
- **Deployed to Vercel** with a working public link. Push to GitHub, import the repo on Vercel, ship it.

**Acceptance criteria — your app passes if:**

1. The listing page loads at the deployed URL and shows all 15 restaurants in a responsive grid.
2. Typing in the search box filters the visible cards as you type.
3. Clicking a card navigates to `/restaurants/[id]` and shows that restaurant's detail.
4. A Lighthouse Performance score of 90+ on the deployed URL (in Incognito, mobile). Next.js gives you this almost for free if you don't fight it.
5. You can answer three questions about **every page** you wrote: *what rendering strategy is this — SSG, SSR, or CSR? Is this a server component or a client component? Where does the HTML actually get built?*

Use AI freely to generate the code. But for every piece it gives you, you must be able to answer those three questions. If you can't, you don't understand what you shipped — and that's the entire point of today.

A reference implementation will be pushed to the Day-3 branch after the workshop so you can check your answers against ours. Don't peek until you've tried it yourself.

## 60-second recap

The whole day in one breath. You type a URL. The browser makes a **request**, gets HTML back, parses it into the **DOM** (a tree of objects), applies CSS to style that tree, runs **layout** to figure out where every box goes, then **paints** pixels to the screen. **JavaScript** can mutate the DOM, but every change forces re-layout and re-paint — expensive in the small, ruinous in a loop. That's why **React** keeps a lightweight copy (the **virtual DOM**), diffs it, and tells the real DOM only the minimal set of changes. React is a *library*, not a framework — it ignores routing, data, build, and styling. That gap is what **single-page apps** improvise solutions for, and what **Next.js** packages up: file-based routing, a bundler, a dev server, `<Link>` navigation, plus SSG/SSR/CSR rendering strategies. Your first load arrives server-rendered (fast and crawlable), then React **hydrates** it in the browser so it becomes interactive.

The quick-reference card:

- **Demo 1 — Network.** What changes between "I typed a URL" and "I see a card": HTML, CSS, JS, images — each its own request, in order.
- **Demo 2 — The DOM is not the HTML.** HTML is the frozen text from the server. DOM is the live tree the browser is holding. JS only ever edits the DOM.
- **Demo 3 — Order matters.** Where you put a `<script>` decides whether the page is blank for two seconds. `defer` in `<head>` is the default you want.
- **Demo 2.5 — Storage.** Three drawers: cookies (sent to the server every request), localStorage (forever, browser-only), sessionStorage (per tab, browser-only).
- **Demo 4 — Pure JS hits a wall.** Three pains the language doesn't help with: state↔UI drift across surfaces, no standard composition vocabulary, the DOM punishes hot loops. Not language problems — missing-abstraction problems.
- **Demo 5 — The shape of every library that fixes this.** React, Vue, Svelte, Solid all agree: describe state → UI, the library does the sync. Three mechanisms (virtual-tree diff, build-time compilation, signals), one destination — minimum real-DOM work. Components are the universal composition unit.
- **Demo 6 — How the pieces actually plug in.** Library vs framework (a library is something you call; a framework is something that calls you). These libraries own one column — rendering — and leave routing, build, state, styling, data fetching to you. That flexibility is the win and the cost.
- **Demo 6.5 — What's an SPA, why.** One HTML shell + a JS router (`pushState`). Fast after first load, painful before it — empty for crawlers, blank on slow phones.
- **Demo 6.6 — Intro to Next.js.** The framework option for React: file-based routing, free bundler, free dev server, free SSR, `<Link>` for SPA-feel nav without the SPA tax. One realisation of a class (Nuxt around Vue, SvelteKit around Svelte, SolidStart around Solid).
- **Demo 6.7 — What a bundler actually does.** Open the hood on the bundler Next handed you. Walks your `import` graph, compiles JSX, drops unused code (tree shaking), splits per route, ships the handful of files the browser actually needs. Same engine in Vite, webpack, Turbopack.
- **Demo 7 — SSG, SSR, CSR in their habitats.** `/menu` is SSG because menus don't change per visitor. `/feed` is SSR because personalised feeds depend on who's asking. `/cart` is CSR because carts are private and interactive. Three answers to "where does the HTML come from?", each chosen by what the page is.
- **Demo 8 — Server vs client components.** `/detail` is a server-rendered menu (zero JS) wrapped around two small client islands — a search input and per-item Add buttons. `'use client'` is a boundary; push it down to the leaves. Hydration is what wakes the page up after the HTML paints.
- **Demo 9 — Core Web Vitals.** LCP, INP, CLS — the three numbers Google ranks on. Measure your homework before you submit it.
- **Demo 10 — Frontend security.** `innerHTML` lets attackers inject script tags into your page. CORS stops one origin reading another. Both are bedrock.
- **Wrap — Swiggy DevTools audit.** Point DevTools at swiggy.com. Code-split chunks, lazy images, the production waterfall. Everything you learned today, visible in one real site.
