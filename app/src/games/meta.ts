import type { GameKind } from '../content/types'

export interface GameProps {
  stage: number
  /** score 0..100 once the stage is cleared */
  onComplete: (score: number) => void
}

export const GAME_META: Record<GameKind, { name: string; icon: string; blurb: string; stages: string[] }> = {
  'query-quest': {
    name: 'Query Quest',
    icon: '🕵️',
    blurb: 'Write real SQL against a live coffee-shop database to crack each case.',
    stages: ['SELECT basics', 'Filtering with WHERE', 'Sorting & LIMIT', 'GROUP BY & HAVING', 'JOINs', 'CASE WHEN', 'Subqueries', 'CTEs', 'Ranking windows', 'Running totals & LAG'],
  },
  'formula-forge': {
    name: 'Formula Forge',
    icon: '⚒️',
    blurb: 'Type spreadsheet formulas into a live mini-sheet until the target cell lights up.',
    stages: ['SUM, AVERAGE & references', 'Text functions', 'IF & logic', 'COUNT, MIN, MAX & ROUND', 'COUNTIF & SUMIF', 'AVERAGEIFS & COUNTIFS', 'VLOOKUP & XLOOKUP', 'INDEX & MATCH'],
  },
  'clean-sweep': {
    name: 'Clean Sweep',
    icon: '🧹',
    blurb: 'Spot the dirty rows and choose the right fix before the data hits the dashboard.',
    stages: ['Spreadsheet cleanup', 'Types & missing values', 'Duplicates & merges'],
  },
  'guess-correlation': {
    name: 'Guess the Correlation',
    icon: '🎯',
    blurb: 'Eyeball a scatter plot and guess r. Get within 0.1 for full points.',
    stages: ['Warm-up', 'Noisy data', 'Outliers & traps'],
  },
  'chart-doctor': {
    name: 'Chart Doctor',
    icon: '🩺',
    blurb: 'Diagnose the data question and prescribe the right chart.',
    stages: ['Pick the chart', 'Chart choice for stakeholders', 'Fix the design', 'Dashboard KPIs'],
  },
  'pandas-lab': {
    name: 'Pandas Lab',
    icon: '🐼',
    blurb: 'Run real Python in your browser. Make the tests pass.',
    stages: ['Python basics', 'Inspect & select', 'Filtering', 'Cleaning', 'groupby & agg'],
  },
  'stakeholder-says': {
    name: 'Stakeholder Says',
    icon: '🗣️',
    blurb: 'Workplace scenarios: choose how a great analyst would respond.',
    stages: ['A day as an analyst', 'Framing the question', 'Reading an A/B test', 'Presenting results', 'The interview'],
  },
}
