# "Your browser is holding your data"

Every site you use is quietly stashing things on your machine. Your Swiggy dark-mode preference, your half-finished checkout, the cookie that proves you're logged in — they all live in different drawers inside your browser, and each drawer has very different rules about who can see it and how long it sticks around.

## Setup

Open **DevTools → Application**. Three panels are about to do all the talking: **Cookies**, **Local Storage**, **Session Storage**.

1. Click *inside* the iframe so DevTools targets it, not this page.
2. Open **Local Storage** and **Session Storage** in the Application sidebar. Both should be empty until you touch the demo.
3. Optional, for the cookies story: open any site you're logged into in another tab (`youtube.com`, `github.com`) and look at its **Cookies** panel. Every value there is being attached to every request that site makes.

**Or run it locally:**

```bash
cd day_3/demo_2_5
uvicorn server:app --host 127.0.0.1 --port 8000 --reload
```

Then open `http://localhost:8000/`.

## Content

### Three drawers, three lifetimes

<p class="beat__lede">Same browser, three completely different contracts. The choice between them is the whole game.</p>

- **Cookies** — small (~4KB), and the browser automatically sends them to the server on every request to that domain.
- **localStorage** — bigger (~5–10MB), shared across tabs, survives browser restarts. Never sent to the server.
- **sessionStorage** — bigger (~5MB), scoped to one tab, dies when that tab closes. Never sent to the server.

<figure class="beat__visual">
<div class="storage-drawers">
  <div class="storage-drawer">
    <div class="storage-drawer__name">Cookies</div>
    <div class="storage-drawer__cap">~4 KB · per domain</div>
    <div class="storage-drawer__example">session=abc123<br/>lang=en-IN</div>
    <div class="storage-drawer__life">Expires when told to (or you clear them)</div>
    <div class="storage-drawer__wire storage-drawer__wire--out">→ sent on every request</div>
  </div>
  <div class="storage-drawer">
    <div class="storage-drawer__name">localStorage</div>
    <div class="storage-drawer__cap">~5–10 MB · per origin</div>
    <div class="storage-drawer__example">swiggy:theme = "dark"</div>
    <div class="storage-drawer__life">Forever — survives reload, new tab, restart</div>
    <div class="storage-drawer__wire storage-drawer__wire--stay">⏺ stays in the browser</div>
  </div>
  <div class="storage-drawer">
    <div class="storage-drawer__name">sessionStorage</div>
    <div class="storage-drawer__cap">~5 MB · per tab</div>
    <div class="storage-drawer__example">swiggy:checkoutStep = 2</div>
    <div class="storage-drawer__life">Dies when the tab closes</div>
    <div class="storage-drawer__wire storage-drawer__wire--stay">⏺ stays in the browser</div>
  </div>
</div>
</figure>

<p class="try-live"><strong>↻ Try it live:</strong> flip the dark-mode toggle, then click <strong>Next →</strong> a couple of times. Reload the iframe — both values survive. Now open the demo in a new tab: dark mode is still on (localStorage is shared), but the checkout step is back to 1 (sessionStorage is per-tab).</p>

### Only cookies travel

<p class="beat__lede">You never wrote code to send your login cookie. The browser did it for you — and it does it on every single request. localStorage and sessionStorage are the opposite: JavaScript-only, never on the wire.</p>

- When the browser asks `swiggy.com` for *anything* — a page, an image, an API call — it automatically tacks every cookie for that domain onto the request headers. That's how the server knows it's still you across requests. HTTP itself is stateless; cookies are the workaround.
- The ~4 KB cap matters because you pay it on every request. A bloated cookie taxes every page load and every API call.
- The server has no API to read your `localStorage`. Auth tokens in localStorage are still readable by any script on the page, and the server can't see them anyway — they'd have to be attached manually to each `fetch()`.

```http
GET /restaurants HTTP/1.1
Host: swiggy.com
Cookie: session=abc123; lang=en-IN     ← browser added this automatically
```

### Everything is per-origin

<p class="beat__lede">An origin is <code>scheme://host:port</code>. Every drawer is keyed by it.</p>

