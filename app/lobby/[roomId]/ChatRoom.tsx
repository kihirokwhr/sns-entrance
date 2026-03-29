'use client'

import { useEffect, useRef, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRealtimeMessages } from '@/hooks/useRealtimeMessages'
import { useRoom } from '@/hooks/useRoom'
import { MessageBubble } from '@/components/chat/MessageBubble'
import { ChatInput } from '@/components/chat/ChatInput'
import { ConnectBanner } from '@/components/chat/ConnectBanner'
import { ConnectModal } from '@/components/connect/ConnectModal'
import { FilterBadge } from '@/components/ui/FilterBadge'
import type { HandoffTarget, Message, Room } from '@/lib/types'

const HANDOFF_TRIGGER_COUNT = 10

type Props = {
  room: Room
  initialMessages: Message[]
  currentUserId: string
}

function getPartner(room: Room, userId: string) {
  return room.user1_id === userId ? room.user2 : room.user1
}

export function ChatRoom({ room: initialRoom, initialMessages, currentUserId }: Props) {
  const { room, handoff } = useRoom(initialRoom)
  const { messages, addMessage, broadcast } = useRealtimeMessages(room.id, initialMessages)
  const [showConnectModal, setShowConnectModal] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)
  const partner = getPartner(room, currentUserId)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = async (original: string, filtered: string) => {
    const supabase = createClient()
    const { data } = await supabase
      .from('messages')
      .insert({
        room_id: room.id,
        sender_id: currentUserId,
        original_text: original,
        filtered_text: filtered,
      })
      .select('*, sender:profiles(*)')
      .single()

    if (data) {
      addMessage(data as Message)
      broadcast(data.id)
    }
  }

  const handleHandoff = async (target: HandoffTarget) => {
    await handoff(target)
    setShowConnectModal(false)
  }

  const isHandedOff = room.status === 'handed_off'
  const showBanner = !isHandedOff && messages.length >= HANDOFF_TRIGGER_COUNT

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div
        className="flex items-center gap-3 px-6 py-4 shrink-0"
        style={{ borderBottom: '1px solid var(--c-border)' }}
      >
        <div className="w-9 h-9 rounded-full bg-c-surface flex items-center justify-center text-sm font-bold text-c-text">
          {(partner?.display_name ?? '?')[0].toUpperCase()}
        </div>
        <div>
          <p className="text-sm font-semibold text-c-text">{partner?.display_name ?? '不明'}</p>
          <p className="text-xs text-c-text-sub">
            {partner?.company}{partner?.role ? ` · ${partner.role}` : ''}
          </p>
        </div>
        <div className="ml-auto flex items-center gap-3">
          <FilterBadge />
          {!isHandedOff && (
            <button
              onClick={() => setShowConnectModal(true)}
              className="rounded-lg px-3 py-1.5 text-xs text-c-text-sub hover:text-c-accent transition-colors"
              style={{ border: '1px solid var(--c-border)' }}
            >
              SNSで接続
            </button>
          )}
          {isHandedOff && (
            <span
              className="rounded-lg px-3 py-1.5 text-xs text-c-accent"
              style={{ border: '1px solid var(--c-accent-soft-bd)', background: 'var(--c-accent-soft)' }}
            >
              {room.handed_off_to} に接続済み
            </span>
          )}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-6 py-4">
        {messages.length === 0 && (
          <div className="flex h-full items-center justify-center">
            <p className="text-sm text-c-text-sub">最初のメッセージを送ってみましょう</p>
          </div>
        )}
        {messages.map((msg) => (
          <MessageBubble key={msg.id} message={msg} currentUserId={currentUserId} />
        ))}
        <div ref={bottomRef} />
      </div>

      {showBanner && <ConnectBanner onConnect={() => setShowConnectModal(true)} />}

      <ChatInput onSend={handleSend} disabled={isHandedOff} />

      {isHandedOff && (
        <div className="px-6 py-3 bg-c-surface" style={{ borderTop: '1px solid var(--c-border)' }}>
          <p className="text-xs text-c-text-sub text-center">
            このチャットは読み取り専用です。{room.handed_off_to} で会話を続けましょう。
          </p>
        </div>
      )}

      {showConnectModal && (
        <ConnectModal onSelect={handleHandoff} onClose={() => setShowConnectModal(false)} />
      )}
    </div>
  )
}
