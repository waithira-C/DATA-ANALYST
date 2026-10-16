import type { Resource } from '../lib/resources'
import { useProgress } from '../store/progress'

const TYPE_ICON: Record<string, string> = {
  video: '▶️', course: '🎓', article: '📰', book: '📖', dataset: '🗃️', practice: '🏋️', tool: '🛠️', community: '👥', certification: '📜',
}
const COST_STYLE: Record<string, string> = {
  free: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
  freemium: 'bg-sky-500/15 text-sky-300 border-sky-500/30',
  paid: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
}

export default function ResourceCard({ r, compact }: { r: Resource; compact?: boolean }) {
  const openResource = useProgress((s) => s.openResource)
  const saved = useProgress((s) => s.savedResources.includes(r.id))
  const toggle = useProgress((s) => s.toggleSaveResource)
  return (
    <article className="glass group flex flex-col rounded-2xl p-4 transition hover:border-white/25">
      <div className="flex items-start gap-3">
        <span className="text-xl" aria-hidden>{TYPE_ICON[r.type] ?? '🔗'}</span>
        <div className="min-w-0 flex-1">
          <a
            href={r.url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => openResource()}
            className="font-semibold leading-snug text-white hover:text-sky-300"
          >
            {r.title}
            <span className="sr-only"> (opens in new tab)</span>
          </a>
          <p className="text-xs text-ink-400">{r.provider}{r.est_hours ? ` · ~${r.est_hours}h` : ''}</p>
        </div>
        <button onClick={() => toggle(r.id)} aria-pressed={saved} aria-label={saved ? 'Remove bookmark' : 'Bookmark'} className="text-lg opacity-60 hover:opacity-100">
          {saved ? '★' : '☆'}
        </button>
      </div>
      {!compact && <p className="mt-2 line-clamp-3 text-sm text-ink-200">{r.summary}</p>}
      <div className="mt-3 flex flex-wrap gap-1.5">
        <span className={`chip border ${COST_STYLE[r.cost]}`}>{r.cost}</span>
        <span className="chip">{r.type}</span>
        {!compact && <span className="chip">Floor {r.level}</span>}
      </div>
    </article>
  )
}
