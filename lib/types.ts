export type Profile = {
  id: string
  display_name: string
  company: string | null
  role: string | null
  bio: string | null
  avatar_url: string | null
  created_at: string
}

export type RoomStatus = 'active' | 'handed_off' | 'closed'

export type HandoffTarget = 'slack' | 'linkedin' | 'teams' | 'wantedly' | 'email'

export type Room = {
  id: string
  user1_id: string
  user2_id: string
  status: RoomStatus
  handed_off_to: HandoffTarget | null
  created_at: string
  // joined
  user1?: Profile
  user2?: Profile
}

export type Message = {
  id: string
  room_id: string
  sender_id: string
  original_text: string   // only shown to sender
  filtered_text: string   // shown to both parties
  created_at: string
  sender?: Profile
}
