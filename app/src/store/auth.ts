import { create } from 'zustand'
import type { Session } from '@supabase/supabase-js'
import { supabase } from '../lib/supabase'

export type Role = 'learner' | 'employer'
export interface Profile { id: string; display_name: string | null; role: Role; company: string | null; headline: string | null; is_public: boolean }

interface AuthState {
  ready: boolean
  session: Session | null
  profile: Profile | null
  init: () => void
  signUp: (email: string, password: string, displayName: string, role: Role) => Promise<string | null>
  signIn: (email: string, password: string) => Promise<string | null>
  signInWithGoogle: () => Promise<string | null>
  signOut: () => Promise<void>
  updateProfile: (p: Partial<Omit<Profile, 'id'>>) => Promise<string | null>
}

export const useAuth = create<AuthState>((set, get) => {
  const loadProfile = async (session: Session | null) => {
    if (!supabase || !session) return set({ profile: null })
    const { data } = await supabase.from('profiles').select('*').eq('id', session.user.id).maybeSingle()
    set({ profile: (data as Profile) ?? null })
  }

  return {
    ready: !supabase,
    session: null,
    profile: null,

    init: () => {
      if (!supabase) return
      supabase.auth.getSession().then(({ data }) => {
        set({ session: data.session, ready: true })
        loadProfile(data.session)
      })
      supabase.auth.onAuthStateChange((_e, session) => {
        set({ session })
        loadProfile(session)
      })
    },

    signUp: async (email, password, displayName, role) => {
      if (!supabase) return 'Accounts are not configured on this deployment.'
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { display_name: displayName, role }, emailRedirectTo: window.location.origin },
      })
      return error?.message ?? null
    },
    signIn: async (email, password) => {
      if (!supabase) return 'Accounts are not configured on this deployment.'
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      return error?.message ?? null
    },
    signInWithGoogle: async () => {
      if (!supabase) return 'Accounts are not configured on this deployment.'
      const { error } = await supabase.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: window.location.origin } })
      return error?.message ?? null
    },
    signOut: async () => {
      await supabase?.auth.signOut()
      set({ session: null, profile: null })
    },
    updateProfile: async (p) => {
      const { session, profile } = get()
      if (!supabase || !session) return 'Not signed in.'
      const { error } = await supabase.from('profiles').update(p).eq('id', session.user.id)
      if (!error && profile) set({ profile: { ...profile, ...p } })
      return error?.message ?? null
    },
  }
})
