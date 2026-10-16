// Shared job-aggregation core for DataLadder.
// Plain ESM JavaScript with no dependencies so it runs unchanged in:
//   - the Supabase Edge Function (Deno):  supabase/functions/fetch-jobs/index.ts
//   - the Node CLI script (Node 18+):     supabase/scripts/fetch-jobs.mjs
// Uses only global fetch / AbortSignal.timeout.

// ---------------------------------------------------------------------------
// Title matching
// ---------------------------------------------------------------------------

// Analyst flavours that are realistic targets for a (career-changing) data analyst.
const ANALYST_KINDS =
  'data|bi|business intelligence|analytics|insights?|reporting|product|marketing|growth|operations|ops|' +
  'business|business systems|revenue|revops|gtm|go-to-market|sales|customer|cx|pricing|commercial|people|hr|' +
  'workforce|risk|fraud|credit risk|supply chain|logistics|strategy|strategic|quantitative|decision|digital|' +
  'web|e-?commerce|performance|media|crm|merchandising|planning|experimentation|healthcare data|' +
  'financial data|finance data'

const INCLUDE_RES = [
  // "Revenue Operations Analyst", "Strategy & Operations Analyst", "Business and Data Analyst"
  new RegExp(`\\b(${ANALYST_KINDS})\\b(?:[\\s&/,+-]+[\\w.]+){0,2}[\\s-]+analyst\\b`, 'i'),
  /\banalyst\b.*\b(data|analytics|insights|bi|reporting|business intelligence)\b/i, // "Analyst, Data & Reporting"
  /\banalytics\b/i, // "Analytics Lead", "Manager, GTM Analytics", "Analytics Engineer"
  /\bbusiness intelligence\b/i,
  /\bbi (developer|engineer|analyst|specialist|lead|manager|consultant|architect)\b/i,
  /\b(power bi|tableau|looker)\b/i,
  /\binsights? (analyst|manager|lead|specialist|associate|partner)\b/i,
  /\breporting (analyst|specialist|developer|lead|manager|associate)\b/i,
  /\b(junior|graduate|entry[- ]level) analyst\b/i,
]

// Obvious non-matches, even when an include pattern hits.
const EXCLUDE_RE = new RegExp([
  'data engineer', 'software engineer', 'machine learning', '\\bml\\b', '\\bai engineer', 'security', 'cyber',
  '\\bsoc\\b', 'threat', 'detection', 'behaviou?r(al)? analyst', '\\bbcba\\b', '\\bqa\\b', 'quality assurance',
  'test analyst', 'analyst relations', 'paralegal', '\\blegal\\b', 'compliance', '\\bkyc\\b', '\\baml\\b', 'payroll',
  'account executive', 'account manager', 'sales (representative|executive|development)', 'business development',
  'recruit', 'talent acquisition', 'customer success', 'solutions? (engineer|architect)', 'sales engineer',
  'product manager', 'product owner', 'project manager', 'program manager', 'nurse', 'pharmac',
  '(?<!business )intelligence analyst', 'no experience (required|needed)', 'virtual employment', 'data entry', 'ai trainer', 'annotat',
  'data cent(er|re)', 'support analyst', 'help ?desk', '(financial|regulatory|tax|statutory) reporting', 'accounting',
  'engineering manager', '(?<!bi |business intelligence )\\barchitect\\b',
].join('|'), 'i')

/** True when a job title is a data / BI / analytics / analyst role we want to list. */
export function isTargetTitle(title) {
  const t = String(title ?? '')
  if (!t || EXCLUDE_RE.test(t)) return false
  if (/\bscientists?\b/i.test(t) && !/\banalyst\b/i.test(t)) return false // scientists only when also "analyst"
  // Engineers only when they are analytics / BI engineers ("Data Engineer" is excluded above).
  if (/\bengineers?\b/i.test(t) && !/\b(analytics|bi|business intelligence|reporting) engineers?\b/i.test(t)) return false
  return INCLUDE_RES.some((re) => re.test(t))
}

/** Back-compat with the old regex export: `.test(title)` applies the full include/exclude logic. */
export const TITLE_RE = { test: isTargetTitle }

/** data-analyst | bi | product-analytics | business-analyst | analytics-engineering | other-analyst */
export function inferRoleFamily(title) {
  const t = String(title ?? '')
  if (/\banalytics engineer(ing)?\b/i.test(t)) return 'analytics-engineering'
  if (/\b(business intelligence|bi|power bi|tableau|looker)\b|\breporting (analyst|specialist|developer|lead|manager|associate)\b/i.test(t)) return 'bi'
  if (/\b(product|growth|experimentation)\b(?:[\s&/,-]+\w+){0,2}[\s-]+(analyst|analytics)\b/i.test(t)) return 'product-analytics'
  if (/\bdata\b(?:[\s&/,-]+\w+){0,2}[\s-]+analy(st|tics)\b|\banalytics\b|\binsights?\b|\b(junior|graduate|entry[- ]level) analyst\b|\banalyst\b.*\bdata\b/i.test(t)) return 'data-analyst'
  if (/\bbusiness( systems)? analyst\b/i.test(t)) return 'business-analyst'
  return 'other-analyst'
}

// ---------------------------------------------------------------------------
// Company lists. Every token below returned HTTP 200 from its public API when
// last verified (2026-10-15). Tokens that 404 are reported in counts.*.partial_errors.
// ---------------------------------------------------------------------------

