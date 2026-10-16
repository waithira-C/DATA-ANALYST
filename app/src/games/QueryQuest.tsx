import { useEffect, useRef, useState } from 'react'
import type { Database } from 'sql.js'
import type { GameProps } from './meta'
import { GameFrame, Feedback, StageClear, scoreFrom } from './GameFrame'
import { SQL_STAGES } from './sql/stages'
import { SCHEMA } from './sql/dataset'
import { getDb, runQuery, sameResult, type QueryResult } from './sql/engine'
import { inline } from '../components/Rich'
import Spinner from '../components/Spinner'

function ResultTable({ r }: { r: QueryResult }) {
  if (!r.columns.length) return <p className="text-sm text-ink-400">Query ran but returned no rows.</p>
  return (
    <div className="max-h-72 overflow-auto rounded-xl border border-white/10">
      <table className="w-full text-left font-mono text-xs">
        <thead className="sticky top-0 bg-ink-800">
          <tr>{r.columns.map((c, i) => <th key={i} className="px-3 py-2 font-semibold text-sky-300">{c}</th>)}</tr>
        </thead>
        <tbody>
          {r.rows.slice(0, 200).map((row, i) => (
            <tr key={i} className="border-t border-white/5 odd:bg-white/[0.02]">
              {row.map((v, j) => <td key={j} className="whitespace-nowrap px-3 py-1.5">{v === null ? <span className="text-ink-400">NULL</span> : String(v)}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
      <p className="border-t border-white/5 px-3 py-1 text-[11px] text-ink-400">{r.rows.length} row{r.rows.length === 1 ? '' : 's'}</p>
    </div>
  )
}

export default function QueryQuest({ stage, onComplete }: GameProps) {
  const data = SQL_STAGES[stage] ?? SQL_STAGES[0]
  const [db, setDb] = useState<Database | null>(null)
  const [loadErr, setLoadErr] = useState<string | null>(null)
  const [idx, setIdx] = useState(0)
  const [sql, setSql] = useState('')
  const [result, setResult] = useState<QueryResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [verdict, setVerdict] = useState<{ ok: boolean; reason?: string } | null>(null)
  const [showHint, setShowHint] = useState(false)
  const [pen, setPen] = useState({ hints: 0, reveals: 0, misses: 0 })
  const [done, setDone] = useState(false)
  const ta = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    getDb().then(setDb).catch((e) => setLoadErr(String(e)))
  }, [])

  const ch = data.challenges[idx]

  const run = () => {
    if (!db || !sql.trim()) return
    setVerdict(null)
    try {
      const mine = runQuery(db, sql)
      setResult(mine)
      setError(null)
      const expected = runQuery(db, ch.solution)
      const v = sameResult(mine, expected, !!ch.ordered)
      setVerdict(v)
      if (!v.ok) setPen((p) => ({ ...p, misses: p.misses + 1 }))
    } catch (e) {
      setResult(null)
      setError(e instanceof Error ? e.message : String(e))
      setPen((p) => ({ ...p, misses: p.misses + 1 }))
    }
  }

  const next = () => {
    if (idx + 1 >= data.challenges.length) return setDone(true)
    setIdx(idx + 1)
    setSql('')
    setResult(null)
    setVerdict(null)
    setError(null)
    setShowHint(false)
    ta.current?.focus()
  }

  if (loadErr) return <Feedback ok={false}>Could not start the SQL engine: {loadErr}</Feedback>
  if (!db) return <Spinner label="Booting the SQL engine…" />
  if (done) return <StageClear score={scoreFrom(pen)} onContinue={() => onComplete(scoreFrom(pen))} />

  return (
    <GameFrame icon="🕵️" title="Query Quest" subtitle={data.story} index={idx} total={data.challenges.length}>
      <div className="grid gap-4 lg:grid-cols-[1fr_220px]">
        <div className="min-w-0">
          <p className="rounded-xl bg-sky-500/10 p-3 text-sm text-sky-100">
            <span className="font-semibold">Case {idx + 1}:</span> {inline(ch.prompt)}
          </p>
          <label htmlFor="sql" className="sr-only">SQL query</label>
          <textarea
            id="sql"
            ref={ta}
            value={sql}
            onChange={(e) => setSql(e.target.value)}
            onKeyDown={(e) => {
              if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') { e.preventDefault(); run() }
            }}
            spellCheck={false}
            rows={5}
            placeholder="SELECT ..."
            className="input mt-3 font-mono text-sm leading-relaxed"
            autoFocus
          />
          <div className="mt-2 flex flex-wrap gap-2">
            <button className="btn btn-primary" onClick={run} disabled={!sql.trim()}>▶ Run <span className="hidden text-xs opacity-70 sm:inline">(Ctrl+Enter)</span></button>
            {verdict?.ok ? (
              <button className="btn btn-primary" onClick={next} autoFocus>Next case →</button>
            ) : (
              <>
                <button className="btn btn-ghost" onClick={() => { if (!showHint) setPen((p) => ({ ...p, hints: p.hints + 1 })); setShowHint(true) }}>💡 Hint</button>
                <button className="btn btn-ghost" onClick={() => { setPen((p) => ({ ...p, reveals: p.reveals + 1 })); setSql(ch.solution) }}>Show answer</button>
              </>
            )}
          </div>
          {showHint && !verdict?.ok && <p className="mt-2 text-sm text-amber-200">💡 {inline(ch.hint)}</p>}
          {error && <Feedback ok={false}>⚠️ {error}</Feedback>}
          {verdict && <Feedback ok={verdict.ok}>{verdict.ok ? '✅ Case solved! Your result matches.' : `❌ ${verdict.reason}`}</Feedback>}
          {result && <div className="mt-3"><ResultTable r={result} /></div>}
        </div>
        <aside className="rounded-2xl bg-ink-900/60 p-3 text-xs">
          <p className="mb-2 font-semibold text-ink-200">📋 Schema</p>
          {SCHEMA.map((t) => (
            <div key={t.table} className="mb-2">
              <button className="font-mono font-semibold text-sky-300 hover:underline" onClick={() => setSql(`SELECT * FROM ${t.table} LIMIT 10`)} title="Preview table">
                {t.table}
              </button>
              <p className="font-mono text-ink-400">{t.cols.join(', ')}</p>
            </div>
          ))}
          <p className="mt-2 text-ink-400">Tip: click a table name to preview it.</p>
        </aside>
      </div>
    </GameFrame>
  )
}
