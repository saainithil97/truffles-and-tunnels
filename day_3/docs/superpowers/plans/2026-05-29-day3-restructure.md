# Day 3 Restructure Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Burn down the bloated Day 3 (19 demos, 7 parts) and rebuild on the 5-part / 15-demo spine from `2026-05-29-day3-restructure-design.md`. Phases A + B (archive + outline scaffold) ship in this plan; Phase C (per-beat content + demo rebuilds) decomposes into 15 follow-on sub-projects.

**Architecture:** Two Next.js apps in this repo (`site/` and `day_3/demo_7_8_nextjs/`) plus a Python static-server-per-demo workshop tree in `day_3/`. The site reads markdown from `day_3/<demo>/README.md` via `site/scripts/copy-content.mjs` (runs as `predev` / `prebuild`) and renders it through `site/app/days/3/demos/[slug]/page.tsx` driven by `site/lib/curriculum.ts`. The restructure changes only the *contents* of `day_3/` and the curriculum manifest — the site shell, theme, routing, and rendering are untouched.

**Tech Stack:** Next.js (site shell), TypeScript (curriculum manifest), Node.js (`copy-content.mjs`), Python + FastAPI (per-demo static servers), git (archive + commits).

---

## Spec reference

This plan implements `day_3/docs/superpowers/specs/2026-05-29-day3-restructure-design.md`. The final 5-part / 15-demo shape comes from that spec; this plan does not re-litigate any structural decisions.

## Plan scope: Phases A + B only

The spec calls for outline-first, then per-beat content + demo rebuilds. This plan covers:

- **Phase A — Archive.** Snapshot the existing `day_3/` tree (plus its rendered content under `site/`) to `archive/day_3-2026-05-29/`. One commit.
- **Phase B — Outline scaffold.** Replace `day_3/README.md`, `site/lib/curriculum.ts` (the Day 3 sections), and `site/scripts/copy-content.mjs` with the new structure. Stub `day_3/<demo>/README.md` and `site/content/day_3/<demo>.md` for every new beat with a placeholder that links back to the spec. Verify the site builds end-to-end against the stubs.

