import { getDictionary } from './get-dictionary'
import type { Locale } from './config'
import type { TranslationKey } from './types'

export async function getTranslation(locale: Locale) {
  const dictionary = {
    common: await getDictionary(locale, 'common'),
    portfolio: await getDictionary(locale, 'portfolio'),
    blog: await getDictionary(locale, 'blog'),
  }

  const t = (key: TranslationKey, variables?: Record<string, string | number>) => {
    let finalKey = key
    const count = variables?.count

    if (typeof count === 'number') {
      const isEnglish = locale === 'en'
      if (isEnglish) {
        if (count === 0) finalKey = `${key}_zero` as any
        else if (count === 1) finalKey = `${key}_one` as any
        else finalKey = `${key}_other` as any
      } else {
        finalKey = `${key}_other` as any
      }
    }

    const keys = finalKey.split('.')
    let val: any = dictionary
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

  return { t, locale }
}
