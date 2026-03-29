import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { RoomList } from '@/components/sidebar/RoomList'
import { FilterBadge } from '@/components/ui/FilterBadge'
import { ThemeToggle } from '@/components/ui/ThemeToggle'
import { CopyInviteButton } from '@/components/ui/CopyInviteButton'
import { PlanActions } from '@/components/sidebar/PlanActions'
import type { Room } from '@/lib/types'

export default async function LobbyLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const [{ data: rooms }, { data: profile }] = await Promise.all([
    supabase
      .from('rooms')
      .select('*, user1:profiles!rooms_user1_id_fkey(*), user2:profiles!rooms_user2_id_fkey(*)')
      .or(`user1_id.eq.${user.id},user2_id.eq.${user.id}`)
      .order('created_at', { ascending: false }),
    supabase
      .from('profiles')
      .select('plan, filter_count, filter_count_reset_at')
      .eq('id', user.id)
      .single(),
  ])

  return (
    <div className="flex h-full">
      {/* Sidebar */}
      <aside
        className="w-64 shrink-0 flex flex-col"
        style={{ borderRight: '1px solid var(--c-border)' }}
      >
        <div className="p-4" style={{ borderBottom: '1px solid var(--c-border)' }}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-bold text-c-text tracking-wide">SNS ENTRANCE</span>
            <ThemeToggle />
          </div>
          <FilterBadge />
        </div>

        <div className="flex-1 overflow-y-auto py-2">
          <RoomList rooms={(rooms ?? []) as Room[]} currentUserId={user.id} />
        </div>

        <div className="p-4 flex flex-col gap-3" style={{ borderTop: '1px solid var(--c-border)' }}>
          <PlanActions
            plan={profile?.plan ?? 'free'}
            filterCount={profile?.filter_count ?? 0}
            filterResetAt={profile?.filter_count_reset_at ?? new Date().toISOString()}
          />
          <div style={{ borderTop: '1px solid var(--c-border)', paddingTop: '12px' }} className="flex flex-col gap-2">
            <CopyInviteButton userId={user.id} />
            <p className="text-xs text-c-text-sub truncate">{user.email}</p>
          </div>
        </div>
      </aside>

      <main className="flex-1 flex flex-col overflow-hidden">
        {children}
      </main>
    </div>
  )
}
