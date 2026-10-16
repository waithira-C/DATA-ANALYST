import { useMemo, useState } from 'react'
import type { GameProps } from './meta'
import { GameFrame, Feedback, StageClear, scoreFrom } from './GameFrame'
import { FORMULA_STAGES } from './sheet/stages'
import { evaluate, sameValue, display, makeRef, splitRef, type Sheet } from './sheet/formula'
import { inline } from '../components/Rich'

export default function FormulaForge({ stage, onComplete }: GameProps) {
  const data = FORMULA_STAGES[stage] ?? FORMULA_STAGES[0]
  const [idx, setIdx] = useState(0)
  const [formula, setFormula] = useState('=')
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [verdict, setVerdict] = useState<{ ok: boolean; msg: string } | null>(null)
  const [showHint, setShowHint] = useState(false)
  const [pen, setPen] = useState({ hints: 0, reveals: 0, misses: 0 })
  const [done, setDone] = useState(false)
  const ch = data.challenges[idx]

  const sheet: Sheet = useMemo(() => {
    const s: Sheet = {}
    data.grid.forEach((row, r) => row.forEach((v, c) => { if (v !== '' && v !== null) s[makeRef(c + 1, r + 1)] = v }))
    return s
  }, [data])

  // Visible grid size: data plus room for target cells.
  const { cols, rows } = useMemo(() => {
    let c = data.grid[0].length + 1
    let r = data.grid.length + 1
    for (const x of data.challenges) { const p = splitRef(x.target); c = Math.max(c, p.c); r = Math.max(r, p.r) }
    return { cols: c, rows: r }
  }, [data])

  const live = formula.trim().length > 1 ? evaluate(formula, sheet) : null

  const check = () => {
    const mine = evaluate(formula, sheet)
    if (!formula.trim().startsWith('=')) return setVerdict({ ok: false, msg: 'Formulas start with "=".' })
    if (mine.error) { setPen((p) => ({ ...p, misses: p.misses + 1 })); return setVerdict({ ok: false, msg: `The formula returned an error: ${mine.error}` }) }
    const expected = evaluate(ch.solution, sheet).value
    if (!sameValue(mine.value, expected)) {
      setPen((p) => ({ ...p, misses: p.misses + 1 }))
      return setVerdict({ ok: false, msg: `Your formula gives ${display(mine.value) || '(blank)'}, which isn't the right value yet.` })
    }
    if (ch.mustUse && !ch.mustUse.some((f) => mine.used.has(f))) {
      return setVerdict({ ok: false, msg: `Right value! Now do it with ${ch.mustUse.join(' or ')}. That's the skill being practiced.` })
    }
    setAnswers((a) => ({ ...a, [ch.target]: display(mine.value) }))
    setVerdict({ ok: true, msg: `✅ ${ch.target} = ${display(mine.value)}` })
  }

  const next = () => {
    if (idx + 1 >= data.challenges.length) return setDone(true)
    setIdx(idx + 1); setFormula('='); setVerdict(null); setShowHint(false)
  }

  if (done) return <StageClear score={scoreFrom(pen)} onContinue={() => onComplete(scoreFrom(pen))} />

  const colLetters = Array.from({ length: cols }, (_, i) => makeRef(i + 1, 1).replace(/\d+/, ''))

  return (
    <GameFrame icon="⚒️" title="Formula Forge" subtitle={data.story} index={idx} total={data.challenges.length}>
      <p className="rounded-xl bg-emerald-500/10 p-3 text-sm text-emerald-100">
        <span className="font-semibold">Cell {ch.target}:</span> {inline(ch.prompt)}
      </p>

      <div className="mt-3 overflow-x-auto rounded-xl border border-white/10">
        <table className="w-full border-collapse font-mono text-xs">
          <thead>
            <tr className="bg-ink-800 text-ink-400">
              <th className="w-8 border border-white/5" />
              {colLetters.map((l) => <th key={l} className="border border-white/5 px-2 py-1 font-normal">{l}</th>)}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: rows }, (_, r) => (
              <tr key={r}>
                <td className="border border-white/5 bg-ink-800 px-1 text-center text-ink-400">{r + 1}</td>
                {colLetters.map((_l, c) => {
                  const ref = makeRef(c + 1, r + 1)
                  const isTarget = ref === ch.target
                  const val = answers[ref] ?? (isTarget && live && !live.error ? display(live.value) : display(sheet[ref] ?? null))
                  return (
                    <td
                      key={ref}
                      className={`whitespace-nowrap border border-white/5 px-2 py-1.5 ${r === 0 ? 'font-semibold text-sky-300' : ''} ${
                        isTarget ? 'bg-emerald-500/20 outline outline-2 -outline-offset-2 outline-emerald-400' : answers[ref] ? 'bg-emerald-500/10 text-emerald-200' : ''
                      }`}
                    >
                      {isTarget && !val ? '?' : typeof sheet[ref] === 'string' && /^\s|\s{2}/.test(sheet[ref] as string) ? <span className="whitespace-pre">{val}</span> : val}
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-3 flex items-center gap-2">
        <span className="rounded-lg bg-ink-700 px-2 py-2 font-mono text-xs text-ink-200">{ch.target}</span>
        <span className="font-mono text-ink-400">fx</span>
        <label htmlFor="fx" className="sr-only">Formula</label>
        <input
          id="fx"
          className="input font-mono"
          value={formula}
          onChange={(e) => { setFormula(e.target.value); setVerdict(null) }}
          onKeyDown={(e) => e.key === 'Enter' && (verdict?.ok ? next() : check())}
          spellCheck={false}
          autoComplete="off"
          autoFocus
        />
      </div>
      {live?.error && formula.length > 2 && <p className="mt-1 text-xs text-rose-300">{live.error}</p>}
      <div className="mt-3 flex flex-wrap gap-2">
        {verdict?.ok ? (
          <button className="btn btn-primary" onClick={next} autoFocus>Next cell →</button>
        ) : (
          <>
            <button className="btn btn-primary" onClick={check}>Check ⏎</button>
            <button className="btn btn-ghost" onClick={() => { if (!showHint) setPen((p) => ({ ...p, hints: p.hints + 1 })); setShowHint(true) }}>💡 Hint</button>
            <button className="btn btn-ghost" onClick={() => { setPen((p) => ({ ...p, reveals: p.reveals + 1 })); setFormula(ch.solution) }}>Show answer</button>
          </>
        )}
      </div>
      {showHint && !verdict?.ok && <p className="mt-2 text-sm text-amber-200">💡 {inline(ch.hint)}</p>}
      {verdict && <Feedback ok={verdict.ok}>{verdict.msg}</Feedback>}
    </GameFrame>
  )
}
