# "This is why React exists"

Same screen, same Swiggy cart, same five UI surfaces. In `vanilla-full.html`, every click on `+` writes the DOM 17 times. In `react.html`, it writes once. The rest of this demo is the story of that gap.

## Setup

Three iframe tabs: **Vanilla simple** (one dish), **Vanilla full** (three dishes + topbar badge + subtotal + free-delivery banner), **React** (the same vanilla-full features, declarative). React, ReactDOM, and Babel are vendored — open the tabs and they just work.

1. **Vanilla simple** → click Add, then `+`. Two pieces of UI update.
2. **Vanilla full** → same UX, but five pieces update per click. Push the cart past ₹499 and the banner flips green.
3. **React** → identical to a user. Flip the source tabs open. Same behaviour, very different code.

## Content

### 17 writes vs 1

Look at the top of every tab. There's a black bar: **DOM writes — last click: X · total: X**. It's a `MutationObserver` watching the cart UI; every actual DOM mutation increments it. The number is honest.

Click **Add to cart** then `+` twice on Meghana in each tab and watch the counter:

| | What you'll see per click | Why |
|---|---|---|
| Vanilla simple | ~3 | One card, one subtotal — 3 small writes. |
| Vanilla full | **~17** | `renderAll()` walks all 3 cards (~6) + topbar badge (~2) + subtotal (~2) + free-delivery banner (~3) every time, regardless of what changed. |
| React | **~3** | React diffs the new render against the previous and writes only what *actually* changed — usually just the one qty number + the topbar/subtotal text. |

Open `vanilla-full.html` and find `renderAll`. Every event handler in the file ends with a call to it, and inside it sit four sections that always run together. Vanilla writes 17 times because vanilla writes *everything* on every click — there's no diff. Miss any one of those writes and that surface silently drifts from the cart.

Now `react.html`. Three derived values, then the whole UI is a JSX expression of them:

```jsx
const [cart, setCart] = useState({ meghana: 0, truffles: 0, glens: 0 });

const totalQty = DISHES.reduce((s, d) => s + cart[d.id], 0);
const subtotal = DISHES.reduce((s, d) => s + cart[d.id] * d.price, 0);
const unlocked = subtotal >= 499;

// Header, cards, banner, subtotal — every one of them is JSX of those values.
```

You change `cart`. React re-runs the render function to get a description of what the screen should look like now, diffs it against the previous description, and writes only the difference to the real DOM. That diff is **Demo 6**.

That's the difference between **imperative** — *vanilla, write the DOM steps yourself* — and **declarative** — *React, describe the result, let the framework write the steps.*

### Compose, don't copy

Open `vanilla-full.html`. Find one card's markup. Search the file — that 14-line block appears three times. So do the `querySelector` lookups, so do the per-card event listeners.

**Can vanilla reuse HTML?** Yes — three native patterns, none invented by a framework:

1. **`<template>` + `cloneNode`.** Write the markup once in a `<template>` tag, clone it per dish, fill in the text by hand. Native. Cheap. No "props" — you walk the clone and set fields with `querySelector`.
2. **A factory function.** `function makeDishCard(dish, onChange) { … return domNode; }`. Cleaner. You've reinvented half a component model.
3. **A Web Component.** `class DishCard extends HTMLElement`. The browser-native answer. Real lifecycle, real shadow DOM, real learning curve.

All three work. None of them is the *default*. Every vanilla codebase that does this picks one and invents the ergonomics around it. The card-templating pattern at one job will not look like the card-templating pattern at the next.

`react.html` uses one pattern, applied uniformly:

```jsx
function DishCard({ dish, qty, onChange }) {
  return (/* the same markup, parameterised by props */);
}

{DISHES.map(d =>
  <DishCard key={d.id} dish={d} qty={cart[d.id]} onChange={q => setQty(d.id, q)} />
)}
```

PM asks for a *Bestseller* ribbon on Meghana. Vanilla-full (the copy-paste version above): edit one of three HTML blocks *and* add a branch in the JS — the other two cards silently stay stale because you only changed one of three copies. React: one prop on `<DishCard>`. Done.

The framework's contribution isn't "you can now reuse HTML." It's a **standard**: one syntax (JSX), one signature (props), one mental model (a component is a function from props to UI), used by every component in every React file you'll ever read. That standardization — not the render model, not the virtual DOM — is the practical reason teams reach for a framework.

### The trade

Frameworks aren't free.

**What you get** (and where Day 3 picks each up):

- A render model + virtual DOM — **Demo 6**.
- Declarative state → UI — this demo.
- Components + JSX — this demo + **Demo 6**.
- A lifecycle/effects model (`useEffect` and friends) — homework.
- A rendering-strategy choice — **Demo 7**.
- Client-side routing — **Demos 6.5 and 8.5**.
- An ecosystem — UI kits, forms, state, testing. Off-curriculum.

**What you pay:** ~45 KB of React + ReactDOM before your first line of code. Major-version churn every couple of years. Your code shaped by the framework's idioms. Overkill for static pages.

The honest call: **vanilla** (or htmx, Alpine, 50 lines of your own) when the page is mostly static, the team is one person, or you're learning the platform. **A framework** when state has more than a handful of pieces, components need to stay in sync with each other, the team is larger than one, or the app is going to grow. Choose the simpler stack until it's about to run out — *then* upgrade.

## Takeaways

- **The screen is a function of state.** Vanilla syncs state to UI by hand on every click. React describes the UI for the new state and lets the framework write the difference. That's imperative vs declarative.
- **Components are a *standard* vocabulary.** Vanilla can reuse HTML (template, factory, web component) — but every codebase invents its own pattern. React's contribution is one shared vocabulary used in every file.
- **Match the tool to the size.** Vanilla has a ceiling; frameworks have a cost. Choose the simpler stack until it's about to run out.
