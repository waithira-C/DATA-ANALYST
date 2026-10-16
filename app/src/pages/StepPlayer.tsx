import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { findStep } from '../content'
import type { QuizQuestion } from '../content/types'
import { useProgress, isFloorUnlocked } from '../store/progress'
import { resourcesFor, videoFor } from '../lib/resources'
import { stepReward } from '../engine/xp'
import { GameHost } from '../games'
import { GAME_META } from '../games/meta'
import Rich, { inline } from '../components/Rich'
import ResourceCard from '../components/ResourceCard'
import LiteYouTube from '../components/LiteYouTube'

type Phase = 'lesson' | 'game' | 'quiz' | 'done'

function Quiz({ questions, onFinish }: { questions: QuizQuestion[]; onFinish: (score: number) => void }) {
  const [i, setI] = useState(0)
  const [picked, setPicked] = useState<number | null>(null)
  const [correct, setCorrect] = useState(0)
  const finished = useRef(false)
  const q = questions[i]
  const choose = (k: number) => {
    if (picked !== null) return
    setPicked(k)
    if (k === q.answer) setCorrect((c) => c + 1)
  }
  const next = () => {
    if (i + 1 >= questions.length) {
      // Guard against a double click during the exit animation finishing the step twice.
      if (!finished.current) { finished.current = true; onFinish(correct / questions.length) }
      return
    }
    setI(i + 1)
    setPicked(null)
  }
  return (
    <section className="glass rounded-3xl p-5 sm:p-7" aria-label="Quiz">
      <div className="flex items-center justify-between text-sm text-ink-400">
        <span>✏️ Check yourself · Question {i + 1} of {questions.length}</span>
        <span>{correct} correct</span>
      </div>
        <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <h2 className="mt-3 font-display text-xl font-semibold">{inline(q.q)}</h2>
          <div className="mt-4 grid gap-2">
            {q.options.map((o, k) => {
              const state = picked === null ? '' : k === q.answer ? 'border-emerald-400 bg-emerald-500/15' : k === picked ? 'border-rose-400 bg-rose-500/15' : 'opacity-50'
              return (
                <button key={k} onClick={() => choose(k)} disabled={picked !== null} className={`rounded-xl border border-white/10 bg-white/[0.03] p-3 text-left transition hover:border-white/30 ${state}`}>
                  <span className="mr-2 font-mono text-ink-400">{String.fromCharCode(65 + k)}</span>{inline(o)}
                </button>
              )
            })}
          </div>
          {picked !== null && (
            <div className={`mt-4 rounded-xl p-3 text-sm ${picked === q.answer ? 'bg-emerald-500/10 text-emerald-100' : 'bg-rose-500/10 text-rose-100'}`} role="status">
              <b>{picked === q.answer ? 'Correct! ' : 'Not quite. '}</b>{inline(q.explain)}
            </div>
          )}
          {picked !== null && (
            <div className="mt-4 flex justify-end">
              <button className="btn btn-primary" onClick={next} autoFocus>{i + 1 >= questions.length ? 'See results' : 'Next question'} →</button>
            </div>
          )}
        </motion.div>
    </section>
  )
}

