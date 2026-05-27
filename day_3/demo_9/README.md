# Day 3, Demo 9 — "What are you actually shipping?" (Performance & Core Web Vitals)

Companion runbook for the ninth demo of Day 3. Full design:
`../docs/superpowers/specs/2026-05-28-day3-demo9-core-web-vitals-design.md`.

This demo ships **no code**. It runs Chrome DevTools' **Lighthouse** against a
real page and reads the report out loud. The big idea:

> You've spent all day learning *how* a page loads, mutates, styles, lays out,
> and paints. Lighthouse is the tool that **measures** all of it and hands you a
> graded report card — and Google reads the same report to decide where you rank.

The best target is **a student's own Day-2 landing page** — it's their code, so
the findings sting in a good way. Demo 1's Swiggy card at
`http://localhost:8000/` is the **reliable fallback** if no student page is
handy or the volunteer is shy.

## What's here

Nothing to install. The whole demo is Chrome DevTools → **Lighthouse**. You just
need:

- A page to audit (a student's deployed Day-2 page, or Demo 1's card running
  locally — see Setup).
- Chrome with DevTools (`Cmd+Opt+I`).

## Setup & run

If you're using **Demo 1's card** as the target, start its server first:

```bash
cd ../demo_1
source .venv/bin/activate
uvicorn server:app --host 127.0.0.1 --port 8000 --reload
```

Open the target page in Chrome, then DevTools (`Cmd+Opt+I`) → **Lighthouse**
tab. Pick **Navigation** mode, check all four categories (Performance, Best
Practices, SEO, Accessibility), choose **Mobile** (Google ranks on mobile), and
click **Analyze page load**. Audit in a **fresh Incognito window** so extensions
don't pollute the score.

## Demo flow

### 0. Slido (before anything)

> "What's the **biggest performance killer** on a typical web page — images,
> JavaScript, CSS, or fonts?"

There's no single right answer, and that's the point. **JavaScript** wins by
impact: it blocks the main thread, delays interactivity, and a heavy bundle is
the usual cause of a sluggish page. **Images** win by raw bytes: they're almost
always the largest thing downloaded. Both are defensible — let the room argue,
then show them how Lighthouse actually attributes the cost in section 4.

### 1. Run the audit

Open the target page, DevTools → **Lighthouse** → **Analyze page load**. It
reloads the page, instruments it, and after ~15 seconds produces four big dials:

- **Performance** — how fast it loads and becomes interactive.
- **Best Practices** — HTTPS, console errors, deprecated APIs.
- **SEO** — is it discoverable (meta tags, crawlable links, mobile-friendly)?
- **Accessibility** — contrast, alt text, labels, landmarks (ties straight back
  to the semantic-HTML beat from Demo 2).

Read the scores aloud. A polished-looking page scoring 60 on Performance is the
hook: **pretty ≠ fast.**

### 2. The three Core Web Vitals

Scroll to the **Metrics** panel. These three are the ones Google standardised —
the "Core Web Vitals." One sentence and one threshold each:

- **LCP — Largest Contentful Paint:** time until the biggest visible element
  (the hero image or headline) finishes rendering — the user's gut feel for "the
  page loaded." **Good: under 2.5s.**
- **INP — Interaction to Next Paint:** the delay between a click/tap and the
  screen visibly responding — a slow React re-render or a heavy event handler
  destroys it. **Good: under 200ms.**
- **CLS — Cumulative Layout Shift:** how much stuff jumps around while loading
  (classically an image with no set height that pushes the text down once it
  arrives) — users hate it because they tap the wrong thing. **Good: under 0.1.**

> "LCP is *how fast did it show up*, INP is *how fast does it react to me*, and
> CLS is *did it hold still while I was reading it*. Load speed, responsiveness,
> visual stability — the three things a user actually feels."

### 3. Why these three matter beyond the dial

> "Google uses Core Web Vitals as a **search-ranking signal**. Two sites with
> equally good content — the faster, more stable one ranks higher. This isn't a
> vibe; it's the measurable number sitting right here in the report. Performance
> stopped being a nice-to-have the day it started affecting traffic."

### 4. Walk Opportunities & Diagnostics — the frontend health check

Scroll past the dials. This is the part that pays the session back. Read a few
real entries aloud — typical hits:

- **"Properly size images" / "Serve images in next-gen formats"** — an
  uncompressed photo is shipping ten times the bytes it needs (callback to the
  biryani image in Demo 1).
- **"Eliminate render-blocking resources"** — the CSS and synchronous scripts
  holding up first paint. This is **literally Demo 3**, now with a number on it.
- **"Reduce unused JavaScript"** — you shipped a library and use 5% of it; this
  is what tree-shaking (the bundling interlude) is fighting.

> "Each of these is a frontend concept we've covered today, now with a price tag
> attached. Lighthouse turns 'your page feels slow' into a prioritised to-do
> list — biggest win at the top."

### 5. Forward-ref to observability

> "Today we ran this **once, by hand**. In production you'd measure these
> continuously — real users, real devices, every deploy. The point isn't the
> one-off score; it's the **trend**. A deploy that quietly pushes LCP from 1.5s
> to 4s should set off an alarm before your users feel it. That's the
> observability story, and it's where Day 4 picks up."

## Pre-session checklist

- [ ] Chrome installed with DevTools; **Lighthouse** tab present.
- [ ] A target page chosen: ideally a willing student's deployed Day-2 page;
      otherwise Demo 1's card with its server running at
      `http://localhost:8000/`.
- [ ] Ran the audit once end-to-end in an **Incognito** window; it completes and
      shows the four dials plus Metrics.
- [ ] Confirmed the report surfaces **LCP / INP / CLS** and at least a couple of
      **Opportunities / Diagnostics** to read aloud.
- [ ] Backup screenshot of a completed report saved, in case the live run is
      flaky on conference Wi-Fi.
- [ ] Display sleep / Caffeinate enabled for the session duration.
