# Day 3 Demo 2 — DOM vs HTML Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Reorganize `day_3/` into per-demo folders and ship a console-driven runbook for "The DOM is not the HTML," reusing Demo 1's Swiggy card and a real site.

**Architecture:** No new application code. Demo 1's files move into `day_3/demo_1/`; Demo 2 is a single runbook at `day_3/demo_2/README.md`; `day_3/README.md` becomes a Day 3 index. Specs/plans stay shared under `day_3/docs/superpowers/`.

**Tech Stack:** Markdown runbooks; the existing FastAPI Demo 1 server (unchanged, just relocated); browser DevTools console as the demo surface.

**Testing approach:** Demo 2 ships no code, so it has no unit tests. Verification = Demo 1's pytest still passes from its new location, the relocated server still serves the card, and the documented console snippets are valid against the card's actual markup and resolve. These are explicit verification steps, not fake unit tests.

---

### Task 1: Relocate Demo 1 into `day_3/demo_1/`

**Files:**
- Move: `day_3/{index.html,style.css,app.js,meghana-biryani.jpg,server.py,test_server.py,requirements.txt,README.md}` → `day_3/demo_1/`
- Modify: `day_3/demo_1/README.md` (fix spec path)

- [ ] **Step 1: Create the folder and move tracked files with git**

Run from repo root `/Users/saainithil/Code/teach`:

```bash
mkdir -p day_3/demo_1
git mv day_3/index.html day_3/style.css day_3/app.js day_3/meghana-biryani.jpg \
       day_3/server.py day_3/test_server.py day_3/requirements.txt day_3/README.md \
       day_3/demo_1/
git status --short
```
Expected: eight `R` (renamed) entries, all into `day_3/demo_1/`.

- [ ] **Step 2: Fix the spec path reference in the moved README**

The README moved one directory deeper, so its link to the spec must gain a `../`.

In `day_3/demo_1/README.md`, change:
```
`docs/superpowers/specs/2026-05-27-day3-request-lifecycle-design.md`.
```
to:
```
`../docs/superpowers/specs/2026-05-27-day3-request-lifecycle-design.md`.
```

- [ ] **Step 3: Recreate the virtualenv at the new location**

The old `day_3/.venv` (gitignored) had absolute paths and is now orphaned. Recreate inside `demo_1/` and remove the old one. Run from repo root:

```bash
rm -rf day_3/.venv
cd day_3/demo_1
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```
If the pip install is blocked by sandbox/network, retry with the Bash tool param `dangerouslyDisableSandbox: true`.

- [ ] **Step 4: Confirm `.venv/` is still gitignored at the new depth**

Run from repo root:
```bash
git check-ignore day_3/demo_1/.venv && echo "ignored OK"
```
Expected: prints the path then `ignored OK`. If it does NOT print (i.e. not ignored), add a line `.venv/` to the repo-root `.gitignore` and re-check.

- [ ] **Step 5: Verify Demo 1 still works from its new home**

Run from `day_3/demo_1/` with venv active:
```bash
python -m pytest -q
```
Expected: `5 passed`.

Then smoke-test the server:
```bash
(uvicorn server:app --host 127.0.0.1 --port 8000 > /tmp/d1.log 2>&1 &) && sleep 3
curl -s -o /dev/null -w "%{http_code} %{content_type}\n" http://127.0.0.1:8000/
curl -s http://127.0.0.1:8000/ | grep -c "Meghana Foods"
pkill -f "uvicorn server:app"; sleep 1
```
Expected: `200 text/html; charset=utf-8`, then a count `>= 1` for "Meghana Foods".

- [ ] **Step 6: Commit**

```bash
git add -A day_3
git commit -m "Day 3: relocate Demo 1 into day_3/demo_1/"
```

---

### Task 2: Day 3 index (`day_3/README.md`)

**Files:**
- Create: `day_3/README.md`

- [ ] **Step 1: Write `day_3/README.md`**

````markdown
# Day 3 — Demystifying Frontend Engineering

A sequence of short, mind-bending demos that take the black box of "a web page"
apart. Each demo is self-contained and builds on the last. The running example
stays on the course spine — the Swiggy restaurant card from Day 1.

## Demos

- **[Demo 1 — "What just happened?"](demo_1/README.md)** — the request
  lifecycle. One tiny Swiggy card is really six network requests; the DevTools
  Network tab and a Slow 3G reload make the render pipeline visible.
- **[Demo 2 — "The DOM is not the HTML"](demo_2/README.md)** — parsing and the
  live DOM. View Source (what the server sent) vs the Elements tab (the live
  object the browser built), proven by mutating the DOM from the console while
  the source stays frozen — then vandalizing a real site for fun.

## Design docs

Specs and plans for every Day 3 demo live under
[`docs/superpowers/`](docs/superpowers/).

