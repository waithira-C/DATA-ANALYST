import type { GameKind } from '../content/types'

export interface StepRecord { xp: number; score: number; at: string; perfect?: boolean; seconds?: number }

/** The slice of learner state that badge rules read. */
export interface ProgressSnapshot {
  xp: number
  streak: number
  completed: Record<string, StepRecord>
  gameStages: Record<string, number> // "kind:stage" -> best score 0..100
  perfectQuizzes: number
  resourcesOpened: number
  jobsSaved: number
  jobsApplied: number
  examPassed: boolean
  capstoneSubmitted: boolean
  certified: boolean
  floorsComplete: number[] // floor ids fully cleared
}

export type Tier = 'bronze' | 'silver' | 'gold' | 'platinum'

export interface Badge {
  id: string
  name: string
  description: string
  icon: string
  tier: Tier
  xp: number
  test: (s: ProgressSnapshot, ctx: { lastHour?: number }) => boolean
}

const floorBadge = (id: number, name: string, icon: string, tier: Tier): Badge => ({
  id: `floor-${id}`,
  name,
  description: `Clear every step on Floor ${id}.`,
  icon,
  tier,
  xp: 100,
  test: (s) => s.floorsComplete.includes(id),
})

const playedKinds = (s: ProgressSnapshot) => new Set(Object.keys(s.gameStages).map((k) => k.split(':')[0] as GameKind))

