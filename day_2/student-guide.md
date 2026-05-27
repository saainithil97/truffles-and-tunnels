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
