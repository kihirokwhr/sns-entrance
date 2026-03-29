'use client'

import Link from 'next/link'
import type { Room } from '@/lib/types'

type Props = {
  rooms: Room[]
  currentUserId: string
  activeRoomId?: string
}

function getPartner(room: Room, userId: string) {
  return room.user1_id === userId ? room.user2 : room.user1
}

export function RoomList({ rooms, currentUserId, activeRoomId }: Props) {
  if (rooms.length === 0) {
    return (
      <p className="px-4 py-6 text-sm text-c-text-sub text-center">
        まだチャットがありません
      </p>
    )
  }

  return (
    <ul>
      {rooms.map((room) => {
        const partner = getPartner(room, currentUserId)
        const isActive = room.id === activeRoomId
        return (
          <li key={room.id}>
            <Link
              href={`/lobby/${room.id}`}
              className="flex items-center gap-3 px-4 py-3 transition-colors"
              style={{
                background: isActive ? 'var(--c-surface)' : 'transparent',
                borderLeft: isActive ? '2px solid var(--c-accent)' : '2px solid transparent',
              }}
            >
              <div className="w-9 h-9 rounded-full bg-c-surface flex items-center justify-center text-sm font-bold text-c-text shrink-0">
                {(partner?.display_name ?? '?')[0].toUpperCase()}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium text-c-text truncate">
                  {partner?.display_name ?? '不明'}
                </p>
                <p className="text-xs text-c-text-sub truncate">
                  {partner?.company ?? ''}{partner?.role ? ` · ${partner.role}` : ''}
                </p>
              </div>
              {room.status === 'handed_off' && (
                <span
                  className="ml-auto shrink-0 text-[10px] text-c-accent rounded px-1"
                  style={{ border: '1px solid var(--c-accent-soft-bd)' }}
                >
                  接続済
                </span>
              )}
            </Link>
          </li>
        )
      })}
    </ul>
  )
}
