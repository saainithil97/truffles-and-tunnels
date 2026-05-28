# Day 3 — Verbal segments & wrap-up

Speaker notes for the spoken interludes between the Day-3 demos, plus the
homework brief. No code, no Slido — these are the "talk to the room" beats that
stitch the demos together. Swiggy spine throughout.

---

## 1. The Tooling Break — Node, npm, and Bundling

*(after Demo 6 — the virtual-DOM demo)*

You've been writing JavaScript that runs **in the browser** all day. Now meet the
plumbing that gets it there.

**Node.js.** JavaScript's engine is V8 — the thing inside Chrome that runs your
scripts. Node is **V8 pulled out of the browser** and given access to the
filesystem and the network, so JavaScript can run as a server-side program.
That's not abstract: when you ran `next dev` this morning, you started a **Node
process**. Your dev server *is* Node. There's no browser involved until you open
the tab.

**npm + `package.json` + `node_modules`.** npm is the package registry — the App
Store for JavaScript libraries. `package.json` is your project's manifest: it
lists the dependencies you asked for, by name and version. When you run
`npm install`, npm reads that list, downloads each library *and everything those
libraries depend on*, and dumps the whole tree into `node_modules`.

> "Open `node_modules` once and you'll see **50,000 files** for a basic app.
> Don't panic — that's normal, it's just every dependency-of-a-dependency. And
> **don't commit it** — it's in `.gitignore` for a reason. `package.json` is the
> recipe; `node_modules` is the groceries. You ship the recipe; anyone can
> re-fetch the groceries with `npm install`."

