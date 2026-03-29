import { notFound, redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { ChatRoom } from './ChatRoom'
import type { Message, Room } from '@/lib/types'

type Props = {
  params: Promise<{ roomId: string }>
}

export default async function RoomPage({ params }: Props) {
  const { roomId } = await params
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // Fetch room with profiles
  const { data: room } = await supabase
    .from('rooms')
    .select('*, user1:profiles!rooms_user1_id_fkey(*), user2:profiles!rooms_user2_id_fkey(*)')
    .eq('id', roomId)
    .single()

  if (!room) notFound()

  // Verify user is a participant
  if (room.user1_id !== user.id && room.user2_id !== user.id) {
    redirect('/lobby')
  }

  // Fetch initial messages
  const { data: messages } = await supabase
    .from('messages')
    .select('*, sender:profiles(*)')
    .eq('room_id', roomId)
    .order('created_at', { ascending: true })

  return (
    <ChatRoom
      room={room as Room}
      initialMessages={(messages ?? []) as Message[]}
      currentUserId={user.id}
    />
  )
}
