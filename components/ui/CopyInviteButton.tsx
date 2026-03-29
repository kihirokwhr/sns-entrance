'use client'

import { useState } from 'react'

type Props = { userId: string }

export function CopyInviteButton({ userId }: Props) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    const url = `${window.location.origin}/invite/${userId}`
    await navigator.clipboard.writeText(url)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <button
      onClick={handleCopy}
      className="w-full rounded-lg px-3 py-2 text-xs font-medium text-c-accent transition-colors text-left"
      style={{ border: '1px solid var(--c-accent-soft-bd)', background: 'var(--c-accent-soft)' }}
    >
      {copied ? '✅ コピーしました！' : '🔗 招待リンクをコピー'}
    </button>
  )
}
