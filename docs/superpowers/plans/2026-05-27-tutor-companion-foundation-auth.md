# Tutor Companion — Plan 1: Foundation & Tutor Auth

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Stand up the Next.js + Supabase app where a tutor logs in via magic link and creates a workshop and a session that has a shareable join code, link, and QR.

**Architecture:** Next.js App Router app in `tutor-companion/`, deployed-ready for Vercel. Supabase Postgres holds data; Supabase Auth handles the tutor's magic-link login via the `@supabase/ssr` cookie flow. Row Level Security scopes every workshop/session to its owning tutor. Pure logic (join-code generation) is unit-tested with Vitest; schema/RLS behavior is integration-tested against a local Supabase stack; the email magic-link UI is verified manually against Supabase's local Inbucket mailbox.

**Tech Stack:** Next.js (App Router, TypeScript), Tailwind CSS, `@supabase/supabase-js`, `@supabase/ssr`, Supabase CLI (local Postgres + Auth + Inbucket), Vitest, `qrcode` (server-side SVG QR).

**Scope note:** This is Plan 1 of 3. Plan 2 adds activities (polls/quizzes), student join, and the live polling loop. Plan 3 adds Q&A and Keep/Drop/Crank feedback. This plan deliberately creates only the `workshops` and `sessions` tables; `sessions.live_activity_id` and all participant-facing tables arrive in later plans.

**Spec:** `docs/superpowers/specs/2026-05-27-tutor-companion-design.md`

---

## File Structure

```
tutor-companion/
  package.json
  next.config.ts
  tsconfig.json
  vitest.config.ts
  .env.local                      # gitignored; local Supabase keys
  .env.example                    # committed; documents required vars
  middleware.ts                   # session refresh + protect /dashboard
  supabase/
    config.toml                   # created by `supabase init`
    migrations/
      0001_workshops_sessions.sql # workshops + sessions tables
      0002_rls.sql                # RLS policies (owner-scoped)
  src/
    lib/
      supabase/
        client.ts                 # browser client (createBrowserClient)
        server.ts                 # server client (createServerClient + cookies)
        admin.ts                  # service-role client (server-only, tests/seed)
      join-code.ts                # pure: generateJoinCode()
      workshops.ts                # data access: workshops + sessions
    app/
      layout.tsx                  # root layout (from scaffold, Tailwind)
      page.tsx                    # redirects to /dashboard or /login
      login/
        page.tsx                  # magic-link email form (client component)
      auth/
        callback/route.ts         # exchangeCodeForSession
        auth-code-error/page.tsx  # error fallback
      dashboard/
        page.tsx                  # list workshops + create forms
        actions.ts                # server actions: create workshop/session, sign out
        session/[id]/page.tsx     # session detail: join code, link, QR
  tests/
    join-code.test.ts             # unit (Vitest)
    schema.integration.test.ts    # schema constraints vs local Supabase
    rls.integration.test.ts       # RLS isolation between two tutors
```

---

## Prerequisites (one-time, before Task 1)

The implementing engineer needs Docker running (Supabase CLI starts Postgres/Auth/Inbucket in containers) and the Supabase CLI installed:

```bash
# macOS
brew install supabase/tap/supabase
supabase --version   # expect 1.x or newer
docker info          # must succeed (Docker Desktop running)
```

---

### Task 1: Scaffold the Next.js app

**Files:**
- Create: `tutor-companion/` (entire scaffold via create-next-app)

- [ ] **Step 1: Scaffold the app**

Run from the repo root (`/Users/saainithil/Code/teach`):

```bash
npx create-next-app@latest tutor-companion \
  --typescript --tailwind --eslint --app --src-dir \
  --import-alias "@/*" --no-turbopack --use-npm
```

When prompted to proceed installing `create-next-app`, accept.

- [ ] **Step 2: Verify it builds**

Run:

```bash
cd tutor-companion && npm run build
```

Expected: build completes with "Compiled successfully" and no errors.

- [ ] **Step 3: Commit**

```bash
cd /Users/saainithil/Code/teach
git add tutor-companion
git commit -m "feat(tutor): scaffold Next.js app"
```

---

### Task 2: Add Vitest

**Files:**
- Create: `tutor-companion/vitest.config.ts`
- Modify: `tutor-companion/package.json` (add deps + test script)

- [ ] **Step 1: Install Vitest**

```bash
cd tutor-companion
npm install -D vitest @vitejs/plugin-react dotenv
```

- [ ] **Step 2: Create the Vitest config**

Create `tutor-companion/vitest.config.ts`:

```typescript
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import { config } from 'dotenv'

// Load .env.local so integration tests can reach local Supabase.
config({ path: '.env.local' })

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'node',
    include: ['tests/**/*.test.ts'],
    globals: true,
  },
})
```

- [ ] **Step 3: Add the test script**

In `tutor-companion/package.json`, add to the `"scripts"` object:

```json
"test": "vitest run",
"test:watch": "vitest"
```

- [ ] **Step 4: Verify Vitest runs (no tests yet)**

Run:

```bash
npm test
```

Expected: Vitest reports "No test files found" (exit non-zero is fine here) — it confirms Vitest is wired up.

- [ ] **Step 5: Commit**

```bash
cd /Users/saainithil/Code/teach
git add tutor-companion/package.json tutor-companion/package-lock.json tutor-companion/vitest.config.ts
git commit -m "test(tutor): add Vitest"
```

---

### Task 3: Initialize local Supabase

**Files:**
- Create: `tutor-companion/supabase/config.toml` (via `supabase init`)
- Create: `tutor-companion/.env.example`
- Create: `tutor-companion/.env.local` (gitignored)

- [ ] **Step 1: Initialize Supabase**

```bash
cd tutor-companion
supabase init
```

Accept defaults. This creates `supabase/config.toml` and `supabase/migrations/`.

- [ ] **Step 2: Start the local stack**

```bash
supabase start
```

Expected: after pulling images, it prints a block including `API URL` (e.g. `http://127.0.0.1:54321`), `anon key`, and `service_role key`. Keep this output — the next step needs it.

- [ ] **Step 3: Create `.env.example` (committed)**

Create `tutor-companion/.env.example`:

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
# Server-only. Never expose to the browser. Used by service-role client (seed/tests).
SUPABASE_SERVICE_ROLE_KEY=
```

- [ ] **Step 4: Create `.env.local` (gitignored) from the `supabase start` output**

Create `tutor-companion/.env.local`, pasting the values printed in Step 2:

```
NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon key from supabase start>
SUPABASE_SERVICE_ROLE_KEY=<service_role key from supabase start>
```

Confirm `.gitignore` already ignores `.env*` (create-next-app adds this). If not, add `.env*.local` to `tutor-companion/.gitignore`.

- [ ] **Step 5: Commit**

```bash
cd /Users/saainithil/Code/teach
git add tutor-companion/supabase/config.toml tutor-companion/.env.example
git commit -m "chore(tutor): init local Supabase + env template"
```

---

### Task 4: Schema migration — workshops & sessions

**Files:**
- Create: `tutor-companion/supabase/migrations/0001_workshops_sessions.sql`
- Test: `tutor-companion/tests/schema.integration.test.ts`

- [ ] **Step 1: Write the migration**

Create `tutor-companion/supabase/migrations/0001_workshops_sessions.sql`:

```sql
-- Session lifecycle for the live run.
create type session_status as enum ('lobby', 'running', 'feedback', 'ended');

create table workshops (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users (id) on delete cascade,
  title text not null check (char_length(title) between 1 and 200),
  created_at timestamptz not null default now()
);

create table sessions (
  id uuid primary key default gen_random_uuid(),
  workshop_id uuid not null references workshops (id) on delete cascade,
  title text not null check (char_length(title) between 1 and 200),
  join_code text not null unique check (join_code ~ '^[A-Z0-9]{6}$'),
  status session_status not null default 'lobby',
  created_at timestamptz not null default now()
);

create index sessions_workshop_id_idx on sessions (workshop_id);
-- Note: sessions.live_activity_id is added in Plan 2 (needs the activities table).
```

- [ ] **Step 2: Write the failing integration test**

Create `tutor-companion/tests/schema.integration.test.ts`:

```typescript
import { describe, it, expect, beforeAll } from 'vitest'
import { createClient } from '@supabase/supabase-js'

// Service-role client bypasses RLS so we can test raw schema constraints.
const admin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { autoRefreshToken: false, persistSession: false } },
)

async function makeOwner(): Promise<string> {
  const email = `owner-${crypto.randomUUID()}@example.com`
  const { data, error } = await admin.auth.admin.createUser({
    email,
    email_confirm: true,
  })
  if (error) throw error
  return data.user.id
}

