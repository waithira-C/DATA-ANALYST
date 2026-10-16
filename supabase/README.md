# DataLadder: Supabase backend

Postgres schema, RLS, RPC functions, scheduled jobs and Edge Functions for DataLadder.

```
supabase/
├── config.toml                          local CLI config (project_id "dataladder")
├── migrations/20261015000000_init.sql   tables, RLS, RPCs, pg_cron schedules
├── migrations/20261015000100_role_family.sql  adds jobs.role_family
├── seed.sql                             63 final-exam questions (+ required_steps notes)
├── functions/
│   ├── _shared/jobsources.mjs           job-source fetchers (shared by Deno + Node)
│   ├── fetch-jobs/index.ts              aggregates jobs -> public.jobs (cron, every 6 h)
│   └── verify/index.ts                  GET ?id=DL-XXXX-XXXX -> public certificate JSON
└── scripts/fetch-jobs.mjs               Node CLI: same fetch, writes a static jobs.json
```

## 1. Local setup

1. Install the Supabase CLI (requires Docker Desktop running):
   - Windows: `scoop bucket add supabase https://github.com/supabase/scoop-bucket.git && scoop install supabase`
   - macOS: `brew install supabase/tap/supabase`
   - or per project: `npx supabase <command>`
2. From the project root (the folder that contains `supabase/`):
   ```bash
   supabase start        # boots Postgres, Auth, REST, Studio, Edge runtime
   supabase db reset     # applies migrations/ and then seed.sql
   ```
   `supabase start` prints the local **API URL**, **anon key** and **service_role key**.
   Studio: http://localhost:54323. Auth emails go to Inbucket: http://localhost:54324.
3. Serve Edge Functions locally:
   ```bash
   supabase functions serve --env-file supabase/.env.local
   ```

## 2. App environment variables

Create `app/.env.local` (Vite only exposes `VITE_*` vars to the browser):

```
VITE_SUPABASE_URL=http://127.0.0.1:54321        # or https://<ref>.supabase.co
VITE_SUPABASE_ANON_KEY=<anon key>
```

Never put the service-role key in the app.

## 3. Seed `required_steps` and `resources` (required for certificates)

`issue_certificate()` refuses to issue anything while `public.required_steps` is
empty, so it fails closed until the real step ids are loaded. They come from
`seed_content.sql`, which is generated from the app content and the research catalog:

```bash
cd app && node scripts/gen-seed.mjs   # writes supabase/seed_content.sql (59 steps, all resources)
```

`supabase db reset` loads it automatically (it is listed in `config.toml`
`[db.seed] sql_paths`). On a hosted project, run it in the Studio SQL editor.
It is idempotent and also removes step ids that no longer exist. Re-run it whenever
floors or the resource catalog change.

## 4. Deploy to a hosted project

```bash
supabase login
supabase link --project-ref <ref>
supabase db push                                  # applies migrations
psql "$DB_URL" -f supabase/seed.sql               # or paste seed.sql in the SQL editor
supabase functions deploy fetch-jobs --no-verify-jwt
supabase functions deploy verify --no-verify-jwt
```

### Secrets

```bash
supabase secrets set CRON_SECRET=<long random string>
# optional
supabase secrets set GREENHOUSE_BOARDS=stripe,gitlab,instacart,lyft,pinterest
supabase secrets set LEVER_COMPANIES="zopa:Zopa,spotify:Spotify"   # token[:Display Name]
supabase secrets set ASHBY_ORGS="plaid:Plaid,ramp:Ramp"             # org[:Display Name]
supabase secrets set ADZUNA_APP_ID=<id> ADZUNA_APP_KEY=<key> ADZUNA_COUNTRIES=us,gb
```

`SUPABASE_URL`, `SUPABASE_ANON_KEY` and `SUPABASE_SERVICE_ROLE_KEY` are injected
into Edge Functions automatically.

### Cron (pg_cron + pg_net)

The migration enables `pg_cron`/`pg_net` when available and schedules:

| job | schedule | action |
|---|---|---|
| `dataladder-fetch-jobs` | `7 */6 * * *` | POST `/functions/v1/fetch-jobs` |
| `dataladder-prune-jobs` | `15 3 * * *` | delete jobs whose `posted_at` (or `fetched_at`) is older than 45 days |

The fetch job reads two Vault secrets. Create them once in the SQL editor:

```sql
select vault.create_secret('https://<ref>.supabase.co', 'project_url');
select vault.create_secret('<same value as CRON_SECRET>', 'cron_secret');
```

Check runs with `select * from cron.job_run_details order by start_time desc limit 20;`.
If the extensions were unavailable when the migration ran, enable them in
Dashboard → Database → Extensions and re-run the `do $do$ ... $do$` block at the
end of the migration.

Manual trigger:
```bash
curl -X POST https://<ref>.supabase.co/functions/v1/fetch-jobs -H "x-cron-secret: $CRON_SECRET"
```

## 5. Static job feed (no Supabase needed)

```bash
# from the project root
node supabase/scripts/fetch-jobs.mjs app/public/jobs.json
# or from app/
node ../supabase/scripts/fetch-jobs.mjs public/jobs.json
```

This writes up to 600 jobs, newest first. Set `SUPABASE_URL` + `SUPABASE_SERVICE_ROLE_KEY`
to also upsert into `public.jobs` (apply `20261015000100_role_family.sql` first, because rows
now include `role_family`). The same optional `GREENHOUSE_BOARDS` / `LEVER_COMPANIES` /
`ASHBY_ORGS` / `ADZUNA_*` env vars apply, plus `JOBS_MAX`.

