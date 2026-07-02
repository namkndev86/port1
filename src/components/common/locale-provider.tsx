'use client'

import { createContext, useContext, ReactNode } from 'react'
import type { Locale } from '@/i18n/config'
import type { TranslationKey } from '@/i18n/types'

type Dictionary = Record<string, any>

const LocaleContext = createContext<{
  locale: Locale
  dictionary: Dictionary
} | null>(null)

export function LocaleProvider({
  locale,
  dictionary,
  children,
}: {
  locale: Locale
  dictionary: Dictionary
  children: ReactNode
}) {
  return (
    <LocaleContext.Provider value={{ locale, dictionary }}>
      {children}
    </LocaleContext.Provider>
  )
}

export function useTranslation() {
  const context = useContext(LocaleContext)
  if (!context) {
    throw new Error('useTranslation must be used within a LocaleProvider')
  }

  const t = (key: TranslationKey, variables?: Record<string, string | number>) => {
    let finalKey = key
    const count = variables?.count

    if (typeof count === 'number') {
      const isEnglish = context.locale === 'en'
      if (isEnglish) {
        if (count === 0) finalKey = `${key}_zero` as any
        else if (count === 1) finalKey = `${key}_one` as any
        else finalKey = `${key}_other` as any
      } else {
        finalKey = `${key}_other` as any
      }
    }

    const keys = finalKey.split('.')
    let val: any = context.dictionary
    for (const k of keys) {
      if (val && typeof val === 'object' && k in val) {
        val = val[k]
      } else {
        if (finalKey !== key) {
          return t(key, variables)
        }
        return key
      }
    }

    if (typeof val !== 'string') return key

    if (variables) {
      return Object.entries(variables).reduce((str, [k, v]) => {
        return str.replace(new RegExp(`{${k}}`, 'g'), String(v))
      }, val)
    }

    return val
  }

  return { t, locale: context.locale }
}
