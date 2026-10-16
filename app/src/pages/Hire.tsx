import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase, hasBackend } from '../lib/supabase'
import { useAuth } from '../store/auth'
import { floors } from '../content'

interface Posting { id: string; title: string; company: string; location: string | null; remote: boolean; url: string; status: 'open' | 'closed'; created_at: string }
interface Leader { display_name: string; xp: number }

const EMPTY = { title: '', company: '', location: '', remote: true, url: '', salary: '', seniority: 'entry', description: '' }

export default function Hire() {
  const session = useAuth((s) => s.session)
  const profile = useAuth((s) => s.profile)
  const navigate = useNavigate()
  const [form, setForm] = useState({ ...EMPTY, company: profile?.company ?? '' })
  const [mine, setMine] = useState<Posting[]>([])
  const [leaders, setLeaders] = useState<Leader[]>([])
  const [certId, setCertId] = useState('')
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null)
  const isEmployer = profile?.role === 'employer'

  useEffect(() => {
    if (!supabase) return
    supabase.rpc('leaderboard', { limit: 10 }).then(({ data }) => setLeaders((data as Leader[]) ?? []))
    if (session && isEmployer) {
      supabase.from('employer_jobs').select('id,title,company,location,remote,url,status,created_at').eq('employer_id', session.user.id).order('created_at', { ascending: false })
        .then(({ data }) => setMine((data as Posting[]) ?? []))
    }
  }, [session, isEmployer])

  const post = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!supabase || !session) return
    if (!/^https?:\/\//.test(form.url)) return setMsg({ ok: false, text: 'Application URL must start with http(s)://' })
    const { data, error } = await supabase.from('employer_jobs').insert({ ...form, employer_id: session.user.id, salary: form.salary || null }).select('id,title,company,location,remote,url,status,created_at').single()
    if (error) return setMsg({ ok: false, text: error.message })
    setMine([data as Posting, ...mine])
    setForm({ ...EMPTY, company: form.company })
    setMsg({ ok: true, text: 'Your role is live on the DataLadder job board ⭐' })
  }

  const close = async (id: string) => {
    await supabase?.from('employer_jobs').update({ status: 'closed' }).eq('id', id)
    setMine(mine.map((m) => (m.id === id ? { ...m, status: 'closed' } : m)))
  }

  return (
    <div className="mx-auto max-w-5xl">
      <section className="glass overflow-hidden rounded-3xl p-8">
        <p className="text-xs uppercase tracking-[0.2em] text-gold">For employers</p>
        <h1 className="mt-1 font-display text-3xl font-bold sm:text-4xl">Hire job-ready <span className="glow-text">Data Analysts</span></h1>
        <p className="mt-2 max-w-2xl text-ink-200">Every DataLadder graduate has cleared 10 floors of hands-on practice (spreadsheets, statistics, SQL including window functions, BI dashboards, Python/pandas and business analytics), passed a server-graded exam at 80%+, and shipped a public capstone project you can review.</p>
        <div className="mt-5 grid gap-2 sm:grid-cols-5">
          {floors.map((f) => <span key={f.id} className="chip justify-center py-1.5">{f.icon} {f.title}</span>)}
        </div>
      </section>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_340px]">
        <section className="glass rounded-3xl p-6">
          <h2 className="font-display text-xl font-bold">Post a role, free</h2>
          {!hasBackend ? (
            <p className="mt-2 text-ink-400">Employer posting needs the online service, which isn't configured on this deployment.</p>
          ) : !session ? (
            <div className="mt-3"><p className="text-ink-400">Create a free employer account to post roles. They're pinned at the top of the job board.</p><button className="btn btn-primary mt-3" onClick={() => navigate('/auth')}>Create employer account</button></div>
          ) : !isEmployer ? (
            <p className="mt-2 text-ink-400">You're signed in as a learner. Employer posting needs an employer account.</p>
          ) : (
            <form onSubmit={post} className="mt-4 grid gap-3 sm:grid-cols-2">
              <input className="input sm:col-span-2" required placeholder="Job title, e.g. Junior Data Analyst" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} aria-label="Job title" />
              <input className="input" required placeholder="Company" value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} aria-label="Company" />
              <input className="input" placeholder="Location (city, country)" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} aria-label="Location" />
              <select className="input" value={form.seniority} onChange={(e) => setForm({ ...form, seniority: e.target.value })} aria-label="Seniority">
                <option value="entry">Entry-level</option><option value="mid">Mid-level</option><option value="senior">Senior</option>
              </select>
              <input className="input" placeholder="Salary range (optional)" value={form.salary} onChange={(e) => setForm({ ...form, salary: e.target.value })} aria-label="Salary" />
              <input className="input sm:col-span-2" required placeholder="Application URL" value={form.url} onChange={(e) => setForm({ ...form, url: e.target.value })} aria-label="Application URL" />
              <textarea className="input sm:col-span-2" rows={4} placeholder="Short description: team, tools, what success looks like" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} aria-label="Description" />
              <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.remote} onChange={(e) => setForm({ ...form, remote: e.target.checked })} className="accent-sky-400" /> Remote-friendly</label>
              <button className="btn btn-primary sm:justify-self-end">Publish role</button>
            </form>
          )}
          {msg && <p className={`mt-3 rounded-xl p-3 text-sm ${msg.ok ? 'bg-emerald-500/10 text-emerald-200' : 'bg-rose-500/10 text-rose-200'}`}>{msg.text}</p>}

          {mine.length > 0 && (
            <div className="mt-6">
              <h3 className="font-semibold">Your postings</h3>
              <ul className="mt-2 divide-y divide-white/5">
                {mine.map((m) => (
                  <li key={m.id} className="flex items-center justify-between gap-3 py-2 text-sm">
                    <span><b>{m.title}</b> · {m.location || (m.remote ? 'Remote' : '')} <span className={`chip ml-2 ${m.status === 'open' ? 'text-emerald-300' : ''}`}>{m.status}</span></span>
                    {m.status === 'open' && <button className="btn btn-ghost px-3 py-1 text-xs" onClick={() => close(m.id)}>Close</button>}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </section>

        <aside className="flex flex-col gap-6">
          <section className="glass rounded-3xl p-6">
            <h2 className="font-display text-lg font-bold">Verify a candidate</h2>
            <p className="text-sm text-ink-400">Enter the credential ID from their certificate.</p>
            <form className="mt-3 flex gap-2" onSubmit={(e) => { e.preventDefault(); if (certId.trim()) navigate(`/verify/${certId.trim()}`) }}>
              <input className="input font-mono" placeholder="DL-XXXX-XXXX" value={certId} onChange={(e) => setCertId(e.target.value.toUpperCase())} aria-label="Credential ID" />
              <button className="btn btn-primary">Check</button>
            </form>
          </section>
          <section className="glass rounded-3xl p-6">
            <h2 className="font-display text-lg font-bold">Top climbers</h2>
            <p className="text-sm text-ink-400">Learners who chose to be visible to employers.</p>
            {leaders.length ? (
              <ol className="mt-3 space-y-1.5">
                {leaders.map((l, i) => (
                  <li key={i} className="flex justify-between text-sm"><span>{['🥇', '🥈', '🥉'][i] ?? `${i + 1}.`} {l.display_name}</span><b className="text-gold">{l.xp.toLocaleString()} XP</b></li>
                ))}
              </ol>
            ) : <p className="mt-3 text-sm text-ink-400">No public profiles yet.</p>}
          </section>
          <Link to="/jobs" className="btn btn-ghost">See the full job board →</Link>
        </aside>
      </div>
    </div>
  )
}
