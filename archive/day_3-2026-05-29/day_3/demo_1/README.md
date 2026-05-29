# "What just happened?"

You typed one URL. You got back one card. Feels like one thing, right? It isn't. The Meghana card on the left took several conversations with two different servers, in a careful order, to put on your screen. This demo traces them.

## Setup

Get DevTools ready before we start:

1. Open DevTools. **Cmd-Opt-I** on Mac, **F12** on Windows/Linux.
2. Click *inside* the iframe so DevTools targets it (not this page).
3. Go to the **Network** tab.
4. Reload **inside the iframe** — the reload button at the top of the iframe, or right-click → Reload. **Cmd-R reloads this whole page, not the iframe** — resist the reflex.

### Or run it locally

```bash
cd day_3/demo_1
uvicorn server:app --host 127.0.0.1 --port 8000 --reload
```

Open `http://localhost:8000/`. The terminal logs every request the browser makes — same set you see in DevTools.

## Recap — clients and servers

<p class="beat__lede">Every web interaction is a conversation: a request, then a response.</p>

From Day 1:

- A **client** (your browser, the Swiggy app, a curl command) sends a **request**.
- A **server** sends back a **response** — usually HTML, sometimes JSON, sometimes an image.
- That's the whole protocol. **One conversation = one request + one response.** The web is millions of these per second.

<figure class="beat__visual">
  <div class="rr-cycle" aria-hidden="true">
    <div class="rr-cycle__node">
      <strong>Browser</strong>
      <small>your client</small>
    </div>
    <div class="rr-cycle__wire">
      <div class="rr-cycle__arrow"><span>GET /</span></div>
      <div class="rr-cycle__arrow rr-cycle__arrow--down"><span>200 OK + HTML</span></div>
    </div>
    <div class="rr-cycle__node">
      <strong>Server</strong>
      <small>somewhere on the internet</small>
    </div>
  </div>
</figure>

For the Meghana card on the left, the kickoff is exactly this: `GET /` → server responds with an HTML document. Everything else happens *after* that first response lands.

## Content

### From bytes to pixels — the spine of Day 3

<p class="beat__lede">Between "bytes arrive" and "you see the page," the browser runs a small pipeline. Once you can name its stages, every other thing on Day 3 is a story about one of them.</p>

Each network response feeds the pipeline at a different point. HTML bytes feed the HTML parser, which builds the **DOM tree** — a tree of object nodes, one per tag. CSS bytes feed the CSS parser, which builds the **CSSOM** — a lookup of rules. The two run in parallel. The browser combines them into a **render tree**: every visible node with its computed styles already attached. **Layout** computes each box's exact position and size. **Paint** rasterises the boxes into pixels. **Composite** stacks the painted layers into the final frame on your screen.

A peek at `style.css` shows just how much of the visual outcome lives in the stylesheet — the rounded corners, the shadow, the orange Like button, the colour tokens:

```css
.card {
  width: 360px;
  background: #fff;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.12);
}

.like {
  border: 1.5px solid var(--swiggy);   /* --swiggy: #fc8019 */
  color: var(--swiggy);
  background: #fff;
  border-radius: 10px;
}
.like.is-liked { background: var(--swiggy); color: #fff; }
```

Without the CSS the HTML would still arrive and parse — you'd just see unstyled text on a white page. With it, the browser runs the pipeline below and the Swiggy card appears. Critically, **the browser refuses to paint pixels until the CSS lands** — otherwise you'd see a flash of unstyled content.

<figure class="beat__visual">
<render-pipeline-outputs></render-pipeline-outputs>
</figure>

#### Where JavaScript fits

JavaScript is the stage that doesn't sit on the straight line — it shows up everywhere. When the HTML parser hits a `<script>` tag without `defer` or `async`, it **stops parsing** and runs the script to completion before continuing. While running, that script can read the DOM, mutate the DOM, edit the CSSOM, or schedule callbacks for later. And after the page has first-painted, any JS change to the DOM forces the **render tree → layout → paint** chain to run again — usually partially, sometimes for just one node.