export const DEFAULT_GREENHOUSE_BOARDS = [
  // North America: fintech, SaaS, marketplaces, consumer
  'stripe', 'coinbase', 'lyft', 'fivetran', 'okta', 'affirm', 'datadog', 'samsara', 'airbnb', 'mongodb',
  'block', 'databricks', 'gusto', 'elastic', 'instacart', 'cloudflare', 'braze', 'robinhood', 'gitlab', 'reddit',
  'sofi', 'klaviyo', 'faire', 'flexport', 'twilio', 'pinterest', 'figma', 'brex', 'toast', 'carta', 'roku',
  'peloton', 'mercury', 'vercel', 'pagerduty', 'verkada', 'chime', 'betterment', 'newrelic', 'instawork',
  'squarespace', 'dropbox', 'discord', 'asana', 'duolingo', 'mixpanel', 'nextdoor', 'twitch', 'taskrabbit',
  'doordashusa', 'tripadvisor', 'seatgeek', 'gofundme', 'intercom', 'webflow',
  // Europe
  'adyen', 'flix', 'hellofresh', 'sumup', 'monzo', 'getyourguide', 'gocardless', 'celonis', 'n26', 'trivago',
  'tide', 'deliveroo', 'wolt', 'cabify', 'wise', 'contentful', 'payoneer',
  // Africa
  'moniepoint', 'jumia',
  // Asia
  'agoda',
  // Latin America
  'ebanx', 'quintoandar', 'stone', 'gympass', 'vtex',
]

/** Lever public postings API (https://api.lever.co/v0/postings/{company}): token -> display name. */
export const DEFAULT_LEVER_COMPANIES = {
  veeva: 'Veeva Systems', palantir: 'Palantir', shieldai: 'Shield AI', zoox: 'Zoox', matchgroup: 'Match Group',
  paytm: 'Paytm', qonto: 'Qonto', zopa: 'Zopa', nium: 'Nium', dnb: 'Dun & Bradstreet', rover: 'Rover',
  aircall: 'Aircall', spotify: 'Spotify', binance: 'Binance', meesho: 'Meesho', wealthfront: 'Wealthfront',
  ro: 'Ro', outreach: 'Outreach', jobandtalent: 'Jobandtalent', toptal: 'Toptal', contentsquare: 'Contentsquare',
  blablacar: 'BlaBlaCar', trendyol: 'Trendyol', tala: 'Tala', kavak: 'Kavak', dlocal: 'dLocal',
  deliverect: 'Deliverect', swile: 'Swile', pigment: 'Pigment', metabase: 'Metabase',
}

/** Ashby public job-board API (https://api.ashbyhq.com/posting-api/job-board/{org}): org -> display name. */
export const DEFAULT_ASHBY_ORGS = {
  openai: 'OpenAI', harvey: 'Harvey', voodoo: 'Voodoo', plaid: 'Plaid', doctolib: 'Doctolib',
  perplexity: 'Perplexity', vanta: 'Vanta', ramp: 'Ramp', backmarket: 'Back Market', pennylane: 'Pennylane',
  decagon: 'Decagon', sierra: 'Sierra', hackerone: 'HackerOne', alan: 'Alan', notion: 'Notion',
  clickup: 'ClickUp', elevenlabs: 'ElevenLabs', docker: 'Docker', lemonade: 'Lemonade', ledger: 'Ledger',
  oyster: 'Oyster', supabase: 'Supabase', synthesia: 'Synthesia', '1password': '1Password', trustly: 'Trustly',
  cube: 'Cube', lovable: 'Lovable', moneybox: 'Moneybox', pleo: 'Pleo', forto: 'Forto', paddle: 'Paddle',
  gorgias: 'Gorgias', mollie: 'Mollie', quantexa: 'Quantexa', lunar: 'Lunar', zapier: 'Zapier',
  poshmark: 'Poshmark',
}

/** Attribution the UI must show next to jobs from each source (several APIs require it). */
export const SOURCE_ATTRIBUTION = {
  remotive: { name: 'Remotive', url: 'https://remotive.com', required: true },
  arbeitnow: { name: 'Arbeitnow', url: 'https://www.arbeitnow.com', required: false },
  remoteok: { name: 'Remote OK', url: 'https://remoteok.com', required: true },
  themuse: { name: 'The Muse', url: 'https://www.themuse.com', required: false },
  greenhouse: { name: 'Greenhouse', url: 'https://www.greenhouse.com', required: false },
  lever: { name: 'Lever', url: 'https://www.lever.co', required: false },
  ashby: { name: 'Ashby', url: 'https://www.ashbyhq.com', required: false },
  jobicy: { name: 'Jobicy', url: 'https://jobicy.com', required: true },
  himalayas: { name: 'Himalayas', url: 'https://himalayas.app', required: true },
  workingnomads: { name: 'Working Nomads', url: 'https://www.workingnomads.com', required: true },
  adzuna: { name: 'Adzuna', url: 'https://www.adzuna.com', required: true },
}

const UA = 'DataLadder-JobFetcher/1.1 (+https://github.com/dataladder)'

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const ENTITY_MAP = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ', '#39': "'", hellip: '…', ndash: '–', mdash: '—' }

