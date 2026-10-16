import { describe, expect, it } from 'vitest'
import { floors, allSteps } from '.'
import { GAME_META } from '../games/meta'
import type { GameKind } from './types'
import { BADGES, evaluateBadges, type ProgressSnapshot } from '../engine/achievements'
import { levelFromXp, xpForLevel, stepReward } from '../engine/xp'

describe('curriculum integrity', () => {
  it('has 10 floors in order', () => {
    expect(floors.map((f) => f.id)).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
  })
  it('step ids are unique and well-formed', () => {
    const ids = allSteps.map((s) => s.id)
    expect(new Set(ids).size).toBe(ids.length)
    for (const f of floors) for (const s of f.steps) expect(s.id).toMatch(new RegExp(`^f${f.id}-s\\d+$`))
  })
  it('every step has lessons and a valid quiz', () => {
    for (const s of allSteps) {
      expect(s.lesson.length, s.id).toBeGreaterThanOrEqual(3)
      expect(s.quiz.length, s.id).toBeGreaterThanOrEqual(3)
      for (const q of s.quiz) {
        expect(q.answer, `${s.id}: ${q.q}`).toBeGreaterThanOrEqual(0)
        expect(q.answer, `${s.id}: ${q.q}`).toBeLessThan(q.options.length)
        expect(new Set(q.options).size, `${s.id} duplicate options`).toBe(q.options.length)
      }
    }
  })
  it('every game stage is used exactly once and exists', () => {
    const used = new Map<string, string>()
    for (const s of allSteps) {
      if (!s.game) continue
      const key = `${s.game.kind}:${s.game.stage}`
      expect(used.has(key), `${key} reused by ${s.id} and ${used.get(key)}`).toBe(false)
      used.set(key, s.id)
      expect(s.game.stage).toBeLessThan(GAME_META[s.game.kind].stages.length)
    }
    for (const kind of Object.keys(GAME_META) as GameKind[]) {
      GAME_META[kind].stages.forEach((_, i) => expect(used.has(`${kind}:${i}`), `${kind}:${i} never used`).toBe(true))
    }
  })
})

describe('xp + badges', () => {
  it('level curve is monotonic', () => {
    for (let l = 1; l < 40; l++) expect(xpForLevel(l + 1)).toBeGreaterThan(xpForLevel(l))
    expect(levelFromXp(0)).toBe(1)
    expect(levelFromXp(xpForLevel(5))).toBe(5)
  })
  it('rewards scale with quiz score and bonus for perfect', () => {
    expect(stepReward(100, 1, { perfect: true, firstTime: true }).total).toBe(125)
    expect(stepReward(100, 0.5, { perfect: false, firstTime: true }).total).toBe(80)
    expect(stepReward(100, 1, { perfect: true, firstTime: false }).total).toBe(10)
  })
  it('badges unlock from snapshots', () => {
    const base: ProgressSnapshot = {
      xp: 0, streak: 0, completed: {}, gameStages: {}, perfectQuizzes: 0, resourcesOpened: 0, jobsSaved: 0, jobsApplied: 0,
      examPassed: false, capstoneSubmitted: false, certified: false, floorsComplete: [],
    }
    expect(evaluateBadges(base, {})).toEqual([])
    const s = { ...base, completed: { 'f1-s1': { xp: 1, score: 100, at: '' } }, floorsComplete: [1], streak: 3 }
    const ids = evaluateBadges(s, {}).map((b) => b.id)
    expect(ids).toEqual(expect.arrayContaining(['first-step', 'floor-1', 'streak-3']))
    expect(new Set(BADGES.map((b) => b.id)).size).toBe(BADGES.length)
  })
})
