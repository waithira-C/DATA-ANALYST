import { create } from 'zustand'

export interface Toast { id: number; kind: 'xp' | 'badge' | 'floor' | 'info'; title: string; body?: string; icon?: string; xp?: number }

interface UiState {
  toasts: Toast[]
  toast: (t: Omit<Toast, 'id'>) => void
  dismiss: (id: number) => void
}

let seq = 1
export const useUi = create<UiState>((set, get) => ({
  toasts: [],
  toast: (t) => {
    const id = seq++
    set({ toasts: [...get().toasts, { ...t, id }] })
    setTimeout(() => get().dismiss(id), t.kind === 'badge' || t.kind === 'floor' ? 5200 : 3200)
  },
  dismiss: (id) => set({ toasts: get().toasts.filter((x) => x.id !== id) }),
}))