export function decodeEntities(s) {
  return String(s ?? '').replace(/&(#x[0-9a-f]+|#\d+|[a-z]+\d*);/gi, (m, e) => {
    const k = e.toLowerCase()
    if (k.startsWith('#x')) return safeChar(parseInt(k.slice(2), 16), m)
    if (k.startsWith('#')) return safeChar(parseInt(k.slice(1), 10), m)
    return ENTITY_MAP[k] ?? m
  })
}

function safeChar(code, fallback) {
  try { return Number.isFinite(code) ? String.fromCodePoint(code) : fallback } catch { return fallback }
}

/** Strip HTML to plain text and truncate to at most `max` characters. */
export function stripHtml(html, max = 300) {
  let s = decodeEntities(html) // some APIs (Greenhouse) send entity-escaped HTML
  s = s
    .replace(/<(script|style)[^>]*>[\s\S]*?<\/\1>/gi, ' ')
    .replace(/<br\s*\/?>|<\/(p|div|li|h[1-6])>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
  s = decodeEntities(s).replace(/\s+/g, ' ').trim()
  if (s.length > max) s = s.slice(0, max - 1).replace(/\s+\S*$/, '') + '…'
  return s.slice(0, max)
}

/** entry | mid | senior | unknown, from title plus an optional level hint. */
export function inferSeniority(title, hint = '') {
  const t = `${title ?? ''} ${hint ?? ''}`
  if (/\b(senior|sr\.?|lead|principal|staff|manager|head|director|vp|chief)\b/i.test(t) || /\bsenior level\b/i.test(t)) return 'senior'
  if (/\b(junior|jr\.?|entry|graduate|grad|intern|internship|associate|trainee|apprentice(ship)?|werkstudent)\b/i.test(t)) return 'entry'
  // Level numerals: case-insensitive role word, but the numeral must be uppercase "I"/"II"/"III".
  const role = '[Aa]nalyst|[Ee]ngineer|[Ss]cientist|[Ss]pecialist'
  if (new RegExp(`\\b(${role})\\s+(I|1)\\b`).test(title ?? '')) return 'entry' // "Data Analyst I"
  if (/\b(mid|intermediate|mid level)\b/i.test(t) || new RegExp(`\\b(${role})\\s+(II|III|2|3)\\b`).test(title ?? '')) return 'mid'
  return 'unknown'
}

function toIso(v) {
  if (v == null || v === '') return null
  let d
  if (typeof v === 'number') d = new Date(v < 1e12 ? v * 1000 : v)
  else {
    const s = String(v)
    // Remotive sends "2026-10-01T12:00:00" with no zone: treat as UTC.
    d = new Date(/T\d{2}:\d{2}(:\d{2}(\.\d+)?)?$/.test(s) ? s + 'Z' : s)
  }
  return Number.isNaN(d.getTime()) ? null : d.toISOString()
}

const CURRENCY_SYMBOL = { USD: '$', EUR: '€', GBP: '£', INR: '₹', JPY: '¥', BRL: 'R$', AUD: 'A$', CAD: 'C$' }

function currencyPrefix(code) {
  if (!code) return ''
  const c = String(code).toUpperCase()
  return CURRENCY_SYMBOL[c] ?? `${c} `
}

function fmtSalary(min, max, currency = '') {
  const f = (n) => (n >= 1000 ? `${Math.round(n / 1000)}k` : String(Math.round(n)))
  const lo = Number(min) || 0
  const hi = Number(max) || 0
  if (!lo && !hi) return null
  const c = currency || ''
  if (lo && hi && lo !== hi) return `${c}${f(lo)}–${c}${f(hi)}`
  return `${c}${f(lo || hi)}`
}

/** Repair UTF-8 text that was decoded as Latin-1 upstream (e.g. "Ã©" -> "é"). */
export function fixMojibake(s) {
  if (typeof s !== 'string' || !/[Â-ô][-¿]/.test(s)) return s
  for (let i = 0; i < s.length; i++) if (s.charCodeAt(i) > 0xff) return s
  try {
    const bytes = Uint8Array.from(s, (c) => c.charCodeAt(0))
    return new TextDecoder('utf-8', { fatal: true }).decode(bytes)
  } catch {
    return s
  }
}

function isRemoteText(s) {
  return /\bremote\b|anywhere|worldwide|flexible \/ remote/i.test(s ?? '')
}

const WORLDWIDE_RE = /^(anywhere|worldwide|global|world|anywhere in the world|international|all locations|remote)$/i

/**
 * Human-readable location. For remote jobs this carries the eligibility region:
 *   "Remote — Worldwide", "Remote — USA only", "Remote — EMEA, LATAM, Canada, USA".
 * `isRegion` = the source's location field is an eligibility region (remote boards),
 * so a single region gets an "only" suffix.
 */
export function formatLocation(raw, remote, isRegion = false) {
  let s = String(raw ?? '').replace(/\s+/g, ' ').trim()
  if (!remote) return s || null
  if (!s) return 'Remote'
  // "San Francisco, CA; Remote, US": keep only the remote part(s) of a multi-location list.
  const parts = s.split(/\s*[;|]\s*/).filter(Boolean)
  const remoteParts = parts.filter((p) => /\bremote\b/i.test(p))
  if (remoteParts.length && remoteParts.length < parts.length) s = remoteParts.join('; ')
  const hadRemoteWord = /\bremote\b/i.test(s)
  if (hadRemoteWord) {
    s = s
      .replace(/\bfully remote\b|\b100% remote\b|\bremote\b/gi, ' ')
      .replace(/\(\s*\)/g, ' ')
      .replace(/\s*([;,|/])\s*(?=[;,|/]|$)/g, '')
      .replace(/^[\s\-–—:;,|/]+|[\s\-–—:;,|/]+$/g, '')
      .replace(/\s{2,}/g, ' ')
      .trim()
    const inner = s.match(/^\(([^()]*)\)$/) // "(Canada)" -> "Canada"
    if (inner) s = inner[1].trim()
    if (/^[^(]*\)$/.test(s)) s = s.slice(0, -1).trim() // stray ")"
    if (/^\([^)]*$/.test(s)) s = s.slice(1).trim() // stray "("
  }
  if (!s) return hadRemoteWord && !isRegion ? 'Remote' : 'Remote — Worldwide'
  if (WORLDWIDE_RE.test(s)) return 'Remote — Worldwide'
  const single = !/[,;/&|]|\band\b|\d/.test(s) && s.length <= 30
  return `Remote — ${s}${single && (isRegion || hadRemoteWord) ? ' only' : ''}`
}

/** Join a list of countries / regions, truncating long lists ("A, B, C, D +12 more"). */
function joinRegions(list, max = 4) {
  const xs = (list ?? []).map((x) => String(x ?? '').trim()).filter(Boolean)
  if (xs.length <= max) return xs.join(', ')
  return `${xs.slice(0, max).join(', ')} +${xs.length - max} more`
}

async function getJson(url, { timeoutMs = 15000, headers = {} } = {}) {
  const res = await fetch(url, {
    headers: { 'User-Agent': UA, Accept: 'application/json', ...headers },
    signal: AbortSignal.timeout(timeoutMs),
  })
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`)
  return await res.json()
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

/** Run `fn` over `items` with at most `limit` in flight; returns Promise.allSettled-style results in order. */
async function mapLimit(items, limit, fn) {
  const results = new Array(items.length)
  let next = 0
  const worker = async () => {
    while (next < items.length) {
      const i = next++
      try { results[i] = { status: 'fulfilled', value: await fn(items[i], i) } }
      catch (reason) { results[i] = { status: 'rejected', reason } }
    }
  }
  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, worker))
  return results
}

/** Tidy ATS company names: "Careers at Tide" -> "Tide", "Stone - Linkedin" -> "Stone", "Gusto, Inc." -> "Gusto". */
function cleanCompany(c) {
  const s = String(c ?? '')
    .replace(/^\s*careers at\s+/i, '')
    .replace(/\s*[-–|]\s*linkedin\s*$/i, '')
    .replace(/,?\s+(inc|llc|ltd)\.?\s*$/i, '')
    .replace(/\s+/g, ' ')
    .trim()
  return s || null
}

/** Build a normalized job object with every column present (required for bulk upserts). */
function job(p) {
  const title = String(p.title ?? '').replace(/\s+/g, ' ').trim()
  const remote = typeof p.remote === 'boolean' ? p.remote : null
  return {
    source: p.source,
    external_id: String(p.external_id),
    title,
    company: cleanCompany(p.company),
    company_logo: p.company_logo || null,
    location: formatLocation(p.location, remote === true, !!p.locationIsRegion),
    remote,
    url: p.url || null,
    description_snippet: p.description ? stripHtml(p.description, 300) || null : null,
    salary: p.salary ? String(p.salary).trim() || null : null,
    tags: Array.isArray(p.tags) ? [...new Set(p.tags.filter(Boolean).map((t) => String(t).trim().toLowerCase()))].slice(0, 12) : [],
    seniority: inferSeniority(title, p.levelHint),
    role_family: inferRoleFamily(title),
    posted_at: toIso(p.posted_at),
  }
}

// ---------------------------------------------------------------------------
// Sources. Each returns { fetched, jobs }.
// ---------------------------------------------------------------------------

export async function fetchRemotive({ timeoutMs } = {}) {
  // Remotive ToS: link back to the Remotive URL and mention Remotive as source.
  // They also ask to keep calls to a few per day (the 6-hourly cron = 4/day).
  // The public feed is now a fixed, 24h-delayed list (~15 jobs) and ignores
  // search/category filters, so one call is enough; we filter titles locally.
  const data = await getJson('https://remotive.com/api/remote-jobs?category=data', { timeoutMs })
  const list = Array.isArray(data?.jobs) ? data.jobs : []
  const jobs = list
    .filter((j) => isTargetTitle(j.title))
    .map((j) => job({
      source: 'remotive',
      external_id: j.id,
      title: j.title,
      company: j.company_name,
      company_logo: j.company_logo,
      location: j.candidate_required_location || 'Worldwide',
      locationIsRegion: true,
      remote: true,
      url: j.url,
      description: j.description,
      salary: j.salary,
      tags: [...(j.tags ?? []), j.job_type?.replace(/_/g, ' ')],
      posted_at: j.publication_date,
    }))
  return { fetched: list.length, jobs }
}

export async function fetchArbeitnow({ timeoutMs, pages = 5 } = {}) {
  let fetched = 0
  const jobs = []
  for (let page = 1; page <= pages; page++) {
    const data = await getJson(`https://www.arbeitnow.com/api/job-board-api?page=${page}`, { timeoutMs })
    const list = Array.isArray(data?.data) ? data.data : []
    fetched += list.length
    for (const j of list) {
      if (!isTargetTitle(j.title)) continue
      jobs.push(job({
        source: 'arbeitnow',
        external_id: j.slug,
        title: j.title,
        company: j.company_name,
        location: j.location,
        remote: !!j.remote,
        url: j.url,
        description: j.description,
        tags: [...(j.tags ?? []), ...(j.job_types ?? [])],
        posted_at: j.created_at,
      }))
    }
    if (!list.length || !data?.links?.next) break
  }
  return { fetched, jobs }
}