- `https://swiggy.com` cannot read `https://zomato.com`'s storage. Different host → different drawer.
- `http://swiggy.com` cannot read `https://swiggy.com`'s storage. Different scheme → different drawer.
- `swiggy.com:3000` cannot read `swiggy.com:8000`'s storage. Different port → different drawer.

This is the **same-origin policy** — the foundation of web security. Without it, any tab could read any other site's session. We come back to it in **Demo 10**.

### Pick the right drawer

<p class="beat__lede">The cheat sheet — match the data to the contract.</p>

- **Auth tokens** → cookie (ideally `HttpOnly; Secure; SameSite=Lax`). The server needs it on every request, and `HttpOnly` keeps JavaScript from stealing it.
- **UI preferences** (dark mode, language, "don't show this banner again") → localStorage. Persistent, cheap, only the browser cares.
- **In-flight wizard state** (multi-step checkout, unsaved draft) → sessionStorage. Survives refresh, doesn't leak to other tabs.
- **A 2 MB JSON blob you found yourself stuffing into a cookie** → stop. You wanted localStorage.

### There are more drawers

<p class="beat__lede">Three is the headline. The real list is longer.</p>

- **IndexedDB** — a real database in the browser. Async API, structured data, ~hundreds of MB. What you use when you need offline-capable apps or to cache large query results.
- **Cache API** — what service workers use to store full HTTP responses for offline.
- **OPFS** (Origin Private File System) — actual files on disk, scoped to the origin. New, increasingly used by things like SQLite-in-the-browser.

The cookie / localStorage / sessionStorage trio is the entry point, not the whole story.

### What else the browser gives you

<p class="beat__lede">localStorage is one of about a dozen things the browser hands you for free. Before you reach for a library, check whether the platform already does it. It usually does.</p>

The short list you'll meet in the homework or in your first job:

- **fetch** — the modern way to make HTTP requests. `fetch('/api/restaurants').then(r => r.json())`. Reach for it any time you need to talk to a backend.
- **navigator.geolocation** — how Swiggy knows your location the moment you open the app. The browser asks the user for permission and hands the page their coordinates.
- **IntersectionObserver** — tells you when an element scrolls into the viewport. This is how a restaurant list lazy-loads images: don't download the picture until the card is about to be on screen.
- **WebSocket** — a two-way pipe that stays open. Live order tracking, support chat, stock tickers — anything the server needs to push to the client the moment it happens, no refresh required.
- **Notifications** — the "Your order is on the way" banner that pops even when the tab isn't focused. One API call.
- **Service Worker** — a script that sits between your app and the network, caches everything, and serves the cached app when the user goes through a tunnel. This is what makes "offline mode" possible.
- **Web Worker** — moves heavy computation (sorting 10,000 restaurants, parsing a giant CSV) off the main thread so the UI stays responsive instead of freezing. **Demo 2.75** is about *why* this matters.
- **Canvas / WebGL** — a pixel drawing surface. The delivery map, charts, dataviz, games.
- **History API** — change the URL without reloading the page. The thing that powers single-page apps; **Demo 6.5** and **Demo 8.5** are about this.

You don't need to learn all of these today. Bookmark this list and reach for it when you have a feature to build.

### Anyone can edit any drawer

<p class="beat__lede">You can change every value in DevTools right now. So can your users.</p>

- Open Application → Local Storage and double-click any row. Set `swiggy:theme = "light"`. Reload. The page believed you.
- Storage is **never** a source of truth for anything that matters. It's a hint.
- The server must re-check anything sensitive — permissions, prices, ownership. Treat browser storage like form input from a stranger.

## Takeaways

- **Three drawers, three lifetimes.** Cookies until they expire; localStorage forever; sessionStorage until the tab closes.
- **Only cookies travel.** localStorage and sessionStorage never touch the network unless your code explicitly puts them on it.
- **Auth → cookie, UI prefs → localStorage, in-flight state → sessionStorage.** Match the data to the contract.
- **Per-origin is the law.** Different scheme/host/port = different drawer. This is what stops every site from reading every other site.
- **Storage is editable.** Trust nothing from the browser side without server re-validation.
