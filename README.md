# DataLadder

**Go from complete beginner to job-ready Data Analyst, one rung at a time.**

DataLadder is a gamified learning platform. You climb a 3D tower of 10 floors. Each floor has short steps, and each step is a lesson, then a hands-on game, then a quiz. Along the way you earn XP, levels and badges. At the top you take a server-graded final exam, ship a portfolio capstone, and receive a certificate with a public verification link and QR code. A live job board pulls data-analyst roles from public job boards and company career pages, and employers can post roles directly.

| | |
|---|---|
| **Curriculum** | 10 floors, 59 steps of original lessons and quizzes: Orientation → Spreadsheets I & II → Statistics → SQL I & II → Visualization & BI → Python/pandas → Business acumen → Capstone & career |
| **Games** | 7 games across 38 stages: Query Quest (live SQL via sql.js), Formula Forge (live spreadsheet formulas), Pandas Lab (real Python via Pyodide), Clean Sweep, Guess the Correlation, Chart Doctor, Stakeholder Says |
| **Rewards** | XP with a level curve and titles, daily streaks, 34 badges, a 3D medal cabinet, and an Arcade for replaying stages |
| **Library** | 307 resources (265 free): courses, YouTube, practice sites, books, datasets, tools and communities, mapped to each floor and link-checked |
| **Jobs** | About 330 live roles from Greenhouse, Lever, Ashby, Himalayas, Jobicy, Arbeitnow and Remote OK, refreshed every 6 hours, plus direct employer postings |
| **Certificate** | All 59 steps, an exam score of 80%+ (server-graded, rate-limited) and a public capstone. Produces a PDF with a QR code, a `/verify/:id` page and an "Add to LinkedIn" link |

## Layout

```
research/   Resource harvest: seed_resources.py → check_links.py → build_markdown.py
            catalog/resources.json (master catalog), catalog/RESOURCES.md (readable directory)
app/        Vite + React 19 + TypeScript + Tailwind 4 + React Three Fiber
  src/content/floors/   curriculum (one file per floor)
  src/games/            the 7 games + engines (sql/, sheet/)
  src/engine/           XP curve and achievement rules
  public/jobs.json      job snapshot (offline / static mode)
supabase/   Postgres schema + RLS, exam bank, certificate functions, job-fetch edge function
```

## Run it

```bash
cd app
npm install
npm run dev          # http://localhost:5173 (copies the research catalog into the app first)
```

With no environment variables, the app runs in **offline mode**: progress is saved in the browser, the exam is drawn from the lesson quizzes, and certificates are marked "self-issued".

### Enable accounts, the verifiable certificate and the employer portal

1. Create a Supabase project, or run `supabase start` locally (see `supabase/README.md`).
2. Apply the schema and seeds: `supabase db reset`, or push the migrations and then run `seed.sql` and `seed_content.sql`.
3. Copy `app/.env.example` to `app/.env.local` and set `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`.
4. Deploy the `fetch-jobs` and `verify` edge functions and set up the cron secret (see `supabase/README.md`).

### Useful scripts (run in `app/`)

| Command | What it does |
|---|---|
| `npm test` | Unit tests: curriculum integrity, XP and badges, formula engine, SQL grader (18 tests) |
| `npx playwright test` | End-to-end tests: first step + badge + persistence, Query Quest, Formula Forge, pages (4 tests) |
| `npm run jobs` | Refresh `public/jobs.json` from every job source |
| `node scripts/gen-seed.mjs` | Regenerate `supabase/seed_content.sql` (required steps + resources) after editing content |
| `npm run build` | Type-check and production build |

To refresh the resource catalog: `python -I research/harvest/seed_resources.py && python -I research/harvest/check_links.py && python -I research/harvest/build_markdown.py`.

## Honest notes

- **Content.** Lessons, quizzes and games are original. Library entries are links with summaries written by us. Videos play through YouTube's own embed. Nothing is copied from course providers.
- **Jobs.** Listings come only from public APIs and company job boards that allow it. LinkedIn and Indeed forbid scraping and are not used. Each listing links to the original posting with source credit.
- **Certificate.** Issued by the platform; it is not an accredited academic qualification. Its weight comes from the server-graded exam, the public capstone and the public verification page.
- **Known weakness.** Step progress and XP are written by the client, so a determined user could fake ladder completion. The exam (graded on the server against the question set it issued, max 3 attempts per 24h) and the capstone link are the real gates for a certificate.
