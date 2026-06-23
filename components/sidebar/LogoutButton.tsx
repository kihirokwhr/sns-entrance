'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export function LogoutButton() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handleLogout = async () => {
    setLoading(true)
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  return (
    <button
      onClick={handleLogout}
      disabled={loading}
      className="flex items-center gap-2 text-xs text-c-text-sub hover:text-c-text transition-colors disabled:opacity-50"
    >
      <span>🚪</span>
      <span>{loading ? 'ログアウト中...' : 'ログアウト'}</span>
    </button>
  )
}
