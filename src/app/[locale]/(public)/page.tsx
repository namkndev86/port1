import { getDictionary } from "@/i18n/get-dictionary"
import { LocaleProvider } from "@/components/common/locale-provider"
import HomeClient from "@/components/portfolio/HomeClient"
import type { Locale } from "@/i18n/config"

interface HomePageProps {
  params: Promise<{ locale: string }>
}

export default async function HomePage({ params }: HomePageProps) {
  const { locale } = await params
  
  const commonDict = await getDictionary(locale as Locale, 'common')
  const portfolioDict = await getDictionary(locale as Locale, 'portfolio')
  const dictionary = { common: commonDict, portfolio: portfolioDict }

  return (
    <LocaleProvider locale={locale as Locale} dictionary={dictionary}>
      <HomeClient />
    </LocaleProvider>
  )
}
