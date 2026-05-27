# Tutor Companion — Design (MVP)

**Date:** 2026-05-27
**Status:** Approved for planning
**Author:** Sai (tutor), with Claude

## Summary

A live, interactive companion the tutor uses to run a workshop for ~130
remote students. The tutor presents over video call; students join a session
from their phones/laptops by a short code (no login) and participate in live
polls and quizzes, ask questions anonymously, and leave Good/Bad/Ugly feedback.

This is a **real tool, built to be functional fast** — not paced to the course
syllabus. It runs on the same stack the course teaches (Next.js + Vercel +
Supabase) so it doubles as a reference, but shipping a usable product is the
goal.

## Goals

- The tutor can stand in front of 130 students and run live polls/quizzes with
  question-by-question control.
- Students participate with near-zero friction: open a link / enter a code,
  pick a nickname, go.
- Anonymous Q&A queue the tutor can work through live.
- Lightweight Good/Bad/Ugly feedback that nudges students into those three
  lenses, with tutor-authored quick-pick options for those who won't type.
- Robust enough to not break live in front of a class on flaky college wifi.

## Non-goals (deferred to later iterations)

- Student accounts (magic-link login), name/college profiles.
- Day-wise content upload by the tutor; student assignment uploads.
- Multi-tutor / collaborator workspaces.
- Speed-weighted ("Kahoot") scoring — leaderboard is correct-answer count only.
- Realtime websockets — polling is the MVP transport (clean seam to upgrade
  later; see Architecture).

## Users

- **Tutor** — authenticates via Supabase Auth magic link. Creates workshops and
  sessions, builds activities, runs sessions live, reviews Q&A and feedback.
- **Student** — anonymous. Identified per-session by a device-generated UUID
  (localStorage) plus a self-chosen nickname. No account.

## Stack

- **Next.js (App Router)** deployed on **Vercel**. Route handlers / server
  actions; no separate backend service.
- **Supabase** — Postgres for all data; Supabase Auth for tutor magic-link
  login. Row Level Security: tutor-only tables locked to the owner;
  participant writes go through server route handlers using a service role,
  which enforce dedup and validation.
- **Polling**, not websockets, for live updates (see Architecture).

## Domain model

- **Workshop** — owned by a tutor. `id, owner_id, title, created_at`.
- **Session** — a class/day under a workshop. Holds the live state, join code,
  activities, Q&A, and feedback config.
  `id, workshop_id, title, join_code (short, unique), status, live_activity_id (nullable), created_at`.
  - `status`: `lobby` | `running` | `feedback` | `ended`.
- **Activity** — a poll or quiz built inside a session, run live one at a time.
  `id, session_id, type ('poll'|'quiz'), prompt, position, status ('draft'|'live'|'closed')`.
  - **ActivityOption** — `id, activity_id, label, position, is_correct (bool, quiz only)`.
  - Single-select multiple choice for both poll and quiz in MVP.
- **Participant** — per-session anonymous identity.
  `id, session_id, device_uuid, nickname, created_at`. Unique on
  `(session_id, device_uuid)`.
- **Response** — one participant's answer to one activity.
  `id, activity_id, participant_id, option_id, created_at`. Unique on
  `(activity_id, participant_id)` → dedup; resubmission upserts.
- **Question** (Q&A) — anonymous question in a session.
  `id, session_id, device_uuid, body, status ('open'|'answered'), upvote_count, created_at`.
  - **QuestionUpvote** — `id, question_id, device_uuid`. Unique on
    `(question_id, device_uuid)` → one upvote per device.
- **FeedbackOption** — tutor-authored quick-pick, per lens, configured before
  the session. `id, session_id, lens ('good'|'bad'|'ugly'), label, position`.
- **Feedback** — one participant's submission.
  `id, session_id, device_uuid, created_at`. Unique on
  `(session_id, device_uuid)`; editable until session ends.
  - **FeedbackEntry** — `id, feedback_id, lens ('good'|'bad'|'ugly'), option_id (nullable), free_text (nullable)`.
    A submission can carry selected chips and/or free text per lens.

