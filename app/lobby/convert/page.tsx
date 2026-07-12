'use client'

import { useState, useRef } from 'react'
import { UpgradeModal } from '@/components/ui/UpgradeModal'

const MAX_LENGTH = 500

type HistoryItem = { original: string; filtered: string }

export default function ConvertPage() {
  const [draft, setDraft] = useState('')
  const [result, setResult] = useState('')
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState(false)
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null)
  const [error, setError] = useState('')
  const [showUpgrade, setShowUpgrade] = useState(false)
  const [history, setHistory] = useState<HistoryItem[]>([])
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const copyText = async (text: string): Promise<boolean> => {
    try {
      await navigator.clipboard.writeText(text)
      return true
    } catch {
      return false
    }
  }

  const handleConvert = async () => {
    const text = draft.trim()
    if (!text || loading) return
    setLoading(true)
    setError('')
    setCopied(false)
    setResult('')
    try {
      const res = await fetch('/api/filter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      })
      if (res.status === 402) {
        setShowUpgrade(true)
        return
      }
      const data = await res.json()
      if (!res.ok || !data.filtered) {
        setError(data.error ?? '変換に失敗しました。もう一度お試しください。')
        return
      }
      setResult(data.filtered)
      setHistory((h) => [{ original: text, filtered: data.filtered }, ...h].slice(0, 5))
      // Copy immediately so the user can paste elsewhere right away
      setCopied(await copyText(data.filtered))
    } catch {
      setError('通信エラーが発生しました。もう一度お試しください。')
    } finally {
      setLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault()
      handleConvert()
    }
  }

  return (
    <div className="flex-1 overflow-y-auto">
      {showUpgrade && <UpgradeModal onClose={() => setShowUpgrade(false)} />}
      <div className="max-w-2xl mx-auto px-6 py-10">
        <div className="mb-8">
          <h1 className="text-xl font-bold text-c-text mb-1">⚡ 変換ツール</h1>
          <p className="text-sm text-c-text-sub">
            送りたい文を貼り付けて変換。結果は自動でコピーされるので、
            そのままフリマ・SNS・メールに貼り付けできます。
          </p>
        </div>

        <div className="mb-2">
          <textarea
            ref={textareaRef}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={handleKeyDown}
            rows={4}
            maxLength={MAX_LENGTH}
            autoFocus
            placeholder="送りたい文をそのまま貼り付け…（Ctrl+Enterで変換）"
            className="w-full resize-none rounded-xl px-4 py-3 text-sm text-c-text placeholder-c-text-muted focus:outline-none"
            style={{ background: 'var(--c-surface)', border: '1px solid var(--c-border)' }}
          />
          <div className="flex items-center justify-between mt-2">
            <span className="text-xs text-c-text-muted">
              {draft.length}/{MAX_LENGTH}
            </span>
            <button
              onClick={handleConvert}
              disabled={!draft.trim() || loading}
              className="btn-accent rounded-xl px-6 py-3 text-sm font-semibold transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {loading ? '変換中…' : '変換してコピー'}
            </button>
          </div>
        </div>

        {error && (
          <p
            className="rounded-lg px-4 py-2 text-xs text-red-400 mb-4"
            style={{ background: 'rgb(239 68 68 / 0.1)', border: '1px solid rgb(239 68 68 / 0.3)' }}
          >
            {error}
          </p>
        )}

        {result && (
          <div
            className="rounded-xl p-5 animate-[fadeIn_0.3s_ease]"
            style={{ background: 'var(--c-accent-soft)', border: '1px solid var(--c-accent-soft-bd)' }}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-c-accent">変換結果</span>
              <button
                onClick={async () => setCopied(await copyText(result))}
                className="text-xs font-semibold rounded-lg px-3 py-1.5 transition-colors"
                style={
                  copied
                    ? { color: 'var(--c-accent)', border: '1px solid var(--c-accent-soft-bd)' }
                    : { color: 'var(--c-accent-fg)', background: 'var(--c-accent)' }
                }
              >
                {copied ? '✓ コピーしました' : 'コピー'}
              </button>
            </div>
            <p className="text-sm text-c-text leading-relaxed whitespace-pre-wrap">{result}</p>
          </div>
        )}

        {history.length > 1 && (
          <div className="mt-10">
            <p className="text-xs font-semibold text-c-text-sub uppercase tracking-wider mb-3">
              このセッションの履歴
            </p>
            <div className="space-y-2">
              {history.slice(1).map((item, i) => (
                <div
                  key={i}
                  className="rounded-xl px-4 py-3 flex items-start justify-between gap-3"
                  style={{ background: 'var(--c-surface)', border: '1px solid var(--c-border)' }}
                >
                  <div className="min-w-0">
                    <p className="text-xs text-c-text-muted truncate mb-1">{item.original}</p>
                    <p className="text-sm text-c-text">{item.filtered}</p>
                  </div>
                  <button
                    onClick={async () => {
                      if (await copyText(item.filtered)) setCopiedIdx(i)
                    }}
                    className="shrink-0 text-xs text-c-text-sub hover:text-c-accent transition-colors"
                  >
                    {copiedIdx === i ? '✓' : 'コピー'}
                  </button>
                </div>
              ))}
            </div>
            <p className="text-xs text-c-text-muted mt-3">
              ※履歴はこの画面を開いている間だけ保持されます（保存はされません）
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