## Running the demos

Demo 1 (and the page Demo 2 builds on) is served by the Demo 1 FastAPI app:

```bash
cd demo_1
python3 -m venv .venv && source .venv/bin/activate   # first time only
pip install -r requirements.txt                       # first time only
uvicorn server:app --host 127.0.0.1 --port 8000 --reload
```

Then open `http://localhost:8000/`. See each demo's README for its full script.
````

- [ ] **Step 2: Verify the index links point at real files**

Run from repo root:
```bash
ls day_3/demo_1/README.md day_3/demo_2/README.md day_3/docs/superpowers
```
Expected: all three paths exist. (Task 3 creates `demo_2/README.md`; if running
tasks out of order, this check passes once Task 3 is done.)

- [ ] **Step 3: Commit**

```bash
git add day_3/README.md
git commit -m "Day 3: add index README linking the demos"
```

---

### Task 3: Demo 2 runbook (`day_3/demo_2/README.md`)

**Files:**
- Create: `day_3/demo_2/README.md`

- [ ] **Step 1: Create the folder and write `day_3/demo_2/README.md`**

```bash
mkdir -p day_3/demo_2
```

Write `day_3/demo_2/README.md` with exactly this content:

````markdown
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
````

- [ ] **Step 2: Verify the runbook's key snippets and link**

Run from repo root:
```bash
grep -c "document.querySelector('h1')" day_3/demo_2/README.md
grep -q "2026-05-28-day3-demo2-dom-vs-html-design.md" day_3/demo_2/README.md && echo "spec link OK"
ls day_3/docs/superpowers/specs/2026-05-28-day3-demo2-dom-vs-html-design.md
```
Expected: count `>= 1`, `spec link OK`, and the spec file exists (the `../`
in the link resolves from `day_3/demo_2/` to `day_3/docs/...`).

- [ ] **Step 3: Commit**

```bash
git add day_3/demo_2/README.md
git commit -m "Day 3 Demo 2: add DOM-vs-HTML runbook"
```

---

### Task 4: Full verification

No new files. Confirms the reorg didn't break Demo 1 and that Demo 2's snippets
match the real served markup.

- [ ] **Step 1: Demo 1 tests pass from the new location**

Run from `day_3/demo_1/` (venv active):
```bash
python -m pytest -q
```
Expected: `5 passed`.

- [ ] **Step 2: The card's markup supports Demo 2's snippets**

Start the server and check the live HTML the demo relies on. Run from
`day_3/demo_1/` (venv active):
```bash
(uvicorn server:app --host 127.0.0.1 --port 8000 > /tmp/d2.log 2>&1 &) && sleep 3
echo "exactly one <h1>, containing Meghana Foods:"
curl -s http://127.0.0.1:8000/ | grep -o "<h1[^>]*>[^<]*</h1>"
echo "like-count reads 0 in source:"
curl -s http://127.0.0.1:8000/ | grep -o '<span id="like-count">[^<]*</span>'
pkill -f "uvicorn server:app"; sleep 1
```
Expected: one `<h1 class="card__name">Meghana Foods</h1>` line (so
`querySelector('h1')` resolves to it), and `<span id="like-count">0</span>` (so
the "source says 0" beat is true).

- [ ] **Step 3: Index and runbook links resolve**

Run from repo root:
```bash
ls day_3/README.md day_3/demo_1/README.md day_3/demo_2/README.md
ls day_3/demo_1/docs 2>/dev/null; ls day_3/docs/superpowers/specs/2026-05-27-day3-request-lifecycle-design.md
```
Expected: the three READMEs exist; the Demo 1 spec exists at
`day_3/docs/superpowers/specs/...` (the target of Demo 1 README's `../` link).

---

## Self-review notes

- **Spec coverage:** runbook-only deliverable (Task 3); reorg into demo_1/ +
  demo_2/ with index (Tasks 1, 2); Demo 1 spec-path fix (Task 1 Step 2); venv
  recreation + gitignore check (Task 1 Steps 3–4); full demo flow incl. Slido,
  Demo 1 Like-button bridge, View-Source-vs-Elements, two console mutations,
  the refresh reveal, Wikipedia playground with `$0` fallback, and the
  reframe/defuse (Task 3); conceptual sidebar (Task 3); verification that Demo 1
  still works and snippets match markup (Task 4). All spec sections mapped.
- **No placeholders:** every code/command/markdown step has real content.
- **Consistency:** the spec filename `2026-05-28-day3-demo2-dom-vs-html-design.md`
  is referenced identically in the index, the runbook, and Task 3's verify step;
  the `../` relative depth is correct from both `demo_1/` and `demo_2/` to
  `day_3/docs/`; the `<h1>` text "Meghana Foods" and `like-count` span match
  Demo 1's actual `index.html`.
