# "The DOM is not the HTML"

You probably think "the HTML" and "what's on the screen" are the same thing. They're not — and the gap between them is where most of frontend development lives. In sixty seconds, you'll edit a real website inside your own browser without touching the server.

## Setup

You'll run this one entirely in DevTools — there's no code to install.

1. From Demo 1, click the **↗ Open in new tab** button on the floating PIP toolbar so the Swiggy card opens in its own tab. Switch back here for the runbook.
2. In the Swiggy tab, press **Cmd+Opt+I** (Mac) or **Ctrl+Shift+I** (Windows/Linux) to open DevTools.
3. You want three things open: the **Elements** tab (the live DOM), the **Console** tab (where you'll type), and **View Page Source** (right-click anywhere on the card → "View Page Source" in a new tab — that's the raw HTML the server sent).

## Content

### HTML is text. The DOM is a tree.

<p class="beat__lede">One is a frozen string the server sent. The other is a living object you can poke at.</p>

- **HTML** is text — the response body. Never changes after it leaves the server.
- **DOM** is a tree of nodes the parser built from that text. Each element is a JavaScript object with properties, children, and methods.
- Parsing is a one-way street: the browser keeps the tree, not the bytes.

<figure class="beat__visual">
<div class="before-after">
  <div class="before-after__panel">
    <small>HTML — text from the server</small>
    <pre class="before-after__html">&lt;main class="card"&gt;
  &lt;h1 class="card__name"&gt;Meghana Foods&lt;/h1&gt;
  &lt;p class="card__meta"&gt;★ 4.3 · 40 mins · ₹500 for two&lt;/p&gt;
  &lt;button id="like"&gt;🤍 Like &lt;span id="like-count"&gt;0&lt;/span&gt;&lt;/button&gt;
&lt;/main&gt;</pre>
  </div>
  <div class="before-after__panel">
    <small>DOM — tree in memory</small>
    <div class="dom-tree">
      <div class="dom-tree__root">main.card</div>
      <div class="dom-tree__node">
        <span class="dom-tree__tag">├─ h1.card__name</span>
        <span class="dom-tree__val">"Meghana Foods"</span>
      </div>
      <div class="dom-tree__node">
        <span class="dom-tree__tag">├─ p.card__meta</span>
        <span class="dom-tree__val">"★ 4.3 · 40 mins · ₹500…"</span>
      </div>
      <div class="dom-tree__node">
        <span class="dom-tree__tag">└─ button#like</span>
        <span class="dom-tree__val">"🤍 Like 0"</span>
      </div>
    </div>
  </div>
</div>
</figure>

### JavaScript edits the DOM, never the HTML

<p class="beat__lede">Every <code>document.querySelector(...)</code>, every <code>element.textContent = ...</code>, every React render — all of it edits the live tree. The HTML text is long gone; it lives in the Network tab as a record, not as something the browser still reads from.</p>

<p class="try-live"><strong>↻ Try it live:</strong> in the DevTools <strong>Console</strong> of your Swiggy tab, run these one at a time and watch the card:</p>

```js
document.querySelector('h1').textContent = 'HACKED'
document.body.style.background = 'hotpink'
document.body.innerHTML = '<h1>I deleted everything</h1>'
```

### Three views, three truths

<p class="beat__lede">DevTools gives you three lenses on the same page. They agree at page load — and start disagreeing the moment any script runs.</p>

- **The rendered page** — the pixels. Painted from the current DOM.
- **Elements** — the current DOM serialised back into HTML-looking text. Updates live as JS mutates the tree.
- **View Source** — the original HTML response. Frozen in time. Nothing on the page after load can change it.

<figure class="beat__visual">
<div class="three-views" aria-hidden="true">
  <div class="three-views__pane">
    <small>Rendered page</small>
    <div class="three-views__rendered">
      <strong>HACKED</strong>
      <span>★ 4.3 · 40 mins · ₹500</span>
      <span class="three-views__btn">🤍 Like 0</span>
    </div>
    <span class="three-views__tag three-views__tag--live">live · painted from DOM</span>
  </div>
  <div class="three-views__pane">
    <small>Elements</small>
    <pre class="three-views__html">&lt;main class="card"&gt;
  &lt;h1 class="card__name"&gt;<mark>HACKED</mark>&lt;/h1&gt;
  …
