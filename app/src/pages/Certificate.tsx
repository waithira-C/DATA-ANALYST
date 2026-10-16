import { useState } from 'react'
import { Link } from 'react-router-dom'
import { floors, allSteps } from '../content'
import { useProgress } from '../store/progress'
import { useAuth } from '../store/auth'
import { supabase, hasBackend } from '../lib/supabase'
import { certificatePdf, download, verifyUrl } from '../lib/certificate'

function Req({ ok, title, children }: { ok: boolean; title: string; children?: React.ReactNode }) {
  return (
    <li className={`glass rounded-2xl p-4 ${ok ? 'ring-1 ring-emerald-500/40' : ''}`}>
      <div className="flex items-center gap-3">
        <span className={`grid h-8 w-8 place-items-center rounded-full text-sm font-bold ${ok ? 'bg-emerald-500/20 text-emerald-300' : 'bg-white/10 text-ink-400'}`}>{ok ? '✓' : '•'}</span>
        <h2 className="font-display text-lg font-semibold">{title}</h2>
      </div>
      {children && <div className="mt-3 pl-11">{children}</div>}
    </li>
  )
}

export default function CertificatePage() {
  const p = useProgress()
  const session = useAuth((s) => s.session)
  const [form, setForm] = useState({ title: p.capstone?.title ?? '', repoUrl: p.capstone?.repoUrl ?? '', dashboardUrl: p.capstone?.dashboardUrl ?? '', summary: p.capstone?.summary ?? '' })
  const [fullName, setFullName] = useState(p.certificate?.fullName ?? p.displayName)
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState<string | null>(null)

  const stepsDone = allSteps.filter((s) => p.completed[s.id]).length
  const ladderDone = stepsDone === allSteps.length
  const canIssue = ladderDone && p.examPassed && p.capstoneSubmitted

  const submitCapstone = async (e: React.FormEvent) => {
    e.preventDefault()
    setErr(null)
    if (!/^https?:\/\/\S+\.\S+/.test(form.repoUrl)) return setErr('Please enter a valid public URL for your project (GitHub, Kaggle, Tableau Public…).')
    if (form.summary.trim().length < 80) return setErr('Write at least a few sentences (80+ characters) about the question, data, method and findings.')
    if (supabase && session) {
      const { error } = await supabase.from('capstones').upsert({
        user_id: session.user.id, title: form.title, repo_url: form.repoUrl, dashboard_url: form.dashboardUrl || null, summary: form.summary, submitted_at: new Date().toISOString(),
      })
      if (error) return setErr(error.message)
    }
    p.setCapstone({ ...form, submittedAt: new Date().toISOString() })
  }

  const issue = async () => {
    setErr(null)
    if (fullName.trim().length < 3) return setErr('Enter your full name as it should appear on the certificate.')
    setBusy(true)
    try {
      if (supabase && session) {
        const { data, error } = await supabase.rpc('issue_certificate', { full_name: fullName.trim() })
        if (error) throw new Error(error.message)
        p.setCertificate({ id: data.id, fullName: data.full_name, issuedAt: data.issued_at, examScore: data.exam_score, capstoneUrl: data.capstone_url })
      } else {
        const rand = Array.from(crypto.getRandomValues(new Uint8Array(4)), (b) => b.toString(36).padStart(2, '0')).join('').toUpperCase().slice(0, 8)
        p.setCertificate({ id: `LOCAL-${rand}`, fullName: fullName.trim(), issuedAt: new Date().toISOString(), examScore: p.examScore ?? 0, capstoneUrl: p.capstone?.repoUrl ?? '', local: true })
      }
    } catch (e) {
      setErr(e instanceof Error ? e.message : String(e))
    } finally {
      setBusy(false)
    }
  }

  const cert = p.certificate

  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="font-display text-3xl font-bold">Your <span className="glow-text">Certificate</span></h1>
      <p className="text-ink-400">Earn a DataLadder Data Analyst certificate with a public verification link and QR code that employers can check, backed by a real portfolio project.</p>

      {cert ? (
        <section className="glass mt-6 rounded-3xl p-6 text-center">
          <div className="text-6xl">🎓</div>
          <h2 className="mt-2 font-display text-2xl font-bold">Congratulations, {cert.fullName}!</h2>
          <p className="text-ink-400">Credential ID <b className="font-mono text-white">{cert.id}</b> · issued {new Date(cert.issuedAt).toLocaleDateString()}</p>
          <div className="mt-5 flex flex-wrap justify-center gap-3">
            <button className="btn btn-primary" onClick={async () => download(await certificatePdf(cert), `DataLadder-Certificate-${cert.id}.pdf`)}>⬇ Download PDF</button>
            {!cert.local && <a className="btn btn-ghost" href={verifyUrl(cert.id)} target="_blank" rel="noopener">🔗 Public verification page</a>}
            {!cert.local && (
              <a className="btn btn-ghost" target="_blank" rel="noopener" href={`https://www.linkedin.com/profile/add?startTask=CERTIFICATION_NAME&name=${encodeURIComponent('Data Analyst Career Path')}&organizationName=DataLadder&issueYear=${new Date(cert.issuedAt).getFullYear()}&issueMonth=${new Date(cert.issuedAt).getMonth() + 1}&certUrl=${encodeURIComponent(verifyUrl(cert.id))}&certId=${encodeURIComponent(cert.id)}`}>
                in Add to LinkedIn
              </a>
            )}
          </div>
          {cert.local && <p className="mt-4 text-sm text-amber-200">This certificate was issued in offline mode and can't be verified online. Sign in on a deployment with accounts enabled to get a verifiable credential.</p>}
          <Link to="/jobs" className="mt-6 inline-block text-sky-300 underline">Now go get that job →</Link>
        </section>
      ) : (
        <ol className="mt-6 space-y-3">
          <Req ok={ladderDone} title={`Climb all 10 floors (${stepsDone}/${allSteps.length} steps)`}>
            <div className="grid grid-cols-5 gap-1.5 sm:grid-cols-10">
              {floors.map((f) => (
                <Link key={f.id} to={`/floor/${f.id}`} title={f.title} className={`grid h-10 place-items-center rounded-lg text-lg ${p.floorsComplete.includes(f.id) ? 'bg-emerald-500/20' : 'bg-white/5 grayscale'}`}>{f.icon}</Link>
              ))}
            </div>
          </Req>
          <Req ok={p.examPassed} title={`Pass the final exam (80%+)${p.examScore !== null ? `: best ${p.examScore}%` : ''}`}>
            {!p.examPassed && (
              <>
                <p className="text-sm text-ink-400">40 mixed questions across every floor. {hasBackend ? 'Graded on the server; up to 3 attempts per 24 hours.' : 'Offline mode: drawn from the lesson quizzes.'}</p>
                <Link to="/exam" className={`btn mt-3 ${ladderDone ? 'btn-primary' : 'btn-ghost pointer-events-none opacity-50'}`} aria-disabled={!ladderDone}>{ladderDone ? 'Start the exam →' : 'Unlocks after Floor 10'}</Link>
              </>
            )}
          </Req>
          <Req ok={p.capstoneSubmitted} title="Ship your capstone project">
            <form onSubmit={submitCapstone} className="grid gap-3">
              <p className="text-sm text-ink-400">An end-to-end analysis on a real dataset: question → cleaning → analysis (SQL/Python) → dashboard → recommendations. Floor 10 walks you through it.</p>
              <input className="input" required placeholder="Project title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} aria-label="Project title" />
              <input className="input" required placeholder="Public repo / notebook URL (GitHub, Kaggle…)" value={form.repoUrl} onChange={(e) => setForm({ ...form, repoUrl: e.target.value })} aria-label="Repository URL" />
              <input className="input" placeholder="Dashboard URL (Tableau Public, Power BI, Looker Studio), optional" value={form.dashboardUrl} onChange={(e) => setForm({ ...form, dashboardUrl: e.target.value })} aria-label="Dashboard URL" />
              <textarea className="input" rows={4} placeholder="Summary: business question, data source, methods, key findings and recommendation" value={form.summary} onChange={(e) => setForm({ ...form, summary: e.target.value })} aria-label="Summary" />
              <button className="btn btn-primary justify-self-start">{p.capstoneSubmitted ? 'Update capstone' : 'Submit capstone'}</button>
            </form>
          </Req>
          <Req ok={false} title="Claim your certificate">
            <label htmlFor="fn" className="text-sm text-ink-400">Full name as it should appear</label>
            <div className="mt-1 flex flex-col gap-2 sm:flex-row">
              <input id="fn" className="input" value={fullName} onChange={(e) => setFullName(e.target.value)} />
              <button className="btn btn-primary shrink-0" disabled={!canIssue || busy} onClick={issue}>{busy ? 'Issuing…' : '🎓 Issue certificate'}</button>
            </div>
            {hasBackend && !session && <p className="mt-2 text-sm text-amber-200"><Link to="/auth" className="underline">Sign in</Link> to receive a verifiable certificate.</p>}
          </Req>
        </ol>
      )}
      {err && <p className="mt-4 rounded-xl bg-rose-500/10 p-3 text-sm text-rose-200" role="alert">{err}</p>}
      <p className="mt-8 text-xs text-ink-400">DataLadder certificates show completed training and a reviewed portfolio project. They are not accredited academic qualifications. Pair yours with your capstone link when applying.</p>
    </div>
  )
}
