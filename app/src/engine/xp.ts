/** Level curve: level n needs 120 * n^1.6 cumulative XP (rounded to 10). */
export function xpForLevel(level: number): number {
  if (level <= 1) return 0
  return Math.round((120 * Math.pow(level - 1, 1.6)) / 10) * 10
}

export function levelFromXp(xp: number): number {
  let lvl = 1
  while (xp >= xpForLevel(lvl + 1)) lvl++
  return lvl
}

export function levelProgress(xp: number) {
  const level = levelFromXp(xp)
  const base = xpForLevel(level)
  const next = xpForLevel(level + 1)
  return { level, base, next, pct: (xp - base) / (next - base) }
}

const TITLES: [number, string][] = [
  [1, 'Curious Beginner'],
  [3, 'Data Intern'],
  [6, 'Spreadsheet Apprentice'],
  [9, 'Junior Analyst'],
  [13, 'Data Analyst'],
  [17, 'Senior Analyst'],
  [22, 'Insight Architect'],
  [28, 'Data Legend'],
]

export function titleForLevel(level: number): string {
  let t = TITLES[0][1]
  for (const [min, name] of TITLES) if (level >= min) t = name
  return t
}

/** XP awarded for a completed step: base xp scaled by quiz score, plus bonuses. */
export function stepReward(baseXp: number, quizScore: number, opts: { perfect: boolean; firstTime: boolean }) {
  if (!opts.firstTime) return { total: Math.round(baseXp * 0.1), parts: [{ label: 'Review', xp: Math.round(baseXp * 0.1) }] }
  const parts = [{ label: 'Step cleared', xp: Math.round(baseXp * (0.6 + 0.4 * quizScore)) }]
  if (opts.perfect) parts.push({ label: 'Perfect quiz', xp: 25 })
  return { total: parts.reduce((n, p) => n + p.xp, 0), parts }
}

export function streakBonus(streak: number) {
  return streak >= 2 ? Math.min(streak * 5, 50) : 0
}
