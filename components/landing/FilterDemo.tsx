'use client'

import { useEffect, useState } from 'react'

const EXAMPLES = [
  {
    original: 'は？そんなの聞いてないんだけど。マジで困るんですけど。',
    filtered: 'その件については伺っておりませんでした。対応方法についてご相談させてください。',
  },
  {
    original: 'ちょっと待って、それ全然違うんだけどwww',
    filtered: '認識に相違があるようです。改めて確認させていただけますか？',
  },
  {
    original: 'いや関係ないでしょそれ。話そらさないでくれる？',
    filtered: '本題に戻らせてください。先ほどの件についてお聞きしたいです。',
  },
  {
    original: 'もういいわ、好きにしてください。知らんけど。',
    filtered: 'この件はお任せいたします。何かあればお気軽にご連絡ください。',
  },
]

export function FilterDemo() {
  const [index, setIndex] = useState(0)
  const [phase, setPhase] = useState<'original' | 'filtering' | 'filtered'>('original')

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = []

    const run = () => {
      setPhase('original')
      timers.push(setTimeout(() => setPhase('filtering'), 1800))
      timers.push(setTimeout(() => setPhase('filtered'), 2600))
      timers.push(
        setTimeout(() => {
          setIndex((i) => (i + 1) % EXAMPLES.length)
        }, 5500)
      )
    }

    run()
    return () => timers.forEach(clearTimeout)
  }, [index])

  const example = EXAMPLES[index]

  return (
    <div className="w-full max-w-xl mx-auto">
      {/* Chat mockup */}
      <div
        className="rounded-2xl overflow-hidden"
        style={{ border: '1px solid var(--c-border)', background: 'var(--c-surface)' }}
      >
        {/* Header */}
        <div className="px-5 py-3 flex items-center gap-3" style={{ borderBottom: '1px solid var(--c-border)' }}>
          <div className="w-7 h-7 rounded-full bg-c-text-muted flex items-center justify-center text-xs font-bold text-c-bg">
            A
          </div>
          <span className="text-sm font-semibold text-c-text">相手ユーザー</span>
          <span
            className="ml-auto text-[10px] px-2 py-0.5 rounded-full font-semibold text-c-accent"
            style={{ background: 'var(--c-accent-soft)', border: '1px solid var(--c-accent-soft-bd)' }}
          >
            AI Filter ON
          </span>
        </div>

        {/* Messages area */}
        <div className="px-5 py-6 min-h-[200px] flex flex-col justify-end gap-4">
          {/* Your input */}
          <div className="flex flex-col items-end gap-1">
            <span className="text-[10px] text-c-text-muted uppercase tracking-wider">あなたの入力</span>
            <div
              className="max-w-[85%] rounded-2xl rounded-br-md px-4 py-2.5 text-sm transition-opacity duration-300"
              style={{
                background: 'var(--c-orig-soft)',
                border: '1px solid var(--c-orig-bd)',
                color: 'var(--c-orig-label)',
                opacity: phase !== 'original' ? 0.4 : 1,
              }}
            >
              {example.original}
            </div>
          </div>

          {/* Filter indicator */}
          <div className="flex items-center justify-center gap-2 py-1">
            {phase === 'filtering' && (
              <span className="text-xs text-c-accent animate-pulse">AI フィルター変換中...</span>
            )}
            {phase === 'filtered' && (
              <span className="text-xs text-c-accent">↓ 相手に届くメッセージ</span>
            )}
          </div>

          {/* Filtered output */}
          {phase === 'filtered' && (
            <div className="flex flex-col items-end gap-1">
              <span className="text-[10px] text-c-text-muted uppercase tracking-wider">送信されるメッセージ</span>
              <div
                className="max-w-[85%] rounded-2xl rounded-br-md px-4 py-2.5 text-sm animate-[fadeIn_0.4s_ease]"
                style={{
                  background: 'var(--c-filt-soft)',
                  border: '1px solid var(--c-filt-bd)',
                  color: 'var(--c-filt-label)',
                }}
              >
                {example.filtered}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Dots indicator */}
      <div className="flex justify-center gap-2 mt-4">
        {EXAMPLES.map((_, i) => (
          <span
            key={i}
            className="w-1.5 h-1.5 rounded-full transition-all duration-300"
            style={{
              background: i === index ? 'var(--c-accent)' : 'var(--c-border)',
              transform: i === index ? 'scale(1.3)' : 'scale(1)',
            }}
          />
        ))}
      </div>
    </div>
  )
}
