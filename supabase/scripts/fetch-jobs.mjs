#!/usr/bin/env node
// DataLadder job fetcher (Node 18+, no dependencies).
//
// Usage:
//   node supabase/scripts/fetch-jobs.mjs <output.json>
//   e.g. from app/:  node ../supabase/scripts/fetch-jobs.mjs public/jobs.json
//
// Writes a JSON array (newest first, max 600) for the static app build.
// Optional env:
//   SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY  -> also upsert into public.jobs
//   GREENHOUSE_BOARDS="stripe,gitlab,..."     -> override Greenhouse board tokens
//   LEVER_COMPANIES="zopa,spotify:Spotify"    -> override Lever companies (token[:Display Name])
//   ASHBY_ORGS="plaid,ramp:Ramp"              -> override Ashby orgs (token[:Display Name])
//   ADZUNA_APP_ID + ADZUNA_APP_KEY [+ ADZUNA_COUNTRIES="us,gb"] -> enable Adzuna
//   JOBS_MAX=600                              -> cap on rows written to the file

import { mkdir, writeFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import {
  DEFAULT_ASHBY_ORGS,
  DEFAULT_GREENHOUSE_BOARDS,
  DEFAULT_LEVER_COMPANIES,
  SOURCE_ATTRIBUTION,
  fetchAllJobs,
  parseCompanyMap,
  parseList,
  upsertJobs,
} from '../functions/_shared/jobsources.mjs'

const out = process.argv[2]
if (!out) {
  console.error('Usage: node supabase/scripts/fetch-jobs.mjs <output.json>')
  process.exit(2)
}

const env = process.env
const max = Math.max(1, Number(env.JOBS_MAX) || 600)
const started = Date.now()

const { jobs, counts } = await fetchAllJobs({
  timeoutMs: 20000,
  greenhouseBoards: parseList(env.GREENHOUSE_BOARDS, DEFAULT_GREENHOUSE_BOARDS),
  leverCompanies: parseCompanyMap(env.LEVER_COMPANIES, DEFAULT_LEVER_COMPANIES),
  ashbyOrgs: parseCompanyMap(env.ASHBY_ORGS, DEFAULT_ASHBY_ORGS),
  maxJobs: max,
  adzunaAppId: env.ADZUNA_APP_ID,
  adzunaAppKey: env.ADZUNA_APP_KEY,
  adzunaCountries: parseList(env.ADZUNA_COUNTRIES, ['us', 'gb']),
})

const fetchedAt = new Date().toISOString()
const rows = jobs.slice(0, max).map((j) => ({
  id: `${j.source}:${j.external_id}`,
  ...j,
  fetched_at: fetchedAt,
  via: SOURCE_ATTRIBUTION[j.source]?.name ?? j.source,
}))

const outPath = resolve(process.cwd(), out)
await mkdir(dirname(outPath), { recursive: true })
await writeFile(outPath, JSON.stringify(rows, null, 2) + '\n', 'utf8')

function tally(xs, key) {
  const m = {}
  for (const x of xs) m[key(x)] = (m[key(x)] ?? 0) + 1
  return Object.fromEntries(Object.entries(m).sort((a, b) => b[1] - a[1]))
}

let upserted = null
if (env.SUPABASE_URL && env.SUPABASE_SERVICE_ROLE_KEY) {
  try {
    upserted = await upsertJobs(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, jobs)
  } catch (e) {
    console.error('Supabase upsert failed:', e?.message ?? e)
    process.exitCode = 1
  }
}

console.log(JSON.stringify({
  output: outPath,
  written: rows.length,
  total_matched: jobs.length,
  upserted,
  by_source: tally(rows, (j) => j.source),
  by_role_family: tally(rows, (j) => j.role_family),
  by_seniority: tally(rows, (j) => j.seniority),
  remote_vs_onsite: tally(rows, (j) => (j.remote ? 'remote' : 'onsite/hybrid')),
  counts,
  ms: Date.now() - started,
}, null, 2))
