import { lazy, Suspense, type ComponentType } from 'react'
import type { GameKind } from '../content/types'
import type { GameProps } from './meta'
import Spinner from '../components/Spinner'

const GAMES: Record<GameKind, ComponentType<GameProps>> = {
  'query-quest': lazy(() => import('./QueryQuest')),
  'formula-forge': lazy(() => import('./FormulaForge')),
  'clean-sweep': lazy(() => import('./CleanSweep')),
  'guess-correlation': lazy(() => import('./GuessCorrelation')),
  'chart-doctor': lazy(() => import('./ChartDoctor')),
  'pandas-lab': lazy(() => import('./PandasLab')),
  'stakeholder-says': lazy(() => import('./StakeholderSays')),
}

export function GameHost({ kind, stage, onComplete }: { kind: GameKind } & GameProps) {
  const G = GAMES[kind]
  return (
    <Suspense fallback={<Spinner label="Loading game…" />}>
      <G key={`${kind}:${stage}`} stage={stage} onComplete={onComplete} />
    </Suspense>
  )
}