export async function fetchRemoteOK({ timeoutMs } = {}) {
  // Remote OK ToS: link back (followed link) to the job URL on remoteok.com and
  // mention "Remote OK" as the source. Do not use their logo.
  const data = await getJson('https://remoteok.com/api', { timeoutMs })
  const list = (Array.isArray(data) ? data : []).filter((j) => j && j.id && !j.legal) // [0] is the legal notice
  const jobs = list
    .filter((j) => isTargetTitle(fixMojibake(j.position)))
    .map((j) => job({
      source: 'remoteok',
      external_id: j.id,
      title: fixMojibake(j.position),
      company: fixMojibake(j.company),
      company_logo: j.company_logo || j.logo,
      location: fixMojibake(j.location) || '',
      locationIsRegion: true,
      remote: true,
      url: j.url || `https://remoteok.com/remote-jobs/${j.slug ?? j.id}`,
      description: fixMojibake(j.description),
      salary: fmtSalary(j.salary_min, j.salary_max, '$'),
      tags: j.tags,
      posted_at: j.date || j.epoch,
    }))
  return { fetched: list.length, jobs }
}

export async function fetchTheMuse({ timeoutMs, pages = 3 } = {}) {
  let fetched = 0
  const jobs = []
  for (let page = 1; page <= pages; page++) {
    const data = await getJson(
      `https://www.themuse.com/api/public/jobs?category=Data%20and%20Analytics&page=${page}`,
      { timeoutMs },
    )
    const list = Array.isArray(data?.results) ? data.results : []
    fetched += list.length
    for (const j of list) {
      if (!isTargetTitle(j.name)) continue
      const locs = (j.locations ?? []).map((l) => l.name).filter(Boolean)
      const levels = (j.levels ?? []).map((l) => l.name).join(' ')
      jobs.push(job({
        source: 'themuse',
        external_id: j.id,
        title: j.name,
        company: j.company?.name,
        location: locs.join('; ') || null,
        remote: locs.some(isRemoteText),
        url: j.refs?.landing_page,
        description: j.contents,
        tags: (j.categories ?? []).map((c) => c.name),
        levelHint: levels,
        posted_at: j.publication_date,
      }))
    }
    if (!list.length || page >= (data?.page_count ?? 0)) break
  }
  return { fetched, jobs }
}

