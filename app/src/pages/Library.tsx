import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { resources, type ResourceType } from '../lib/resources'
import { floors } from '../content'
import ResourceCard from '../components/ResourceCard'
import { useProgress } from '../store/progress'

const TYPES: ResourceType[] = ['video', 'course', 'practice', 'article', 'book', 'dataset', 'tool', 'community', 'certification']

export default function Library() {
  const [params, setParams] = useSearchParams()
  const [q, setQ] = useState('')
  const [type, setType] = useState<string>('all')
  const [freeOnly, setFreeOnly] = useState(true)
  const [savedOnly, setSavedOnly] = useState(false)
  const saved = useProgress((s) => s.savedResources)
  const level = Number(params.get('level') ?? 0)

  const list = useMemo(() => {
    const needle = q.trim().toLowerCase()
    return resources
      .filter((r) => !level || r.level === level)
      .filter((r) => type === 'all' || r.type === type)
      .filter((r) => !freeOnly || r.cost === 'free')
      .filter((r) => !savedOnly || saved.includes(r.id))
      .filter((r) => !needle || `${r.title} ${r.provider} ${r.summary} ${r.skills.join(' ')}`.toLowerCase().includes(needle))
      .sort((a, b) => a.level - b.level)
  }, [q, type, freeOnly, savedOnly, saved, level])

  return (
    <div>
      <h1 className="font-display text-3xl font-bold">The <span className="glow-text">Library</span></h1>
      <p className="text-ink-400">{resources.length} hand-checked resources from across the web: courses, YouTube, practice sites, books, datasets and communities, mapped to each floor of the ladder.</p>

      <div className="glass mt-5 flex flex-col gap-3 rounded-2xl p-4">
        <div className="grid gap-3 md:grid-cols-[1fr_auto_auto]">
          <label htmlFor="lq" className="sr-only">Search the library</label>
          <input id="lq" className="input" placeholder="Search SQL, pivot tables, StatQuest, Power BI…" value={q} onChange={(e) => setQ(e.target.value)} />
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={freeOnly} onChange={(e) => setFreeOnly(e.target.checked)} className="accent-emerald-400" /> Free only</label>
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={savedOnly} onChange={(e) => setSavedOnly(e.target.checked)} className="accent-sky-400" /> Bookmarked ({saved.length})</label>
        </div>
        <div className="flex flex-wrap gap-1.5" role="group" aria-label="Floor">
          <button className={`chip ${!level ? 'bg-white/20 text-white' : ''}`} onClick={() => setParams({})}>All floors</button>
          {floors.map((f) => (
            <button key={f.id} className={`chip ${level === f.id ? 'bg-white/20 text-white' : ''}`} onClick={() => setParams({ level: String(f.id) })}>
              {f.icon} {f.id}. {f.title}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap gap-1.5" role="group" aria-label="Type">
          {['all', ...TYPES].map((t) => (
            <button key={t} className={`chip ${type === t ? 'bg-white/20 text-white' : ''}`} onClick={() => setType(t)}>{t}</button>
          ))}
        </div>
      </div>

      <p className="mt-4 text-sm text-ink-400">{list.length} resources</p>
      <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((r) => <ResourceCard key={r.id} r={r} />)}
      </div>
      {!list.length && <p className="py-16 text-center text-ink-400">Nothing matches. Try turning off "Free only".</p>}
    </div>
  )
}
