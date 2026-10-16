import { supabase } from './supabase'

export type Seniority = 'entry' | 'mid' | 'senior' | 'unknown'

export interface Job {
  id: string
  source: string
  title: string
  company: string
  company_logo: string | null
  location: string | null
  remote: boolean
  url: string
  description_snippet: string | null
  salary: string | null
  tags: string[]
  seniority: Seniority
  role_family?: string | null
  posted_at: string | null
  via?: string
  direct?: boolean
}

/** Attribution text required by some sources. */
export const VIA_LINKS: Record<string, string> = {
  remoteok: 'https://remoteok.com',
  remotive: 'https://remotive.com',
  arbeitnow: 'https://www.arbeitnow.com',
  jobicy: 'https://jobicy.com',
  himalayas: 'https://himalayas.app',
  adzuna: 'https://www.adzuna.com',
  workingnomads: 'https://www.workingnomads.com',
}

export async function loadJobs(): Promise<Job[]> {
  const out: Job[] = []
  if (supabase) {
    const [ext, direct] = await Promise.all([
      supabase.from('jobs').select('*').order('posted_at', { ascending: false }).limit(800),
      supabase.from('employer_jobs').select('*').eq('status', 'open').order('created_at', { ascending: false }),
    ])
    for (const d of direct.data ?? []) {
      out.push({
        id: `direct:${d.id}`, source: 'dataladder', title: d.title, company: d.company, company_logo: null, location: d.location,
        remote: d.remote, url: d.url, description_snippet: d.description?.slice(0, 300) ?? null, salary: d.salary, tags: [],
        seniority: d.seniority ?? 'unknown', posted_at: d.created_at, via: 'DataLadder', direct: true,
      })
    }
    if (ext.data?.length) {
      for (const j of ext.data) out.push({ ...j, id: `${j.source}:${j.external_id}` })
      return out
    }
  }
  try {
    const res = await fetch('/jobs.json', { cache: 'no-cache' })
    if (res.ok) out.push(...((await res.json()) as Job[]))
  } catch {
    /* offline: show whatever we have */
  }
  return out
}

export function timeAgo(iso: string | null): string {
  if (!iso) return ''
  const d = (Date.now() - new Date(iso).getTime()) / 86400000
  if (d < 1) return 'today'
  if (d < 2) return 'yesterday'
  if (d < 30) return `${Math.floor(d)}d ago`
  return `${Math.floor(d / 30)}mo ago`
}
