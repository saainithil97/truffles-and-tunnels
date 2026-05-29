# Day 3 Part 3 — React & Next expansion (Demos 6.2–6.8) — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Insert five new beats into Day 3 Part 3 — two runbook-only verbal pages (Demos 6.2 and 6.8) and three runnable demos (6.3, 6.6, 6.7) — to fill the framing gap between Demo 6's reconciler and Demo 7's rendering strategies. Cover what React is (library), where it runs, why Next exists, what a bundler does, and how Next/React DOM/React layer.

**Architecture:** Demos 6.3 and 6.7 follow the existing static-files-under-`public/live-demos/` pattern (cf. Demos 1, 3, 5, 6.5). Demo 6.6 iframes `/` of the existing Swiggy Next.js deployment via the `iframePathSuffix` schema added in the prior spec. Demos 6.2 and 6.8 use the existing `kind: "runbook-only"` pattern (cf. Demos 2 and 9). No new infrastructure.

**Tech Stack:** Vanilla HTML + CSS (Demos 6.3, 6.7), React 19.2.4 + ReactDOM 19.2.4 + `@babel/standalone` via unpkg CDN (Demo 6.3), Markdown with embedded HTML for visualizations (all demos), Next.js (existing app for Demo 6.6, untouched).

**Spec:** `day_3/docs/superpowers/specs/2026-05-29-day3-part3-react-and-next-expansion-design.md`

**Note on testing:** Day 3 demos have no automated test suite. Each task ends with a manual verification step. The five phases are sequential and each is independently verifiable.

---

## File map

### New files (under `day_3/`)

| Path | Responsibility |
|---|---|
| `demo_6_2/README.md` | Beat A — verbal content (Why React is a library) |
| `demo_6_3/index.html` | Beat B — script-tag React Swiggy card with Like button |
| `demo_6_3/style.css` | Beat B — Swiggy card styles |
| `demo_6_3/README.md` | Beat B — content (script tags, where React runs, why this proves React is a library) |
| `demo_6_6/README.md` | Beat C — content with annotated file-tree HTML + compare table back to Demo 6.5 |
| `demo_6_7/index.html` | Beat E — static viewer: three-column compare + lodash side-by-side + mocked Next routes table |
| `demo_6_7/style.css` | Beat E — viewer styles |
| `demo_6_7/README.md` | Beat E — content (bundler concept, code splitting, tree shaking, React.lazy, Demo 8 forward-link) |
| `demo_6_8/README.md` | Beat D — verbal content with layered architecture diagram (embedded HTML) |

### Modified files

| Path | What changes |
|---|---|
| `site/lib/curriculum.ts` | Five new `Demo` entries (`demo_6_2`, `demo_6_3`, `demo_6_6`, `demo_6_7`, `demo_6_8`); Part 3 `demoSlugs` expanded |
| `site/scripts/copy-content.mjs` | Five entries in `markdownDemos`; `demo_6_3` and `demo_6_7` added to `staticDemos` and `demoSourceFiles` |
| `day_3/README.md` | Part 3 expands from 3 bullets to 8 (Demo 6, 6.2, 6.3, 6.5, 6.6, 6.7, 6.8, Verbal segments) |
| `day_3/verbal-segments.md` | Strip the "Bundling" subsection from Tooling Break; rename section to "Tooling break — Node and npm"; add forward-ref to Demo 6.7 |

---

## Phase 1 — Demo 6.2 "Why React is a library" (runbook-only)

### Task 1.1: Write the Demo 6.2 README

**Files:**
- Create: `day_3/demo_6_2/README.md`

- [ ] **Step 1: Create the file**

Write `day_3/demo_6_2/README.md` with this exact content:

```markdown
# "Why React is a library"

You just watched React keep the DOM in sync with state (Demo 6). Now let's name what kind of thing you were looking at. React is a *library* — not a framework. That distinction is not pedantic. It's the whole reason Next.js exists, the reason your homework can pick its own router, and the reason you'll see five different state-management options in five different React jobs.

## Setup

There's no iframe here — this is a 5-minute talk between Demo 6 and Demo 6.3. Read it slowly. The framing it gives makes the next four demos click into place.

## Library vs. framework — the inversion-of-control test

<p class="beat__lede">There's a clean one-line test: a library is something you call; a framework is something that calls you.</p>

- **Library:** *your code is in charge*. You call `createRoot(...).render(<App />)` when you decide. React shows up only when invited.
- **Framework:** *the framework is in charge*. Angular instantiates your components on a lifecycle you don't own. Rails runs your controller method when a request comes in. You hand the framework your pieces; it decides when to call them.
- **React** passes the library test. The only React-owned moment is *inside* the render — once you call it, React drives reconciliation. Outside that, your code runs the show: you decide when to mount, what data to fetch, how to route.
- **Next.js** is a framework wrapped around React. Next decides when to call your page components, when to render them on the server, when to hydrate them in the browser. You hand Next your `app/page.tsx`; Next runs it.

The same React, hosted in two different ways. That's the whole game.

## What React deliberately doesn't include

<p class="beat__lede">React is intentionally small. Here's the list of things it doesn't ship — and the per-row "so what do I pick instead" answer.</p>

| Concern | React ships | What you pick |
|---|---|---|
| **Routing** | Nothing | React Router, TanStack Router, Next's file-based router |
| **Build / bundler** | Nothing | Vite (default these days), webpack, Parcel, Turbopack via Next |
| **Dev server with HMR** | Nothing | Vite's dev server, Next's dev server |
| **State management** | `useState` / `useReducer` for one component | Zustand, Redux, Jotai, TanStack Query, or "just `useState` + lift state up" |
| **Styling** | Nothing | CSS Modules, Tailwind, styled-components, emotion, vanilla CSS |
| **Data fetching** | Nothing | `fetch`, axios, TanStack Query, SWR, Apollo |
| **Server rendering host** | `react-dom/server` (the engine) | Next, Remix, Astro, your own Node process |
| **Form handling** | Nothing | React Hook Form, Formik, plain `useState` |
| **Animations** | Nothing | Framer Motion, GSAP, CSS transitions |

React owns one column: rendering. Everything else, you pick.

## Why this matters

<p class="beat__lede">"React is a library" isn't a slogan — it's a design constraint with three consequences you'll feel every day.</p>

- **Composability.** Because React doesn't bring its own everything, you can compose it with whatever stack already exists. A React widget can live inside an old Rails app, a WordPress page, an existing webpack build, an Electron shell.
- **Ecosystem flexibility.** Different teams pick different routers, different state libraries, different data layers, and the React component model still works in all of them. That's why your last React job and your next one will probably look completely different above the component layer.
- **The trade-off.** A framework like Angular makes 80% of the decisions for you, which gets you to "first working app" faster. React's libraries-of-libraries approach forces you to decide more, which gets you customization at the cost of decision fatigue. Next.js is React's "I'll make most of the decisions" mode — and that's the next demo.

## Takeaways

- **A library: you call it. A framework: it calls you.** React passes the library test. Next.js doesn't.
- **React owns rendering. Everything else you pick.** Routing, build, state, styling, data — separate decisions.
- **Composability is the payoff.** React works inside any host that can run JavaScript. That's why "React in a `<script>` tag" (next demo) is a real thing, not a curiosity.
- **The trade-off is real.** More flexibility, more decisions. Next.js exists because for production apps you'd rather take the decisions someone made for you and ship.
- **Every React job you ever take will look different above the component layer.** That's not a bug. It's the design.
```

- [ ] **Step 2: Commit**

```bash
cd /Users/saainithil/Code/teach
git add day_3/demo_6_2/README.md
git commit -m "demo_6_2: README — library vs framework, what React omits, why it matters"
```

---

### Task 1.2: Wire Demo 6.2 into curriculum and content pipeline

**Files:**
- Modify: `site/lib/curriculum.ts`
- Modify: `site/scripts/copy-content.mjs`
- Modify: `day_3/README.md`

- [ ] **Step 1: Add the curriculum entry**

In `site/lib/curriculum.ts`, find the existing `demo_6` entry (it ends with the `iframeNote` field and a closing `},`). Find the next entry, which since the prior spec is `demo_6_5`. Insert this new entry between them:

```typescript
  {
    id: "demo_6_2",
    slug: "demo_6_2",
    shortTitle: "Demo 6.2 — Why React is a library",
    title: 'Demo 6.2 — "Library, not framework"',
    summary:
      "React is a library. It does one thing — keep your DOM in sync with state — and deliberately omits everything else. That design constraint is why Next.js exists, why your homework picks its own router, and why every React job looks different above the component layer.",
    readmeSourcePath: "day_3/demo_6_2/README.md",
    contentFile: "day_3/demo_6_2.md",
    kind: "runbook-only",
    runbookHint:
      "No iframe — this is a 5-minute framing read between Demo 6 and Demo 6.3. The runbook on the right is the reading itself.",
  },
```

- [ ] **Step 2: Update Part 3 in `day3Parts`**

Find the existing Part 3 entry (after the prior spec, its `demoSlugs` array reads `["demo_6", "demo_6_5", "verbal-segments"]`). Replace with:

```typescript
  {
    heading: "Part 3 — React and the modern frontend",
    demoSlugs: ["demo_6", "demo_6_2", "demo_6_5", "verbal-segments"],
  },
```

