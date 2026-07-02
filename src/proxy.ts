import { auth } from "@/lib/auth"
import { NextResponse } from "next/server"
import { locales, defaultLocale } from "./i18n/config"

export const proxy = auth((request) => {
  const { pathname } = request.nextUrl

  // Bypass system routes and assets
  if (
    pathname.startsWith('/api') ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/images') ||
    pathname.startsWith('/documents') ||
    pathname.includes('.')
  ) {
    return NextResponse.next()
  }

  // Check if pathname already starts with a locale
  const pathnameIsMissingLocale = locales.every(
    (locale) => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
  )

  if (pathnameIsMissingLocale) {
    const cookieLocale = request.cookies.get('NEXT_LOCALE')?.value
    let locale = cookieLocale

    if (!locale) {
      const acceptLanguage = request.headers.get('accept-language')
      if (acceptLanguage) {
        const preferredLocales = acceptLanguage
          .split(',')
          .map((lang) => lang.split(';q=')[0].trim().split('-')[0])
        locale = preferredLocales.find((loc) => locales.includes(loc as any))
      }
    }

    if (!locale) {
      locale = defaultLocale
    }

    const redirectUrl = new URL(`/${locale}${pathname}${request.nextUrl.search}`, request.url)
    const response = NextResponse.redirect(redirectUrl)
    response.cookies.set('NEXT_LOCALE', locale, {
      path: '/',
      maxAge: 31536000,
      sameSite: 'lax',
    })
    return response
  }

  // If path has locale prefix, handle Admin authorization
  const localePrefix = locales.find(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  )

  if (localePrefix) {
    const cleanPath = pathname === `/${localePrefix}` ? '/' : pathname.slice(localePrefix.length + 1)
    const isLoggedIn = !!request.auth
    const isOnAdmin = cleanPath.startsWith('admin')
    const isOnLogin = cleanPath === 'admin/login' || cleanPath === 'admin/login/'

    if (isOnAdmin) {
      if (!isOnLogin && !isLoggedIn) {
        return NextResponse.redirect(new URL(`/${localePrefix}/admin/login`, request.url))
      }
      if (isOnLogin && isLoggedIn) {
        return NextResponse.redirect(new URL(`/${localePrefix}/admin`, request.url))
      }
    }
  }

  return NextResponse.next()
})

export default proxy

export const config = {
  matcher: [
    // Apply proxy to all paths except Next.js internals, API, and static assets
    '/((?!_next|api|images|documents|favicon.ico).*)',
  ],
}