describe('workshops/sessions schema', () => {
  let ownerId: string
  let workshopId: string

  beforeAll(async () => {
    ownerId = await makeOwner()
    const { data, error } = await admin
      .from('workshops')
      .insert({ owner_id: ownerId, title: 'Workshop A' })
      .select()
      .single()
    if (error) throw error
    workshopId = data.id
  })

  it('rejects a session with a malformed join_code', async () => {
    const { error } = await admin
      .from('sessions')
      .insert({ workshop_id: workshopId, title: 'Day 1', join_code: 'abc' })
    expect(error).not.toBeNull()
  })

  it('rejects a duplicate join_code', async () => {
    const first = await admin
      .from('sessions')
      .insert({ workshop_id: workshopId, title: 'Day 1', join_code: 'ABC123' })
    expect(first.error).toBeNull()

    const dup = await admin
      .from('sessions')
      .insert({ workshop_id: workshopId, title: 'Day 2', join_code: 'ABC123' })
    expect(dup.error).not.toBeNull()
  })

  it('cascades session delete when its workshop is deleted', async () => {
    const { data: ws } = await admin
      .from('workshops')
      .insert({ owner_id: ownerId, title: 'Disposable' })
      .select()
      .single()
    await admin
      .from('sessions')
      .insert({ workshop_id: ws!.id, title: 'X', join_code: 'ZZ9999' })
    await admin.from('workshops').delete().eq('id', ws!.id)
    const { data: leftover } = await admin
      .from('sessions')
      .select()
      .eq('workshop_id', ws!.id)
    expect(leftover).toEqual([])
  })
})
```

- [ ] **Step 3: Run the test to verify it fails**

```bash
cd tutor-companion && npm test -- tests/schema.integration.test.ts
```

Expected: FAIL — the `workshops`/`sessions` tables do not exist yet (errors like `relation "workshops" does not exist`).

- [ ] **Step 4: Apply the migration**

```bash
supabase migration up
```

Expected: applies `0001_workshops_sessions.sql` with no errors.

- [ ] **Step 5: Run the test to verify it passes**

```bash
npm test -- tests/schema.integration.test.ts
```

Expected: PASS (3 tests).

- [ ] **Step 6: Commit**

```bash
cd /Users/saainithil/Code/teach
git add tutor-companion/supabase/migrations/0001_workshops_sessions.sql tutor-companion/tests/schema.integration.test.ts
git commit -m "feat(tutor): workshops + sessions schema"
```

---

### Task 5: Supabase client helpers

**Files:**
- Create: `tutor-companion/src/lib/supabase/client.ts`
- Create: `tutor-companion/src/lib/supabase/server.ts`
- Create: `tutor-companion/src/lib/supabase/admin.ts`

- [ ] **Step 1: Install `@supabase/ssr` and `@supabase/supabase-js`**

```bash
cd tutor-companion
npm install @supabase/ssr @supabase/supabase-js
```

- [ ] **Step 2: Browser client**

Create `tutor-companion/src/lib/supabase/client.ts`:

```typescript
import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  )
}
```

- [ ] **Step 3: Server client**

Create `tutor-companion/src/lib/supabase/server.ts`:

```typescript
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createClient() {
  const cookieStore = await cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            )
          } catch {
            // Called from a Server Component: ignore. Session refresh is
            // handled by middleware, so this is safe.
          }
        },
      },
    },
  )
}
```

- [ ] **Step 4: Service-role client (server-only)**

Create `tutor-companion/src/lib/supabase/admin.ts`:

```typescript
import 'server-only'
import { createClient } from '@supabase/supabase-js'

// Bypasses RLS. Never import this into client components.
export function createAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } },
  )
}
```

- [ ] **Step 5: Install the `server-only` guard package**

```bash
npm install server-only
```

- [ ] **Step 6: Verify it type-checks**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 7: Commit**

```bash
cd /Users/saainithil/Code/teach
git add tutor-companion/src/lib/supabase tutor-companion/package.json tutor-companion/package-lock.json
git commit -m "feat(tutor): supabase client helpers"
```

---

### Task 6: Middleware — session refresh + protect /dashboard

**Files:**
- Create: `tutor-companion/middleware.ts`

- [ ] **Step 1: Write the middleware**

Create `tutor-companion/middleware.ts`:

```typescript
import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          )
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          )
        },
      },
    },
  )

  // Do not run code between createServerClient and getUser().
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const path = request.nextUrl.pathname
  const isProtected = path.startsWith('/dashboard')

  if (!user && isProtected) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
```

- [ ] **Step 2: Verify the redirect works**

Start the dev server:

```bash
cd tutor-companion && npm run dev
```

In a browser, visit `http://localhost:3000/dashboard`.
Expected: redirected to `http://localhost:3000/login` (a 404 body is fine — the login page is built in Task 10; what matters is the URL changed to `/login`). Stop the dev server (Ctrl-C) when done.

