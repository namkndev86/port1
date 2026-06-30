'use client'

import { useTranslation } from './locale-provider'
import { useRouter, usePathname } from 'next/navigation'
import { locales } from '@/i18n/config'
import type { Locale } from '@/i18n/config'
import { useState, useEffect, useRef } from 'react'
import { Globe, ChevronDown } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export default function LanguageSwitcher() {
  const { locale, t } = useTranslation()
  const router = useRouter()
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const switchLanguage = (newLocale: Locale) => {
    if (newLocale === locale) return

    // eslint-disable-next-line react-hooks/immutability
    document.cookie = `NEXT_LOCALE=${newLocale}; path=/; max-age=31536000; SameSite=Lax`

    const segments = pathname.split('/')
    // segments[1] is the locale prefix since we are routing within [locale]
    segments[1] = newLocale
    const newPathname = segments.join('/')
    
    const query = typeof window !== 'undefined' ? window.location.search : ''
    const finalUrl = `${newPathname}${query}`

    router.push(finalUrl)
    setIsOpen(false)
  }

  const langNames = {
    en: t('common.languages.en'),
    vi: t('common.languages.vi'),
    ja: t('common.languages.ja'),
  }

  return (
    <div className="relative font-sans" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 p-2.5 rounded-xl glass glass-hover border border-card-border/40 text-muted hover:text-white transition-all text-sm font-semibold select-none cursor-pointer"
        aria-label="Select language"
      >
        <Globe className="w-4 h-4 text-primary" />
        <span className="uppercase text-xs tracking-wider">{locale}</span>
        <ChevronDown className="w-3.5 h-3.5 opacity-50" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 mt-2 w-40 glass rounded-2xl p-1.5 shadow-2xl z-50 border border-card-border/50"
          >
            {locales.map((loc) => {
              const isActive = locale === loc
              return (
                <button
                  key={loc}
                  onClick={() => switchLanguage(loc)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-left text-xs font-semibold cursor-pointer transition-colors ${
                    isActive
                      ? 'bg-primary text-white'
                      : 'text-muted hover:text-white hover:bg-white/5'
                  }`}
                >
                  <span>{langNames[loc]}</span>
                  <span className="uppercase text-[10px] opacity-60 font-mono">({loc})</span>
                </button>
              )
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
