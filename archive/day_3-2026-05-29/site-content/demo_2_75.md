# "One thread, one mood"

JavaScript runs on one thread. That thread is the same thread the browser uses to lay out, paint, fire your click handlers, and run your timers. Everything is taking turns. While anything is running, nothing else runs — and the second-most surprising bug in your frontend career will come from forgetting that. (The first is in **Demo 4**.)

## Setup

The iframe is a four-button event-loop sandbox. Up top: a **canary spinner** (driven by `requestAnimationFrame`, 60×/sec) and a **clock** (driven by `setInterval`, 20×/sec). Both run on the main thread.

1. Watch the spinner and the clock for a few seconds — they're smooth. The main thread is idle so the browser fits paint, timer, and rAF callbacks easily inside each 16.7 ms frame.
2. Click any scenario button. The event log below records what ran in what order, with millisecond timestamps.
3. While a scenario runs a long synchronous task, **the spinner and the clock both freeze.** That freeze is the lesson.

There's no server. The whole demo is `index.html` + `app.js` + `style.css`. To run it locally, just open `day_3/demo_2_75/index.html` in a browser.

## Content

### One thread, one mood

<p class="beat__lede">In a browser tab, your JavaScript, the click events, the timers, the promise resolutions, and the animation frames all run on a single OS thread — the same thread the browser uses to compute layout and paint pixels. They take turns.</p>

The way they take turns is the **event loop**. It is roughly: "if any JS is running, wait for it to finish; otherwise, pull the next task off the queue and run it; before yielding back, drain the microtask queue; then let the browser render if it wants to; loop."

What goes into the queue:

- **Tasks** (sometimes called *macrotasks*) — a `<script>` block executing, a `setTimeout` / `setInterval` callback firing, a user event handler (`click`, `scroll`, `keydown`), a fetched message arriving.
- **Microtasks** — `Promise.then` / `.catch` / `.finally`, `queueMicrotask(fn)`, `MutationObserver` callbacks. Microtasks are drained *exhaustively* between each task — and *before* the browser is allowed to render.
- **Animation frame callbacks** — `requestAnimationFrame(fn)`. The browser fires these right before the next paint. If it can't paint, it can't fire them.

The canary spinner at the top of the iframe rotates by 6° on every rAF callback. The clock updates on a 50 ms `setInterval`. When you press a scenario button that runs a 1-second synchronous loop, **both stop dead** — because the loop is hogging the only thread that could fire rAF or process the interval. When the loop finally returns, you'll see the spinner snap to its new angle and the clock leap forward by ~1000 ms in one tick. That snap is the visible shape of a backed-up queue.

### setTimeout(fn, 0) does not mean "now"

<p class="beat__lede">It means "put this task on the queue. We'll run it after the current task finishes." If the current task takes a second, your "immediate" timer is a second late.</p>

Click scenario ②. The log records, in order:

```
▶ scenario: setTimeout(fn, 0) then block 1s
   queue: setTimeout(fn, 0)
   start: block 1s
       (no timer fires here — sync code is still running)
   done: sync code finished. timer can now run.
   TIMER fired (notice: after the block, not before)
```

The 0 in `setTimeout(fn, 0)` is a *minimum* delay, not a guarantee. The runtime is also allowed to clamp the minimum (browsers historically used 4 ms; modern browsers vary). But even at a true 0, the rule still applies: tasks only run when the thread is free, and the thread won't be free until the current task voluntarily returns. There is no preemption.

### Promises jump the queue

<p class="beat__lede">A microtask queued during a task runs <em>before</em> the next task — even if that next task was queued first.</p>

Click scenario ③. The log records:

```
▶ scenario: Promise vs setTimeout(0)
   queue: setTimeout(fn, 0)  — macrotask
   queue: Promise.resolve().then(fn) — microtask
   end of sync code.
   MICRO promise.then ran
   MACRO setTimeout(0) ran
```

The setTimeout was queued *first*. The promise ran first anyway. That's because the event loop drains the *entire* microtask queue between tasks — so any promise resolution that landed during the current task gets processed before the next task starts.

This is why async code in React or in modern frameworks feels "fast": promise chains keep running back-to-back without yielding to the rest of the queue. It is also why microtask infinite loops can wedge a tab harder than `while(true)` — they keep the queue from ever draining.

### rAF is paint-aligned, not real-time

<p class="beat__lede">A <code>requestAnimationFrame</code> callback fires only when the browser is about to paint. If the main thread is blocked, the browser cannot paint, so the rAF cannot fire.</p>

Click scenario ④. The log records:

```
▶ scenario: rAF then block 1s
   queue: requestAnimationFrame(fn)
   start: block 1s
   done: sync code finished.
   RAF fired (paint-aligned — happened only after block)
```

This is why the canary at the top of the page freezes during scenarios ①, ②, and ④. rAF is the *measurement device* for "is the main thread healthy enough to paint at 60 Hz?" If you ever want to detect main-thread jank from your own code, queue a rAF and time the gap between when you queued it and when it fired. If that gap exceeds 16.7 ms, you missed a frame.

### Where this bites in real life

<p class="beat__lede">The freeze isn't a curiosity. It's the shape of every frontend performance bug.</p>

- **Long tasks.** Any single task that takes more than ~50 ms is a long task. The Chrome performance team coined the term because that's the point at which input feels laggy. Your scroll handlers, your search-filter functions, your JSON.parse on a giant blob — all candidates.
- **Janky scroll.** Demo 4 is the canonical example. A scroll handler that does 600 forced layouts per event runs for ~80 ms, which means no paint for 80 ms, which means scroll position lurches instead of glides.
- **Slow first interactive.** When a Next.js page first hydrates, React walks the whole tree and attaches event handlers on the main thread. If that walk takes 400 ms, the user clicks Like for 400 ms and nothing happens. Demo 8 calls this the hydration gap.
- **The escape hatch — Web Workers.** A Web Worker is an *actual* second thread. You can `postMessage` a 10 MB CSV into a Worker, parse it there, and post the result back. The main thread stays responsive the whole time. Workers can't touch the DOM (no access to `document`), but they're how you do heavy compute without freezing the UI.

## Takeaways

- **One thread runs everything that's not the network or the GPU.** Your JS, your event handlers, your timers, your promises, layout, paint. Everything competes.
- **`setTimeout(fn, 0)` is not "now."** It is "as soon as the queue is empty." If a 1-second sync task is in front of you, it is 1 second.
- **Microtasks (Promises) beat macrotasks (timers).** The microtask queue is drained exhaustively between tasks.
- **rAF is the canary.** If `requestAnimationFrame` callbacks aren't firing every 16.7 ms, the main thread is in trouble.
- **Long tasks (>50 ms) feel broken.** That's the budget you're working against, not "is the code right."
- **Web Workers are the escape hatch.** They can't touch the DOM, but they can lift any non-DOM work off the main thread.
