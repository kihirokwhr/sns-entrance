'use client'

import { useState } from 'react'

type Props = {
  plan: string
  filterCount: number
  filterResetAt: string
}

const FREE_LIMIT = 100

export function PlanActions({ plan, filterCount, filterResetAt }: Props) {
  const [loading, setLoading] = useState<'checkout' | 'portal' | null>(null)

  const now = new Date()
  const resetAt = new Date(filterResetAt)
  const currentCount =
    now.getMonth() === resetAt.getMonth() && now.getFullYear() === resetAt.getFullYear()
      ? filterCount
      : 0

  const handleCheckout = async () => {
    setLoading('checkout')
    const res = await fetch('/api/stripe/checkout', { method: 'POST' })
    const { url } = await res.json()
    window.location.href = url
  }

  const handlePortal = async () => {
    setLoading('portal')
    const res = await fetch('/api/stripe/portal', { method: 'POST' })
    const { url } = await res.json()
    window.location.href = url
  }

  const pct = Math.min((currentCount / FREE_LIMIT) * 100, 100)
  const isNearLimit = currentCount >= FREE_LIMIT * 0.8

  return (
    <div className="space-y-2">
      {plan === 'free' ? (
        <>
          <div className="flex items-center justify-between">
            <span className="text-xs text-c-text-sub">今月のフィルター</span>
            <span className="text-xs" style={{ color: isNearLimit ? '#ef4444' : 'var(--c-text-sub)' }}>
              {currentCount}/{FREE_LIMIT}
            </span>
          </div>
          <div className="w-full rounded-full h-1" style={{ background: 'var(--c-border)' }}>
            <div
              className="h-1 rounded-full transition-all"
              style={{
                width: `${pct}%`,
                background: isNearLimit ? '#ef4444' : 'var(--c-accent)',
              }}
            />
          </div>
          <button
            onClick={handleCheckout}
            disabled={!!loading}
            className="w-full text-xs font-semibold py-2 rounded-lg btn-accent disabled:opacity-50 transition-opacity"
          >
            {loading === 'checkout' ? '処理中...' : 'Pro へアップグレード ¥500/月'}
          </button>
        </>
      ) : (
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-c-accent">✓ Pro プラン</span>
          <button
            onClick={handlePortal}
            disabled={!!loading}
            className="text-xs text-c-text-sub hover:text-c-text transition-colors disabled:opacity-50"
          >
            {loading === 'portal' ? '...' : 'サブスク管理'}
          </button>
        </div>
      )}

      <a
        href="https://ko-fi.com/sns_entrance"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2 text-xs text-c-text-sub hover:text-c-text transition-colors"
      >
        <span>☕</span>
        <span>開発を支援する</span>
      </a>
    </div>
  )
}
