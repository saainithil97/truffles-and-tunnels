# "What React actually does"

Demo 5 convinced you *why* React exists. This one opens the hood. You'll see that JSX isn't a new language, the virtual DOM isn't a magic trick, and "React is fast" comes down to one boring, beautiful idea: keep a cheap copy of the UI in memory, diff it against the new one, and only touch the real DOM where it actually needs to change.

## Setup

On the left is a single live playground: `jsx-vs-compiled.html`. It uses Babel-standalone to compile JSX in the browser, so you can read three things side by side:

1. The **JSX** you write (looks like HTML).
2. The **compiled** `React.createElement(...)` calls Babel turns it into.
3. The **plain JavaScript object** that `createElement` returns — one node of the virtual DOM.

React, ReactDOM and Babel are vendored locally, so nothing hits the network.

**Thing to try:** open DevTools → Console with the playground loaded. You'll see a logged React element. Expand it. It's not a "React thing" — it's a plain object with a `type`, `props`, and `children`. Once you accept that, everything else clicks.

## Content

### JSX is sugar for objects

<p class="beat__lede">The browser never sees a single angle bracket of your JSX. Babel rewrites every tag into a function call before the code ever ships.</p>

- `<Card name="Meghana Foods" />` becomes `React.createElement(Card, { name: "Meghana Foods" })`.
- That function call doesn't touch the DOM. It returns a plain JavaScript object: `{ type: Card, props: { name: "Meghana Foods" }, children: [] }`.
- A whole tree of those objects sitting in memory is what people call the **virtual DOM**. No pixels, no nodes — data. Cheap to build, cheap to throw away, cheap to compare.

<figure class="beat__visual">
<div class="before-after">
  <div class="before-after__panel">
    <small>What you write — JSX</small>
    <pre class="before-after__html">function Card({ name }) {
  return (
    &lt;div className="card"&gt;
      &lt;h3&gt;{name}&lt;/h3&gt;
      &lt;button&gt;Like&lt;/button&gt;
    &lt;/div&gt;
  );
}</pre>
  </div>
  <div class="before-after__panel">
    <small>What runs — function calls returning objects</small>
    <pre class="before-after__html">function Card({ name }) {
  return React.createElement(
    "div", { className: "card" },
    React.createElement("h3", null, name),
    React.createElement("button", null, "Like")
  );
}
// → { type: "div", props: { className: "card" },
//     children: [
//       { type: "h3", props: {}, children: ["Meghana"] },
//       { type: "button", props: {}, children: ["Like"] }
//     ] }</pre>
  </div>
</div>
</figure>

### Reconciliation is a diff

<p class="beat__lede">When state changes, React calls your components again and gets a brand new tree of those objects. Then it walks the new and old trees together, asking at each node: same type? same props? same children?</p>

- Wherever it finds a difference, it queues the smallest real-DOM update that would fix it: change this text node, add this attribute, remove that child.
- Wherever the new and old nodes match, it does *nothing*. The corresponding real DOM node is untouched.
- That walk is **reconciliation**. The output is the minimum set of DOM ops that turn the old screen into the new screen.

<figure class="beat__visual">
<div class="before-after">
  <div class="before-after__panel">
    <small>Old tree (before)</small>
    <pre class="before-after__html">ul
├ li · "Meghana Foods"
├ li · "Pizza Hut"
└ li · "Burger King"</pre>
  </div>
  <div class="before-after__panel">
    <small>New tree (after one keystroke)</small>
    <pre class="before-after__html">ul
├ li · "Meghana Foods"      <span style="color: var(--muted-foreground)">same</span>
├ li · "Pizza Express"      <span style="color: var(--primary)">text changed</span>
└ li · "BK"                 <span style="color: var(--primary)">text changed</span></pre>
  </div>
</div>
</figure>

Reconciler output: **two** real-DOM ops — `node2.textContent = "Pizza Express"`, `node3.textContent = "BK"`. The `<ul>` and the first `<li>` are never touched.

### Why this beats both alternatives

<p class="beat__lede">There are three ways to keep the screen in sync with state. React is the only one that's both easy to write and easy to run.</p>

- **Manual DOM (vanilla JS)** — fast per update, but expensive per feature. You write every mutation yourself, every time, and your job is to not forget any. Demo 5 showed what that costs.
- **Re-render everything** — replace the whole DOM tree on every change. Easy to write, but the browser repaints everything every time. Layout, paint, scroll position, focus state — all destroyed.
- **React** — re-render the *cheap* virtual tree on every change, diff it, and touch only the real DOM nodes that actually changed. You get the writing experience of the second option with the runtime cost of the first.

| | Per-feature cost | Per-update cost |
|---|---|---|
| Manual DOM | High — you write every mutation | Low |
| Naive re-render | Low — describe the whole UI | Very high — full reflow every time |
| React | Low — describe the whole UI | Low — diff finds the minimum |

### Going deeper — where React sits in the rendering pipeline

<p class="beat__lede">React doesn't change what the browser does. It changes how much work reaches the browser in the first place.</p>

- The render-tree → layout → paint stages from Demo 1 are still where the real cost lives.
- Every DOM mutation React emits triggers some amount of that pipeline. *Avoiding* mutations is the same as avoiding pipeline work.
- The diff happens entirely **in JS**, before the browser sees any change. By the time the browser is asked to do anything, the work is already minimised.

<figure class="beat__visual">
<render-pipeline highlight="render-tree,layout,paint" note="The diff (in JS) decides what reaches these stages. The fewer real-DOM ops React emits, the less work the browser has to redo."></render-pipeline>
</figure>

## Takeaways

- **JSX is a function call in disguise.** Once you've seen `React.createElement` next to its JSX twin, the angle brackets stop feeling magical.
- **A React element is just an object** with `type`, `props`, and `children`. The virtual DOM is a tree of those objects in memory.
- **Re-running your component is cheap.** It builds new objects, not new DOM nodes — that's why "render on every keystroke" doesn't kill performance.
- **Reconciliation is a diff.** React compares the new tree to the old one and emits the smallest set of real-DOM updates that close the gap.
- **The real DOM is the expensive part — and React gatekeeps it.** That's the whole performance story.
- **You write descriptions; React writes the steps.** Demo 5 showed why that's a better way to think; Demo 6 shows how React pulls it off.
