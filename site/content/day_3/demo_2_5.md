# Day 3, Demo 2.5 — "Your browser is holding your data" (Storage)

Companion runbook for the storage demo of Day 3. Full design:
`../docs/superpowers/specs/2026-05-28-day3-demo2_5-storage-design.md`.

The browser stores data for every site you visit. Cookies, localStorage,
sessionStorage, IndexedDB — four stores, four jobs. The one distinction that
decides everything:

> **Cookies are sent to the server automatically on every request.**
> **localStorage and sessionStorage never leave the browser.**
>
> Auth lives in cookies (the *server* needs it). UI prefs live in localStorage
> (only the *browser* cares).

Demo 2 showed that JavaScript edits live in memory and die on refresh. This demo
shows the storage that *survives* refresh — and the rules for each kind. Cookies
and IndexedDB are shown on **real sites** you're already logged into; our little
Swiggy page makes localStorage and sessionStorage reliable and offline.

## What's here

- `index.html` — a Swiggy "Preferences & Checkout" page: a dark-mode toggle and
  a 3-step checkout with Next/Back.
- `app.js` — reads `swiggy:theme` (localStorage) and `swiggy:checkoutStep`
  (sessionStorage) on load; the toggle and buttons write them. No deps.
- `style.css` — Swiggy-orange (`#fc8019`) accents with a `[data-theme="dark"]`
  block; emoji/gradients only, fully offline.
- `server.py` — FastAPI static server that logs every request. No delays.
- `test_server.py` — pytest (serving + content-types + logging).
- `requirements.txt` — `fastapi`, `uvicorn`, `httpx`, `pytest`.

## Setup & run

```bash
cd day_3/demo_2_5
python3 -m venv .venv && source .venv/bin/activate   # first time only
pip install -r requirements.txt                       # first time only
uvicorn server:app --host 127.0.0.1 --port 8000 --reload
```

Open `http://localhost:8000/` and keep **DevTools → Application** open. You'll
also drop into the **Console** for one-liners.

## Demo flow

### 0. Slido (before anything)

> "You're building a **'remember me'** login. Do you store the token in
> **localStorage** or in a **cookie**?"

The answer is **cookies** — the *server* needs the token on every request to
know who you are, and cookies are the only one of these that's sent to the server
automatically. It's a common interview question. Let them commit to an answer
first; the whole demo is the explanation of why.

### 1. Cookies — the one that talks to the server (on a real site)

Open a site you're logged into — **Swiggy.com** or **YouTube**. DevTools →
**Application → Cookies** → pick the domain. Find a session/auth cookie (names
like `_session`, `SID`, `__Secure-...`). Point at it:

> "This value is attached to **every single request** your browser makes to this
> domain — automatically, you never write code to do it. That's how the server
> knows it's still you between page loads. HTTP itself is forgetful; the cookie
> is the memory."

Now the Console:

```js
document.cookie
```

A semicolon-separated key-value mess. (Note: `HttpOnly` auth cookies won't show
here — mention that's *by design*, so scripts can't steal the token. Don't dwell.)

### 2. localStorage — persists forever, never leaves the browser (our page)

Switch to `http://localhost:8000/`. Toggle **🌙 Dark mode** on. In DevTools →
**Application → Local Storage** → the localhost origin, the key appears:

```
swiggy:theme  →  dark
```

Now **reload** (`Cmd+R`). Still dark — the page read the key on load and applied
it. Console:

```js
localStorage.getItem('swiggy:theme')   // "dark"
```

**Close the tab and reopen** the URL (or open a new tab) — still dark.
localStorage is shared across every tab on the origin and survives a browser
restart. Then wipe it:

```js
localStorage.clear()
```

Reload — back to light.

> "This is how 'remember my preferences,' dark mode, and language switchers work.
> It **persists until something explicitly deletes it**, and it **never touches
> the server** — which is exactly why you do *not* put an auth token here."

### 3. sessionStorage — scoped to the tab (our page)

Same page. Click **Next →** a couple of times to reach **Step 2/3 — Payment**. In
**Application → Session Storage** the key appears:

```
swiggy:checkoutStep  →  2
```

**Reload.** The step survives — you're still on Payment. Console:

```js
sessionStorage.getItem('swiggy:checkoutStep')   // "2"
```

Now open the **same URL in a new tab**. It starts back at **Step 1** — the new
tab's sessionStorage is empty (`null`).

```js
sessionStorage.getItem('swiggy:checkoutStep')   // null  (in the new tab)
```

> "sessionStorage is scoped to the **tab**. It survives a refresh but not a new
> tab and not closing the tab. Perfect for a multi-step form: an accidental
> refresh shouldn't lose your progress, but the data shouldn't leak into other
> tabs or stick around forever."

### 4. IndexedDB — the database in your browser (30-second mention)

Open **Gmail** or **YouTube**. DevTools → **Application → IndexedDB** → expand the
tree. Several named databases with object stores full of rows.

> "When key-value isn't enough, the browser ships a **full database engine** —
> IndexedDB. Gmail uses it to hold your mail so it can **work offline** and search
> instantly. You won't touch it by hand, but now you know what those entries are."

### 5. Drive it home

> **Cookies go to the server on every request; localStorage and sessionStorage
> never do.** That single fact decides where data belongs:
> - **Auth token** → cookie (the server must see it).
> - **Dark mode / language** → localStorage (persists; only the browser cares).
> - **Multi-step form progress** → sessionStorage (per-tab, survives refresh).
> - **Offline app data** → IndexedDB (a real database).

## Pre-session checklist

- [ ] `.venv` exists and `pip install -r requirements.txt` succeeds.
- [ ] `python -m pytest -q` passes (5 tests).
- [ ] `uvicorn server:app ...` runs; the page renders at `http://localhost:8000/`.
- [ ] Dark toggle survives a reload **and** a new tab; `localStorage.clear()`
      resets it. Practised once.
- [ ] Checkout step survives a reload but reads `null` in a new tab. Practised once.
- [ ] Logged into Swiggy.com / YouTube for the cookie beat; Gmail/YouTube open
      for the IndexedDB beat.
- [ ] Display sleep / Caffeinate enabled for the session duration.
