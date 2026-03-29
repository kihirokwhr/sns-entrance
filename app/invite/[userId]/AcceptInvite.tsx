'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import type { Profile } from '@/lib/types'

type Props = {
  inviter: Profile
  currentUserId: string
}

export function AcceptInvite({ inviter, currentUserId }: Props) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handleAccept = async () => {
    setLoading(true)
    const supabase = createClient()

    // Check if room already exists
    const { data: existing } = await supabase
      .from('rooms')
      .select('id')
      .or(
        `and(user1_id.eq.${currentUserId},user2_id.eq.${inviter.id}),and(user1_id.eq.${inviter.id},user2_id.eq.${currentUserId})`
      )
      .maybeSingle()

    if (existing) {
      router.push(`/lobby/${existing.id}`)
      return
    }

    // Create new room
    const { data: room, error } = await supabase
      .from('rooms')
      .insert({ user1_id: currentUserId, user2_id: inviter.id })
      .select('id')
      .single()

    if (error || !room) {
      setLoading(false)
      alert('ルームの作成に失敗しました')
      return
    }

    router.push(`/lobby/${room.id}`)
  }

  return (
    <button
      onClick={handleAccept}
      disabled={loading}
      className="btn-accent rounded-xl px-8 py-3 text-base font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {loading ? '準備中...' : 'チャットを始める'}
    </button>
  )
}
