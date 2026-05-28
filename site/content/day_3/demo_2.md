# Day 3, Demo 2 — "The DOM is not the HTML"

Companion runbook for the second demo of Day 3. Full design:
`../docs/superpowers/specs/2026-05-28-day3-demo2-dom-vs-html-design.md`.

This demo ships no code. It runs in the browser console on top of **Demo 1's
Swiggy card** and a **real public site** (Wikipedia). The big idea:

> **The HTML** is the text the server sent — frozen, in View Source.
> **The DOM** is the live object tree the browser built from it and renders the
> screen from — mutable, in the Elements tab.
> JavaScript changes the **DOM, not the HTML**. Refresh rebuilds the DOM from
> the untouched HTML.

## Setup

Start the Demo 1 server (it serves the card this demo opens with):

```bash
cd ../demo_1
source .venv/bin/activate
uvicorn server:app --host 127.0.0.1 --port 8000 --reload
```

Open `http://localhost:8000/` in Chrome. Have DevTools ready (`Cmd+Opt+I`).

## Demo flow

### 0. Slido (before anything)

> "If you change something in the Elements tab, does the original HTML file on
> the server change?"

Answer is no — but make them commit to an answer first. This forces the
HTML-vs-DOM distinction into the open.

### 0.5. DevTools tour (2 minutes, first time through)

Before mutating anything, orient them on the tabs they'll live in all session.
Open DevTools (`Cmd+Opt+I`) and name each one in a sentence:

- **Elements** — the live DOM tree (today's star).
- **Console** — run JavaScript against the page.
- **Network** — every request (you just used this in Demo 1).
- **Application** — storage and cache.
- **Performance** — profiling, for later.

> "Think of DevTools as a doctor's instruments — each tab is a different vital
> sign of the page."

### 1. The hook — call back to Demo 1's Like button

On the card, click **❤️ Like** a few times. The on-screen count climbs to, say,
**3**. Now open **View Source** (`Cmd+Opt+U`, or right-click → *View Page
Source*). Find the count — the markup still reads:

```html
<span id="like-count">0</span>
```

> "The screen says 3, the source says 0. Nobody's lying — **the screen is the
> DOM, the source is the HTML.** You already watched these diverge in Demo 1;
> you just didn't have the words for it."

### 2. "They look identical, right?"

Show **View Source** (the exact file we wrote) next to the **Elements** tab.
They look the same. Set up the reveal: they are two different things — one is
frozen text, one is a live tree.

### 3. Mutate the DOM from the console

In the Console, type:

```js
document.querySelector('h1').textContent = 'HACKED'
```

The card's heading ("Meghana Foods") becomes **HACKED**. Switch to **Elements** —
the `<h1>` now says HACKED. Switch to **View Source** (reopen it) — it still
says "Meghana Foods". *JavaScript changed the DOM, not the HTML.*

### 4. The dramatic one

```js
document.body.innerHTML = '<h1>I deleted everything</h1>'
```

The entire page is wiped to one heading.

> "The DOM is the truth. Whatever's in the DOM is what you see."

### 5. The reveal — why refresh fixes it

Hit **Refresh** (`Cmd+R`). Everything is back: the card, the image, the button.

> "Why did refresh undo it? Your edits only ever lived in the browser's memory —
> the DOM. The server resent the **same unchanged HTML**, and the browser parsed
> a brand-new clean DOM from it. The source never changed, so refresh restores
> everything."

This is the concept that makes the whole demo click.

### 6. Vandalize a real site (this is the fun part)

Open **https://en.wikipedia.org** (any article). It's public, stable, and
refresh undoes everything. Try, one at a time, in the Console:

```js
document.querySelector('h1').textContent = 'My Encyclopedia'
```
```js
document.body.style.background = 'hotpink'
```
```js
document.querySelector('header')?.remove()   // hide the top nav/header
```

**If a selector misses** (real sites change their markup): right-click any
element on the page → **Inspect**. DevTools selects it and exposes it in the
console as `$0`. Then:

```js
$0.textContent = 'whatever you want'
```
```js
$0.remove()
```

College websites work too, but their markup is unpredictable — Wikipedia is the
reliable default.

### 6.5. Semantic HTML (60-second addition)

While you're in the **Elements** tab on Wikipedia, scroll the tree and point out
the named elements: `<nav>`, `<main>`, `<article>`, `<header>`, `<footer>` —
that `<header>` you just removed was one of them.

> "These aren't just for tidiness. Screen readers for blind users navigate a
> page *by* these landmarks — 'jump to main', 'jump to navigation.' Search
> engines use them to understand structure. You could build the whole page out
> of `<div>`s and it'd look identical — but you'd throw all of that away. Using
> the right element costs you nothing."

(Our own Swiggy card already does this — the card is a `<main>`, the name is an
`<h1>`.)

### 7. Reframe (and defuse "is this hacking?")

A web page is not a sealed artifact — it's a **data structure you can reach into
and edit**. And this is entirely **local**: you changed only your browser's
in-memory DOM. Nobody else sees it, you didn't touch the server, and refresh
resets it. (So no — this isn't hacking.)

## Conceptual sidebar

- **HTML** — the recipe the server sent, as static text in the HTTP response.
- **DOM** — the live tree the browser built from that text and holds in memory;
  the rendered screen is a picture of the DOM.
- **View Source** shows the original served HTML. **Elements** shows the current
  DOM serialized back to HTML-looking text. They match only until the first
  script (or console command) runs — then they diverge.
