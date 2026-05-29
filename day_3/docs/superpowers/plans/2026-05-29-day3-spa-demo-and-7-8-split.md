# Day 3 — SPA demo + 7/8/8.5 split — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Insert a new Demo 6.5 ("what is an SPA?") between Demo 6 and the rendering-strategies block, and split the bundled `demo_7_8_nextjs` site entry into three pedagogical sections (Demo 7, Demo 8, Demo 8.5), each anchored on its own compare-and-contrast — without changing the Vercel deployment topology of the Next.js app.

**Architecture:** Demo 6.5 is a new standalone vanilla-JS demo following the existing static-files-served-from-`public/live-demos/` pattern (cf. Demos 1, 3, 5). The 7/8/8.5 split is presentation-only: three new site `Demo` entries point at different routes of the same deployed Next.js app via a new `iframePathSuffix` schema field. The `/hybrid` route gets small inline server/client component badges so Demo 8's compare-and-contrast has a visible artifact.

**Tech Stack:** Vanilla HTML + CSS + JS (Demo 6.5), Next.js App Router + TypeScript + Tailwind (the existing Next.js app, untouched except for the badge change), Node script for content copy (`copy-content.mjs`).

**Spec:** `day_3/docs/superpowers/specs/2026-05-29-day3-spa-demo-and-7-8-split-design.md`

**Note on testing:** Day 3 demos have no automated test suite. Each task ends with a manual verification step ("run dev, open this URL, observe X"). Phases are sequential and each phase is independently verifiable before the next begins.

---

## File map

### New files

| Path | Responsibility |
|---|---|
| `day_3/demo_6_5/index-mpa.html` | MPA home — three restaurant cards, each link is a real `<a href>` |
| `day_3/demo_6_5/restaurant-mpa.html` | MPA detail page (one fixed restaurant) |
| `day_3/demo_6_5/cart-mpa.html` | MPA cart page (one fixed mock cart) |
| `day_3/demo_6_5/index-spa.html` | SPA shell — `<main id="app">` + script tag |
| `day_3/demo_6_5/app.js` | SPA router — click interceptor, `pushState`, view swap, `popstate` |
| `day_3/demo_6_5/style.css` | Shared styles for both MPA pages and the SPA |
| `day_3/demo_6_5/README.md` | Runbook + script (becomes `site/content/day_3/demo_6_5.md`) |
| `day_3/demo_7_8_nextjs/demo_7.md` | Compare-and-contrast for SSG vs SSR vs CSR (becomes `site/content/day_3/demo_7.md`) |
| `day_3/demo_7_8_nextjs/demo_8.md` | Compare-and-contrast for server/client components + hydration (becomes `site/content/day_3/demo_8.md`) |
| `day_3/demo_7_8_nextjs/demo_8_5.md` | Compare-and-contrast for client-side routing (becomes `site/content/day_3/demo_8_5.md`) |

### Modified files

| Path | What changes |
|---|---|
| `site/lib/curriculum.ts` | Add `iframePathSuffix?: string` to `Demo` type; add `demo_6_5` entry; replace `demo_7_8_nextjs` entry with `demo_7`, `demo_8`, `demo_8_5`; update `day3Parts` |
| `site/app/days/3/demos/[slug]/page.tsx` | Extend `resolveIframeUrl` to compose env var + `iframePathSuffix`; resolve `iframeEntries` paths to absolute URLs for `nextjs-separate` demos |
| `site/components/PipFrame.tsx` | Accept an optional `entries` prop that overrides `item.iframeEntries` (so `page.tsx` can pass resolved-URL entries) |
| `site/scripts/copy-content.mjs` | Generalize `markdownDemos` from `[id]` to `[{src, dest}]`; remove `demo_7_8_nextjs`, add four new entries; add `demo_6_5` to `staticDemos` |
| `day_3/demo_7_8_nextjs/app/hybrid/page.tsx` and child components | Add small inline badges marking server vs client components |
| `day_3/README.md` | Add Demo 6.5 bullet to Part 3; split Parts 4–5 into three parts with three bullets |

---

## Phase 1 — Demo 6.5 (new standalone SPA demo)

Goal: a working `/days/3/demos/demo_6_5` route on the site, with the MPA/SPA tab picker, the compare-and-contrast content, and the live iframe.

### Task 1.1: Create the MPA source files

**Files:**
- Create: `day_3/demo_6_5/index-mpa.html`
- Create: `day_3/demo_6_5/restaurant-mpa.html`
- Create: `day_3/demo_6_5/cart-mpa.html`
- Create: `day_3/demo_6_5/style.css`

- [ ] **Step 1: Write `day_3/demo_6_5/style.css`**

```css
/* Shared by both the MPA pages and the SPA. Kept intentionally tiny —
   this demo is about navigation patterns, not visual design. */

* { box-sizing: border-box; }

body {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  margin: 0;
  padding: 0;
  background: #f5f5f5;
  color: #1c1c1c;
}

header.bar {
  background: #fc8019;
  color: #fff;
  padding: 12px 20px;
  display: flex;
  align-items: center;
  gap: 16px;
}

header.bar h1 {
  font-size: 18px;
  margin: 0;
  font-weight: 700;
}

nav.bar {
  margin-left: auto;
  display: flex;
  gap: 16px;
}

nav.bar a {
  color: #fff;
  text-decoration: none;
  font-size: 14px;
  font-weight: 600;
}

nav.bar a:hover { text-decoration: underline; }

main {
  max-width: 720px;
  margin: 0 auto;
  padding: 24px 20px;
}

h2 { margin-top: 0; }

ul.restaurants {
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  gap: 12px;
}

ul.restaurants a {
  display: block;
  background: #fff;
  border-radius: 8px;
  padding: 16px;
  text-decoration: none;
  color: inherit;
  border: 1px solid #e5e5e5;
}

ul.restaurants a:hover { border-color: #fc8019; }

.r-name { font-weight: 600; font-size: 16px; }
.r-meta { color: #666; font-size: 13px; margin-top: 4px; }

.url-pill {
  display: inline-block;
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
  font-size: 12px;
  background: #1c1c1c;
  color: #7cffb8;
  padding: 4px 10px;
  border-radius: 4px;
  margin-top: 4px;
}

.detail {
  background: #fff;
  border-radius: 8px;
  padding: 20px;
  border: 1px solid #e5e5e5;
}

.detail h2 { margin-bottom: 8px; }
.detail p { color: #555; }

.cart-item {
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  border-bottom: 1px solid #eee;
}
.cart-total { font-weight: 600; padding-top: 12px; }
```

- [ ] **Step 2: Write `day_3/demo_6_5/index-mpa.html`**

```html
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Swiggy — Home (MPA)</title>
  <link rel="stylesheet" href="style.css" />
</head>
<body>
  <header class="bar">
    <h1>Swiggy (MPA)</h1>
    <nav class="bar">
      <a href="index-mpa.html">Home</a>
      <a href="cart-mpa.html">Cart</a>
    </nav>
  </header>
  <main>
    <h2>Restaurants near you</h2>
    <p>Every click below is a real <code>&lt;a href&gt;</code> — the browser does a full page load.
    Watch the Network tab.</p>
    <ul class="restaurants">
      <li><a href="restaurant-mpa.html">
        <div class="r-name">Meghana Foods</div>
        <div class="r-meta">★ 4.3 · Biryani, Andhra · 40 mins</div>
      </a></li>
      <li><a href="restaurant-mpa.html">
        <div class="r-name">Truffles</div>
        <div class="r-meta">★ 4.5 · American · 30 mins</div>
      </a></li>
      <li><a href="restaurant-mpa.html">
        <div class="r-name">Burma Burma</div>
        <div class="r-meta">★ 4.6 · Burmese · 45 mins</div>
      </a></li>
    </ul>
  </main>
</body>
</html>
```

- [ ] **Step 3: Write `day_3/demo_6_5/restaurant-mpa.html`**

