import raw from '../data/resources.json'
import type { Skill } from '../content/types'

export type ResourceType = 'video' | 'course' | 'article' | 'book' | 'dataset' | 'practice' | 'tool' | 'community' | 'certification'
export type Cost = 'free' | 'freemium' | 'paid'

export interface Resource {
  id: string
  title: string
  url: string
  provider: string
  type: ResourceType
  cost: Cost
  level: number
  skills: Skill[]
  est_hours: number | null
  summary: string
  youtube_id?: string | null
  dead?: boolean
  verified_at?: string
}

export const resources: Resource[] = (raw as Resource[]).filter((r) => !r.dead)

const COST_RANK: Record<Cost, number> = { free: 0, freemium: 1, paid: 2 }
const TYPE_RANK: Partial<Record<ResourceType, number>> = { video: 0, course: 1, practice: 2, article: 3, book: 4 }

/** Best "go deeper" resources for a step: matching skills, near the floor's level, free first. */
export function resourcesFor(skills: Skill[], level: number, limit = 3): Resource[] {
  const wanted = new Set(skills)
  return resources
    .map((r) => {
      const overlap = r.skills.filter((s) => wanted.has(s)).length
      const levelDist = Math.abs(r.level - level)
      return { r, score: overlap * 10 - levelDist * 3 - COST_RANK[r.cost] * 2 - (TYPE_RANK[r.type] ?? 5) * 0.5 }
    })
    .filter((x) => x.score > 0 && x.r.skills.some((s) => wanted.has(s)))
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((x) => x.r)
}

/** First embeddable YouTube video relevant to the given skills/level. */
export function videoFor(skills: Skill[], level: number): Resource | undefined {
  return resourcesFor(skills, level, 30).find((r) => r.youtube_id)
}
