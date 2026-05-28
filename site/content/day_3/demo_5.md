# Day 3, Demo 5 — "This is why React exists" (Imperative vs Declarative)

Companion artifacts for the fifth demo of Day 3. Full design:
`../docs/superpowers/specs/2026-05-28-day3-demo5-imperative-vs-declarative-design.md`.

The **same Swiggy restaurant search, three ways**. Start with a clean ~25-line
vanilla filter. Then a PM walks in and asks for four small features — and watch
the imperative code balloon into a tangle of manual DOM juggling. Then rebuild
the *same* thing in React, where you **describe the UI** instead of poking the
DOM step by step. The big idea:

> Vanilla JS is **imperative** — you list every DOM mutation by hand, and you
> own keeping the screen in sync. React is **declarative** — you describe what
> the UI should look like for the current state, and React works out the DOM.
> React isn't always *less* code; the win is that complexity grows **linearly**
> with features instead of exponentially.

## What's here

- `vanilla-simple.html` — text input + the 15 restaurants; typing filters the
  list. ~25 clean lines: `addEventListener`, `filter`, rebuild the `<li>`s,
  append. "Clean. Simple. Works."
- `vanilla-full.html` — the SAME page after the PM piles on four requirements:
  (1) a "no results" message, (2) highlight the matching substring in the name,
  (3) a loading spinner, (4) remember the last search in `localStorage`. The
  imperative code balloons to 100+ lines of manual show/hide, string surgery for
  the highlight, spinner toggling, and `classList` juggling. It works — but it's
  brittle, and it's commented to show the tangle.
- `react.html` — the SAME four features, declarative, in React (vendored). State
  drives everything: empty → message, loading → spinner, map restaurants to
  cards with the match highlighted, `localStorage` via `useEffect`.
- `vendor/` — React 18, ReactDOM 18, and Babel-standalone, **vendored locally**
  so `react.html` runs offline.

## Setup & run

**No server, no build step.** These pages open straight from the filesystem:

```bash
open day_3/demo_5/vanilla-simple.html
open day_3/demo_5/vanilla-full.html
open day_3/demo_5/react.html
```

`react.html` loads React/ReactDOM/Babel from `vendor/` (already downloaded), so
it works offline. JSX is compiled in the browser by Babel and lives **inline**
in the page — that's deliberate, so `file://` doesn't try to fetch an external
script and trip CORS. (First paint waits a beat while Babel compiles; that's
expected for a no-build teaching page, not how you'd ship it.)

## Demo flow

### 0. Slido — ask it BEFORE you show React

> "I need to add **3 more features** to this vanilla JS filter. On a scale of
> **1–5**, how confident are you it won't break?"

Most will say **1–2**. That low confidence *is* the motivation for the whole
demo — sit with it before the reveal. (Ask it right after they've seen
`vanilla-full.html` in section 2, while the tangle is on screen.)

### 1. Vanilla, simple

Open `vanilla-simple.html`. Type "pizza" — the list filters live. Scroll the
source: ~25 lines. `addEventListener('input', …)`, `filter` the array, clear the
`<ul>`, rebuild the `<li>`s, append.

> "Clean. Simple. Works. Honestly, for *this*, you don't need React. Hold that
> thought."

### 2. The PM walks in

Frame it: the feature you shipped is great, and now the PM wants four more
things — none of them sound hard:

1. a **"no results"** message when nothing matches,
2. **highlight** the typed letters inside each restaurant name,
3. a **loading spinner** (pretend each search hits a server),
4. **remember** the last search so it's there on refresh.

Open `vanilla-full.html`. It works — type, see the highlight, clear the box to
see the message, refresh to see the remembered search. Now show the source and
narrate the tangle:

- One `render()` function now has to keep **four** pieces of UI in sync by hand —
  show/hide the message, toggle the spinner, wipe and rebuild the list.
- The highlight is **manual string surgery**: `indexOf`, slice three ways, and
  HTML-escape each slice so user input can't break the markup.
- A hand-tracked **debounce timer** so overlapping "requests" don't race.
- On load you must **restore** the search *and* remember to **re-run** it, or you
  ship a box showing old text over the full list.

> "Every requirement added another thing to remember to toggle. Miss one — forget
> to hide the spinner, forget to clear the message — and the UI lies. This is
> imperative code: you own every mutation, and you own every way it can drift out
> of sync."

**Now run the Slido** (section 0). Let them rate their confidence with this on
screen.

### 3. The React version

Open `react.html` — same four features, working. Then show the source:

- The whole UI is **three pieces of state**: `query`, `loading`, `results`.
- The render **describes** the screen for the current state:
  `{loading && <Spinner/>}`, `{results.length === 0 && <Empty/>}`,
  `results.map(r => <RestaurantCard/>)`. No `classList`, no show/hide.
- The highlight returns **JSX** (`<mark>`), so there's no escaping and no string
  math.
- `localStorage` is one `useEffect` keyed on `query` — declare it, React runs it.

> "Notice what's gone: there's no code that *hides* the spinner or *clears* the
> message. You describe what each state looks like, and React figures out the DOM
> to match. Add a fifth feature and you add one more piece of state and one more
> line of description — the complexity grows in a straight line."

### 4. Don't oversell it

> "React isn't always less code — count the lines and they're in the same
> ballpark. The win isn't fewer characters; it's that the vanilla version got
> *exponentially* more tangled with each feature, and the React version grew
> *linearly*. That trade is why a whole industry moved."

(Bridge to Demo 6: "So what is React actually *doing* under the hood to pull this
off? That's next.")

## Pre-session checklist

- [ ] `vendor/` has all three files at non-trivial size: `react.development.js`
      (~110 KB), `react-dom.development.js` (~1.1 MB), `babel.min.js` (~3.1 MB).
- [ ] `vanilla-simple.html` opens; typing filters the 15 restaurants.
- [ ] `vanilla-full.html` opens; highlight works, empty message shows on no
      match, spinner flashes, refresh remembers the last search.
- [ ] `react.html` opens (give Babel a second to compile); all four features
      behave identically.
- [ ] Practised the "PM walks in" beat and the Slido timing (ask it on the
      `vanilla-full` tangle, before opening `react.html`).
- [ ] Tested `react.html` once with Wi-Fi **off** to confirm the vendored files
      really make it run offline.

## Notes for the live session

- This is a **local, screen-shared** demo — open the files directly, no server.
- Keep the **Console** open on `react.html`: each `RestaurantCard` logs when it
  renders. You'll lean on that in Demo 6 (reconciliation), which reuses this
  exact page.