&lt;/main&gt;</pre>
    <span class="three-views__tag three-views__tag--live">live · DOM → text</span>
  </div>
  <div class="three-views__pane">
    <small>View Source</small>
    <pre class="three-views__html">&lt;main class="card"&gt;
  &lt;h1 class="card__name"&gt;Meghana Foods&lt;/h1&gt;
  …
&lt;/main&gt;</pre>
    <span class="three-views__tag three-views__tag--frozen">frozen · server's bytes</span>
  </div>
</div>
</figure>

<p class="try-live"><strong>↻ Try it live:</strong> run the three commands above, then flip to your <strong>View Source</strong> tab and refresh it. The HTML hasn't changed by a single character. Flip back to <strong>Elements</strong> — you'll see <code>&lt;h1&gt;I deleted everything&lt;/h1&gt;</code> sitting in the live tree.</p>

### Refresh resets the DOM, not the HTML

<p class="beat__lede">Your edits live in your browser's memory and nowhere else. <strong>Cmd+R</strong> asks the server for the HTML again, the browser parses it from scratch, and the new DOM has no memory of the old one.</p>

<figure class="beat__visual">
  <div class="click-fx" aria-hidden="true">
    <div class="click-fx__step">
      <span class="click-fx__btn click-fx__btn--active">h1 = "HACKED"</span>
      <span>edited DOM</span>
    </div>
    <span class="click-fx__arrow">→</span>
    <div class="click-fx__step">
      <span class="click-fx__code">Cmd+R · GET /</span>
      <span>reload</span>
    </div>
    <span class="click-fx__arrow">→</span>
    <div class="click-fx__step">
      <span class="click-fx__btn">h1 = "Meghana Foods"</span>
      <span>fresh DOM</span>
    </div>
  </div>
</figure>

<p class="try-live"><strong>↻ Try it live:</strong> hit <strong>Cmd+R</strong> after running the console commands. The card snaps back, untouched. Your edits never left your machine.</p>

### Every framework is just a DOM mutator

<p class="beat__lede">React, Vue, Svelte, Angular — they all do the same thing under the hood. The interesting differences are in <em>how</em> and <em>when</em>.</p>

- **jQuery** — you write the mutations by hand: `$('h1').text('HACKED')`.
- **React** — you describe the tree you want; React diffs it against the current DOM and applies the minimum mutations.
- **Svelte** — the compiler reads your component, figures out which mutations are needed at build time, and emits the surgical DOM calls.

End product in every case is the same `document.querySelector(...).textContent = ...` calls you just ran by hand. We'll come back to this in **Demo 6**.

### The page is a data structure

<p class="beat__lede">Once you accept that the page is a tree of objects, a lot of "magic" stops being magic.</p>

- **Browser extensions** are JavaScript that runs in the page's DOM. Adblockers find ad nodes and `.remove()` them. Dark Reader walks the tree and rewrites styles.
- **Web scrapers** like Puppeteer load pages in a headless browser and read from the DOM, not the HTML — so they see what users see (after JS runs).
- **Right-click → Inspect → `$0`** binds the clicked element to a variable in the console. `$0.remove()` deletes it. Works on every site.

<p class="try-live"><strong>↻ Try it live:</strong> open <code>https://en.wikipedia.org</code> in a new tab and run:</p>

```js
document.querySelector('h1').textContent = 'My Encyclopedia'
document.querySelector('header')?.remove()
```

## Takeaways

- **HTML** is the static text response from the server. **DOM** is the live object tree in your browser's memory.
- View Source never changes after page load. Elements changes every time anything runs.
- Refresh fetches the HTML again and rebuilds a fresh DOM — that's why your hacks vanish.
- Every framework you'll ever use is, at bottom, a fancier way to mutate the DOM.