export async function fetchGreenhouse({
  timeoutMs, boards = DEFAULT_GREENHOUSE_BOARDS, maxDetailsPerBoard = 20, maxAgeDays = 45, concurrency = 8,
} = {}) {
  let fetched = 0
  const jobs = []
  const errors = []
  const cutoff = maxAgeDays ? Date.now() - maxAgeDays * 86400000 : 0
  // A failing board never sinks the rest.
  const results = await mapLimit(boards, concurrency, async (token) => {
    const base = `https://boards-api.greenhouse.io/v1/boards/${encodeURIComponent(token)}/jobs`
    const data = await getJson(base, { timeoutMs })
    const list = Array.isArray(data?.jobs) ? data.jobs : []
    const matches = list
      .filter((j) => isTargetTitle(j.title))
      .map((j) => ({ ...j, _posted: j.first_published || j.updated_at }))
      .filter((j) => !cutoff || !j._posted || Date.parse(j._posted) >= cutoff)
      .sort((a, b) => String(b._posted ?? '').localeCompare(String(a._posted ?? '')))
    // The list endpoint has no description; fetch details only for the newest matches.
    const contents = await mapLimit(matches.slice(0, maxDetailsPerBoard), 4, async (j) => {
      const d = await getJson(`${base}/${j.id}`, { timeoutMs })
      return d?.content ?? ''
    })
    const out = matches.map((j, i) => {
      const loc = j.location?.name ?? ''
      const workplace = (j.metadata ?? []).find((m) => /workplace|remote/i.test(m?.name ?? ''))?.value
      return job({
        source: 'greenhouse',
        external_id: `${token}:${j.id}`,
        title: j.title,
        company: j.company_name || token,
        location: loc,
        remote: isRemoteText(loc) || /remote/i.test(String(workplace ?? '')),
        url: j.absolute_url,
        description: contents[i]?.status === 'fulfilled' ? contents[i].value : '', // snippet is optional
        tags: [token],
        posted_at: j._posted,
      })
    })
    return { count: list.length, out }
  })
  results.forEach((r, k) => {
    if (r.status === 'fulfilled') { fetched += r.value.count; jobs.push(...r.value.out) }
    else errors.push(`${boards[k]}: ${r.reason?.message ?? r.reason}`)
  })
  return { fetched, jobs, errors }
}

