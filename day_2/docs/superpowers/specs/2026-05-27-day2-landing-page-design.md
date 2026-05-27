# Day 2 — "Landing Page & The Deploy Loop" Design

**Audience:** ~130 second-year CS students, remote over video call.
**Format:** Hybrid. The instructor demos the full flow live; students build and
deploy their *own* landing page afterward as homework, using the session as the
template. The instructor's demo product is the **real Q&A app** they're building
to run this very workshop (the course's spine project, dogfooded). Students
build a landing page for a product idea of their *own*.
**Slot:** The full 60 minutes (extendable). Day 2's main event — no separate
case study attached.
**Single sentence the session answers:** *"You understand how the web works —
now let's put something of yours on it, and learn what makes it worth visiting."*

This is the session right after Day 1 ("how the web works" + Swiggy case study).
Students have seen HTML/CSS/JS and the client/server model, but have **never
deployed anything** — Day 2 is their first ship.

## Goals

1. Students watch a product idea go from *nothing → a live public URL*, and
   internalize the **push-to-deploy loop** (commit → push → it's live) by seeing
   it fire repeatedly. This is the psychological "I shipped something" win.
2. Students learn to **judge** landing pages — why good ones work — and get a
   **strength-lanes** framework so they build their own page leading with what
   *they* are personally best at.
3. Students leave able to do it themselves as homework: build a static landing
   page with AI assistance and deploy it to a public Vercel URL.

## Non-goals

- Feedback forms, databases, APIs, analytics — deferred to later sessions.
- Deep CSS/JS, frameworks (Next.js), build tooling — none of it yet.
- "World-class" design. The point is *intentional choices + shipping*, not
  polish. A student who nails one thing and keeps the rest clean has succeeded.
- Hands-on building *during* the session. Students watch; they build after.

## Constraints

- **Remote, ~130 students**: the live portion is watch-along; individual help
  isn't feasible mid-session. The runbook and student guide must be
  self-sufficient for homework.
- **Free tools only**: GitHub (free), Vercel (free hobby tier), and a free chat
  AI (Claude or ChatGPT). No paid services.
- **First deploy ever**: assume zero prior git/Vercel experience. Every step is
  new; pace Act 0 accordingly.
- **Static only**: single `index.html` (plus optional CSS/JS), deployed as a
  static site. Builds directly on the HTML/CSS/JS seen in Day 1.

## Session arc

Ordering follows the "ship first, polish second" strategy: get an *empty* page
live immediately so the deploy loop is established early, then reuse that loop
every time the page improves. The loop is the spine.

| Act | ~Time | What's on screen | Concepts / beat |
|---|---|---|---|
| **0. Ship nothing, publicly** | ~10 min | `git init` → commits → push to GitHub → import to Vercel → live URL showing a one-line `index.html` | git, commit, repo, push, deploy. "It's live — and it's empty. Now let's make it worth visiting." |
| **1. What makes a page good?** | ~15–20 min | 3–4 curated landing pages; each nails ONE thing → strength lanes → the anatomy checklist | Build taste. "Pick your lane; keep the rest clean." |
| **2. Build yours with AI** | ~12 min | A chat AI → a complete `index.html`; iterate by asking for changes | AI drafts fast; *your judgment* (Act 1) shapes it. |
| **3. Push it live** | ~10 min | Replace placeholder with the AI page, `git commit`, `git push` → Vercel auto-redeploys → refresh the real page (loop reused 2–3× for tweaks) | The loop pays off. Closing bridge to building the Q&A app. |

### Act 0 — Ship nothing, publicly (~10 min)

The goal is to feel the deploy loop *before* there's anything worth deploying,
so the mechanics are learned in isolation from the design work.

Steps:
1. Create a folder, add a one-line `index.html` (e.g. `<h1>Coming soon</h1>`).
2. `git init`, `git add .`, `git commit -m "Initial commit"`. Name each idea
   once, *after* the command runs:
   - **repository**: the folder git is tracking.
   - **commit**: a save point with a message — a labelled snapshot of your work.
3. Create a GitHub repo and push (`gh repo create` or the web UI + `git remote
   add` / `git push`). Name **GitHub** as "where the repo lives online, and the
   thing Vercel will watch."
4. On vercel.com: *Add New → Project → import the GitHub repo → Deploy*. No
   configuration needed for a static site.
5. Open the live public URL. It says "Coming soon." *"That URL is now reachable
   by anyone on earth. You just shipped."*

Teaching beat: this is the first deploy. Let it land. The page is intentionally
empty so the *only* new thing here is the loop.

### Act 1 — What makes a page good? (~15–20 min)

The substance of the session. Two artifacts to build in students' heads: the
**strength lanes** (so they know what to lead with) and the **anatomy checklist**
(so they keep everything else clean).

**Strength lanes** — each student picks ONE to lead with:

| Lane | "You're the kind of person who…" |
|---|---|
| **Design** | makes things *look* striking — color, type, spacing |
| **Copy** | writes a sentence that makes someone *get it* instantly |
| **Layout** | arranges information so the eye knows where to go |
| **Motion** | brings a page alive with tasteful animation |
| **Interactivity** | builds something you can *play with* (toggle, demo, calculator) |
| **Storytelling** | takes the visitor on a narrative, top to bottom |
| **Personality/Humor** | has a voice — funny, weird, memorable |

Framing: *"You don't need all seven. A great landing page usually nails one or
two hard and keeps the rest clean. Find your lane."*

**Two teaching aids in this folder make the lanes concrete:**
- `lanes-gallery.html` — a reference page with one live, labeled mini-example per
  lane. Open it to *show* students what each lane looks like (useful for those who
  can't picture "motion" or "interactivity" on a page). It shows all seven loudly
  on purpose — say out loud that a real page leads with ONE.
- `index.html` (the AskBoard page) models the opposite discipline: it leads with
  copy + clean layout and adds only *restrained* Interactivity and Motion where
  they serve the product. The contrast between the two pages **is** the lesson.

**Landing page anatomy** (the "keep the rest clean" checklist):
- A **headline**: what it is + who it's for.
- A one-line **subhead**.
- A **hero visual** (image, screenshot, or a bold typographic block).
- The **value / benefits** — why someone should care.
- A hint of **credibility** (a quote, a number, a logo — even a placeholder).
- **One clear call-to-action**.

**Curated examples** — instructor picks, each tagged to a lane, ~30–60 seconds
each, naming the ONE thing it nails and connecting it to a lane. Slots are left
for the instructor to swap in personal favorites:
- **Stripe** → Design + Layout (visual polish, clarity of hierarchy).
- **Linear** → Motion + Design (animation as feel).
- **A simple indie / solo product** (a one-page app or newsletter) → Copy +
  Personality (proof you don't need a big team to make something good).
- **[ slot for instructor's favorite ]** → [ lane ].

### Act 2 — Build yours with AI (~12 min)

One tool, kept simple: a free chat AI (Claude or ChatGPT). No other tools
mentioned, to avoid confusing 130 remote students. In the live demo the product
is the **Q&A app** (the instructor's real tool); students will swap in their own
product when they do this as homework.

Steps:
1. Write a prompt describing the product, the chosen strength lane, and "output
   a single self-contained `index.html` with inline CSS." (A copy-paste prompt
   template lives in the student guide.)
2. Paste the result into `index.html`. Open it locally in a browser.
3. Iterate in chat: "make the headline bolder," "change the vibe to playful,"
   "add a call-to-action button." Show that iteration is the real skill.

Teaching beat: *"The AI gives you a starting point in seconds. Your job is the
judgment we just built — which headline is clearer, which layout guides the eye.
The taste is yours; the typing is the AI's."*

### Act 3 — Push it live (~10 min)

The loop from Act 0 pays off, now with real content.

Steps:
1. Replace the placeholder `index.html` with the AI-built page.
2. `git add .`, `git commit -m "Build landing page"`, `git push`.
3. Switch to the Vercel tab — the new deploy is already building. Refresh the
   public URL → the real page is live.
4. Make one visible tweak (change the headline), commit, push again, refresh.
   Repeat once more. *"Every push is a new version, live in seconds. This is what
   shipping feels like."*

**Closing bridge:** *"You've shipped a page that's yours. Next session we start
building the real thing — this Q&A app, the one I'll actually use to collect
your questions in this workshop — with a proper framework and a spec. Same
deploy loop you just learned, more power behind it."*

## Artifacts in the repo (`day_2/`)

Mirrors Day 1's structure.

```
day_2/
├── index.html              # The real Q&A app's landing page — the instructor's
│                           #   actual product, the "target" the demo builds
│                           #   toward and an example for students to study.
│                           #   Inline CSS + a small inline script (tasteful
│                           #   upvote interactivity + motion).
├── lanes-gallery.html      # Teaching aid: one live, labeled mini-example per
│                           #   strength lane, shown in Act 1 so students can
│                           #   picture each lane concretely.
├── README.md               # Instructor runbook: prerequisites, exact git /
│                           #   GitHub / Vercel steps, pre-session checklist,
│                           #   risks + fallbacks.
├── student-guide.md        # Student-facing homework handout: anatomy checklist,
│                           #   strength lanes, copy-paste AI prompt template,
│                           #   numbered deploy steps.
└── docs/
    └── superpowers/
        └── specs/
            └── 2026-05-27-day2-landing-page-design.md
```

The one-line placeholder page used in Act 0 is small enough to live inline in
the README rather than as its own file.

### `index.html` shape

A polished-but-simple single-page landing page for the **Q&A app**, with inline
CSS and a small inline script, demonstrating the anatomy checklist: headline,
subhead, hero block, a benefits section, a credibility line, and one CTA. It also
models *restrained* use of two further lanes: the hero question-board mock has
working upvote buttons (Interactivity — a visitor feels the product's core
action), and the hero rises in on load with a CTA hover-lift (Motion, guarded by
`prefers-reduced-motion`). It is a real artifact — the landing page for the tool
the instructor dogfoods. Clean enough to look intentional, simple enough that a
second-year can read every line.

### `student-guide.md` shape

The self-sufficient homework handout (students follow this without live help):
- Prerequisites with links: create a GitHub account, a Vercel account (sign in
  with GitHub), install git.
- The anatomy checklist and the strength lanes, restated concisely.
- A copy-paste **AI prompt template** with blanks for product, audience, and
  chosen lane.
- Numbered steps for the full loop: init → commit → push to GitHub → import to
  Vercel → get the live URL → iterate with push-to-deploy.
- "Share your URL" instruction.

## Pre-session checklist

1. Instructor has GitHub + Vercel accounts; `git` and (optionally) `gh`
   installed.
2. Dry-run the whole flow once end to end: empty repo → GitHub → Vercel import →
   live URL → AI build → push → auto-redeploy. Confirm the redeploy is visible
   within a minute.
3. Have a chat-AI tab open and a tested prompt ready (don't compose it live cold).
4. Bookmark the 3–4 curated example landing pages; confirm they still load and
   still demonstrate their tagged lane.
5. The demo product is the Q&A app; have its one-line pitch and chosen strength
   lane ready so the narration is smooth.
6. Disable display sleep for the session duration.

## Risks and mitigations

| Risk | Mitigation |
|---|---|
| Vercel GitHub import hiccups live. | Fallback: Vercel CLI (`vercel deploy`) or drag-and-drop the folder on vercel.com. Both deploy the same static page without GitHub. |
| AI produces broken or ugly HTML on the live demo. | Use the pre-tested prompt; have the reference `index.html` ready to paste as a backup if the live generation flops. |
| Students lack GitHub/Vercel accounts. | Student guide lists account creation as step 0 with links; it's homework, so they create accounts on their own time. |
| git not installed on a student's machine. | Guide links install instructions per OS; flagged as a prerequisite. |
| The deploy loop "magic" doesn't land because the redeploy is slow. | Make a *visible* change (headline text) so the before/after is obvious; narrate the build status in the Vercel tab. |
| Session runs long on Act 0 mechanics. | Act 0 is intentionally a one-line page; if git/GitHub setup drags, keep narration tight and protect Act 1 (the design segment), which is the core. |

## Success criteria

The session is a success if a representative student, doing the homework, can:
> *Build a static landing page for a product idea of their own — leading clearly
> with one strength they chose — and deploy it to a public Vercel URL, then
> change it, push, and watch it redeploy.*

And can explain the loop in their own words: *"I commit my changes, push to
GitHub, and Vercel puts the new version live automatically."*

## Deferred to later sessions

- Feedback forms, databases, APIs (the "real product" backend).
- Analytics / observability — knowing if anyone is visiting (later session).
- Next.js, the app router, rendering strategies — starts Day 3 with the Q&A app.
- The Q&A feature itself (submit, upvote, store, display questions) — the API +
  database + observability arc, built across Days 3–7.
- Custom domains, environment variables, preview deployments, CI/CD.