```html
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Meghana Foods — Swiggy (MPA)</title>
  <link rel="stylesheet" href="style.css" />
</head>
<body>
  <header class="bar">
    <h1>Swiggy (MPA)</h1>
    <nav class="bar">
      <a href="index-mpa.html">Home</a>
      <a href="cart-mpa.html">Cart</a>
    </nav>
  </header>
  <main>
    <div class="detail">
      <h2>Meghana Foods</h2>
      <p>★ 4.3 · Biryani, Andhra · 40 mins · ₹500 for two</p>
      <p>Famous for Andhra-style biryani. Don't skip the boneless chicken biryani.</p>
    </div>
    <p style="margin-top:16px;color:#666;font-size:13px;">
      You navigated here via a full page load. View Source → this whole page came from the server.
    </p>
  </main>
</body>
</html>
```

- [ ] **Step 4: Write `day_3/demo_6_5/cart-mpa.html`**

```html
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Cart — Swiggy (MPA)</title>
  <link rel="stylesheet" href="style.css" />
</head>
<body>
  <header class="bar">
    <h1>Swiggy (MPA)</h1>
    <nav class="bar">
      <a href="index-mpa.html">Home</a>
      <a href="cart-mpa.html">Cart</a>
    </nav>
  </header>
  <main>
    <div class="detail">
      <h2>Your cart</h2>
      <div class="cart-item"><span>Chicken biryani × 1</span><span>₹350</span></div>
      <div class="cart-item"><span>Mirchi salan × 1</span><span>₹80</span></div>
      <div class="cart-item cart-total"><span>Total</span><span>₹430</span></div>
    </div>
  </main>
</body>
</html>
```

- [ ] **Step 5: Manually verify the MPA**

```bash
cd day_3/demo_6_5
python3 -m http.server 8765
```

Open `http://localhost:8765/index-mpa.html`. Click a restaurant card — page fully reloads (white flash; URL bar in the browser changes to `restaurant-mpa.html`). Click Home / Cart in the header — each click is a real navigation. Open DevTools → Network: every click adds a new HTML request. Stop the server when done (`Ctrl+C`).

- [ ] **Step 6: Commit**

```bash
git add day_3/demo_6_5/index-mpa.html day_3/demo_6_5/restaurant-mpa.html day_3/demo_6_5/cart-mpa.html day_3/demo_6_5/style.css
git commit -m "demo_6_5: MPA source — three static HTML pages, real navigation"
```

---

### Task 1.2: Create the SPA source files

**Files:**
- Create: `day_3/demo_6_5/index-spa.html`
- Create: `day_3/demo_6_5/app.js`

- [ ] **Step 1: Write `day_3/demo_6_5/index-spa.html`**

The SPA's HTML shell is intentionally tiny — there's a header, a `<main id="app">` placeholder, a visible "Current URL" pill so students can see `pushState` updating the URL even when the iframe address bar is hidden, and a script tag. View Source on this file shows almost no content — the SPA paints it all client-side.

```html
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Swiggy — SPA</title>
  <link rel="stylesheet" href="style.css" />
</head>
<body>
  <header class="bar">
    <h1>Swiggy (SPA)</h1>
    <nav class="bar">
      <a href="?view=home" data-link>Home</a>
      <a href="?view=cart" data-link>Cart</a>
    </nav>
  </header>
  <main>
    <p style="margin:0 0 8px 0;font-size:12px;color:#666;">Current URL (watch this update as you click):</p>
    <span id="url-pill" class="url-pill">?view=home</span>
    <div id="app" style="margin-top:16px;"></div>
  </main>
  <script src="app.js"></script>
</body>
</html>
```

- [ ] **Step 2: Write `day_3/demo_6_5/app.js`**

The SPA router has four responsibilities: render a view based on the current `?view=` query, intercept clicks on `<a data-link>` to call `history.pushState`, handle the back/forward button via `popstate`, and update the visible URL pill. ~90 lines total, all of it the History API mechanics.

```javascript
// Tiny SPA router — vanilla JS, no framework.
// Demonstrates: pushState, popstate, click interception, view swap.
// Routing is via ?view=home|restaurant|cart so the static server still serves
// index-spa.html on a refresh.

const VIEWS = {
  home: () => `
    <h2>Restaurants near you</h2>
    <p>Every click below is intercepted by JavaScript. The URL changes, but no new HTML is fetched.</p>
    <ul class="restaurants">
      <li><a href="?view=restaurant" data-link>
        <div class="r-name">Meghana Foods</div>
        <div class="r-meta">★ 4.3 · Biryani, Andhra · 40 mins</div>
      </a></li>
      <li><a href="?view=restaurant" data-link>
        <div class="r-name">Truffles</div>
        <div class="r-meta">★ 4.5 · American · 30 mins</div>
      </a></li>
      <li><a href="?view=restaurant" data-link>
        <div class="r-name">Burma Burma</div>
        <div class="r-meta">★ 4.6 · Burmese · 45 mins</div>
      </a></li>
    </ul>`,
  restaurant: () => `
    <div class="detail">
      <h2>Meghana Foods</h2>
      <p>★ 4.3 · Biryani, Andhra · 40 mins · ₹500 for two</p>
      <p>Famous for Andhra-style biryani. Don't skip the boneless chicken biryani.</p>
    </div>
    <p style="margin-top:16px;color:#666;font-size:13px;">
      Network tab: silent. We swapped innerHTML.
    </p>`,
  cart: () => `
    <div class="detail">
      <h2>Your cart</h2>
      <div class="cart-item"><span>Chicken biryani × 1</span><span>₹350</span></div>
      <div class="cart-item"><span>Mirchi salan × 1</span><span>₹80</span></div>
      <div class="cart-item cart-total"><span>Total</span><span>₹430</span></div>
    </div>`,
};

function currentView() {
  const params = new URLSearchParams(window.location.search);
  const v = params.get("view") || "home";
  return v in VIEWS ? v : "home";
}

function render() {
  const view = currentView();
  document.getElementById("app").innerHTML = VIEWS[view]();
  document.getElementById("url-pill").textContent =
    window.location.search || "?view=home";
}

// Intercept clicks on any <a data-link>. Let the browser handle modified clicks
// (cmd/ctrl/shift/middle/right), external links, downloads, etc. — standard
// pattern, worth a sentence on the demo page.
document.addEventListener("click", (e) => {
  const a = e.target.closest("a[data-link]");
  if (!a) return;
  if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
  if (e.button !== 0) return;
  e.preventDefault();
  const href = a.getAttribute("href");
  if (href === window.location.search) return; // already there
  window.history.pushState({}, "", href);
  render();
});

// Back/forward.
window.addEventListener("popstate", render);

// First paint.
render();
```

- [ ] **Step 3: Manually verify the SPA**

```bash
cd day_3/demo_6_5
python3 -m http.server 8765
```

Open `http://localhost:8765/index-spa.html`. Click a restaurant — the URL pill updates to `?view=restaurant`, the browser address bar changes to `index-spa.html?view=restaurant`, no page flash, DevTools Network is silent. Click Home, then Cart. Hit browser Back — view goes back, URL goes back. Open DevTools → View Source: only the shell, no restaurant content. Refresh on `?view=cart` — still shows the cart (because the SPA reads the URL on first paint). Stop the server.

- [ ] **Step 4: Commit**

```bash
git add day_3/demo_6_5/index-spa.html day_3/demo_6_5/app.js
git commit -m "demo_6_5: SPA source — one shell, JS router via pushState"
```

---

### Task 1.3: Write the demo's README (which becomes the demo page content)

**Files:**
- Create: `day_3/demo_6_5/README.md`

The README follows the structure of existing demo READMEs (cf. `day_3/demo_3/README.md`): H1 hook paragraph, then `## Setup`, `## Concepts`, `## Compare and contrast`, `## Takeaways`. The site renderer drops the leading hook paragraph (it shows the H1 + breadcrumb on its own) and paginates the H2 sections.

- [ ] **Step 1: Write `day_3/demo_6_5/README.md`**