export async function fetchLever({ timeoutMs, companies = DEFAULT_LEVER_COMPANIES, concurrency = 6 } = {}) {
  // Lever's public postings API is documented for exactly this use (job boards).
  // Link to hostedUrl (the company's own Lever page).
  let fetched = 0
  const jobs = []
  const errors = []
  const tokens = Object.keys(companies)
  // Some boards (e.g. Veeva, ~1k postings, ~13 MB) are large: allow more time.
  const t = Math.max(timeoutMs ?? 0, 60000)
  const results = await mapLimit(tokens, concurrency, async (token) => {
    const list = await getJson(`https://api.lever.co/v0/postings/${encodeURIComponent(token)}?mode=json`, { timeoutMs: t })
    const arr = Array.isArray(list) ? list : []
    const out = arr.filter((j) => isTargetTitle(j.text)).map((j) => {
      const c = j.categories ?? {}
      const remote = /remote/i.test(j.workplaceType ?? '') || isRemoteText(c.location)
      let loc = (c.allLocations?.length ? c.allLocations.join('; ') : c.location) || ''
      if (remote && (!loc || /^remote$/i.test(loc)) && j.country) loc = `Remote - ${j.country}`
      const sr = j.salaryRange
      return job({
        source: 'lever',
        external_id: `${token}:${j.id}`,
        title: j.text,
        company: companies[token] || token,
        location: loc,
        remote,
        url: j.hostedUrl,
        description: j.descriptionPlain || j.openingPlain || j.description,
        salary: sr ? fmtSalary(sr.min, sr.max, currencyPrefix(sr.currency)) : null,
        tags: [token, c.team, c.department, c.commitment, j.workplaceType],
        posted_at: j.createdAt,
      })
    })
    return { count: arr.length, out }
  })
  results.forEach((r, k) => {
    if (r.status === 'fulfilled') { fetched += r.value.count; jobs.push(...r.value.out) }
    else errors.push(`${tokens[k]}: ${r.reason?.message ?? r.reason}`)
  })
  return { fetched, jobs, errors }
}

export async function fetchAshby({ timeoutMs, orgs = DEFAULT_ASHBY_ORGS, concurrency = 6 } = {}) {
  // Ashby's public posting API is intended for embedding job boards. Link to jobUrl.
  let fetched = 0
  const jobs = []
  const errors = []
  const tokens = Object.keys(orgs)
  // Boards ship full descriptions for every posting (OpenAI is ~14 MB): allow more time.
  const t = Math.max(timeoutMs ?? 0, 60000)
  const results = await mapLimit(tokens, concurrency, async (org) => {
    const data = await getJson(
      `https://api.ashbyhq.com/posting-api/job-board/${encodeURIComponent(org)}?includeCompensation=true`,
      { timeoutMs: t },
    )
    const arr = (Array.isArray(data?.jobs) ? data.jobs : []).filter((j) => j.isListed !== false)
    const out = arr.filter((j) => isTargetTitle(j.title)).map((j) => {
      const remote = j.workplaceType ? /remote/i.test(j.workplaceType) : !!j.isRemote
      const locs = [j.location, ...(j.secondaryLocations ?? []).map((s) => s?.location)].filter(Boolean)
      let loc = locs.join('; ')
      const country = j.address?.postalAddress?.addressCountry
      if (remote && (!loc || /^remote$/i.test(loc)) && country) loc = `Remote - ${country}`
      const comp = j.compensation
      return job({
        source: 'ashby',
        external_id: `${org}:${j.id}`,
        title: j.title,
        company: orgs[org] || org,
        location: loc,
        remote,
        url: j.jobUrl,
        description: j.descriptionPlain || j.descriptionHtml,
        salary: comp?.scrapeableCompensationSalarySummary || null,
        tags: [org, j.department, j.team, j.employmentType, j.workplaceType],
        posted_at: j.publishedAt,
      })
    })
    return { count: arr.length, out }
  })
  results.forEach((r, k) => {
    if (r.status === 'fulfilled') { fetched += r.value.count; jobs.push(...r.value.out) }
    else errors.push(`${tokens[k]}: ${r.reason?.message ?? r.reason}`)
  })
  return { fetched, jobs, errors }
}

export async function fetchJobicy({ timeoutMs, tags = ['data analyst', 'analytics'] } = {}) {
  // Jobicy terms: credit Jobicy with a direct link to the source, and every apply
  // button must go to the job URL from the feed. Poll at most once per hour.
  let fetched = 0
  const jobs = []
  for (const tag of tags) {
    const data = await getJson(`https://jobicy.com/api/v2/remote-jobs?count=100&tag=${encodeURIComponent(tag)}`, { timeoutMs })
    const list = Array.isArray(data?.jobs) ? data.jobs : []
    fetched += list.length
    for (const j of list) {
      const title = decodeEntities(j.jobTitle)
      if (!isTargetTitle(title)) continue
      jobs.push(job({
        source: 'jobicy',
        external_id: j.id,
        title,
        company: decodeEntities(j.companyName),
        company_logo: j.companyLogo,
        location: String(j.jobGeo ?? '').replace(/\s*,\s*/g, ', '),
        locationIsRegion: true,
        remote: true,
        url: j.url,
        description: j.jobExcerpt || j.jobDescription,
        salary: fmtSalary(j.salaryMin, j.salaryMax, currencyPrefix(j.salaryCurrency)),
        tags: [...(j.jobIndustry ?? []).map(decodeEntities), ...(j.jobType ?? [])],
        levelHint: j.jobLevel === 'Any' ? '' : j.jobLevel,
        posted_at: j.pubDate,
      }))
    }
  }
  return { fetched, jobs }
}

