import { createClient } from '@/lib/supabase/server'
import { CopyInviteButton } from '@/components/ui/CopyInviteButton'

export default async function LobbyPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { count } = await supabase
    .from('rooms')
    .select('*', { count: 'exact', head: true })
    .or(`user1_id.eq.${user!.id},user2_id.eq.${user!.id}`)

  // Empty state — first time user
  if (!count) {
    return (
      <div className="flex flex-1 items-center justify-center px-6">
        <div className="text-center max-w-xs">
          <p className="text-5xl mb-5">👋</p>
          <h2 className="text-lg font-bold text-c-text mb-2">はじめましょう！</h2>
          <p className="text-sm text-c-text-sub leading-relaxed mb-8">
            招待リンクを相手に送ると、<br />
            AIフィルター付きチャットが始まります。
          </p>

          <div
            className="rounded-2xl p-5 mb-6 text-left"
            style={{ background: 'var(--c-surface)', border: '1px solid var(--c-border)' }}
          >
            <p className="text-xs font-semibold text-c-text-sub uppercase tracking-wider mb-3">使い方</p>
            {[
              { step: '1', text: '下のボタンで招待リンクをコピー' },
              { step: '2', text: 'SlackやLINEで相手に送る' },
              { step: '3', text: '相手がリンクを開いたらチャット開始！' },
            ].map(({ step, text }) => (
              <div key={step} className="flex items-center gap-3 mb-2 last:mb-0">
                <span
                  className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold text-c-accent-fg shrink-0"
                  style={{ background: 'var(--c-accent)' }}
                >
                  {step}
                </span>
                <p className="text-sm text-c-text">{text}</p>
              </div>
            ))}
          </div>

          <CopyInviteButton userId={user!.id} />
        </div>
      </div>
    )
  }

  // Has chats — prompt to select one
  return (
    <div className="flex flex-1 items-center justify-center">
      <div className="text-center">
        <p className="text-4xl mb-4">🛡</p>
        <h2 className="text-lg font-semibold text-c-text mb-2">チャットを選択してください</h2>
        <p className="text-sm text-c-text-sub">
          左のサイドバーからチャットを選ぶか、<br />
          招待リンクを共有して新しい会話を始めましょう
        </p>
      </div>
    </div>
  )
}
