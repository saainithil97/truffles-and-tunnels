# Day 3, Demo 10 — "Don't trust the user, don't trust the page" (Frontend security)

Companion artifacts for the tenth demo of Day 3. Full design:
`../docs/superpowers/specs/2026-05-28-day3-demo10-frontend-security-design.md`.

A tiny Swiggy **restaurant-reviews** page with a review form that renders your
input straight into the page. The big idea:

> Anything a user types is **untrusted input**. If you drop it into the page with
> `innerHTML`, the browser will happily run any HTML — including a `<script>`-like
> payload — that the user smuggled in. That's **XSS**. And **CORS** is the
> browser's matching rule on the *other* side: it won't hand JavaScript a
> cross-origin response unless that server explicitly opted you in.

Two ideas, one page: the input you render (XSS) and the responses you're allowed
to read (CORS).

## What's here

- `index.html` — the reviews card: a review form, an UNSAFE/SAFE render toggle,
  and the feed the reviews drop into.
- `app.js` — two render paths: `addReviewUnsafe` (`element.innerHTML = userInput`,
  deliberately vulnerable) and `addReviewSafe` (`element.textContent = userInput`,
  safe by construction).
- `style.css` — Swiggy-orange card styling (emoji poster, CSS gradients; offline).
- `server.py` — FastAPI static server that logs every request (Demo 1/3 pattern).
- `test_server.py` — pytest (serving, content-types, form/feed hooks, both render
  paths present, request logging).
- `requirements.txt` — `fastapi`, `uvicorn`, `httpx`, `pytest`.

## Setup & run

```bash
cd day_3/demo_10
python3 -m venv .venv && source .venv/bin/activate   # first time only
pip install -r requirements.txt                       # first time only
uvicorn server:app --host 127.0.0.1 --port 8000 --reload
```

Open `http://localhost:8000/` and keep the **Console** open.

## Demo flow

### 0. No Slido for this one

The XSS payload popping an `alert('hacked')` is visceral enough — let the room
*see* the script run rather than poll them first. Spend the airtime on the
"in the real world this is `document.cookie`" beat instead.

### 1. A normal review works fine

Make sure the **☠️ UNSAFE — `innerHTML`** mode is selected (it's the default).
Type a normal review:

```
Great biryani!
```

Post it. It shows up in the feed. Everything looks ordinary — this is exactly
how a reviews feature is *supposed* to behave.

### 2. The attack — type HTML instead of text

Still in UNSAFE mode, post this as your "review":

```html
<img src="x" onerror="alert('hacked')">
```

An **alert box pops**. You didn't write a button for that — the *user's input*
ran JavaScript. Explain what happened: the `<img>` points at a broken source
`x`, the image fails to load, and the `onerror` handler fires — running whatever
JS the attacker put there.

> "I typed that into a *review box*. There's no `eval`, no script tag I added —
> the page took a user's text and ran it as code. That's **Cross-Site
> Scripting**, XSS. An `alert` is the harmless version. In the real world that
> `onerror` would read **`document.cookie`** — your session token — and ship it
> to the attacker's server. Now they're logged in as you."

### 3. The fix — render text as text

Flip the toggle to **✅ SAFE — `textContent`** and post the *exact same payload*:

```html
<img src="x" onerror="alert('hacked')">
```

No alert. The literal characters `<img src="x" onerror="alert('hacked')">` show
up in the feed as **text**. Open the two functions in `app.js` side by side —
the only difference is one line:

```js
li.innerHTML = text;   // UNSAFE: browser parses it as HTML
li.textContent = text; // SAFE:   browser renders it as literal text
```

> "`innerHTML` says *'this is markup, parse it.'* `textContent` says *'this is
> text, show it.'* The user's input never changed — only how we put it on the
> page. **`textContent` is the default you reach for.**"

### 4. How React handles this

> "You will rarely touch `innerHTML` again, because React escapes for you. When
> you write `{userInput}` in JSX, React renders it as text — escaped by default,
> exactly like `textContent`. The only way to get the unsafe behaviour back is to
> explicitly call **`dangerouslySetInnerHTML`** — and the scary name is the
> point. It's the one warning sign you'll almost never need. If you find yourself
> reaching for it, stop and ask why."

### 5. CORS — the other half of "don't trust"

Now flip to the response side. This expands the seed from the rendering demo
(Demo 5). Open the **Console** on *any* page (this one is fine) and try to fetch
a cross-origin API that doesn't allow your origin:

```js
fetch("https://api.github.com/repos/anthropics/anthropic-sdk-python")
  .then((r) => r.json())
  .then(console.log);
```

GitHub's API actually *does* allow cross-origin reads, so to **see the red
error** use an endpoint that doesn't send the header — for example:

```js
fetch("https://api.zomato.com/").then((r) => r.text());
```

You get a red **CORS error** in the Console:
*"...has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header..."*

Explain what *actually* happened — this is the part everyone gets wrong:

> "The request **was sent**. The server **answered**. The response came back to
> the browser. Then the browser looked at the response headers, searched for an
> **`Access-Control-Allow-Origin`** header naming *our* origin, didn't find it,
> and **refused to hand the data to our JavaScript**. The server has to *opt in*
> by sending that header. CORS isn't the server blocking you — it's the
> **browser** refusing to share a cross-origin response your JS wasn't invited
> to read."

Why the browser bothers:

> "Imagine you're logged into your bank in one tab. You open a sketchy site in
> another. Without this rule, that site's JavaScript could `fetch` your bank's
> API — your browser would attach your bank cookies automatically — and read
> your balance. CORS is the browser saying *'a cross-origin server only shares
> its data with origins it explicitly trusts.'* It's protecting **the user from
> the page**, which is the same theme as XSS — just from the other direction."

## Pre-session checklist

- [ ] `.venv` exists and `pip install -r requirements.txt` succeeds.
- [ ] `python -m pytest -q` passes (7 tests).
- [ ] `uvicorn server:app ...` runs; reviews card renders at
      `http://localhost:8000/`.
- [ ] In UNSAFE mode: "Great biryani!" posts normally; the
      `<img src="x" onerror=...>` payload **pops an alert**.
- [ ] In SAFE mode: the same payload renders as **literal text**, no alert.
- [ ] A cross-origin `fetch` in the Console produces a **red CORS error**.
      Confirm the chosen URL still lacks the header (APIs change) — keep a backup
      URL ready, since this beat needs live internet.
- [ ] Display sleep / Caffeinate enabled for the session duration.
