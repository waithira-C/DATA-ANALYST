import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { floors, findStep } from '../content'
import type { GameKind } from '../content/types'
import { evaluateBadges, BADGE_BY_ID, type ProgressSnapshot, type StepRecord } from '../engine/achievements'
import { stepReward, streakBonus } from '../engine/xp'
import { daysBetween, todayKey } from '../engine/date'
import { useUi } from './ui'

export interface Capstone { title: string; repoUrl: string; dashboardUrl?: string; summary: string; submittedAt: string }
export interface Certificate { id: string; fullName: string; issuedAt: string; examScore: number; capstoneUrl: string; local?: boolean }
export interface XpEntry { at: string; xp: number; reason: string }

interface Data extends ProgressSnapshot {
  displayName: string
  lastActive: string | null
  badges: Record<string, string> // id -> ISO earned
  savedJobs: string[]
  savedResources: string[]
  examScore: number | null
  capstone: Capstone | null
  certificate: Certificate | null
  xpLog: XpEntry[]
}

interface ProgressState extends Data {
  setName: (n: string) => void
  completeStep: (stepId: string, quizScore: number, seconds: number) => { gained: number; firstTime: boolean }
  recordGame: (kind: GameKind, stage: number, score: number) => void
  addXp: (xp: number, reason: string) => void
  openResource: () => void
  toggleSaveJob: (id: string) => void
  toggleSaveResource: (id: string) => void
  applyJob: () => void
  setExam: (score: number, passed: boolean) => void
  setCapstone: (c: Capstone) => void
  setCertificate: (c: Certificate) => void
  mergeRemote: (r: Partial<Pick<Data, 'completed' | 'badges' | 'xp' | 'streak' | 'lastActive'>>) => void
  reset: () => void
}

const initial: Data = {
  displayName: '',
  xp: 0,
  streak: 0,
  lastActive: null,
  completed: {},
  gameStages: {},
  perfectQuizzes: 0,
  resourcesOpened: 0,
  jobsSaved: 0,
  jobsApplied: 0,
  examPassed: false,
  examScore: null,
  capstoneSubmitted: false,
  certified: false,
  floorsComplete: [],
  badges: {},
  savedJobs: [],
  savedResources: [],
  capstone: null,
  certificate: null,
  xpLog: [],
}

function computeFloorsComplete(completed: Record<string, StepRecord>) {
  return floors.filter((f) => f.steps.every((s) => completed[s.id])).map((f) => f.id)
}

const logEntry = (xp: number, reason: string, log: XpEntry[]) =>
  [{ at: new Date().toISOString(), xp, reason }, ...log].slice(0, 100)

