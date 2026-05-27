# Day 3, Demo 6 — "What React actually does" (Virtual DOM, JSX, Reconciliation)

**Date:** 2026-05-28
**Status:** Approved design
**Part of:** Day 3 — Demystifying Frontend Engineering. Sixth demo; opens the
hood after Demo 5 sold *why* React exists. Continues the Swiggy spine and reuses
Demo 5's `react.html` for the reconciliation beat.

## Purpose

Demystify the three pieces of React that feel like magic:

1. **JSX** is sugar — Babel compiles it to `React.createElement(...)` calls.
2. Those calls return **plain JavaScript objects** (`{ type, props }`); a tree of
   them is the **virtual DOM** — data in memory, cheap to create and diff.
3. **Reconciliation:** on a state change React builds a fresh tree, diffs it
   against the old one, and applies the **minimal** real-DOM update. Re-running a
   component is cheap; touching the real DOM is gated by the diff.

## Approach

One inspectable page plus a reused page. `jsx-vs-compiled.html` renders a
`RestaurantCard`, shows the **JSX → `createElement` → object** progression on the
page, and logs a real React element to the Console for DevTools expansion. The
reconciliation beat **reuses Demo 5's `react.html`** (referenced by relative
path), whose `RestaurantCard` already `console.log`s on every render — so the
instructor shows the component re-running every keystroke while React DevTools
Profiler + Paint flashing prove only changed nodes update.

TSX gets a 30-second spoken note (type the props, pass a number where a string
is expected, compiler catches it before the browser) — no separate file.

Same no-build approach as Demo 5: React/ReactDOM/Babel **vendored locally** in
`vendor/`, JSX inline, opens from `file://` offline. No server.

### The artifacts

| Artifact | What it shows |
|---|---|
| `jsx-vs-compiled.html` | Renders `RestaurantCard`; on-page panel with the three forms (JSX, `createElement`, plain object); Console logs an expandable React element. |
| `../demo_5/react.html` (reused) | Reconciliation: render-log flood per keystroke vs. Profiler + Paint flashing showing only changed list items update. |

## Files (`day_3/demo_6/`)

| File | Role |
|---|---|
| `jsx-vs-compiled.html` | The JSX/vDOM inspectable page (vendored React/Babel, inline JSX, Console log). |
| `vendor/react.development.js` | React 18 UMD (vendored). |
| `vendor/react-dom.development.js` | ReactDOM 18 UMD (vendored). |
| `vendor/babel.min.js` | Babel-standalone (vendored). |
| `README.md` | The runbook (demo flow, Slido, checklist). No new reconciliation file — it reuses `../demo_5/react.html`. |

## Demo flow (lands in `README.md`)

0. **Slido** (before anything): "Change one restaurant's name in a list of 1000 —
   how many DOM nodes should ideally update?" Answer (held): **one**.
1. `jsx-vs-compiled.html`: JSX is a function call — Babel compiles each tag to
   `React.createElement(type, props, …children)`; show the hand-written compiled
   twin; `createElement` returns a plain `{ type, props }` object. Expand the
   logged element in the Console — "a tree of these is the virtual DOM."
2. **TSX in 30 seconds** (spoken): type the props; passing `42` to a `string`
   prop is caught by the compiler before the browser runs.
3. **Reconciliation** on `../demo_5/react.html`: (a) typing floods the Console
   with render logs — components re-run every keystroke; (b) React DevTools
   Profiler + Paint flashing show only the changed rows actually update. The diff
   gatekeeps the expensive real-DOM work.
4. Pay off the Slido: new virtual tree, diff finds one differing text node → one
   DOM node updates.

## Verification

- All three `vendor/` files exist at non-trivial size (react ~110 KB, react-dom
  ~1.1 MB, babel ~3.1 MB).
- `jsx-vs-compiled.html` is well-formed, references the three vendored scripts by
  relative `vendor/...` path, puts JSX inline, and `console.log`s a React element.
- README references `../demo_5/react.html` by relative path for the
  reconciliation beat.
- Manual: card renders; Console shows the expandable object; Demo 5's page floods
  render logs on keystroke; Paint flashing flashes only changed rows. Offline
  test with Wi-Fi off.
- No browser automation — structural checks plus the README Pre-session
  checklist.

## Out of scope

- The Fiber scheduler, lanes, or concurrent-rendering internals — "diff the tree,
  apply the minimum" is the right depth here.
- `key` semantics beyond using `r.id` as the list key in the reused page.
- A standalone TSX build (would need a compiler step) — TSX is a spoken note.
- Re-teaching the declarative win — that's Demo 5; this demo only opens the hood.
