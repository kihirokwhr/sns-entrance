'use client'

type Props = { onConnect: () => void }

export function ConnectBanner({ onConnect }: Props) {
  return (
    <div
      className="mx-4 mb-2 flex items-center justify-between rounded-xl px-4 py-3"
      style={{ border: '1px solid var(--c-accent-soft-bd)', background: 'var(--c-accent-soft)' }}
    >
      <div>
        <p className="text-sm font-semibold text-c-accent">会話が盛り上がってきました！</p>
        <p className="text-xs text-c-text-sub">既存のSNSに移行してさらにつながりましょう</p>
      </div>
      <button
        onClick={onConnect}
        className="btn-accent rounded-lg px-4 py-2 text-sm font-semibold transition-colors"
      >
        接続する
      </button>
    </div>
  )
}
