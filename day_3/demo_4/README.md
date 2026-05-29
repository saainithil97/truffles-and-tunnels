# "Pure JS hits a wall"

A button works fine. A page works fine. Three cards, a topbar badge, a subtotal, and a banner that flips colour at ₹499 — that's where vanilla starts charging you. Not because JavaScript is slow, but because the work of keeping five UI surfaces in sync with one piece of state is now on you, and the language has nothing built in to help.

## Setup

The iframe above is `vanilla-full.html` — a tiny Swiggy cart in pure HTML+CSS+JS. Three dishes, a topbar with cart badge, a subtotal at the bottom, and a "free delivery unlocked" banner that lights up when subtotal ≥ ₹499.

1. Click **Add to cart** on Meghana. The badge ticks to 1, the card swaps to a `[− 1 +]` stepper, the subtotal jumps to ₹325. Three UI surfaces moved for one click.
2. Click `+` a few more times. Watch the **DOM writes — last click: X** counter at the top. Each click is **~17 writes**. There's a `MutationObserver` watching the cart UI; the count is honest.
3. Push the subtotal past ₹499. The banner flips green. Surface number five.

**Or run it locally:**

```bash
cd day_3/demo_5
uvicorn server:app --host 127.0.0.1 --port 8000 --reload
```

Open `http://localhost:8000/vanilla-full.html`.

## Content

### State and UI drift apart by hand

<p class="beat__lede">You change one thing — the <code>cart</code> object. Five places on screen have to remember to update. Forget one, and the UI silently lies about what's in the cart.</p>

Find `renderAll()` in `vanilla-full.html`. Every event handler in the file ends with a call to it, and inside it sit four sections that always run together — cards, topbar badge, subtotal, banner. There's no diff; vanilla writes *everything* on every click. That's the 17-writes-per-click number you saw in the iframe.

```js
function add(id) {
  cart[id]++;
  renderAll();          // ← because the page can't sync itself
}

function renderAll() {
  // cards:    walk all 3, update qty, swap button ↔ stepper
  // topbar:   total qty
  // subtotal: sum
  // banner:   subtotal ≥ 499 → add "unlocked" class
}
```

The bug pattern this opens you up to: somebody adds a new place that reads `cart` — an analytics line, a "you might also like" row, a recently-viewed strip — and forgets to wire it into `renderAll`. The page works for a week. Then one day a user sees a stale number, and it takes you an hour to find which surface forgot to refresh.

Could vanilla avoid `renderAll`? Sure — wire each click to update *only* the surfaces it touches. But now every new surface means new update paths in every existing handler. Either the page knows how to update itself (you wrote `renderAll`), or every handler knows about every surface (you wrote a mesh). Pick your poison.

### No shared vocabulary for composition

<p class="beat__lede">One card's markup. Search the file — it appears three times, character-for-character. So do the <code>querySelector</code> lookups, so do the per-card event listeners. Vanilla can reuse HTML; it just doesn't have a <em>standard</em> way to.</p>

Three native patterns, none wrong, none the default:

1. **`<template>` + `cloneNode`.** Write the markup once in a `<template>` tag, clone it per dish, fill in text by hand. Native. Cheap. No "props" — you walk the clone and set fields with `querySelector`.
2. **A factory function.** `function makeDishCard(dish, onChange) { … return domNode; }`. Cleaner. You've reinvented half a component model.
3. **A Web Component.** `class DishCard extends HTMLElement`. Browser-native. Real lifecycle, real shadow DOM, real learning curve.

All three work. None of them is *the* answer. The card-templating pattern at your last job will not look like the card-templating pattern at your next one. Every team invents its own ergonomics, every codebase teaches a new dialect.

That missing standard is what the next demo's class of library hands you: one syntax, one signature, one mental model for "a chunk of UI you parameterise and reuse," used by every component in every file.

### Even when you're careful, the DOM punishes you

