'use client'

type Props = {
  original: string
  filtered: string
  isLoading?: boolean
}

export function TransformView({ original, filtered, isLoading }: Props) {
  if (!original && !isLoading) return null

  return (
    <div
      className="mx-4 mb-2 grid grid-cols-2 gap-2 rounded-xl p-3"
      style={{ background: 'var(--c-bg)', border: '1px solid var(--c-border)' }}
    >
      <div style={{ borderRight: '1px solid var(--c-border)' }} className="pr-3">
        <p className="text-[10px] font-semibold uppercase tracking-wider mb-1" style={{ color: 'var(--c-orig-label)' }}>
          YOUR INPUT
        </p>
        <p className="text-c-text-sub text-xs leading-relaxed">{original}</p>
      </div>
      <div className="pl-3">
        <p className="text-[10px] font-semibold uppercase tracking-wider mb-1" style={{ color: 'var(--c-filt-label)' }}>
          AI FILTERED
        </p>
        {isLoading ? (
          <div className="flex gap-1 mt-2">
            {[0, 150, 300].map((d) => (
              <span
                key={d}
                className="w-1.5 h-1.5 rounded-full animate-bounce"
                style={{ background: 'var(--c-accent)', animationDelay: `${d}ms` }}
              />
            ))}
          </div>
        ) : (
          <p className="text-c-text text-xs leading-relaxed">{filtered}</p>
        )}
      </div>
    </div>
  )
}
