# Day 3, Demo 5 — "This is why React exists" (Imperative vs Declarative)

**Date:** 2026-05-28
**Status:** Approved design
**Part of:** Day 3 — Demystifying Frontend Engineering. Fifth demo; motivates
React by letting imperative vanilla code collapse under feature creep, then
rebuilding the same thing declaratively. Continues the Swiggy spine and sets up
Demo 6 (what React does under the hood).

## Purpose

Make the **cost of imperative DOM code visceral**, then show the declarative
alternative. The point is not "React = less code" — it's that imperative
complexity grows **exponentially** with features (every requirement adds more
manual state to keep in sync), while declarative complexity grows **linearly**
(describe the UI for the current state; React reconciles the DOM).

## Approach

Build the **same Swiggy restaurant search three ways** and show the progression
live. A clean ~25-line vanilla filter; then the same filter after a PM adds four
small features, ballooning into a tangle of manual `classList`/show-hide/string
surgery; then the same four features in React, where state drives the render.

The Slido (confidence 1–5 that three more features won't break the vanilla code)
is asked **on the tangle, before React is shown** — the low confidence is the
motivation.

React runs with **no build step**: React 18 + ReactDOM 18 + Babel-standalone are
**vendored locally** in `vendor/`, JSX is inline in a `<script type="text/babel">`
block, and the page opens straight from `file://` (offline-capable). No FastAPI
server.

### The three versions

| File | Theme | What it shows |
|---|---|---|
| `vanilla-simple.html` | Imperative, minimal | input + 15 restaurants, `filter`/rebuild/append. ~25 lines. "Clean. Simple. Works." |
| `vanilla-full.html` | Imperative, +4 features | no-results message, substring highlight, loading spinner, `localStorage` recall. 100+ lines of manual toggling, string surgery, hand-tracked debounce. Works but brittle; commented to expose the tangle. |
| `react.html` | Declarative | the same four features via `useState`/`useEffect`; render describes the UI per state; highlight returns JSX; `localStorage` in an effect. |

## Files (`day_3/demo_5/`)

| File | Role |
|---|---|
| `vanilla-simple.html` | The clean baseline filter (inline JS). |
| `vanilla-full.html` | The tangled imperative version with the four PM features (inline JS, heavily commented). |
| `react.html` | The declarative React version (vendored React/Babel, inline JSX). Also logs each card render for reuse in Demo 6. |
| `vendor/react.development.js` | React 18 UMD (vendored). |
| `vendor/react-dom.development.js` | ReactDOM 18 UMD (vendored). |
| `vendor/babel.min.js` | Babel-standalone (vendored, compiles inline JSX). |
| `README.md` | The runbook (demo flow, Slido, checklist). |

## Demo flow (lands in `README.md`)

1. `vanilla-simple.html`: type to filter; ~25 lines. "You don't need React for
   this — hold that thought."
2. The PM adds four features → open `vanilla-full.html`. It works; narrate the
   tangle (one `render()` syncing four UI pieces, manual highlight string
   surgery + escaping, hand-tracked debounce, restore-and-re-run on load).
3. **Slido** here, on the tangle: "3 more features — confidence 1–5 it won't
   break?" Most say 1–2; that is the motivation.
4. `react.html`: same four features. Source = three pieces of state; render
   describes the screen (`{loading && …}`, `{empty && …}`, `.map`); highlight
   returns `<mark>` JSX; `localStorage` is one `useEffect`.
5. Don't oversell: same line count ballpark — the win is linear vs exponential
   growth. Bridge to Demo 6 ("what is React doing under the hood?").

## Verification

- All three `vendor/` files exist at non-trivial size (react ~110 KB, react-dom
  ~1.1 MB, babel ~3.1 MB).
- Each HTML is well-formed; `react.html` references the three vendored scripts by
  relative `vendor/...` path and puts JSX inline.
- Manual: `vanilla-simple` filters; `vanilla-full` highlights / shows empty
  message / flashes spinner / remembers search on refresh; `react.html` behaves
  identically (offline test with Wi-Fi off).
- No browser automation — structural checks plus the README Pre-session
  checklist.

## Out of scope

- A real network fetch (the spinner uses a `setTimeout` to simulate latency).
- A build toolchain (Vite/webpack) — vendored UMD + in-browser Babel is
  deliberately chosen for a zero-setup, offline teaching page.
- Routing, pagination, or sorting — four features are enough to show the tangle.
- Performance internals (virtual DOM / reconciliation) — that's Demo 6, which
  reuses this `react.html`.