**Bundling.** Here's the problem. In your code you write `import { Button } from
'./button'` and `import React from 'react'`. The **browser can't follow those** —
it has no idea where `./button` lives on disk, and it certainly can't go rummaging
through `node_modules`. So before the browser ever sees your code, a **bundler**
(Next.js uses **Turbopack**) starts at your entry point, **traces every import**
into a dependency graph, and stitches it all into a few files the browser *can*
load.

Three things the bundler does along the way:

1. **Compilation** — your JSX/TSX isn't valid JavaScript. The bundler runs it
   through **SWC** to turn `<Card />` into plain function calls the browser
   understands.
2. **Code splitting** — it doesn't ship one giant file. It cuts **per-route
   chunks** so visiting `/restaurants` only downloads the code that page needs.
3. **Tree shaking** — if you import one function from a library and use none of
   the rest, the bundler **strips the unused code** so it never ships.

> "Next.js does all of this **automatically** — you will never hand-configure a
> bundler in this course. But understanding what it's doing is exactly how you
> diagnose a slow production page: a fat bundle, a route that wasn't split, dead
> code that didn't get shaken out."

---

## 2. The Platform Tour — "Your browser can do all of this"

*(rapid-fire, ~3 minutes — one Swiggy-flavored sentence each)*

The browser isn't just a document viewer. It's an application runtime with a huge
built-in API surface. A whirlwind tour — none of these need a library:

- **Geolocation** — "How does Swiggy know your location the second you open the
  app? `navigator.geolocation` — the browser asks you for permission and hands
  the page your coordinates."
- **Notifications** — "That 'Your order is on the way' banner that pops even when
  the tab isn't focused — the Notifications API."
- **WebSockets** — "Swiggy **live order tracking**, support chat, a stock
  ticker — a two-way pipe that stays open so the server can push updates the
  instant they happen, no refresh."
- **Intersection Observer** — "Scrolling the restaurant list and images load just
  as they come into view? That's **lazy-loading** with Intersection Observer —
  the browser tells you when an element enters the viewport."
- **Canvas / WebGL** — "The delivery **map**, charts, games, any pixel-level
  dataviz — the browser hands you a drawing surface."
- **Service Workers** — "**Offline mode.** A script that sits between your app
  and the network, caches everything, and serves the cached app when the train
  goes through a tunnel."
- **Web Workers** — "Heavy computation — sorting 10,000 restaurants, crunching a
  big payload — moved **off the main thread** so the UI stays responsive and
  doesn't freeze while it runs."

> "You don't need to learn all of these today. The point is: before you reach for
> a library, check whether **the browser already does it.** It usually does."

---

## 3. CSS & Styling — Enough to Build

*(~5 minutes)*

You don't need to master CSS today. You need just enough to build the homework
and to debug a layout when it goes sideways.

**The box model.** Every element on the page is a box, and every box has four
layers, from the inside out: **content → padding → border → margin.** Content is
the text/image; padding is space *inside* the border; border is the line; margin
is space *outside*, pushing other boxes away.

> "Open DevTools → **Elements** → hover an element, and you'll see the box-model
> diagram — content in blue, padding green, margin orange. **Every layout bug you
> will ever hit comes back to this picture.** 'Why is there a gap there?' Margin.
> 'Why is the text touching the edge?' No padding. Learn to read this diagram and
> half of CSS debugging is done."

**Flexbox.** A one-dimensional layout — a **row or a column**. It's how you line
things up and, crucially, how you center things (the eternal CSS struggle):

```css
display: flex;
align-items: center;      /* center on the cross axis */
justify-content: center;  /* center on the main axis */
```

> "Those three lines center anything inside anything. Memorize them."

**Grid.** Flexbox's two-dimensional sibling — **rows AND columns at once.** When
you build the restaurant listing in the homework, that wall of cards is a
**grid**: define your columns, drop the cards in, and they flow into a neat
responsive matrix.

**Tailwind.** Instead of writing CSS in a separate file, Tailwind gives you
**utility classes you put directly on the element**: `flex items-center p-4
bg-gray-100`. Each class is one tiny style — `p-4` is padding, `flex` is
`display:flex`, and so on.

> "It looks ugly and wrong the first time — *'why is there a paragraph of class
> names on my div?'* — but it works great, you stop inventing class names, and
> the styles live right next to the markup. You'll use it in the homework."

> "Bottom line: **don't try to master CSS today.** Use AI to generate your
> styles — it's genuinely good at it. But understand the **box model** and
> **Flexbox** yourself, because those are the two things you'll need to *debug*
> what the AI gives you."

---

## 4. Homework & Wrap-up

*(Swiggy-themed)*

### The 60-second full-arc recap

Let's replay the whole day in one breath.

> "You type a URL. The browser makes a **request**, gets HTML back, and parses it
> into the **DOM** — a tree of objects. It applies your CSS to **style** that
> tree, runs **layout** to figure out where every box goes, then **paints**
> pixels to the screen. **JavaScript** can reach in and mutate the DOM — but
> every change forces the browser to re-layout and re-paint, and that's
> **expensive**. So **React** keeps a lightweight copy — the **virtual DOM** —
> diffs the new version against the old, and tells the real DOM only the
> **minimal** set of changes. That's why React feels fast.
>
> Then *where* the HTML gets built: **SSG** builds it once at **deploy** time,
> **SSR** builds it per **request** on the server, **CSR** builds it in the
> **browser** after an empty shell loads. **Next.js mixes all three** on the same
> site — **server components** for data-fetching and static content, **client
> components** for interactivity. Your first load arrives **server-rendered** so
> it's fast and crawlable, then React **hydrates** it in the browser so it
> becomes interactive. That's the whole day."

### The homework — a Swiggy-style restaurant discovery app

Build it in **Next.js (App Router)**, deploy it to **Vercel**, hand in a **live
URL.**

What it needs:

- A **restaurant listing page** — a **grid of cards**, each with an
  emoji/placeholder poster, the restaurant name, its cuisines, a rating, and a
  delivery time.
- **Hardcoded data** — use the **15-restaurant dataset** (no backend, no
  database; just an array in the code).
- A **restaurant detail page** at **`/restaurants/[id]`** — click a card, land on
  that restaurant's page.
- **Styled with Tailwind.**
- **Deployed to Vercel** with a working public link.

> "Use AI freely to generate the code. But there's a catch — for **every piece**
> of code it gives you, you must be able to answer three questions:
> **What rendering strategy is this page — SSG, SSR, or CSR? Is this a server
> component or a client component? Where does the HTML actually get built?**
> If you can't answer those, you don't understand what you shipped — and that's
> the entire point of today."

I'll push a **reference implementation to the Day-3 branch** after the session,
so you can check your answers against mine. Don't peek until you've tried it.
