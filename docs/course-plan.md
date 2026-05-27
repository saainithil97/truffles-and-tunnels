# Course Plan — Building a Real Product, End to End

A multi-day course that takes second-year CS students from "how the web works"
to shipping, instrumenting, and operating a real product. The spine project is
a **movie discovery app**, built incrementally; a personal **landing page**
(Day 2) serves as a low-stakes warm-up for the ship-it loop and design taste.

**Audience:** ~130 second-year CS students, remote over video call.
**Delivery:** lecture-demo + light hands-on, with homework that compounds
day over day. Each session demos the core; students build their own after.

> Note on numbering: the landing-page session was inserted as **Day 2**, so the
> original Day 2–8 are now Day 3–9. Cross-references below use the new numbers.

---

## Day 1 — The Big Picture *(done)*

Swiggy case study: walk through the HLD of the ordering flow (user → CDN →
load balancer → API gateway → services), then zoom into one slice for LLD — say,
the restaurant listing to order placement flow. The point isn't to be
exhaustive, it's to show them that every product they use daily is a system of
systems. Then the "how the web works" demo (`day_1/`): a server answers
requests, a browser renders responses, Swiggy is doing the same at scale.

> What actually happened on Day 1 was the case study + the web-works overview.
> The movie-app PRD handout and the first Next.js deploy described in the
> original plan did **not** happen here — the first deploy now lands in Day 2
> (the landing page), and the movie-app PRD + Next.js scaffolding moves to the
> start of Day 3.

## Day 2 — Landing Page & The Deploy Loop

A personal warm-up project and **their first deploy**: each student builds and
ships a landing page for a product *they* want to build. The focus is two
things — internalizing the **push-to-deploy loop** (commit → push → it's live,
felt for the first time here) and learning to **judge** what makes a landing
page good, then building one that plays to their own strength. Static
HTML/CSS/JS (builds directly on the HTML/CSS/JS they saw Day 1; no Next.js
yet), deployed on Vercel. Full session design:
`day_2/docs/superpowers/specs/2026-05-27-day2-landing-page-design.md`.

Homework: build and deploy your own landing page; share the public URL.

## Day 3 — Rendering Strategies

Open by **handing out the movie discovery app PRD and scaffolding a blank
Next.js app** (GitHub + Vercel are already familiar from Day 2's static deploy —
this is the same loop with a real framework). Then the rendering content:
this is where you teach SSR, SSG, CSR, ISR — but grounded in real examples.
"Swiggy's restaurant list that rarely changes — SSG or SSR? The live order
tracking page — CSR with polling or SSR? Why?" Then map it to the movie app:
the catalog page is a great SSG candidate, individual movie pages could be SSR
or ISR. Cover Next.js app router, layouts, routing. Homework: build the listing
page and detail page with hardcoded data, deploy it.

## Day 4 — Interactivity and State

Client-side state with React hooks, search/filter/sort (all client-side for
now), responsive design with Tailwind. This is also a good day to introduce the
PR workflow — have them open their first pull request for the Day 3 homework so
you can review one or two live at the start of the next session. Homework: add
search and filters, make it mobile-friendly, submit as a PR.

## Day 5 — API Integration

REST fundamentals, HTTP methods, status codes, headers — the stuff they've
probably heard of but never thought deeply about. Walk through your dummy API:
here's the contract, here's what each endpoint returns, here's what a 404 vs 500
means for the user experience. The concept to emphasize is graceful
degradation — loading states, error states, empty states. These three states
are what separate a student project from a real product. Homework: rip out the
hardcoded data, integrate with your API, handle all three states.

## Day 6 — Persistence

This is where it gets interesting. They've been reading data from your API, but
user-specific actions (watchlist, ratings) need to be stored somewhere. You
could go with Supabase here — free tier, quick setup, works well with Next.js,
and it introduces them to SQL, schema design, and row-level security without
needing to run a database locally. The concept is data modeling: what's the
schema for a watchlist? How do you handle a user rating a movie — is it an
upsert? Walk through your schema design decisions. Homework: add watchlist and
ratings backed by Supabase.

## Day 7 — Observability

This is the day you don't just lecture — you run a workshop. Ask them: "You're
the PM and the engineer for this movie app. What numbers would you show your
CEO? What would you want on a dashboard at 3am when something breaks?" Let them
brainstorm business metrics (search queries with zero results, most wishlisted
movies, rating distribution) and engineering metrics (API response times, error
rates, page load times). Then show them how to instrument a few of these — even
simple console.log based event tracking that writes to Vercel's logging is fine.
The production incident exercise fits perfectly here: "your API starts returning
500s for half the requests — walk me through how you'd figure out what's going
on."

## Day 8 — Production Engineering

CI/CD, environment variables (why you don't hardcode API URLs), preview
deployments on Vercel (every PR gets its own URL — this is magic for students
who've never seen it), git branching strategies. This is also where you talk
about what happens after you ship — rollbacks, feature flags, the concept of
deploying doesn't mean releasing. If you have time, touch on basic security:
don't commit secrets, what a .env file is, what CORS is and why it exists.

## Day 9 — The Real World

This is the capstone. Do a live code review of 2-3 student PRs — pick ones that
show interesting decisions, not necessarily the "best" code. Talk about how
engineering orgs work: sprints, standups, on-call, post-mortems, design docs.
This is where the AI conversation fits naturally — "here's how the job has
changed, here's what AI can and can't do, here's why understanding systems
matters more than memorizing syntax." Open Q&A to close it out.
