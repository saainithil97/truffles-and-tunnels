# "The shape of every library that fixes this"

There's a class of library that answers Demo 4's three problems. React is the most common — but Vue, Svelte, and Solid sit in the same class, solving the same problems with different mechanisms. What you should walk out with isn't *"React has JSX and a virtual DOM."* It's the shape these libraries all share, so the next one you meet doesn't feel like a new language.

## Setup

The iframe above is `react.html` — the cart from Demo 4, in ~30 lines of React. Vanilla-full was 17 DOM writes per click; this is **~3**. The behaviour is identical to the user.

1. Click **Add to cart** then `+` a couple of times. Watch the **DOM writes — last click** counter at the top. Same `MutationObserver`, same accounting as Demo 4. Vanilla-full: ~17. React: ~3.
2. Open `react.html` in your editor. There's no `renderAll()`. There's no `querySelector(".qty")`. There's one `useState`, one `DishCard` component, and JSX that reads as "given the cart, the screen looks like this."
3. There's a `jsx-vs-compiled.html` playground in `day_3/demo_6/` if you want to step through how JSX becomes a function call becomes a plain object. We use the diagram from it below.

## Content

### Describe the UI as a function of state

<p class="beat__lede">You write the <em>result</em>, not the steps. The same component, three libraries — React, Vue, Svelte.</p>

The same `DishCard`, three ways. The differences are spelling. The shape is identical: declare props, declare what the UI looks like for those props, emit events upward.

```jsx
// React
function DishCard({ name, qty, onAdd }) {
  return (
    <div className="card">
      <h3>{name}</h3>
      <button onClick={onAdd}>Add ({qty})</button>
    </div>
  );
}
```

```vue
<!-- Vue -->
<script setup>
defineProps(['name', 'qty']);
const emit = defineEmits(['add']);
</script>
<template>
  <div class="card">
    <h3>{{ name }}</h3>
    <button @click="emit('add')">Add ({{ qty }})</button>
  </div>
</template>
```

```svelte
<!-- Svelte -->
<script>
  export let name;
  export let qty;
</script>
<div class="card">
  <h3>{name}</h3>
  <button on:click>Add ({qty})</button>
</div>
```

Each is "a function from props to UI." JSX with curly-brace expressions, a `<template>` block with `{{ … }}`, a `.svelte` file with `{ … }`. None of them is `renderAll`. None mentions a DOM node. You describe what the screen looks like for a given state; whose job is it to make the real DOM agree? The library's.

### The library figures out what to change

<p class="beat__lede">You hand it the new description. It figures out the diff against what's on screen. Three different mechanisms, same destination — minimum real-DOM work.</p>

| Mechanism | Used by | When the work happens | What runs at runtime |
|---|---|---|---|
| **Diff a virtual tree** | React, Vue (template) | Runtime | Re-run your component → get a new tree of plain objects → compare to last → emit minimum DOM ops |
| **Compile to imperative ops** | Svelte | Build time | Compiler reads your `.svelte`, generates per-component code that *already knows* which DOM nodes to update for which state change. No diff at runtime. |
| **Fine-grained signals** | Solid, Vue 3 internals | Runtime, surgically | Each piece of UI subscribes to exactly the state it reads. State changes → only those subscribers re-run → updates fire without diffing |

All three end at the same place: when the cart goes from 1 → 2, the only thing the browser sees is `node.textContent = "2"`. The path through your library differs; the *contract* — minimum work for the visible change — is the same.

Look at the React path concretely. JSX compiles to function calls; function calls return plain objects; objects are the cheap "virtual tree":

<figure class="beat__visual">
<div class="before-after">
  <div class="before-after__panel">
    <small>What you write — JSX</small>
    <pre class="before-after__html">&lt;h3&gt;{name}&lt;/h3&gt;</pre>
  </div>
  <div class="before-after__panel">
    <small>What runs — function call returning an object</small>
    <pre class="before-after__html">React.createElement("h3", null, name)
// → { type: "h3", props: {}, children: [name] }</pre>
  </div>
</div>
</figure>

State changes, your function runs again, you get a new object tree. The library walks the old and new trees together:

<figure class="beat__visual">
<div class="before-after">
  <div class="before-after__panel">
    <small>Old tree</small>
    <pre class="before-after__html">card
