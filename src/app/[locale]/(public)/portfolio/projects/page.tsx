import { ProjectService } from "@/services/project.service"
import ProjectsFilterList from "@/components/portfolio/ProjectsFilterList"
import { getDictionary } from "@/i18n/get-dictionary"
import { LocaleProvider } from "@/components/common/locale-provider"
import { getTranslation } from "@/i18n/server"
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
  return [
    {
      id: "1",
      title: "Vtracking Viettel",
      slug: "vtracking-viettel",
      description: "Vehicle tracking and online monitoring solution utilizing GPS, mobile data transmission, and GIS digital maps. Includes live camera streams and WebSocket integrations.",
      techStack: ["jQuery", "Bootstrap", "WebSocket", "Video Streaming", "Play Framework", "Go"],
      demoUrl: "https://github.com/namkndev86/port1",
      images: [],
    },
    {
      id: "2",
      title: "Manufacturing Execution System (MES-X)",
      slug: "manufacturing-execution-system-mes-x",
      description: "A comprehensive management solution providing real-time tracking of manufacturing processes, order management, and interactive dashboards.",
      techStack: ["React", "Redux", "SWR", "Material UI", "NestJS", "PostgreSQL"],
      demoUrl: "https://github.com/namkndev86/port1",
      images: [],
    },
    {
      id: "3",
      title: "VIMC E-Office & VIMC LINES",
      slug: "vimc-e-office-lines",
      description: "Internal information and logistics services system featuring document workflows, container tracking, and file generation.",
      techStack: ["React", "MobX", "Ant Design", "Spring Boot", "Express", "Prisma ORM"],
      demoUrl: "https://github.com/namkndev86/port1",
      images: [],
    },
    {
      id: "4",
      title: "SamNotes",
      slug: "samnotes",
      description: "Web application to note information, ideas, and tasks with access anytime, anywhere.",
      techStack: ["Next.js", "TailwindCSS", "Ant Design", "Flask", "MySQL"],
      demoUrl: "https://github.com/namkndev86/port1",
      images: [],
    },
  ]
}
