import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { allSteps } from '../content'
import { useProgress } from '../store/progress'
import { useAuth } from '../store/auth'
import { supabase } from '../lib/supabase'
import { inline } from '../components/Rich'
import Spinner from '../components/Spinner'

interface Q { id: string; q: string; options: string[] }
const N = 40
const PASS = 0.8

function shuffle<T>(a: T[]): T[] {
  const r = [...a]
  for (let i = r.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [r[i], r[j]] = [r[j], r[i]] }
  return r
}

/** Offline exam: random questions from every floor's quizzes, graded locally. */
function localExam() {
  const pool = allSteps.flatMap((s) => s.quiz.map((q, i) => ({ id: `${s.id}#${i}`, q: q.q, options: q.options, answer: q.answer })))
  return shuffle(pool).slice(0, N)
}

export default function Exam() {
  const session = useAuth((s) => s.session)
  const setExam = useProgress((s) => s.setExam)
  const allDone = useProgress((s) => allSteps.every((st) => s.completed[st.id]))
  const online = !!(supabase && session)
  const [qs, setQs] = useState<Q[] | null>(null)
  const [answers, setAnswers] = useState<Record<string, number>>({})
  const [local, setLocal] = useState<Record<string, number>>({})
  const [i, setI] = useState(0)
  const [result, setResult] = useState<{ score: number; total: number; passed: boolean } | null>(null)
  const [err, setErr] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (!allDone) return
    if (online) {
      supabase!.rpc('get_exam', { n: N }).then(({ data, error }) => {
        if (error) return setErr(error.message)
        setQs((data as { id: number; q: string; options: string[] }[]).map((d) => ({ id: String(d.id), q: d.q, options: d.options })))
      })
    } else {
      const ex = localExam()
      setLocal(Object.fromEntries(ex.map((q) => [q.id, q.answer])))
      setQs(ex)
    }
  }, [online, allDone])

  if (!allDone) return <div className="mx-auto max-w-xl py-20 text-center"><p className="text-5xl">🔒</p><h1 className="mt-3 font-display text-2xl font-bold">Finish all 10 floors first</h1><Link to="/" className="btn btn-primary mt-6">Back to the ladder</Link></div>
  if (err) return <p className="mx-auto max-w-xl rounded-xl bg-rose-500/10 p-4 text-rose-200" role="alert">{err}</p>
  if (!qs) return <Spinner label="Preparing your exam…" />

  const submit = async () => {
    setSubmitting(true)
    try {
      if (online) {
        const { data, error } = await supabase!.rpc('submit_exam', { answers })
        if (error) throw new Error(error.message)
        const r = data as { score: number; total: number; passed: boolean }
        setResult(r)
        setExam(Math.round((r.score / r.total) * 100), r.passed)
      } else {
        const score = qs.filter((q) => answers[q.id] === local[q.id]).length
        const passed = score / qs.length >= PASS
        setResult({ score, total: qs.length, passed })
        setExam(Math.round((score / qs.length) * 100), passed)
      }
    } catch (e) {
      setErr(e instanceof Error ? e.message : String(e))
    } finally {
      setSubmitting(false)
    }
  }

  if (result) {
    const pct = Math.round((result.score / result.total) * 100)
    return (
      <div className="glass mx-auto max-w-xl rounded-3xl p-8 text-center">
        <div className="text-6xl">{result.passed ? '🏆' : '📚'}</div>
        <h1 className="mt-3 font-display text-3xl font-bold">{result.passed ? 'You passed!' : 'Not quite yet'}</h1>
        <p className="mt-1 text-ink-200">{result.score} / {result.total} correct ({pct}%). Pass mark is 80%.</p>
        {!result.passed && <p className="mt-3 text-sm text-ink-400">Review the floors where you felt unsure (the Arcade is great for this), then try again.</p>}
        <Link to="/certificate" className="btn btn-primary mt-6">Back to certificate →</Link>
      </div>
    )
  }

  const q = qs[i]
  const answered = Object.keys(answers).length
  return (
    <div className="mx-auto max-w-3xl">
      <div className="flex items-center justify-between text-sm text-ink-400">
        <span>Final exam · {online ? 'server-graded' : 'offline mode'}</span>
        <span>{answered}/{qs.length} answered</span>
      </div>
      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-ink-700"><div className="h-full bg-gradient-to-r from-sky-400 to-violet-400" style={{ width: `${(answered / qs.length) * 100}%` }} /></div>
      <section className="glass mt-5 rounded-3xl p-6">
        <p className="text-xs text-ink-400">Question {i + 1} of {qs.length}</p>
        <h1 className="mt-1 font-display text-xl font-semibold">{inline(q.q)}</h1>
        <div className="mt-4 grid gap-2" role="radiogroup">
          {q.options.map((o, k) => (
            <button key={k} role="radio" aria-checked={answers[q.id] === k} onClick={() => setAnswers({ ...answers, [q.id]: k })}
              className={`rounded-xl border p-3 text-left transition ${answers[q.id] === k ? 'border-sky-400 bg-sky-500/15' : 'border-white/10 bg-white/[0.03] hover:border-white/30'}`}>
              <span className="mr-2 font-mono text-ink-400">{String.fromCharCode(65 + k)}</span>{inline(o)}
            </button>
          ))}
        </div>
        <div className="mt-5 flex justify-between">
          <button className="btn btn-ghost" disabled={i === 0} onClick={() => setI(i - 1)}>← Prev</button>
          {i + 1 < qs.length ? (
            <button className="btn btn-primary" onClick={() => setI(i + 1)}>Next →</button>
          ) : (
            <button className="btn btn-primary" disabled={submitting} onClick={() => { if (answered < qs.length && !confirm(`${qs.length - answered} questions unanswered. Submit anyway?`)) return; submit() }}>
              {submitting ? 'Grading…' : 'Submit exam'}
            </button>
          )}
        </div>
      </section>
      <div className="mt-4 flex flex-wrap gap-1.5" aria-label="Jump to question">
        {qs.map((x, k) => (
          <button key={x.id} onClick={() => setI(k)} className={`h-7 w-7 rounded-md text-xs ${k === i ? 'bg-sky-500 text-white' : answers[x.id] !== undefined ? 'bg-emerald-500/30' : 'bg-white/10'}`}>{k + 1}</button>
        ))}
      </div>
    </div>
  )
}
