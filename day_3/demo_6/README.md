# Day 3, Demo 6 — "What React actually does" (Virtual DOM, JSX, Reconciliation)

Companion artifacts for the sixth demo of Day 3. Full design:
`../docs/superpowers/specs/2026-05-28-day3-demo6-virtual-dom-design.md`.

Demo 5 sold *why* React exists (declarative beats imperative as features pile
up). This demo opens the hood. Three beats:

> **JSX** is sugar — Babel compiles it to `React.createElement(...)` calls, which
> return **plain JavaScript objects** (`{ type, props }`). A tree of those
> objects is the **virtual DOM**: just data in memory, cheap to create and diff.
> When state changes, React builds a fresh tree, **diffs** it against the old one
> (reconciliation), and touches only the real DOM nodes that actually changed.

## What's here

- `jsx-vs-compiled.html` — renders a `RestaurantCard` and shows the
  **JSX → `createElement` → plain object** progression on the page, and logs a
  real React element to the **Console** so you can expand it in DevTools and see
  it's just data. (Vendored React + Babel.)
- `vendor/` — React 18, ReactDOM 18, Babel-standalone, **vendored locally** so
  the page runs offline.
- The **reconciliation** beat reuses **Demo 5's** `react.html`
  (`../demo_5/react.html`) — no new file needed; that page already logs each
  card render.

## Setup & run

**No server, no build step** — open the file directly:

```bash
open day_3/demo_6/jsx-vs-compiled.html      # JSX / vDOM beat
open day_3/demo_5/react.html                # reconciliation beat (Demo 5's page)
```

JSX is compiled in the browser by Babel and lives **inline** in the page (so
`file://` doesn't fetch an external script and trip CORS). Have the **Console**
and **React DevTools** ready.

## Demo flow

### 0. Slido (before anything)

> "You change **one restaurant's name** in a list of **1000**. How many DOM nodes
> should *ideally* update?"

The answer is **one**. Most expect "the whole list re-renders." Hold the answer;
the reconciliation beat (section 3) pays it off.

### 1. JSX is not magic — it's a function call

Open `jsx-vs-compiled.html`. The `RestaurantCard` renders at the top. Then walk
the three-form panel and the source:

- **JSX** is what you *write* — looks like HTML, but it's JavaScript.
- **Babel compiles** every JSX tag into a `React.createElement(type, props,
  …children)` call. Show `RestaurantCard` next to the hand-written
  `RestaurantCardCompiled` — identical output, no JSX sugar.
- `createElement` **returns a plain object**: `{ type, props }`.

In the **Console**, expand the logged element:

> "That's it — a React element is a plain JavaScript object. No DOM yet, no
> screen yet. Just `type` and `props`, with `children` nested inside. A whole
> **tree** of these is the virtual DOM — data in memory, cheap to build and cheap
> to compare."

### 2. TSX in 30 seconds (types catch the bug before the browser)

You don't need to run anything — just say it (sketch on a slide or talk over the
JSX):

> "In a real project this is **TSX** — JSX with TypeScript. You'd type the props:
> `type Props = { title: string }`. If you then write `<Card title={42} />`,
> passing a number where a string is expected, the **compiler** flags it before
> the code ever reaches the browser. JSX gives you the components; TS gives you a
> safety net at build time."

### 3. Reconciliation — the diff that gatekeeps the DOM (reuse Demo 5)

Open **Demo 5's** `react.html` (`../demo_5/react.html`). This is the Swiggy
search; each `RestaurantCard` has a `console.log` in it already.

**(a) The component re-runs every keystroke.** Open the **Console** and type a
letter in the search box. Watch the flood of `render RestaurantCard:` logs — the
function runs for the visible cards on *every* keystroke.

> "So React re-runs your components constantly. If that meant rebuilding the page
> each time, it'd be slower than vanilla. It isn't — because re-running the
> component only rebuilds the *virtual* DOM (cheap objects). The real DOM is
> touched separately."

**(b) The diff touches only what changed.** Install **React DevTools** (Chrome
extension) ahead of time.

- **Profiler** (React DevTools tab): hit record, type one letter, stop. It shows
  *which* components re-rendered — and how the committed DOM work is far smaller
  than the render count.
- **Paint flashing** (DevTools → Cmd+Shift+P → "Show paint flashing rectangles",
  or Rendering tab → Paint flashing): type into the box and watch — only the list
  items whose text actually changed **flash green**. The unchanged rows don't
  repaint.

> "The component re-ran for every card, but the browser only repainted the ones
> that changed. That gap is **reconciliation**: React diffed the new virtual-DOM
> tree against the old one and applied the *minimal* set of real-DOM updates.
> Re-running the component is cheap; touching the real DOM is expensive — so
> React gatekeeps the expensive part."

### 4. Pay off the Slido

> "Back to the question — one name change in a list of 1000. React re-runs the
> components and builds a new virtual tree, but the diff finds that exactly one
> text node differs. So **one** DOM node updates. That's the whole game: you
> describe the UI declaratively (Demo 5), and the virtual-DOM diff makes it
> *cheap*."

## Pre-session checklist

- [ ] `vendor/` has all three files at non-trivial size: `react.development.js`
      (~110 KB), `react-dom.development.js` (~1.1 MB), `babel.min.js` (~3.1 MB).
- [ ] `jsx-vs-compiled.html` opens; the card renders; the three-form panel shows;
      the Console logs an expandable React element object.
- [ ] **React DevTools** extension installed and the **Components** + **Profiler**
      tabs appear.
- [ ] On `../demo_5/react.html`: typing floods the Console with render logs;
      Profiler records a keystroke; **Paint flashing** flashes only changed rows.
      Practised once.
- [ ] Tested `jsx-vs-compiled.html` once with Wi-Fi **off** to confirm the
      vendored files make it run offline.

## Notes for the live session

- This is a **local, screen-shared** demo — open the files directly, no server.
- The reconciliation beat depends on Demo 5 being intact; don't move or rename
  `../demo_5/react.html` before the session.