export const useProgress = create<ProgressState>()(
  persist(
    (set, get) => {
      /** Applies a patch, bumps today's streak, awards newly earned badges and raises toasts. */
      const settle = (patch: Partial<Data>, ctx: { lastHour?: number } = {}) => {
        const toast = useUi.getState().toast
        const today = todayKey()
        const prev = get()
        const next: Data = { ...prev, ...patch }
        if (prev.lastActive !== today) {
          const gap = prev.lastActive ? daysBetween(prev.lastActive, today) : null
          next.streak = gap === 1 ? prev.streak + 1 : 1
          next.lastActive = today
          const bonus = streakBonus(next.streak)
          if (bonus) {
            next.xp += bonus
            next.xpLog = logEntry(bonus, `${next.streak}-day streak`, next.xpLog)
            toast({ kind: 'xp', title: `${next.streak}-day streak!`, xp: bonus })
          }
        }
        next.floorsComplete = computeFloorsComplete(next.completed)
        // Loop because badge XP can itself unlock XP-threshold badges.
        for (let pass = 0; pass < 3; pass++) {
          const fresh = evaluateBadges(next, next.badges, ctx)
          if (!fresh.length) break
          next.badges = { ...next.badges }
          for (const b of fresh) {
            next.badges[b.id] = new Date().toISOString()
            if (b.xp) {
              next.xp += b.xp
              next.xpLog = logEntry(b.xp, `Badge: ${b.name}`, next.xpLog)
            }
            toast({ kind: 'badge', title: b.name, body: b.description, icon: b.icon, xp: b.xp })
          }
        }
        set(next)
      }

      return {
        ...initial,
        setName: (displayName) => set({ displayName }),

        completeStep: (stepId, quizScore, seconds) => {
          const found = findStep(stepId)
          if (!found) return { gained: 0, firstTime: false }
          const s = get()
          const prevRec = s.completed[stepId]
          const firstTime = !prevRec
          const perfect = quizScore >= 1
          const reward = stepReward(found.step.xp, quizScore, { perfect, firstTime })
          const score = Math.round(quizScore * 100)
          const rec: StepRecord = prevRec
            ? { ...prevRec, score: Math.max(prevRec.score, score), perfect: prevRec.perfect || perfect }
            : { xp: reward.total, score, at: new Date().toISOString(), perfect, seconds }
          const wasFloorDone = s.floorsComplete.includes(found.floor.id)
          settle(
            {
              completed: { ...s.completed, [stepId]: rec },
              xp: s.xp + reward.total,
              perfectQuizzes: s.perfectQuizzes + (perfect && (firstTime || !prevRec?.perfect) ? 1 : 0),
              xpLog: logEntry(reward.total, found.step.title, s.xpLog),
            },
            { lastHour: new Date().getHours() },
          )
          if (!wasFloorDone && get().floorsComplete.includes(found.floor.id)) {
            useUi.getState().toast({ kind: 'floor', title: `Floor ${found.floor.id} cleared!`, body: found.floor.title, icon: found.floor.icon })
          }
          return { gained: reward.total, firstTime }
        },

        recordGame: (kind, stage, score) => {
          const key = `${kind}:${stage}`
          const s = get()
          settle({ gameStages: { ...s.gameStages, [key]: Math.max(s.gameStages[key] ?? 0, score) } })
        },

        addXp: (xp, reason) => {
          const s = get()
          settle({ xp: s.xp + xp, xpLog: logEntry(xp, reason, s.xpLog) })
        },

        openResource: () => settle({ resourcesOpened: get().resourcesOpened + 1 }),
        toggleSaveJob: (id) => {
          const s = get()
          const has = s.savedJobs.includes(id)
          settle({ savedJobs: has ? s.savedJobs.filter((x) => x !== id) : [...s.savedJobs, id], jobsSaved: has ? s.jobsSaved : s.jobsSaved + 1 })
        },
        toggleSaveResource: (id) => {
          const s = get()
          set({ savedResources: s.savedResources.includes(id) ? s.savedResources.filter((x) => x !== id) : [...s.savedResources, id] })
        },
        applyJob: () => settle({ jobsApplied: get().jobsApplied + 1 }),
        setExam: (score, passed) => settle({ examScore: Math.max(score, get().examScore ?? 0), examPassed: get().examPassed || passed }),
        setCapstone: (capstone) => settle({ capstone, capstoneSubmitted: true }),
        setCertificate: (certificate) => settle({ certificate, certified: true }),

        mergeRemote: (r) => {
          const s = get()
          const completed = { ...(r.completed ?? {}), ...s.completed }
          set({
            completed,
            badges: { ...(r.badges ?? {}), ...s.badges },
            xp: Math.max(s.xp, r.xp ?? 0),
            streak: Math.max(s.streak, r.streak ?? 0),
            lastActive: s.lastActive ?? r.lastActive ?? null,
            floorsComplete: computeFloorsComplete(completed),
          })
        },

        reset: () => set({ ...initial }),
      }
    },
    { name: 'dataladder-progress', version: 1 },
  ),
)

export const badgeOf = (id: string) => BADGE_BY_ID[id]

/** First incomplete step in ladder order, or null when everything is done. */
export function nextStepId(completed: Record<string, StepRecord>): string | null {
  for (const f of floors) for (const s of f.steps) if (!completed[s.id]) return s.id
  return null
}

/** A floor unlocks once the floor below it is fully cleared. */
export function isFloorUnlocked(floorId: number, floorsComplete: number[]) {
  return floorId === 1 || floorsComplete.includes(floorId - 1)
}
