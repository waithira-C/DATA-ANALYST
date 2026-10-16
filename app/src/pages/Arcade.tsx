import { useState } from 'react'
import { allSteps, findStep } from '../content'
import type { GameKind } from '../content/types'
import { GAME_META } from '../games/meta'
import { GameHost } from '../games'
import { useProgress } from '../store/progress'

/** Free-play: replay any game stage whose step you've reached. Replays award a small XP bonus once per stage per day. */
export default function Arcade() {
  const completed = useProgress((s) => s.completed)
  const best = useProgress((s) => s.gameStages)
  const recordGame = useProgress((s) => s.recordGame)
  const addXp = useProgress((s) => s.addXp)
  const [playing, setPlaying] = useState<{ kind: GameKind; stage: number } | null>(null)

  // Map each game stage to the step that introduces it.
  const stageStep = new Map<string, string>()
  for (const s of allSteps) if (s.game) stageStep.set(`${s.game.kind}:${s.game.stage}`, s.id)

  if (playing) {
    return (
      <div className="mx-auto max-w-4xl">
        <button className="mb-3 text-sm text-ink-400 hover:text-white" onClick={() => setPlaying(null)}>← Back to the arcade</button>
        <GameHost
          kind={playing.kind}
          stage={playing.stage}
          onComplete={(score) => {
            recordGame(playing.kind, playing.stage, score)
            const key = `arcade:${playing.kind}:${playing.stage}:${new Date().toDateString()}`
            try {
              if (!localStorage.getItem(key)) { localStorage.setItem(key, '1'); addXp(Math.round(score / 5), `Arcade: ${GAME_META[playing.kind].name}`) }
            } catch { /* storage blocked: skip bonus */ }
            setPlaying(null)
          }}
        />
      </div>
    )
  }

  return (
    <div>
      <h1 className="font-display text-3xl font-bold">The <span className="glow-text">Arcade</span></h1>
      <p className="text-ink-400">Replay any game you've cleared on the ladder to sharpen your skills. Your first replay of each stage each day earns bonus XP.</p>
      <div className="mt-6 grid gap-5 md:grid-cols-2">
        {(Object.keys(GAME_META) as GameKind[]).map((kind) => {
          const m = GAME_META[kind]
          return (
            <section key={kind} className="glass rounded-3xl p-5">
              <div className="flex items-center gap-3">
                <span className="text-4xl">{m.icon}</span>
                <div>
                  <h2 className="font-display text-xl font-bold">{m.name}</h2>
                  <p className="text-sm text-ink-400">{m.blurb}</p>
                </div>
              </div>
              <ul className="mt-4 grid gap-2 sm:grid-cols-2">
                {m.stages.map((label, i) => {
                  const stepId = stageStep.get(`${kind}:${i}`)
                  const info = stepId ? findStep(stepId) : undefined
                  const unlocked = !!stepId && !!completed[stepId]
                  const score = best[`${kind}:${i}`]
                  return (
                    <li key={i}>
                      <button
                        disabled={!unlocked}
                        onClick={() => setPlaying({ kind, stage: i })}
                        className="flex w-full items-center justify-between rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2 text-left text-sm transition hover:border-white/30 disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        <span>{unlocked ? '▶' : '🔒'} {label}</span>
                        {score !== undefined ? <span className="text-xs font-bold text-gold">{score}</span> : info && <span className="text-[10px] text-ink-400">Floor {info.floor.id}</span>}
                      </button>
                    </li>
                  )
                })}
              </ul>
            </section>
          )
        })}
      </div>
    </div>
  )
}
