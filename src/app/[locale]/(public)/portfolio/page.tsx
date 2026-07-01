import { SkillService } from "@/services/skill.service"
import { ExperienceService } from "@/services/experience.service"
import { ProjectService } from "@/services/project.service"
import { UserRepository } from "@/repositories/user.repository"
import SkillsSection from "@/components/portfolio/SkillsSection"
import ExperienceTimeline from "@/components/portfolio/ExperienceTimeline"
import ArchitectureShowcase from "@/components/portfolio/ArchitectureShowcase"
import ContactForm from "@/components/portfolio/ContactForm"
import Link from "next/link"
import { ArrowUpRight, FileText, Code2 } from "lucide-react"
import { GithubIcon as Github, LinkedinIcon as Linkedin } from "@/components/ui/social-icons"
import { getDictionary } from "@/i18n/get-dictionary"
import { LocaleProvider } from "@/components/common/locale-provider"
import { getTranslation } from "@/i18n/server"
import type { Locale } from "@/i18n/config"

export const revalidate = 60 // Revalidate cache every minute

interface PortfolioPageProps {
  params: Promise<{ locale: string }>
}

export default async function PortfolioPage({ params }: PortfolioPageProps) {
  const { locale } = await params
  const skillService = new SkillService()
  const expService = new ExperienceService()
  const projectService = new ProjectService()
  const userRepo = new UserRepository()

  const commonDict = await getDictionary(locale as Locale, 'common')
  const portfolioDict = await getDictionary(locale as Locale, 'portfolio')
  const dictionary = { common: commonDict, portfolio: portfolioDict }
  const { t } = await getTranslation(locale as Locale)

  // Data fetching containers
  let skills = []
  let experiences = []
  let projects = []
  let profile = {
    name: "Nguyen Khac Nam",
    title: "Frontend Developer",
    bio: "Frontend Developer with 3+ years of experience building enterprise-scale web applications using React and TypeScript. Specializing in leading frontend development for business-critical modules, designing scalable architectures, building reusable component systems, and optimizing application performance.",
    tagline: "Building high-performance enterprise web applications and crafting reusable frontend interfaces.",
    githubUrl: "https://github.com/namkndev86/",
    linkedinUrl: "https://www.linkedin.com/in/namkndev86/",
    twitterUrl: "https://x.com/namkndev86",
    resumeUrl: "#",
    avatarUrl: null,
  }

  try {
    // Attempt database fetching
    const [dbSkills, dbExperiences, dbProjects, dbUser] = await Promise.all([
      skillService.getSkills().catch(() => []),
      expService.getExperiences().catch(() => []),
      projectService.getFeaturedProjects().catch(() => []),
      userRepo.findByEmail("namkndev86@gmail.com").catch(() => null),
    ])

    skills = dbSkills.length > 0 ? dbSkills : getDefaultSkills()
    experiences = dbExperiences.length > 0 ? dbExperiences : getDefaultExperiences()
    projects = dbProjects.length > 0 ? dbProjects : getDefaultProjects()

    if (dbUser) {
      const dbProfile = await userRepo.getProfileByUserId(dbUser.id).catch(() => null)
      if (dbProfile) {
        profile = {
          name: dbProfile.name,
          title: dbProfile.title,
          bio: dbProfile.bio,
          tagline: dbProfile.tagline,
          githubUrl: dbProfile.githubUrl || "https://github.com/namkndev86/",
          linkedinUrl: dbProfile.linkedinUrl || "https://www.linkedin.com/in/namkndev86/",
          twitterUrl: dbProfile.twitterUrl || "https://x.com/namkndev86",
          resumeUrl: dbProfile.resumeUrl || "#",
          avatarUrl: dbProfile.avatarUrl as any,
        }
      }
    }
  } catch (err) {
    console.warn("⚠️ Database connection failed. Rendering portfolio in static mode with mock data.", err)
    skills = getDefaultSkills()
    experiences = getDefaultExperiences()
    projects = getDefaultProjects()
  }

  const getHref = (path: string) => {
    return path === "/" ? `/${locale}` : `/${locale}${path}`
  }

  return (
    <LocaleProvider locale={locale as Locale} dictionary={dictionary}>
      <div className="w-full flex flex-col items-center">
        {/* 1. About / Hero Section */}
        <section id="about" className="w-full py-16 md:py-28 border-b border-card-border/40 relative">
          <div className="absolute left-1/3 top-1/4 w-80 h-80 bg-primary/10 rounded-full blur-[140px] pointer-events-none -z-10" />
          <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Bio text */}
            <div className="lg:col-span-7 flex flex-col gap-6">
              <span className="font-mono text-xs text-primary font-semibold tracking-widest uppercase">{t('portfolio.hero.overview')}</span>
              <h1 className="font-display font-bold text-4xl md:text-6xl text-white leading-tight">
                {locale === 'vi' ? (
                  <>Thiết kế các hệ thống mở rộng một cách <span className="text-primary">toàn vẹn</span>.</>
                ) : locale === 'ja' ? (
                  <>整合性と拡張性を両立したシステム <span className="text-primary">プラットフォーム</span> の設計。</>
                ) : (
                  <>Designing platforms that <span className="text-primary">scale</span> with integrity.</>
                )}
              </h1>
              <p className="text-muted text-base md:text-lg leading-relaxed">
                {profile.bio}
              </p>
              <div className="flex flex-wrap items-center gap-4">
                <a
                  href={profile.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-5 py-2.5 rounded-full glass hover:text-primary hover:border-primary transition-all duration-300 text-sm font-semibold cursor-pointer"
                >
                  <Github className="w-4 h-4" />
                  {t('portfolio.hero.cta.github')}
                </a>
                <a
                  href={profile.linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-5 py-2.5 rounded-full glass hover:text-primary hover:border-primary transition-all duration-300 text-sm font-semibold cursor-pointer"
                >
                  <Linkedin className="w-4 h-4" />
                  {t('portfolio.hero.cta.linkedin')}
                </a>
                <a
                  href={profile.resumeUrl}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/5 border border-card-border hover:bg-white/10 hover:text-white transition-all duration-300 text-sm font-semibold cursor-pointer"
                >
                  <FileText className="w-4 h-4 text-muted" />
                  {t('portfolio.hero.cta.resume')}
                </a>
              </div>
            </div>

            {/* Avatar Graphic card */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="relative w-72 h-72 sm:w-80 sm:h-80 rounded-2xl glass p-4 shadow-2xl flex items-center justify-center group overflow-hidden border border-card-border">
                {/* Spinning background neon ring */}
                <div className="absolute inset-0 bg-gradient-to-tr from-primary to-accent opacity-10 group-hover:opacity-20 transition-opacity duration-500 rounded-2xl" />
                <div className="w-full h-full rounded-xl bg-[#030611] flex flex-col items-center justify-center gap-4 border border-card-border/60 relative z-10">
                  <Code2 className="w-16 h-16 text-primary group-hover:scale-110 transition-transform duration-500 animate-pulse" />
                  <div className="text-center">
                    <h3 className="font-display font-bold text-white tracking-wide">{profile.name}</h3>
                    <span className="font-mono text-xs text-accent">{profile.title.split(" & ")[0]}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 2. Skills Section */}
        <SkillsSection skills={skills} />

        {/* 3. Experience Timeline */}
        <ExperienceTimeline experiences={experiences} />

        {/* 4. Featured Projects Showcase */}
        <section id="projects" className="w-full py-20 border-b border-card-border/40 relative">
          <div className="absolute right-10 top-1/4 w-72 h-72 bg-primary/5 rounded-full blur-[120px] pointer-events-none" />
          <div className="max-w-6xl mx-auto px-6">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-4">
              <div className="flex flex-col gap-2">
                <span className="font-mono text-xs text-primary font-semibold tracking-widest uppercase">{t('portfolio.projects.subtitle')}</span>
                <h2 className="font-display font-bold text-3xl md:text-5xl text-white">{t('portfolio.projects.title')}</h2>
              </div>
              <Link
                href={getHref("/portfolio/projects")}
                className="text-primary hover:text-accent font-semibold text-sm flex items-center gap-1 group cursor-pointer"
              >
                {t('portfolio.projects.all_projects')}
                <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </Link>
            </div>

            {/* Projects Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {projects.map((project) => (
                <div
                  key={project.id}
                  className="glass rounded-2xl overflow-hidden hover:border-primary/20 hover:shadow-2xl transition-all duration-300 flex flex-col h-full group"
                >
                  {/* Image Placeholder Visual */}
                  <div className="h-48 w-full bg-gradient-to-br from-[#080d1e] to-[#040812] border-b border-card-border flex items-center justify-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-primary/5 group-hover:bg-primary/10 transition-colors" />
                    {project.images?.[0]?.url ? (
                      <img
                        src={project.images[0].url}
                        alt={project.images[0].alt || project.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <Code2 className="w-12 h-12 text-primary/40 group-hover:scale-110 transition-transform duration-500" />
                    )}
                  </div>

                  <div className="p-6 md:p-8 flex flex-col flex-1 gap-4">
                    <h3 className="font-display font-bold text-xl text-white group-hover:text-primary transition-colors">
                      {project.title}
                    </h3>
                    <p className="text-muted text-sm leading-relaxed flex-1">
                      {project.description}
                    </p>
                    
                    {/* Tech stack badge row */}
                    <div className="flex flex-wrap gap-2 py-2">
                      {project.techStack.map((tech: string) => (
                        <span key={tech} className="px-2.5 py-1 rounded bg-card-border/60 border border-card-border/80 text-[10px] font-mono text-gray-300 uppercase">
                          {tech}
                        </span>
                      ))}
                    </div>

                    <div className="border-t border-card-border/40 pt-4 flex items-center justify-between">
                      <Link
                        href={getHref(`/portfolio/projects/${project.slug}`)}
                        className="text-sm font-semibold text-white group-hover:text-primary flex items-center gap-1 transition-colors cursor-pointer"
                      >
                        {t('portfolio.projects.details')}
                        <ArrowUpRight className="w-4 h-4" />
                      </Link>
                      {project.demoUrl && (
                        <a
                          href={project.demoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-muted hover:text-white transition-colors cursor-pointer"
                        >
                          {t('portfolio.projects.demo')}
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 5. Architecture Showcase */}
        <ArchitectureShowcase />

        {/* 6. Contact Section */}
        <section id="contact" className="w-full py-20 relative">
          <div className="absolute left-1/4 bottom-10 w-80 h-80 bg-accent/5 rounded-full blur-[140px] pointer-events-none -z-10" />
          <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-5 flex flex-col gap-6">
              <span className="font-mono text-xs text-primary font-semibold tracking-widest uppercase">{t('portfolio.contact.subtitle')}</span>
              <h2 className="font-display font-bold text-3xl md:text-5xl text-white">{t('portfolio.contact.title')}</h2>
              <p className="text-muted text-sm md:text-base leading-relaxed">
                {t('portfolio.contact.desc')}
              </p>
              <div className="flex flex-col gap-2 font-mono text-sm text-gray-400">
                <p>{t('portfolio.contact.email')}: <span className="text-white">namkndev86@gmail.com</span></p>
                <p>{t('portfolio.contact.timezone')}: <span className="text-white">UTC+07:00 / Hanoi, Vietnam</span></p>
              </div>
            </div>

            <div className="lg:col-span-7">
              <ContactForm />
            </div>
          </div>
        </section>
      </div>
    </LocaleProvider>
  )
}

// Fallback Mock Data Builders
function getDefaultSkills(): any[] {
  return [
    { id: "1", name: "React & Next.js", category: "Frontend", proficiency: 95, icon: "Layout" },
    { id: "2", name: "TypeScript & JavaScript", category: "Frontend", proficiency: 95, icon: "FileCode" },
    { id: "3", name: "Redux & MobX", category: "Frontend", proficiency: 90, icon: "Layers" },
    { id: "4", name: "Tailwind CSS & UI Libraries", category: "Frontend", proficiency: 92, icon: "Palette" },
    { id: "5", name: "Node.js & Spring Boot", category: "Backend", proficiency: 70, icon: "Server" },
    { id: "6", name: "PostgreSQL & MongoDB", category: "Backend", proficiency: 75, icon: "Database" },
    { id: "7", name: "WebSocket & Realtime APIs", category: "Backend", proficiency: 80, icon: "Network" },
    { id: "8", name: "Docker & Git Workflows", category: "DevOps", proficiency: 80, icon: "Container" },
    { id: "9", name: "Nx & Monorepo Tools", category: "DevOps", proficiency: 75, icon: "Workflow" },
  ]
}

function getDefaultExperiences(): any[] {
  return [
    {
      id: "1",
      company: "Viettel High Tech",
      role: "Frontend Developer (Onsite)",
      startDate: new Date("2026-01-01"),
      current: true,
      endDate: null,
      location: "Hanoi, Vietnam",
      description: "Owned the frontend implementation of live camera monitoring and playback features, including video rendering, stream controls, player interactions, and error handling. Designed and maintained interactive vehicle tracking interfaces integrating Viettel Maps API. Integrated WebSocket-based communication to deliver real-time updates.",
    },
    {
      id: "2",
      company: "VTI Joint Stock Company",
      role: "Frontend Developer",
      startDate: new Date("2024-07-01"),
      current: false,
      endDate: new Date("2026-01-15"),
      location: "Hanoi, Vietnam",
      description: "Led frontend development for MESCORE and WMS-X modules, managing a team of 5 frontend engineers. Designed and maintained scalable frontend architecture including state management patterns and centralized API communication layers. Optimized performance through virtualization, memoization, and lazy loading for datasets exceeding 300,000 records.",
    },
    {
      id: "3",
      company: "Vietnam Maritime Corporation (VIMC)",
      role: "Fullstack Developer (Onsite)",
      startDate: new Date("2022-10-01"),
      current: false,
      endDate: new Date("2024-05-01"),
      location: "Hanoi, Vietnam",
      description: "Developed document workflows and approval systems using React, MobX, and Ant Design. Extended and maintained CKEditor 5/Tiptap Editor integrations. Built RESTful APIs using Spring Boot, Express, and Prisma ORM.",
    },
    {
      id: "4",
      company: "Thinkdiff AI Co., Ltd",
      role: "Intern Next.js Developer",
      startDate: new Date("2022-08-01"),
      current: false,
      endDate: new Date("2022-09-01"),
      location: "Hanoi, Vietnam",
      description: "Developed note management features (CRUD) using Next.js 13 and Ant Design. Implemented App Router, dynamic routing, and built responsive user interfaces using TailwindCSS.",
    },
  ]
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
  ]
}