That's the pipeline's second life: it isn't a one-shot trip. It runs once for first paint, then it loops, in miniature, every time JS touches the page.

<figure class="beat__visual">
<pipeline-loop></pipeline-loop>
</figure>

#### The spine of today

The demos below are not unrelated tricks. They are stories about specific stages — or, in one case, about what lives *outside* the pipeline entirely:

- **Demo 2 — the DOM stage.** The live tree you can mutate from the console without the HTML ever changing.
- **Demo 2.5 — storage, *outside* the pipeline.** Cookies, localStorage and sessionStorage never enter the render path. They're the browser's persistence layer, sitting alongside the pipeline rather than feeding it.
- **Demo 3 — JS execution, mid-parse.** What happens to the pipeline when the parser hits a blocking `<script>`.
- **Demo 4 — the layout stage.** Why reading layout from JS in a hot loop turns the loop into a freeze.
- **Demos 5 & 6 — the JS-edits-DOM loop, at scale.** What React does to it (spoiler: not less work — *batched* work).
- **Demo 7 — who runs the pipeline.** SSG/SSR run it on a server; CSR runs it in your browser. Same pipeline, different machine.
- **Demo 8 — the handoff.** A server-run pipeline pre-paints the page; a browser-run pipeline takes over. The gap between them is "hydration."
- **Demo 10 — what an attacker injects into the DOM stage** when you forget to sanitise.

Bookmark this section. Any time a later demo feels like a parlour trick, come back here and ask: *which stage is this messing with?*

<p class="try-live"><strong>↻ Try it live:</strong> right-click in the iframe → <strong>View Page Source</strong> for the raw HTML the parser saw. Then in <strong>Network</strong>, find <code>style.css</code> — click it → <strong>Response</strong> tab shows the CSS rules the CSSOM was built from. You're looking at the inputs to stages ① and ②.</p>

### One URL, many requests

The first response back from the server is HTML — and that HTML is a shopping list. Every `<link>`, `<script>`, and `<img>` is a separate request the browser fires off next. Open `index.html` from the demo and you can count them by reading the tags:

```html
<head>
  <!-- Request: Google Fonts stylesheet (triggers another request for the font file). -->
  <link rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&display=swap" />
  <!-- Request: our own stylesheet. Render-blocking. -->
  <link rel="stylesheet" href="style.css" />
</head>
<body>
  <main class="card">
    <!-- Request: the heavy image. -->
    <img class="card__img" src="meghana-biryani.jpg" alt="Meghana Foods biryani" />
    ...
    <button id="like" class="like" type="button">🤍 Like <span id="like-count">0</span></button>
  </main>
  <!-- Request: the behavior. -->
  <script src="app.js" defer></script>
</body>
```

Six requests for this tiny card: HTML, CSS, JS, image, Google's font stylesheet, and the font file that stylesheet points to. The browser also asks for `/favicon.ico` on its own, so DevTools shows a seventh row with a 404. Google's homepage triggers 50+. A typical e-commerce page often crosses 100.

A subtle one: the Google Fonts stylesheet doesn't *contain* the font — it's a CSS file that *points to* one. The browser can't even start the font-file request until the font CSS arrives and tells it where to look. That's why some bars in the waterfall start late: they were waiting on something earlier to even know they existed. Look for **staircase shapes**.

