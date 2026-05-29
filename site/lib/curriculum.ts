// Curriculum data for the Truffles & Tunnels workshop site.
// All day/demo metadata lives here so pages stay declarative.

export type DemoKind =
  | "embedded" // iframe lives at /live-demos/<id>/ or a public URL
  | "runbook-only" // demo is performed against a real site / in DevTools, no iframe
  | "nextjs-separate"; // separate Vercel deployment, URL via env var

export type Demo = {
  id: string;
  slug: string; // URL slug under /days/3/demos/<slug>
  shortTitle: string; // shown on cards and breadcrumb (e.g. "Demo 1 — Request lifecycle")
  title: string; // full page H1
  summary: string; // one-line description shown on cards + demo page
  readmeSourcePath: string; // path relative to repo root, used by the prebuild copier
  contentFile: string; // file inside site/content/ to read at runtime
  kind: DemoKind;

  // For kind === "embedded":
  //   - iframePath is the URL (relative or absolute) loaded into the iframe.
  //   - iframeEntries lists *all* the runnable HTML pages so we render a tab
  //     picker above the iframe when there's more than one.
  iframePath?: string;
  iframeEntries?: { label: string; path: string }[];
  iframeNote?: string;

  // For kind === "nextjs-separate": env var that holds the deployed URL.
  iframeUrlEnvVar?: string;
  // For kind === "nextjs-separate": optional path suffix appended to the env
  // var's URL. Used when multiple site entries deep-link into different routes
  // of the same deployment. If iframeEntries are also provided, each entry's
  // `path` is treated as a suffix the same way.
  iframePathSuffix?: string;

  // For runbook-only: a short "what you do here" hint shown in place of the iframe.
  runbookHint?: string;

  // Source files to surface as a "Source" section at the bottom of the deck.
  // Files are staged into site/content/day_3/<id>/code/ by copy-content.mjs.
  // `language` is the fence info string used by rehype-highlight.
  sourceFiles?: { name: string; language: string }[];

  // When set, the "Source" section reads its files from another demo's staged
  // code dir (content/day_3/<sourceCodeFromDemo>/code/) instead of this demo's
  // own. Used by runbook-only demos like demo_2 that don't ship their own code
  // but are operating on another demo's page — showing the same source as a
  // tab here is the reference the reader is mutating in DevTools.
  sourceCodeFromDemo?: string;
};

export type DayPart = {
  heading: string;
  demoSlugs: string[]; // references demos by slug; verbal-segments is also a slug here
};

export type Day = {
  num: number;
  title: string;
  blurb: string;
  hasDemos: boolean;
  parts?: DayPart[];
  demos?: Demo[];
};

// ---- Day 3 demos ----