## Identity & dedup

- On first visit a student's browser generates a UUID and stores it in
  `localStorage`; it is sent with every write.
- Server enforces uniqueness in Postgres: `(activity, participant)` for
  responses, `(session, device)` for participants and feedback,
  `(question, device)` for upvotes. Duplicate writes upsert / no-op.
- IP and user-agent are **not** used for identity — a classroom shares NAT IPs
  and near-identical browsers, so they produce false collisions. The device
  UUID is primary.
- **Known limitation (documented, not engineered around):** a student who
  clears localStorage or uses another device can rejoin/re-answer. Acceptable
  for a classroom feedback/quiz tool.

## Architecture: polling, not websockets

All "live" behavior is polling against Next.js route handlers backed by
Supabase. Chosen for robustness in front of 130 students on unreliable wifi,
simplicity to debug live, and no concurrent-connection limits. Since the
leaderboard is correct-answer count (no timing), poll latency has no fairness
impact.

Endpoints:

- `GET  /api/session/:code/state` — student poll (~2s): returns session status
  and, if `running`, the live activity + its options (without `is_correct`
  until closed), or `waiting` / `feedback` / `ended`.
- `POST /api/session/:code/join` — create/lookup participant from device UUID +
  nickname.
- `POST /api/activity/:id/respond` — submit answer `{device_uuid, option_id}`;
  upserts on `(activity, participant)`.
- `GET  /api/activity/:id/results` — tutor poll (~1.5s): per-option tallies;
  for quizzes, the correct option and the leaderboard (correct-answer count by
  nickname).
- `POST /api/session/:code/questions` + `GET .../questions` — post / list Q&A.
- `POST /api/questions/:id/upvote` — one per device.
- `POST /api/session/:code/feedback` — upsert a participant's Good/Bad/Ugly
  submission (chips + free text).

**Upgrade seam:** the student `state` poll can later be backed by a Supabase
Realtime broadcast for the "question opened" signal without changing the data
model. Out of scope for MVP.

## Key flows

### Tutor — build & run a session
1. Log in (magic link). Create a workshop, then a session under it (gets a join
   code + shareable link + QR).
2. Pre-build ordered activities (poll/quiz, prompt, options, correct answer for
   quizzes). Pre-fill feedback chips for each lens.
3. Start the session (`lobby` → `running`). Share the code/link on screen.
4. Per activity: **Open** (sets `live_activity_id`, activity `live`) → watch the
   tally fill in → **Close** (reveals correct answer / final distribution,
   locks responses, updates leaderboard) → **Next**.
5. Work the Q&A queue alongside (mark answered, sort by upvotes).
6. **End teaching** → flip session to `feedback`; students see the Good/Bad/Ugly
   screen. Review aggregated chips + free-text columns. **End** the session.

### Student — participate
1. Open link / enter code → enter a nickname (stored on device for the session).
2. Screen polls session state: shows "waiting" between activities, the live
   question while one is open (single-select; submit locks their choice until
   close), and results once the tutor closes it.
3. Q&A tab: post anonymously, upvote others.
4. When the tutor opens feedback: per lens, tap tutor's chips and/or write free
   text; submit (editable until the session ends).

## Tutor console — live view (layout TBD with a mockup)
A control screen showing the current activity with live tallies, Open/Close/Next
controls, the activity list/queue, a Q&A panel, and (post-close) the
leaderboard. Exact layout to be designed with a visual mockup during
implementation.

## Testing

- Unit: dedup constraints (response upsert, one participant per device, one
  upvote per device, one feedback per device), quiz scoring (correct-answer
  count), state transitions (`lobby`/`running`/`feedback`/`ended`,
  draft/live/closed).
- Integration: full live run — join, open activity, multiple participants
  answer (incl. duplicate submit), close + reveal, leaderboard; Q&A post +
  upvote; feedback submit + edit.
- Manual: load-feel check with concurrent pollers approximating a class.

## Open questions (resolve during planning)
- Join-code format/length and collision handling.
- Whether activities can be reordered/edited after a session starts running.
- QR generation (client-side lib vs. server).