<figure class="beat__visual">
  <div class="waterfall waterfall--animated" aria-hidden="true">
    <div class="waterfall__row" data-stage="html">
      <span class="waterfall__dot"></span>
      <span class="waterfall__name">/ (HTML)</span>
      <span class="waterfall__track"><span class="waterfall__bar" style="left: 0%; width: 24%"></span></span>
    </div>
    <div class="waterfall__row" data-stage="css">
      <span class="waterfall__dot"></span>
      <span class="waterfall__name">style.css</span>
      <span class="waterfall__track"><span class="waterfall__bar" style="left: 24%; width: 16%"></span></span>
    </div>
    <div class="waterfall__row" data-stage="js">
      <span class="waterfall__dot"></span>
      <span class="waterfall__name">app.js</span>
      <span class="waterfall__track"><span class="waterfall__bar" style="left: 24%; width: 72%"></span></span>
    </div>
    <div class="waterfall__row" data-stage="img">
      <span class="waterfall__dot"></span>
      <span class="waterfall__name">biryani.jpg</span>
      <span class="waterfall__track"><span class="waterfall__bar" style="left: 24%; width: 46%"></span></span>
    </div>
    <div class="waterfall__row" data-stage="fontscss">
      <span class="waterfall__dot waterfall__dot--neutral"></span>
      <span class="waterfall__name">fonts.css</span>
      <span class="waterfall__track"><span class="waterfall__bar waterfall__bar--neutral" style="left: 24%; width: 12%"></span></span>
    </div>
    <div class="waterfall__row" data-stage="woff2">
      <span class="waterfall__dot waterfall__dot--neutral"></span>
      <span class="waterfall__name">poppins.woff2</span>
      <span class="waterfall__track"><span class="waterfall__bar waterfall__bar--neutral" style="left: 38%; width: 18%"></span></span>
    </div>
    <p class="waterfall__caption">orange = your server · grey = Google Fonts · <code>poppins.woff2</code> starts where <code>fonts.css</code> ends — that's a chained dependency.</p>
  </div>
</figure>

<p class="try-live"><strong>↻ Try it live:</strong> reload the iframe with <strong>Network</strong> open and count the rows. Six (plus favicon). Click the first row (<code>/</code>) → <strong>Headers</strong> tab shows the request your browser sent and the response the server returned. That's one conversation.</p>

### Making it interactive

HTML and CSS make a brochure. JavaScript makes it an app. The Like button is already in the HTML — `<button id="like">` — and CSS gives it the orange outline. But clicking it does nothing until `app.js` lands and wires up a handler. The whole behaviour layer for the card is twenty lines:

```js
const button = document.getElementById("like");
const count = document.getElementById("like-count");
let likes = 0;

button.addEventListener("click", function () {
  likes += 1;
  count.textContent = String(likes);
  button.classList.add("is-liked");
  button.firstChild.textContent = "❤️ Liked ";
});
```

Without that file, every interaction would mean a full page reload from the server. With it, the page *reacts* in place — the count goes up, the heart flips to red, the button stays orange-filled (because the JS added the `is-liked` class that the CSS above is already styled for).

<figure class="beat__visual">
  <div class="click-fx" aria-hidden="true">
    <div class="click-fx__step">
      <span class="click-fx__btn">🤍 Like 0</span>
      <span>before</span>
    </div>
    <span class="click-fx__arrow">→</span>
    <div class="click-fx__step">
      <span class="click-fx__code">click → app.js runs</span>
      <span>handler</span>
    </div>
    <span class="click-fx__arrow">→</span>
    <div class="click-fx__step">
      <span class="click-fx__btn click-fx__btn--active">❤️ Liked 1</span>
      <span>after</span>
    </div>
  </div>
</figure>

<p class="try-live"><strong>↻ Try it live:</strong> in DevTools → <strong>Sources</strong> → <code>app.js</code>. Read the handler. Click the heart in the iframe to watch it run.</p>

### When the network is slow (and how caching saves you)

If the CSS or the JS lags, the page lies to you. Two distinct failure modes:

- **Slow CSS → no pixels at all.** The browser holds back paint. The user stares at a blank tab.
- **Slow JS → pixels but no interaction.** The card paints beautifully — looks done. Click Like? Nothing happens. The button is just decoration until `app.js` arrives.

This demo's server *deliberately* holds back `app.js` for 3 seconds so you can see the second case even on localhost. It's a teaching device, not real behaviour — the only "trick" is one `asyncio.sleep` in the route:

