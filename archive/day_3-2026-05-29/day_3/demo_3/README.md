# "Why order matters"

Where you put a `<script>` tag decides whether your page is blank for two seconds. Same Swiggy card, same `slow.js`, three placements — three completely different experiences.

## Setup

Use the tab picker above the iframe to switch between **Index**, **A: blocking in `<head>`**, **B: `defer` in `<head>`**, and **C: end of `<body>`**.

1. Open DevTools → **Network** tab and set throttling to **Slow 3G**.
2. Open the **Console** too — `slow.js` logs when it starts and finishes.
3. Click reload inside the iframe and watch *when* the Meghana Foods card appears.

Try the versions in order: **A** (the painful one), then **C**, then **B**. You'll feel the difference more than you'll read it.

## Content

### A plain `<script>` blocks the parser

<p class="beat__lede">When the parser hits a <code>&lt;script src="…"&gt;</code>, it stops — fully stops — until that script has downloaded and finished running. <strong>Why so paranoid?</strong> A legacy script can call <code>document.write</code> and rewrite the page mid-parse. The browser plays it safe and pauses everything.</p>

<figure class="beat__visual">
<render-pipeline blocked="parse-html" note="A blocking <script> in <head> pauses Parse HTML. Render tree, layout, paint — all of them sit idle until the script has downloaded and run."></render-pipeline>
</figure>

### Three placements, three timelines

<p class="beat__lede">Same HTML, same <code>slow.js</code> (a 1.5 s download plus a 2 s CPU loop). The orange dot is the moment the user actually sees the restaurant card.</p>

- **A — blocking in `<head>`**: parser stops. Download → run → *then* render the rest. First paint ~3.5 s.
- **B — `defer` in `<head>`**: parser keeps going. Browser fetches the script in parallel, runs it after the document is parsed. First paint ~0.6 s.
- **C — end of `<body>`**: parser runs to the end. *Now* it discovers the script and starts the download. First paint ~0.8 s, but the script runs late.

<figure class="beat__visual">
<div class="script-timeline">
  <div class="script-timeline__axis">
    <span>0s</span><span>1s</span><span>2s</span><span>3s</span><span>4s</span>
  </div>
  <div class="script-timeline__row">
    <span class="script-timeline__label">A — blocking in <code>&lt;head&gt;</code></span>
    <div class="script-timeline__track">
      <span class="script-timeline__bar script-timeline__bar--parse" style="left:0%;width:3%" title="parse head"></span>
      <span class="script-timeline__bar script-timeline__bar--fetch" style="left:3%;width:37%" title="fetch slow.js (parser blocked)"></span>
      <span class="script-timeline__bar script-timeline__bar--run" style="left:40%;width:50%" title="run slow.js (main thread frozen)"></span>
      <span class="script-timeline__bar script-timeline__bar--parse" style="left:90%;width:6%" title="parse body + render"></span>
      <span class="script-timeline__paint" style="left:88%"></span>
    </div>
    <span class="script-timeline__verdict">visible ~3.5 s</span>
  </div>
  <div class="script-timeline__row">
    <span class="script-timeline__label">B — <code>defer</code> in <code>&lt;head&gt;</code></span>
    <div class="script-timeline__track">
      <span class="script-timeline__bar script-timeline__bar--parse" style="left:0%;width:15%" title="parse HTML"></span>
      <span class="script-timeline__bar script-timeline__bar--fetch script-timeline__bar--parallel" style="left:0%;width:37%;top:14px" title="fetch slow.js in parallel"></span>
      <span class="script-timeline__bar script-timeline__bar--run" style="left:40%;width:50%" title="run slow.js after parse"></span>
      <span class="script-timeline__paint" style="left:15%"></span>
    </div>
    <span class="script-timeline__verdict">visible ~0.6 s</span>
  </div>
  <div class="script-timeline__row">
    <span class="script-timeline__label">C — end of <code>&lt;body&gt;</code></span>
    <div class="script-timeline__track">
      <span class="script-timeline__bar script-timeline__bar--parse" style="left:0%;width:20%" title="parse HTML to bottom"></span>
      <span class="script-timeline__bar script-timeline__bar--fetch" style="left:20%;width:37%" title="fetch slow.js"></span>
      <span class="script-timeline__bar script-timeline__bar--run" style="left:57%;width:50%" title="run slow.js (page already painted)"></span>
      <span class="script-timeline__paint" style="left:20%"></span>
    </div>
    <span class="script-timeline__verdict">visible ~0.8 s</span>
  </div>
  <div class="script-timeline__legend">
    <span><i class="script-timeline__chip script-timeline__chip--parse"></i> parse HTML</span>
    <span><i class="script-timeline__chip script-timeline__chip--fetch"></i> fetch <code>slow.js</code></span>
    <span><i class="script-timeline__chip script-timeline__chip--run"></i> run <code>slow.js</code></span>
    <span><i class="script-timeline__chip script-timeline__chip--paint"></i> first paint</span>
  </div>
