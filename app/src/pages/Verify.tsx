import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import Spinner from '../components/Spinner'

interface Cert { id: string; full_name: string; issued_at: string; exam_score: number; capstone_url: string | null }

export default function Verify() {
  const { id = '' } = useParams()
  const [state, setState] = useState<'loading' | 'ok' | 'missing' | 'offline'>('loading')
  const [cert, setCert] = useState<Cert | null>(null)

  useEffect(() => {
    if (!supabase) return setState('offline')
    supabase.from('certificates').select('id,full_name,issued_at,exam_score,capstone_url').eq('id', id).eq('revoked', false).maybeSingle()
      .then(({ data }) => { if (data) { setCert(data as Cert); setState('ok') } else setState('missing') })
  }, [id])

  return (
    <div className="grid min-h-screen place-items-center p-4">
      <div className="glass w-full max-w-lg rounded-3xl p-8 text-center">
        <Link to="/" className="inline-flex items-center gap-2 font-display font-bold"><img src="/favicon.svg" alt="" className="h-7 w-7" /> DataLadder</Link>
        <p className="mt-1 text-xs uppercase tracking-[0.2em] text-ink-400">Credential verification</p>
        {state === 'loading' && <Spinner label="Checking credential…" />}
        {state === 'ok' && cert && (
          <>
            <div className="mt-6 text-6xl">✅</div>
            <h1 className="mt-3 font-display text-2xl font-bold">Verified certificate</h1>
            <p className="mt-4 text-ink-400">Awarded to</p>
            <p className="font-display text-3xl font-bold">{cert.full_name}</p>
            <dl className="mt-6 grid grid-cols-2 gap-3 text-left text-sm">
              <div className="rounded-xl bg-white/5 p-3"><dt className="text-ink-400">Program</dt><dd className="font-semibold">Data Analyst Career Path</dd></div>
              <div className="rounded-xl bg-white/5 p-3"><dt className="text-ink-400">Issued</dt><dd className="font-semibold">{new Date(cert.issued_at).toLocaleDateString()}</dd></div>
              <div className="rounded-xl bg-white/5 p-3"><dt className="text-ink-400">Final exam</dt><dd className="font-semibold">{cert.exam_score}%</dd></div>
              <div className="rounded-xl bg-white/5 p-3"><dt className="text-ink-400">Credential ID</dt><dd className="font-mono font-semibold">{cert.id}</dd></div>
            </dl>
            {cert.capstone_url && <a href={cert.capstone_url} target="_blank" rel="noopener nofollow" className="btn btn-primary mt-6">View capstone project ↗</a>}
            <p className="mt-6 text-xs text-ink-400">Holders completed 10 floors of training (spreadsheets, statistics, SQL, BI, Python, business analytics), passed a server-graded exam at 80%+, and submitted a public portfolio project. This isn't an accredited academic qualification.</p>
          </>
        )}
        {state === 'missing' && (
          <>
            <div className="mt-6 text-6xl">❌</div>
            <h1 className="mt-3 font-display text-2xl font-bold">No valid certificate found</h1>
            <p className="mt-2 text-ink-400">ID <span className="font-mono">{id}</span> doesn't match an active DataLadder credential.</p>
          </>
        )}
        {state === 'offline' && <p className="mt-6 text-ink-400">Verification needs the online service, which isn't configured on this deployment.</p>}
      </div>
    </div>
  )
}