```python
APP_JS_DELAY_SECONDS = float(os.environ.get("APP_JS_DELAY_SECONDS", "3"))

@app.get("/app.js")
async def slow_app_js():
    if APP_JS_DELAY_SECONDS > 0:
        await asyncio.sleep(APP_JS_DELAY_SECONDS)   # ← the gap you'll feel
    return FileResponse(HERE / "app.js", media_type="text/javascript")
```

<figure class="beat__visual">
  <div style="display: flex; flex-direction: column; align-items: center;">
    <div class="mini-card" aria-hidden="true">
      <div class="mini-card__img"><img src="/live-demos/demo_1/meghana-biryani.jpg" alt="Meghana Foods biryani" /></div>
      <div class="mini-card__body">
        <p class="mini-card__name">Meghana Foods</p>
        <p class="mini-card__meta">★ 4.3 · 40 mins · ₹500 for two</p>
        <span class="mini-card__like mini-card__like--dead">🤍 Like 0</span>
      </div>
    </div>
    <p class="mini-card-dead-hint">click does nothing — <code>app.js</code> hasn't loaded yet</p>
    <span class="js-clock">🕒 app.js · waiting (3s)</span>
  </div>
</figure>

"Slow" isn't even one thing. Slow 3G does two things at once: it adds **round-trip delay** to every request *and* caps **bandwidth**. Small files like `app.js` (10 KB) struggle on the round-trip — every TCP/TLS handshake adds hundreds of milliseconds before any bytes flow. Big files like `biryani.jpg` (500 KB) struggle on bandwidth — the bytes drip through a narrow pipe. Same network, two reasons something feels slow, fixed differently.

The browser also gets to skip work it's already done. When the server attaches `Cache-Control: max-age=3600` to a response, it's saying "you can reuse this for the next hour." The browser writes the file to **disk cache**, and on the next visit it skips the network entirely — that's the `(disk cache)` label and `0 ms` time in DevTools. The HTML itself is marked `no-cache`, which doesn't actually mean "don't cache" — it means "re-validate every time": the browser sends an `If-Modified-Since` and the server usually replies `304 Not Modified` with no body, so the document stays fresh without paying for its bytes again. The heavy stuff (images, CSS, JS) doesn't even have to re-validate. Caching is opt-in, header by header — and this demo's server does it explicitly:

```python
CACHEABLE = (".css", ".js", ".jpg", ".jpeg", ".png", ".ico", ".woff2")

if response.status_code == 200:
    if request.url.path.endswith(CACHEABLE):
        response.headers["Cache-Control"] = "max-age=3600"   # reuse for an hour
    else:
        response.headers["Cache-Control"] = "no-cache"        # HTML re-validates
```

<p class="try-live"><strong>↻ Try it live:</strong> in Network, switch throttling to <strong>Slow 3G</strong> and reload the iframe. Watch the card paint <em>fast</em>, but the Like button stay dead for ~3 seconds. Now for the cache half: <strong>uncheck Disable cache</strong> in the Network toolbar (we turned it on during Setup so the request counts were honest — the cache lesson needs the opposite). Turn throttling off and reload twice — on the second reload, most rows say <code>(disk cache)</code> with <code>0 ms</code>, and <code>/</code> (the HTML) says <code>304 Not Modified</code> with a tiny size. Click any cached row → <strong>Headers</strong> shows the <code>Cache-Control</code> the server attached.</p>

## Takeaways

- **A page is many conversations, not one.** HTML, then CSS, then JS, then images. Each its own request.
- **The render pipeline is the spine of today.** DOM + CSSOM → render tree → layout → paint → composite. Every demo below is a story about one of these stages — or about JavaScript editing the DOM and forcing the chain to run again.
- **CSS blocks paint. JS blocks interaction.** That's the gap where a card looks done but the Like button is dead.
- **Some requests wait on other requests.** Watch for staircase shapes in the waterfall.
- **Slow has two flavors.** Latency stalls small files; bandwidth stalls big ones. Same network, different fixes.
- **The second reload is almost free** — but only because the server sent `Cache-Control`. Caching is opt-in, header by header.
- **Disable cache** in DevTools to see what a first-time visitor sees. Your users aren't reloading like you are.
