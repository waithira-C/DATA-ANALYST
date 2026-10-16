import { lazy, Suspense, useState } from 'react'
import { BADGES, TIER_COLORS } from '../engine/achievements'
import { useProgress } from '../store/progress'
import { levelProgress, titleForLevel } from '../engine/xp'
import Spinner from '../components/Spinner'

const Medal3D = lazy(() => import('../components/Medal3D'))

export default function Achievements() {
  const owned = useProgress((s) => s.badges)
  const xp = useProgress((s) => s.xp)
  const log = useProgress((s) => s.xpLog)
  const [sel, setSel] = useState(BADGES.find((b) => owned[b.id])?.id ?? BADGES[0].id)
  const badge = BADGES.find((b) => b.id === sel)!
  const earned = BADGES.filter((b) => owned[b.id]).length
  const { level } = levelProgress(xp)

  return (
    <div>
      <h1 className="font-display text-3xl font-bold">Achievements</h1>
      <p className="text-ink-400">{earned} of {BADGES.length} badges unlocked · Level {level} {titleForLevel(level)}</p>

      <div className="mt-5 grid gap-6 lg:grid-cols-[360px_1fr]">
        <aside className="glass flex flex-col items-center rounded-3xl p-5 lg:sticky lg:top-20 lg:self-start">
          <div className="h-64 w-full">
            <Suspense fallback={<Spinner />}>
              <Medal3D icon={badge.icon} color={TIER_COLORS[badge.tier]} locked={!owned[badge.id]} />
            </Suspense>
          </div>
          <p className="text-xs uppercase tracking-wider" style={{ color: TIER_COLORS[badge.tier] }}>{badge.tier}</p>
          <h2 className="font-display text-2xl font-bold">{badge.name}</h2>
          <p className="text-center text-ink-200">{badge.description}</p>
          <p className="mt-2 text-sm text-ink-400">
            {owned[badge.id] ? `Earned ${new Date(owned[badge.id]).toLocaleDateString()}` : 'Locked'}{badge.xp ? ` · +${badge.xp} XP` : ''}
          </p>
        </aside>

        <div>
          <ul className="grid grid-cols-3 gap-3 sm:grid-cols-4 xl:grid-cols-6">
            {BADGES.map((b) => {
              const has = !!owned[b.id]
              return (
                <li key={b.id}>
                  <button
                    onClick={() => setSel(b.id)}
                    aria-pressed={sel === b.id}
                    className={`flex w-full flex-col items-center rounded-2xl border p-3 text-center transition ${sel === b.id ? 'border-white/40 bg-white/10' : 'border-white/10 hover:bg-white/5'}`}
                  >
                    <span
                      className={`grid h-14 w-14 place-items-center rounded-full text-2xl ${has ? '' : 'grayscale opacity-40'}`}
                      style={{ background: has ? `radial-gradient(circle at 35% 30%, #fff8, ${TIER_COLORS[b.tier]} 45%, #0005)` : '#ffffff10' }}
                    >
                      {has ? b.icon : '🔒'}
                    </span>
                    <span className={`mt-1.5 text-xs font-semibold ${has ? 'text-white' : 'text-ink-400'}`}>{b.name}</span>
                  </button>
                </li>
              )
            })}
          </ul>

          <section className="glass mt-6 rounded-3xl p-5">
            <h2 className="font-display text-lg font-semibold">Recent XP</h2>
            {log.length === 0 ? <p className="mt-2 text-sm text-ink-400">Complete your first step to start earning XP.</p> : (
              <ul className="mt-2 divide-y divide-white/5">
                {log.slice(0, 15).map((e, i) => (
                  <li key={i} className="flex justify-between py-2 text-sm">
                    <span className="text-ink-200">{e.reason}</span>
                    <span className="flex gap-3"><span className="text-ink-400">{new Date(e.at).toLocaleDateString()}</span><b className="text-gold">+{e.xp}</b></span>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      </div>
    </div>
  )
}