```markdown
# "The page that never reloads"

You can build something that looks and feels like a multi-page app without ever leaving the page. The browser's History API plus a `<main>` swap is all you need. That's an SPA — and once you've seen one, every "rendering strategy" we look at next is an answer to a problem the SPA created.

## Setup

Use the tab picker above the iframe to switch between **MPA (full reload)** and **SPA (no reload)**.

1. Open DevTools → **Network** tab.
2. Start on **MPA**. Click a restaurant card, then Home, then Cart. Every click adds a new HTML request to the waterfall. Watch the page flash white between navs.
3. Switch to **SPA**. Click around. After the first load, the Network tab is silent — every "page" is the same `index-spa.html` with new content swapped in.
4. View Source on the SPA tab. Almost empty. The content lives only in the live DOM.

## What an SPA actually is

<p class="beat__lede">A single HTML document, plus JavaScript that swaps the page's contents when you "navigate."</p>

- The server only ships **one** HTML file. No matter what URL you visit, you get the same shell.
- JavaScript reads the URL, decides what to show, and writes it into the DOM.
- When you click a link, the script intercepts the click, updates the URL with `history.pushState` (no reload), and writes new content.
- Back / forward work because the browser fires `popstate` events that the script listens for.
- Refresh works because the script reads the URL on first paint, every time.

That's the entire mechanism. Three browser APIs — `addEventListener('click')`, `history.pushState`, `window.addEventListener('popstate')` — and a function that maps a URL to a chunk of HTML.

## Compare and contrast

<p class="beat__lede">Same app, two patterns. Watch DevTools while you click — the differences are not subtle.</p>

| | MPA (full reload) | SPA (no reload) |
|---|---|---|
| **View Source on any page** | Full HTML for that page | Empty shell, same on every URL |
| **Network tab after first load** | New HTML request per click | Silent — no requests |
| **Page flash between navs** | Yes | No |
| **Scroll position** | Resets to top | Preserved |
| **What if JavaScript fails?** | Still works | Empty page |
| **What can crawlers see?** | Everything | Nothing |
| **Feels fast?** | Slow on bad networks (full re-download) | Instant after first load |
| **Cost of the first load** | Cheap (one small page) | Bigger (ship the whole app) |

## The dead end — and why we're about to revisit it

<p class="beat__lede">An SPA's "first load is empty" problem is real. Google sees nothing. Slow phones see a blank screen while JS boots. Share a link, the preview is empty.</p>

- The fix isn't "stop using SPAs." The fix is **give the server some work back** — render the first paint as real HTML, then let the SPA take over after the page is interactive.
- That's the whole next section: SSG (build the HTML once), SSR (build it per request), CSR (the pure SPA we just saw). Same destination, three different starting points.
- Next.js's `<Link>` (Demo 8.5) gives you SPA-style navigation **after** the first paint, with prerendered pages for the first paint. Best of both worlds.

So Demo 6.5 is the thing the next four demos are answers to.

## Going deeper — why click interception is tricky

<p class="beat__lede">The SPA's click handler can't just call <code>preventDefault</code> on every link. Real users do things you have to let the browser handle.</p>

- **Cmd-click / ctrl-click / middle-click** — opens in a new tab. The script should not call `preventDefault`.
- **Shift-click** — opens in a new window. Same.
- **Right-click → Copy link** — the user expects the real URL.
- **External links** (`<a href="https://...">`) — the script only intercepts same-origin links.
- **Downloads** (`<a download>`) — let the browser handle it.

The standard pattern: only intercept plain left-clicks on links marked `data-link` (or whatever convention you adopt). Everything else falls through. That's what this demo's `app.js` does — see the source.

## Takeaways

- **An SPA is a single HTML shell + JS that swaps content on URL changes.** That's it. No framework required.
- **The mechanism is three browser APIs:** click interception, `history.pushState`, `popstate`.
- **SPAs break SEO and first paint.** Crawlers and slow phones see an empty shell.
- **SPAs feel instant *after* the first load.** That's the whole appeal — and the reason the rendering-strategies demos exist.
- **`pushState` doesn't talk to the server.** You can put any string in the URL. The server has to serve the shell for every route, or refresh will 404.
- **Click interception has to respect modifier keys.** Cmd-click, middle-click, etc. fall through to the browser.
```

- [ ] **Step 2: Commit**

```bash
git add day_3/demo_6_5/README.md
git commit -m "demo_6_5: README — concepts, compare-and-contrast, takeaways"
```

---

### Task 1.4: Wire Demo 6.5 into the site's content pipeline

**Files:**
- Modify: `site/scripts/copy-content.mjs`

The current `markdownDemos = [id, ...]` array implies a single source pattern (`day_3/<id>/README.md` → `site/content/day_3/<id>.md`). We need to generalize it to `[{src, dest}]` so Phase 2 can map three new content files out of `day_3/demo_7_8_nextjs/`. Doing it now (in Phase 1) keeps Phase 2's diff smaller. The `staticDemos` array just needs `demo_6_5` appended.

- [ ] **Step 1: Generalize `markdownDemos` and update entries**

Replace lines 22–34 of `site/scripts/copy-content.mjs`:

```javascript
const markdownDemos = [
  "demo_1",
  "demo_2",
  "demo_2_5",
  "demo_3",
  "demo_4",
  "demo_5",
  "demo_6",
  "demo_7_8_nextjs",
  "demo_9",
  "demo_10",
  "wrap",
];
```

with:

```javascript
// Each entry maps a source markdown file (relative to ../day_3) to its
// destination filename under site/content/day_3/. Most demos use the
// pattern <id>/README.md -> <id>.md; demo_7_8_nextjs is the exception —
// one source directory feeds three site content files (demo_7, 8, 8.5).
const markdownDemos = [
  { src: "demo_1/README.md", dest: "demo_1.md" },
  { src: "demo_2/README.md", dest: "demo_2.md" },
  { src: "demo_2_5/README.md", dest: "demo_2_5.md" },
  { src: "demo_3/README.md", dest: "demo_3.md" },
  { src: "demo_4/README.md", dest: "demo_4.md" },
  { src: "demo_5/README.md", dest: "demo_5.md" },
  { src: "demo_6/README.md", dest: "demo_6.md" },
  { src: "demo_6_5/README.md", dest: "demo_6_5.md" },
  { src: "demo_9/README.md", dest: "demo_9.md" },
  { src: "demo_10/README.md", dest: "demo_10.md" },
  { src: "wrap/README.md", dest: "wrap.md" },
];
```

Note: `demo_7_8_nextjs` is deliberately omitted here — Phase 2 will add `demo_7.md`, `demo_8.md`, `demo_8_5.md` entries pointing at new files in that directory. For now the existing `site/content/day_3/demo_7_8_nextjs.md` stays in place (committed snapshot); nothing references it post-Phase-1 either, so the site still builds.

- [ ] **Step 2: Update the loop that consumes `markdownDemos`**

Replace lines 63–72 of `site/scripts/copy-content.mjs` (the `for (const id of markdownDemos)` loop):

```javascript
  for (const id of markdownDemos) {
    const src = path.join(day3Src, id, "README.md");
    const dest = path.join(contentDir, `${id}.md`);
    try {
      await copyFile(src, dest);
      console.log(`[copy-content] copied ${id}/README.md -> content/day_3/${id}.md`);
    } catch (err) {
      console.warn(`[copy-content] WARN could not copy ${src}: ${err.message}`);
    }
  }
```

with:

```javascript
  for (const { src: srcRel, dest: destName } of markdownDemos) {
    const src = path.join(day3Src, srcRel);
    const dest = path.join(contentDir, destName);
    try {
      await copyFile(src, dest);
      console.log(`[copy-content] copied ${srcRel} -> content/day_3/${destName}`);
    } catch (err) {
      console.warn(`[copy-content] WARN could not copy ${src}: ${err.message}`);
    }
  }
```

