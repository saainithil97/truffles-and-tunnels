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

  // For runbook-only: a short "what you do here" hint shown in place of the iframe.
  runbookHint?: string;

  // Source files to surface as a "Source" section at the bottom of the deck.
  // Files are staged into site/content/day_3/<id>/code/ by copy-content.mjs.
  // `language` is the fence info string used by rehype-highlight.
  sourceFiles?: { name: string; language: string }[];
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
  },
  {
    id: "demo_4",
    slug: "demo_4",
    shortTitle: "Demo 4 — The expensive DOM",
    title: 'Demo 4 — "The expensive DOM"',
    summary:
      "500 restaurant tiles. A per-element update loop thrashes layout; a batched update flies. The problem React was built to solve, timed live.",
    readmeSourcePath: "day_3/demo_4/README.md",
    contentFile: "day_3/demo_4.md",
    kind: "embedded",
    iframePath: "/live-demos/demo_4/index.html",
    iframeNote:
      "Click 'Slow update' and 'Fast update' and read the timing in the badge. Try DevTools → Performance to see the layout/paint bars.",
  },
  {
    id: "demo_5",
    slug: "demo_5",
    shortTitle: "Demo 5 — Why React exists",
    title: 'Demo 5 — "This is why React exists"',
    summary:
      "A clean vanilla-JS search/filter that tangles as features pile on. Then the same thing in React: state changes, the UI follows.",
    readmeSourcePath: "day_3/demo_5/README.md",
    contentFile: "day_3/demo_5.md",
    kind: "embedded",
    iframePath: "/live-demos/demo_5/vanilla-simple.html",
    iframeEntries: [
      { label: "Vanilla (simple)", path: "/live-demos/demo_5/vanilla-simple.html" },
      { label: "Vanilla (full)", path: "/live-demos/demo_5/vanilla-full.html" },
      { label: "React", path: "/live-demos/demo_5/react.html" },
    ],
    iframeNote:
      "Each file runs standalone — React is vendored locally, no server. Compare how each version handles state.",
  },
  {
    id: "demo_6",
    slug: "demo_6",
    shortTitle: "Demo 6 — Virtual DOM & JSX",
    title: 'Demo 6 — "What React actually does"',
    summary:
      "JSX is just sugar. The Babel side-by-side shows JSX → createElement → plain objects, and React's diff turns that into the minimal real-DOM update.",
    readmeSourcePath: "day_3/demo_6/README.md",
    contentFile: "day_3/demo_6.md",
    kind: "embedded",
    iframePath: "/live-demos/demo_6/jsx-vs-compiled.html",
    iframeNote:
      "Edit the JSX on the left; watch the compiled createElement and the resulting tree update on the right.",
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
    demoSlugs: ["demo_1", "demo_2", "demo_2_5", "demo_3"],
  },
  {
    heading: "Part 2 — Why frameworks exist",
    demoSlugs: ["demo_4", "demo_5"],
  },
  {
    heading: "Part 3 — React and the modern frontend",
    demoSlugs: ["demo_6", "demo_6_5", "verbal-segments"],
  },
  {
    heading: "Parts 4–5 — Rendering strategies, hydration, routing",
    demoSlugs: ["demo_7_8_nextjs"],
  },
  {
    heading: "Part 6 — Security, performance, and the platform",
    demoSlugs: ["demo_9", "demo_10"],
  },
  {
    heading: "Wrap — Frontend at scale",
    demoSlugs: ["wrap"],
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
