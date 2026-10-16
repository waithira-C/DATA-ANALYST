// Supabase Edge Function: verify
// GET /functions/v1/verify?id=DL-XXXX-XXXX
//   200 -> public certificate JSON
//   404 -> not found (or revoked)
// Uses the anon key, so the certificates RLS policy ("public read where not revoked")
// is what decides visibility. No secrets required beyond the auto-injected ones.

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const json = (body: unknown, status = 200, extra: Record<string, string> = {}) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json', ...CORS, ...extra },
  })

const ID_RE = /^DL-[A-Z0-9]{4}-[A-Z0-9]{4}$/

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: CORS })
  if (req.method !== 'GET') return json({ error: 'Method not allowed' }, 405)

  const id = (new URL(req.url).searchParams.get('id') ?? '').trim().toUpperCase()
  if (!ID_RE.test(id)) return json({ valid: false, error: 'Certificate not found' }, 404)

  const supabaseUrl = (Deno.env.get('SUPABASE_URL') ?? '').replace(/\/+$/, '')
  const anonKey = Deno.env.get('SUPABASE_ANON_KEY') ?? ''
  if (!supabaseUrl || !anonKey) return json({ error: 'Server misconfigured' }, 500)

  const qs = new URLSearchParams({
    id: `eq.${id}`,
    revoked: 'eq.false',
    select: 'id,full_name,issued_at,exam_score,capstone_url',
    limit: '1',
  })

  let rows: Array<Record<string, unknown>>
  try {
    const res = await fetch(`${supabaseUrl}/rest/v1/certificates?${qs}`, {
      headers: { apikey: anonKey, Authorization: `Bearer ${anonKey}`, Accept: 'application/json' },
      signal: AbortSignal.timeout(10000),
    })
    if (!res.ok) return json({ error: 'Lookup failed' }, 502)
    rows = await res.json()
  } catch {
    return json({ error: 'Lookup failed' }, 502)
  }

  if (!rows.length) return json({ valid: false, error: 'Certificate not found' }, 404)

  return json(
    { valid: true, issuer: 'DataLadder', certificate: rows[0] },
    200,
    { 'Cache-Control': 'public, max-age=300' },
  )
})
