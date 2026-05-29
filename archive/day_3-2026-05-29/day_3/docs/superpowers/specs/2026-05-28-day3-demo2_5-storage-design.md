# Day 3, Demo 2.5 — "Your browser is holding your data" (Storage)

**Date:** 2026-05-28
**Status:** Approved design
**Part of:** Day 3 — Demystifying Frontend Engineering. Sits between Demo 2 (the
DOM) and Demo 3 (render blocking); continues the Swiggy spine.

## Purpose

Make the browser's storage mechanisms **concrete**, and burn in the single
distinction that actually matters in interviews and in practice:

> **Cookies are sent to the server automatically on every request. localStorage
> and sessionStorage never leave the browser.**

That one fact decides where data belongs. Auth tokens live in cookies because
the **server** needs them on every request to know who you are. UI preferences
(dark mode, language) live in localStorage because **only the browser** cares.
Demo 2 showed that JavaScript changes live in memory and die on refresh; this
demo shows the storage that *survives* refresh — and the rules for each kind.

## Approach

Cookies and IndexedDB are demoed on **real sites** (Swiggy/YouTube, Gmail) where
they already exist — no need to fake a login. localStorage and sessionStorage
are demoed on **our own page**, where the instructor controls the keys and the
behaviour is 100% reliable offline.

Build a small Swiggy-themed "preferences / checkout" page that makes the two
browser-only stores tangible:

- **Dark mode toggle → localStorage** (`swiggy:theme`). The page reads the key on
  load and applies the theme before paint, so a reload stays dark. Persists
  across reloads *and* new tabs *and* browser restarts — until explicitly
  cleared. This is how "remember my preferences" works.
- **Checkout step counter → sessionStorage** (`swiggy:checkoutStep`). Next/Back
  buttons move through a 3-step Swiggy checkout (Address → Payment → Confirm).
  The step is read on load and survives a **reload**, but a **new tab** starts
  fresh (`null`). This is how a multi-step form survives a refresh but not the
  session.

Served by a tiny FastAPI static server (Demo 3 pattern, **no artificial delays**)
that logs every request, so the terminal mirrors what the browser fetches.

## Files (`day_3/demo_2_5/`)

| File | Role |
|---|---|
| `index.html` | The Swiggy preferences/checkout page: a dark-mode toggle and a 3-step checkout with Next/Back. Semantic markup, Swiggy-orange accents. |
| `app.js` | Reads `swiggy:theme` from localStorage on load and applies it; toggle writes it. Reads `swiggy:checkoutStep` from sessionStorage on load; Next/Back write it. Pure vanilla JS, no deps. |
| `style.css` | Swiggy-orange (`#fc8019`) accents; a `[data-theme="dark"]` block for dark mode; food emoji / CSS gradients only. |
| `server.py` | FastAPI static server (Demo 3 pattern) with per-request terminal logging. No delays. |
| `requirements.txt` | `fastapi`, `uvicorn`, `httpx`, `pytest`. |
| `test_server.py` | pytest: page serves 200 and contains expected markup; `app.js`/`style.css` serve with the right content-types; requests are logged. |
| `README.md` | The runbook (Slido, demo flow, checklist). |

## Demo flow (lands in `README.md`)

0. **Slido** (before anything): "You're building a 'remember me' login.
   localStorage or cookies?" Answer: **cookies** — the server needs the token on
   every request. Common interview question; let them commit first.
1. **Cookies** (real site): DevTools → Application → Cookies on a logged-in
   Swiggy.com / YouTube. Point at the session/auth token: "sent to the server on
   **every** request to this domain — that's how it knows you're logged in."
   Console: `document.cookie` shows the key-value string.
2. **localStorage** (our page): toggle dark mode → Application → Local Storage
   shows `swiggy:theme`. Reload → still dark. Console:
   `localStorage.getItem('swiggy:theme')`. New tab → still there. `localStorage.clear()`
   → gone. "Persists until explicitly deleted. This is dark mode / language /
   'remember my prefs.'"
3. **sessionStorage** (our page): advance the checkout step. Reload → step
   survives. Same URL in a **new tab** → step is reset/`null`. Console:
   `sessionStorage.getItem('swiggy:checkoutStep')`. "Scoped to the tab. Good for
   a multi-step form that survives a refresh but not the session."
4. **IndexedDB** (30-second mention): Application → IndexedDB on Gmail/YouTube →
   show the databases. "A full database engine in the browser. Gmail uses it to
   work offline."
5. **Drive it home:** the cookies-vs-storage blockquote.

## Verification

- `test_server.py` passes: `/` serves 200 with the expected markup (the toggle,
  the checkout steps); `app.js` serves with a javascript content-type and
  `style.css` with a CSS content-type; the request counter increments (logging).
- Manual: toggle survives reload + new tab; checkout step survives reload but is
  `null` in a new tab. Practised once.

## Out of scope

- A real login / real cookies set by **our** server — cookies are demoed on a
  real site the instructor is already logged into, so we never fake auth.
- IndexedDB code of our own (it gets a 30-second tour on Gmail/YouTube only).
- Cookie attributes (`HttpOnly`, `Secure`, `SameSite`), `Cache-Control`, or
  service workers — named at most in passing, not demoed.
- Any artificial server delay (that was Demo 1/3's device; not needed here).
