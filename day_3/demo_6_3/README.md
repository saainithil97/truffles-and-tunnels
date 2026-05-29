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
