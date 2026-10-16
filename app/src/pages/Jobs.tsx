import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { loadJobs, timeAgo, VIA_LINKS, type Job } from '../lib/jobs'
import { useProgress } from '../store/progress'
import Spinner from '../components/Spinner'

const SENIORITY_LABEL: Record<string, string> = { entry: 'Entry-level', mid: 'Mid-level', senior: 'Senior', unknown: 'Level not stated' }

export default function Jobs() {
  const [jobs, setJobs] = useState<Job[] | null>(null)
  const [q, setQ] = useState('')
  const [remoteOnly, setRemoteOnly] = useState(false)
  const [level, setLevel] = useState<string>('all')
  const [savedOnly, setSavedOnly] = useState(false)
  const [days, setDays] = useState(45)
  const saved = useProgress((s) => s.savedJobs)
  const toggleSave = useProgress((s) => s.toggleSaveJob)
  const applyJob = useProgress((s) => s.applyJob)

  useEffect(() => { loadJobs().then(setJobs) }, [])

  const filtered = useMemo(() => {
    if (!jobs) return []
    const needle = q.trim().toLowerCase()
    const cutoff = Date.now() - days * 86400000
    return jobs
      .filter((j) => !needle || `${j.title} ${j.company} ${j.location ?? ''} ${j.tags.join(' ')}`.toLowerCase().includes(needle))
      .filter((j) => !remoteOnly || j.remote)
      .filter((j) => level === 'all' || j.seniority === level || (level === 'entry' && j.seniority === 'unknown' && /junior|graduate|entry|associate|trainee|intern/i.test(j.title)))
      .filter((j) => !savedOnly || saved.includes(j.id))
      .filter((j) => !j.posted_at || new Date(j.posted_at).getTime() >= cutoff)
      .sort((a, b) => Number(!!b.direct) - Number(!!a.direct) || (b.posted_at ?? '').localeCompare(a.posted_at ?? ''))
  }, [jobs, q, remoteOnly, level, savedOnly, saved, days])

  const sources = useMemo(() => [...new Set((jobs ?? []).map((j) => j.via ?? j.source))], [jobs])

  return (
    <div>
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold">Data Analyst <span className="glow-text">Jobs</span></h1>
          <p className="text-ink-400">Live roles worldwide, refreshed automatically from public job boards and companies hiring directly on DataLadder.</p>
        </div>
        <Link to="/hire" className="btn btn-ghost">🏢 Hiring? Post a role</Link>
      </header>

      <div className="glass mt-5 grid gap-3 rounded-2xl p-4 md:grid-cols-[1fr_auto_auto_auto_auto]">
        <label className="sr-only" htmlFor="jq">Search jobs</label>
        <input id="jq" className="input" placeholder="Search title, company, location, skill…" value={q} onChange={(e) => setQ(e.target.value)} />
        <select className="input md:w-44" value={level} onChange={(e) => setLevel(e.target.value)} aria-label="Seniority">
          <option value="all">All levels</option>
          <option value="entry">Entry-level friendly</option>
          <option value="mid">Mid-level</option>
          <option value="senior">Senior</option>
        </select>
        <select className="input md:w-36" value={days} onChange={(e) => setDays(Number(e.target.value))} aria-label="Posted within">
          <option value={1}>Last 24h</option>
          <option value={7}>Last 7 days</option>
          <option value={14}>Last 14 days</option>
          <option value={45}>Last 45 days</option>
        </select>
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={remoteOnly} onChange={(e) => setRemoteOnly(e.target.checked)} className="accent-sky-400" /> Remote</label>
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={savedOnly} onChange={(e) => setSavedOnly(e.target.checked)} className="accent-sky-400" /> Saved ({saved.length})</label>
      </div>

      {!jobs ? <Spinner label="Fetching jobs…" /> : (
        <>
          <p className="mt-4 text-sm text-ink-400">{filtered.length} of {jobs.length} roles</p>
          <ul className="mt-3 grid gap-3 lg:grid-cols-2">
            {filtered.map((j) => {
              const isSaved = saved.includes(j.id)
              return (
                <li key={j.id} className={`glass flex flex-col rounded-2xl p-4 ${j.direct ? 'ring-1 ring-gold/50' : ''}`}>
                  <div className="flex items-start gap-3">
                    {j.company_logo ? (
                      <img src={j.company_logo} alt="" className="h-10 w-10 rounded-lg bg-white object-contain" loading="lazy" onError={(e) => (e.currentTarget.style.display = 'none')} />
                    ) : (
                      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-white/10 font-bold">{j.company.slice(0, 1)}</span>
                    )}
                    <div className="min-w-0 flex-1">
                      <h2 className="font-semibold leading-snug">{j.title}</h2>
                      <p className="text-sm text-ink-200">{j.company}{j.location ? ` · ${j.location}` : ''}</p>
                    </div>
                    <button onClick={() => toggleSave(j.id)} aria-pressed={isSaved} aria-label={isSaved ? 'Unsave job' : 'Save job'} className="text-lg opacity-70 hover:opacity-100">{isSaved ? '★' : '☆'}</button>
                  </div>
                  {j.description_snippet && <p className="mt-2 line-clamp-2 text-sm text-ink-400">{j.description_snippet}</p>}
                  <div className="mt-3 flex flex-wrap items-center gap-1.5">
                    {j.direct && <span className="chip border-gold/50 text-gold">⭐ Hiring on DataLadder</span>}
                    {j.remote && <span className="chip">🌍 Remote</span>}
                    <span className={`chip ${j.seniority === 'entry' ? 'border-emerald-500/40 text-emerald-300' : ''}`}>{SENIORITY_LABEL[j.seniority]}</span>
                    {j.salary && <span className="chip">💰 {j.salary}</span>}
                    <span className="ml-auto text-xs text-ink-400">{timeAgo(j.posted_at)}</span>
                  </div>
                  <div className="mt-3 flex items-center justify-between gap-2">
                    <span className="text-[11px] text-ink-400">
                      via {VIA_LINKS[j.source] ? <a href={VIA_LINKS[j.source]} target="_blank" rel="noopener" className="underline">{j.via ?? j.source}</a> : (j.via ?? j.source)}
                    </span>
                    <a href={j.url} target="_blank" rel="noopener" onClick={() => applyJob()} className="btn btn-primary px-3 py-1.5 text-sm">Apply ↗</a>
                  </div>
                </li>
              )
            })}
          </ul>
          {filtered.length === 0 && <p className="py-16 text-center text-ink-400">No roles match those filters. Try widening the date range or clearing the search.</p>}
          <p className="mt-8 text-center text-xs text-ink-400">Sources: {sources.join(' · ')}. Listings link to the original posting; DataLadder isn't affiliated with these employers.</p>
        </>
      )}
    </div>
  )
}