- [ ] **Step 3: Commit**

```bash
cd /Users/saainithil/Code/teach
git add tutor-companion/middleware.ts
git commit -m "feat(tutor): auth middleware protecting /dashboard"
```

---

### Task 7: Join-code generator (pure, TDD)

**Files:**
- Create: `tutor-companion/src/lib/join-code.ts`
- Test: `tutor-companion/tests/join-code.test.ts`

- [ ] **Step 1: Write the failing test**

Create `tutor-companion/tests/join-code.test.ts`:

```typescript
import { describe, it, expect } from 'vitest'
import { generateJoinCode } from '@/lib/join-code'

describe('generateJoinCode', () => {
  it('returns 6 characters', () => {
    expect(generateJoinCode()).toHaveLength(6)
  })

  it('uses only unambiguous uppercase letters and digits', () => {
    // Excludes easily-confused chars: 0/O, 1/I, etc. are not in the alphabet.
    const allowed = /^[ABCDEFGHJKLMNPQRSTUVWXYZ23456789]{6}$/
    for (let i = 0; i < 200; i++) {
      expect(generateJoinCode()).toMatch(allowed)
    }
  })

  it('matches the DB constraint pattern [A-Z0-9]{6}', () => {
    const dbPattern = /^[A-Z0-9]{6}$/
    for (let i = 0; i < 200; i++) {
      expect(generateJoinCode()).toMatch(dbPattern)
    }
  })

  it('is reasonably random (no constant output)', () => {
    const codes = new Set(Array.from({ length: 100 }, () => generateJoinCode()))
    expect(codes.size).toBeGreaterThan(90)
  })
})
```

Note: `@/lib/join-code` resolves via the `@/*` import alias to `src/lib/join-code`. The `vitest.config.ts` `react()` plugin does not provide this alias by default — add it now. Edit `tutor-companion/vitest.config.ts` to include `resolve.alias`:

```typescript
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import { config } from 'dotenv'
import { fileURLToPath } from 'node:url'

config({ path: '.env.local' })

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  test: {
    environment: 'node',
    include: ['tests/**/*.test.ts'],
    globals: true,
  },
})
```

- [ ] **Step 2: Run the test to verify it fails**

```bash
cd tutor-companion && npm test -- tests/join-code.test.ts
```

Expected: FAIL — `generateJoinCode` is not defined (module not found).

- [ ] **Step 3: Write the implementation**

Create `tutor-companion/src/lib/join-code.ts`:

```typescript
// Unambiguous alphabet: no 0/O, 1/I/L to avoid student typos when reading
// a code off a shared screen. All chars are within [A-Z0-9] for the DB check.
const ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'

export function generateJoinCode(length = 6): string {
  const bytes = new Uint8Array(length)
  crypto.getRandomValues(bytes)
  let code = ''
  for (let i = 0; i < length; i++) {
    code += ALPHABET[bytes[i] % ALPHABET.length]
  }
  return code
}
```

- [ ] **Step 4: Run the test to verify it passes**

```bash
npm test -- tests/join-code.test.ts
```

Expected: PASS (4 tests).

- [ ] **Step 5: Commit**

```bash
cd /Users/saainithil/Code/teach
git add tutor-companion/src/lib/join-code.ts tutor-companion/tests/join-code.test.ts tutor-companion/vitest.config.ts
git commit -m "feat(tutor): join-code generator"
```

---

### Task 8: Data-access module — workshops & sessions

**Files:**
- Create: `tutor-companion/src/lib/workshops.ts`

This module wraps the authenticated server client. `owner_id` is set from the
caller's `user.id`; RLS (Task 9) enforces ownership. `createSession` retries on
the rare join-code collision.

- [ ] **Step 1: Write the module**

Create `tutor-companion/src/lib/workshops.ts`:

