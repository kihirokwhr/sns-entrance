import Link from 'next/link'
import { FilterDemo } from '@/components/landing/FilterDemo'

export default function LandingPage() {
  return (
    <main className="flex min-h-full flex-col items-center px-6 py-24">
      {/* Hero */}
      <span
        className="mb-6 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-semibold text-c-accent uppercase tracking-wider"
        style={{ border: '1px solid var(--c-accent-soft-bd)', background: 'var(--c-accent-soft)' }}
      >
        <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: 'var(--c-pulse)' }} />
        AI Filter Active
      </span>

      <h1 className="max-w-2xl text-center text-5xl font-bold leading-tight tracking-tight text-c-text">
        ビジネスの初対面を<br />
        <span className="text-c-accent">フラット</span>にする
      </h1>
      <p className="mt-6 max-w-lg text-center text-lg text-c-text-sub leading-relaxed">
        すべてのメッセージはAIフィルターを通して送信されます。<br />
        感情のノイズを排除し、本質的なビジネス会話だけを届けます。
      </p>

      <div className="mt-10 flex gap-4">
        <Link
          href="/login"
          className="btn-accent rounded-xl px-8 py-3 text-base font-semibold transition-colors"
        >
          無料ではじめる
        </Link>
        <a
          href="#demo"
          className="rounded-xl px-8 py-3 text-base text-c-text-sub hover:text-c-text transition-colors"
          style={{ border: '1px solid var(--c-border)' }}
        >
          デモを見る
        </a>
      </div>

      {/* Live Demo */}
      <section id="demo" className="mt-32 w-full max-w-4xl">
        <h2 className="text-center text-2xl font-bold text-c-text mb-4">AIフィルターを体験</h2>
        <p className="text-center text-sm text-c-text-sub mb-10">
          実際の変換例をご覧ください。あなたの言葉がどう届くか、一目で分かります。
        </p>
        <FilterDemo />
      </section>

      {/* How it works */}
      <section id="how" className="mt-32 w-full max-w-4xl">
        <h2 className="text-center text-2xl font-bold text-c-text mb-12">どう動くの？</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { step: '01', icon: '✍️', title: 'メッセージを入力', desc: 'いつも通りに、思ったままを書いてください。感情的な表現でもOKです。' },
            { step: '02', icon: '🛡', title: 'AIが自動変換', desc: 'AIがビジネス敬語・中立トーンに瞬時に変換。意図はそのまま、ノイズだけ除去。' },
            { step: '03', icon: '🤝', title: '既存SNSへ接続', desc: '会話が成立したらSlack・LinkedIn・Teamsなどへシームレスにハンドオフ。' },
          ].map((f) => (
            <div
              key={f.step}
              className="rounded-2xl p-6"
              style={{ border: '1px solid var(--c-border)', background: 'var(--c-surface)' }}
            >
              <div className="mb-4 flex items-center gap-3">
                <span className="text-2xl">{f.icon}</span>
                <span className="text-xs font-bold text-c-text-muted uppercase tracking-widest">{f.step}</span>
              </div>
              <h3 className="text-base font-bold text-c-text mb-2">{f.title}</h3>
              <p className="text-sm text-c-text-sub leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Use Cases */}
      <section className="mt-32 w-full max-w-4xl">
        <h2 className="text-center text-2xl font-bold text-c-text mb-4">こんな場面で使えます</h2>
        <p className="text-center text-sm text-c-text-sub mb-12">個人間の会話をもっとスムーズに</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            { icon: '💬', title: '個人間の商談・取引', desc: 'ココナラやクラウドソーシングでのクライアントとのやりとりを、感情を排除してスムーズに。' },
            { icon: '🎮', title: 'オンラインコミュニティ', desc: 'ゲームや趣味のコミュニティで、意見の対立を建設的な議論に変換。' },
            { icon: '🤝', title: '初対面のビジネス会話', desc: '初めてのやりとりで失敗しがちな言い回しを、プロフェッショナルなトーンに。' },
            { icon: '🛡️', title: 'トラブル防止', desc: '感情的なメッセージが原因のいざこざを未然に防止。関係性を守ります。' },
          ].map((uc) => (
            <div
              key={uc.title}
              className="rounded-2xl p-6 flex gap-4"
              style={{ border: '1px solid var(--c-border)', background: 'var(--c-surface)' }}
            >
              <span className="text-2xl shrink-0">{uc.icon}</span>
              <div>
                <h3 className="text-base font-bold text-c-text mb-1">{uc.title}</h3>
                <p className="text-sm text-c-text-sub leading-relaxed">{uc.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="mt-32 w-full max-w-4xl">
        <h2 className="text-center text-2xl font-bold text-c-text mb-4">料金プラン</h2>
        <p className="text-center text-sm text-c-text-sub mb-12">まずは無料で体験してください</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
          <div
            className="rounded-2xl p-6"
            style={{ border: '1px solid var(--c-border)', background: 'var(--c-surface)' }}
          >
            <h3 className="text-base font-bold text-c-text mb-1">Free</h3>
            <p className="text-3xl font-bold text-c-text mt-2">
              ¥0<span className="text-sm font-normal text-c-text-sub">/月</span>
            </p>
            <ul className="mt-4 space-y-2">
              <li className="text-sm text-c-text-sub">AIフィルター 月100通まで</li>
              <li className="text-sm text-c-text-sub">リアルタイムチャット</li>
              <li className="text-sm text-c-text-sub">招待リンクでルーム作成</li>
            </ul>
          </div>
          <div
            className="rounded-2xl p-6 relative"
            style={{ border: '1px solid var(--c-accent)', background: 'var(--c-surface)' }}
          >
            <span
              className="absolute -top-3 left-6 text-xs font-bold px-3 py-1 rounded-full text-c-accent"
              style={{ background: 'var(--c-accent-soft)', border: '1px solid var(--c-accent-soft-bd)' }}
            >
              おすすめ
            </span>
            <h3 className="text-base font-bold text-c-text mb-1">Pro</h3>
            <p className="text-3xl font-bold text-c-text mt-2">
              ¥500<span className="text-sm font-normal text-c-text-sub">/月（税込）</span>
            </p>
            <ul className="mt-4 space-y-2">
              <li className="text-sm text-c-text-sub">AIフィルター 無制限</li>
              <li className="text-sm text-c-text-sub">リアルタイムチャット</li>
              <li className="text-sm text-c-text-sub">招待リンクでルーム作成</li>
              <li className="text-sm text-c-text-sub">いつでもキャンセル可能</li>
            </ul>
          </div>
        </div>
      </section>

      {/* CTA */}
      <div className="mt-20 text-center">
        <p className="text-c-text-muted text-sm mb-4">無料ではじめられます</p>
        <Link
          href="/login"
          className="btn-accent rounded-xl px-10 py-3 text-base font-semibold transition-colors"
        >
          アカウントを作成
        </Link>
      </div>

      {/* Footer */}
      <footer className="mt-24 w-full max-w-4xl pb-12" style={{ borderTop: '1px solid var(--c-border)', paddingTop: '24px' }}>
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-c-text-muted">&copy; {new Date().getFullYear()} SNS ENTRANCE</p>
          <div className="flex gap-6 items-center">
            {/* SNS Links */}
            <a
              href="https://x.com/sns_entrance"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-c-text-sub hover:text-c-text transition-colors"
            >
              X (Twitter)
            </a>
            <a
              href="https://youtube.com/@sns_entrance"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-c-text-sub hover:text-c-text transition-colors"
            >
              YouTube
            </a>
            <a
              href="https://ko-fi.com/sns_entrance"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-c-text-sub hover:text-c-text transition-colors"
            >
              ☕ 開発を支援する
            </a>
            <Link href="/legal" className="text-xs text-c-text-sub hover:text-c-text transition-colors">
              特定商取引法に基づく表記
            </Link>
          </div>
        </div>
      </footer>
    </main>
  )
}