export default function StepPlayer() {
  const { id = '' } = useParams()
  const navigate = useNavigate()
  const found = findStep(id)
  const completeStep = useProgress((s) => s.completeStep)
  const recordGame = useProgress((s) => s.recordGame)
  const floorsComplete = useProgress((s) => s.floorsComplete)
  const prevRecord = useProgress((s) => s.completed[id])
  const [phase, setPhase] = useState<Phase>('lesson')
  const [card, setCard] = useState(0)
  const [result, setResult] = useState<{ quiz: number; gained: number; firstTime: boolean } | null>(null)
  const started = useRef(Date.now())

  useEffect(() => {
    setPhase('lesson'); setCard(0); setResult(null); started.current = Date.now()
  }, [id])

  const video = useMemo(() => (found ? videoFor(found.step.skills, found.floor.id) : undefined), [found])
  const recs = useMemo(() => (found ? resourcesFor(found.step.skills, found.floor.id, 3) : []), [found])

  if (!found) return <Navigate to="/" replace />
  const { floor, step, index } = found
  if (!isFloorUnlocked(floor.id, floorsComplete) && !prevRecord) return <Navigate to={`/floor/${floor.id}`} replace />

  const nextStep = floor.steps[index + 1]
  const lessonCards = step.lesson
  const c = lessonCards[card]
  const phases: Phase[] = step.game ? ['lesson', 'game', 'quiz'] : ['lesson', 'quiz']

  const finishQuiz = (score: number) => {
    const r = completeStep(step.id, score, Math.round((Date.now() - started.current) / 1000))
    setResult({ quiz: score, ...r })
    setPhase('done')
  }

  const preview = stepReward(step.xp, result?.quiz ?? 0, { perfect: (result?.quiz ?? 0) >= 1, firstTime: result?.firstTime ?? true })

  return (
    <div className="mx-auto max-w-3xl">
      <div className="flex items-center justify-between gap-3">
        <Link to={`/floor/${floor.id}`} className="text-sm text-ink-400 hover:text-white">← Floor {floor.id}: {floor.title}</Link>
        <span className="chip">+{step.xp} XP</span>
      </div>
      <h1 className="mt-2 font-display text-2xl font-bold sm:text-3xl">{step.title}</h1>

      {/* phase rail */}
      <ol className="mt-4 flex gap-2" aria-label="Step progress">
        {phases.map((p) => {
          const at = phases.indexOf(phase === 'done' ? 'quiz' : phase)
          const me = phases.indexOf(p)
          return (
            <li key={p} className={`flex-1 rounded-full py-1 text-center text-xs font-semibold ${me < at || phase === 'done' ? 'bg-emerald-500/20 text-emerald-300' : me === at ? 'bg-sky-500/25 text-sky-200' : 'bg-white/5 text-ink-400'}`}>
              {p === 'lesson' ? '📖 Learn' : p === 'game' ? `${GAME_META[step.game!.kind].icon} Play` : '✏️ Quiz'}
            </li>
          )
        })}
      </ol>

      <div className="mt-5">
        {phase === 'lesson' && (
          <>
            {card === 0 && video?.youtube_id && (
              <div className="glass mb-4 overflow-hidden rounded-3xl">
                <div className="aspect-video">
                  <LiteYouTube id={video.youtube_id} title={video.title} />
                </div>
                <p className="px-4 py-2 text-xs text-ink-400">🎬 Optional watch: <b className="text-ink-200">{video.title}</b> by {video.provider}</p>
              </div>
            )}
              <motion.article key={card} initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.2 }} className="glass rounded-3xl p-5 sm:p-7">
                <p className="text-xs uppercase tracking-wider text-ink-400">Card {card + 1} of {lessonCards.length}</p>
                <h2 className="mt-1 font-display text-xl font-semibold">{c.heading}</h2>
                <Rich text={c.body} />
                {c.example && (
                  <figure className="mt-4">
                    <figcaption className="mb-1 text-xs uppercase tracking-wider text-ink-400">{c.exampleLang ?? 'example'}</figcaption>
                    <pre className="overflow-x-auto rounded-xl bg-black/40 p-4 font-mono text-sm leading-relaxed text-sky-100">{c.example}</pre>
                  </figure>
                )}
                {c.tip && <p className="mt-4 rounded-xl border border-amber-400/30 bg-amber-400/10 p-3 text-sm text-amber-100">💡 <b>Pro tip:</b> {inline(c.tip)}</p>}
              </motion.article>
            <div className="mt-4 flex items-center justify-between">
              <button className="btn btn-ghost" onClick={() => setCard(card - 1)} disabled={card === 0}>← Back</button>
              <div className="flex gap-1.5" aria-hidden>
                {lessonCards.map((_, i) => <span key={i} className={`h-1.5 w-5 rounded-full ${i <= card ? 'bg-sky-400' : 'bg-ink-600'}`} />)}
              </div>
              {card + 1 < lessonCards.length ? (
                <button className="btn btn-primary" onClick={() => setCard(card + 1)}>Next →</button>
              ) : (
                <button className="btn btn-primary" onClick={() => setPhase(step.game ? 'game' : 'quiz')}>
                  {step.game ? `Play ${GAME_META[step.game.kind].name}` : 'Take the quiz'} →
                </button>
              )}
            </div>
          </>
        )}

        {phase === 'game' && step.game && (
          <GameHost
            kind={step.game.kind}
            stage={step.game.stage}
            onComplete={(score) => { recordGame(step.game!.kind, step.game!.stage, score); setPhase('quiz') }}
          />
        )}

        {phase === 'quiz' && <Quiz questions={step.quiz} onFinish={finishQuiz} />}

        {phase === 'done' && result && (
          <motion.section initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="glass rounded-3xl p-6 text-center sm:p-8">
            <div className="text-6xl">{result.quiz >= 1 ? '🌟' : result.quiz >= 0.6 ? '🎉' : '💪'}</div>
            <h2 className="mt-3 font-display text-3xl font-bold">{result.firstTime ? 'Step complete!' : 'Nice review!'}</h2>
            <p className="text-ink-400">Quiz score: {Math.round(result.quiz * 100)}%</p>
            <div className="mx-auto mt-5 max-w-xs space-y-1 text-left">
              {preview.parts.map((p) => (
                <div key={p.label} className="flex justify-between text-sm"><span className="text-ink-200">{p.label}</span><span className="font-bold text-gold">+{p.xp} XP</span></div>
              ))}
              <div className="flex justify-between border-t border-white/10 pt-1 font-display font-bold"><span>Total</span><span className="text-gold">+{result.gained} XP</span></div>
            </div>
            {result.quiz < 0.6 && <p className="mt-4 text-sm text-amber-200">Tip: re-read the cards and try the quiz again. Reviews still earn XP.</p>}
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <button className="btn btn-ghost" onClick={() => { setPhase('lesson'); setCard(0) }}>Review again</button>
              {nextStep ? (
                <button className="btn btn-primary" onClick={() => navigate(`/step/${nextStep.id}`)} autoFocus>Next step: {nextStep.title} →</button>
              ) : (
                <button className="btn btn-primary" onClick={() => navigate('/')} autoFocus>Back to the tower 🏙️</button>
              )}
            </div>
            {recs.length > 0 && (
              <div className="mt-8 text-left">
                <h3 className="font-display font-semibold">Go deeper</h3>
                <div className="mt-2 grid gap-2 sm:grid-cols-3">{recs.map((r) => <ResourceCard key={r.id} r={r} compact />)}</div>
              </div>
            )}
          </motion.section>
        )}
      </div>
    </div>
  )
}
