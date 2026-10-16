import { supabase } from './supabase'
import { useAuth } from '../store/auth'
import { useProgress } from '../store/progress'
import type { StepRecord } from '../engine/achievements'

/**
 * Two-way sync between the local progress store and Supabase.
 * Local state is the source of truth while playing; on sign-in remote rows are merged in,
 * and every change is pushed (debounced) while a session exists.
 */
export function startSync() {
  if (!supabase) return
  const db = supabase
  let userId: string | null = null
  let timer: ReturnType<typeof setTimeout> | undefined
  const pushed = { steps: new Set<string>(), badges: new Set<string>() }

  const pull = async (uid: string) => {
    const [prog, ach, stats] = await Promise.all([
      db.from('progress').select('step_id,xp,score,completed_at').eq('user_id', uid),
      db.from('achievements').select('badge_id,earned_at').eq('user_id', uid),
      db.from('user_stats').select('xp,streak,last_active').eq('user_id', uid).maybeSingle(),
    ])
    const completed: Record<string, StepRecord> = {}
    for (const r of prog.data ?? []) {
      completed[r.step_id] = { xp: r.xp, score: r.score, at: r.completed_at }
      pushed.steps.add(r.step_id)
    }
    const badges: Record<string, string> = {}
    for (const r of ach.data ?? []) {
      badges[r.badge_id] = r.earned_at
      pushed.badges.add(r.badge_id)
    }
    useProgress.getState().mergeRemote({
      completed,
      badges,
      xp: stats.data?.xp ?? 0,
      streak: stats.data?.streak ?? 0,
      lastActive: stats.data?.last_active ?? null,
    })
    schedulePush()
  }

  const push = async () => {
    if (!userId) return
    const s = useProgress.getState()
    const newSteps = Object.entries(s.completed).filter(([id]) => !pushed.steps.has(id))
    const newBadges = Object.entries(s.badges).filter(([id]) => !pushed.badges.has(id))
    if (newSteps.length) {
      const { error } = await db.from('progress').upsert(
        newSteps.map(([step_id, r]) => ({ user_id: userId, step_id, xp: r.xp, score: r.score, completed_at: r.at })),
      )
      if (!error) newSteps.forEach(([id]) => pushed.steps.add(id))
    }
    if (newBadges.length) {
      const { error } = await db.from('achievements').upsert(
        newBadges.map(([badge_id, earned_at]) => ({ user_id: userId, badge_id, earned_at })),
      )
      if (!error) newBadges.forEach(([id]) => pushed.badges.add(id))
    }
    await db.from('user_stats').upsert({ user_id: userId, xp: s.xp, streak: s.streak, last_active: s.lastActive, updated_at: new Date().toISOString() })
  }

  const schedulePush = () => {
    clearTimeout(timer)
    timer = setTimeout(push, 1500)
  }

  useAuth.subscribe((a, prev) => {
    const uid = a.session?.user.id ?? null
    if (uid === (prev.session?.user.id ?? null)) return
    userId = uid
    pushed.steps.clear()
    pushed.badges.clear()
    if (uid) pull(uid)
  })
  useProgress.subscribe(() => userId && schedulePush())
}
