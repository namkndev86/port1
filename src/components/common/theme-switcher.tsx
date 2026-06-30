'use client'

import { useTheme } from './theme-provider'
import { useTranslation } from './locale-provider'
import { useState, useEffect, useRef } from 'react'
import { Sun, Moon, Monitor, ChevronDown } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export default function ThemeSwitcher() {
  const { theme, setTheme } = useTheme()
  const { t } = useTranslation()
  const [mounted, setMounted] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true)
  }, [])

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  if (!mounted) {
    return (
      <div className="w-10 h-10 rounded-xl bg-card-border/30 border border-card-border/40" />
    )
  }

  const themes = [
    { id: 'light', label: t('common.themes.light'), icon: Sun },
    { id: 'dark', label: t('common.themes.dark'), icon: Moon },
    { id: 'system', label: t('common.themes.system'), icon: Monitor },
  ] as const

  const CurrentIcon = theme === 'light' ? Sun : theme === 'dark' ? Moon : Monitor

  return (
    <div className="relative font-sans" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 p-2.5 rounded-xl glass glass-hover border border-card-border/40 text-muted hover:text-white transition-all text-sm font-semibold select-none cursor-pointer"
        aria-label="Toggle theme"
      >
        <CurrentIcon className="w-4 h-4 text-primary" />
        <ChevronDown className="w-3.5 h-3.5 opacity-50" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 mt-2 w-36 glass rounded-2xl p-1.5 shadow-2xl z-50 border border-card-border/50"
          >
            {themes.map((tItem) => {
              const Icon = tItem.icon
              const isActive = theme === tItem.id
              return (
                <button
                  key={tItem.id}
                  onClick={() => {
                    setTheme(tItem.id)
                    setIsOpen(false)
                  }}
                  className={`w-full flex items-center gap-2 px-3 py-2 rounded-xl text-left text-xs font-semibold cursor-pointer transition-colors ${
                    isActive
                      ? 'bg-primary text-white'
                      : 'text-muted hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5 shrink-0" />
                  <span>{tItem.label}</span>
                </button>
              )
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
