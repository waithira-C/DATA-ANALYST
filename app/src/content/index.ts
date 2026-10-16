import type { Floor, Step } from './types'
import { floor1 } from './floors/floor1'
import { floor2 } from './floors/floor2'
import { floor3 } from './floors/floor3'
import { floor4 } from './floors/floor4'
import { floor5 } from './floors/floor5'
import { floor6 } from './floors/floor6'
import { floor7 } from './floors/floor7'
import { floor8 } from './floors/floor8'
import { floor9 } from './floors/floor9'
import { floor10 } from './floors/floor10'

export const floors: Floor[] = [floor1, floor2, floor3, floor4, floor5, floor6, floor7, floor8, floor9, floor10]

export const allSteps: Step[] = floors.flatMap((f) => f.steps)

const stepIndex = new Map<string, { floor: Floor; step: Step; index: number }>()
for (const f of floors) f.steps.forEach((s, i) => stepIndex.set(s.id, { floor: f, step: s, index: i }))

export function findStep(id: string) {
  return stepIndex.get(id)
}

export function getFloor(id: number) {
  return floors.find((f) => f.id === id)
}

export const TOTAL_XP_AVAILABLE = allSteps.reduce((n, s) => n + s.xp, 0)