<p class="beat__lede">There's a class of vanilla bug that nothing structural saves you from: touching the DOM the wrong way in a hot loop.</p>

The browser is lazy on purpose. When you set `card.style.padding = "10px"`, it doesn't compute the new layout yet — it queues the change. But if you then read `card.getBoundingClientRect()`, the browser has to flush the queue and recompute layout *right now* to give you an honest answer. Interleave writes and reads in a loop, you pay that flush every iteration.

```js
for (const card of cards) {
  card.style.paddingRight = padPx + "px";  // ← write: invalidates layout
  card.getBoundingClientRect();             // ← read: forces flush *now*
}
```

120 cards × 60 scroll events per second × five inner iterations ≈ **36,000 forced layouts per second**. The scroll handler can't finish in the 16 ms frame budget. The page freezes.

<figure class="beat__visual">
<div class="thrash">
  <div class="thrash__row">
    <span class="thrash__label">Slow — interleaved</span>
    <div class="thrash__tape">
      <span class="thrash__op thrash__op--write"></span>
      <span class="thrash__op thrash__op--read"></span>
      <span class="thrash__op thrash__op--write"></span>
      <span class="thrash__op thrash__op--read"></span>
      <span class="thrash__op thrash__op--write"></span>
      <span class="thrash__op thrash__op--read"></span>
      <span class="thrash__op thrash__op--write"></span>
      <span class="thrash__op thrash__op--read"></span>
      <span class="thrash__op thrash__op--write"></span>
      <span class="thrash__op thrash__op--read"></span>
    </div>
    <span class="thrash__verdict thrash__verdict--bad">~40 reflows / scroll event</span>
  </div>
  <div class="thrash__row">
    <span class="thrash__label">Fast — cached</span>
    <div class="thrash__tape">
      <span class="thrash__op thrash__op--read"></span>
      <span class="thrash__op thrash__op--read"></span>
      <span class="thrash__op thrash__op--read"></span>
      <span class="thrash__op thrash__op--read"></span>
      <span class="thrash__op thrash__op--read"></span>
      <span class="thrash__flush">↻ once, up front</span>
    </div>
    <span class="thrash__verdict thrash__verdict--good">0 reflows / scroll event</span>
  </div>
  <div class="thrash__legend">
    <span><i class="thrash__chip thrash__chip--read"></i> layout read (<code>getBoundingClientRect</code>)</span>
    <span><i class="thrash__chip thrash__chip--write"></i> style write</span>
  </div>
</div>
</figure>

The fix isn't a special technique — it's *separating the phases*. Read everything you need into plain JS variables first. Then loop without touching the DOM.

The footgun isn't library-specific — you can write the same bug in any framework. But a library at least reduces how often you're hand-writing the loop in the first place. One less surface, one less category of bug. The full scroll demo lives at `day_3/demo_4/` if you want to feel the freeze yourself.

### What these three problems have in common

<p class="beat__lede">They are not language problems. JavaScript is fine. They are <em>missing-abstraction</em> problems.</p>

- **State ↔ UI sync** — vanilla has no notion of "this DOM follows that data." You write the wire by hand, every surface, every handler.
- **Composition** — vanilla has no notion of "a piece of UI with inputs." You pick a pattern, you invent the ergonomics.
- **DOM cost** — vanilla hands you raw access. You're responsible for not abusing it.

Each one is solvable on its own. All three at once, on a team of more than one engineer, on a codebase you don't have entirely in your head — that's where the next demo's class of library starts paying for itself.

## Takeaways

- **The screen is a function of state.** Vanilla makes you write that function as a procedure (`renderAll`); every surface you add is a new line you can forget.
- **HTML is reusable; vanilla just doesn't standardise how.** Template, factory, Web Component — all valid, none default. Every codebase reinvents.
- **The DOM has cliffs.** Forced layout in a hot loop tanks a scroll handler in any language.
- **The wall isn't JavaScript. It's the abstractions JavaScript doesn't ship.** Demo 5: a class of library that ships them.
