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

Open `lanes-gallery.html` here to **show** each lane as a live mini-example —
useful for students who can't yet picture what "motion" or "interactivity" looks
like on a page. (It's a teaching reference, not a template — note out loud that a
real page leads with ONE lane, unlike this gallery which shows all seven.)

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
