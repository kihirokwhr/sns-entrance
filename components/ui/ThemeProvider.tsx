'use client'

import { createContext, useContext, useEffect, useState } from 'react'

type Theme = 'cool' | 'warm'

const ThemeContext = createContext<{ theme: Theme; toggle: () => void }>({
  theme: 'cool',
  toggle: () => {},
})

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>('cool')

  useEffect(() => {
    const saved = localStorage.getItem('sns-theme') as Theme | null
    if (saved === 'warm' || saved === 'cool') setTheme(saved)
  }, [])

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme === 'warm' ? 'warm' : '')
    localStorage.setItem('sns-theme', theme)
  }, [theme])

  const toggle = () => setTheme((t) => (t === 'cool' ? 'warm' : 'cool'))

  return (
    <ThemeContext.Provider value={{ theme, toggle }}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = () => useContext(ThemeContext)
