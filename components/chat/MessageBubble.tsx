'use client'

import type { Message } from '@/lib/types'

type Props = {
  message: Message
  currentUserId: string
}

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' })
}

export function MessageBubble({ message, currentUserId }: Props) {
  const isSelf = message.sender_id === currentUserId

  if (isSelf) {
    return (
      <div className="flex flex-col items-end gap-1 mb-4">
        <span className="text-xs text-c-text-sub">{formatTime(message.created_at)}</span>
        {/* Original input */}
        <div
          className="max-w-[70%] rounded-xl rounded-tr-sm px-4 py-2"
          style={{ border: '1px solid var(--c-orig-bd)', background: 'var(--c-orig-soft)' }}
        >
          <p className="text-[10px] font-semibold mb-1 uppercase tracking-wider" style={{ color: 'var(--c-orig-label)' }}>
            YOUR INPUT
          </p>
          <p className="text-c-text-sub text-sm">{message.original_text}</p>
        </div>
        {/* Filtered output */}
        <div
          className="max-w-[70%] rounded-xl rounded-tr-sm px-4 py-2"
          style={{ border: '1px solid var(--c-filt-bd)', background: 'var(--c-filt-soft)' }}
        >
          <p className="text-[10px] font-semibold mb-1 uppercase tracking-wider" style={{ color: 'var(--c-filt-label)' }}>
            SENT MESSAGE
          </p>
          <p className="text-c-text text-sm">{message.filtered_text}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-start gap-1 mb-4">
      <div className="flex items-center gap-2">
        <div className="w-6 h-6 rounded-full bg-c-surface flex items-center justify-center text-xs text-c-text">
          {(message.sender?.display_name ?? '?')[0].toUpperCase()}
        </div>
        <span className="text-xs text-c-text-sub">
          {message.sender?.display_name ?? '不明'} · {formatTime(message.created_at)}
        </span>
      </div>
      <div
        className="max-w-[70%] ml-8 rounded-xl rounded-tl-sm px-4 py-2"
        style={{ background: 'var(--c-recv-bg)', border: '1px solid var(--c-recv-bd)' }}
      >
        <p className="text-c-text text-sm">{message.filtered_text}</p>
        <span className="text-[10px] mt-1 block text-c-accent">🛡 filtered</span>
      </div>
    </div>
  )
}
