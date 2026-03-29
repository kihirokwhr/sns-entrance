import Link from 'next/link'

export default function LandingPage() {
  return (
    <main className="flex min-h-full flex-col items-center justify-center px-6 py-24">
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
          はじめる
        </Link>
        <a
          href="#how"
          className="rounded-xl px-8 py-3 text-base text-c-text-sub hover:text-c-text transition-colors"
          style={{ border: '1px solid var(--c-border)' }}
        >
          仕組みを見る
        </a>
      </div>

      <section id="how" className="mt-32 w-full max-w-4xl">
        <h2 className="text-center text-2xl font-bold text-c-text mb-12">どう動くの？</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { step: '01', icon: '✍️', title: 'メッセージを入力', desc: 'いつも通りに、思ったままを書いてください。感情的な表現でもOKです。' },
            { step: '02', icon: '🛡', title: 'AIが自動変換', desc: 'Claudeがビジネス敬語・中立トーンに瞬時に変換。意図はそのまま、ノイズだけ除去。' },
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

      <div className="mt-20 text-center">
        <p className="text-c-text-muted text-sm mb-4">無料ではじめられます</p>
        <Link
          href="/login"
          className="btn-accent rounded-xl px-10 py-3 text-base font-semibold transition-colors"
        >
          アカウントを作成
        </Link>
      </div>
    </main>
  )
}