export const day3Demos: Demo[] = [
  {
    id: "demo_1",
    slug: "demo_1",
    shortTitle: "Demo 1 — The request lifecycle",
    title: 'Demo 1 — "What just happened?"',
    summary:
      "A tiny Swiggy card is really six network requests. Open DevTools, hit reload, and watch the browser stitch a page together — HTML, CSS, JS, image — in the order it arrives.",
    readmeSourcePath: "day_3/demo_1/README.md",
    contentFile: "day_3/demo_1.md",
    kind: "embedded",
    iframePath: "/live-demos/demo_1/index.html",
    iframeNote:
      "Open DevTools → Network, then click reload inside the frame (Cmd-R won't refresh the iframe).",
    sourceFiles: [
      { name: "index.html", language: "html" },
      { name: "style.css", language: "css" },
      { name: "app.js", language: "javascript" },
      { name: "server.py", language: "python" },
    ],
  },
  {
    id: "demo_2",
    slug: "demo_2",
    shortTitle: "Demo 2 — The DOM is not the HTML",
    title: 'Demo 2 — "The DOM is not the HTML"',
    summary:
      "What the server sent (View Source) vs what the browser is showing (the Elements tab). Proven by mutating one without touching the other.",
    readmeSourcePath: "day_3/demo_2/README.md",
    contentFile: "day_3/demo_2.md",
    kind: "runbook-only",
    runbookHint:
      "This one runs in the DevTools console — on Demo 1's page above, or any real site. Follow the runbook on the right.",
    // Demo 2 has no source of its own — it operates on Demo 1's page. Showing
    // those same files here lets the reader compare "the text the server sent"
    // (this tab) against "the live DOM" (their Elements panel).
    sourceFiles: [
      { name: "index.html", language: "html" },
      { name: "style.css", language: "css" },
      { name: "app.js", language: "javascript" },
    ],
    sourceCodeFromDemo: "demo_1",
  },
  {
    id: "demo_2_5",
    slug: "demo_2_5",
    shortTitle: "Demo 2.5 — Browser storage",
    title: 'Demo 2.5 — "Your browser is holding your data"',
    summary:
      "Where does your data live in the browser? Cookies go to the server every request; localStorage / sessionStorage never leave. A Swiggy preferences page makes both visible.",
    readmeSourcePath: "day_3/demo_2_5/README.md",
    contentFile: "day_3/demo_2_5.md",
    kind: "embedded",
    iframePath: "/live-demos/demo_2_5/index.html",
    iframeNote:
      "Open DevTools → Application to watch Cookies and Storage update as you click.",
    sourceFiles: [
      { name: "index.html", language: "html" },
      { name: "style.css", language: "css" },
      { name: "app.js", language: "javascript" },
      { name: "server.py", language: "python" },
    ],
  },
  {
    id: "demo_3",
    slug: "demo_3",
    shortTitle: "Demo 3 — Render blocking",
    title: 'Demo 3 — "Why order matters"',
    summary:
      "The same Swiggy page, served three ways — the only difference is where the <script> tag sits. On Slow 3G the cost of getting it wrong is unmissable.",
    readmeSourcePath: "day_3/demo_3/README.md",
    contentFile: "day_3/demo_3.md",
    kind: "embedded",
    iframePath: "/live-demos/demo_3/index.html",
    iframeEntries: [
      { label: "Index (all 3)", path: "/live-demos/demo_3/index.html" },
      { label: "A: blocking in <head>", path: "/live-demos/demo_3/version-a.html" },
      { label: "B: defer in <head>", path: "/live-demos/demo_3/version-b.html" },
      { label: "C: end of <body>", path: "/live-demos/demo_3/version-c.html" },
    ],
    iframeNote:
      "Throttle the iframe with DevTools → Network → Slow 3G, then load each version. Watch which one shows content first.",
    sourceFiles: [
      { name: "version-a.html", language: "html" },
      { name: "version-b.html", language: "html" },
      { name: "version-c.html", language: "html" },
      { name: "slow.js", language: "javascript" },
      { name: "server.py", language: "python" },
    ],
  },
  {
    id: "demo_4",
    slug: "demo_4",
    shortTitle: "Demo 4 — Pure JS hits a wall",
    title: 'Demo 4 — "Pure JS hits a wall"',
    summary:
      "Vanilla works fine for a button. A cart with a topbar badge, three dishes, a subtotal, and a free-delivery banner is five UI surfaces to keep in sync with one piece of state — and vanilla has nothing built in to help. Three pains: state↔UI drift, no composition vocabulary, the DOM punishes hot loops.",
    readmeSourcePath: "day_3/demo_4/README.md",
    contentFile: "day_3/demo_4.md",
    kind: "embedded",
    iframePath: "/live-demos/demo_5/vanilla-full.html",
    iframeNote:
      "Click Add then + a few times. The DOM-writes counter at the top shows ~17 writes per click — the vanilla cart updates every UI surface every time. The full scroll-thrash demo lives at day_3/demo_4/ if you want to feel Beat 3.",
    sourceFiles: [
      { name: "vanilla-full.html", language: "html" },
    ],
    sourceCodeFromDemo: "demo_5",
  },
  {
    id: "demo_5",
    slug: "demo_5",
    shortTitle: "Demo 5 — The shape of the solution",
    title: 'Demo 5 — "The shape of every library that fixes this"',
    summary:
      "React, Vue, Svelte, Solid all answer Demo 4's three problems with the same contract: describe state → UI, the library does the sync. Three side-by-side snippets for the syntax, three mechanisms for the diff, one React rewrite of the vanilla cart — 17 writes → 3.",
    readmeSourcePath: "day_3/demo_5/README.md",
    contentFile: "day_3/demo_5.md",
    kind: "embedded",
    iframePath: "/live-demos/demo_5/react.html",
    iframeEntries: [
      { label: "React", path: "/live-demos/demo_5/react.html" },
      { label: "Vanilla (full, for comparison)", path: "/live-demos/demo_5/vanilla-full.html" },
      { label: "Vanilla (simple)", path: "/live-demos/demo_5/vanilla-simple.html" },
    ],
    iframeNote:
      "React tab is the worked example. Flip to vanilla-full to compare the DOM-writes counter side-by-side: ~3 in React, ~17 in vanilla. Each file runs standalone — React is vendored locally, no server.",
    sourceFiles: [
      { name: "react.html", language: "html" },
      { name: "vanilla-full.html", language: "html" },
      { name: "vanilla-simple.html", language: "html" },
    ],
  },
  {
    id: "demo_6",
    slug: "demo_6",
    shortTitle: "Demo 6 — How the pieces plug in",
    title: 'Demo 6 — "How the pieces actually plug in"',
    summary:
      "React, Vue, Solid, Svelte all own one column — rendering — and leave the rest to you. The inversion-of-control test, the universal \"what they don't ship\" table, the <script>-tag proof, and the trade you're actually making when you reach for one.",
    readmeSourcePath: "day_3/demo_6/README.md",
    contentFile: "day_3/demo_6.md",
    kind: "embedded",
    iframePath: "/live-demos/demo_6/index.html",
    iframeEntries: [
      { label: "<script>-tag React app", path: "/live-demos/demo_6/index.html" },
      { label: "JSX → object playground", path: "/live-demos/demo_6/jsx-vs-compiled.html" },
    ],
    iframeNote:
      "View Source on the <script>-tag app: three script tags + one component. Open DevTools → Network to see React load from unpkg.com. Flip to the playground tab to step through how JSX compiles to createElement to a plain object.",
    sourceFiles: [
      { name: "index.html", language: "html" },
      { name: "style.css", language: "css" },
      { name: "jsx-vs-compiled.html", language: "html" },
    ],
  },
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
  {
    id: "demo_6_6",
    slug: "demo_6_6",
    shortTitle: "Demo 6.6 — Intro to Next.js",
    title: 'Demo 6.6 — "The framework around React"',
    summary:
      "Next.js is the framework option for React: file-based routing, a bundler, a dev server, an SSR host, and <Link>-style SPA navigation, all packaged. One realisation of the framework class — Nuxt does the same for Vue, SvelteKit for Svelte, SolidStart for Solid. The homepage of the Swiggy Next app that Demos 6.7, 7, and 8 dissect.",
    readmeSourcePath: "day_3/demo_6_6/README.md",
    contentFile: "day_3/demo_6_6.md",
    kind: "nextjs-separate",
    iframeUrlEnvVar: "NEXT_PUBLIC_DEMO_7_URL",
    iframePathSuffix: "/",
    iframeNote:
      "Click the four cards inside the iframe — every nav is a Link, no full reload. Pop the iframe out to see real URLs.",
  },
  {
    id: "demo_6_7",
    slug: "demo_6_7",
    shortTitle: "Demo 6.7 — What a bundler actually does",
    title: 'Demo 6.7 — "Bundling, splitting, tree shaking"',
    summary:
      "Demo 6.6 handed you Next as a complete package — including a bundler. This demo opens the bundler hood: the engine inside Next, inside Vite, inside every real frontend stack. Real lodash size numbers (~70 KB vs ~2 KB), tree shaking, route-level splitting, React.lazy in five lines.",
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
  {
    id: "demo_7",
    slug: "demo_7",
    shortTitle: "Demo 7 — SSG, SSR, CSR",
    title: 'Demo 7 — "Three routes, three rendering strategies, each in its rightful habitat"',
    summary:
      "A menu (SSG — same for everyone, frozen at build), a personalised \"near you\" feed (SSR — fresh per request), and your cart (CSR — empty shell, browser fills it in). Each route is the canonical example for its strategy. View Source on each is the X-ray.",
    readmeSourcePath: "day_3/demo_7_8_nextjs/demo_7.md",
    contentFile: "day_3/demo_7.md",
    kind: "nextjs-separate",
    iframeUrlEnvVar: "NEXT_PUBLIC_DEMO_7_URL",
    iframePathSuffix: "/menu",
    iframeEntries: [
      { label: "/menu (SSG)", path: "/menu" },
      { label: "/feed (SSR)", path: "/feed" },
      { label: "/cart (CSR)", path: "/cart" },
    ],
    iframeNote:
      "View Source on each route to feel the difference. Iframes hide View Source — click the ↗ button to pop the demo into its own tab first.",
  },
  {
    id: "demo_8",
    slug: "demo_8",
    shortTitle: "Demo 8 — Server vs client components",
    title: 'Demo 8 — "The boundary, not the switch"',
    summary:
      "/detail — a restaurant detail page with a server-rendered menu (every dish in the HTML, zero JS) plus two small client islands: a search-within-menu input and per-item Add-to-cart buttons. Server trunk, client leaves. Slow 3G makes the hydration gap visible.",
    readmeSourcePath: "day_3/demo_7_8_nextjs/demo_8.md",
    contentFile: "day_3/demo_8.md",
    kind: "nextjs-separate",
    iframeUrlEnvVar: "NEXT_PUBLIC_DEMO_7_URL",
    iframePathSuffix: "/detail",
    iframeNote:
      "Throttle to Slow 3G, hard-refresh, and try typing into the search box. The hydration gap is the dead window between paint and interactivity.",
  },
  {
    id: "demo_9",
    slug: "demo_9",
    shortTitle: "Demo 9 — Lighthouse & Core Web Vitals",
    title: 'Demo 9 — "What are you actually shipping?"',
    summary:
      "How to measure a real frontend. Lighthouse, LCP, INP, CLS — what each one means and what moves it.",
    readmeSourcePath: "day_3/demo_9/README.md",
    contentFile: "day_3/demo_9.md",
    kind: "runbook-only",
    runbookHint:
      "Lighthouse runs in your local Chrome — DevTools → Lighthouse → Analyze page load. Pick a real site you use.",
  },
  {
    id: "demo_10",
    slug: "demo_10",
    shortTitle: "Demo 10 — XSS & CORS",
    title: 'Demo 10 — "Don\'t trust the user, don\'t trust the page"',
    summary:
      "A live XSS via innerHTML on a Swiggy reviews page (and the safe textContent path), plus a CORS error in the console — the two frontend-security ideas every dev needs.",
    readmeSourcePath: "day_3/demo_10/README.md",
    contentFile: "day_3/demo_10.md",
    kind: "embedded",
    iframePath: "/live-demos/demo_10/index.html",
    iframeNote:
      "Try posting a review with <img src=x onerror=alert(1)>. It runs on the UNSAFE side, prints as text on the SAFE side. Open the console for the CORS error.",
  },
  {
    id: "wrap",
    slug: "wrap",
    shortTitle: "Day 3 wrap — Frontend at scale",
    title: 'Day 3 wrap — "Frontend at scale, what we couldn\'t fit"',
    summary:
      "A live audit of swiggy.com in DevTools plus three production patterns we didn't have room for as full demos: skeleton screens, optimistic updates, and error boundaries.",
    readmeSourcePath: "day_3/wrap/README.md",
    contentFile: "day_3/wrap.md",
    kind: "embedded",
    iframePath: "/live-demos/wrap/skeletons.html",
    iframeEntries: [
      { label: "Skeletons", path: "/live-demos/wrap/skeletons.html" },
      { label: "Optimistic", path: "/live-demos/wrap/optimistic.html" },
      { label: "Error boundary", path: "/live-demos/wrap/boundary.html" },
    ],
    iframeNote:
      "Three mini-demos in tabs. For the Swiggy audit itself, open swiggy.com in a separate tab and follow the cheat sheet on the right.",
  },
];

// Verbal segments page is treated like a demo for routing purposes.
export const verbalSegments: Demo = {
  id: "verbal-segments",
  slug: "verbal-segments",
  shortTitle: "Verbal segments",
  title: "Verbal segments — the spoken interludes",
  summary:
    "The non-demo bits — Node / npm / bundling, the platform tour of browser APIs, CSS & styling, and the homework brief.",
  readmeSourcePath: "day_3/verbal-segments.md",
  contentFile: "day_3/verbal-segments.md",
  kind: "runbook-only",
  runbookHint:
    "Read these alongside the demos — they're the conceptual glue, not labs.",
};

// Day 3 parts mirror the exact headings from day_3/README.md.
export const day3Parts: DayPart[] = [
  {
    heading: "Part 1 — The browser as a platform",
    demoSlugs: ["demo_1", "demo_2", "demo_3", "demo_2_5", "verbal-segments"],
  },
  {
    heading: "Part 2 — Why do we need React (or other libraries)?",
    demoSlugs: ["demo_4", "demo_5", "demo_6", "verbal-segments"],
  },
  {
    heading: "Part 3 — Single-Page Apps",
    demoSlugs: ["demo_6_5", "demo_6_6", "demo_6_7"],
  },
  {
    heading: "Part 4 — Rendering strategies",
    demoSlugs: ["demo_7", "demo_8"],
  },
  {
    heading: "Part 5 — Perf, security, and the real world",
    demoSlugs: ["demo_9", "demo_10", "wrap"],
  },
];

export const days: Day[] = [
  {
    num: 1,
    title: "Swiggy case study & how the web works",
    blurb:
      "We walk through the lifecycle of a typical web app via a Swiggy case study — how a request leaves your phone, what happens at the server, and what a user actually sees come back. The foundation everything else builds on.",
    hasDemos: false,
  },
  {
    num: 2,
    title: "Intro to Git and Vercel",
    blurb:
      "Source control with Git and GitHub, working with branches and pull requests, and shipping a real site to the internet by deploying to Vercel. The toolchain a working web developer lives in.",
    hasDemos: false,
  },
  {
    num: 3,
    title: "Demystifying the Frontend",
    blurb:
      "A sequence of short, mind-bending demos that take the black box of “a web page” apart. Each demo is self-contained and builds on the last. The running example stays on the course spine — the Swiggy restaurant card from Day 1.",
    hasDemos: true,
    parts: day3Parts,
    demos: day3Demos,
  },
];

export function findDay3Item(slug: string): Demo | undefined {
  if (slug === "verbal-segments") return verbalSegments;
  return day3Demos.find((d) => d.slug === slug);
}

export function allDay3Slugs(): string[] {
  return [...day3Demos.map((d) => d.slug), "verbal-segments"];
}