```typescript
import 'server-only'
import { createClient } from '@/lib/supabase/server'
import { generateJoinCode } from '@/lib/join-code'

export type Workshop = {
  id: string
  owner_id: string
  title: string
  created_at: string
}

export type Session = {
  id: string
  workshop_id: string
  title: string
  join_code: string
  status: 'lobby' | 'running' | 'feedback' | 'ended'
  created_at: string
}

async function requireUserId(): Promise<string> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')
  return user.id
}

export async function listWorkshops(): Promise<Workshop[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('workshops')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) throw error
  return data as Workshop[]
}

export async function createWorkshop(title: string): Promise<Workshop> {
  const ownerId = await requireUserId()
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('workshops')
    .insert({ owner_id: ownerId, title })
    .select()
    .single()
  if (error) throw error
  return data as Workshop
}

export async function listSessions(workshopId: string): Promise<Session[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('sessions')
    .select('*')
    .eq('workshop_id', workshopId)
    .order('created_at', { ascending: false })
  if (error) throw error
  return data as Session[]
}

export async function createSession(
  workshopId: string,
  title: string,
): Promise<Session> {
  const supabase = await createClient()
  // Retry on the (rare) unique-violation for join_code.
  for (let attempt = 0; attempt < 5; attempt++) {
    const { data, error } = await supabase
      .from('sessions')
      .insert({ workshop_id: workshopId, title, join_code: generateJoinCode() })
      .select()
      .single()
    if (!error) return data as Session
    if (error.code !== '23505') throw error // 23505 = unique_violation
  }
  throw new Error('Could not generate a unique join code')
}

export async function getSession(id: string): Promise<Session | null> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('sessions')
    .select('*')
    .eq('id', id)
    .maybeSingle()
  if (error) throw error
  return (data as Session) ?? null
}
```

- [ ] **Step 2: Verify it type-checks**

```bash
cd tutor-companion && npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
cd /Users/saainithil/Code/teach
git add tutor-companion/src/lib/workshops.ts
git commit -m "feat(tutor): workshops/sessions data access"
```

---

### Task 9: RLS policies

**Files:**
- Create: `tutor-companion/supabase/migrations/0002_rls.sql`
- Test: `tutor-companion/tests/rls.integration.test.ts`

- [ ] **Step 1: Write the failing test**

Create `tutor-companion/tests/rls.integration.test.ts`:

```typescript
import { describe, it, expect, beforeAll } from 'vitest'
import { createClient } from '@supabase/supabase-js'

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!
const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const service = process.env.SUPABASE_SERVICE_ROLE_KEY!

const admin = createClient(url, service, {
  auth: { autoRefreshToken: false, persistSession: false },
})

// Create a confirmed user and return an anon client signed in as them.
async function signedInClient() {
  const email = `tutor-${crypto.randomUUID()}@example.com`
  const password = 'password123!'
  const { error: createErr } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  })
  if (createErr) throw createErr

  const client = createClient(url, anon, {
    auth: { autoRefreshToken: false, persistSession: false },
  })
  const { error: signInErr } = await client.auth.signInWithPassword({
    email,
    password,
  })
  if (signInErr) throw signInErr
  return client
}

describe('RLS: workshops are owner-scoped', () => {
  let alice: Awaited<ReturnType<typeof signedInClient>>
  let bob: Awaited<ReturnType<typeof signedInClient>>

  beforeAll(async () => {
    alice = await signedInClient()
    bob = await signedInClient()
  })

  it("lets a tutor create and read their own workshop", async () => {
    const { data, error } = await alice
      .from('workshops')
      .insert({
        owner_id: (await alice.auth.getUser()).data.user!.id,
        title: "Alice's workshop",
      })
      .select()
      .single()
    expect(error).toBeNull()
    expect(data!.title).toBe("Alice's workshop")
  })

  it("hides one tutor's workshops from another", async () => {
    const { data: bobRows, error } = await bob.from('workshops').select('*')
    expect(error).toBeNull()
    // Bob sees none of Alice's workshops.
    expect((bobRows ?? []).some((w) => w.title === "Alice's workshop")).toBe(
      false,
    )
  })

  it('forbids inserting a workshop owned by someone else', async () => {
    const bobId = (await bob.auth.getUser()).data.user!.id
    const { error } = await alice
      .from('workshops')
      .insert({ owner_id: bobId, title: 'spoofed' })
    expect(error).not.toBeNull() // RLS WITH CHECK violation
  })
})
```

- [ ] **Step 2: Run the test to verify it fails**

```bash
cd tutor-companion && npm test -- tests/rls.integration.test.ts
```

Expected: FAIL — with no RLS enabled, Bob can read Alice's workshop and the spoofed insert succeeds, so the last two assertions fail.

- [ ] **Step 3: Write the RLS migration**

Create `tutor-companion/supabase/migrations/0002_rls.sql`:

