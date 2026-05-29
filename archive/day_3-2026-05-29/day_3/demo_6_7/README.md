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

## Content

### What bundling actually is

<p class="beat__lede">The browser doesn't know what <code>import { useState } from 'react'</code> means. The bundler is the thing that turns your hundreds of files of <code>import</code> statements into a small handful of files the browser can actually load.</p>

- You write code in many files using `import` and `export`.
- A bundler (Vite, webpack, Turbopack, Rollup, esbuild, Parcel — pick one) starts at your entry point.
- It walks the import graph: this file imports that one, which imports the next, which imports a thing from `node_modules/react/index.js`, and so on.
- It compiles JSX/TypeScript to plain JavaScript along the way (with SWC, esbuild, or Babel).
- It bundles the graph into one or more chunks of JavaScript the browser can `<script src="…">` directly.

That's the whole job. The output is what the browser actually loads.

### Tree shaking, in one paragraph

<p class="beat__lede">A bundler can drop code you didn't use, because ES modules are statically analyzable.</p>

- `import map from 'lodash/map'` — the bundler sees you imported one function; it ships that function's code only.
- `import _ from 'lodash'` followed by `_.map(...)` — the bundler can't easily prove which methods you used; it has to ship the whole library to be safe. That's why the iframe shows 70 KB vs 2 KB.
- It only works with ES modules (`import`/`export`), not with CommonJS `require()`. Modern libraries are ESM-friendly; older ones can defeat tree shaking.
- The practical takeaway: **import what you use, not the namespace**. `import { debounce } from 'lodash-es'` over `import _ from 'lodash'`. Your bundle is happier.

### Code splitting, in one paragraph

<p class="beat__lede">Instead of one giant bundle, the bundler can split into chunks so the browser downloads only what the current page needs.</p>

- **Route-level** (Next: automatic): each route is its own chunk. Visiting `/foo` doesn't download `/bar`'s code. The iframe's routes table shows this — each route has a different "Size" column.
- **Component-level** (`React.lazy`): you tell the bundler "this component is a dynamic import; split it into its own chunk." The bundler obliges. React provides `Suspense` to render a fallback while the chunk loads. Five lines, no framework needed.
- **What this buys you:** smaller first-load JS. The user only pays for what they need to see *right now*. Heavy admin panels, modal dialogs, fancy editors — load on demand, not on first paint.

### Why this is in Part 3, not in the performance section

<p class="beat__lede">Bundlers are framing, not just optimization.</p>

- **It's the difference between "React is a library" and "React in a real app."** Without a bundler, you're in the world of Demo 6.3 — perfect for widgets, useless for anything serious. With a bundler, you have the rest of npm.
- **It explains Demo 8's badges.** "🟢 Server (0 KB JS)" only means something if you know what the bundle is. Server components are an aggressive form of code-splitting where the split happens at the runtime boundary, not at an `import` statement.
- **Performance work in Demo 9 builds on this.** "Reduce LCP" usually means "reduce bundle size and reduce server work." If you don't know what's in the bundle, you can't reduce it.

### Going deeper — Vite is the default plain-React story now

<p class="beat__lede">If you're building a React app that isn't Next, you're probably using Vite. Worth knowing.</p>

- **Vite** = `create-react-app`'s replacement. `npm create vite@latest` scaffolds a React + TypeScript + Vite project in seconds.
- It uses **esbuild** for development (millisecond bundle times) and **Rollup** for production (good tree shaking).
- It does *not* do SSR/SSG out of the box like Next — for those you reach for a Vite-based meta-framework (Astro, Remix, TanStack Start) or you go to Next.
- The "React without Next" world is real and common: internal admin apps, embedded widgets, React inside a non-Node backend (Django, Rails). Vite owns that space.

### Stretch goal — reproduce the lodash numbers yourself

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
