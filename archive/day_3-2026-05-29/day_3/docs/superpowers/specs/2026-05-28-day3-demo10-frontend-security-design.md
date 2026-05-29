# Day 3, Demo 10 — "Don't trust the user, don't trust the page" (Frontend security)

**Date:** 2026-05-28
**Status:** Approved design
**Part of:** Day 3 — Demystifying Frontend Engineering. Tenth demo; the two
security ideas every frontend dev must know — XSS (untrusted input you render)
and CORS (cross-origin responses you're allowed to read). Expands the CORS seed
planted in the rendering demo (Demo 5).

## Purpose

Make XSS **visceral** — a user types text into a review box and it runs
JavaScript — then explain the matching browser rule, CORS, that governs which
cross-origin responses JavaScript is allowed to read.

The unifying theme is *trust boundaries*: don't trust what the user typed (render
it as text, not markup), and the browser won't let your page read another
origin's response unless that origin opted in. Both protect the user; the demo
shows them from the two opposite directions.

## Approach

Build a tiny Swiggy **restaurant-reviews** page, served by the standard FastAPI
static server.

- **XSS, the unsafe path:** a review form whose input is rendered via
  `element.innerHTML = userInput`. A normal review ("Great biryani!") works
  fine; the payload `<img src="x" onerror="alert('hacked')">` executes JS — an
  alert pops. Narrate the real-world version: that `onerror` would exfiltrate
  `document.cookie` (the session token) to an attacker.
- **XSS, the safe path:** a clearly-labeled SAFE render mode (a radio toggle)
  using `element.textContent = userInput`, which renders the same payload as
  literal text. README also notes how React's `{userInput}` escapes by default,
  with `dangerouslySetInnerHTML` as the named warning you almost never need.
- **CORS:** Console-only, on any page. A cross-origin `fetch` to an API lacking
  `Access-Control-Allow-Origin` produces the red CORS error. Explain: the request
  *was* made and the response likely came back, but the browser checked the
  response headers, didn't find the page's origin in `Access-Control-Allow-Origin`,
  and refused to hand JS the data — the server must opt in. It's a browser
  feature stopping a malicious site from using your logged-in cookies against
  another origin's API.

Images are food emoji + CSS gradients only; offline-capable.

## Files (`day_3/demo_10/`)

| File | Role |
|---|---|
| `index.html` | Reviews card: review form, UNSAFE/SAFE render-mode radio toggle, and the `#review-feed` list reviews are injected into. |
| `app.js` | `addReviewUnsafe` (`innerHTML`, vulnerable) and `addReviewSafe` (`textContent`, safe); the form picks the path from the selected radio. Seeds one normal review. |
| `style.css` | Swiggy-orange card styling — emoji poster, CSS gradient, no external assets. |
| `server.py` | FastAPI static server (Demo 1/3 pattern) with per-request terminal logging. Copied exactly from `demo_3/server.py`. |
| `requirements.txt` | `fastapi`, `uvicorn`, `httpx`, `pytest`. |
| `test_server.py` | pytest via `TestClient`: page + assets serve 200 with correct content-types; markup contains the form/feed hooks; `app.js` contains both render paths; requests are logged. |
| `README.md` | The runbook (XSS flow, the safe fix, React note, the CORS Console beat; explicitly notes no Slido). |

## Demo flow (lands in `README.md`)

0. **No Slido** — note this explicitly; the alert popping is hook enough.
1. **Normal review** in UNSAFE mode: "Great biryani!" posts fine — behaves as a
   reviews feature should.
2. **The attack:** post `<img src="x" onerror="alert('hacked')">` — an alert
   pops. The `<img>` fails to load, `onerror` fires, the user's input ran as
   code. That's XSS; in production it would steal `document.cookie`.
3. **The fix:** flip to SAFE (`textContent`), post the same payload — it renders
   as literal text. The diff is one line: `innerHTML` parses markup, `textContent`
   shows text. `textContent` is the default.
4. **React:** `{userInput}` is escaped by default; `dangerouslySetInnerHTML` is
   the named opt-back-in you almost never need.
5. **CORS:** in the Console, a cross-origin `fetch` to an API without
   `Access-Control-Allow-Origin` → red error. The request was made and answered;
   the browser refused to share the response because the server didn't name our
   origin. Server must opt in. It's the browser protecting the user from a page
   abusing their logged-in cookies against another origin.

## Verification

- `test_server.py` passes in `.venv` (**7 tests, confirmed green**): index +
  `style.css` + `app.js` serve 200 with html/css/javascript content-types; the
  page markup has the `#review-form`, `#review-input`, `#review-feed` hooks;
  `app.js` contains both `innerHTML` and `textContent`; a request is logged.
- Manual: the UNSAFE payload pops an alert; the SAFE path renders it as text; a
  cross-origin `fetch` yields a visible CORS error in the Console.

## Out of scope

- A server-side CORS-allowing endpoint or a configurable CORS toggle — the CORS
  beat is Console-only against a public API, not built here.
- Real cookie exfiltration or any actual attacker server — narrated, never wired
  up.
- Content-Security-Policy, `HttpOnly` cookies, sanitiser libraries (DOMPurify),
  SameSite — named at most; deeper hardening is later/advanced material.
- A React implementation of the safe path — React's escaping is described, not
  coded (no Next.js in this demo).
