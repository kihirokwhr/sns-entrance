'use client'

import { useEffect, useState, useCallback, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { RealtimeChannel } from '@supabase/supabase-js'
import type { Message } from '@/lib/types'

export function useRealtimeMessages(roomId: string, initialMessages: Message[]) {
  const [messages, setMessages] = useState<Message[]>(initialMessages)
  const channelRef = useRef<RealtimeChannel | null>(null)

  const addMessage = useCallback((msg: Message) => {
    setMessages((prev) => {
      if (prev.some((m) => m.id === msg.id)) return prev
      return [...prev, msg]
    })
  }, [])

  useEffect(() => {
    const supabase = createClient()

    const channel = supabase
      .channel(`room:${roomId}`)
      .on('broadcast', { event: 'new_message' }, async ({ payload }) => {
        // Fetch full message with sender profile when broadcast received
        const { data } = await supabase
          .from('messages')
          .select('*, sender:profiles(*)')
          .eq('id', payload.messageId)
          .single()
        if (data) addMessage(data as Message)
      })
      .subscribe()

    channelRef.current = channel

    return () => {
      supabase.removeChannel(channel)
      channelRef.current = null
    }
  }, [roomId, addMessage])

  // Broadcast messageId to all other participants in the room
  const broadcast = useCallback((messageId: string) => {
    channelRef.current?.send({
      type: 'broadcast',
      event: 'new_message',
      payload: { messageId },
    })
  }, [])

  return { messages, addMessage, broadcast }
}