**Phase C** — the 15 per-beat rebuilds — is **out of scope for this plan**. Each beat is its own sub-project: a new content brainstorm (often a tiny one — for lift-and-update beats it's "what's the new framing?"), an optional micro-spec, then a focused plan/commit. The "Phase C handoff" section at the end of this plan lists each beat in execution order with what to lift from the archive and what the spec says it needs to become.

## File structure

After Phase B completes, the relevant Day 3 surface area is:

**Archive (created in Phase A — never modified after):**
- `archive/day_3-2026-05-29/day_3/` — mirror of current `day_3/` (excluding `__pycache__`, `.venv`, `.pytest_cache`)
- `archive/day_3-2026-05-29/site-content/` — mirror of current `site/content/day_3/`
- `archive/day_3-2026-05-29/site-public/` — mirror of current `site/public/live-demos/`
- `archive/day_3-2026-05-29/README.md` — short note explaining what this snapshot is and which spec triggered it

**Modified by Phase B:**
- `day_3/README.md` — rewritten to the new 5-part outline
- `site/lib/curriculum.ts` — `day3Demos`, `verbalSegments`, `day3Parts` replaced; types and exports unchanged
- `site/scripts/copy-content.mjs` — `markdownDemos`, `demoSourceFiles`, `staticDemos` arrays replaced

**Stubbed by Phase B (new files, placeholder content):**

Per the spec, Phase B leaves a stub for every beat in the new outline so the site renders the full 5-part shape end-to-end before any content is written. Each stub is a `README.md` under `day_3/<id>/` whose body is a short "placeholder — see spec" line. `copy-content.mjs` then copies each stub into `site/content/day_3/<id>.md`.

Stubs to create (per the spec):

| Part | id | Notes |
|------|------|------|
| 1 | `demo_1` | already exists — leave content intact, restructured later in Phase C |
| 1 | `demo_2` | already exists — leave intact, restructured later |
| 1 | `demo_3` | already exists — leave intact, restructured later |
| 1 | `demo_2_5` | already exists — leave intact, restructured later |
| 1 | `verbal-segments` (Other APIs section) | rewrite the verbal-segments page in Phase C; leave existing file for now |
| 2 | `demo_4` | already exists — leave intact, restructured later |
| 2 | `demo_5` | already exists — leave intact, restructured later |
| 2 | `demo_6` | already exists — leave intact, restructured later |
| 2 | `demo_6_3` | already exists — leave intact, will absorb 6.2 framing in Phase C |
| 3 | `demo_6_5` | already exists — leave intact, restructured later |
| 3 | `demo_6_7` | already exists — leave intact (now under Part 3, was Part 3 before too) |
| 3 | `demo_6_6` | already exists — leave intact, will absorb 6.8 + 8.5 in Phase C |
| 4 | `demo_7` | already exists |
| 4 | `demo_8` | already exists |
| 5 | `demo_9` | already exists |
| 5 | `demo_10` | already exists |
| 5 | `wrap` | already exists — trim to audit only in Phase C |

**Key insight:** Phase B does NOT delete anything from `day_3/` (the archive already captured it). It only changes how `curriculum.ts` and `README.md` see the tree. The unused demo folders (`demo_2_75`, `demo_6_2`, `demo_6_8`, `demo_8_5`'s split) stay on disk but stop being referenced. Phase C deletes them per beat as we go.

## Conventions used in this plan

- All file paths are absolute from the repo root (`/Users/saainithil/Code/teach/`).
- "Commit" steps use a leading subject line in imperative form and end with the standard Co-Authored-By trailer.
- "Run" steps assume zsh on macOS with the repo root as cwd unless otherwise stated.
- TDD doesn't directly apply to outline scaffolding (no test framework for markdown structure / curriculum types). The substitute is **build verification**: after every structural change, run `cd site && npm run predev` and visit `http://localhost:3000/days/3` to confirm all 18 segments render and no link 404s.

---

## Phase A — Archive

### Task A1: Snapshot Day 3 to `archive/day_3-2026-05-29/`

**Files:**
- Create: `archive/day_3-2026-05-29/README.md`
- Create (via copy): `archive/day_3-2026-05-29/day_3/...`
- Create (via copy): `archive/day_3-2026-05-29/site-content/...`
- Create (via copy): `archive/day_3-2026-05-29/site-public/...`

- [ ] **Step 1: Confirm working tree is committed**

Run: `git status --porcelain`
Expected: empty output (everything already committed; this plan and the spec are on the branch).

If anything is uncommitted that isn't related to this restructure, stash or commit before starting.

- [ ] **Step 2: Create the archive directory**

Run:
```bash
mkdir -p /Users/saainithil/Code/teach/archive/day_3-2026-05-29
```

- [ ] **Step 3: Copy `day_3/` into the archive, excluding caches**

Run:
```bash
rsync -a \
  --exclude '__pycache__' \
  --exclude '.venv' \
  --exclude '.pytest_cache' \
  --exclude '.DS_Store' \
  /Users/saainithil/Code/teach/day_3/ \
  /Users/saainithil/Code/teach/archive/day_3-2026-05-29/day_3/
```

Verify:
```bash
ls /Users/saainithil/Code/teach/archive/day_3-2026-05-29/day_3/
```
Expected: shows `demo_1`, `demo_2`, …, `demo_10`, `wrap`, `verbal-segments.md`, `README.md`, `docs/`, etc. — same listing as `ls day_3/` but without `__pycache__` / `.venv`.

- [ ] **Step 4: Copy `site/content/day_3/` into the archive**

Run:
```bash
rsync -a \
  /Users/saainithil/Code/teach/site/content/day_3/ \
  /Users/saainithil/Code/teach/archive/day_3-2026-05-29/site-content/
```

Verify:
```bash
ls /Users/saainithil/Code/teach/archive/day_3-2026-05-29/site-content/ | head
```
Expected: shows `demo_1.md`, `demo_2.md`, …, `wrap.md`, `verbal-segments.md`, plus per-demo `code/` subdirs.

- [ ] **Step 5: Copy `site/public/live-demos/` into the archive**

Run:
```bash
rsync -a \
  /Users/saainithil/Code/teach/site/public/live-demos/ \
  /Users/saainithil/Code/teach/archive/day_3-2026-05-29/site-public/
```

Verify:
```bash
ls /Users/saainithil/Code/teach/archive/day_3-2026-05-29/site-public/
```
Expected: shows the per-demo static asset directories (`demo_1/`, `demo_4/`, etc.).

- [ ] **Step 6: Write the archive README**

Create `/Users/saainithil/Code/teach/archive/day_3-2026-05-29/README.md` with:

```markdown
# Day 3 snapshot — 2026-05-29

A one-shot snapshot of `day_3/`, `site/content/day_3/`, and
`site/public/live-demos/` taken immediately before the restructure
specified in
[`day_3/docs/superpowers/specs/2026-05-29-day3-restructure-design.md`](../../day_3/docs/superpowers/specs/2026-05-29-day3-restructure-design.md).

This directory is **read-only reference material**. Nothing here is wired
into `copy-content.mjs` or `curriculum.ts`; the deploy never sees it.

## Why it exists

The restructure cuts Demo 2.75, folds Demo 6.2 into 6.3, folds Demos 6.8
and 8.5 into 6.6, and re-merges Parts 4 / 5 / 5.5 into one Part 4. The
underlying *code* of every existing demo is still useful — the cuts are
about pedagogical framing, not implementation quality. When rebuilding a
beat, lift code, prose fragments, and diagrams from here.

## Layout

- `day_3/` — mirror of the workshop tree at the snapshot moment.
- `site-content/` — mirror of `site/content/day_3/` (rendered markdown +
  per-demo `code/` staging dirs).
- `site-public/` — mirror of `site/public/live-demos/` (deployed static
  demo assets).

## How to look something up

To recover the old version of a demo's README or source:

    ls archive/day_3-2026-05-29/day_3/<demo_id>/

To recover the old rendered content the site was using:

    cat archive/day_3-2026-05-29/site-content/<demo_id>.md
```

- [ ] **Step 7: Verify the archive size is reasonable**

Run:
```bash
du -sh /Users/saainithil/Code/teach/archive/day_3-2026-05-29/
```
Expected: a few MB to ~50 MB (depending on how much is in `live-demos/`). If it's hundreds of MB, a cache slipped through — investigate before committing.

- [ ] **Step 8: Stage and commit the archive**

Run:
```bash
cd /Users/saainithil/Code/teach
git add archive/
git status --short | head -5
```
Expected: shows `A  archive/day_3-2026-05-29/...` entries.

Then commit:
```bash
git commit -m "archive: snapshot day_3 before 2026-05-29 restructure

One-shot read-only snapshot of day_3/, site/content/day_3/, and
site/public/live-demos/ taken immediately before the burn-and-rebuild
specified in day_3/docs/superpowers/specs/2026-05-29-day3-restructure-design.md.

Lives outside the deploy tree (copy-content.mjs and curriculum.ts never
reference archive/). Source of truth for any 'we already wrote that
code, let's lift it' moments during Phase C.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

Verify:
```bash
git log --oneline -1
```
Expected: the new "archive: snapshot day_3 before..." commit.

---

## Phase B — Outline scaffold

The goal of Phase B is to make the new 5-part / 15-demo shape visible end-to-end across `day_3/README.md`, `site/lib/curriculum.ts`, and the rendered site. After Phase B, every beat in the new outline has a working URL with placeholder content; no beat is missing and no broken link exists.

### Task B1: Rewrite `day_3/README.md` to the new outline

**Files:**
- Modify: `/Users/saainithil/Code/teach/day_3/README.md`

- [ ] **Step 1: Read the current `day_3/README.md`**

Run:
```bash
cat /Users/saainithil/Code/teach/day_3/README.md | head -40
```
Familiarise with the current structure so the rewrite preserves intro paragraph + the "Running the demos" footer.

- [ ] **Step 2: Replace the Demos section with the new 5-part structure**

Rewrite `day_3/README.md` so that:

- The intro paragraph stays.
- The Demos section is exactly the structure below (verbatim — this is the canonical outline that `curriculum.ts` mirrors).
- The "Design docs" section stays.
- The "Running the demos" section stays but updates the bullet list to match the new demo set (drop Demos 6.2, 6.7-as-Vite, 6.8, 8.5, 2.75; keep 1, 2, 2.5, 3, 4, 5, 6, 6.3, 6.5, 6.6, 6.7, 7/8, 9, 10, wrap).

New Demos section:

```markdown
## Demos

### Part 1 — The browser as a platform

- **[Demo 1 — Network](demo_1/README.md)** — the request lifecycle.
- **[Demo 2 — The DOM is not the HTML](demo_2/README.md)** — parsing and the live DOM.
- **[Demo 3 — Order matters: render-blocking JS and CSS](demo_3/README.md)** — script placement on Slow 3G.
- **[Demo 2.5 — Storage](demo_2_5/README.md)** — cookies vs localStorage / sessionStorage.
- **[Verbal — Other browser APIs](verbal-segments.md)** — quick tour: `fetch`, `IntersectionObserver`, `ResizeObserver`, `history`, Web Workers, `requestAnimationFrame`.

### Part 2 — Why do we need React (or other libraries)?

- **[Demo 4 — The DOM is expensive](demo_4/README.md)** — layout thrash vs batched updates.
- **[Demo 5 — Imperative tangles](demo_5/README.md)** — vanilla Swiggy search/filter that stays clean until features pile on.
- **[Demo 6 — What React solves for](demo_6/README.md)** — JSX, vDOM, reconciliation.
- **[Demo 6.3 — React is a library](demo_6_3/README.md)** — two script tags from unpkg, one component, `useState`, no build.
- **[Verbal — Other libraries and frameworks](verbal-segments.md)** — Vue, Svelte, Solid, Angular, what each solves differently.

### Part 3 — Single-Page Apps

- **[Demo 6.5 — What's an SPA, why](demo_6_5/README.md)** — one HTML shell + a tiny JS router (`pushState` + click interception + `popstate`).
- **[Demo 6.7 — How a modern stack builds one](demo_6_7/README.md)** — bundlers, tree shaking, code splitting, `React.lazy`. Vite as the worked example.
- **[Demo 6.6 — Why Next when React exists](demo_6_6/README.md)** — file-based routing, free dev server, free SSR, free bundler, free `<Link>` navigation.

### Part 4 — Rendering strategies

- **[Demo 7 — SSG, CSR, SSR](demo_7_8_nextjs/demo_7.md)** — identical Swiggy grid at `/ssg`, `/csr`, `/ssr`. View Source is the reveal.
- **[Demo 8 — Hydration: server vs client components](demo_7_8_nextjs/demo_8.md)** — server-rendered grid with a client-rendered search box.

### Part 5 — Perf, security, and the real world

- **[Demo 9 — Core Web Vitals](demo_9/README.md)** — Lighthouse; LCP / INP / CLS.
- **[Demo 10 — Frontend security](demo_10/README.md)** — XSS via `innerHTML`, the safe `textContent` path, a CORS error.
- **[Wrap — Swiggy DevTools audit](wrap/README.md)** — point DevTools at swiggy.com; code-split chunks, lazy images, the production waterfall.
```

- [ ] **Step 3: Update the "Running the demos" bullets**

Drop the bullets for Demos 6.5 (was special-cased), 8.5 (Next sub-app split), and 2.75 if they don't apply anymore. Keep the Demo 2 / Demos 5+6 / Demos 7/8 / Demo 9 special-cases since they're still accurate.

- [ ] **Step 4: Verify the README renders cleanly in a markdown preview**

Run:
```bash
grep -c "^- \*\*\[Demo" /Users/saainithil/Code/teach/day_3/README.md
```
Expected: `13` (the 13 numbered demo bullets — does not count the two `Verbal —` bullets or the `Wrap —` bullet).

```bash
grep -c "^### Part" /Users/saainithil/Code/teach/day_3/README.md
```
Expected: `5`.

- [ ] **Step 5: Commit**

```bash
cd /Users/saainithil/Code/teach
git add day_3/README.md
git commit -m "day_3 README: rewrite to 5-part / 15-demo outline

Mirrors the structure in
docs/superpowers/specs/2026-05-29-day3-restructure-design.md. Drops
demo_2_75, demo_6_2, demo_6_8, demo_8_5 from the index. Folds Parts
4/5/5.5 into one Part 4. Replaces the wrap's three mini-demos with the
swiggy.com audit only. No demo code or content changes yet — those land
beat-by-beat in Phase C.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

### Task B2: Rewrite the Day 3 sections of `site/lib/curriculum.ts`

**Files:**
- Modify: `/Users/saainithil/Code/teach/site/lib/curriculum.ts` (lines ~67–484)

- [ ] **Step 1: Skim the current `day3Demos`, `verbalSegments`, and `day3Parts` blocks**

Run:
```bash
sed -n '67,484p' /Users/saainithil/Code/teach/site/lib/curriculum.ts | head -80
```
Goal: identify each `Demo` object's keys (`id`, `slug`, `shortTitle`, `title`, `summary`, `readmeSourcePath`, `contentFile`, `kind`, `iframePath`, `iframeUrlEnvVar`, `runbookHint`, `sourceFiles`, `sourceCodeFromDemo`).

- [ ] **Step 2: Replace `day3Demos` with the new 15-demo list**

Each entry in the new list keeps the same `Demo` object shape. For demos that are unchanged conceptually (1, 2, 2.5, 3, 4, 5, 6, 6.5, 6.7, 7, 8, 9, 10), copy the existing entry verbatim. For demos that change (6.3 absorbs 6.2; 6.6 absorbs 6.8 + 8.5), keep the existing entry and edit `summary` / `shortTitle` in Phase C — Phase B does *not* edit those yet.

Drop these entries entirely (they're no longer in the new outline):
- `demo_2_75`
- `demo_6_2`
- `demo_6_8`
- `demo_8_5`

So the new `day3Demos` array contains, in this order:
`demo_1`, `demo_2`, `demo_2_5`, `demo_3`, `demo_4`, `demo_5`, `demo_6`, `demo_6_3`, `demo_6_5`, `demo_6_7`, `demo_6_6`, `demo_7`, `demo_8`, `demo_9`, `demo_10`, `wrap`.

(That's 15 demos + the wrap entry.)

Exact edit: open `curriculum.ts`, find the four blocks for `demo_2_75`, `demo_6_2`, `demo_6_8`, `demo_8_5`, delete each block (including its trailing comma).

- [ ] **Step 3: Replace `day3Parts` with the new 5-part list**

Replace lines ~448–484 with:

```typescript
// Day 3 parts mirror the exact headings from day_3/README.md.
export const day3Parts: DayPart[] = [
  {
    heading: "Part 1 — The browser as a platform",
    demoSlugs: ["demo_1", "demo_2", "demo_3", "demo_2_5", "verbal-segments"],
  },
  {
    heading: "Part 2 — Why do we need React (or other libraries)?",
    demoSlugs: ["demo_4", "demo_5", "demo_6", "demo_6_3", "verbal-segments"],
  },
  {
    heading: "Part 3 — Single-Page Apps",
    demoSlugs: ["demo_6_5", "demo_6_7", "demo_6_6"],
  },
  {
    heading: "Part 4 — Rendering strategies",
    demoSlugs: ["demo_7", "demo_8"],
  },
  {
    heading: "Part 5 — Perf, security, and the real world",
    demoSlugs: ["demo_9", "demo_10", "wrap"],
  },
];
```

Note: `verbal-segments` appears in both Part 1 and Part 2. The site's part-rendering code allows the same slug in multiple parts (it's just a lookup); confirm in Step 4.

- [ ] **Step 4: Type-check and visually verify**

Run:
```bash
cd /Users/saainithil/Code/teach/site
npx tsc --noEmit
```
Expected: exits 0. If it complains about `verbal-segments` appearing twice, fix the rendering code to dedupe; if it complains about missing demo entries, the deletions in Step 2 broke a reference — search for `demo_2_75 | demo_6_2 | demo_6_8 | demo_8_5` in the file:

```bash
grep -n "demo_2_75\|demo_6_2\|demo_6_8\|demo_8_5" /Users/saainithil/Code/teach/site/lib/curriculum.ts
```
Expected after the deletes: no matches.

- [ ] **Step 5: Run the dev server and spot-check**

Run:
```bash
cd /Users/saainithil/Code/teach/site
npm run dev
```
Open `http://localhost:3000/days/3`. Expected: five parts visible with the new headings; 15 demo cards + the wrap + verbal-segments link, no duplicates from the dropped IDs. Click into a couple of demos to confirm pages render.

Stop the dev server when done.

- [ ] **Step 6: Commit**

```bash
cd /Users/saainithil/Code/teach
git add site/lib/curriculum.ts
git commit -m "site/curriculum: collapse to 5-part / 15-demo Day 3 outline

Drops demo_2_75, demo_6_2, demo_6_8, demo_8_5 entries. Replaces
day3Parts with the new five parts: Browser as a platform / Why React /
SPA / Rendering strategies / Perf+security+real-world. Per-demo
summaries and shortTitles are unchanged in this commit; they re-frame
beat-by-beat in Phase C.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

### Task B3: Update `site/scripts/copy-content.mjs` to drop dead entries

**Files:**
- Modify: `/Users/saainithil/Code/teach/site/scripts/copy-content.mjs`

- [ ] **Step 1: Remove dropped demos from `markdownDemos`**

Open `site/scripts/copy-content.mjs` and remove these four lines from the `markdownDemos` array:

```javascript
  { src: "demo_2_75/README.md", dest: "demo_2_75.md" },
  { src: "demo_6_2/README.md", dest: "demo_6_2.md" },
  { src: "demo_6_8/README.md", dest: "demo_6_8.md" },
  { src: "demo_7_8_nextjs/demo_8_5.md", dest: "demo_8_5.md" },
```

- [ ] **Step 2: Remove dropped demos from `demoSourceFiles`**

In the same file, remove the `demo_2_75` block from `demoSourceFiles` (it's the only dropped demo currently in that map).

- [ ] **Step 3: Remove dropped demos from `staticDemos`**

In the same file, remove `"demo_2_75"` from the `staticDemos` array.

- [ ] **Step 4: Run the script and verify it succeeds**

Run:
```bash
cd /Users/saainithil/Code/teach/site
node scripts/copy-content.mjs
```
Expected: no warnings about missing source files for the four dropped demos. The console shows copies for the remaining demos only.

- [ ] **Step 5: Confirm stale content files were not regenerated**

Run:
```bash
ls /Users/saainithil/Code/teach/site/content/day_3/ | grep -E "demo_2_75|demo_6_2|demo_6_8|demo_8_5"
```
Expected: nothing — but if the previous build left files behind, they're still there as snapshots. Delete them:

```bash
rm -f /Users/saainithil/Code/teach/site/content/day_3/demo_2_75.md \
      /Users/saainithil/Code/teach/site/content/day_3/demo_6_2.md \
      /Users/saainithil/Code/teach/site/content/day_3/demo_6_8.md \
      /Users/saainithil/Code/teach/site/content/day_3/demo_8_5.md
rm -rf /Users/saainithil/Code/teach/site/content/day_3/demo_2_75 \
       /Users/saainithil/Code/teach/site/content/day_3/demo_6_2 \
       /Users/saainithil/Code/teach/site/content/day_3/demo_6_8
rm -rf /Users/saainithil/Code/teach/site/public/live-demos/demo_2_75
```

- [ ] **Step 6: Commit**

```bash
cd /Users/saainithil/Code/teach
git add site/scripts/copy-content.mjs site/content/day_3/ site/public/live-demos/
git commit -m "site/copy-content: drop dropped Day 3 demos from staging

Removes demo_2_75, demo_6_2, demo_6_8, and demo_8_5 from markdownDemos,
demoSourceFiles, and staticDemos. Also deletes their stale generated
content + live-demo snapshots so the next build doesn't serve dead URLs.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

### Task B4: Remove dropped demo source folders from `day_3/`

**Files:**
- Delete: `/Users/saainithil/Code/teach/day_3/demo_2_75/`
- Delete: `/Users/saainithil/Code/teach/day_3/demo_6_2/`
- Delete: `/Users/saainithil/Code/teach/day_3/demo_6_8/`
- Delete: `/Users/saainithil/Code/teach/day_3/demo_8_5/` (only if it exists as its own folder — Demo 8.5 may live inside `demo_7_8_nextjs/`)

- [ ] **Step 1: Confirm the dropped folders exist and are archived**

Run:
```bash
ls /Users/saainithil/Code/teach/day_3/ | grep -E "demo_2_75|demo_6_2|demo_6_8|demo_8_5"
ls /Users/saainithil/Code/teach/archive/day_3-2026-05-29/day_3/ | grep -E "demo_2_75|demo_6_2|demo_6_8"
```
Expected: first command shows the folders that exist in `day_3/`; second confirms they're already in the archive.

- [ ] **Step 2: Delete the dropped demo folders**

Run:
```bash
rm -rf /Users/saainithil/Code/teach/day_3/demo_2_75 \
       /Users/saainithil/Code/teach/day_3/demo_6_2 \
       /Users/saainithil/Code/teach/day_3/demo_6_8
```

(Do not delete anything under `demo_7_8_nextjs/` — the Demo 8.5 content there will be absorbed into Demo 6.6 during Phase C, not yet.)

- [ ] **Step 3: Verify the site still builds**

Run:
```bash
cd /Users/saainithil/Code/teach/site
node scripts/copy-content.mjs
npx tsc --noEmit
```
Expected: no warnings about missing demo folders, type-check passes.

- [ ] **Step 4: Commit**

```bash
cd /Users/saainithil/Code/teach
git add -A day_3/
git commit -m "day_3: delete dropped demo source folders (2.75, 6.2, 6.8)

Demos cut per
day_3/docs/superpowers/specs/2026-05-29-day3-restructure-design.md.
Source preserved in archive/day_3-2026-05-29/day_3/<id>/.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

### Task B5: End-to-end build verification of the outline scaffold

**Files:**
- None modified. This task is a verification gate.

- [ ] **Step 1: Run a clean build of the site**

Run:
```bash
cd /Users/saainithil/Code/teach/site
rm -rf .next
npm run build 2>&1 | tail -40
```
Expected: build succeeds; output shows 15 demo routes + verbal-segments + wrap under `/days/3/demos/<slug>`.

- [ ] **Step 2: Smoke-test the dev server**

Run:
```bash
cd /Users/saainithil/Code/teach/site
npm run dev &
sleep 6
curl -fsS http://localhost:3000/days/3 > /dev/null && echo "OK: /days/3"
for slug in demo_1 demo_2 demo_2_5 demo_3 demo_4 demo_5 demo_6 demo_6_3 demo_6_5 demo_6_7 demo_6_6 demo_7 demo_8 demo_9 demo_10 wrap verbal-segments; do
  curl -fsS http://localhost:3000/days/3/demos/$slug > /dev/null && echo "OK: $slug" || echo "FAIL: $slug"
done
kill %1
```
Expected: every line prints `OK:`. Any `FAIL:` means a stub is missing or the curriculum still references a deleted id.

- [ ] **Step 3: Confirm dropped URLs 404 cleanly**

Run:
```bash
cd /Users/saainithil/Code/teach/site
npm run dev &
sleep 6
for slug in demo_2_75 demo_6_2 demo_6_8 demo_8_5; do
  code=$(curl -o /dev/null -s -w "%{http_code}" http://localhost:3000/days/3/demos/$slug)
  echo "$slug: $code"
done
kill %1
```
Expected: every code is `404`.

- [ ] **Step 4: Tag Phase B complete**

Run:
```bash
cd /Users/saainithil/Code/teach
git tag day3-restructure-phase-b-complete
git log --oneline -10
```
Expected: tag points at the most recent Phase B commit; log shows the spec commit, then A1, B1, B2, B3, B4 in order. (Re-tag if more commits land before this step.)

---

## Phase C — Per-beat rebuilds (handoff)

Phase C decomposes into 15 separate sub-projects, one per beat. Each sub-project is its own brainstorm → spec → plan → commit cycle. Spec'ing all 15 inside this plan would produce a 5000-line document of speculative content decisions; instead, this section is the **execution order** with a one-liner per beat describing what changes, what to lift from the archive, and what the spec demands.

Execute Phase C beats top-to-bottom. Each beat is its own commit (or small commit cluster). For lift-and-reframe beats (most of Part 1, Part 4, Part 5), the brainstorm is small — usually one question: "what's the new framing sentence?" For fold-and-merge beats (6.3 absorbs 6.2, 6.6 absorbs 6.8 + 8.5, wrap trims to audit), there's real content design work.

### Part 1 — lift + light reframe

1. **`demo_1` — Network.** Lift content from `archive/day_3-2026-05-29/site-content/demo_1.md`. Reframe the intro to "the first half of Part 1: the network is the wire, here's what travels on it." No demo source changes.
2. **`demo_2` — DOM is not the HTML.** Lift content from archive. Reframe as "rendering engine, part one: what the browser builds from the HTML."
3. **`demo_3` — Order matters.** Lift content from archive. Reframe as "rendering engine, part two: what blocks the build." Move adjacent to Demo 2 in the site nav.
4. **`demo_2_5` — Storage.** Lift content from archive. No reframe needed.
5. **`verbal-segments` (Other browser APIs section).** Rewrite the Part 1 sub-section as the new "Other browser APIs" tour. Existing Tooling Break / CSS sections may stay or move depending on whether you keep them as Part 2 / Part 3 interludes.

### Part 2 — lift + reframe + one merge

6. **`demo_4` — DOM is expensive.** Lift content from archive. Reframe lede as "Issue #1 with pure HTML+CSS+JS: the DOM is slow if you ask it to do too much."
7. **`demo_5` — Imperative tangles.** Lift content from archive. Reframe lede as "Issue #2: even when it's fast, it tangles."
8. **`demo_6` — What React solves for.** Lift content from archive. Reframe lede to position React as "the answer to both issues."
9. **`demo_6_3` — React is a library.** Lift content from archive. **Absorb Demo 6.2:** open `archive/day_3-2026-05-29/site-content/demo_6_2.md`, lift the "library vs framework" framing and the "what React deliberately omits" table, paste at the top of the new `demo_6_3` content. The script-tag demo then *proves* the framing.
10. **`verbal-segments` (Other libraries section).** Add the new "Vue / Svelte / Solid / Angular" verbal segment to the same verbal-segments page.

### Part 3 — light lift on 6.5 + 6.7; major merge on 6.6

11. **`demo_6_5` — What's an SPA, why.** Lift content from archive. Reframe lede as "the SPA: why people built them, what they cost."
12. **`demo_6_7` — How a modern stack builds one.** Lift content from archive. Reframe to slot between 6.5 (SPA exists) and 6.6 (Next packages it).
13. **`demo_6_6` — Why Next when React exists.** Lift the existing `demo_6_6` README from archive. **Absorb Demo 6.8:** lift the layered model (Next → React DOM → React) and `'use client'` boundary section, add as a closing beat. **Absorb Demo 8.5:** lift the `<Link>` SPA-feel-without-the-SPA-tax beat, add as a "and Next gives you SPA navigation for free" beat. This is the biggest content task in Phase C.

### Part 4 — lift only

14. **`demo_7` — SSG, CSR, SSR.** Lift content from `archive/day_3-2026-05-29/site-content/demo_7.md`. No structural changes.
15. **`demo_8` — Hydration.** Lift content from `archive/day_3-2026-05-29/site-content/demo_8.md`. Add a closing pointer to Demo 6.6's `<Link>` beat (since 8.5 is now over there).

### Part 5 — lift + trim

16. **`demo_9` — Core Web Vitals.** Lift content from archive. No changes.
17. **`demo_10` — Frontend security.** Lift content from archive. No changes.
18. **`wrap` — Swiggy DevTools audit.** Open `archive/day_3-2026-05-29/site-content/wrap.md`. Keep the swiggy.com audit body. Cut the three mini-pattern demos (skeletons / optimistic / boundary) entirely from the demo source under `day_3/wrap/` and from the content. Replace them with a "what we didn't have time for" homework bullet list naming all three patterns + a one-line summary of each.

When all 15 beats land:

```bash
cd /Users/saainithil/Code/teach
git tag day3-restructure-complete
```

Then run the spec's spec-self-review one more time against the implemented site: open `http://localhost:3000/days/3`, walk Part 1 → Part 5, confirm the arc reads cleanly. If it doesn't, write a follow-on spec — don't paper over it.

---

## Self-review

Spec coverage against `2026-05-29-day3-restructure-design.md`:

- **Five-part outline** → Task B2 rewrites `day3Parts` to exactly the five parts in the spec.
- **15 demos + 2 verbal interludes + wrap** → Task B2 keeps exactly those 15 demo entries in `day3Demos`; verbal-segments and wrap entries unchanged; dropped IDs deleted.
- **Cuts (2.75, 6.2, 6.8, 8.5)** → Tasks B2, B3, B4 remove them from `curriculum.ts`, `copy-content.mjs`, generated content, live-demo snapshots, and source folders. Phase C beat 13 confirms 8.5 inside `demo_7_8_nextjs/` is absorbed (not deleted yet).
- **Folds (6.2→6.3, 6.8+8.5→6.6)** → Phase C beats 9 and 13.
- **Re-merged Parts 4/5/5.5 → one Part 4** → Task B2's `day3Parts` rewrite.
- **Wrap trimmed to audit** → Phase C beat 18.
- **Archive plan: `archive/day_3-2026-05-29/`** → Task A1 creates it; outside deploy tree (no `copy-content.mjs` reference); single dated snapshot; one commit.
- **Rebuild order: outline first, then beat-by-beat** → Phase B is the outline; Phase C handoff lists 15 beats in execution order, Part 1 → Part 5.
- **Layout intact** → No edits to `site/app/`, `site/components/`, `site/app/globals.css`, or any visual code.

Placeholder scan: no "TBD", "TODO", or "fill in later" in any executable step in Phases A or B. Phase C deliberately defers per-beat content design to follow-on sub-projects, which the spec explicitly authorises ("Detailed step-by-step planning... belongs in the follow-on implementation plan, not this spec" — but here, with 15 of them, each becomes its own micro-plan).

Type consistency: `day3Demos` keeps the existing `Demo` type; `day3Parts` keeps the existing `DayPart` type; no new types introduced. `demoSlugs` arrays in the new `day3Parts` reference IDs that all exist in `day3Demos` (plus `verbal-segments`, which is the existing `verbalSegments` export's id).

---

## Execution handoff

Plan complete and saved to `day_3/docs/superpowers/plans/2026-05-29-day3-restructure.md`. Two execution options:

**1. Subagent-Driven (recommended)** — I dispatch a fresh subagent per task, review between tasks, fast iteration. Suits the structural Phases A and B well; for Phase C, each beat would dispatch its own subagent.

**2. Inline Execution** — Execute tasks in this session using `superpowers:executing-plans`. Suits Phases A and B (mechanical scaffold work); for Phase C, this session would invoke `superpowers:brainstorming` once per beat.

Which approach?
