import Link from 'next/link'

export default function LegalPage() {
  return (
    <main className="min-h-full px-6 py-16 max-w-2xl mx-auto">
      <Link href="/" className="text-sm text-c-text-sub hover:text-c-text transition-colors mb-8 inline-block">
        ← トップへ戻る
      </Link>

      <h1 className="text-2xl font-bold text-c-text mb-8">特定商取引法に基づく表記</h1>

      <div className="space-y-6">
        <Section title="販売業者">
          {/* TODO: あなたの事業者名に変更してください */}
          川原　暉弘
        </Section>

        <Section title="運営責任者">
          {/* TODO: あなたの氏名に変更してください */}
          川原　暉弘
        </Section>

        <Section title="所在地">
          {/* TODO: あなたの住所に変更してください（開示請求があった場合に遅滞なく開示する旨でも可） */}
          請求があった場合、遅滞なく開示いたします。
        </Section>

        <Section title="連絡先">
          {/* TODO: サポートメールアドレスに変更してください */}
          メール: c6964657@gmail.com<br />
          ※お問い合わせはメールにてお願いいたします。
        </Section>

        <Section title="販売価格">
          <ul className="list-disc list-inside space-y-1">
            <li>Free プラン: 無料（AIフィルター月100通まで）</li>
            <li>Pro プラン: 月額500円（税込）</li>
          </ul>
        </Section>

        <Section title="支払方法">
          クレジットカード決済（Stripe経由）
        </Section>

        <Section title="支払時期">
          Pro プランへのアップグレード時に初回決済が行われ、以降毎月自動更新されます。
        </Section>

        <Section title="サービス提供時期">
          お支払い完了後、即時ご利用いただけます。
        </Section>

        <Section title="返品・キャンセルについて">
          デジタルサービスの性質上、返品はお受けできません。<br />
          サブスクリプションはいつでもキャンセル可能です。キャンセル後は次回更新日まで引き続きご利用いただけます。
        </Section>

        <Section title="動作環境">
          モダンブラウザ（Chrome, Firefox, Safari, Edge の最新版）にてご利用いただけます。
        </Section>
      </div>

      <footer className="mt-16 pt-8" style={{ borderTop: '1px solid var(--c-border)' }}>
        <p className="text-xs text-c-text-muted">&copy; {new Date().getFullYear()} SNS ENTRANCE</p>
      </footer>
    </main>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="pb-6" style={{ borderBottom: '1px solid var(--c-border)' }}>
      <h2 className="text-sm font-bold text-c-accent mb-2">{title}</h2>
      <div className="text-sm text-c-text-sub leading-relaxed">{children}</div>
    </div>
  )
}