```sql
alter table workshops enable row level security;
alter table sessions enable row level security;

-- Workshops: a tutor sees and manages only their own.
create policy "workshops_select_own"
  on workshops for select
  using (owner_id = auth.uid());

create policy "workshops_insert_own"
  on workshops for insert
  with check (owner_id = auth.uid());

create policy "workshops_update_own"
  on workshops for update
  using (owner_id = auth.uid())
  with check (owner_id = auth.uid());

create policy "workshops_delete_own"
  on workshops for delete
  using (owner_id = auth.uid());

-- Sessions: accessible only when their workshop belongs to the tutor.
create policy "sessions_select_own"
  on sessions for select
  using (
    exists (
      select 1 from workshops w
      where w.id = sessions.workshop_id and w.owner_id = auth.uid()
    )
  );

create policy "sessions_insert_own"
  on sessions for insert
  with check (
    exists (
      select 1 from workshops w
      where w.id = sessions.workshop_id and w.owner_id = auth.uid()
    )
  );

create policy "sessions_update_own"
  on sessions for update
  using (
    exists (
      select 1 from workshops w
      where w.id = sessions.workshop_id and w.owner_id = auth.uid()
    )
  );

create policy "sessions_delete_own"
  on sessions for delete
  using (
    exists (
      select 1 from workshops w
      where w.id = sessions.workshop_id and w.owner_id = auth.uid()
    )
  );
```

- [ ] **Step 4: Apply the migration**

```bash
supabase migration up
```

Expected: applies `0002_rls.sql` with no errors.

- [ ] **Step 5: Run the test to verify it passes**

```bash
npm test -- tests/rls.integration.test.ts
```

Expected: PASS (3 tests).

- [ ] **Step 6: Re-run the schema test to confirm service-role still bypasses RLS**

```bash
npm test -- tests/schema.integration.test.ts
```

Expected: PASS (3 tests) — the admin client is unaffected by RLS.

- [ ] **Step 7: Commit**

```bash
cd /Users/saainithil/Code/teach
git add tutor-companion/supabase/migrations/0002_rls.sql tutor-companion/tests/rls.integration.test.ts
git commit -m "feat(tutor): owner-scoped RLS for workshops + sessions"
```

---

### Task 10: Magic-link login + auth callback + sign-out

**Files:**
- Create: `tutor-companion/src/app/login/page.tsx`
- Create: `tutor-companion/src/app/auth/callback/route.ts`
- Create: `tutor-companion/src/app/auth/auth-code-error/page.tsx`

- [ ] **Step 1: Login page (client component)**

Create `tutor-companion/src/app/login/page.tsx`:

```tsx
'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    const supabase = createClient()
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback?next=/dashboard`,
      },
    })
    setLoading(false)
    if (error) setError(error.message)
    else setSent(true)
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col justify-center p-6">
      <h1 className="mb-2 text-2xl font-semibold">Tutor sign in</h1>
      <p className="mb-6 text-sm text-gray-500">
        We&apos;ll email you a one-time login link.
      </p>
      {sent ? (
        <p className="rounded-md bg-green-50 p-4 text-green-800">
          Check your email for the login link.
        </p>
      ) : (
        <form onSubmit={onSubmit} className="flex flex-col gap-3">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="rounded-md border border-gray-300 px-3 py-2"
          />
          <button
            type="submit"
            disabled={loading}
            className="rounded-md bg-black px-3 py-2 text-white disabled:opacity-50"
          >
            {loading ? 'Sending…' : 'Send magic link'}
          </button>
          {error && <p className="text-sm text-red-600">{error}</p>}
        </form>
      )}
    </main>
  )
}
```

- [ ] **Step 2: Auth callback route**

Create `tutor-companion/src/app/auth/callback/route.ts`:

```typescript
import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  let next = searchParams.get('next') ?? '/dashboard'
  if (!next.startsWith('/')) next = '/dashboard'

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`)
    }
  }
  return NextResponse.redirect(`${origin}/auth/auth-code-error`)
}
```

- [ ] **Step 3: Auth error page**

Create `tutor-companion/src/app/auth/auth-code-error/page.tsx`:

```tsx
import Link from 'next/link'

export default function AuthCodeError() {
  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col justify-center p-6">
      <h1 className="mb-2 text-2xl font-semibold">Login link invalid</h1>
      <p className="mb-6 text-sm text-gray-500">
        That link expired or was already used.
      </p>
      <Link href="/login" className="text-blue-600 underline">
        Request a new link
      </Link>
    </main>
  )
}
```

- [ ] **Step 4: Manual verification against local Inbucket**

Start the dev server: `cd tutor-companion && npm run dev`.

