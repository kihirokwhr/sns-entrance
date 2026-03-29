export function FilterBadge() {
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold text-c-accent"
      style={{ border: '1px solid var(--c-accent-soft-bd)', background: 'var(--c-accent-soft)' }}
    >
      <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: 'var(--c-pulse)' }} />
      AI Filter ON
    </span>
  )
}
