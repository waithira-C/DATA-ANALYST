import { lazy, Suspense, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { floors, findStep, allSteps } from '../content'
import { useProgress, nextStepId, isFloorUnlocked } from '../store/progress'
import type { TowerFloorState } from '../components/Tower3D'
import Spinner from '../components/Spinner'
import { XpBar } from '../components/Layout'

const Tower3D = lazy(() => import('../components/Tower3D'))

function webglAvailable() {
  try {
    const c = document.createElement('canvas')
    return !!(c.getContext('webgl2') || c.getContext('webgl'))
  } catch {
    return false
  }
}

export default function Home() {
  const navigate = useNavigate()
  const completed = useProgress((s) => s.completed)
  const floorsComplete = useProgress((s) => s.floorsComplete)
  const displayName = useProgress((s) => s.displayName)
  const setName = useProgress((s) => s.setName)
  const badges = useProgress((s) => s.badges)
  const [view, setView] = useState<'3d' | 'list'>(() => (webglAvailable() ? '3d' : 'list'))
  const [nameDraft, setNameDraft] = useState('')

  const states: TowerFloorState[] = useMemo(() => {
    let currentAssigned = false
    return floors.map((f) => {
      const done = f.steps.filter((s) => completed[s.id]).length
      const pct = done / f.steps.length
      const unlocked = isFloorUnlocked(f.id, floorsComplete)
      let status: TowerFloorState['status'] = 'locked'
      if (pct === 1) status = 'done'
      else if (unlocked && !currentAssigned) { status = 'current'; currentAssigned = true }
      else if (unlocked) status = 'open'
      return { floor: f, status, pct }
    })
  }, [completed, floorsComplete])

  const currentIndex = Math.max(0, states.findIndex((s) => s.status === 'current'))
  const next = nextStepId(completed)
  const nextInfo = next ? findStep(next) : null
  const doneCount = Object.keys(completed).length
  const allDone = !next

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
      <section className="glass relative overflow-hidden rounded-3xl" aria-label="Career ladder">
        <div className="pointer-events-none absolute inset-x-0 top-0 z-10 flex items-start justify-between p-5">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-ink-400">Your climb</p>
            <h1 className="font-display text-xl font-bold sm:text-3xl">
              Beginner → <span className="glow-text">Data Analyst</span>
            </h1>
          </div>
          <div className="pointer-events-auto flex rounded-xl bg-ink-900/80 p-1 text-xs" role="tablist" aria-label="View">
            {(['3d', 'list'] as const).map((v) => (
              <button key={v} role="tab" aria-selected={view === v} onClick={() => setView(v)} className={`rounded-lg px-3 py-1 font-semibold ${view === v ? 'bg-white/15 text-white' : 'text-ink-400'}`}>
                {v === '3d' ? '3D' : 'List'}
              </button>
            ))}
          </div>
        </div>

        {view === '3d' ? (
          <div className="h-[62vh] min-h-[440px] lg:h-[calc(100vh-9rem)]">
            <Suspense fallback={<Spinner label="Building your tower…" />}>
              <Tower3D states={states} currentIndex={currentIndex} onSelect={(id) => navigate(`/floor/${id}`)} />
            </Suspense>
            <p className="pointer-events-none absolute bottom-3 left-0 right-0 text-center text-xs text-ink-400">Drag to orbit · scroll to zoom · tap a floor to enter</p>
          </div>
        ) : (
          <ol className="flex flex-col-reverse gap-2 p-5 pt-24">
            {states.map((s) => (
              <li key={s.floor.id}>
                <Link
                  to={s.status === 'locked' ? '#' : `/floor/${s.floor.id}`}
                  aria-disabled={s.status === 'locked'}
                  className={`flex items-center gap-4 rounded-2xl border p-4 transition ${
                    s.status === 'locked' ? 'cursor-not-allowed border-white/5 opacity-50' : 'border-white/10 hover:border-white/30 hover:bg-white/5'
                  } ${s.status === 'current' ? 'ring-2 ring-sky-400/60' : ''}`}
                  onClick={(e) => s.status === 'locked' && e.preventDefault()}
                >
                  <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl text-2xl" style={{ background: `${s.floor.color}22` }}>
                    {s.status === 'locked' ? '🔒' : s.floor.icon}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-xs text-ink-400">Floor {s.floor.id}</span>
                    <span className="block font-display font-semibold">{s.floor.title}</span>
                    <span className="mt-2 block h-1.5 overflow-hidden rounded-full bg-ink-700">
                      <span className="block h-full rounded-full" style={{ width: `${s.pct * 100}%`, background: s.floor.color }} />
                    </span>
                  </span>
                  <span className="text-sm text-ink-400">{s.status === 'done' ? '✓' : `${Math.round(s.pct * 100)}%`}</span>
                </Link>
              </li>
            ))}
          </ol>
        )}
      </section>

      <aside className="flex flex-col gap-4">
        <div className="glass rounded-3xl p-5">
          {displayName ? (
            <p className="text-sm text-ink-400">Welcome back,</p>
          ) : (
            <p className="text-sm text-ink-400">Welcome, future analyst 👋</p>
          )}
          {displayName ? (
            <h2 className="font-display text-xl font-bold">{displayName}</h2>
          ) : (
            <form className="mt-2 flex gap-2" onSubmit={(e) => { e.preventDefault(); if (nameDraft.trim()) setName(nameDraft.trim()) }}>
              <label htmlFor="name" className="sr-only">Your name</label>
              <input id="name" className="input" placeholder="What should we call you?" value={nameDraft} onChange={(e) => setNameDraft(e.target.value)} />
              <button className="btn btn-primary">Go</button>
            </form>
          )}
          <div className="mt-4"><XpBar /></div>
          <dl className="mt-4 grid grid-cols-3 gap-2 text-center">
            <div className="rounded-xl bg-white/5 p-2"><dt className="text-[11px] text-ink-400">Steps</dt><dd className="font-display text-lg font-bold">{doneCount}/{allSteps.length}</dd></div>
            <div className="rounded-xl bg-white/5 p-2"><dt className="text-[11px] text-ink-400">Floors</dt><dd className="font-display text-lg font-bold">{floorsComplete.length}/10</dd></div>
            <div className="rounded-xl bg-white/5 p-2"><dt className="text-[11px] text-ink-400">Badges</dt><dd className="font-display text-lg font-bold">{Object.keys(badges).length}</dd></div>
          </dl>
        </div>

        <div className="glass rounded-3xl p-5">
          <p className="text-xs uppercase tracking-wider text-ink-400">{allDone ? 'All floors cleared' : doneCount ? 'Continue where you left off' : 'Start here'}</p>
          {nextInfo ? (
            <>
              <h3 className="mt-1 font-display text-lg font-semibold">{nextInfo.step.title}</h3>
              <p className="text-sm text-ink-400">Floor {nextInfo.floor.id} · {nextInfo.floor.title} · {nextInfo.step.minutes} min · +{nextInfo.step.xp} XP</p>
              <Link to={`/step/${nextInfo.step.id}`} className="btn btn-primary mt-4 w-full">
                {doneCount ? 'Continue climbing' : 'Take the first step'} →
              </Link>
            </>
          ) : (
            <>
              <h3 className="mt-1 font-display text-lg font-semibold">You reached the top 🏆</h3>
              <Link to="/certificate" className="btn btn-primary mt-4 w-full">Claim your certificate →</Link>
            </>
          )}
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Link to="/arcade" className="glass rounded-2xl p-4 transition hover:bg-white/10">
            <span className="text-2xl">🕹️</span>
            <span className="mt-1 block font-semibold">Arcade</span>
            <span className="text-xs text-ink-400">Replay games for practice</span>
          </Link>
          <Link to="/jobs" className="glass rounded-2xl p-4 transition hover:bg-white/10">
            <span className="text-2xl">💼</span>
            <span className="mt-1 block font-semibold">Live jobs</span>
            <span className="text-xs text-ink-400">Data analyst roles worldwide</span>
          </Link>
          <Link to="/library" className="glass rounded-2xl p-4 transition hover:bg-white/10">
            <span className="text-2xl">📚</span>
            <span className="mt-1 block font-semibold">Library</span>
            <span className="text-xs text-ink-400">The best free resources</span>
          </Link>
          <Link to="/certificate" className="glass rounded-2xl p-4 transition hover:bg-white/10">
            <span className="text-2xl">🎓</span>
            <span className="mt-1 block font-semibold">Certificate</span>
            <span className="text-xs text-ink-400">Exam + capstone</span>
          </Link>
        </div>
      </aside>
    </div>
  )
}
