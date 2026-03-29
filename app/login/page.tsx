'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

type Mode = 'login' | 'signup'

export default function LoginPage() {
  const router = useRouter()
  const [mode, setMode] = useState<Mode>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    const supabase = createClient()

    try {
      if (mode === 'signup') {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { data: { display_name: displayName } },
        })
        if (error) throw error
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) throw error
      }
      router.push('/lobby')
      router.refresh()
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : '不明なエラーが発生しました')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-full items-center justify-center px-6 py-24">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <span
            className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold text-c-accent mb-4"
            style={{ border: '1px solid var(--c-accent-soft-bd)', background: 'var(--c-accent-soft)' }}
          >
            🛡 SNS ENTRANCE
          </span>
          <h1 className="text-2xl font-bold text-c-text">
            {mode === 'login' ? 'ログイン' : 'アカウント作成'}
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {mode === 'signup' && (
            <div>
              <label className="block text-xs text-c-text-sub mb-1">表示名</label>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                required
                placeholder="山田 太郎"
                className="w-full rounded-xl px-4 py-3 text-sm text-c-text placeholder-c-text-muted focus:outline-none"
                style={{ background: 'var(--c-surface)', border: '1px solid var(--c-border)' }}
              />
            </div>
          )}
          <div>
            <label className="block text-xs text-c-text-sub mb-1">メールアドレス</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="you@example.com"
              className="w-full rounded-xl px-4 py-3 text-sm text-c-text placeholder-c-text-muted focus:outline-none"
              style={{ background: 'var(--c-surface)', border: '1px solid var(--c-border)' }}
            />
          </div>
          <div>
            <label className="block text-xs text-c-text-sub mb-1">パスワード</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              placeholder="••••••••"
              className="w-full rounded-xl px-4 py-3 text-sm text-c-text placeholder-c-text-muted focus:outline-none"
              style={{ background: 'var(--c-surface)', border: '1px solid var(--c-border)' }}
            />
          </div>

          {error && (
            <p className="rounded-lg px-4 py-2 text-xs text-red-400"
               style={{ background: 'rgb(239 68 68 / 0.1)', border: '1px solid rgb(239 68 68 / 0.3)' }}>
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="btn-accent w-full rounded-xl py-3 text-sm font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? '処理中...' : mode === 'login' ? 'ログイン' : 'アカウント作成'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-c-text-sub">
          {mode === 'login' ? 'アカウントをお持ちでない方は' : '既にアカウントをお持ちの方は'}
          <button
            onClick={() => { setMode(mode === 'login' ? 'signup' : 'login'); setError('') }}
            className="ml-1 text-c-accent hover:opacity-80"
          >
            {mode === 'login' ? '新規登録' : 'ログイン'}
          </button>
        </p>
      </div>
    </div>
  )
}
