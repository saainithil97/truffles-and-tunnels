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
