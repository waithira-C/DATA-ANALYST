import { Link, Navigate, useParams } from 'react-router-dom'
import { getFloor } from '../content'
import { useProgress, isFloorUnlocked } from '../store/progress'
import { resourcesFor } from '../lib/resources'
import ResourceCard from '../components/ResourceCard'
import { GAME_META } from '../games/meta'

export default function FloorPage() {
  const { id } = useParams()
  const floor = getFloor(Number(id))
  const completed = useProgress((s) => s.completed)
  const floorsComplete = useProgress((s) => s.floorsComplete)
  if (!floor) return <Navigate to="/" replace />
  const unlocked = isFloorUnlocked(floor.id, floorsComplete)
  const skills = [...new Set(floor.steps.flatMap((s) => s.skills))]
  const recs = resourcesFor(skills, floor.id, 6)
  const done = floor.steps.filter((s) => completed[s.id]).length

  return (
    <div className="mx-auto max-w-4xl">
      <Link to="/" className="text-sm text-ink-400 hover:text-white">← Back to the tower</Link>
      <header className="glass mt-3 overflow-hidden rounded-3xl p-6" style={{ boxShadow: `inset 0 0 0 1px ${floor.color}33, 0 30px 80px -40px ${floor.color}` }}>
        <div className="flex items-center gap-4">
          <span className="grid h-16 w-16 place-items-center rounded-2xl text-4xl" style={{ background: `${floor.color}22` }}>{floor.icon}</span>
          <div>
            <p className="text-xs uppercase tracking-[0.2em]" style={{ color: floor.color }}>Floor {floor.id}</p>
            <h1 className="font-display text-3xl font-bold">{floor.title}</h1>
            <p className="text-ink-200">{floor.tagline}</p>
          </div>
        </div>
        <div className="mt-5">
          <h2 className="text-sm font-semibold text-ink-400">By the end of this floor you can:</h2>
          <ul className="mt-2 grid gap-1.5 sm:grid-cols-2">
            {floor.outcomes.map((o) => (
              <li key={o} className="flex gap-2 text-sm text-ink-200"><span style={{ color: floor.color }}>◆</span>{o}</li>
            ))}
          </ul>
        </div>
        <div className="mt-5 h-2 overflow-hidden rounded-full bg-ink-700" role="progressbar" aria-valuenow={done} aria-valuemax={floor.steps.length} aria-label="Floor progress">
          <div className="h-full rounded-full transition-all" style={{ width: `${(done / floor.steps.length) * 100}%`, background: floor.color }} />
        </div>
        <p className="mt-1 text-xs text-ink-400">{done} of {floor.steps.length} steps complete</p>
      </header>

      {!unlocked && (
        <p className="mt-4 rounded-2xl border border-amber-500/30 bg-amber-500/10 p-4 text-sm text-amber-200">
          🔒 Clear Floor {floor.id - 1} to unlock this floor. You can still preview the steps below.
        </p>
      )}

      <ol className="relative mt-6 space-y-3 before:absolute before:left-6 before:top-2 before:h-[calc(100%-1rem)] before:w-px before:bg-white/10">
        {floor.steps.map((s, i) => {
          const isDone = !!completed[s.id]
          const prevDone = i === 0 || !!completed[floor.steps[i - 1].id]
          const open = unlocked && prevDone
          return (
            <li key={s.id} className="relative pl-14">
              <span
                className={`absolute left-2 top-4 grid h-8 w-8 place-items-center rounded-full border-2 text-sm font-bold ${
                  isDone ? 'border-emerald-400 bg-emerald-500/20 text-emerald-300' : open ? 'border-sky-400 bg-sky-500/20 text-sky-200' : 'border-ink-600 bg-ink-800 text-ink-400'
                }`}
              >
                {isDone ? '✓' : i + 1}
              </span>
              <Link
                to={open || isDone ? `/step/${s.id}` : '#'}
                onClick={(e) => !(open || isDone) && e.preventDefault()}
                aria-disabled={!(open || isDone)}
                className={`glass block rounded-2xl p-4 transition ${open || isDone ? 'hover:border-white/30 hover:bg-white/5' : 'cursor-not-allowed opacity-55'}`}
              >
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="font-display text-lg font-semibold">{s.title}</h3>
                  {s.game && <span className="chip">{GAME_META[s.game.kind].icon} {GAME_META[s.game.kind].name}</span>}
                </div>
                <p className="mt-1 text-sm text-ink-400">
                  {s.lesson.length} cards · {s.quiz.length}-question quiz · {s.minutes} min · <span className="text-gold">+{s.xp} XP</span>
                  {isDone && <> · best quiz {completed[s.id].score}%</>}
                </p>
              </Link>
            </li>
          )
        })}
      </ol>

      {recs.length > 0 && (
        <section className="mt-10">
          <h2 className="font-display text-xl font-bold">Go deeper on this floor</h2>
          <p className="text-sm text-ink-400">Hand-picked from the Library, free resources first.</p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {recs.map((r) => <ResourceCard key={r.id} r={r} />)}
          </div>
          <Link to={`/library?level=${floor.id}`} className="btn btn-ghost mt-4">See all Floor {floor.id} resources →</Link>
        </section>
      )}
    </div>
  )
}