- [ ] **Step 3: Add `demo_6_5` to `staticDemos`**

In `site/scripts/copy-content.mjs`, find the `staticDemos` array (around line 134):

```javascript
  const staticDemos = [
    "demo_1",
    "demo_2_5",
    "demo_3",
    "demo_4",
    "demo_5",
    "demo_6",
    "demo_10",
    "wrap",
  ];
```

Add `"demo_6_5"` after `"demo_6"`:

```javascript
  const staticDemos = [
    "demo_1",
    "demo_2_5",
    "demo_3",
    "demo_4",
    "demo_5",
    "demo_6",
    "demo_6_5",
    "demo_10",
    "wrap",
  ];
```

- [ ] **Step 4: Verify the copy script runs cleanly**

```bash
cd site
node scripts/copy-content.mjs
```

Expected output includes:
- `[copy-content] copied demo_6_5/README.md -> content/day_3/demo_6_5.md`
- `[copy-content] copied demo_6_5/ -> public/live-demos/demo_6_5/`
- No warnings about `demo_6_5` (warnings about `demo_7_8_nextjs` being absent are fine — it's no longer in the new list).

```bash
ls site/content/day_3/demo_6_5.md
ls site/public/live-demos/demo_6_5/
```

Both should exist. The `public/live-demos/demo_6_5/` directory should contain the four HTML files, `app.js`, and `style.css`.

- [ ] **Step 5: Commit**

```bash
git add site/scripts/copy-content.mjs
git commit -m "site: generalize copy-content markdownDemos; wire demo_6_5"
```

---

### Task 1.5: Add Demo 6.5 to the curriculum

**Files:**
- Modify: `site/lib/curriculum.ts`

- [ ] **Step 1: Add the `demo_6_5` entry to `day3Demos`**

In `site/lib/curriculum.ts`, find the `demo_6` entry (currently ends around line 169). Insert this new `demo_6_5` entry directly after it, before the existing `demo_7_8_nextjs` entry:

```typescript
  {
    id: "demo_6_5",
    slug: "demo_6_5",
    shortTitle: "Demo 6.5 — What's an SPA?",
    title: 'Demo 6.5 — "The page that never reloads"',
    summary:
      "Same Swiggy app, two patterns. MPA: every click is a full reload. SPA: one HTML shell + a tiny JS router. View Source on the SPA is nearly empty. The thing every rendering strategy in the next section is an answer to.",
    readmeSourcePath: "day_3/demo_6_5/README.md",
    contentFile: "day_3/demo_6_5.md",
    kind: "embedded",
    iframePath: "/live-demos/demo_6_5/index-mpa.html",
    iframeEntries: [
      { label: "MPA (full reload)", path: "/live-demos/demo_6_5/index-mpa.html" },
      { label: "SPA (no reload)", path: "/live-demos/demo_6_5/index-spa.html" },
    ],
    iframeNote:
      "Open DevTools → Network. On MPA every click adds a request; on SPA the tab stays silent after the first load.",
    sourceFiles: [
      { name: "index-spa.html", language: "html" },
      { name: "app.js", language: "javascript" },
      { name: "style.css", language: "css" },
    ],
  },
```

- [ ] **Step 2: Add `demo_6_5` to Part 3 in `day3Parts`**

Find `day3Parts` (around line 229). Update the Part 3 entry:

```typescript
  {
    heading: "Part 3 — React and the modern frontend",
    demoSlugs: ["demo_6", "verbal-segments"],
  },
```

to:

```typescript
  {
    heading: "Part 3 — React and the modern frontend",
    demoSlugs: ["demo_6", "demo_6_5", "verbal-segments"],
  },
```

(Inserting `demo_6_5` before `verbal-segments` puts it in the right position in the prev/next order — verbal-segments comes last in Part 3.)

- [ ] **Step 3: Source-file staging for `demo_6_5`**

In `site/scripts/copy-content.mjs`, find the `demoSourceFiles` object (around line 89):

```javascript
  const demoSourceFiles = {
    demo_1: [
      { name: "index.html", language: "html" },
      { name: "style.css", language: "css" },
      { name: "app.js", language: "javascript" },
      { name: "server.py", language: "python" },
    ],
  };
```

Add `demo_6_5` so the SPA source files surface on the demo page's "Source" section:

```javascript
  const demoSourceFiles = {
    demo_1: [
      { name: "index.html", language: "html" },
      { name: "style.css", language: "css" },
      { name: "app.js", language: "javascript" },
      { name: "server.py", language: "python" },
    ],
    demo_6_5: [
      { name: "index-spa.html", language: "html" },
      { name: "app.js", language: "javascript" },
      { name: "style.css", language: "css" },
    ],
  };
```

- [ ] **Step 4: Re-run copy-content and verify**

```bash
cd site
node scripts/copy-content.mjs
```

Verify `site/content/day_3/demo_6_5/code/` contains `index-spa.html`, `app.js`, `style.css`.

- [ ] **Step 5: Start the dev server and verify the demo page**

```bash
cd site
npm run dev
```

Open `http://localhost:3000/days/3/demos/demo_6_5` in a browser. Verify:

- Breadcrumb reads `Home / Day 3 / Demo 6.5`.
- H1 reads `"The page that never reloads"`.
- The floating PIP iframe shows the MPA home page by default.
- The PIP iframe has two tabs in its address bar: **MPA (full reload)** and **SPA (no reload)**.
- Clicking the SPA tab swaps the iframe; clicking in the SPA updates the in-iframe URL pill without a page flash.
- The demo page section deck paginates: Setup, What an SPA actually is, Compare and contrast, The dead end, Going deeper, Takeaways, Source.
- The Source section shows the contents of `index-spa.html`, `app.js`, `style.css` in syntax-highlighted code blocks.
- Prev link goes to `Demo 6 — Virtual DOM & JSX`. Next link goes to `Demos 7 / 8 / 8.5` (still bundled — Phase 2 splits it).

Stop the dev server.

- [ ] **Step 6: Commit**

```bash
git add site/lib/curriculum.ts site/scripts/copy-content.mjs
git commit -m "site: add demo_6_5 to curriculum, day3Parts, source-file staging"
```

---

### Task 1.6: Update the day_3 source-of-truth README for Demo 6.5

**Files:**
- Modify: `day_3/README.md`

- [ ] **Step 1: Add Demo 6.5 bullet to Part 3**

In `day_3/README.md`, find the Part 3 section (around line 37):

```markdown
### Part 3 — React and the modern frontend

- **[Demo 6 — "What React actually does"](demo_6/README.md)** — virtual DOM,
  JSX, reconciliation. JSX → `createElement` → plain objects; the diff makes
  minimal real-DOM updates (shown via React DevTools + paint flashing on Demo
  5's app).
- **[Verbal segments](verbal-segments.md)** — the spoken interludes: the Tooling
  Break (Node / npm / bundling), the Platform Tour (browser APIs), and CSS &
  Styling, plus the homework brief and the 60-second wrap-up recap.
```

Insert a Demo 6.5 bullet between Demo 6 and Verbal segments:

```markdown
### Part 3 — React and the modern frontend

- **[Demo 6 — "What React actually does"](demo_6/README.md)** — virtual DOM,
  JSX, reconciliation. JSX → `createElement` → plain objects; the diff makes
  minimal real-DOM updates (shown via React DevTools + paint flashing on Demo
  5's app).
- **[Demo 6.5 — "The page that never reloads"](demo_6_5/README.md)** — what an
  SPA actually is. One HTML shell + a tiny JS router (`pushState` + click
  interception + `popstate`). Side-by-side: a fake MPA where every click is a
  full reload, vs the SPA where the Network tab goes silent after the first
  load. The dead end that the next four demos are answers to.
- **[Verbal segments](verbal-segments.md)** — the spoken interludes: the Tooling
  Break (Node / npm / bundling), the Platform Tour (browser APIs), and CSS &
  Styling, plus the homework brief and the 60-second wrap-up recap.
```

- [ ] **Step 2: Update the "Running the demos" section**

In the same file, find the bullet list under "Then open `http://localhost:8000/`. Exceptions:" (around line 80). Add a Demo 6.5 bullet — it ships no Python server; students can use `python3 -m http.server` if they want to run locally:

Find:

```markdown
- **Demos 5 & 6** are single HTML files with React vendored locally — just open
  them in the browser (no server).
```

Replace with:

```markdown
- **Demos 5 & 6** are single HTML files with React vendored locally — just open
  them in the browser (no server).
- **Demo 6.5** is two static folders (MPA + SPA). Open the HTML files directly
  with a static server: `python3 -m http.server 8765` in `day_3/demo_6_5/`,
  then visit `http://localhost:8765/index-mpa.html` or `index-spa.html`.
```

- [ ] **Step 3: Verify the markdown renders cleanly**

```bash
grep -n "demo_6_5" day_3/README.md
```

Expected: two matches (the bullet under Part 3, and the running-locally entry).

- [ ] **Step 4: Commit**

```bash
git add day_3/README.md
git commit -m "day_3: add demo_6_5 to Part 3 and running-locally instructions"
```

---

### Phase 1 verification

Before moving on, do one end-to-end check:

```bash
cd site
npm run dev
```

Walk through `Home → Day 3 → Demo 6.5`. Confirm:
- The page loads.
- The PIP iframe shows the MPA by default; clicking the SPA tab switches it.
- Inside the SPA, clicking around updates the URL pill without a page flash.
- The compare-and-contrast table renders correctly.
- Prev/Next navigation: `Demo 6 → Demo 6.5 → Demos 7 / 8 / 8.5` (Phase 2 will rename the last hop).

Stop the dev server. Phase 1 complete.

---

## Phase 2 — Split Demos 7 / 8 / 8.5 into three site entries

Goal: three independent site routes (`demo_7`, `demo_8`, `demo_8_5`) that point at different routes of the same deployed Next.js app via a new `iframePathSuffix` schema field. No changes to the Next.js app itself in this phase (the hybrid badges are Phase 3).

### Task 2.1: Extend the Demo schema with `iframePathSuffix`

**Files:**
- Modify: `site/lib/curriculum.ts`
- Modify: `site/app/days/3/demos/[slug]/page.tsx`
- Modify: `site/components/PipFrame.tsx`

- [ ] **Step 1: Add `iframePathSuffix` to the `Demo` type**

In `site/lib/curriculum.ts`, find the comment block (around lines 19–28) describing the iframe-related fields. Add a new field below `iframeNote?`:

Find:

```typescript
  // For kind === "nextjs-separate": env var that holds the deployed URL.
  iframeUrlEnvVar?: string;
```

Replace with:

```typescript
  // For kind === "nextjs-separate": env var that holds the deployed URL.
  iframeUrlEnvVar?: string;
  // For kind === "nextjs-separate": optional path suffix appended to the env
  // var's URL. Used when multiple site entries deep-link into different routes
  // of the same deployment. If iframeEntries are also provided, each entry's
  // `path` is treated as a suffix the same way.
  iframePathSuffix?: string;
```

- [ ] **Step 2: Update `resolveIframeUrl` to handle the suffix**

In `site/app/days/3/demos/[slug]/page.tsx`, find `resolveIframeUrl` (line 207):

```typescript
function resolveIframeUrl(item: Demo): string | null {
  if (item.kind === "embedded") return item.iframePath ?? null;
  if (item.kind === "nextjs-separate" && item.iframeUrlEnvVar) {
    return process.env[item.iframeUrlEnvVar] ?? null;
  }
  return null;
}
```

Replace with:

```typescript
function resolveIframeUrl(item: Demo): string | null {
  if (item.kind === "embedded") return item.iframePath ?? null;
  if (item.kind === "nextjs-separate" && item.iframeUrlEnvVar) {
    const base = process.env[item.iframeUrlEnvVar];
    if (!base) return null;
    const suffix = item.iframePathSuffix ?? "";
    return joinUrl(base, suffix);
  }
  return null;
}

// Joins a base URL and a path suffix, normalizing the slash boundary so
// "https://foo.com/" + "/ssg" works as well as "https://foo.com" + "ssg".
function joinUrl(base: string, suffix: string): string {
  if (!suffix) return base;
  const baseTrim = base.replace(/\/+$/, "");
  const suffixTrim = suffix.startsWith("/") ? suffix : `/${suffix}`;
  return `${baseTrim}${suffixTrim}`;
}
```

- [ ] **Step 3: Resolve `iframeEntries` for nextjs-separate demos before passing to PipFrame**

In `site/app/days/3/demos/[slug]/page.tsx`, the `iframeUrl` is already computed (line 46). Right after that line, add a derived `resolvedEntries` value that converts entries' relative suffixes into absolute URLs for `nextjs-separate` demos.

Find lines 44–47:

```typescript
  const sourceSection = buildSourceSection(item);
  const sections = sourceSection ? [...parsedSections, sourceSection] : parsedSections;
  const iframeUrl = resolveIframeUrl(item);
  const { prev, next } = neighborSlugs(slug);
```

Replace with:

```typescript
  const sourceSection = buildSourceSection(item);
  const sections = sourceSection ? [...parsedSections, sourceSection] : parsedSections;
  const iframeUrl = resolveIframeUrl(item);
  const resolvedEntries = resolveIframeEntries(item);
  const { prev, next } = neighborSlugs(slug);
```

Then add the new helper function next to `resolveIframeUrl`:

```typescript
function resolveIframeEntries(
  item: Demo,
): { label: string; path: string }[] | null {
  if (!item.iframeEntries?.length) return null;
  if (item.kind === "embedded") return item.iframeEntries;
  if (item.kind === "nextjs-separate" && item.iframeUrlEnvVar) {
    const base = process.env[item.iframeUrlEnvVar];
    if (!base) return null;
    return item.iframeEntries.map((e) => ({
      label: e.label,
      path: joinUrl(base, e.path),
    }));
  }
  return null;
}
```

- [ ] **Step 4: Pass resolved entries to PipFrame**

Find the `<PipFrame ... />` call (line 152):

```typescript
      {iframeUrl && <PipFrame item={item} initialUrl={iframeUrl} />}
```

Replace with:

```typescript
      {iframeUrl && (
        <PipFrame
          item={item}
          initialUrl={iframeUrl}
          entries={resolvedEntries}
        />
      )}
```

- [ ] **Step 5: Accept `entries` prop in PipFrame**

In `site/components/PipFrame.tsx`, find the props (lines 34–40):

```typescript
export function PipFrame({
  item,
  initialUrl,
}: {
  item: Demo;
  initialUrl: string;
}) {
  const entries = item.iframeEntries ?? [{ label: "Live demo", path: initialUrl }];
```

Replace with:

```typescript
export function PipFrame({
  item,
  initialUrl,
  entries: entriesProp,
}: {
  item: Demo;
  initialUrl: string;
  entries?: { label: string; path: string }[] | null;
}) {
  // When the page resolves entries to absolute URLs (e.g. nextjs-separate
  // demos with iframePathSuffix), it passes them via entriesProp. Otherwise
  // fall back to the raw item.iframeEntries (embedded demos with relative
  // paths under /live-demos/).
  const entries =
    entriesProp ?? item.iframeEntries ?? [{ label: "Live demo", path: initialUrl }];
```

- [ ] **Step 6: Verify nothing breaks for existing demos**

```bash
cd site
npm run dev
```

Visit `http://localhost:3000/days/3/demos/demo_3`. The tab picker should still work — A, B, C switch the iframe. Visit `http://localhost:3000/days/3/demos/demo_6_5`. The MPA/SPA tabs should still work. Visit `http://localhost:3000/days/3/demos/demo_7_8_nextjs`. If `NEXT_PUBLIC_DEMO_7_URL` is unset locally, the "Demo not yet deployed" callout still appears (no change in behavior).

Stop the dev server.

- [ ] **Step 7: Commit**

```bash
git add site/lib/curriculum.ts site/app/days/3/demos/[slug]/page.tsx site/components/PipFrame.tsx
git commit -m "site: add iframePathSuffix for nextjs-separate deep links"
```

---

### Task 2.2: Write the three new content files

**Files:**
- Create: `day_3/demo_7_8_nextjs/demo_7.md`
- Create: `day_3/demo_7_8_nextjs/demo_8.md`
- Create: `day_3/demo_7_8_nextjs/demo_8_5.md`

- [ ] **Step 1: Write `day_3/demo_7_8_nextjs/demo_7.md`**

```markdown
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
```

- [ ] **Step 2: Write `day_3/demo_7_8_nextjs/demo_8.md`**

```markdown
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
```

- [ ] **Step 3: Write `day_3/demo_7_8_nextjs/demo_8_5.md`**

```markdown
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
```

- [ ] **Step 4: Commit**

```bash
git add day_3/demo_7_8_nextjs/demo_7.md day_3/demo_7_8_nextjs/demo_8.md day_3/demo_7_8_nextjs/demo_8_5.md
git commit -m "demo_7_8_nextjs: split README content into demo_7/8/8.5 pages"
```

---

### Task 2.3: Replace the `demo_7_8_nextjs` curriculum entry with three new entries

**Files:**
- Modify: `site/lib/curriculum.ts`

- [ ] **Step 1: Replace the bundled `Demo` entry**

In `site/lib/curriculum.ts`, find the existing `demo_7_8_nextjs` entry (around lines 170–183):

```typescript
  {
    id: "demo_7_8_nextjs",
    slug: "demo_7_8_nextjs",
    shortTitle: "Demos 7 / 8 / 8.5 — SSG, SSR, CSR + hydration + routing",
    title: "Demos 7 / 8 / 8.5 — Rendering strategies, hydration & routing",
    summary:
      "Same Swiggy page, three rendering strategies (SSG vs SSR vs CSR), plus server-vs-client components and instant client-side routing. One real Next.js app — the homework stack.",
    readmeSourcePath: "day_3/demo_7_8_nextjs/README.md",
    contentFile: "day_3/demo_7_8_nextjs.md",
    kind: "nextjs-separate",
    iframeUrlEnvVar: "NEXT_PUBLIC_DEMO_7_URL",
    iframeNote:
      "Right-click → View Source on each of /ssg, /ssr, /csr to see what the server actually sent. The frozen-SSG reveal needs the production build, not next dev.",
  },
```

Replace with three new entries:

```typescript
  {
    id: "demo_7",
    slug: "demo_7",
    shortTitle: "Demo 7 — SSG, SSR, CSR",
    title: 'Demo 7 — "Same page, three rendering strategies"',
    summary:
      "The same Swiggy grid, served three ways: SSG (built at build time), SSR (built per request), CSR (built in the browser). View Source on each tells the whole story.",
    readmeSourcePath: "day_3/demo_7_8_nextjs/demo_7.md",
    contentFile: "day_3/demo_7.md",
    kind: "nextjs-separate",
    iframeUrlEnvVar: "NEXT_PUBLIC_DEMO_7_URL",
    iframePathSuffix: "/ssg",
    iframeEntries: [
      { label: "SSG", path: "/ssg" },
      { label: "SSR", path: "/ssr" },
      { label: "CSR", path: "/csr" },
    ],
    iframeNote:
      "Right-click → View Source on each route. Iframes hide View Source — click the ↗ button to pop the demo into its own tab first.",
  },
  {
    id: "demo_8",
    slug: "demo_8",
    shortTitle: "Demo 8 — Server vs client components",
    title: 'Demo 8 — "The boundary, not the switch"',
    summary:
      "A server-rendered grid with a client-rendered search box. Badges in the live demo mark which component is which. Slow 3G makes the hydration gap visible.",
    readmeSourcePath: "day_3/demo_7_8_nextjs/demo_8.md",
    contentFile: "day_3/demo_8.md",
    kind: "nextjs-separate",
    iframeUrlEnvVar: "NEXT_PUBLIC_DEMO_7_URL",
    iframePathSuffix: "/hybrid",
    iframeNote:
      "Throttle to Slow 3G, hard-refresh, and try typing into the search box. The hydration gap is the dead window between paint and interactivity.",
  },
  {
    id: "demo_8_5",
    slug: "demo_8_5",
    shortTitle: "Demo 8.5 — Client-side routing",
    title: 'Demo 8.5 — "The URL changes, the page doesn\'t reload"',
    summary:
      "Click a restaurant card — URL updates, no full reload. Copy the URL to a fresh tab — still loads as a real page. Demo 6.5's SPA pattern with the SPA's downsides removed.",
    readmeSourcePath: "day_3/demo_7_8_nextjs/demo_8_5.md",
    contentFile: "day_3/demo_8_5.md",
    kind: "nextjs-separate",
    iframeUrlEnvVar: "NEXT_PUBLIC_DEMO_7_URL",
    iframePathSuffix: "/restaurants",
    iframeNote:
      "Watch the Network tab while you click cards — RSC payloads instead of full HTML documents. Then copy a /restaurants/[id] URL into a fresh tab.",
  },
```

- [ ] **Step 2: Update `day3Parts` to split Parts 4–5 into three**

Find the existing Parts 4–5 entry (around lines 242–245):

```typescript
  {
    heading: "Parts 4–5 — Rendering strategies, hydration, routing",
    demoSlugs: ["demo_7_8_nextjs"],
  },
```

Replace with three new part entries:

```typescript
  {
    heading: "Part 4 — Rendering strategies",
    demoSlugs: ["demo_7"],
  },
  {
    heading: "Part 5 — Hydration & component boundaries",
    demoSlugs: ["demo_8"],
  },
  {
    heading: "Part 5.5 — Client-side routing",
    demoSlugs: ["demo_8_5"],
  },
```

- [ ] **Step 3: Verify the types and shape are still valid**

```bash
cd site
npx tsc --noEmit
```

Expected: no type errors. (If anything fails, the most likely culprit is the new `iframePathSuffix` field; double-check the type extension in Task 2.1 Step 1.)

- [ ] **Step 4: Commit**

```bash
git add site/lib/curriculum.ts
git commit -m "site: split demo_7_8_nextjs into demo_7, demo_8, demo_8_5 entries"
```

---

### Task 2.4: Update `copy-content.mjs` to map the three new content files

**Files:**
- Modify: `site/scripts/copy-content.mjs`

- [ ] **Step 1: Add the three new entries to `markdownDemos`**

In `site/scripts/copy-content.mjs`, find the `markdownDemos` array (from Task 1.4 Step 1):

```javascript
const markdownDemos = [
  { src: "demo_1/README.md", dest: "demo_1.md" },
  { src: "demo_2/README.md", dest: "demo_2.md" },
  { src: "demo_2_5/README.md", dest: "demo_2_5.md" },
  { src: "demo_3/README.md", dest: "demo_3.md" },
  { src: "demo_4/README.md", dest: "demo_4.md" },
  { src: "demo_5/README.md", dest: "demo_5.md" },
  { src: "demo_6/README.md", dest: "demo_6.md" },
  { src: "demo_6_5/README.md", dest: "demo_6_5.md" },
  { src: "demo_9/README.md", dest: "demo_9.md" },
  { src: "demo_10/README.md", dest: "demo_10.md" },
  { src: "wrap/README.md", dest: "wrap.md" },
];
```

Add three entries after `demo_6_5`:

```javascript
const markdownDemos = [
  { src: "demo_1/README.md", dest: "demo_1.md" },
  { src: "demo_2/README.md", dest: "demo_2.md" },
  { src: "demo_2_5/README.md", dest: "demo_2_5.md" },
  { src: "demo_3/README.md", dest: "demo_3.md" },
  { src: "demo_4/README.md", dest: "demo_4.md" },
  { src: "demo_5/README.md", dest: "demo_5.md" },
  { src: "demo_6/README.md", dest: "demo_6.md" },
  { src: "demo_6_5/README.md", dest: "demo_6_5.md" },
  { src: "demo_7_8_nextjs/demo_7.md", dest: "demo_7.md" },
  { src: "demo_7_8_nextjs/demo_8.md", dest: "demo_8.md" },
  { src: "demo_7_8_nextjs/demo_8_5.md", dest: "demo_8_5.md" },
  { src: "demo_9/README.md", dest: "demo_9.md" },
  { src: "demo_10/README.md", dest: "demo_10.md" },
  { src: "wrap/README.md", dest: "wrap.md" },
];
```

- [ ] **Step 2: Delete the obsolete content file**

```bash
rm site/content/day_3/demo_7_8_nextjs.md
```

- [ ] **Step 3: Re-run copy-content and verify**

```bash
cd site
node scripts/copy-content.mjs
```

Expected output includes:
- `[copy-content] copied demo_7_8_nextjs/demo_7.md -> content/day_3/demo_7.md`
- `[copy-content] copied demo_7_8_nextjs/demo_8.md -> content/day_3/demo_8.md`
- `[copy-content] copied demo_7_8_nextjs/demo_8_5.md -> content/day_3/demo_8_5.md`

```bash
ls site/content/day_3/demo_7.md site/content/day_3/demo_8.md site/content/day_3/demo_8_5.md
```

All three should exist.

- [ ] **Step 4: Commit**

```bash
git add site/scripts/copy-content.mjs site/content/day_3/
git commit -m "site: wire demo_7/8/8.5 content files; drop bundled demo_7_8_nextjs.md"
```

---

### Task 2.5: Verify the three new demo pages render

- [ ] **Step 1: Start the dev server**

```bash
cd site
npm run dev
```

- [ ] **Step 2: Visit each new demo page**

In a browser:

- `http://localhost:3000/days/3/demos/demo_7` — should show the new H1, the SSG/SSR/CSR compare-and-contrast table, and the iframe.
- `http://localhost:3000/days/3/demos/demo_8` — should show the server-vs-client table and the iframe.
- `http://localhost:3000/days/3/demos/demo_8_5` — should show the Demo-6.5-vs-`Link` table and the iframe.

If `NEXT_PUBLIC_DEMO_7_URL` is unset locally, the iframe area falls back to the "Demo not yet deployed" callout for each page (this is correct — the deployment is unchanged, only the env var needs to be set on Vercel for the iframes to render).

- [ ] **Step 3: Verify prev/next navigation**

On `/days/3/demos/demo_6_5`, Next should now read `Demo 7 — SSG, SSR, CSR`.
On `/days/3/demos/demo_7`, Prev = `Demo 6.5`, Next = `Demo 8`.
On `/days/3/demos/demo_8`, Prev = `Demo 7`, Next = `Demo 8.5`.
On `/days/3/demos/demo_8_5`, Prev = `Demo 8`, Next = `Demo 9`.
On `/days/3/demos/demo_9`, Prev = `Demo 8.5`.

- [ ] **Step 4: Verify the Day 3 index page**

Visit `http://localhost:3000/days/3`. The parts should now read:
- Part 1 — The browser as a platform
- Part 2 — Why frameworks exist
- Part 3 — React and the modern frontend (now includes Demo 6.5)
- Part 4 — Rendering strategies (Demo 7)
- Part 5 — Hydration & component boundaries (Demo 8)
- Part 5.5 — Client-side routing (Demo 8.5)
- Part 6 — Security, performance, and the platform

Stop the dev server.

- [ ] **Step 5: (No commit — verification only)**

If anything was off, fix inline in the relevant Phase 2 task and re-verify.

---

### Task 2.6: Update `day_3/README.md` for the split

**Files:**
- Modify: `day_3/README.md`

- [ ] **Step 1: Replace the bundled Parts 4–5 section**

In `day_3/README.md`, find the existing Parts 4–5 section (around lines 47–52):

```markdown
### Parts 4–5 — Rendering strategies, hydration, routing

- **[Demos 7, 8 & 8.5 — the Next.js Swiggy app](demo_7_8_nextjs/README.md)** —
  SSG vs SSR vs CSR (View Source is the reveal), server vs client components +
  the hydration gap, and client-side routing (the URL changes with no full
  reload). One real Next.js App Router app, the stack students use for homework.
```

Replace with three section headings, each with its own bullet:

```markdown
### Part 4 — Rendering strategies

- **[Demo 7 — "Same page, three rendering strategies"](demo_7_8_nextjs/demo_7.md)** —
  SSG vs SSR vs CSR. The identical Swiggy grid at `/ssg`, `/ssr`, `/csr`. View
  Source is the reveal — SSG and SSR ship full HTML, CSR ships an empty shell.

### Part 5 — Hydration & component boundaries

- **[Demo 8 — "Server components vs client components"](demo_7_8_nextjs/demo_8.md)** —
  `/hybrid` is a server-rendered grid with a client-rendered search box.
  Server/client badges mark each component. Slow 3G makes the hydration gap
  visible.

### Part 5.5 — Client-side routing

- **[Demo 8.5 — "The URL changes, the page doesn't reload"](demo_7_8_nextjs/demo_8_5.md)** —
  Next.js's `<Link>` gives you SPA navigation feel without the SPA's "URLs only
  work after JS boots" tax. Compare back to Demo 6.5's hand-rolled SPA.
```

- [ ] **Step 2: Update the running-locally Demos 7/8/8.5 bullet**

Find:

```markdown
- **Demos 7/8/8.5** are a Next.js app — `npm install` then `npm run build &&
  npm start` (Demo 7's frozen-SSG reveal needs the production build, not `dev`).
```

This still reads correctly — Demos 7, 8, 8.5 are one Next.js app — leave as is. (The split was about presentation, not deployment.)

- [ ] **Step 3: Verify**

```bash
grep -n "Part 4\|Part 5\|Part 5.5\|Demo 7\|Demo 8" day_3/README.md
```

Spot-check that the new headings and bullets are in the right places.

- [ ] **Step 4: Commit**

```bash
git add day_3/README.md
git commit -m "day_3: split Parts 4–5 into Parts 4, 5, 5.5 with separate bullets"
```

---

### Phase 2 verification

End-to-end smoke test:

```bash
cd site
npm run dev
```

- Day 3 index page shows the new part headings.
- Walk through `Demo 6 → Demo 6.5 → Demo 7 → Demo 8 → Demo 8.5 → Demo 9` via prev/next. Every hop works.
- Each demo page renders its own H1 and content (no leftover bundled headings).
- Iframes either render (if `NEXT_PUBLIC_DEMO_7_URL` is set) or show the "not yet deployed" callout (if not). Either way, no crashes.

Stop the dev server. Phase 2 complete.

---

## Phase 3 — Add server/client component badges to the `/hybrid` route

Goal: visible markers in the `/hybrid` route's UI so Demo 8's compare-and-contrast lands without making students read the source. Server components get a 🟢 badge; the client component gets a 🔵 badge.

### Task 3.1: Inspect the hybrid route's component tree

**Files:**
- Read: `day_3/demo_7_8_nextjs/app/hybrid/page.tsx`
- Read: `day_3/demo_7_8_nextjs/components/RestaurantSearch.tsx` (or wherever the search component lives)

- [ ] **Step 1: Locate the components**

```bash
cd day_3/demo_7_8_nextjs
cat app/hybrid/page.tsx
ls components/
grep -l "use client" components/*.tsx 2>/dev/null
```

Expected: `page.tsx` (server), `components/RestaurantSearch.tsx` (client — it has `'use client'`).

Identify the exact line in `page.tsx` where to put a server-component badge (next to the H1 or in a banner at the top), and the exact line in `RestaurantSearch.tsx` where the client-component badge belongs (next to the search input or above the card grid it renders).

- [ ] **Step 2: (No commit — investigation only)**

---

### Task 3.2: Add the server-component badge to the hybrid page shell

**Files:**
- Modify: `day_3/demo_7_8_nextjs/app/hybrid/page.tsx`

- [ ] **Step 1: Add a small inline Badge component at the top of the file**

In `day_3/demo_7_8_nextjs/app/hybrid/page.tsx`, just after the imports, add a small badge helper. Keep it local to the file — this is a teaching artifact, not a shared component:

```typescript
function ServerBadge({ note }: { note?: string }) {
  return (
    <span
      title={note}
      className="inline-flex items-center gap-1 rounded-md border border-emerald-300 bg-emerald-50 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-emerald-900"
    >
      🟢 Server (0 KB JS)
    </span>
  );
}
```

- [ ] **Step 2: Wrap the H1 with a row that includes the badge**

Find the current `<h1>` line in `app/hybrid/page.tsx`:

```typescript
      <h1 className="text-2xl font-bold">/hybrid — Server grid + client search</h1>
```

Replace with:

```typescript
      <div className="flex flex-wrap items-center gap-2">
        <h1 className="text-2xl font-bold">/hybrid — Server grid + client search</h1>
        <ServerBadge note="This whole page (the shell, the heading, the restaurant cards) is a Server Component. Zero JS ships for it." />
      </div>
```

- [ ] **Step 3: Verify the page renders**

```bash
cd day_3/demo_7_8_nextjs
npm run dev
```

Open `http://localhost:3000/hybrid`. The page should show the H1 with a green "🟢 Server (0 KB JS)" badge next to it. Stop the dev server.

- [ ] **Step 4: Commit**

```bash
git add day_3/demo_7_8_nextjs/app/hybrid/page.tsx
git commit -m "hybrid: server-component badge on the page shell"
```

---

### Task 3.3: Add the client-component badge to the search component

**Files:**
- Modify: `day_3/demo_7_8_nextjs/components/RestaurantSearch.tsx`

- [ ] **Step 1: Add a local `ClientBadge` helper**

In `day_3/demo_7_8_nextjs/components/RestaurantSearch.tsx`, just after the imports (and after the `'use client'` directive, which must stay at the very top), add:

```typescript
function ClientBadge({ note }: { note?: string }) {
  return (
    <span
      title={note}
      className="inline-flex items-center gap-1 rounded-md border border-sky-300 bg-sky-50 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-sky-900"
    >
      🔵 Client (~3 KB)
    </span>
  );
}
```

(The "~3 KB" is a rough approximation, as the spec calls out. We're not wiring real bundle introspection — the teaching point is "non-zero JS ships for this component," and a round number is enough.)

- [ ] **Step 2: Place the badge inside the search component's UI**

In `RestaurantSearch.tsx`, find the `return ( ... )` block:

```typescript
  return (
    <div>
      <input
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search restaurants or cuisines…"
        className="mb-6 w-full max-w-md rounded-lg border border-slate-300 px-4 py-2 outline-none focus:border-orange-400"
      />
      <RestaurantGrid restaurants={filtered} />
    </div>
  );
```

Insert the badge row as the first child of the wrapping `<div>`, immediately before the `<input>`:

```typescript
  return (
    <div>
      <div className="mb-2 flex items-center gap-2">
        <ClientBadge note="This search box is a Client Component — it ships JS to your browser so it can have state (the query) and an event handler (onChange)." />
        <span className="text-xs text-slate-500">
          'use client' — has state + onChange
        </span>
      </div>
      <input
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search restaurants or cuisines…"
        className="mb-6 w-full max-w-md rounded-lg border border-slate-300 px-4 py-2 outline-none focus:border-orange-400"
      />
      <RestaurantGrid restaurants={filtered} />
    </div>
  );
```

- [ ] **Step 3: Verify the badges land visually**

```bash
cd day_3/demo_7_8_nextjs
npm run dev
```

Open `http://localhost:3000/hybrid`. Expected:

- Green "🟢 Server (0 KB JS)" badge next to the page H1.
- Blue "🔵 Client (~3 KB)" badge above the search input, with the `'use client' — has state + onChange` note next to it.
- Typing in the search box still filters the list (functional behavior unchanged).

Stop the dev server.

- [ ] **Step 4: Verify it still builds in production mode**

```bash
cd day_3/demo_7_8_nextjs
npm run build
```

Expected: build succeeds. The hybrid route should still show as `○ Static` or `ƒ Dynamic` (whichever it was before — the badges don't change the rendering strategy).

- [ ] **Step 5: Commit**

```bash
git add day_3/demo_7_8_nextjs/components/RestaurantSearch.tsx
git commit -m "hybrid: client-component badge on RestaurantSearch"
```

---

### Phase 3 verification

- [ ] **Step 1: Visual verification (deployed environment)**

After redeploying the Next.js app (or running it locally with `npm run build && npm start`), the badges should be visible on `/hybrid`. The site's Demo 8 page (`/days/3/demos/demo_8`) iframes this route, so the badges become the compare-and-contrast artifact the spec called for.

If you're testing against the deployed URL via the site's iframe, set `NEXT_PUBLIC_DEMO_7_URL` for the site dev server before starting it.

Phase 3 complete.

---

## Phase 4 — Final README polish

Goal: catch anything in `day_3/README.md` that's still inconsistent with the split — section ordering, cross-references, "Demos 7/8/8.5" phrasing where it should now say "Demos 7, 8, and 8.5" or similar.

### Task 4.1: Audit and finalize `day_3/README.md`

**Files:**
- Modify: `day_3/README.md`

- [ ] **Step 1: Scan for any remaining bundled language**

```bash
grep -n "Demos 7, 8\|Demos 7/8\|demo_7_8_nextjs/README" day_3/README.md
```

Expected matches to review:
- Line ~86 (the running-locally entry): `**Demos 7/8/8.5** are a Next.js app` — keep this; it's about the *deployment*, which is still one app.
- Any other matches: judgement call. If something reads like "go look at the bundled README for these three," reword to point at the appropriate `demo_7.md` / `demo_8.md` / `demo_8_5.md`.

- [ ] **Step 2: Verify the design-docs section still points at the right places**

```bash
grep -n "design-docs\|docs/superpowers" day_3/README.md
```

If the README mentions specific spec paths, no change needed — the new spec lives at the standard location.

- [ ] **Step 3: Read the full file end-to-end**

Open `day_3/README.md` and read it like a new student would. Look for:
- Any "Demos 7/8/8.5" phrasing that should now be three bullets.
- Any mention of the old `demo_7_8_nextjs.md` as a single readme.
- The Part headings should now be: Part 1, Part 2, Part 3, Part 4, Part 5, Part 5.5, Part 6.

Make small edits inline for any rough spots.

- [ ] **Step 4: Commit (only if anything changed)**

```bash
git status day_3/README.md
# If modified:
git add day_3/README.md
git commit -m "day_3: README polish — phrasing pass after the 7/8/8.5 split"
```

---

## Final verification

- [ ] **Step 1: Run the build clean**

```bash
cd site
npm run build
```

Expected: build succeeds. No TypeScript errors. No copy-content warnings (warnings about a Vercel-mode missing snapshot are fine; not relevant here).

- [ ] **Step 2: Walk the whole Day 3 flow**

```bash
cd site
npm start  # serves the production build
```

In a browser:
- Day 3 index — confirm all parts.
- Click into Demo 1, walk forward all the way to Demo 10. Every prev/next hop should work.
- Specifically verify: 6 → 6.5 → 7 → 8 → 8.5 → 9 is smooth.
- Demo 6.5 iframe tab picker works.
- Demo 7 iframe tab picker (SSG/SSR/CSR) works *if* `NEXT_PUBLIC_DEMO_7_URL` is set; otherwise the deploy-callout shows.

- [ ] **Step 3: Confirm with the user**

Hand off the working branch. The Vercel preview deployment will exercise the env-var path (Demo 7's tab picker, Demo 8's hybrid iframe with badges, Demo 8.5's restaurants iframe).