1. Visit `http://localhost:3000/login`, enter `tutor@example.com`, submit. Expect the "Check your email" message.
2. Open the local mailbox at `http://127.0.0.1:54324` (Supabase Inbucket). Expect a "Magic Link" email; open it and click the link.
3. Expect to land on `http://localhost:3000/dashboard` (it will 404 until Task 11 — what matters is you were NOT redirected back to `/login`, proving the session cookie was set).

Stop the dev server when done.

- [ ] **Step 5: Commit**

```bash
cd /Users/saainithil/Code/teach
git add tutor-companion/src/app/login tutor-companion/src/app/auth
git commit -m "feat(tutor): magic-link login + auth callback"
```

---

### Task 11: Dashboard — list workshops, create workshop & session

**Files:**
- Create: `tutor-companion/src/app/dashboard/actions.ts`
- Create: `tutor-companion/src/app/dashboard/page.tsx`
- Modify: `tutor-companion/src/app/page.tsx`

- [ ] **Step 1: Server actions**

Create `tutor-companion/src/app/dashboard/actions.ts`:

```typescript
'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createWorkshop, createSession } from '@/lib/workshops'
import { createClient } from '@/lib/supabase/server'

export async function createWorkshopAction(formData: FormData) {
  const title = String(formData.get('title') ?? '').trim()
  if (!title) return
  await createWorkshop(title)
  revalidatePath('/dashboard')
}

export async function createSessionAction(formData: FormData) {
  const workshopId = String(formData.get('workshopId') ?? '')
  const title = String(formData.get('title') ?? '').trim()
  if (!workshopId || !title) return
  const session = await createSession(workshopId, title)
  redirect(`/dashboard/session/${session.id}`)
}

export async function signOutAction() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/login')
}
```

- [ ] **Step 2: Dashboard page**

Create `tutor-companion/src/app/dashboard/page.tsx`:

```tsx
import Link from 'next/link'
import { listWorkshops, listSessions, type Workshop } from '@/lib/workshops'
import {
  createWorkshopAction,
  createSessionAction,
  signOutAction,
} from './actions'

export default async function DashboardPage() {
  const workshops = await listWorkshops()

  return (
    <main className="mx-auto max-w-3xl p-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Your workshops</h1>
        <form action={signOutAction}>
          <button className="text-sm text-gray-500 underline">Sign out</button>
        </form>
      </div>

      <form action={createWorkshopAction} className="mb-8 flex gap-2">
        <input
          name="title"
          required
          placeholder="New workshop title"
          className="flex-1 rounded-md border border-gray-300 px-3 py-2"
        />
        <button className="rounded-md bg-black px-4 py-2 text-white">
          Create
        </button>
      </form>

      {workshops.length === 0 && (
        <p className="text-gray-500">No workshops yet. Create your first one.</p>
      )}

      <ul className="flex flex-col gap-6">
        {workshops.map((w) => (
          <WorkshopCard key={w.id} workshop={w} />
        ))}
      </ul>
    </main>
  )
}

async function WorkshopCard({ workshop }: { workshop: Workshop }) {
  const sessions = await listSessions(workshop.id)
  return (
    <li className="rounded-lg border border-gray-200 p-4">
      <h2 className="mb-3 text-lg font-medium">{workshop.title}</h2>

      <ul className="mb-3 flex flex-col gap-1">
        {sessions.map((s) => (
          <li key={s.id}>
            <Link
              href={`/dashboard/session/${s.id}`}
              className="text-blue-600 underline"
            >
              {s.title}
            </Link>{' '}
            <span className="text-sm text-gray-400">({s.join_code})</span>
          </li>
        ))}
      </ul>

      <form action={createSessionAction} className="flex gap-2">
        <input type="hidden" name="workshopId" value={workshop.id} />
        <input
          name="title"
          required
          placeholder="New session (e.g. Day 1)"
          className="flex-1 rounded-md border border-gray-300 px-3 py-2"
        />
        <button className="rounded-md border border-gray-300 px-4 py-2">
          Add session
        </button>
      </form>
    </li>
  )
}
```

Note: `WorkshopCard` is an async Server Component, so each card resolves its own `listSessions` call independently — the standard pattern for per-item async data in RSC.

- [ ] **Step 3: Root page redirect**

Replace the contents of `tutor-companion/src/app/page.tsx`:

```tsx
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export default async function Home() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  redirect(user ? '/dashboard' : '/login')
}
```

- [ ] **Step 4: Verify build + manual smoke**

```bash
cd tutor-companion && npm run build
```

Expected: build succeeds.

Then `npm run dev`, log in (via Inbucket as in Task 10), and at `/dashboard`:
- Create a workshop → it appears in the list.
- Add a session under it → you are redirected to `/dashboard/session/<id>` (404 until Task 12; the redirect itself confirms creation).
- Reload `/dashboard` → the session shows with a 6-char code.