export async function fetchHimalayas({
  timeoutMs,
  queries = ['data analyst', 'business intelligence', 'analytics', 'product analyst', 'business analyst'],
  pages = 3,
} = {}) {
  // Himalayas terms: show a visible link back to the Himalayas job URL and mention
  // Himalayas as the source. The API is rate limited (429), so requests are sequential.
  let fetched = 0
  const jobs = []
  for (const q of queries) {
    for (let page = 1; page <= pages; page++) {
      const data = await getJson(
        `https://himalayas.app/jobs/api/search?q=${encodeURIComponent(q)}&sort=recent&page=${page}`,
        { timeoutMs },
      )
      const list = Array.isArray(data?.jobs) ? data.jobs : []
      fetched += list.length
      for (const j of list) {
        if (!isTargetTitle(j.title)) continue
        const regions = j.locationRestrictions ?? []
        jobs.push(job({
          source: 'himalayas',
          external_id: j.guid || j.applicationLink || `${j.companySlug}:${j.title}`,
          title: j.title,
          company: j.companyName,
          company_logo: j.companyLogo,
          location: regions.length ? joinRegions(regions) : 'Worldwide',
          locationIsRegion: true,
          remote: true,
          url: j.applicationLink || j.guid,
          description: j.excerpt || j.description,
          salary: fmtSalary(j.minSalary, j.maxSalary, currencyPrefix(j.currency)),
          tags: [...(j.categories ?? []).map((c) => String(c).replace(/-/g, ' ')), j.employmentType],
          levelHint: (j.seniority ?? []).join(' '),
          posted_at: j.pubDate,
        }))
      }
      if (!list.length) break // pages often hold < 20 rows, so only stop on an empty page
      await sleep(250)
    }
  }
  return { fetched, jobs }
}

export async function fetchWorkingNomads({ timeoutMs } = {}) {
  // Working Nomads exposed feed: link back to the Working Nomads job URL and credit them.
  const data = await getJson('https://www.workingnomads.com/api/exposed_jobs/', { timeoutMs })
  const list = Array.isArray(data) ? data : []
  const jobs = list
    .filter((j) => isTargetTitle(j.title))
    .map((j) => job({
      source: 'workingnomads',
      external_id: String(j.url ?? '').match(/\/(\d+)\/?$/)?.[1] ?? j.url,
      title: j.title,
      company: j.company_name,
      location: j.location || 'Worldwide',
      locationIsRegion: true,
      remote: true,
      url: j.url,
      description: j.description,
      tags: [j.category_name, ...String(j.tags ?? '').split(',')],
      posted_at: j.pub_date,
    }))
  return { fetched: list.length, jobs }
}

export async function fetchAdzuna({ timeoutMs, appId, appKey, countries = ['us', 'gb'] } = {}) {
  // Adzuna ToS: show "Jobs by Adzuna" attribution linking to adzuna.com.
  let fetched = 0
  const jobs = []
  for (const c of countries) {
    const url = `https://api.adzuna.com/v1/api/jobs/${encodeURIComponent(c)}/search/1?app_id=${encodeURIComponent(appId)}&app_key=${encodeURIComponent(appKey)}&what=${encodeURIComponent('data analyst')}&results_per_page=50&max_days_old=30&content-type=application/json`
    const data = await getJson(url, { timeoutMs })
    const list = Array.isArray(data?.results) ? data.results : []
    fetched += list.length
    for (const j of list) {
      const title = stripHtml(j.title ?? '', 200)
      if (!isTargetTitle(title)) continue
      jobs.push(job({
        source: 'adzuna',
        external_id: `${c}:${j.id}`,
        title,
        company: j.company?.display_name,
        location: j.location?.display_name,
        remote: isRemoteText(`${title} ${j.location?.display_name ?? ''}`),
        url: j.redirect_url,
        description: j.description,
        salary: fmtSalary(j.salary_min, j.salary_max, c === 'gb' ? '£' : c === 'us' ? '$' : ''),
        tags: [j.category?.label, j.contract_time?.replace(/_/g, ' ')],
        posted_at: j.created,
      }))
    }
  }
  return { fetched, jobs }
}

// ---------------------------------------------------------------------------
// Orchestration
// ---------------------------------------------------------------------------

// On a cross-source duplicate, keep the employer's own ATS posting (direct apply link).
const SOURCE_PRIORITY = { greenhouse: 0, lever: 0, ashby: 0 }

