import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { AcceptInvite } from './AcceptInvite'
import type { Profile } from '@/lib/types'

type Props = { params: Promise<{ userId: string }> }

export default async function InvitePage({ params }: Props) {
  const { userId } = await params
  const supabase = await createClient()

  // Fetch inviting user's profile
  const { data: inviter } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()

  if (!inviter) {
    return (
      <div className="flex min-h-full items-center justify-center">
        <p className="text-c-text-sub">招待リンクが無効です</p>
      </div>
    )
  }

  // Check current user
  const { data: { user } } = await supabase.auth.getUser()

  // Self-invite guard
  if (user?.id === userId) {
    redirect('/lobby')
  }

  return (
    <div className="flex min-h-full items-center justify-center px-6 py-24">
      <div
        className="w-full max-w-sm rounded-2xl p-8 text-center"
        style={{ border: '1px solid var(--c-border)', background: 'var(--c-surface)' }}
      >
        {/* Inviter avatar */}
        <div className="w-16 h-16 rounded-full bg-c-bg flex items-center justify-center text-2xl font-bold text-c-text mx-auto mb-4">
          {inviter.display_name[0].toUpperCase()}
        </div>

        <p className="text-xs text-c-text-sub mb-1">招待</p>
        <h1 className="text-xl font-bold text-c-text mb-1">{inviter.display_name}</h1>
        {(inviter.company || inviter.role) && (
          <p className="text-sm text-c-text-sub mb-6">
            {inviter.company}{inviter.role ? ` · ${inviter.role}` : ''}
          </p>
        )}

        <div
          className="rounded-xl p-3 mb-6 text-left"
          style={{ background: 'var(--c-accent-soft)', border: '1px solid var(--c-accent-soft-bd)' }}
        >
          <p className="text-xs text-c-accent font-semibold mb-1">🛡 AI Filter ON</p>
          <p className="text-xs text-c-text-sub">
            このチャットでは全メッセージにAIフィルターがかかります。ビジネスシーンでも安心して話せます。
          </p>
        </div>

        {user ? (
          <AcceptInvite inviter={inviter as Profile} currentUserId={user.id} />
        ) : (
          <div className="flex flex-col gap-3">
            <p className="text-sm text-c-text-sub">チャットを始めるにはログインが必要です</p>
            <Link
              href={`/login?redirect=/invite/${userId}`}
              className="btn-accent rounded-xl px-8 py-3 text-base font-semibold transition-colors"
            >
              ログイン / 新規登録
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