export const BADGES: Badge[] = [
  { id: 'first-step', name: 'First Rung', description: 'Complete your very first step.', icon: '🪜', tier: 'bronze', xp: 20, test: (s) => Object.keys(s.completed).length >= 1 },
  { id: 'ten-steps', name: 'Momentum', description: 'Complete 10 steps.', icon: '🚀', tier: 'silver', xp: 50, test: (s) => Object.keys(s.completed).length >= 10 },
  { id: 'thirty-steps', name: 'Unstoppable', description: 'Complete 30 steps.', icon: '🔥', tier: 'gold', xp: 150, test: (s) => Object.keys(s.completed).length >= 30 },
  floorBadge(1, 'Compass Bearer', '🧭', 'bronze'),
  floorBadge(2, 'Cell Whisperer', '📗', 'bronze'),
  floorBadge(3, 'Pivot Master', '🔎', 'silver'),
  floorBadge(4, 'Stat Sleuth', '📊', 'silver'),
  floorBadge(5, 'Query Rookie', '🗄️', 'silver'),
  floorBadge(6, 'Window Wizard', '⚙️', 'gold'),
  floorBadge(7, 'Storyteller', '🎨', 'gold'),
  floorBadge(8, 'Pythonista', '🐍', 'gold'),
  floorBadge(9, 'Business Brain', '💼', 'gold'),
  floorBadge(10, 'Ladder Legend', '🏆', 'platinum'),
  { id: 'first-join', name: 'First JOIN', description: 'Clear the JOIN stage in Query Quest.', icon: '🔗', tier: 'silver', xp: 40, test: (s) => (s.gameStages['query-quest:4'] ?? 0) > 0 },
  { id: 'window-pane', name: 'Window Pane', description: 'Clear a window-function stage in Query Quest.', icon: '🪟', tier: 'gold', xp: 60, test: (s) => (s.gameStages['query-quest:8'] ?? 0) > 0 || (s.gameStages['query-quest:9'] ?? 0) > 0 },
  { id: 'perfect-quiz', name: 'Flawless', description: 'Score 100% on a quiz.', icon: '💯', tier: 'bronze', xp: 25, test: (s) => s.perfectQuizzes >= 1 },
  { id: 'perfect-10', name: 'Perfectionist', description: 'Score 100% on 10 quizzes.', icon: '🎯', tier: 'gold', xp: 120, test: (s) => s.perfectQuizzes >= 10 },
  { id: 'streak-3', name: 'Habit Forming', description: 'Learn 3 days in a row.', icon: '📅', tier: 'bronze', xp: 30, test: (s) => s.streak >= 3 },
  { id: 'streak-7', name: 'Week Warrior', description: 'Learn 7 days in a row.', icon: '⚡', tier: 'silver', xp: 80, test: (s) => s.streak >= 7 },
  { id: 'streak-30', name: 'Iron Discipline', description: 'Learn 30 days in a row.', icon: '🛡️', tier: 'platinum', xp: 300, test: (s) => s.streak >= 30 },
  { id: 'xp-1000', name: 'Four Digits', description: 'Earn 1,000 XP.', icon: '✨', tier: 'bronze', xp: 0, test: (s) => s.xp >= 1000 },
  { id: 'xp-5000', name: 'XP Hoarder', description: 'Earn 5,000 XP.', icon: '💎', tier: 'silver', xp: 0, test: (s) => s.xp >= 5000 },
  { id: 'xp-12000', name: 'Insight Engine', description: 'Earn 12,000 XP.', icon: '🌌', tier: 'gold', xp: 0, test: (s) => s.xp >= 12000 },
  { id: 'gamer-10', name: 'Arcade Regular', description: 'Clear 10 game stages.', icon: '🕹️', tier: 'silver', xp: 60, test: (s) => Object.values(s.gameStages).filter((v) => v > 0).length >= 10 },
  { id: 'all-games', name: 'Full Arcade', description: 'Play all 7 game types.', icon: '🎮', tier: 'gold', xp: 100, test: (s) => playedKinds(s).size >= 7 },
  { id: 'sharp-eye', name: 'Sharp Eye', description: 'Score 90+ in Guess the Correlation.', icon: '👁️', tier: 'silver', xp: 40, test: (s) => Object.entries(s.gameStages).some(([k, v]) => k.startsWith('guess-correlation') && v >= 90) },
  { id: 'librarian', name: 'Librarian', description: 'Open 10 resources from the Library.', icon: '📚', tier: 'bronze', xp: 30, test: (s) => s.resourcesOpened >= 10 },
  { id: 'job-scout', name: 'Job Scout', description: 'Save 5 jobs to your shortlist.', icon: '🗂️', tier: 'bronze', xp: 30, test: (s) => s.jobsSaved >= 5 },
  { id: 'first-apply', name: 'Shot Taken', description: 'Open an application link for a real job.', icon: '📨', tier: 'silver', xp: 40, test: (s) => s.jobsApplied >= 1 },
  { id: 'night-owl', name: 'Night Owl', description: 'Finish a step between midnight and 4am.', icon: '🦉', tier: 'bronze', xp: 15, test: (_s, c) => c.lastHour !== undefined && c.lastHour < 4 },
  { id: 'early-bird', name: 'Early Bird', description: 'Finish a step between 5am and 7am.', icon: '🐦', tier: 'bronze', xp: 15, test: (_s, c) => c.lastHour !== undefined && c.lastHour >= 5 && c.lastHour < 7 },
  { id: 'capstone', name: 'Portfolio Shipped', description: 'Submit your capstone project.', icon: '📦', tier: 'gold', xp: 200, test: (s) => s.capstoneSubmitted },
  { id: 'exam', name: 'Exam Conqueror', description: 'Pass the final exam (80%+).', icon: '📝', tier: 'gold', xp: 250, test: (s) => s.examPassed },
  { id: 'certified', name: 'Certified Analyst', description: 'Earn your DataLadder certificate.', icon: '🎓', tier: 'platinum', xp: 500, test: (s) => s.certified },
]

export const BADGE_BY_ID = Object.fromEntries(BADGES.map((b) => [b.id, b]))

/** Returns badges newly satisfied that are not yet in `owned`. */
export function evaluateBadges(s: ProgressSnapshot, owned: Record<string, string>, ctx: { lastHour?: number } = {}): Badge[] {
  return BADGES.filter((b) => !owned[b.id] && b.test(s, ctx))
}

export const TIER_COLORS: Record<Tier, string> = {
  bronze: '#cd7f32',
  silver: '#cbd5e1',
  gold: '#fbbf24',
  platinum: '#a5f3fc',
}
