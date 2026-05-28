// Curriculum data for the Truffles & Tunnels workshop site.
// All day/demo metadata lives here so pages stay declarative.

export type DemoKind =
  | "python-server"
  | "static-html"
  | "runbook-only"
  | "nextjs-separate";

export type Demo = {
  id: string;
  slug: string; // URL slug under /days/3/demos/<slug>
  title: string; // H1 from the demo README (quoted name)
  summary: string; // one-line description shown on cards + demo page
  readmeSourcePath: string; // path relative to repo root, used by the prebuild copier
  contentFile: string; // file inside site/content/ to read at runtime
  kind: DemoKind;
  htmlEntries?: string[]; // for static-html demos: HTML files served from /live-demos/<id>/
  liveDemoBase?: string; // public path prefix for static demos
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
    title:
      'Day 3, Demo 1 — "What just happened?" (The request lifecycle)',
    summary:
      "How a browser loads a page (DNS → HTTP → parse → render), shown via the Network tab and a Slow 3G reload of a single Swiggy card that turns out to be six requests.",
    readmeSourcePath: "day_3/demo_1/README.md",
    contentFile: "day_3/demo_1.md",
    kind: "python-server",
  },
  {
    id: "demo_2",
    slug: "demo_2",
    title: 'Day 3, Demo 2 — "The DOM is not the HTML"',
    summary:
      "HTML (what the server sent) vs the DOM (the live browser tree). The View Source stays frozen while JavaScript mutates the DOM.",
    readmeSourcePath: "day_3/demo_2/README.md",
    contentFile: "day_3/demo_2.md",
    kind: "runbook-only",
  },
  {
    id: "demo_2_5",
    slug: "demo_2_5",
    title:
      'Day 3, Demo 2.5 — "Your browser is holding your data" (Storage)',
    summary:
      "Where the browser stores your data — cookies (sent to the server every request) vs localStorage / sessionStorage (never leave the browser).",
    readmeSourcePath: "day_3/demo_2_5/README.md",
    contentFile: "day_3/demo_2_5.md",
    kind: "python-server",
  },
  {
    id: "demo_3",
    slug: "demo_3",
    title: 'Day 3, Demo 3 — "Why order matters" (Render blocking)',
    summary:
      "Why the position of a <script> tag determines whether your page is blank for seconds. The same Swiggy page, three ways.",
    readmeSourcePath: "day_3/demo_3/README.md",
    contentFile: "day_3/demo_3.md",
    kind: "python-server",
  },
  {
    id: "demo_4",
    slug: "demo_4",
    title:
      'Day 3, Demo 4 — "The expensive DOM" (Layout, reflow, and paint)',
    summary:
      "Why per-element DOM updates are expensive — 500 restaurant tiles, slow loop vs batched update, timed live.",
    readmeSourcePath: "day_3/demo_4/README.md",
    contentFile: "day_3/demo_4.md",
    kind: "python-server",
  },
  {
    id: "demo_5",
    slug: "demo_5",
    title:
      'Day 3, Demo 5 — "This is why React exists" (Imperative vs Declarative)',
    summary:
      "How a clean vanilla-JS filter tangles as a PM adds features, then the same thing in React.",
    readmeSourcePath: "day_3/demo_5/README.md",
    contentFile: "day_3/demo_5.md",
    kind: "static-html",
    htmlEntries: ["vanilla-simple.html", "vanilla-full.html", "react.html"],
    liveDemoBase: "/live-demos/demo_5",
  },
  {
    id: "demo_6",
    slug: "demo_6",
    title:
      'Day 3, Demo 6 — "What React actually does" (Virtual DOM, JSX, Reconciliation)',
    summary:
      "What React actually does — JSX → createElement → plain objects; the diff makes the minimal DOM update.",
    readmeSourcePath: "day_3/demo_6/README.md",
    contentFile: "day_3/demo_6.md",
    kind: "static-html",
    htmlEntries: ["jsx-vs-compiled.html"],
    liveDemoBase: "/live-demos/demo_6",
  },
  {
    id: "demo_7_8_nextjs",
    slug: "demo_7_8_nextjs",
    title:
      "Day 3, Demos 7 / 8 / 8.5 — Rendering strategies, hydration & client-side routing",
    summary:
      "The same Swiggy page rendered three ways (SSG, SSR, CSR), plus hydration and client-side routing. One real Next.js app — the homework stack.",
    readmeSourcePath: "day_3/demo_7_8_nextjs/README.md",
    contentFile: "day_3/demo_7_8_nextjs.md",
    kind: "nextjs-separate",
  },
  {
    id: "demo_9",
    slug: "demo_9",
    title:
      'Day 3, Demo 9 — "What are you actually shipping?" (Performance & Core Web Vitals)',
    summary:
      "How to measure frontend performance — Lighthouse, LCP / INP / CLS.",
    readmeSourcePath: "day_3/demo_9/README.md",
    contentFile: "day_3/demo_9.md",
    kind: "runbook-only",
  },
  {
    id: "demo_10",
    slug: "demo_10",
    title:
      'Day 3, Demo 10 — "Don\'t trust the user, don\'t trust the page" (Frontend security)',
    summary:
      "The two security ideas every frontend dev needs — XSS (a live innerHTML exploit) and CORS.",
    readmeSourcePath: "day_3/demo_10/README.md",
    contentFile: "day_3/demo_10.md",
    kind: "python-server",
  },
];

// Verbal segments page is treated like a demo for routing purposes.
export const verbalSegments: Demo = {
  id: "verbal-segments",
  slug: "verbal-segments",
  title: "Day 3 — Verbal segments",
  summary:
    "The spoken interludes — Node / npm / bundling, the platform tour of browser APIs, CSS & styling, and the homework brief.",
  readmeSourcePath: "day_3/verbal-segments.md",
  contentFile: "day_3/verbal-segments.md",
  kind: "runbook-only",
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
    demoSlugs: ["demo_6", "verbal-segments"],
  },
  {
    heading: "Parts 4–5 — Rendering strategies, hydration, routing",
    demoSlugs: ["demo_7_8_nextjs"],
  },
  {
    heading: "Part 6 — Security, performance, and the platform",
    demoSlugs: ["demo_9", "demo_10"],
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