const norm = (s) => String(s ?? '').toLowerCase().normalize('NFKD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, ' ').trim()
const normCompany = (s) => norm(s).replace(/\b(inc|llc|ltd|limited|gmbh|corp|corporation|co|plc|sa|bv|ag|se|group|technologies)\b/g, '').replace(/\s+/g, ' ').trim()

function better(a, b) {
  const pa = SOURCE_PRIORITY[a.source] ?? 1
  const pb = SOURCE_PRIORITY[b.source] ?? 1
  if (pa !== pb) return pa < pb ? a : b
  if ((a.posted_at ?? '') !== (b.posted_at ?? '')) return (a.posted_at ?? '') > (b.posted_at ?? '') ? a : b
  return a.description_snippet || !b.description_snippet ? a : b
}

/**
 * Fetch every source in parallel; each one is isolated so a failure only
 * shows up in `counts[source].error`.
 * @returns {Promise<{ jobs: object[], counts: Record<string, {fetched:number, matched:number, kept?:number, error?:string, skipped?:string}> }>}
 * `matched` counts title matches before the age filter / dedupe / cap; `kept` is what survives into `jobs`.
 */
export async function fetchAllJobs({
  timeoutMs = 20000,
  greenhouseBoards = DEFAULT_GREENHOUSE_BOARDS,
  leverCompanies = DEFAULT_LEVER_COMPANIES,
  ashbyOrgs = DEFAULT_ASHBY_ORGS,
  adzunaAppId,
  adzunaAppKey,
  adzunaCountries = ['us', 'gb'],
  maxAgeDays = 45,
  maxJobs = 600,
} = {}) {
  const sources = {
    remotive: () => fetchRemotive({ timeoutMs }),
    arbeitnow: () => fetchArbeitnow({ timeoutMs }),
    remoteok: () => fetchRemoteOK({ timeoutMs }),
    themuse: () => fetchTheMuse({ timeoutMs }),
    greenhouse: () => fetchGreenhouse({ timeoutMs, boards: greenhouseBoards, maxAgeDays }),
    lever: () => fetchLever({ timeoutMs, companies: leverCompanies }),
    ashby: () => fetchAshby({ timeoutMs, orgs: ashbyOrgs }),
    jobicy: () => fetchJobicy({ timeoutMs }),
    himalayas: () => fetchHimalayas({ timeoutMs }),
    workingnomads: () => fetchWorkingNomads({ timeoutMs }),
  }
  if (adzunaAppId && adzunaAppKey) {
    sources.adzuna = () => fetchAdzuna({ timeoutMs, appId: adzunaAppId, appKey: adzunaAppKey, countries: adzunaCountries })
  }

  const counts = {}
  if (!sources.adzuna) counts.adzuna = { fetched: 0, matched: 0, skipped: 'ADZUNA_APP_ID / ADZUNA_APP_KEY not set' }

  const all = []
  await Promise.all(Object.entries(sources).map(async ([name, fn]) => {
    try {
      const { fetched, jobs, errors } = await fn()
      counts[name] = { fetched, matched: jobs.length }
      if (errors?.length) counts[name].partial_errors = errors
      all.push(...jobs)
    } catch (e) {
      counts[name] = { fetched: 0, matched: 0, error: String(e?.message ?? e) }
    }
  }))

  // 1) De-duplicate on (source, external_id) and drop rows missing essentials or
  //    older than maxAgeDays (mirrors the daily prune job in the database).
  const cutoff = maxAgeDays ? Date.now() - maxAgeDays * 86400000 : 0
  const byId = new Map()
  for (const j of all) {
    if (!j.external_id || !j.title || !j.url) continue
    if (cutoff && j.posted_at && Date.parse(j.posted_at) < cutoff) continue
    byId.set(`${j.source}\u0000${j.external_id}`, j)
  }
  // 2) Cross-source de-duplicate on normalized (company, title, location).
  const byKey = new Map()
  for (const j of byId.values()) {
    const key = `${normCompany(j.company)}\u0000${norm(j.title)}\u0000${norm(j.location)}`
    const prev = byKey.get(key)
    byKey.set(key, prev ? better(prev, j) : j)
  }
  // 3) Newest first, capped.
  const jobs = [...byKey.values()]
    .sort((a, b) => (b.posted_at ?? '').localeCompare(a.posted_at ?? ''))
    .slice(0, maxJobs)
  for (const j of jobs) if (counts[j.source]) counts[j.source].kept = (counts[j.source].kept ?? 0) + 1
  return { jobs, counts }
}

/**
 * Upsert jobs into public.jobs through PostgREST using the service-role key.
 * @returns {Promise<number>} rows sent
 */
export async function upsertJobs(supabaseUrl, serviceRoleKey, jobs, { batchSize = 200, timeoutMs = 30000 } = {}) {
  const base = supabaseUrl.replace(/\/+$/, '')
  const fetchedAt = new Date().toISOString()
  let sent = 0
  for (let i = 0; i < jobs.length; i += batchSize) {
    const rows = jobs.slice(i, i + batchSize).map((j) => ({ ...j, fetched_at: fetchedAt }))
    const res = await fetch(`${base}/rest/v1/jobs?on_conflict=source,external_id`, {
      method: 'POST',
      headers: {
        apikey: serviceRoleKey,
        Authorization: `Bearer ${serviceRoleKey}`,
        'Content-Type': 'application/json',
        Prefer: 'resolution=merge-duplicates,return=minimal',
      },
      body: JSON.stringify(rows),
      signal: AbortSignal.timeout(timeoutMs),
    })
    if (!res.ok) throw new Error(`Upsert failed (HTTP ${res.status}): ${(await res.text()).slice(0, 500)}`)
    sent += rows.length
  }
  return sent
}

export function parseList(v, fallback) {
  const list = String(v ?? '').split(',').map((s) => s.trim()).filter(Boolean)
  return list.length ? list : fallback
}

/** Parse "token" or "token:Display Name" comma lists into a { token: name } map. */
export function parseCompanyMap(v, fallback) {
  const list = parseList(v, null)
  if (!list) return fallback
  return Object.fromEntries(list.map((s) => {
    const [token, ...name] = s.split(':')
    return [token.trim(), name.join(':').trim() || fallback?.[token.trim()] || token.trim()]
  }))
}