### Sources and pipeline

| source | endpoint | notes |
|---|---|---|
| Greenhouse | `boards-api.greenhouse.io/v1/boards/{token}/jobs` | ~80 boards (US, Europe, Africa, Asia, LatAm). Details fetched only for the 20 newest matches per board |
| Lever | `api.lever.co/v0/postings/{company}?mode=json` | 30 companies |
| Ashby | `api.ashbyhq.com/posting-api/job-board/{org}?includeCompensation=true` | 37 orgs, includes salary when published |
| Jobicy | `jobicy.com/api/v2/remote-jobs?count=100&tag=…` | tags `data analyst`, `analytics` |
| Himalayas | `himalayas.app/jobs/api/search?q=…&sort=recent&page=n` | 5 queries × 3 pages, sequential (rate limited) |
| Working Nomads | `workingnomads.com/api/exposed_jobs/` | small feed, often 0 matches |
| Remotive | `remotive.com/api/remote-jobs` | public feed is ~15 delayed jobs and ignores `search`/`category`, so it rarely matches |
| Arbeitnow, Remote OK | as before | |
| The Muse | `themuse.com/api/public/jobs` | currently answers HTTP 403. It's kept so it recovers on its own, and the error shows in `counts` |

Pipeline: title filter (`isTargetTitle`: data/BI/analytics/product/marketing/operations/business
analyst roles. It excludes data engineers, scientists unless the title also says "analyst",
security/QA/compliance analysts and similar), then `seniority` and `role_family`
(`data-analyst | bi | product-analytics | business-analyst | analytics-engineering | other-analyst`).
Jobs older than 45 days are dropped. Duplicates are removed on (source, external_id), then on
normalized (company, title, location), and a direct ATS posting is preferred. The newest 600 are kept.
For remote jobs `location` carries the eligibility region when the source gives one, e.g.
`Remote — Worldwide`, `Remote — US only`, `Remote — EMEA, LATAM, Canada, USA`.

Company lists live in `DEFAULT_GREENHOUSE_BOARDS`, `DEFAULT_LEVER_COMPANIES` and
`DEFAULT_ASHBY_ORGS`. A board that starts returning 404 appears under
`counts.<source>.partial_errors` and can simply be removed.

### Source attribution (required by the APIs' terms)

The UI **must** show the source next to each job and link to the job's `url`:
- **Remote OK**: link back with a followed link (no `rel="nofollow"`) and mention "Remote OK". Don't use their logo.
- **Remotive**: link to the Remotive URL and mention Remotive as the source. Don't resubmit to other job sites. Keep calls to about 4 a day (the cron does this).
- **Jobicy**: credit Jobicy with a visible link (https://jobicy.com), and every apply button must go to the job `url` from the feed. Don't present the listings as your own. Poll at most once per hour (the cron runs every 6 h).
- **Himalayas**: show a visible link back to the Himalayas job URL (the `url` field) and mention Himalayas as the source. The API is rate limited (HTTP 429), so don't call it from the browser. Use the cached feed or DB.
- **Working Nomads**: link to the Working Nomads job URL and credit Working Nomads.
- **Adzuna**: show "Jobs by Adzuna".
- Greenhouse, Lever, Ashby (public ATS job-board APIs), Arbeitnow and The Muse: link to the original posting. For the ATS sources this is the employer's own careers page, and no extra credit is required.

The JSON file includes a `via` field. The DB `source` column maps to `SOURCE_ATTRIBUTION`
in `functions/_shared/jobsources.mjs`.

## 6. Data model and security summary

| table | client access (RLS) |
|---|---|
| `profiles` | read/update own; anyone reads rows with `is_public`. Auto-created on sign-up from `display_name` / `role` metadata |
| `progress`, `achievements`, `user_stats`, `capstones` | full CRUD on own rows |
| `resources`, `jobs`, `required_steps` | public read; writes only via service role |
| `employer_jobs` | public reads `open` rows; owners read all their own; insert/update/delete only by the owner whose profile role is `employer` |
| `exam_questions`, `exam_issues` | **no client access at all** (privileges revoked + RLS without policies) |
| `exam_attempts` | read own; rows are written only by `submit_exam()` |
| `certificates` | public reads non-revoked; owner reads own; rows are written only by `issue_certificate()` |

RPCs (call with `supabase.rpc(name, args)`):

| function | who | notes |
|---|---|---|
| `get_exam(n int = 40)` | authenticated | random `n` questions `{id,q,options,skill}` with no answers. Records the issued set |
| `submit_exam(answers jsonb)` | authenticated | `{"<id>": index}`. Graded against the last `get_exam` set (unanswered = wrong; session valid 3 h). Returns `{score,total,passed,percent}`. Pass mark is 80%. Max 3 attempts per rolling 24 h |
| `issue_certificate(full_name text)` | authenticated | needs every `required_steps` row in `progress`, a passed attempt, and a capstone with `repo_url`. Idempotent. Id format `DL-XXXX-XXXX` |
| `leaderboard(limit int = 20)` | anyone | `{display_name, xp}` for public profiles, max 100 |

Verify a certificate: `GET /functions/v1/verify?id=DL-XXXX-XXXX` returns 200 with JSON, or 404.

**Known trust limitation:** `progress` and `user_stats` are written by the client, so
a determined user can fake step completion and XP. The certificate still requires
passing the server-graded exam and submitting a capstone repo. Before treating the
certificate as high-stakes, move step completion behind a server function.