Stop the dev server when done.

- [ ] **Step 5: Commit**

```bash
cd /Users/saainithil/Code/teach
git add tutor-companion/src/app/dashboard tutor-companion/src/app/page.tsx
git commit -m "feat(tutor): dashboard with workshop + session creation"
```

---

### Task 12: Session detail — join code, link & QR

**Files:**
- Create: `tutor-companion/src/app/dashboard/session/[id]/page.tsx`
- Create: `tutor-companion/src/lib/qr.ts`

The student join URL points at `/j/<code>` — a route built in Plan 2. Showing
it now is intentional: the tutor can copy the link even before the live
experience exists.

- [ ] **Step 1: Install the QR library**

```bash
cd tutor-companion
npm install qrcode
npm install -D @types/qrcode
```

- [ ] **Step 2: QR helper (server, returns SVG string)**

Create `tutor-companion/src/lib/qr.ts`:

```typescript
import 'server-only'
import QRCode from 'qrcode'

export async function qrSvg(text: string): Promise<string> {
  return QRCode.toString(text, { type: 'svg', margin: 1, width: 220 })
}
```

- [ ] **Step 3: Session detail page**

Create `tutor-companion/src/app/dashboard/session/[id]/page.tsx`:

```tsx
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { headers } from 'next/headers'
import { getSession } from '@/lib/workshops'
import { qrSvg } from '@/lib/qr'

export default async function SessionDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const session = await getSession(id)
  if (!session) notFound()

  const h = await headers()
  const host = h.get('x-forwarded-host') ?? h.get('host') ?? 'localhost:3000'
  const proto = h.get('x-forwarded-proto') ?? 'http'
  const joinUrl = `${proto}://${host}/j/${session.join_code}`
  const svg = await qrSvg(joinUrl)

  return (
    <main className="mx-auto max-w-2xl p-6">
      <Link href="/dashboard" className="text-sm text-blue-600 underline">
        ← Back to workshops
      </Link>
      <h1 className="mb-1 mt-4 text-2xl font-semibold">{session.title}</h1>
      <p className="mb-6 text-sm text-gray-500">Status: {session.status}</p>

      <div className="rounded-lg border border-gray-200 p-6 text-center">
        <p className="text-sm uppercase tracking-wide text-gray-400">
          Join code
        </p>
        <p className="my-2 text-5xl font-bold tracking-widest">
          {session.join_code}
        </p>
        <p className="mb-4 break-all text-sm text-gray-600">{joinUrl}</p>
        <div
          className="mx-auto w-[220px]"
          dangerouslySetInnerHTML={{ __html: svg }}
        />
      </div>
    </main>
  )
}
```

- [ ] **Step 4: Verify build + manual smoke**

```bash
cd tutor-companion && npm run build
```

Expected: build succeeds.

Then `npm run dev`, log in, open a session from the dashboard. Expect: the
session title, the 6-char join code displayed large, the join URL
(`http://localhost:3000/j/<code>`), and a scannable QR code. Stop the dev
server when done.

- [ ] **Step 5: Commit**

```bash
cd /Users/saainithil/Code/teach
git add tutor-companion/src/app/dashboard/session tutor-companion/src/lib/qr.ts tutor-companion/package.json tutor-companion/package-lock.json
git commit -m "feat(tutor): session detail with join code, link and QR"
```

---

## Done criteria (Plan 1)

- `npm test` passes: join-code unit tests, schema integration tests, RLS integration tests.
- A tutor can: visit the app → get redirected to `/login` → request a magic link → click it (via Inbucket locally) → land on `/dashboard` → create a workshop → add a session → view that session's join code, link, and QR.
- Workshops/sessions are invisible across tutors (RLS verified by test).

## Deployment note (deferred, not part of TDD loop)
Going live on Vercel requires: a hosted Supabase project, its URL/anon/service-role keys set as Vercel env vars, the migrations applied to the hosted DB (`supabase db push` against the linked project), and the Supabase Auth "Site URL" + redirect allow-list set to the Vercel domain so magic links resolve. Capture this as the first task of whichever plan you deploy from.

## Next
Plan 2 — Live polls & quizzes: `activities` + `activity_options` + `responses` + `participants` tables, `sessions.live_activity_id`, the `/j/<code>` student join + nickname flow, the polling state endpoint, respond endpoint, tutor open/close/next controls, tallies, and the correct-answer leaderboard.
```