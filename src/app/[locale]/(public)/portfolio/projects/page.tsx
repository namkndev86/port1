import { LocaleProvider } from "@/components/common/locale-provider"
import ProjectsFilterList from "@/components/portfolio/ProjectsFilterList"
import { getDictionary } from "@/i18n/get-dictionary"
import { getTranslation } from "@/i18n/server"
import { ProjectService } from "@/services/project.service"

import type { Locale } from "@/i18n/config"

export const revalidate = 60

interface ProjectsPageProps {
  params: Promise<{ locale: string }>
}

export default async function ProjectsPage({ params }: ProjectsPageProps) {
  const { locale } = await params
  const projectService = new ProjectService()
  let projects = []

  const commonDict = await getDictionary(locale as Locale, 'common')
  const portfolioDict = await getDictionary(locale as Locale, 'portfolio')
  const dictionary = { common: commonDict, portfolio: portfolioDict }
  const { t } = await getTranslation(locale as Locale)

  try {
    projects = await projectService.getProjects({ activeOnly: true })
    if (projects.length === 0) {
      projects = getDefaultProjects()
    }
  } catch (err) {
    console.warn("⚠️ Failed to load database projects. Using fallback.", err)
    projects = getDefaultProjects()
  }

  return (
    <LocaleProvider locale={locale as Locale} dictionary={dictionary}>
      <div className="max-w-6xl mx-auto px-6 py-12 md:py-20 flex flex-col gap-10">
        <div className="flex flex-col gap-3">
          <span className="font-mono text-xs text-primary font-semibold tracking-widest uppercase">{t('portfolio.projects.subtitle')}</span>
          <h1 className="font-display font-bold text-4xl md:text-6xl text-white">{t('portfolio.projects.all_projects') === "Browse All Projects" ? "All Projects" : t('portfolio.projects.all_projects')}</h1>
          <p className="text-muted text-sm md:text-base max-w-xl">
            {locale === 'vi'
              ? 'Duyệt qua danh mục dự án kỹ thuật hoàn chỉnh, từ các dịch vụ phụ trợ hiệu năng cao bằng Go đến các bộ giao diện người dùng trực quan.'
              : locale === 'ja'
              ? 'Goによる高スループットなバックエンドサービスから視覚的なフロントエンドスイートまで、完全なエンジニアリングポートフォリオをご覧いただけます。'
              : 'Browse through the complete engineering portfolio, ranging from high-throughput backend services in Go to visual frontend suites.'}
          </p>
        </div>

        <ProjectsFilterList projects={projects} />
      </div>
    </LocaleProvider>
  )
}

function getDefaultProjects(): any[] {
  return []
}