(We'll add `demo_6_3`, `demo_6_6`, `demo_6_7`, `demo_6_8` in subsequent phases.)

- [ ] **Step 3: Add the `markdownDemos` entry to `copy-content.mjs`**

In `site/scripts/copy-content.mjs`, find the `markdownDemos` array. After the `demo_6_5` entry and before the `demo_7_8_nextjs/demo_7.md` entry, insert:

```javascript
  { src: "demo_6_2/README.md", dest: "demo_6_2.md" },
```

The full array should now have (in order): `demo_1`, `demo_2`, `demo_2_5`, `demo_3`, `demo_4`, `demo_5`, `demo_6`, `demo_6_5`, `demo_6_2`, then the three `demo_7_8_nextjs/demo_*` entries, then `demo_9`, `demo_10`, `wrap`. (Numerical ordering of the array doesn't matter for the copy step; the entry can sit between `demo_6_5` and the `demo_7_*` entries.)

- [ ] **Step 4: Add the bullet to `day_3/README.md`**

In `day_3/README.md`, find the Part 3 section. After the bullet for Demo 6 ("What React actually does") and before the bullet for Demo 6.5 ("The page that never reloads"), insert:

```markdown
- **[Demo 6.2 — "Library, not framework"](demo_6_2/README.md)** — what React
  *is*, not what it does. The inversion-of-control test (a library: you call it;
  a framework: it calls you). The table of everything React deliberately omits
  (routing, build, state, styling, data, server-rendering host) with the "what
  do I pick instead" column. Sets up why Next exists.
```

- [ ] **Step 5: Run copy-content and verify**

```bash
cd /Users/saainithil/Code/teach/site
node scripts/copy-content.mjs
```

Expected output includes:
```
[copy-content] copied demo_6_2/README.md -> content/day_3/demo_6_2.md
```

- [ ] **Step 6: Type-check**

```bash
cd /Users/saainithil/Code/teach/site
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 7: Spot-check the page**

```bash
cd /Users/saainithil/Code/teach/site
npm run dev
```

In a browser, open `http://localhost:3000/days/3/demos/demo_6_2`. Expected:
- Breadcrumb shows `Home / Day 3 / Demo 6.2`.
- H1 reads `"Library, not framework"`.
- A "No iframe for this one" callout shows with the runbook hint.
- The section deck paginates: Setup, Library vs. framework, What React doesn't include, Why this matters, Takeaways.
- Prev link goes to `Demo 6`. Next link goes to `Demo 6.5`.

Stop the dev server.

- [ ] **Step 8: Commit**

```bash
cd /Users/saainithil/Code/teach
git add site/lib/curriculum.ts site/scripts/copy-content.mjs site/content/day_3/demo_6_2.md day_3/README.md
git commit -m "site: wire demo_6_2 into curriculum, Part 3, and copy-content"
```

---

## Phase 2 — Demo 6.3 "How and where React works" (embedded)

### Task 2.1: Create the script-tag React HTML and CSS

**Files:**
- Create: `day_3/demo_6_3/index.html`
- Create: `day_3/demo_6_3/style.css`

- [ ] **Step 1: Write `day_3/demo_6_3/style.css`**

```css
/* Reused from Demo 1's Swiggy card pattern, kept tiny.
   This demo is about React in a script tag, not visual design. */

* { box-sizing: border-box; }

body {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  margin: 0;
  padding: 24px 20px;
  background: #f5f5f5;
  color: #1c1c1c;
}

.lede {
  max-width: 480px;
  margin: 0 auto 16px;
  font-size: 13px;
  color: #555;
  line-height: 1.5;
}

.lede strong {
  color: #1c1c1c;
}

.card {
  max-width: 480px;
  margin: 0 auto;
  background: #fff;
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid #e5e5e5;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
}

.card__img {
  width: 100%;
  height: 240px;
  display: block;
  background: linear-gradient(135deg, #fc8019 0%, #f78b35 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 72px;
}

.card__body {
  padding: 16px 20px 20px;
}

.card__name {
  margin: 0;
  font-size: 20px;
  font-weight: 700;
}

.card__cuisines {
  margin: 4px 0 0;
  color: #666;
  font-size: 14px;
}

.card__meta {
  margin: 8px 0 0;
  color: #555;
  font-size: 13px;
}

.rating {
  color: #2b8a3e;
  font-weight: 600;
}

.like {
  margin-top: 16px;
  background: #fff;
  border: 1px solid #e5e5e5;
  border-radius: 8px;
  padding: 8px 14px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  color: #1c1c1c;
}

.like:hover {
  border-color: #fc8019;
}

.like--liked {
  background: #fff5e6;
  border-color: #fc8019;
  color: #fc8019;
}
```

- [ ] **Step 2: Write `day_3/demo_6_3/index.html`**

```html
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>React in a script tag — Swiggy card</title>
  <link rel="stylesheet" href="style.css" />

  <!-- Script #1: React itself. ~6 KB minified.
       This is the same library that ships in big Next.js apps. -->
  <script
    crossorigin
    src="https://unpkg.com/react@19.2.4/umd/react.production.min.js"
  ></script>

  <!-- Script #2: React DOM. ~140 KB minified.
       The renderer — knows how to put React's virtual DOM into a real
       browser DOM. (There are other renderers: react-dom/server for HTML,
       React Native for native, react-three-fiber for WebGL.) -->
  <script
    crossorigin
    src="https://unpkg.com/react-dom@19.2.4/umd/react-dom.production.min.js"
  ></script>

  <!-- Script #3: Babel standalone. ~3 MB unminified — you would NEVER ship
       this to production. It's here so we can write JSX directly in this
       file instead of writing React.createElement by hand. In a real app
       a bundler compiles JSX at build time and Babel never ships. -->
  <script src="https://unpkg.com/@babel/standalone@7/babel.min.js"></script>
</head>
<body>
  <p class="lede">
    <strong>View Source.</strong> Three script tags. One component. No build, no
    bundler, no framework. This is React.
  </p>

  <div id="root"></div>

  <noscript>This demo needs JavaScript — React is JS, after all.</noscript>

  <!-- Our React app. type="text/babel" tells Babel-standalone to compile
       this block before running it. -->
  <script type="text/babel">
    const { useState } = React;
    const { createRoot } = ReactDOM;

    function RestaurantCard() {
      const [likes, setLikes] = useState(0);
      const liked = likes > 0;
      return (
        <article className="card">
          <div className="card__img" aria-hidden="true">🍛</div>
          <div className="card__body">
            <h1 className="card__name">Meghana Foods</h1>
            <p className="card__cuisines">Biryani, Andhra</p>
            <p className="card__meta">
              <span className="rating">★ 4.3</span> · 40 mins · ₹500 for two
            </p>
            <button
              type="button"
              className={liked ? "like like--liked" : "like"}
              onClick={() => setLikes(likes + 1)}
            >
              {liked ? "❤️ Liked" : "🤍 Like"} {likes}
            </button>
          </div>
        </article>
      );
    }

    const root = createRoot(document.getElementById("root"));
    root.render(<RestaurantCard />);
  </script>
</body>
</html>
```

- [ ] **Step 3: Verify locally**

```bash
cd /Users/saainithil/Code/teach/day_3/demo_6_3
python3 -m http.server 8765
```

Open `http://localhost:8765/index.html`. Expected:
- The Swiggy card renders with the biryani emoji, Meghana Foods header, rating, meta, and a Like button.
- Clicking Like increments the counter and toggles the button styling to "❤️ Liked".
- Open DevTools → Network: you should see three script requests (react, react-dom, babel) from unpkg.com.
- View Source shows the three script tags plus the `<script type="text/babel">` block — the rendered DOM is built entirely by JS.

Stop the server.

- [ ] **Step 4: Commit**

```bash
cd /Users/saainithil/Code/teach
git add day_3/demo_6_3/index.html day_3/demo_6_3/style.css
git commit -m "demo_6_3: script-tag React Swiggy card with useState Like button"
```

---

### Task 2.2: Write the Demo 6.3 README

**Files:**
- Create: `day_3/demo_6_3/README.md`

- [ ] **Step 1: Create the file**

```markdown
# "How and where React works"

In Demo 6.2 we said React is a library, not a framework. Here's the proof. Two `<script>` tags from a CDN, one component, no build step. The same library that ships in big Next.js apps is the library running in this 30-line HTML page.

## Setup

The iframe above is `index.html` — a single static HTML file. Try this:

1. **View Source.** Three script tags + one `<script type="text/babel">` block. That's the entire app.
2. Click **Like**. The counter goes up; the button changes. That's `useState`.
3. Open DevTools → **Network**. Three requests from `unpkg.com` — `react.production.min.js`, `react-dom.production.min.js`, `@babel/standalone`. That's all React is, physically: a JavaScript file the browser downloads.
4. Open DevTools → **Elements**. The `<div id="root">` was empty in View Source; now it has the rendered card. The DOM is what React built; the source is what the server sent.

## The smallest possible React app

<p class="beat__lede">Three pieces. That's the whole architecture.</p>

- **`react`** — the reconciler. Exports `React`, `useState`, `useEffect`, `createElement`, the rest of the API. Knows nothing about the browser; it just produces and diffs a tree of element objects.
- **`react-dom`** — the renderer. Exports `createRoot`, `hydrateRoot`. Takes React's tree of objects and turns them into actual DOM nodes (or updates existing ones).
- **`@babel/standalone`** — *not part of React*. Just here so we can write JSX directly in this file. In a real app, a build step compiles JSX once at build time and Babel never ships. The 3 MB price tag is why.

The component itself is plain JavaScript that returns JSX, which Babel compiles to `React.createElement(...)` calls. `createRoot(element).render(<App />)` is the line that mounts it. That's the whole API surface used in this demo.

## Where else React runs

<p class="beat__lede">The reconciler is host-agnostic. Different renderers, different hosts.</p>

| Host | Renderer | What gets produced |
|---|---|---|
| **Browser, via `<script>` tag** (this demo) | `react-dom/client` | DOM nodes |
| **Browser, via bundler** (Vite, webpack, Turbopack) | `react-dom/client` | DOM nodes — same renderer, just delivered through a bundle |
| **Server** (Node, edge, Bun) | `react-dom/server` | An HTML string the server sends to the browser |
| **Native mobile** | React Native | Native iOS/Android views (no DOM, no browser) |
| **3D/WebGL** | react-three-fiber | THREE.js scene objects |
| **Terminal** | Ink | Text output via ANSI escapes |
| **PDFs, emails, …** | `@react-pdf/renderer`, mjml-react, etc. | Whatever that library knows how to produce |

Same `useState`. Same component model. Same diffing. The renderer is pluggable; that's the design.

## Why this proves React is a library

<p class="beat__lede">A framework owns the host. A library can be dropped into any host. React is the latter.</p>

- This demo has no router, no build, no dev server, no state library, no framework. Just a browser and three script files.
- The "minimum viable React app" is literally an HTML file. You could embed it in WordPress, a Rails view, an old jQuery app, an Electron shell. Same library.
- Demo 6.5's SPA was a 90-line vanilla JS app. You could have written that *in React*, with the same script tags, and gotten the same SPA pattern with `useState` + a tiny router. The router is the missing piece; React is happy to compose with whatever you bring.
- Next.js (Demo 6.6, next) is what happens when you stop bringing the missing pieces yourself and let a framework bring them for you. The React inside Next is the same React in this iframe.

## Going deeper — when would you actually use script-tag React?

<p class="beat__lede">Rarely as the main app. Often as a widget.</p>

- **Embedding a small React widget in a non-React page** — a comments box on a blog, a calculator inside a marketing site, an admin tool inside an old PHP app. Two script tags and you have React, with no build pipeline to set up.
- **Quick prototypes / CodePen / docs samples** — every interactive example in the React docs is essentially this pattern (Babel-standalone + React + ReactDOM).
- **Teaching** (this demo).
- **What you would NOT use it for** — a production app with more than a couple components. You want a bundler so you can `import`, use npm packages, tree-shake, code-split. That's Demo 6.7.

## Takeaways

- **React is JS that the browser downloads.** Two files from unpkg.com is enough.
- **`react` is the reconciler. `react-dom` is the renderer.** They split for a reason — same reconciler, multiple renderers (server, native, 3D, …).
- **JSX needs a compiler.** In this demo, Babel-standalone does it in-browser (slow, fine for a demo). In every real app, your bundler does it at build time.
- **`createRoot(...).render(<App />)` is the React API surface.** Everything else (`useState`, JSX, components) is the language of React inside it.
- **Same library in every host.** Same React powers this 30-line page and the Next.js Swiggy app you're about to dissect.
- **Real apps use a bundler.** Script tags are for widgets and demos. The next two demos show what a real React app's tooling looks like.
```

- [ ] **Step 2: Commit**

```bash
cd /Users/saainithil/Code/teach
git add day_3/demo_6_3/README.md
git commit -m "demo_6_3: README — three pieces, where React runs, why library not framework"
```

---

### Task 2.3: Wire Demo 6.3 into curriculum and content pipeline

**Files:**
- Modify: `site/lib/curriculum.ts`
- Modify: `site/scripts/copy-content.mjs`
- Modify: `day_3/README.md`

- [ ] **Step 1: Add the curriculum entry**

In `site/lib/curriculum.ts`, find the `demo_6_2` entry (just added in Phase 1). Insert this `demo_6_3` entry directly after it:

```typescript
  {
    id: "demo_6_3",
    slug: "demo_6_3",
    shortTitle: "Demo 6.3 — How and where React works",
    title: 'Demo 6.3 — "React in a script tag"',
    summary:
      "Two <script> tags, one component, no build. The same React that ships in big apps, running in a 30-line HTML page. Proves the library framing — and sets up why bundlers and Next exist for everything bigger than this.",
    readmeSourcePath: "day_3/demo_6_3/README.md",
    contentFile: "day_3/demo_6_3.md",
    kind: "embedded",
    iframePath: "/live-demos/demo_6_3/index.html",
    iframeNote:
      "View Source on the iframe to see the three script tags. Open DevTools → Network to watch React load from unpkg.com.",
    sourceFiles: [
      { name: "index.html", language: "html" },
      { name: "style.css", language: "css" },
    ],
  },
```

- [ ] **Step 2: Update Part 3 in `day3Parts`**

Replace the Part 3 entry's `demoSlugs` array to insert `demo_6_3` after `demo_6_2`:

```typescript
  {
    heading: "Part 3 — React and the modern frontend",
    demoSlugs: ["demo_6", "demo_6_2", "demo_6_3", "demo_6_5", "verbal-segments"],
  },
```

- [ ] **Step 3: Update `copy-content.mjs`**

In the `markdownDemos` array, insert this entry after the `demo_6_2` entry:

```javascript
  { src: "demo_6_3/README.md", dest: "demo_6_3.md" },
```

In the `staticDemos` array, insert `"demo_6_3"` after `"demo_6_5"` (or in numerical order — both work; the array order doesn't affect behavior):

```javascript
  const staticDemos = [
    "demo_1",
    "demo_2_5",
    "demo_3",
    "demo_4",
    "demo_5",
    "demo_6",
    "demo_6_3",
    "demo_6_5",
    "demo_10",
    "wrap",
  ];
```

In the `demoSourceFiles` object, add a `demo_6_3` entry:

```javascript
  const demoSourceFiles = {
    demo_1: [
      { name: "index.html", language: "html" },
      { name: "style.css", language: "css" },
      { name: "app.js", language: "javascript" },
      { name: "server.py", language: "python" },
    ],
    demo_6_3: [
      { name: "index.html", language: "html" },
      { name: "style.css", language: "css" },
    ],
    demo_6_5: [
      { name: "index-spa.html", language: "html" },
      { name: "app.js", language: "javascript" },
      { name: "style.css", language: "css" },
    ],
  };
```

(The existing `demo_1` and `demo_6_5` entries from prior work stay; only `demo_6_3` is being added.)

- [ ] **Step 4: Add the bullet to `day_3/README.md`**

In `day_3/README.md`, insert this bullet between the Demo 6.2 bullet and the Demo 6.5 bullet:

```markdown
- **[Demo 6.3 — "React in a script tag"](demo_6_3/README.md)** — proof that
  React is just a library: two `<script>` tags from unpkg.com, one component
  with `useState`, no build, no bundler. The same Swiggy card from Demo 1,
  rendered in React this time. Sets up "where React runs" — browser, server,
  native, anywhere there's a renderer.
```

- [ ] **Step 5: Run copy-content and verify**

```bash
cd /Users/saainithil/Code/teach/site
node scripts/copy-content.mjs
```

Expected output includes:
- `[copy-content] copied demo_6_3/README.md -> content/day_3/demo_6_3.md`
- `[copy-content] copied demo_6_3/ -> public/live-demos/demo_6_3/`
- `[copy-content] copied demo_6_3/index.html -> content/day_3/demo_6_3/code/index.html`
- `[copy-content] copied demo_6_3/style.css -> content/day_3/demo_6_3/code/style.css`

- [ ] **Step 6: Type-check**

```bash
cd /Users/saainithil/Code/teach/site
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 7: Spot-check the page**

```bash
cd /Users/saainithil/Code/teach/site
npm run dev
```

Open `http://localhost:3000/days/3/demos/demo_6_3`. Expected:
- Breadcrumb shows `Home / Day 3 / Demo 6.3`.
- H1 reads `"React in a script tag"`.
- The floating PIP iframe loads the Swiggy card. Clicking Like in the iframe increments the counter.
- Section deck paginates: Setup, The smallest possible React app, Where else React runs, Why this proves React is a library, Going deeper, Takeaways, Source.
- The Source section shows `index.html` and `style.css` with syntax highlighting.
- Prev link goes to `Demo 6.2`. Next link goes to `Demo 6.5`.

Stop the dev server.

- [ ] **Step 8: Commit**

```bash
cd /Users/saainithil/Code/teach
git add site/lib/curriculum.ts site/scripts/copy-content.mjs site/content/day_3/demo_6_3.md site/content/day_3/demo_6_3/ site/public/live-demos/demo_6_3/ day_3/README.md
git commit -m "site: wire demo_6_3 into curriculum, Part 3, copy-content, sourceFiles"
```

---

## Phase 3 — Demo 6.6 "Intro to Next.js" (nextjs-separate)

### Task 3.1: Write the Demo 6.6 README

**Files:**
- Create: `day_3/demo_6_6/README.md`

- [ ] **Step 1: Create the file**

```markdown
# "Intro to Next.js"

You just wrote a 90-line SPA router by hand (Demo 6.5). You just saw React running in a `<script>` tag with no build (Demo 6.3). Now the third option: take React and put it inside a *framework* that brings the build, the router, the dev server, the production server, the deployment, all of it. That's Next.js — and the next four demos all live inside one.

## Setup

The iframe is `/` of the Swiggy Next.js app that powers Demos 7, 8, and 8.5. Same deployment, same code, same Vercel project.

1. Click the four cards in the iframe. Each one is a `<Link>` to a different route. **No page reload.** That's Next's client-side router — what you wrote by hand in Demo 6.5, but free.
2. Pop the iframe out (↗ button). The URL bar updates as you click. Copy any URL into a fresh tab — every one still works. (Try doing *that* with Demo 6.5's SPA — only the shell URL loads from a cold tab.)
3. View Source on `/` from the popped-out tab. Real HTML, the four card links right there. Not the empty shell from Demo 6.5.

## What's in a Next.js project

<p class="beat__lede">Open the folder. Next is convention-over-configuration — what each file/folder is named is what it does.</p>

<figure class="beat__visual">
<pre style="background:#1c1c1c;color:#eee;padding:16px;border-radius:8px;font-size:13px;line-height:1.6;overflow-x:auto;">
day_3/demo_7_8_nextjs/
├── <span style="color:#fc8019">app/</span>                           <span style="color:#888">← every route lives here (App Router convention)</span>
│   ├── <span style="color:#7cffb8">layout.tsx</span>                 <span style="color:#888">← wraps every page (header, footer, fonts, providers)</span>
│   ├── <span style="color:#7cffb8">page.tsx</span>                   <span style="color:#888">← /  — the homepage (this iframe)</span>
│   ├── <span style="color:#7cffb8">globals.css</span>                <span style="color:#888">← global styles, imported once in layout.tsx</span>
│   ├── <span style="color:#7cffb8">ssg/page.tsx</span>               <span style="color:#888">← /ssg  → Demo 7 — static at build time</span>
│   ├── <span style="color:#7cffb8">ssr/page.tsx</span>               <span style="color:#888">← /ssr  → Demo 7 — rendered per request</span>
│   ├── <span style="color:#7cffb8">csr/page.tsx</span>               <span style="color:#888">← /csr  → Demo 7 — empty shell, browser fills in</span>
│   ├── <span style="color:#7cffb8">hybrid/page.tsx</span>            <span style="color:#888">← /hybrid → Demo 8 — server shell + client island</span>
│   ├── <span style="color:#7cffb8">restaurants/[id]/page.tsx</span>  <span style="color:#888">← /restaurants/{id} → Demo 8.5 — dynamic route</span>
│   └── <span style="color:#7cffb8">api/restaurants/route.ts</span>   <span style="color:#888">← API endpoint, returns JSON</span>
├── <span style="color:#fc8019">components/</span>                    <span style="color:#888">← reusable components (server + client)</span>
│   ├── <span style="color:#7cffb8">RestaurantCard.tsx</span>         <span style="color:#888">← server component (zero JS to browser)</span>
│   ├── <span style="color:#7cffb8">RestaurantSearch.tsx</span>       <span style="color:#888">← <em>'use client'</em> — has state, ships JS</span>
│   └── <span style="color:#7cffb8">FavouriteButton.tsx</span>        <span style="color:#888">← <em>'use client'</em> — has onClick, ships JS</span>
├── <span style="color:#fc8019">lib/</span>
│   └── <span style="color:#7cffb8">restaurants.ts</span>             <span style="color:#888">← data (server can read it directly; clients via fetch)</span>
├── <span style="color:#7cffb8">next.config.ts</span>                 <span style="color:#888">← Next-level config (rewrites, images, env, …)</span>
├── <span style="color:#7cffb8">package.json</span>                   <span style="color:#888">← npm deps: react, react-dom, next, tailwind</span>
├── <span style="color:#7cffb8">tsconfig.json</span>                  <span style="color:#888">← TypeScript config</span>
└── <span style="color:#7cffb8">postcss.config.mjs</span>              <span style="color:#888">← Tailwind / PostCSS pipeline</span>
</pre>
</figure>

Three rules of thumb the file tree is telling you:

- **`app/` is the router.** A `page.tsx` at `app/foo/page.tsx` is the route `/foo`. A `page.tsx` at `app/restaurants/[id]/page.tsx` is the dynamic route `/restaurants/anything`. You don't register routes; you create files.
- **`layout.tsx` wraps everything below it.** The root `app/layout.tsx` wraps every page. A nested `app/dashboard/layout.tsx` would wrap only `/dashboard/*` pages. Persistent UI (sidebars, headers, providers) goes in a layout — it doesn't re-render when you navigate within its subtree.
- **`'use client'` is a boundary, not a switch.** Top of file. Everything above it (parents, importers) is server-only and ships zero JS. Everything below it (this component + everything it imports) ships to the browser. Push the boundary down to keep bundles small.

## Compare and contrast — Demo 6.5 SPA (by hand) vs. Next.js

<p class="beat__lede">You wrote one version yourself. Next gives you the other.</p>

| | Demo 6.5 hand-rolled SPA | Next.js |
|---|---|---|
| **Routing** | `pushState` + click handler, ~90 lines | File-based, free |
| **Build / bundler** | None (script tag) | Turbopack, free |
| **Dev server with HMR** | `python3 -m http.server` | `next dev` |
| **First-paint HTML** | Empty shell | SSG / SSR — real content |
| **Crawlers see** | Nothing | Everything |
| **New "page"** | Add a view + register a route in `app.js` | Create a file under `app/` |
| **Data fetching on server** | Impossible (no server) | Server component reads DB directly |
| **API routes** | Separate backend or static JSON | `app/api/*/route.ts` next to your pages |
| **Deploy** | `python3 -m http.server` on any host | `vercel deploy` or `npm run build && npm start` |
| **Lines of "infrastructure" code you write** | ~150 LOC to start | One command (`npx create-next-app`) |
| **Lock-in** | None | Significant — you adopt Next conventions |

## What you trade for it

<p class="beat__lede">Next gives you a lot. It also makes you eat its opinions.</p>

- **File-based routing isn't optional.** If you want `/foo`, you put `page.tsx` at `app/foo/`. Don't like it? You don't use Next.
- **Next-specific concepts.** `'use client'`, server components, the difference between `app/` and `pages/` (we use the new `app/` — the App Router), `generateStaticParams`, route handlers, middleware. None of these are React concepts — they're Next concepts. You spend the first week learning the new vocabulary.
- **Tighter ecosystem coupling.** Next picks Turbopack as the bundler, picks React Server Components as a default, picks `<Image>` as the image story, picks edge runtime as an option. Some of these decisions you can override; most you'd rather not.
- **Operational decisions.** A pure React + Vite app is a pile of static files — host it anywhere. A Next app needs Node (or Vercel's Functions/Edge runtimes) for anything beyond pure SSG. Hosting becomes a decision.

This is the framework trade-off from Demo 6.2. You take Next's opinions in exchange for never thinking about routing, build, dev server, or production server again.

## Forward-look

Demos 7, 8, and 8.5 each take one slice of this app and dig in.

- **Demo 7** — rendering strategies. The same Swiggy grid at `/ssg`, `/ssr`, `/csr`. View Source is the reveal.
- **Demo 8** — server vs. client components. `/hybrid` shows a server-rendered grid hosting a client-rendered search box, with badges on each.
- **Demo 8.5** — client-side routing. `<Link>` in action; the SPA pattern from Demo 6.5 with the SPA's downsides removed.

Before that, **Demo 6.7** shows what a bundler does (Next has one; plain React + Vite has one; the script-tag demo has none — and that gap is the lesson). Then **Demo 6.8** closes Part 3 with the layered model: where Next ends and React begins.

## Takeaways

- **Next.js is the framework option for React.** Same React, hosted by a framework that brings build, router, dev server, prod server, and conventions.
- **`app/` *is* your router.** Files become routes. `layout.tsx` wraps. `page.tsx` renders.
- **`'use client'` is a boundary, not a switch.** Push it down.
- **The Demo 6.5 contrast is the lesson.** You wrote 90 lines of router; `<Link>` is free. You served a static shell; Next ships real HTML. Same user-facing pattern, very different bill of materials.
- **The trade is opinions for velocity.** Next decides; you ship faster; you learn its vocabulary.
- **One Next deployment powers Demos 7, 8, 8.5.** What you see in this iframe is the same app, sliced into separate teaching demos in the next three.
```

- [ ] **Step 2: Commit**

```bash
cd /Users/saainithil/Code/teach
git add day_3/demo_6_6/README.md
git commit -m "demo_6_6: README — Next file tree, vs Demo 6.5, trade-offs, forward-link"
```

---

### Task 3.2: Wire Demo 6.6 into curriculum and content pipeline

**Files:**
- Modify: `site/lib/curriculum.ts`
- Modify: `site/scripts/copy-content.mjs`
- Modify: `day_3/README.md`

- [ ] **Step 1: Add the curriculum entry**

In `site/lib/curriculum.ts`, find the existing `demo_6_5` entry. The next entry (from the prior spec) is `demo_7`. Insert this `demo_6_6` entry directly after `demo_6_5` and before `demo_7`:

```typescript
  {
    id: "demo_6_6",
    slug: "demo_6_6",
    shortTitle: "Demo 6.6 — Intro to Next.js",
    title: 'Demo 6.6 — "The framework around React"',
    summary:
      "You wrote 90 lines of router by hand in Demo 6.5. Next.js is what happens when you let a framework bring the router, the build, the dev server, and the production server — and just write components. Iframes the homepage of the Swiggy Next app the next three demos dissect.",
    readmeSourcePath: "day_3/demo_6_6/README.md",
    contentFile: "day_3/demo_6_6.md",
    kind: "nextjs-separate",
    iframeUrlEnvVar: "NEXT_PUBLIC_DEMO_7_URL",
    iframePathSuffix: "/",
    iframeNote:
      "Click the four cards inside the iframe — every nav is a Link, no full reload. Pop the iframe out to see real URLs.",
  },
```

- [ ] **Step 2: Update Part 3 in `day3Parts`**

Replace Part 3's `demoSlugs`:

```typescript
  {
    heading: "Part 3 — React and the modern frontend",
    demoSlugs: [
      "demo_6", "demo_6_2", "demo_6_3", "demo_6_5",
      "demo_6_6", "verbal-segments",
    ],
  },
```

(We'll add `demo_6_7` and `demo_6_8` in Phases 4 and 5.)

- [ ] **Step 3: Update `copy-content.mjs`**

In the `markdownDemos` array, insert this entry after the `demo_6_3` entry:

```javascript
  { src: "demo_6_6/README.md", dest: "demo_6_6.md" },
```

No `staticDemos` or `demoSourceFiles` entry — Demo 6.6 has no source files of its own (it iframes the existing Next deployment).

- [ ] **Step 4: Add the bullet to `day_3/README.md`**

In `day_3/README.md`, between the Demo 6.5 bullet and the Part 4 section, insert:

```markdown
- **[Demo 6.6 — "The framework around React"](demo_6_6/README.md)** — what
  Next.js is and why it exists. Annotated file tree of the Swiggy Next app
  (the same one Demos 7/8/8.5 dissect), compare-and-contrast vs Demo 6.5's
  hand-rolled SPA — file-based routing, free dev server, free SSR, real
  HTML in View Source. The framework trade-off (opinions for velocity).
```

- [ ] **Step 5: Run copy-content and verify**

```bash
cd /Users/saainithil/Code/teach/site
node scripts/copy-content.mjs
```

Expected output includes:
- `[copy-content] copied demo_6_6/README.md -> content/day_3/demo_6_6.md`

- [ ] **Step 6: Type-check**

```bash
cd /Users/saainithil/Code/teach/site
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 7: Spot-check the page**

```bash
cd /Users/saainithil/Code/teach/site
npm run dev
```

Open `http://localhost:3000/days/3/demos/demo_6_6`. Expected:
- Breadcrumb shows `Home / Day 3 / Demo 6.6`.
- H1 reads `"The framework around React"`.
- If `NEXT_PUBLIC_DEMO_7_URL` is set, the iframe loads `/` of the deployed Next app (the four-card signpost). If unset, the "Demo not yet deployed" callout shows.
- The annotated file tree renders inside a styled `<pre>` block.
- The compare-and-contrast table renders correctly.
- Prev link goes to `Demo 6.5`. Next link goes to `Demo 7` (until Phase 4 adds 6.7 in between).

Stop the dev server.

- [ ] **Step 8: Commit**

```bash
cd /Users/saainithil/Code/teach
git add site/lib/curriculum.ts site/scripts/copy-content.mjs site/content/day_3/demo_6_6.md day_3/README.md
git commit -m "site: wire demo_6_6 into curriculum, Part 3, and copy-content"
```

---

## Phase 4 — Demo 6.7 "What a bundler actually does" (embedded)

### Task 4.1: Create the bundler-viewer HTML and CSS

**Files:**
- Create: `day_3/demo_6_7/index.html`
- Create: `day_3/demo_6_7/style.css`

- [ ] **Step 1: Write `day_3/demo_6_7/style.css`**

```css
* { box-sizing: border-box; }

body {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  margin: 0;
  padding: 24px 20px;
  background: #f5f5f5;
  color: #1c1c1c;
  line-height: 1.5;
}

h1 {
  font-size: 18px;
  margin: 0 0 6px;
}

p.lede {
  margin: 0 0 24px;
  font-size: 13px;
  color: #555;
}

section {
  background: #fff;
  border-radius: 8px;
  border: 1px solid #e5e5e5;
  padding: 16px 20px;
  margin-bottom: 16px;
}

section > h2 {
  font-size: 14px;
  margin: 0 0 10px;
  color: #1c1c1c;
  text-transform: uppercase;
  letter-spacing: 0.06em;
}

.cols {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  align-items: stretch;
}

.col {
  background: #fafafa;
  border: 1px solid #ececec;
  border-radius: 6px;
  padding: 12px;
}

.col pre {
  margin: 0;
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
  font-size: 12px;
  background: #1c1c1c;
  color: #eee;
  padding: 10px 12px;
  border-radius: 4px;
  overflow-x: auto;
}

.col .label {
  font-size: 11px;
  font-weight: 600;
  color: #777;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  margin-bottom: 8px;
}

.size-bar {
  margin-top: 10px;
  height: 22px;
  background: #ececec;
  border-radius: 4px;
  position: relative;
  overflow: hidden;
}

.size-bar__fill {
  height: 100%;
  background: linear-gradient(90deg, #fc8019, #f78b35);
  position: relative;
}

.size-bar__fill--big { width: 100%; }
.size-bar__fill--small { width: 3%; }

.size-bar__label {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 600;
  color: #1c1c1c;
}

.routes-table {
  width: 100%;
  border-collapse: collapse;
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
  font-size: 12px;
}

.routes-table th {
  text-align: left;
  background: #fafafa;
  padding: 6px 8px;
  border-bottom: 1px solid #e5e5e5;
  font-weight: 600;
  color: #555;
}

.routes-table td {
  padding: 6px 8px;
  border-bottom: 1px solid #f0f0f0;
}

.routes-table .marker { width: 18px; color: #777; }
.routes-table .route { color: #1c1c1c; }
.routes-table .num   { text-align: right; color: #444; }
.routes-table .num--big { color: #c05417; font-weight: 600; }

.three-cols {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
  font-size: 12px;
}

.three-cols .head {
  font-weight: 600;
  font-size: 13px;
  margin-bottom: 6px;
}

.three-cols .row {
  padding: 6px 0;
  border-top: 1px solid #ececec;
}

.three-cols .row:first-of-type { border-top: none; }
.three-cols .col-cell { padding-right: 8px; }
.three-cols .label { color: #777; font-weight: 600; }

.callout {
  background: #fff5e6;
  border: 1px solid #ffd9a8;
  border-radius: 6px;
  padding: 10px 12px;
  font-size: 12px;
  color: #5a3000;
  margin-top: 10px;
}
```

- [ ] **Step 2: Write `day_3/demo_6_7/index.html`**

```html
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>What a bundler actually does</title>
  <link rel="stylesheet" href="style.css" />
</head>
<body>
  <h1>What a bundler actually does</h1>
  <p class="lede">
    Bundling, code splitting, tree shaking — three things that are <strong>not</strong> React.
    They're what bundlers do. Bundle size is the lever most modern web perf work pulls on.
  </p>

  <!-- 1. Three worlds: script tag vs Vite vs Next -->
  <section>
    <h2>The three worlds — same React, three hosts</h2>
    <div class="three-cols">
      <div class="col-cell"><div class="head">Script tag (Demo 6.3)</div></div>
      <div class="col-cell"><div class="head">React + Vite/webpack</div></div>
      <div class="col-cell"><div class="head">React + Next</div></div>

      <div class="col-cell row"><span class="label">Bundler</span><br/>None</div>
      <div class="col-cell row"><span class="label">Bundler</span><br/>You pick (Vite default)</div>
      <div class="col-cell row"><span class="label">Bundler</span><br/>Turbopack, picked for you</div>

      <div class="col-cell row"><span class="label">Tree shaking</span><br/>Doesn't apply (everything global)</div>
      <div class="col-cell row"><span class="label">Tree shaking</span><br/>Automatic (ES modules)</div>
      <div class="col-cell row"><span class="label">Tree shaking</span><br/>Automatic</div>

      <div class="col-cell row"><span class="label">Code splitting</span><br/>No</div>
      <div class="col-cell row"><span class="label">Code splitting</span><br/>Manual via React.lazy() + dynamic import()</div>
      <div class="col-cell row"><span class="label">Code splitting</span><br/>Automatic per route + still React.lazy()</div>

      <div class="col-cell row"><span class="label">import statements</span><br/>Not supported</div>
      <div class="col-cell row"><span class="label">import statements</span><br/>First class</div>
      <div class="col-cell row"><span class="label">import statements</span><br/>First class</div>

      <div class="col-cell row"><span class="label">npm packages</span><br/>Only via UMD CDN</div>
      <div class="col-cell row"><span class="label">npm packages</span><br/>First class</div>
      <div class="col-cell row"><span class="label">npm packages</span><br/>First class</div>

      <div class="col-cell row"><span class="label">Bundle size visibility</span><br/>View Source</div>
      <div class="col-cell row"><span class="label">Bundle size visibility</span><br/>Vite/webpack build report</div>
      <div class="col-cell row"><span class="label">Bundle size visibility</span><br/><code>next build</code> route table</div>

      <div class="col-cell row"><span class="label">When to use</span><br/>Demos, tiny apps, embeds</div>
      <div class="col-cell row"><span class="label">When to use</span><br/>React app behind a custom backend / static host</div>
      <div class="col-cell row"><span class="label">When to use</span><br/>Production apps, SSR/SSG</div>
    </div>
  </section>

  <!-- 2. Tree shaking made physical -->
  <section>
    <h2>Tree shaking, made physical — same logic, 35× size difference</h2>
    <div class="cols">
      <div class="col">
        <div class="label">Full import (no tree shaking benefit)</div>
        <pre>import _ from 'lodash';

_.map([1, 2, 3], x =&gt; x * 2);</pre>
        <div class="size-bar">
          <div class="size-bar__fill size-bar__fill--big">
            <span class="size-bar__label">~70 KB shipped</span>
          </div>
        </div>
      </div>
      <div class="col">
        <div class="label">Named import (only what you use)</div>
        <pre>import map from 'lodash/map';

map([1, 2, 3], x =&gt; x * 2);</pre>
        <div class="size-bar">
          <div class="size-bar__fill size-bar__fill--small">
            <span class="size-bar__label" style="left:24px;justify-content:flex-start;">~2 KB</span>
          </div>
        </div>
      </div>
    </div>
    <div class="callout">
      Same behaviour. One line of difference. The bundler walks the import graph from your entry
      point; if you never reference <code>_.shuffle</code>, <code>_.debounce</code>, or the other
      297 lodash functions, it drops them. That's tree shaking. It works because ES modules are
      statically analyzable — the bundler can prove what you do and don't use.
    </div>
  </section>

  <!-- 3. Code splitting — mock Next routes table -->
  <section>
    <h2>Code splitting — Next's per-route output (from <code>next build</code>)</h2>
    <table class="routes-table">
      <thead>
        <tr>
          <th></th>
          <th>Route</th>
          <th class="num">Size</th>
          <th class="num">First Load JS</th>
        </tr>
      </thead>
      <tbody>
        <tr><td class="marker">○</td><td class="route">/</td>                   <td class="num">142 B</td>  <td class="num">89.1 kB</td></tr>
        <tr><td class="marker">●</td><td class="route">/ssg</td>                <td class="num">186 B</td>  <td class="num">89.2 kB</td></tr>
        <tr><td class="marker">●</td><td class="route">/ssr</td>                <td class="num">186 B</td>  <td class="num">89.2 kB</td></tr>
        <tr><td class="marker">○</td><td class="route">/csr</td>                <td class="num">812 B</td>  <td class="num">93.8 kB</td></tr>
        <tr><td class="marker">○</td><td class="route">/hybrid</td>             <td class="num num--big">3.4 kB</td><td class="num num--big">94.6 kB</td></tr>
        <tr><td class="marker">●</td><td class="route">/restaurants/[id]</td>   <td class="num">1.2 kB</td>  <td class="num">92.4 kB</td></tr>
        <tr><td class="marker">ƒ</td><td class="route">/api/restaurants</td>    <td class="num">0 B</td>    <td class="num">0 B</td></tr>
      </tbody>
    </table>
    <div class="callout">
      <strong>Look at <code>/hybrid</code>.</strong> 3.4 kB vs the other routes' few hundred bytes,
      because the client search box ships JS while everything around it is server-only. The
      <code>'use client'</code> boundary <em>is</em> the code-splitting boundary. The server-only
      routes are tiny — they paid nothing for being React. That's the point of Demo 8's badges.
      <br/><br/>
      ○ static · ● SSG (with <code>generateStaticParams</code>) · ƒ server function. Markers from
      real <code>next build</code> output.
    </div>
  </section>

  <!-- 4. React.lazy code split for plain React -->
  <section>
    <h2>Code splitting in plain React — <code>React.lazy()</code>, five lines</h2>
    <pre style="background:#1c1c1c;color:#eee;padding:12px 14px;border-radius:6px;font-size:12px;font-family:ui-monospace,Menlo,monospace;margin:0;overflow-x:auto;">const Heavy = React.lazy(() =&gt; import('./Heavy'));

function App() {
  return (
    &lt;Suspense fallback={&lt;Spinner /&gt;}&gt;
      &lt;Heavy /&gt;
    &lt;/Suspense&gt;
  );
}</pre>
    <div class="callout">
      <code>React.lazy</code> is React's <em>only</em> bundler-aware API. The dynamic
      <code>import()</code> tells your bundler "this module is a separate chunk; fetch it later."
      The bundler does the actual splitting. React provides the runtime primitive (Suspense)
      to render a fallback while it loads. Same code works with Vite, webpack, or Next.
    </div>
  </section>
</body>
</html>
```

- [ ] **Step 3: Verify locally**

```bash
cd /Users/saainithil/Code/teach/day_3/demo_6_7
python3 -m http.server 8765
```

Open `http://localhost:8765/index.html`. Expected:
- Four sections render: three-column compare, tree-shaking side-by-side, Next routes table, React.lazy snippet.
- The big size bar (~70 KB) fills most of its row; the small bar (~2 KB) shows a thin orange sliver.
- The `/hybrid` row in the routes table is visually highlighted.

Stop the server.

- [ ] **Step 4: Commit**

```bash
cd /Users/saainithil/Code/teach
git add day_3/demo_6_7/index.html day_3/demo_6_7/style.css
git commit -m "demo_6_7: viewer HTML — three worlds, tree shaking, code splitting"
```

---

### Task 4.2: Write the Demo 6.7 README

**Files:**
- Create: `day_3/demo_6_7/README.md`

- [ ] **Step 1: Create the file**

```markdown
# "What a bundler actually does"

You just saw Next.js has a bundler. Plain React + Vite has one too. Demo 6.3's script-tag React has *none*. Three worlds — three different stories for how your code gets to the browser. The middle ground (React + Vite) is the version most production React apps live in, *not* Next. Worth understanding.

This demo also unlocks something specific: **Demo 8's "🟢 Server (0 KB JS)" badge only makes sense if you know what bundling is.** That's why this beat is in Part 3, not Part 6 alongside Lighthouse.

## Setup

The iframe is a static viewer. Read top to bottom:

1. **The three worlds.** A side-by-side of script tag (Demo 6.3) vs React + Vite vs React + Next. Same React, three different bundler stories.
2. **Tree shaking.** Two `lodash` imports. One line difference. 35× size difference. The numbers are real (full lodash is ~70 KB minified; one function is ~2 KB).
3. **Code splitting.** A mocked `next build` route table showing per-route chunk sizes. Look at `/hybrid` — bigger because of the client search box.
4. **`React.lazy` in 5 lines.** How plain React opts into component-level splitting. Works in Vite, webpack, or Next.

Stay in the iframe for the numbers; come back here for the why.

## What bundling actually is

<p class="beat__lede">The browser doesn't know what <code>import { useState } from 'react'</code> means. The bundler is the thing that turns your hundreds of files of <code>import</code> statements into a small handful of files the browser can actually load.</p>

- You write code in many files using `import` and `export`.
- A bundler (Vite, webpack, Turbopack, Rollup, esbuild, Parcel — pick one) starts at your entry point.
- It walks the import graph: this file imports that one, which imports the next, which imports a thing from `node_modules/react/index.js`, and so on.
- It compiles JSX/TypeScript to plain JavaScript along the way (with SWC, esbuild, or Babel).
- It bundles the graph into one or more chunks of JavaScript the browser can `<script src="…">` directly.

That's the whole job. The output is what the browser actually loads.

## Tree shaking, in one paragraph

<p class="beat__lede">A bundler can drop code you didn't use, because ES modules are statically analyzable.</p>

- `import map from 'lodash/map'` — the bundler sees you imported one function; it ships that function's code only.
- `import _ from 'lodash'` followed by `_.map(...)` — the bundler can't easily prove which methods you used; it has to ship the whole library to be safe. That's why the iframe shows 70 KB vs 2 KB.
- It only works with ES modules (`import`/`export`), not with CommonJS `require()`. Modern libraries are ESM-friendly; older ones can defeat tree shaking.
- The practical takeaway: **import what you use, not the namespace**. `import { debounce } from 'lodash-es'` over `import _ from 'lodash'`. Your bundle is happier.

## Code splitting, in one paragraph

<p class="beat__lede">Instead of one giant bundle, the bundler can split into chunks so the browser downloads only what the current page needs.</p>

- **Route-level** (Next: automatic): each route is its own chunk. Visiting `/foo` doesn't download `/bar`'s code. The iframe's routes table shows this — each route has a different "Size" column.
- **Component-level** (`React.lazy`): you tell the bundler "this component is a dynamic import; split it into its own chunk." The bundler obliges. React provides `Suspense` to render a fallback while the chunk loads. Five lines, no framework needed.
- **What this buys you:** smaller first-load JS. The user only pays for what they need to see *right now*. Heavy admin panels, modal dialogs, fancy editors — load on demand, not on first paint.

## Why this is in Part 3, not in the performance section

<p class="beat__lede">Bundlers are framing, not just optimization.</p>

- **It's the difference between "React is a library" and "React in a real app."** Without a bundler, you're in the world of Demo 6.3 — perfect for widgets, useless for anything serious. With a bundler, you have the rest of npm.
- **It explains Demo 8's badges.** "🟢 Server (0 KB JS)" only means something if you know what the bundle is. Server components are an aggressive form of code-splitting where the split happens at the runtime boundary, not at an `import` statement.
- **Performance work in Demo 9 builds on this.** "Reduce LCP" usually means "reduce bundle size and reduce server work." If you don't know what's in the bundle, you can't reduce it.

## Going deeper — Vite is the default plain-React story now

<p class="beat__lede">If you're building a React app that isn't Next, you're probably using Vite. Worth knowing.</p>

- **Vite** = `create-react-app`'s replacement. `npm create vite@latest` scaffolds a React + TypeScript + Vite project in seconds.
- It uses **esbuild** for development (millisecond bundle times) and **Rollup** for production (good tree shaking).
- It does *not* do SSR/SSG out of the box like Next — for those you reach for a Vite-based meta-framework (Astro, Remix, TanStack Start) or you go to Next.
- The "React without Next" world is real and common: internal admin apps, embedded widgets, React inside a non-Node backend (Django, Rails). Vite owns that space.

## Stretch goal — reproduce the lodash numbers yourself

Not required for the lesson, but if you want to see the bundle sizes for real:

```bash
mkdir lodash-experiment && cd lodash-experiment
npm create vite@latest . -- --template vanilla-ts
npm install lodash
echo "import _ from 'lodash'; console.log(_.map([1,2,3], x => x*2));" > src/main.ts
npm run build
# Look at the size in the build report.

# Now change main.ts to:
echo "import map from 'lodash/map'; console.log(map([1,2,3], x => x*2));" > src/main.ts
npm run build
# Compare the two sizes.
```

You'll see numbers in the same ballpark as the iframe (Vite minifies harder, so they may be a bit different).

## Takeaways

- **Bundling, code splitting, tree shaking are bundler concerns, not React concerns.** They apply equally in plain React + Vite and React + Next.
- **The bundler walks your import graph and produces chunks.** Routes, dynamic imports, libraries — anything that can be split usually is.
- **Tree shaking depends on ES modules.** Import named functions, not the whole namespace.
- **`React.lazy` is React's *only* bundler-aware API.** Five lines, works in any bundler.
- **Next's automatic per-route splitting is what gives you the `/hybrid` size column.** Server-only routes are tiny. Client islands cost you JS.
- **"0 KB JS" badges on server components are a code-splitting story.** The boundary is the runtime, not an import statement.
```

- [ ] **Step 2: Commit**

```bash
cd /Users/saainithil/Code/teach
git add day_3/demo_6_7/README.md
git commit -m "demo_6_7: README — bundler concept, tree shaking, splitting, React.lazy, Vite"
```

---

### Task 4.3: Strip bundling content from `verbal-segments.md`

**Files:**
- Modify: `day_3/verbal-segments.md`

The existing "Tooling break — Node, npm, and bundling" section has a substantial **Bundling** subsection with a mermaid flowchart. Demo 6.7 now covers bundling in depth. We replace the bundling subsection with a one-line forward-reference and rename the section.

- [ ] **Step 1: Locate and replace the section**

In `day_3/verbal-segments.md`, find this heading:

```markdown
## Tooling break — Node, npm, and bundling
```

Replace with:

```markdown
## Tooling break — Node and npm
```

Then find the **Bundling** paragraph (it starts with `**Bundling.** Here's the problem.` and continues through the mermaid `flowchart LR` block and its trailing fence). Replace the entire stretch — from the `**Bundling.**` paragraph through the closing ` ``` ` of the mermaid block — with this short forward-reference:

```markdown
**Bundling.** That's its own demo — see **Demo 6.7 — "What a bundler actually does"** in Part 3 for the bundler story (tree shaking, code splitting, the `next build` route table, how plain React + Vite handles it, and why Demo 8's "0 KB JS" badge is a bundle story). The headline: a bundler walks your `import` graph, compiles JSX, splits per route, drops unused code, and produces the handful of files the browser actually loads.
```

This keeps the section's flow (Node → npm → forward-ref) and avoids duplicating the long bundling explanation.

- [ ] **Step 2: Verify the section reads cleanly**

```bash
cd /Users/saainithil/Code/teach
grep -A 3 "Tooling break" day_3/verbal-segments.md | head -6
```

Expected: the heading reads `## Tooling break — Node and npm`. The mermaid block is gone.

```bash
grep -c "flowchart LR" day_3/verbal-segments.md
```

Expected: `0` (the mermaid block was the only one in this file).

If `0` is unexpected (e.g. the file has other mermaid blocks), re-verify that only the **Bundling** mermaid was removed.

- [ ] **Step 3: Commit**

```bash
cd /Users/saainithil/Code/teach
git add day_3/verbal-segments.md
git commit -m "verbal-segments: retire bundling subsection, forward-ref Demo 6.7"
```

---

### Task 4.4: Wire Demo 6.7 into curriculum and content pipeline

**Files:**
- Modify: `site/lib/curriculum.ts`
- Modify: `site/scripts/copy-content.mjs`
- Modify: `day_3/README.md`

- [ ] **Step 1: Add the curriculum entry**

In `site/lib/curriculum.ts`, find the `demo_6_6` entry (added in Phase 3). Insert this `demo_6_7` entry directly after it:

```typescript
  {
    id: "demo_6_7",
    slug: "demo_6_7",
    shortTitle: "Demo 6.7 — What a bundler actually does",
    title: 'Demo 6.7 — "Bundling, splitting, tree shaking"',
    summary:
      "Three worlds for getting React to the browser: script tag (no bundler), React + Vite (you pick), React + Next (Turbopack picks for you). Real bundle-size numbers (full lodash vs named import), a mocked next build route table, and how React.lazy gives plain React code-splitting in five lines.",
    readmeSourcePath: "day_3/demo_6_7/README.md",
    contentFile: "day_3/demo_6_7.md",
    kind: "embedded",
    iframePath: "/live-demos/demo_6_7/index.html",
    iframeNote:
      "Static viewer — read top to bottom. Compare the lodash size bars and the /hybrid row in the routes table.",
    sourceFiles: [
      { name: "index.html", language: "html" },
      { name: "style.css", language: "css" },
    ],
  },
```

- [ ] **Step 2: Update Part 3 in `day3Parts`**

Replace Part 3's `demoSlugs` array to include `demo_6_7` between `demo_6_6` and `verbal-segments`:

```typescript
  {
    heading: "Part 3 — React and the modern frontend",
    demoSlugs: [
      "demo_6", "demo_6_2", "demo_6_3", "demo_6_5",
      "demo_6_6", "demo_6_7", "verbal-segments",
    ],
  },
```

- [ ] **Step 3: Update `copy-content.mjs`**

In `markdownDemos`, add after `demo_6_6`:

```javascript
  { src: "demo_6_7/README.md", dest: "demo_6_7.md" },
```

In `staticDemos`, add `"demo_6_7"` (numerical order is nice but not required):

```javascript
  const staticDemos = [
    "demo_1",
    "demo_2_5",
    "demo_3",
    "demo_4",
    "demo_5",
    "demo_6",
    "demo_6_3",
    "demo_6_5",
    "demo_6_7",
    "demo_10",
    "wrap",
  ];
```

In `demoSourceFiles`, add `demo_6_7`:

```javascript
    demo_6_7: [
      { name: "index.html", language: "html" },
      { name: "style.css", language: "css" },
    ],
```

(Place it next to `demo_6_3` for grouping.)

- [ ] **Step 4: Add the bullet to `day_3/README.md`**

Between the Demo 6.6 bullet and the Part 4 section, insert:

```markdown
- **[Demo 6.7 — "Bundling, splitting, tree shaking"](demo_6_7/README.md)** — what
  a bundler actually does. Three-column compare (script tag / React + Vite /
  React + Next), real lodash size numbers (~70 KB vs ~2 KB on one import line),
  a mocked `next build` routes table, and `React.lazy` in five lines. Sets up
  why Demo 8's "0 KB JS" badge matters.
```

- [ ] **Step 5: Run copy-content and verify**

```bash
cd /Users/saainithil/Code/teach/site
node scripts/copy-content.mjs
```

Expected output includes:
- `[copy-content] copied demo_6_7/README.md -> content/day_3/demo_6_7.md`
- `[copy-content] copied demo_6_7/ -> public/live-demos/demo_6_7/`
- `[copy-content] copied demo_6_7/index.html -> content/day_3/demo_6_7/code/index.html`
- `[copy-content] copied demo_6_7/style.css -> content/day_3/demo_6_7/code/style.css`

- [ ] **Step 6: Type-check**

```bash
cd /Users/saainithil/Code/teach/site
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 7: Spot-check the page**

```bash
cd /Users/saainithil/Code/teach/site
npm run dev
```

Open `http://localhost:3000/days/3/demos/demo_6_7`. Expected:
- H1 reads `"Bundling, splitting, tree shaking"`.
- Iframe renders the viewer with the three-column compare, the lodash size bars, the routes table, and the `React.lazy` snippet.
- Source section shows `index.html` and `style.css`.
- Prev link goes to `Demo 6.6`. Next link goes to `Demo 7` (until Phase 5 adds 6.8).

Stop the dev server.

- [ ] **Step 8: Commit**

```bash
cd /Users/saainithil/Code/teach
git add site/lib/curriculum.ts site/scripts/copy-content.mjs site/content/day_3/demo_6_7.md site/content/day_3/demo_6_7/ site/public/live-demos/demo_6_7/ day_3/README.md
git commit -m "site: wire demo_6_7 into curriculum, Part 3, copy-content, sourceFiles"
```

---

## Phase 5 — Demo 6.8 "How Next works with React" (runbook-only)

### Task 5.1: Write the Demo 6.8 README

**Files:**
- Create: `day_3/demo_6_8/README.md`

- [ ] **Step 1: Create the file**

```markdown
# "How Next works with React"

You've seen React running in a script tag (Demo 6.3). You've seen Next.js wrapping a real app (Demo 6.6). You've seen what a bundler does (Demo 6.7). One question left before Demos 7/8/8.5 dig into rendering strategies: **how do Next and React actually fit together?**

Short answer: Next is a host. React is the engine. Next *uses* React the same way Demo 6.3's script tag did — by calling React's renderer. The difference is *when* Next calls it (server, browser, both) and *what else* Next does around it (router, build, deploy).

## Setup

No iframe — this is a 5-minute reading between Demo 6.7 and Demo 7. The diagram below is the whole picture; the rest of the page is the walk-through.

## The layered model

<figure class="beat__visual">
<pre style="background:#fafafa;border:1px solid #e5e5e5;border-radius:8px;padding:18px 20px;font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:12px;line-height:1.45;color:#1c1c1c;overflow-x:auto;">
┌─────────────────────────────────────────────────────────┐
│ <strong>Next.js</strong> (the framework)                              │
│   • file-based router (<code>app/foo/page.tsx</code> → <code>/foo</code>)         │
│   • build (Turbopack)                                   │
│   • dev server with HMR                                 │
│   • production server (Node / Edge / Vercel Functions)  │
│   • App Router conventions (<code>'use client'</code>, layouts, …)  │
│   ┌─────────────────────────────────────────────────┐   │
│   │ <strong>React DOM</strong> (the renderer)                     │   │
│   │   • <code>react-dom/server</code> → HTML strings            │   │
│   │   • <code>react-dom/client</code> → hydrate + update DOM    │   │
│   │   ┌─────────────────────────────────────────┐   │   │
│   │   │ <strong>React</strong> (the reconciler)               │   │   │
│   │   │   • <code>createElement</code> / JSX                │   │   │
│   │   │   • diffing                             │   │   │
│   │   │   • hooks (<code>useState</code>, <code>useEffect</code>, …)    │   │   │
│   │   └─────────────────────────────────────────┘   │   │
│   └─────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
</pre>
</figure>

Three layers:

- **React** is the reconciler. Pure logic — knows nothing about the browser. Given a tree of element objects, produces a diff against the previous tree. That's all `react` (the npm package) does.
- **React DOM** is *a* renderer. Knows how to turn React's diff into DOM operations. Has two halves: `react-dom/client` (the one that runs in the browser, attaches event handlers, applies updates) and `react-dom/server` (the one that runs on the server, produces an HTML string from React elements). React Native is a different renderer for the same reconciler.
- **Next.js** is a framework that *hosts* React DOM. It owns when and where the renderer runs, plus everything around it: routing, build, dev server, prod server, deploy.

The arrow always points the same way. Next calls React DOM. React DOM calls React. React produces a diff. React DOM applies the diff. Next never "uses React" directly — it always goes through React DOM.

## What runs where

<p class="beat__lede">Same React component, different moments. Same diffing, different renderer.</p>

### On `next build`

For every **SSG** route (default), Next calls `react-dom/server.renderToString(<Page />)`. The output is an HTML file written to disk under `.next/`. That file is what the CDN serves when you visit the route. **React ran once, at build time, on the build server.**

### On every request to an **SSR** route

Next calls `react-dom/server.renderToString(<Page />)` again — but live, this time, with whatever cookies / locale / user context the request brought. **React runs per request, on the production server.**

### On every request to **any** route

The browser receives HTML (whether SSG-built or SSR-built or a CSR shell). Then Next ships a JavaScript bundle. `react-dom/client.hydrateRoot(<Page />)` runs in the browser, walks the same React tree the server walked, and attaches event handlers to the existing DOM nodes the server already painted. **React runs once on the browser to "wake up" the page.** This is hydration. The gap between paint and hydration finishing is the hydration gap — Demo 8's Slow 3G reveal.

### On every client-side navigation via `<Link>`

Next's router intercepts the click, fetches a serialized React tree (an RSC payload) for the next route, hands it back to React for reconciliation, and React DOM swaps in only the changed sections. **No new server-rendered HTML document.** Same reconciler from Demo 6 — running in the browser, diffing two trees, producing minimal DOM updates.

That's the whole "where does React run in a Next app" map. Build server, production server (for SSR), browser (for hydration, for client-side navigation, for `useEffect`).

## Server components vs. client components, in one paragraph

<p class="beat__lede"><code>'use client'</code> is a Next-era directive that tells the build "below this point, ship React's <em>client</em> renderer and this component's JS to the browser."</p>

- Above the boundary: components run **only** in `react-dom/server`. They produce HTML. They ship **zero JavaScript** to the browser. They can read databases, call APIs, hit the filesystem.
- Below the boundary: components run in `react-dom/server` first (to produce the initial HTML) **and** in `react-dom/client` after (to hydrate and update). The boundary component plus everything it imports ships to the browser.
- The boundary is not a switch — it's a tree split. Push it down. Tiny client leaves, big server trunks. That's the lesson Demo 8 makes visible with its badges.

## What this means for your homework

<p class="beat__lede">Every React concept still applies inside Next.</p>

- Components are still functions of props.
- State is still `useState`. Effects are still `useEffect`. Hooks behave the same way.
- JSX still compiles to `React.createElement` (the bundler does it, not Babel-standalone — but the same compilation).
- The component tree, reconciliation, and diffing from Demo 6 are happening on every render.
- What changes is **where** they run (server for the initial render of server components; browser for everything after hydration) and **what wraps them** (Next's router, layouts, conventions).

If you can build a React component in plain React (Demo 6.3), you can build one in Next. The framework adds where and when; it doesn't replace what.

## Why this matters for the next three demos

<p class="beat__lede">Demos 7, 8, 8.5 each pick one layer of this stack and stare at it.</p>

- **Demo 7** — *where the server renders.* SSG (at build), SSR (per request), or CSR (not at all). All three are configurations of `react-dom/server`'s behavior.
- **Demo 8** — *the boundary.* Server components don't ship; client components do. The hydration gap on Slow 3G is `react-dom/client`'s gap.
- **Demo 8.5** — *client-side routing.* `<Link>` is the Next router's intercept, fetching an RSC payload, calling reconciliation. Same React, smarter host.

You now have the layered model. Demos 7/8/8.5 are tours through specific floors of the building.

## Takeaways

- **Next is a host. React is the engine.** Next calls React DOM, React DOM calls React, React produces a diff.
- **Same React, different `when` and `where`.** Build server (SSG), prod server (SSR), browser (hydration + client nav + effects).
- **`react-dom/server` and `react-dom/client` are different halves of one library.** Next uses both.
- **`'use client'` decides which half a component is rendered with on the browser side.** Above: server-only, zero JS. Below: hydrated client, ships JS.
- **Every React skill still applies.** Components, state, effects, JSX, hooks — all the same. Next adds where; it doesn't change what.
- **Demos 7/8/8.5 are the deep dive.** You now have the map.
```

- [ ] **Step 2: Commit**

```bash
cd /Users/saainithil/Code/teach
git add day_3/demo_6_8/README.md
git commit -m "demo_6_8: README — layered model, what runs where, server vs client boundary"
```

---

### Task 5.2: Wire Demo 6.8 into curriculum and content pipeline

**Files:**
- Modify: `site/lib/curriculum.ts`
- Modify: `site/scripts/copy-content.mjs`
- Modify: `day_3/README.md`

- [ ] **Step 1: Add the curriculum entry**

In `site/lib/curriculum.ts`, find the `demo_6_7` entry (added in Phase 4). Insert this `demo_6_8` entry directly after:

```typescript
  {
    id: "demo_6_8",
    slug: "demo_6_8",
    shortTitle: "Demo 6.8 — How Next works with React",
    title: 'Demo 6.8 — "Next is a host; React is the engine"',
    summary:
      "The layered model: Next.js → React DOM → React. Where each layer runs (build, server, browser), what 'use client' really means at the boundary, and why every React skill still applies inside Next. The map you'll use through Demos 7, 8, and 8.5.",
    readmeSourcePath: "day_3/demo_6_8/README.md",
    contentFile: "day_3/demo_6_8.md",
    kind: "runbook-only",
    runbookHint:
      "No iframe — this is a 5-minute reading between Demo 6.7 and Demo 7. The layered diagram in the runbook is the whole picture.",
  },
```

- [ ] **Step 2: Update Part 3 in `day3Parts`**

Replace Part 3's `demoSlugs` to include `demo_6_8` between `demo_6_7` and `verbal-segments`:

```typescript
  {
    heading: "Part 3 — React and the modern frontend",
    demoSlugs: [
      "demo_6", "demo_6_2", "demo_6_3", "demo_6_5",
      "demo_6_6", "demo_6_7", "demo_6_8", "verbal-segments",
    ],
  },
```

- [ ] **Step 3: Update `copy-content.mjs`**

Add to `markdownDemos`:

```javascript
  { src: "demo_6_8/README.md", dest: "demo_6_8.md" },
```

No `staticDemos` or `demoSourceFiles` entry (runbook-only).

- [ ] **Step 4: Add the bullet to `day_3/README.md`**

Between the Demo 6.7 bullet and the Part 4 section, insert:

```markdown
- **[Demo 6.8 — "Next is a host; React is the engine"](demo_6_8/README.md)** —
  the layered model. Next.js → React DOM → React. Where each layer runs (build,
  server, browser), what `'use client'` does at the boundary, and why every
  React skill still applies inside Next. The map for Demos 7, 8, and 8.5.
```

- [ ] **Step 5: Run copy-content and verify**

```bash
cd /Users/saainithil/Code/teach/site
node scripts/copy-content.mjs
```

Expected output includes:
- `[copy-content] copied demo_6_8/README.md -> content/day_3/demo_6_8.md`

- [ ] **Step 6: Type-check**

```bash
cd /Users/saainithil/Code/teach/site
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 7: Spot-check the page**

```bash
cd /Users/saainithil/Code/teach/site
npm run dev
```

Open `http://localhost:3000/days/3/demos/demo_6_8`. Expected:
- H1 reads `"Next is a host; React is the engine"`.
- Runbook callout shows (no iframe).
- Section deck paginates: Setup, The layered model, What runs where, Server vs client components, What this means for your homework, Why this matters, Takeaways.
- The layered diagram (`<pre>` block with nested boxes) renders correctly.
- Prev link goes to `Demo 6.7`. Next link goes to `Demo 7`.

Stop the dev server.

- [ ] **Step 8: Commit**

```bash
cd /Users/saainithil/Code/teach
git add site/lib/curriculum.ts site/scripts/copy-content.mjs site/content/day_3/demo_6_8.md day_3/README.md
git commit -m "site: wire demo_6_8 into curriculum, Part 3, and copy-content"
```

---

## Phase 6 — Final polish

### Task 6.1: End-to-end verification and README sanity check

**Files:**
- Read: `day_3/README.md`
- Verify: full Day 3 site flow

- [ ] **Step 1: Read `day_3/README.md` Part 3 end-to-end**

```bash
cd /Users/saainithil/Code/teach
sed -n '/^### Part 3/,/^### Part 4/p' day_3/README.md
```

Expected: eight bullets in this exact order — Demo 6, 6.2, 6.3, 6.5, 6.6, 6.7, 6.8, Verbal segments. No leftover phrasing referring to old structure.

- [ ] **Step 2: Build the site clean**

```bash
cd /Users/saainithil/Code/teach/site
npm run build
```

Expected: build succeeds. The route list should now include `/days/3/demos/demo_6_2`, `/demo_6_3`, `/demo_6_6`, `/demo_6_7`, `/demo_6_8` as static-prerendered routes (●).

- [ ] **Step 3: Walk the Part 3 chain in a live dev server**

```bash
cd /Users/saainithil/Code/teach/site
npm run dev
```

In a browser, starting at `http://localhost:3000/days/3/demos/demo_6`, click **Next** repeatedly and confirm the chain:

`Demo 6 → 6.2 → 6.3 → 6.5 → 6.6 → 6.7 → 6.8 → Demo 7`

Also click **Prev** from each page to confirm the reverse direction works.

Spot-check on each new page:
- **6.2** — runbook callout visible, section deck paginates the verbal content.
- **6.3** — Swiggy card iframe loads, Like button works, source files surface in the Source deck section.
- **6.6** — iframe of `/` from the Next deployment (or "not yet deployed" callout if env var is unset locally); annotated file tree renders in a styled `<pre>` block.
- **6.7** — three-column compare, lodash size bars, routes table, `React.lazy` snippet all visible inside the iframe; source files surface.
- **6.8** — runbook callout, layered architecture diagram renders, section deck paginates.

Stop the dev server.

- [ ] **Step 4: Confirm verbal-segments.md still reads cleanly**

```bash
cd /Users/saainithil/Code/teach
sed -n '/^## Tooling break/,/^## /p' day_3/verbal-segments.md | head -30
```

Expected: section heading reads "Tooling break — Node and npm"; the Node and npm paragraphs are intact; the **Bundling** subsection is now a one-paragraph forward-reference to Demo 6.7; no mermaid block.

- [ ] **Step 5: Commit (only if anything changed in this task)**

This task is verification-only. If you made any inline fixes (e.g. spotted a typo in one of the new READMEs), commit them with a message like:

```
day_3: polish pass — typo fixes / wording tweaks across new Part 3 beats
```

Otherwise no commit needed.

---

## Final completion check

After Phase 6, this branch should have ~15 new commits on top of the spec commit:

- Phase 1 (Demo 6.2): 2 commits — README, wiring.
- Phase 2 (Demo 6.3): 3 commits — source files, README, wiring.
- Phase 3 (Demo 6.6): 2 commits — README, wiring.
- Phase 4 (Demo 6.7): 4 commits — source files, README, verbal-segments edit, wiring.
- Phase 5 (Demo 6.8): 2 commits — README, wiring.
- Phase 6: 0–1 commits — polish.

The site build must succeed and the full Part 3 prev/next chain (`Demo 6 → 6.2 → 6.3 → 6.5 → 6.6 → 6.7 → 6.8 → Demo 7`) must work end-to-end.
