# "Why is this scroll laggy?"

Same restaurant list, same scroll, two scroll handlers. One feels stuck. One feels native. The difference is a single bad pattern — reading a layout property in the middle of a loop — and once you've seen it, you'll spot it in every codebase you touch.

## Setup

The iframe on the left is a scrollable Swiggy feed (120 cards). Up top: a counter (*Showing X of 120 above*), a **Slow / Fast** toggle, an **Auto-scroll** button, and two readouts — `handler: X ms` (how long the most recent scroll handler took) and `last frame: X ms` (how long the browser took to draw the most recent frame). Both go red when they cross the 16.7 ms frame budget.

1. Default mode is **Slow**. Hit **Auto-scroll** (or scroll the iframe yourself). Watch the `handler: X ms` readout — it'll climb into the 30–50 ms range and turn red. The canary dot freezes mid-pulse, the scroll feels heavy.
2. Hit **Fast**, then **Auto-scroll** again. `handler: X ms` drops to **0.0 ms**, the canary stays green, scroll glides.
3. Compare what changed: nothing visible. No card resized, no animation added. The whole difference is inside the scroll handler.

**For the brave** — open DevTools → **Performance** → record a couple of seconds of scrolling in slow mode → stop. You'll see a wall of purple **Layout** bars stacked inside the scroll event. Switch to fast and record again: one tiny task per scroll event, no purple at all.

**Or run it locally:**

```bash
cd day_3/demo_4
python3 -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
uvicorn server:app --host 127.0.0.1 --port 8000 --reload
```

## Content

### Why the slow handler is slow

<p class="beat__lede">The browser is lazy on purpose. When you set <code>card.style.padding = "10px"</code>, it doesn't compute the new layout yet — it writes the change to a queue and waits to see what else you're going to do, so it can run all the layout math once at the end of your code.</p>

That works until you ask a question that needs an answer *right now*.

- `getBoundingClientRect()`, `offsetWidth`, `offsetHeight`, `clientTop`, `scrollHeight`, `getComputedStyle(...)` — these all need an honest, up-to-date answer.
- If there's anything sitting in the pending-writes queue, the browser drops what it's doing, applies the queued changes, and recomputes layout *before* it can answer. That's the cost.
- Doing this once per scroll event is invisible. Doing it 40 times per scroll event — once per card — is not.

Here's the slow handler in `app.js`. Each card gets an inner loop of write-then-read pairs. The write changes `paddingRight` by a sub-pixel amount that's different every time but rounds to the same visible pixel; the read is `getBoundingClientRect()`, which has to flush layout because the write just invalidated it.

```js
function onScrollSlow() {
  const sy = window.scrollY;
  for (const card of cards) {
    for (let j = 0; j < 5; j++) {
      const padPx = 11 + ((sy + j * 13) % 100) * 0.001; // 11.xxx px, looks identical
      card.style.paddingRight = padPx.toFixed(4) + "px"; // ← write: invalidates layout
      card.getBoundingClientRect();                       // ← read: forces layout now
    }
  }
}
```

120 cards × 5 inner iterations × 60 scroll events per second = roughly **36,000 forced layouts per second**. The scroll handler can't possibly finish in the 16 ms the browser has between frames. The spinner in the topbar (driven by `requestAnimationFrame`) stops rotating because rAF can't fire while the handler is running. Same main thread, same starvation.

The fast handler is the same loop with one structural change: the layout math is done **once**, up front, and cached in plain JS variables.

```js
const cachedBottoms = cards.map((c) => c.offsetTop + c.offsetHeight);

function onScrollFast() {
  const scrollY = window.scrollY;
  let above = 0;
  for (let i = 0; i < cachedBottoms.length; i++) {
    if (cachedBottoms[i] < scrollY) above++;
  }
}
```

One read of `window.scrollY`, then pure arithmetic against a pre-computed array. The DOM is never touched, the browser is never asked for layout truth, and the handler runs in microseconds. Scroll glides; canary keeps its pulse.

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
    <span class="thrash__verdict thrash__verdict--bad">~40 reflows per scroll event</span>
  </div>
  <div class="thrash__row">
    <span class="thrash__label">Fast — cached</span>
    <div class="thrash__tape">
      <span class="thrash__op thrash__op--read"></span>
      <span class="thrash__op thrash__op--read"></span>
      <span class="thrash__op thrash__op--read"></span>
      <span class="thrash__op thrash__op--read"></span>
      <span class="thrash__op thrash__op--read"></span>
      <span class="thrash__op thrash__op--read"></span>
      <span class="thrash__op thrash__op--read"></span>
      <span class="thrash__op thrash__op--read"></span>
      <span class="thrash__op thrash__op--read"></span>
      <span class="thrash__op thrash__op--read"></span>
      <span class="thrash__flush">↻ once, up front</span>
    </div>
    <span class="thrash__verdict thrash__verdict--good">0 reflows per scroll event</span>
  </div>
  <div class="thrash__legend">
    <span><i class="thrash__chip thrash__chip--read"></i> layout read (<code>getBoundingClientRect</code>)</span>
    <span><i class="thrash__chip thrash__chip--write"></i> style write (class toggle)</span>
  </div>
</div>
</figure>

The fix isn't a special technique — it's *separating the phases*. Do all your DOM reads up front, into plain JS values. Then loop without touching the DOM. The browser will batch your remaining writes and run layout once.

### One class beats a thousand inline writes

<p class="beat__lede">If a change is really "everything inside this container should now look like this," let CSS do the fan-out. One class on the parent &gt; one inline style on every child.</p>

- Toggling one class on a parent — `container.classList.add("compact")` — lets the CSS engine apply the rule to every matching child in a single pass.
- No JS loop. No N inline style writes. One write, one Layout, one Paint.
- Modern CSS (`:has()`, container queries, custom properties on the root) makes this even easier — you change one variable, every descendant that reads it updates together.

### This is why React exists

<p class="beat__lede">React doesn't make the DOM faster. It makes it harder to thrash it by accident.</p>

- During **render**, React computes the next tree entirely in memory. No DOM touched, no Layout possible.
- During **commit**, React applies every change to the real DOM in one ordered pass — all writes, no interleaved reads.
- You write declarative components and inherit the batched-write discipline for free. We make this concrete in **Demo 6**.

### The Performance tab is your X-ray

<p class="beat__lede">Until you've seen layout thrash in the Performance profiler, you don't really know what your code is doing to the browser.</p>

- Open DevTools → **Performance** → record a couple of seconds of scrolling → stop.
- **Slow mode** — every scroll event becomes a fat purple stripe stacked with **Layout** bars. The frame budget (16.7 ms) is blown.
- **Fast mode** — the scroll events barely register. No purple. The main thread sits idle most of the time, which is exactly what you want — that's the budget your animations and interactions need.
- The Performance panel also flags forced reflows with a yellow triangle next to the offending line of JS. Click it; it jumps to your source.

## Takeaways

- **Treat layout reads as expensive.** `getBoundingClientRect()`, `offsetWidth`, `getComputedStyle()` — they look like reads, they really flush pending layout.
- **Never interleave reads and writes in a hot loop.** Read everything you need into plain JS variables first. Loop without touching the DOM.
- **Hot loop = scroll, resize, animation frame, drag move.** Anything the browser calls many times per second. That's where thrashing turns into a frozen page.
- **One class toggle on a parent beats N inline style writes.** Let CSS fan out the change.
- **This is what React's render/commit split does for you.** Demo 6 is the payoff.
