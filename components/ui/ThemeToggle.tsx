'use client'

import { useTheme } from './ThemeProvider'

export function ThemeToggle() {
  const { theme, toggle } = useTheme()
  return (
    <button
      onClick={toggle}
      title={theme === 'cool' ? 'ウォームテーマに切替' : 'クールテーマに切替'}
      className="rounded-lg border border-[var(--c-border)] bg-[var(--c-surface)] px-2.5 py-1.5 text-sm text-c-text-sub hover:text-c-text transition-colors"
    >
      {theme === 'cool' ? '🌅' : '🌙'}
    </button>
  )
}
