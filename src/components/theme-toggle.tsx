'use client'

import { useTheme } from 'next-themes'
import { Sun, Moon } from 'lucide-react'
import { useEffect, useState } from 'react'

export function ThemeToggle({ className = '' }: { className?: string }) {
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme } = useTheme()

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <button
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      className={`p-2 rounded-full hover:bg-accent/10 transition-colors duration-300 group ${className}`}
      aria-label="Alternar tema"
    >
      {theme === 'dark' ? (
        <Sun className="w-5 h-5 text-foreground/70 group-hover:text-foreground/90 transition-colors" />
      ) : (
        <Moon className="w-5 h-5 text-foreground/70 group-hover:text-foreground/90 transition-colors" />
      )}
    </button>
  )
}
