import type blog from './en/blog.json'
import type common from './en/common.json'
import type portfolio from './en/portfolio.json'

export type NestedKeyOf<ObjectType extends object> = {
  [Key in keyof ObjectType & (string | number)]: ObjectType[Key] extends object
    ? `${Key}` | `${Key}.${NestedKeyOf<ObjectType[Key]>}`
    : `${Key}`
}[keyof ObjectType & (string | number)]

export type TranslationSchema = {
  common: typeof common
  portfolio: typeof portfolio
  blog: typeof blog
}

export type TranslationKey = NestedKeyOf<TranslationSchema>