├ h3 · "Meghana Foods"
└ button · "Add (1)"</pre>
  </div>
  <div class="before-after__panel">
    <small>New tree (one click)</small>
    <pre class="before-after__html">card
├ h3 · "Meghana Foods"      <span style="color: var(--muted-foreground)">same</span>
└ button · "Add (2)"        <span style="color: var(--primary)">text changed</span></pre>
  </div>
</div>
</figure>

Reconciler output: one real-DOM op — `button.textContent = "Add (2)"`. The `<h3>` is never touched.

Svelte gets to the same one op a different way: at build time it noticed only `qty` changes that text, and emitted `node.textContent = qty` as a wired-up update function. No runtime diff because the compiler already did the comparison.

Solid skips both — `qty` is a signal, the text subscribes to it, the assignment fires directly when the signal updates.

The mental model is the *contract*: describe state → UI, get minimum work. Pick a library, pick its mechanism — but recognise the shape, and the next library stops feeling foreign.

### Components are the composition unit

<p class="beat__lede">Every library in this class agrees: a chunk of UI with inputs is the unit you reuse.</p>

The vanilla card from Demo 4 was copy-pasted three times because vanilla had no standard place for "this is what a card looks like, here are its inputs." Every library in this class answers the same question the same shape:

- A **name** (`DishCard`)
- **Props** (the inputs: `name`, `qty`)
- **Output** (the UI for those inputs)
- **Events** (clicks that propagate up)

React calls the unit a function component, Vue calls it a single-file component, Svelte calls it a `.svelte` file, Solid calls it a function. Vocabulary differs; shape is shared. Read one, you can read the others. That standardised shape is what lets React Router exist, lets Vue's ecosystem exist, lets a UI-kit library ship one set of components every consuming codebase can drop in. **The component contract is the ecosystem.**

### React, in code

<p class="beat__lede">Demo 4's vanilla-full cart, rewritten in React. Same five UI surfaces. One state object. Three derived values. The whole UI is a function of those.</p>

```jsx
const DISHES = [
  { id: "meghana", name: "Meghana Foods",     price: 325 },
  { id: "truffles", name: "Truffles",         price: 280 },
  { id: "glens",    name: "Glen's Bakehouse", price: 220 },
];

function App() {
  const [cart, setCart] = useState({ meghana: 0, truffles: 0, glens: 0 });

  const totalQty = DISHES.reduce((s, d) => s + cart[d.id], 0);
  const subtotal = DISHES.reduce((s, d) => s + cart[d.id] * d.price, 0);
  const unlocked = subtotal >= 499;

  const setQty = (id, q) => setCart({ ...cart, [id]: Math.max(0, q) });

  return (
    <>
      <Topbar count={totalQty} />
      {DISHES.map(d =>
        <DishCard
          key={d.id} dish={d} qty={cart[d.id]}
          onChange={q => setQty(d.id, q)}
        />
      )}
      <Banner unlocked={unlocked} />
      <Subtotal value={subtotal} />
    </>
  );
}
```

What changed from vanilla:

- **`renderAll()` is gone.** You don't write the sync; the library does. You wrote the description.
- **The five surfaces are four components.** Topbar, DishCard ×3, Banner, Subtotal — each a function from props to UI. Add a sixth surface ("recently viewed" strip) and it joins the JSX; it doesn't add a line to any existing function.
- **One state object.** Three derived values flow from `cart`. Drift between cart and screen is *structurally* impossible — the screen is computed from the cart on every render.
- **17 → 3 DOM writes per click.** The library diffed and emitted only what changed: the qty, the badge, the subtotal.

This is the worked example. The general model is the previous three beats — every library in this class fits the same shape.

## Takeaways

- **Describe state → UI, not steps.** Every library in this class makes you write the result; they handle the sync. React, Vue, Svelte, Solid — same contract, different syntax.
- **Three mechanisms, one destination.** Virtual-tree diff (React, Vue), compiled imperative updates (Svelte), fine-grained signals (Solid) — all end at minimum real-DOM work.
- **Components are the universal composition unit.** A name, props, output, events. Read one library's components, you can read the rest.
- **React is the worked example.** ~30 lines for Demo 4's cart, 17 → 3 writes. The model isn't React-specific; React is the most common implementation of it.
