'use client'

import type { HandoffTarget } from '@/lib/types'

const PLATFORMS: { id: HandoffTarget; label: string; icon: string; description: string }[] = [
  { id: 'linkedin',  label: 'LinkedIn',       icon: '💼', description: 'プロフィールURLを共有' },
  { id: 'slack',     label: 'Slack',           icon: '💬', description: 'ワークスペース招待リンクを共有' },
  { id: 'teams',     label: 'Microsoft Teams', icon: '🏢', description: '連絡先情報を共有' },
  { id: 'wantedly', label: 'Wantedly',         icon: '🤝', description: 'プロフィールURLを共有' },
  { id: 'email',    label: 'メールアドレス',   icon: '✉️', description: 'メールアドレスを直接共有' },
]

type Props = { onSelect: (target: HandoffTarget) => void; onClose: () => void }

export function ConnectModal({ onSelect, onClose }: Props) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div
        className="w-full max-w-sm rounded-2xl p-6 shadow-2xl"
        style={{ background: 'var(--c-bg)', border: '1px solid var(--c-border)' }}
      >
        <h2 className="text-lg font-bold text-c-text mb-1">SNSで繋がる</h2>
        <p className="text-sm text-c-text-sub mb-5">移行先のプラットフォームを選んでください</p>
        <div className="flex flex-col gap-2">
          {PLATFORMS.map((p) => (
            <button
              key={p.id}
              onClick={() => onSelect(p.id)}
              className="flex items-center gap-4 rounded-xl px-4 py-3 text-left transition-colors"
              style={{ background: 'var(--c-surface)', border: '1px solid var(--c-border)' }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'var(--c-accent-soft-bd)'
                e.currentTarget.style.background = 'var(--c-accent-soft)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'var(--c-border)'
                e.currentTarget.style.background = 'var(--c-surface)'
              }}
            >
              <span className="text-2xl">{p.icon}</span>
              <div>
                <p className="text-sm font-semibold text-c-text">{p.label}</p>
                <p className="text-xs text-c-text-sub">{p.description}</p>
              </div>
            </button>
          ))}
        </div>
        <button
          onClick={onClose}
          className="mt-4 w-full rounded-xl py-2 text-sm text-c-text-sub hover:text-c-text transition-colors"
          style={{ border: '1px solid var(--c-border)' }}
        >
          キャンセル
        </button>
      </div>
    </div>
  )
}
