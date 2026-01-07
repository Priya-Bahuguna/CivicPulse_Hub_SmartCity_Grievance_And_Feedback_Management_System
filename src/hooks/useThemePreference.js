import { useEffect, useState } from 'react'

const getInitialTheme = () => {
  if (typeof window === 'undefined') return 'light'
  const stored = window.localStorage.getItem('theme')
  // Only allow light theme now
  return stored === 'light' ? 'light' : 'light'
}

export function useThemePreference() {
  const [theme, setTheme] = useState(getInitialTheme)

  useEffect(() => {
    if (typeof document === 'undefined' || typeof window === 'undefined') return
    const root = document.documentElement
    root.classList.remove('theme-light', 'theme-dark', 'theme-dashboard')
    root.classList.add(`theme-${theme}`)
    root.style.colorScheme = theme
    window.localStorage.setItem('theme', theme)
  }, [theme])

  const toggleTheme = () => {
    // Only light theme available now
    return
  }

  return { theme, toggleTheme }
}

