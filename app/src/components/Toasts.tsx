import { AnimatePresence, motion } from 'framer-motion'
import { useEffect } from 'react'
import confetti from 'canvas-confetti'
import { useUi } from '../store/ui'

export default function Toasts() {
  const toasts = useUi((s) => s.toasts)
  const dismiss = useUi((s) => s.dismiss)

  const big = toasts.filter((t) => t.kind === 'badge' || t.kind === 'floor').length
  useEffect(() => {
    if (!big || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    confetti({ particleCount: 90, spread: 70, origin: { y: 0.25 }, colors: ['#38bdf8', '#a78bfa', '#f59e0b', '#22c55e'] })
  }, [big])

  return (
    <div className="pointer-events-none fixed inset-x-0 top-16 z-50 flex flex-col items-center gap-2 px-4" aria-live="polite">
      <AnimatePresence>
        {toasts.map((t) => (
          <motion.button
            key={t.id}
            layout
            initial={{ opacity: 0, y: -20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            onClick={() => dismiss(t.id)}
            className={`glass pointer-events-auto flex w-full max-w-sm items-center gap-3 rounded-2xl px-4 py-3 text-left shadow-2xl ${
              t.kind === 'badge' || t.kind === 'floor' ? 'ring-1 ring-gold/60' : ''
            }`}
          >
            <span className="text-2xl" aria-hidden>{t.icon ?? (t.kind === 'xp' ? '⚡' : '✨')}</span>
            <span className="min-w-0 flex-1">
              <span className="block text-xs uppercase tracking-wider text-ink-400">
                {t.kind === 'badge' ? 'Achievement unlocked' : t.kind === 'floor' ? 'Floor complete' : t.kind === 'xp' ? 'Bonus' : 'Notice'}
              </span>
              <span className="block font-display font-semibold text-white">{t.title}</span>
              {t.body && <span className="block truncate text-sm text-ink-200">{t.body}</span>}
            </span>
            {!!t.xp && <span className="font-display font-bold text-gold">+{t.xp} XP</span>}
          </motion.button>
        ))}
      </AnimatePresence>
    </div>
  )
}
