'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

export default function ResetPasswordPage() {
  const router = useRouter()
  const [checking, setChecking] = useState(true)
  const [hasSession, setHasSession] = useState(false)
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)

  // After the auth callback, the recovery session lives in cookies.
  // Confirm a user is present before showing the form.
  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data }) => {
      setHasSession(!!data.user)
      setChecking(false)
    })
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (password !== confirm) {
      setError('パスワードが一致しません')
      return
    }
    if (password.length < 6) {
      setError('パスワードは6文字以上で入力してください')
      return
    }
    setLoading(true)
    const supabase = createClient()
    try {
      const { error } = await supabase.auth.updateUser({ password })
      if (error) throw error
      setDone(true)
      setTimeout(() => {
        router.push('/lobby')
        router.refresh()
      }, 1500)
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
          <h1 className="text-2xl font-bold text-c-text">新しいパスワードの設定</h1>
        </div>

        {checking ? (
          <p className="text-center text-sm text-c-text-muted">確認中...</p>
        ) : done ? (
          <p
            className="rounded-lg px-4 py-3 text-center text-sm text-c-accent"
            style={{ background: 'var(--c-accent-soft)', border: '1px solid var(--c-accent-soft-bd)' }}
          >
            ✅ パスワードを変更しました。
            <br />
            ロビーに移動します...
          </p>
        ) : !hasSession ? (
          <div className="flex flex-col gap-4 text-center">
            <p
              className="rounded-lg px-4 py-3 text-sm text-red-400"
              style={{ background: 'rgb(239 68 68 / 0.1)', border: '1px solid rgb(239 68 68 / 0.3)' }}
            >
              リンクが無効か、有効期限が切れています。
              <br />
              お手数ですが、もう一度再設定をお試しください。
            </p>
            <Link href="/forgot-password" className="text-sm text-c-accent hover:opacity-80">
              パスワード再設定をやり直す
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="block text-xs text-c-text-sub mb-1">新しいパスワード</label>
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
            <div>
              <label className="block text-xs text-c-text-sub mb-1">新しいパスワード（確認）</label>
              <input
                type="password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                required
                minLength={6}
                placeholder="••••••••"
                className="w-full rounded-xl px-4 py-3 text-sm text-c-text placeholder-c-text-muted focus:outline-none"
                style={{ background: 'var(--c-surface)', border: '1px solid var(--c-border)' }}
              />
            </div>

            {error && (
              <p
                className="rounded-lg px-4 py-2 text-xs text-red-400"
                style={{ background: 'rgb(239 68 68 / 0.1)', border: '1px solid rgb(239 68 68 / 0.3)' }}
              >
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-accent w-full rounded-xl py-3 text-sm font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? '変更中...' : 'パスワードを変更'}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
