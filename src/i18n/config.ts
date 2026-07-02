export const locales = ['en', 'vi', 'ja'] as const
export type Locale = typeof locales[number]
export const defaultLocale: Locale = 'en'
