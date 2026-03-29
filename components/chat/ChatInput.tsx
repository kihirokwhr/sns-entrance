'use client'

import { useState, useRef } from 'react'
import { TransformView } from './TransformView'
import { UpgradeModal } from '@/components/ui/UpgradeModal'

type Props = {
  onSend: (original: string, filtered: string) => Promise<void>
  disabled?: boolean
}

async function callFilterApi(text: string): Promise<{ filtered: string; limitReached?: boolean }> {
  const res = await fetch('/api/filter', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text }),
  })
  if (res.status === 402) return { filtered: text, limitReached: true }
  const data = await res.json()
  return { filtered: data.filtered ?? text }
}

export function ChatInput({ onSend, disabled }: Props) {
  const [draft, setDraft] = useState('')
  const [filtered, setFiltered] = useState('')
  const [isFiltering, setIsFiltering] = useState(false)
  const [isSending, setIsSending] = useState(false)
  const [showUpgrade, setShowUpgrade] = useState(false)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const handleChange = (value: string) => {
    setDraft(value)
    setFiltered('')
    if (debounceRef.current) clearTimeout(debounceRef.current)
    if (!value.trim()) return

    debounceRef.current = setTimeout(async () => {
      setIsFiltering(true)
      try {
        const result = await callFilterApi(value)
        if (result.limitReached) {
          setShowUpgrade(true)
          setFiltered(value)
        } else {
          setFiltered(result.filtered)
        }
      } catch {
        setFiltered(value)
      } finally {
        setIsFiltering(false)
      }
    }, 700)
  }

  const handleSend = async () => {
    if (!draft.trim() || isSending) return
    if (debounceRef.current) clearTimeout(debounceRef.current)

    setIsSending(true)
    try {
      let finalFiltered = filtered
      if (!finalFiltered) {
        setIsFiltering(true)
        try {
          const result = await callFilterApi(draft)
          if (result.limitReached) {
            setShowUpgrade(true)
            setIsSending(false)
            setIsFiltering(false)
            return
          }
          finalFiltered = result.filtered
          setFiltered(finalFiltered)
        } catch {
          finalFiltered = draft
        } finally {
          setIsFiltering(false)
        }
      }
      await onSend(draft, finalFiltered)
      setDraft('')
      setFiltered('')
    } finally {
      setIsSending(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const sendLabel = isSending
    ? isFiltering ? 'フィルター中...' : '送信中...'
    : '送信'

  return (
    <div style={{ borderTop: '1px solid var(--c-border)' }}>
      {showUpgrade && <UpgradeModal onClose={() => setShowUpgrade(false)} />}
      <TransformView original={draft} filtered={filtered} isLoading={isFiltering} />
      <div className="flex items-end gap-2 p-4">
        <textarea
          value={draft}
          onChange={(e) => handleChange(e.target.value)}
          onKeyDown={handleKeyDown}
          rows={2}
          placeholder="メッセージを入力… (Enterで送信、Shift+Enterで改行)"
          disabled={disabled || isSending}
          className="flex-1 resize-none rounded-xl px-4 py-3 text-sm text-c-text placeholder-c-text-muted focus:outline-none disabled:opacity-50"
          style={{ background: 'var(--c-surface)', border: '1px solid var(--c-border)' }}
        />
        <button
          onClick={handleSend}
          disabled={!draft.trim() || isSending || disabled}
          className="btn-accent rounded-xl px-4 py-3 text-sm font-semibold transition-colors min-w-[80px] disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {sendLabel}
        </button>
      </div>
    </div>
  )
}
