import type { Locale } from './config'

const dictionaries = {
  en: {
    common: () => import('./en/common.json').then((module) => module.default),
    portfolio: () => import('./en/portfolio.json').then((module) => module.default),
    blog: () => import('./en/blog.json').then((module) => module.default),
  },
  vi: {
    common: () => import('./vi/common.json').then((module) => module.default),
    portfolio: () => import('./vi/portfolio.json').then((module) => module.default),
    blog: () => import('./vi/blog.json').then((module) => module.default),
  },
  ja: {
    common: () => import('./ja/common.json').then((module) => module.default),
    portfolio: () => import('./ja/portfolio.json').then((module) => module.default),
    blog: () => import('./ja/blog.json').then((module) => module.default),
  },
}

export const getDictionary = async (locale: Locale, namespace: 'common' | 'portfolio' | 'blog') => {
  return dictionaries[locale][namespace]()
}
