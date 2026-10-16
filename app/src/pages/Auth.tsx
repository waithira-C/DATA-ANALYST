import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth, type Role } from '../store/auth'
import { useProgress } from '../store/progress'
import { hasBackend } from '../lib/supabase'

export default function Auth() {
  const { session, profile, signIn, signUp, signInWithGoogle, signOut, updateProfile } = useAuth()
  const setName = useProgress((s) => s.setName)
  const navigate = useNavigate()
  const [mode, setMode] = useState<'in' | 'up'>('in')
  const [role, setRole] = useState<Role>('learner')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setNameDraft] = useState('')
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null)
  const [busy, setBusy] = useState(false)

  if (!hasBackend) {
    return (
      <div className="glass mx-auto max-w-md rounded-3xl p-8 text-center">
        <h1 className="font-display text-2xl font-bold">Offline mode</h1>
        <p className="mt-2 text-ink-400">Accounts aren't configured on this deployment. Your progress is saved in this browser. Set <code>VITE_SUPABASE_URL</code> and <code>VITE_SUPABASE_ANON_KEY</code> to enable sign-in, cloud sync and verifiable certificates.</p>
        <Link to="/" className="btn btn-primary mt-6">Keep learning</Link>
      </div>
    )
  }

  if (session) {
    return (
      <div className="glass mx-auto max-w-md rounded-3xl p-8">
        <h1 className="font-display text-2xl font-bold">Your account</h1>
        <p className="mt-1 text-ink-400">{session.user.email}</p>
        <dl className="mt-4 space-y-2 text-sm">
          <div className="flex justify-between"><dt className="text-ink-400">Name</dt><dd>{profile?.display_name ?? '—'}</dd></div>
          <div className="flex justify-between"><dt className="text-ink-400">Account type</dt><dd className="capitalize">{profile?.role ?? 'learner'}</dd></div>
        </dl>
        <label className="mt-5 flex items-center justify-between gap-3 rounded-xl bg-white/5 p-3 text-sm">
          <span>Show me on the public leaderboard and to employers</span>
          <input type="checkbox" className="h-5 w-5 accent-sky-400" checked={!!profile?.is_public} onChange={(e) => updateProfile({ is_public: e.target.checked })} />
        </label>
        <div className="mt-6 flex gap-3">
          {profile?.role === 'employer' && <Link to="/hire" className="btn btn-primary">Employer portal</Link>}
          <button className="btn btn-ghost" onClick={() => signOut()}>Sign out</button>
        </div>
      </div>
    )
  }

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setBusy(true)
    setMsg(null)
    const err = mode === 'in' ? await signIn(email, password) : await signUp(email, password, name, role)
    setBusy(false)
    if (err) return setMsg({ ok: false, text: err })
    if (mode === 'up') {
      if (name) setName(name)
      setMsg({ ok: true, text: 'Check your inbox to confirm your email, then sign in.' })
    } else navigate(role === 'employer' ? '/hire' : '/')
  }

  return (
    <div className="glass mx-auto max-w-md rounded-3xl p-8">
      <div className="flex rounded-xl bg-ink-900 p-1 text-sm" role="tablist">
        {(['in', 'up'] as const).map((m) => (
          <button key={m} role="tab" aria-selected={mode === m} onClick={() => setMode(m)} className={`flex-1 rounded-lg py-2 font-semibold ${mode === m ? 'bg-white/15' : 'text-ink-400'}`}>{m === 'in' ? 'Sign in' : 'Create account'}</button>
        ))}
      </div>
      <p className="mt-4 text-sm text-ink-400">Save progress across devices and earn a verifiable certificate. Your current progress merges in automatically.</p>
      <form onSubmit={submit} className="mt-4 grid gap-3">
        {mode === 'up' && (
          <>
            <div className="grid grid-cols-2 gap-2" role="radiogroup" aria-label="Account type">
              {(['learner', 'employer'] as const).map((r) => (
                <button type="button" key={r} role="radio" aria-checked={role === r} onClick={() => setRole(r)} className={`rounded-xl border p-3 text-left text-sm ${role === r ? 'border-sky-400 bg-sky-500/10' : 'border-white/10'}`}>
                  <span className="text-xl">{r === 'learner' ? '🎒' : '🏢'}</span>
                  <span className="block font-semibold capitalize">{r}</span>
                  <span className="text-xs text-ink-400">{r === 'learner' ? 'I want to become an analyst' : 'I want to hire analysts'}</span>
                </button>
              ))}
            </div>
            <input className="input" placeholder={role === 'employer' ? 'Your name' : 'Display name'} value={name} onChange={(e) => setNameDraft(e.target.value)} required aria-label="Name" />
          </>
        )}
        <input className="input" type="email" autoComplete="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required aria-label="Email" />
        <input className="input" type="password" autoComplete={mode === 'in' ? 'current-password' : 'new-password'} placeholder="Password (8+ characters)" minLength={8} value={password} onChange={(e) => setPassword(e.target.value)} required aria-label="Password" />
        <button className="btn btn-primary" disabled={busy}>{busy ? 'Please wait…' : mode === 'in' ? 'Sign in' : 'Create account'}</button>
      </form>
      <button className="btn btn-ghost mt-3 w-full" onClick={async () => { const e = await signInWithGoogle(); if (e) setMsg({ ok: false, text: e }) }}>Continue with Google</button>
      {msg && <p className={`mt-4 rounded-xl p-3 text-sm ${msg.ok ? 'bg-emerald-500/10 text-emerald-200' : 'bg-rose-500/10 text-rose-200'}`} role="status">{msg.text}</p>}
    </div>
  )
}
