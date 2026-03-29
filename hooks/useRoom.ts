'use client'

import { useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { HandoffTarget, Room } from '@/lib/types'

export function useRoom(initialRoom: Room) {
  const [room, setRoom] = useState<Room>(initialRoom)

  const handoff = useCallback(async (target: HandoffTarget) => {
    const supabase = createClient()
    const { data } = await supabase
      .from('rooms')
      .update({ status: 'handed_off', handed_off_to: target })
      .eq('id', room.id)
      .select()
      .single()

    if (data) setRoom(data as Room)
  }, [room.id])

  return { room, handoff }
}
