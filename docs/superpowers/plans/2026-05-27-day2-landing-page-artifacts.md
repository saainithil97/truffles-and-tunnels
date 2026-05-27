# Day 2 Landing-Page Artifacts Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Produce the three Day 2 teaching artifacts — a reference landing page for the AskBoard Q&A app, an instructor runbook, and a student homework guide — exactly as described in the Day 2 design spec.

**Architecture:** These are **content deliverables**, not software with logic. There is nothing to unit-test. Each task creates one file with its complete content, then verifies it two ways: render it (open the HTML in a browser / read the markdown) and run a structural presence check (grep for every required section). Verification = "the artifact renders and contains every required part," not red/green tests. One file per task, one commit per task.

**Tech Stack:** Plain static HTML5 + inline CSS (no frameworks, no build step). Markdown for the two guides. Deploy target referenced in the docs is Vercel's free static hosting via a GitHub repo.

**Working title decision:** The Q&A app is named **AskBoard** throughout. It is a working title; if the instructor renames the product, update the headline/title in `day_2/index.html` and the prompt in `day_2/README.md`.

**Spec:** `day_2/docs/superpowers/specs/2026-05-27-day2-landing-page-design.md`

---

### Task 1: Reference landing page (`day_2/index.html`)

The real AskBoard landing page — the "target" the live demo builds toward and the example students study. It leads with **clarity of copy** on a **clean layout** (modelling the spec's "nail one lane, keep the rest clean"), with a small CSS-only question-board mockup as the hero visual so no image assets are needed. Demonstrates the full anatomy checklist: headline, subhead, hero visual, benefits, a credibility line, one CTA.

**Files:**
- Create: `day_2/index.html`

- [ ] **Step 1: Create `day_2/index.html` with this exact content**

```html
<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>AskBoard — Ask anything. Upvote what matters.</title>
<style>
  :root { --ink:#15171a; --muted:#5b626b; --accent:#3a6df0; --line:#e6e8eb; --bg:#fff; }
  * { box-sizing: border-box; }
  body { margin:0; font-family:-apple-system,system-ui,"Segoe UI",Roboto,sans-serif; color:var(--ink); background:var(--bg); line-height:1.5; }
  .wrap { max-width:760px; margin:0 auto; padding:0 1.25rem; }
  header.hero { padding:5rem 0 3rem; text-align:center; }
  .eyebrow { font-size:.8rem; letter-spacing:.08em; text-transform:uppercase; color:var(--accent); font-weight:700; }
  h1 { font-size:2.6rem; line-height:1.1; margin:.6rem 0 1rem; letter-spacing:-.02em; }
  .sub { font-size:1.2rem; color:var(--muted); max-width:34rem; margin:0 auto 2rem; }
  .cta { display:inline-block; background:var(--accent); color:#fff; text-decoration:none; font-weight:600; padding:.8rem 1.5rem; border-radius:8px; }
  .cta:hover { filter:brightness(.95); }
  .board { margin:3rem auto 0; max-width:30rem; text-align:left; border:1px solid var(--line); border-radius:12px; padding:.5rem; box-shadow:0 10px 30px rgba(20,23,26,.06); }
  .q { display:flex; align-items:center; gap:.9rem; padding:.85rem 1rem; border-bottom:1px solid var(--line); }
  .q:last-child { border-bottom:0; }
  .votes { flex:0 0 auto; text-align:center; min-width:2.6rem; border:1px solid var(--line); border-radius:8px; padding:.3rem 0; font-weight:700; }
  .votes span { display:block; font-size:.65rem; color:var(--muted); font-weight:600; }
  .qtext { font-size:.97rem; }
  section.benefits { padding:4rem 0; border-top:1px solid var(--line); }
  .benefits h2 { text-align:center; font-size:1.5rem; margin:0 0 2.5rem; }
  .grid { display:grid; grid-template-columns:repeat(auto-fit,minmax(200px,1fr)); gap:2rem; }
  .benefit h3 { margin:0 0 .4rem; font-size:1.05rem; }
  .benefit p { margin:0; color:var(--muted); font-size:.95rem; }
  .proof { text-align:center; padding:3rem 0; border-top:1px solid var(--line); color:var(--muted); font-style:italic; }
  footer.final { text-align:center; padding:4rem 0 5rem; border-top:1px solid var(--line); }
  footer.final h2 { font-size:1.8rem; margin:0 0 1.5rem; }
</style>
</head>
<body>
<div class="wrap">
  <header class="hero">
    <div class="eyebrow">Live Q&amp;A</div>
    <h1>Ask anything. Upvote what matters.</h1>
    <p class="sub">AskBoard is a live question board for talks, classes, and workshops. Your audience asks, everyone upvotes, and you answer what the room actually wants to know.</p>
    <a class="cta" href="#start">Start your board</a>

    <div class="board" aria-hidden="true">
      <div class="q"><div class="votes">42<span>votes</span></div><div class="qtext">Will the recording be shared afterwards?</div></div>
      <div class="q"><div class="votes">31<span>votes</span></div><div class="qtext">How is this different from just using a Google Form?</div></div>
      <div class="q"><div class="votes">18<span>votes</span></div><div class="qtext">Can questions stay anonymous?</div></div>
    </div>
  </header>

  <section class="benefits">
    <h2>Why a board beats raised hands</h2>
    <div class="grid">
      <div class="benefit"><h3>No more silence</h3><p>Quiet rooms ask far more when questions can be anonymous and typed, not shouted across a hall.</p></div>
      <div class="benefit"><h3>Answer what matters</h3><p>Upvotes float the best questions to the top, so you spend your time where the room actually is.</p></div>
      <div class="benefit"><h3>Live, no setup</h3><p>Share one link. Questions appear in real time. Nothing for your audience to install.</p></div>
    </div>
  </section>

  <p class="proof">"Built for — and used live in — a workshop with 130 students."</p>

  <footer class="final" id="start">
    <h2>Open a board in ten seconds.</h2>
    <a class="cta" href="#start">Start your board</a>
  </footer>
</div>
</body>
</html>
```

- [ ] **Step 2: Render it in a browser**

Run: `open day_2/index.html`
Expected: a browser tab opens showing the headline "Ask anything. Upvote what matters.", the subhead, a blue "Start your board" button, a three-row question-board mock with vote counts, three benefit columns, the italic credibility line, and a closing CTA. Layout is centered and readable; resize the window narrow and the benefit columns stack.

- [ ] **Step 3: Structural presence check (anatomy checklist)**

Run:
```bash
for m in '<title>AskBoard' '<h1>' 'class="sub"' 'class="board"' 'class="benefit"' 'class="proof"' 'class="cta"'; do
  grep -q "$m" day_2/index.html && echo "OK: $m" || echo "MISSING: $m"; done
```
Expected: seven `OK:` lines, no `MISSING:`. (Headline, subhead, hero visual, benefits, credibility, CTA all present.)

- [ ] **Step 4: Commit**

```bash
git add day_2/index.html
git commit -m "Add Day 2 reference landing page for AskBoard"
```

---

### Task 2: Instructor runbook (`day_2/README.md`)

The instructor's live-demo script and pre-session prep, mirroring the spec's four acts. Includes the exact git/GitHub/Vercel commands, the Act-0 placeholder page, the curated examples for Act 1, the chat-AI prompt for Act 2, the pre-session checklist, and risk fallbacks.

**Files:**
- Create: `day_2/README.md`

- [ ] **Step 1: Create `day_2/README.md` with this exact content**

````markdown
# Day 2 — Landing Page & The Deploy Loop (Instructor Runbook)

Live-demo script + prep for the Day 2 session. Full design:
`docs/superpowers/specs/2026-05-27-day2-landing-page-design.md` (in this folder
under `docs/`).

## What's here

- `index.html` — the reference AskBoard landing page (the demo's target; also
  the example students study).
- `student-guide.md` — the homework handout to share with students.

## Prerequisites (instructor)

- A **GitHub** account and **git** installed (`git --version`).
- A **Vercel** account, signed in with GitHub (https://vercel.com/signup).
- Optional but smoother: the **GitHub CLI** `gh` (https://cli.github.com),
  authenticated (`gh auth login`).
- A free chat-AI tab open (Claude or ChatGPT).

The demo builds in a **fresh throwaway repo** (e.g. `askboard/`), NOT this
teaching repo. `index.html` lives at the root of that fresh repo so Vercel
serves it as a static site with zero config.

## The arc (≈45 min of a 60-min slot)

Ship-first ordering: get an empty page live, then make it worth visiting.

### Act 0 — Ship nothing, publicly (~10 min)

Create the repo and a one-line page, then deploy it.

```bash
mkdir askboard && cd askboard
printf '<h1>AskBoard — coming soon</h1>\n' > index.html
git init
git add index.html
git commit -m "Initial commit: placeholder page"
```

Name each idea once, AFTER the command: **repository** (the folder git tracks),
**commit** (a labelled snapshot of your work).

Push to GitHub — with `gh`:

```bash
gh repo create askboard --public --source=. --remote=origin --push
```

Or via the website: create an empty repo `askboard` on github.com, then:

```bash
git remote add origin https://github.com/<you>/askboard.git
git branch -M main
git push -u origin main
```

Deploy on Vercel: vercel.com → **Add New → Project** → import `askboard` →
**Deploy**. No configuration for a static site. Open the live URL — it says
"coming soon." Beat: *"That URL is reachable by anyone on earth. You just
shipped."*

### Act 1 — What makes a page good? (~15–20 min)

Show 3–4 landing pages; for each, name the ONE thing it nails and tie it to a
**strength lane**. Then give the **anatomy checklist**.

Curated examples (swap in your own favorites):

| Page | Open | Nails (lane) |
|---|---|---|
| Stripe | https://stripe.com | Design + Layout |
| Linear | https://linear.app | Motion + Design |
| A simple indie / solo product | _your pick_ | Copy + Personality |
| _your favorite_ | _url_ | _lane_ |

Strength lanes (each student leads with ONE): **Design, Copy, Layout, Motion,
Interactivity, Storytelling, Personality/Humor.** Framing: *"Nail one or two
hard, keep the rest clean."*

Anatomy checklist: headline (what + who for) · one-line subhead · a hero visual
· value/benefits · a hint of credibility · one clear call-to-action.

### Act 2 — Build yours with AI (~12 min)

One tool: a free chat AI. The demo product is **AskBoard**, leading with clear
copy. Paste this prompt:

```
You are building a single-file landing page. Output one complete,
self-contained index.html with inline CSS — no external files, no frameworks,
no build step.

Product: AskBoard, a live Q&A question board for talks, classes, and workshops.
The audience submits questions and upvotes them; the speaker answers the most-
upvoted ones. One feature: live Q&A.
Audience: speakers, teachers, and workshop hosts who want better questions from
their room.
Lead with: clarity of copy — a headline anyone gets in one read — on a clean,
uncluttered layout.

Include: a headline, a one-line subhead, a simple visual hero (you may mock a
small question board with CSS), three benefits, one short credibility line, and
a single clear call-to-action. Use a system font and one accent color. Make it
responsive.
```

Paste the result over `index.html`, open it locally, then iterate in chat
("bolder headline", "calmer color", "tighten the subhead"). Beat: *"The AI types;
the taste is yours."* If the live generation flops, paste the committed
reference `index.html` from this folder as a backup.

### Act 3 — Push it live (~10 min)

```bash
# paste the AI-built page over index.html, then:
git add index.html
git commit -m "Build landing page"
git push
```

Switch to the Vercel tab — it is already redeploying. Refresh the URL; the real
page is live. Make one visible tweak and push again:

```bash
# edit the headline text, then:
git commit -am "Punch up the headline"
git push
```

Beat: *"Every push is a new version live in seconds. This is shipping."* Closing
bridge: *"Next session we start building the real thing — this AskBoard, the one
I'll use to collect your questions — with a framework and a spec."*

## Pre-session checklist

- [ ] GitHub + Vercel accounts ready; `git` (and optionally `gh`) installed.
- [ ] Dry-run the whole flow once: empty repo → GitHub → Vercel import → live URL
      → AI build → push → auto-redeploy. Confirm the redeploy is visible within
      a minute.
- [ ] Chat-AI tab open with the Act-2 prompt tested (don't compose it cold).
- [ ] The 3–4 curated example pages bookmarked and confirmed loading.
- [ ] AskBoard one-line pitch + chosen lane (clarity of copy) ready to narrate.
- [ ] Display sleep disabled for the session.

## Risks & fallbacks

| Risk | Fallback |
|---|---|
| Vercel GitHub import hiccups live. | `npm i -g vercel && vercel` from the folder, or drag-and-drop the folder at https://vercel.com/new. Both deploy the static page without GitHub. |
| AI produces broken/ugly HTML live. | Paste the committed reference `index.html` from this folder. |
| Redeploy feels slow / undramatic. | Change the headline text so the before/after is obvious; narrate the build status in the Vercel tab. |
| Act 0 git/GitHub setup drags. | Keep narration tight; protect Act 1 (the design segment), which is the core. |
````

- [ ] **Step 2: Read it back as rendered markdown**

Run: `open day_2/README.md` (or preview in your editor)
Expected: renders cleanly — the four Act sections, the examples table, two fenced command blocks for git/Vercel, the prompt block, the checklist, and the risks table all display correctly with no broken fences.

- [ ] **Step 3: Structural presence check**

Run:
```bash
for m in 'Act 0' 'Act 1' 'Act 2' 'Act 3' 'gh repo create' 'vercel.com' 'Strength lanes' 'Pre-session checklist' 'Risks & fallbacks'; do
  grep -q "$m" day_2/README.md && echo "OK: $m" || echo "MISSING: $m"; done
```
Expected: nine `OK:` lines, no `MISSING:`.

- [ ] **Step 4: Commit**

```bash
git add day_2/README.md
git commit -m "Add Day 2 instructor runbook"
```

---

### Task 3: Student homework guide (`day_2/student-guide.md`)

The self-sufficient handout students follow to build and deploy a landing page
for **their own** product idea (no live help). Account links, the lanes, the
anatomy checklist, a copy-paste AI prompt template with blanks, numbered deploy
steps, and the share step.

**Files:**
- Create: `day_2/student-guide.md`

- [ ] **Step 1: Create `day_2/student-guide.md` with this exact content**

````markdown
# Day 2 Homework — Build & Ship Your Landing Page

Build a landing page for a product *you* would want to exist, and deploy it to a
public URL. You'll do the same loop your instructor demoed. Budget ~1–2 hours.

## 0. Accounts & tools (do this first)

- GitHub account: https://github.com/signup
- Vercel account (sign in with GitHub): https://vercel.com/signup
- Install git: https://git-scm.com/downloads (check with `git --version`)
- A free chat AI: Claude or ChatGPT.

## 1. Pick your product and your lane

Choose a product idea — anything you wish existed. Then pick the ONE **strength
lane** you'll lead with. You don't need all of them; nail one, keep the rest
clean.

| Lane | You're the kind of person who… |
|---|---|
| Design | makes things *look* striking — color, type, spacing |
| Copy | writes a sentence that makes someone *get it* instantly |
| Layout | arranges information so the eye knows where to go |
| Motion | brings a page alive with tasteful animation |
| Interactivity | builds something you can *play with* |
| Storytelling | takes the visitor on a narrative, top to bottom |
| Personality/Humor | has a voice — funny, weird, memorable |

## 2. Know the anatomy

A good landing page almost always has: a **headline** (what it is + who it's
for) · a one-line **subhead** · a **hero visual** · the **value/benefits** · a
hint of **credibility** (a quote or number — a placeholder is fine) · **one
clear call-to-action**.

## 3. Draft it with AI

Paste this prompt into your chat AI and fill the blanks:

```
You are building a single-file landing page. Output one complete,
self-contained index.html with inline CSS — no external files, no frameworks,
no build step.

Product: [NAME] — [one sentence on what it is].
Audience: [who it's for].
Lead with: [your lane — e.g. bold design / crisp copy / clear layout / tasteful
motion / an interactive element / a story / personality & humor]. Keep
everything else clean and simple.

Include: a headline, a one-line subhead, a visual hero, two or three benefits,
one short credibility line (a placeholder quote is fine), and a single clear
call-to-action. Use a system font and one accent color. Make it responsive.
```

Save the result as `index.html`. Open it in your browser. Iterate in chat until
it feels like *yours* — ask for a bolder headline, a different color, a tighter
sentence. The AI types; the judgment is yours.

## 4. Put it under version control and ship it

```bash
mkdir my-landing-page && cd my-landing-page
# move your index.html into this folder
git init
git add index.html
git commit -m "Build my landing page"
```

Create a repo on https://github.com/new (name it `my-landing-page`), then:

```bash
git remote add origin https://github.com/<your-username>/my-landing-page.git
git branch -M main
git push -u origin main
```

Deploy: vercel.com → **Add New → Project** → import `my-landing-page` →
**Deploy**. You'll get a public URL. Open it — your page is live.

## 5. Iterate live

Change something, then:

```bash
git commit -am "Tweak the headline"
git push
```

Vercel redeploys automatically. Refresh your URL in a few seconds — your change
is live. **Every push is a new version in production.**

## 6. Share

Post your public Vercel URL where the class shares links. Be ready to say, in
one sentence, which lane you led with and why.
````

- [ ] **Step 2: Read it back as rendered markdown**

Run: `open day_2/student-guide.md` (or preview in your editor)
Expected: renders cleanly — six numbered sections, the lanes table, the prompt block, and two command blocks all display correctly.

- [ ] **Step 3: Structural presence check**

Run:
```bash
for m in 'Accounts & tools' 'github.com/signup' 'vercel.com/signup' 'strength' 'anatomy' '\[NAME\]' 'git push' 'Share'; do
  grep -qi "$m" day_2/student-guide.md && echo "OK: $m" || echo "MISSING: $m"; done
```
Expected: eight `OK:` lines, no `MISSING:`.

- [ ] **Step 4: Commit**

```bash
git add day_2/student-guide.md
git commit -m "Add Day 2 student homework guide"
```

---

## Self-Review (completed during planning)

**Spec coverage:** Every spec artifact is covered — `index.html` (Task 1),
`README.md` instructor runbook with all four acts, examples, prompt, checklist,
risks (Task 2), `student-guide.md` with prerequisites, lanes, anatomy, prompt
template, deploy steps, share (Task 3). The Act-0 placeholder page lives inline
in the README (per spec, it's too small for its own file). No analytics content
(correctly deferred).

**Placeholder scan:** No TODO/TBD placeholders. The blanks in the student prompt
template (`[NAME]`, `[who it's for]`) are intentional fill-ins for students, and
the "swap in your own" example slots are deliberate instructor choices — both
are real content, not plan gaps.

**Consistency:** The product is "AskBoard" in every artifact; the strength-lane
list and anatomy checklist are identical in the spec, README, and student guide;
the git/Vercel command sequence matches between README (demo) and student guide
(homework).

---

## Post-plan additions

After this plan executed, two enhancements were made (outside the original three
tasks) and are reflected in the spec:

1. **`day_2/lanes-gallery.html`** — a teaching aid with one live, labeled
   mini-example per strength lane, so students can picture each lane concretely.
   Referenced from the runbook's Act 1.
2. **`day_2/index.html` enhanced** — the hero question-board mock gained working
   upvote buttons (Interactivity) and the hero gained a subtle rise-in + CTA
   hover-lift (Motion, guarded by `prefers-reduced-motion`). The page still leads
   with copy + clean layout; the additions are deliberately restrained.
