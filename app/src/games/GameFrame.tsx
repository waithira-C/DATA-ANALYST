import type { ReactNode } from 'react'
import { motion } from 'framer-motion'

export function GameFrame({ icon, title, subtitle, index, total, children }: {
  icon: string
  title: string
  subtitle?: string
  index: number
  total: number
  children: ReactNode
}) {
  return (
    <section className="glass rounded-3xl p-4 sm:p-6" aria-label={title}>
      <header className="mb-4 flex flex-wrap items-center gap-3">
        <span className="text-3xl" aria-hidden>{icon}</span>
        <div className="min-w-0 flex-1">
          <h2 className="font-display text-xl font-bold">{title}</h2>
          {subtitle && <p className="text-sm text-ink-400">{subtitle}</p>}
        </div>
        <div className="flex gap-1.5" aria-label={`Challenge ${Math.min(index + 1, total)} of ${total}`}>
          {Array.from({ length: total }, (_, i) => (
            <span key={i} className={`h-2.5 w-6 rounded-full ${i < index ? 'bg-emerald-400' : i === index ? 'bg-sky-400' : 'bg-ink-600'}`} />
          ))}
        </div>
      </header>
      {children}
    </section>
  )
}

export function Feedback({ ok, children }: { ok: boolean; children: ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      role="status"
      className={`mt-3 rounded-xl border p-3 text-sm ${ok ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-200' : 'border-rose-500/40 bg-rose-500/10 text-rose-200'}`}
    >
      {children}
    </motion.div>
  )
}

export function StageClear({ score, onContinue, label = 'Continue' }: { score: number; onContinue: () => void; label?: string }) {
  return (
    <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="py-10 text-center">
      <div className="text-6xl">{score >= 90 ? '🏆' : score >= 70 ? '🥈' : '✅'}</div>
      <h3 className="mt-3 font-display text-2xl font-bold">Stage cleared!</h3>
      <p className="text-ink-400">Game score: <span className="font-bold text-white">{score}</span>/100</p>
      <button className="btn btn-primary mt-6" onClick={onContinue} autoFocus>{label} →</button>
    </motion.div>
  )
}

/** Score after penalties: hints cost 10, reveals cost 25, wrong tries cost 3, floor 40. */
export function scoreFrom(penalties: { hints: number; reveals: number; misses: number }) {
  return Math.max(40, 100 - penalties.hints * 10 - penalties.reveals * 25 - penalties.misses * 3)
}