</div>
</figure>

<p class="try-live"><strong>↻ Try it live:</strong> Open <strong>A</strong> on Slow 3G first — count the seconds the page stays blank. Now <strong>B</strong>: the card paints almost immediately, but try clicking <strong>Like</strong> in the next two seconds — frozen, because the CPU loop runs after parse. Now <strong>C</strong>: paints fast like B, but the script doesn't even start downloading until the body's done. On a real app with hundreds of KB of JS, that delay hurts.</p>

### Why `defer` in `<head>` wins

<p class="beat__lede">B is best because it does two things in parallel that the others do in sequence.</p>

- **The download starts immediately.** The browser sees the `<script src="…">` in `<head>` and kicks off the request right away — before it's even parsed the body.
- **The parsing doesn't wait.** `defer` says "you can keep going; I'll run after you're done." So the parser hits the closing `</html>` while the script is still flying down the wire.
- **C wastes the head-start.** End-of-body placement only *discovers* the script after parsing the whole document. The fetch starts late, even though it's no faster than B's fetch.

### Once a script runs, it owns the main thread

<p class="beat__lede"><code>defer</code> and <code>async</code> solve the <em>download</em> problem. They cannot solve the <em>execution</em> problem.</p>

- The main thread is single-threaded — it parses HTML, runs JS, computes layout, and paints one at a time. A 2-second CPU loop freezes the page for 2 seconds, no matter where you put the script. That's why `slow.js` in B still leaves the Like button dead for 2 seconds even though the card painted fast.
- The real fix isn't placement — it's **doing less work**, doing it off-thread (Web Workers), or breaking it into chunks the browser can paint between.

We come back to this in **Demo 4** when we look at expensive DOM operations.

### `async` vs `defer`

<p class="beat__lede">Both keep the parser moving. They differ in <em>when</em> the script runs and whether order is preserved.</p>

- **`defer`** — fetch in parallel, run after parsing, **in document order**. Use for everything that depends on DOM or other scripts. This is the default you want.
- **`async`** — fetch in parallel, run **the moment it lands**. Order is whatever the network decides. Use only for genuinely independent scripts: analytics, error reporters, ad pixels.
- **`type="module"`** — defers by default. ES modules behave like `defer` unless you explicitly add `async`.
- **No attribute (blocking)** — almost never the right choice in modern code. The one exception is a tiny inline script that *must* run before paint (e.g. setting a theme class to avoid flash of unstyled content).

### CSS is render-blocking too

<p class="beat__lede">Same problem, different stage. The browser refuses to paint a single pixel until it has all the CSS.</p>

- When the parser hits `<link rel="stylesheet">`, the parser keeps going — but **paint is held back** until the CSS arrives and the CSSOM is built.
- This is why a stylesheet at the bottom of `<head>` is fine, but a stylesheet referenced halfway through `<body>` causes a flash of unstyled content.
- **Inline critical CSS** in `<head>` so the first paint doesn't wait on a stylesheet round-trip. Then load the rest with `media="print" onload="…"` tricks or a stylesheet at the end.

## Takeaways

- **Default to `defer` on every external script in `<head>`.** Closest thing to a free lunch in frontend performance.
- **Use `async` only for genuinely independent scripts** — analytics, error pixels. Order is not guaranteed.
- **"Render-blocking" is about the main thread, not just the network.** `defer` saves the download; it can't save you from a 2-second CPU loop.
- **CSS is render-blocking too** — inline critical CSS so the first paint doesn't wait.
