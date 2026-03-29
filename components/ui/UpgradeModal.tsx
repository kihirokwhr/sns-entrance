'use client'

import { useState } from 'react'

export function UpgradeModal({ onClose }: { onClose: () => void }) {
  const [loading, setLoading] = useState(false)

  const handleUpgrade = async () => {
    setLoading(true)
    const res = await fetch('/api/stripe/checkout', { method: 'POST' })
    const { url } = await res.json()
    window.location.href = url
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50" style={{ background: 'rgba(0,0,0,0.6)' }}>
      <div className="rounded-2xl p-8 max-w-sm w-full mx-4" style={{ background: 'var(--c-surface)', border: '1px solid var(--c-border)' }}>
        <h2 className="text-c-text text-xl font-bold mb-2">今月の上限に達しました</h2>
        <p className="text-c-text-sub text-sm mb-6">
          無料プランはAIフィルターを月100通まで利用できます。<br />
          Proプランで無制限にご利用いただけます。
        </p>

        <div className="rounded-xl p-4 mb-6" style={{ background: 'var(--c-accent-soft)', border: '1px solid var(--c-accent-soft-bd)' }}>
          <p className="text-c-accent font-bold text-lg">Pro プラン</p>
          <p className="text-c-text font-bold text-3xl mt-1">
            ¥500<span className="text-c-text-sub text-sm font-normal">/月</span>
          </p>
          <ul className="mt-3 space-y-1">
            <li className="text-c-text-sub text-sm">✓ AIフィルター 無制限</li>
            <li className="text-c-text-sub text-sm">✓ いつでもキャンセル可能</li>
          </ul>
        </div>

        <button
          onClick={handleUpgrade}
          disabled={loading}
          className="w-full btn-accent font-semibold py-3 rounded-xl transition-opacity disabled:opacity-50"
        >
          {loading ? '処理中...' : 'Pro にアップグレード'}
        </button>
        <button
          onClick={onClose}
          className="w-full mt-3 text-c-text-sub text-sm hover:text-c-text transition-colors"
        >
          あとで
        </button>
      </div>
    </div>
  )
}
