// Supabase Edge Function: fetch-jobs
// Aggregates Data Analyst job postings from public, ToS-friendly APIs and upserts
// them into public.jobs on (source, external_id).
//
// Invoked every 6 hours by pg_cron (see migrations) with header `x-cron-secret`,
// or manually with `Authorization: Bearer <service_role_key>`.
//
// Secrets (supabase secrets set ...):
//   CRON_SECRET          shared secret also stored in Vault as 'cron_secret'
//   GREENHOUSE_BOARDS    optional comma-separated board tokens (default list in _shared)
//   LEVER_COMPANIES      optional "token[:Display Name],..." (default list in _shared)
//   ASHBY_ORGS           optional "org[:Display Name],..." (default list in _shared)
//   ADZUNA_APP_ID / ADZUNA_APP_KEY / ADZUNA_COUNTRIES (optional, e.g. "us,gb")
// SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are injected automatically.

import {
  DEFAULT_ASHBY_ORGS,
  DEFAULT_GREENHOUSE_BOARDS,
  DEFAULT_LEVER_COMPANIES,
  SOURCE_ATTRIBUTION,
  fetchAllJobs,
  parseCompanyMap,
  parseList,
  upsertJobs,
} from '../_shared/jobsources.mjs'

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body, null, 2), {
    status,
    headers: { 'Content-Type': 'application/json' },
  })

function timingSafeEqual(a: string, b: string): boolean {
  if (!a || !b || a.length !== b.length) return false
  let diff = 0
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i)
  return diff === 0
}

function authorized(req: Request, serviceKey: string): boolean {
  const cronSecret = Deno.env.get('CRON_SECRET') ?? ''
  const headerSecret = req.headers.get('x-cron-secret') ?? ''
  if (cronSecret && timingSafeEqual(headerSecret, cronSecret)) return true
  const bearer = (req.headers.get('authorization') ?? '').replace(/^Bearer\s+/i, '')
  return !!serviceKey && timingSafeEqual(bearer, serviceKey)
}

Deno.serve(async (req: Request) => {
  if (req.method !== 'POST' && req.method !== 'GET') {
    return json({ error: 'Method not allowed' }, 405)
  }

  const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? ''
  const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''

  if (!authorized(req, serviceKey)) {
    return json({ error: 'Unauthorized' }, 401)
  }
  if (!supabaseUrl || !serviceKey) {
    return json({ error: 'SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY missing' }, 500)
  }

  const started = Date.now()
  const { jobs, counts } = await fetchAllJobs({
    timeoutMs: 20000,
    greenhouseBoards: parseList(Deno.env.get('GREENHOUSE_BOARDS'), DEFAULT_GREENHOUSE_BOARDS),
    leverCompanies: parseCompanyMap(Deno.env.get('LEVER_COMPANIES'), DEFAULT_LEVER_COMPANIES),
    ashbyOrgs: parseCompanyMap(Deno.env.get('ASHBY_ORGS'), DEFAULT_ASHBY_ORGS),
    adzunaAppId: Deno.env.get('ADZUNA_APP_ID') ?? undefined,
    adzunaAppKey: Deno.env.get('ADZUNA_APP_KEY') ?? undefined,
    adzunaCountries: parseList(Deno.env.get('ADZUNA_COUNTRIES'), ['us', 'gb']),
  })

  let upserted = 0
  let upsertError: string | null = null
  try {
    upserted = await upsertJobs(supabaseUrl, serviceKey, jobs)
  } catch (e) {
    upsertError = e instanceof Error ? e.message : String(e)
  }

  return json(
    {
      ok: !upsertError,
      total: jobs.length,
      upserted,
      upsert_error: upsertError,
      counts,
      attribution: SOURCE_ATTRIBUTION,
      ms: Date.now() - started,
    },
    upsertError ? 500 : 200,
  )
})
