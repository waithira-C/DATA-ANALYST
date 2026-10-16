export default function Spinner({ full, label }: { full?: boolean; label?: string }) {
  return (
    <div className={`flex flex-col items-center justify-center gap-3 text-ink-400 ${full ? 'min-h-screen' : 'py-16'}`} role="status">
      <div className="h-9 w-9 animate-spin rounded-full border-2 border-ink-600 border-t-brand" />
      <span className="text-sm">{label ?? 'Loading…'}</span>
    </div>
  )
}
