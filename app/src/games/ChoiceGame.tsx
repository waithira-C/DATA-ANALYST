import { useState, type ReactNode } from 'react'
import { motion } from 'framer-motion'
import { GameFrame, StageClear } from './GameFrame'
import { inline } from '../components/Rich'

export interface ChoiceOption { text: string; points: number; feedback: string }
export interface ChoiceRound {
  /** Visual / context shown above the question (table row, chart, chat bubble…). */
  visual?: ReactNode
  question: string
  options: ChoiceOption[]
}

/**
 * Shared engine for scenario-style games: pick an option, see why, move on.
 * Each round's best option scores 10; partial-credit options score less.
 */
export default function ChoiceGame({ icon, title, story, rounds, onComplete, accent = 'sky' }: {
  icon: string
  title: string
  story: string
  rounds: ChoiceRound[]
  onComplete: (score: number) => void
  accent?: 'sky' | 'violet' | 'amber'
}) {
  const [idx, setIdx] = useState(0)
  const [picked, setPicked] = useState<number | null>(null)
  const [earned, setEarned] = useState(0)
  const [combo, setCombo] = useState(0)
  const [done, setDone] = useState(false)
  const round = rounds[idx]
  const max = rounds.reduce((n, r) => n + Math.max(...r.options.map((o) => o.points)), 0)
  const score = Math.round((earned / max) * 100)

  if (done) return <StageClear score={score} onContinue={() => onComplete(score)} />

  const pick = (i: number) => {
    if (picked !== null) return
    setPicked(i)
    const pts = round.options[i].points
    setEarned((e) => e + pts)
    setCombo((c) => (pts >= 10 ? c + 1 : 0))
  }
  const next = () => {
    if (idx + 1 >= rounds.length) return setDone(true)
    setIdx(idx + 1)
    setPicked(null)
  }
  const best = Math.max(...round.options.map((o) => o.points))
  const ring = { sky: 'bg-sky-500/10 text-sky-100', violet: 'bg-violet-500/10 text-violet-100', amber: 'bg-amber-500/10 text-amber-100' }[accent]

  return (
    <GameFrame icon={icon} title={title} subtitle={story} index={idx} total={rounds.length}>
      {combo >= 2 && <p className="mb-2 text-right text-xs font-bold text-gold">🔥 Combo ×{combo}</p>}
        <motion.div key={idx} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
          {round.visual && <div className="mb-3">{round.visual}</div>}
          <p className={`rounded-xl p-3 font-medium ${ring}`}>{inline(round.question)}</p>
          <div className="mt-3 grid gap-2" role="group" aria-label="Choices">
            {round.options.map((o, i) => {
              const chosen = picked === i
              const isBest = o.points === best
              const state = picked === null ? 'idle' : chosen ? (isBest ? 'good' : o.points > 0 ? 'meh' : 'bad') : isBest ? 'reveal' : 'dim'
              return (
                <button
                  key={i}
                  onClick={() => pick(i)}
                  disabled={picked !== null}
                  className={`rounded-xl border p-3 text-left text-sm transition ${
                    state === 'idle' ? 'border-white/10 bg-white/[0.03] hover:border-white/30 hover:bg-white/[0.07]'
                    : state === 'good' ? 'border-emerald-400 bg-emerald-500/15'
                    : state === 'meh' ? 'border-amber-400 bg-amber-500/15'
                    : state === 'bad' ? 'border-rose-400 bg-rose-500/15'
                    : state === 'reveal' ? 'border-emerald-400/50 bg-emerald-500/5'
                    : 'border-white/5 opacity-50'
                  }`}
                >
                  <span className="mr-2 font-mono text-ink-400">{String.fromCharCode(65 + i)}</span>
                  {inline(o.text)}
                  {picked !== null && (chosen || isBest) && (
                    <span className="mt-1.5 block text-xs text-ink-200">{chosen ? (isBest ? '✅ ' : o.points > 0 ? '🟡 ' : '❌ ') : '✅ Best answer: '}{inline(o.feedback)}</span>
                  )}
                </button>
              )
            })}
          </div>
          {picked !== null && (
            <div className="mt-4 flex justify-end">
              <button className="btn btn-primary" onClick={next} autoFocus>{idx + 1 >= rounds.length ? 'Finish' : 'Next'} →</button>
            </div>
          )}
        </motion.div>
    </GameFrame>
  )
}
