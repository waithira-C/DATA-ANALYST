import { NavLink, Outlet, Link, useLocation } from 'react-router-dom'
import { Suspense, useEffect } from 'react'
import { useProgress } from '../store/progress'
import { useAuth } from '../store/auth'
import { levelProgress, titleForLevel } from '../engine/xp'
import { hasBackend } from '../lib/supabase'
import Toasts from './Toasts'
import Spinner from './Spinner'

const NAV = [
  { to: '/', label: 'Ladder', icon: '🪜', end: true },
  { to: '/arcade', label: 'Arcade', icon: '🕹️' },
  { to: '/library', label: 'Library', icon: '📚' },
  { to: '/jobs', label: 'Jobs', icon: '💼' },
  { to: '/achievements', label: 'Badges', icon: '🏅' },
  { to: '/certificate', label: 'Certificate', icon: '🎓' },
]

export function XpBar({ compact }: { compact?: boolean }) {
  const xp = useProgress((s) => s.xp)
  const streak = useProgress((s) => s.streak)
  const { level, next, pct } = levelProgress(xp)
  return (
    <div className="flex items-center gap-3" title={`${xp} / ${next} XP`}>
      <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-sky-500 to-violet-500 font-display text-sm font-bold text-white shadow-lg">
        {level}
      </div>
      <div className={compact ? 'hidden w-28 sm:block' : 'w-40'}>
        <div className="flex justify-between gap-2 whitespace-nowrap text-[11px] text-ink-400">
          {!compact && <span className="truncate">{titleForLevel(level)}</span>}
          <span className={compact ? 'ml-auto' : ''}>{xp.toLocaleString()} XP</span>
        </div>
        <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-ink-700" role="progressbar" aria-valuenow={Math.round(pct * 100)} aria-valuemin={0} aria-valuemax={100} aria-label="Level progress">
          <div className="h-full rounded-full bg-gradient-to-r from-sky-400 to-violet-400 transition-all duration-700" style={{ width: `${pct * 100}%` }} />
        </div>
      </div>
      {streak > 0 && (
        <span className="chip" title="Daily streak">
          🔥 {streak}
        </span>
      )}
    </div>
  )
}

export default function Layout() {
  const session = useAuth((s) => s.session)
  const profile = useAuth((s) => s.profile)
  const { pathname } = useLocation()
  useEffect(() => { window.scrollTo(0, 0) }, [pathname])

  return (
    <div className="min-h-screen pb-20 md:pb-0">
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:left-3 focus:top-3 focus:z-50 btn btn-primary">Skip to content</a>
      <header className="glass sticky top-0 z-40 border-x-0 border-t-0">
        <div className="mx-auto flex h-14 max-w-7xl items-center gap-4 px-4">
          <Link to="/" className="flex items-center gap-2 font-display text-lg font-bold">
            <img src="/favicon.svg" alt="" className="h-7 w-7" />
            <span className="hidden sm:inline">Data<span className="glow-text">Ladder</span></span>
          </Link>
          <nav className="ml-4 hidden items-center gap-1 md:flex" aria-label="Main">
            {NAV.map((n) => (
              <NavLink
                key={n.to}
                to={n.to}
                end={n.end}
                className={({ isActive }) => `rounded-lg px-3 py-1.5 text-sm font-medium transition ${isActive ? 'bg-white/10 text-white' : 'text-ink-200 hover:bg-white/5 hover:text-white'}`}
              >
                {n.label}
              </NavLink>
            ))}
            {profile?.role === 'employer' && (
              <NavLink to="/hire" className={({ isActive }) => `rounded-lg px-3 py-1.5 text-sm font-medium ${isActive ? 'bg-white/10 text-white' : 'text-gold hover:bg-white/5'}`}>
                Hire
              </NavLink>
            )}
          </nav>
          <div className="ml-auto flex items-center gap-3">
            <XpBar compact />
            {hasBackend &&
              (session ? (
                <Link to="/auth" className="btn btn-ghost px-3 py-1.5 text-sm" aria-label="Account">
                  {(profile?.display_name ?? session.user.email ?? '?').slice(0, 1).toUpperCase()}
                </Link>
              ) : (
                <Link to="/auth" className="btn btn-ghost px-3 py-1.5 text-sm">Sign in</Link>
              ))}
          </div>
        </div>
      </header>

      <main id="main" className="mx-auto max-w-7xl px-4 py-6">
        {/* Keyed per route so navigation shows the new page's fallback instead of holding the old page. */}
        <Suspense key={pathname} fallback={<Spinner />}>
          <Outlet />
        </Suspense>
      </main>

      <footer className="mx-auto hidden max-w-7xl px-4 py-10 text-center text-xs text-ink-400 md:block">
        DataLadder · Free, open learning path for aspiring data analysts · Lessons are original; linked resources belong to their creators ·{' '}
        <Link to="/hire" className="underline hover:text-white">For employers</Link>
      </footer>

      <nav className="glass fixed inset-x-0 bottom-0 z-40 flex justify-around border-x-0 border-b-0 py-1.5 md:hidden" aria-label="Main mobile">
        {NAV.map((n) => (
          <NavLink key={n.to} to={n.to} end={n.end} className={({ isActive }) => `flex flex-col items-center rounded-lg px-2 py-1 text-[10px] ${isActive ? 'text-white' : 'text-ink-400'}`}>
            <span className="text-lg" aria-hidden>{n.icon}</span>
            {n.label}
          </NavLink>
        ))}
      </nav>
      <Toasts />
    </div>
  )
}
