import { SkillService } from "@/services/skill.service"
import { ExperienceService } from "@/services/experience.service"
import { ProjectService } from "@/services/project.service"
import { UserRepository } from "@/repositories/user.repository"
import SkillsSection from "@/components/portfolio/SkillsSection"
import ExperienceTimeline from "@/components/portfolio/ExperienceTimeline"
import ArchitectureShowcase from "@/components/portfolio/ArchitectureShowcase"
import ContactForm from "@/components/portfolio/ContactForm"
import Link from "next/link"
import Image from "next/image"
import { ArrowUpRight, FileText, Code2 } from "lucide-react"
import { GithubIcon as Github, LinkedinIcon as Linkedin } from "@/components/ui/social-icons"

export const revalidate = 60 // Revalidate cache every minute

export default async function PortfolioPage() {
  const skillService = new SkillService()
  const expService = new ExperienceService()
  const projectService = new ProjectService()
  const userRepo = new UserRepository()

  // Data fetching containers
  let skills = []
  let experiences = []
  let projects = []
  let profile = {
    name: "Alex Rivera",
    title: "Senior Fullstack Architect & AI Engineer",
    bio: "I am a software architect and creative developer with over 8 years of experience building scalable web applications. Specializing in Next.js, Go, TypeScript, and cloud-native infrastructure, I bridge the gap between complex backend architectures and highly polished, interactive user interfaces.",
    tagline: "Crafting high-performance distributed systems and cinematic frontend experiences.",
    githubUrl: "https://github.com",
    linkedinUrl: "https://linkedin.com",
    twitterUrl: "https://twitter.com",
    resumeUrl: "#",
    avatarUrl: null,
  }

  try {
    // Attempt database fetching
    const [dbSkills, dbExperiences, dbProjects, dbUser] = await Promise.all([
      skillService.getSkills().catch(() => []),
      expService.getExperiences().catch(() => []),
      projectService.getFeaturedProjects().catch(() => []),
      userRepo.findByEmail("admin@portfolio.com").catch(() => null),
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
          githubUrl: dbProfile.githubUrl || "https://github.com",
          linkedinUrl: dbProfile.linkedinUrl || "https://linkedin.com",
          twitterUrl: dbProfile.twitterUrl || "https://twitter.com",
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

  return (
    <div className="w-full flex flex-col items-center">
      {/* 1. About / Hero Section */}
      <section id="about" className="w-full py-16 md:py-28 border-b border-card-border/40 relative">
        <div className="absolute left-1/3 top-1/4 w-80 h-80 bg-primary/10 rounded-full blur-[140px] pointer-events-none -z-10" />
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Bio text */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            <span className="font-mono text-xs text-primary font-semibold tracking-widest uppercase">Overview</span>
            <h1 className="font-display font-bold text-4xl md:text-6xl text-white leading-tight">
              Designing platforms that <span className="text-primary">scale</span> with integrity.
            </h1>
            <p className="text-muted text-base md:text-lg leading-relaxed">
              {profile.bio}
            </p>
            <div className="flex flex-wrap items-center gap-4">
              <a
                href={profile.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-5 py-2.5 rounded-full glass hover:text-primary hover:border-primary transition-all duration-300 text-sm font-semibold"
              >
                <Github className="w-4 h-4" />
                GitHub
              </a>
              <a
                href={profile.linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-5 py-2.5 rounded-full glass hover:text-primary hover:border-primary transition-all duration-300 text-sm font-semibold"
              >
                <Linkedin className="w-4 h-4" />
                LinkedIn
              </a>
              <a
                href={profile.resumeUrl}
                className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/5 border border-card-border hover:bg-white/10 hover:text-white transition-all duration-300 text-sm font-semibold"
              >
                <FileText className="w-4 h-4 text-muted" />
                Resume / CV
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
              <span className="font-mono text-xs text-primary font-semibold tracking-widest uppercase">Portfolio</span>
              <h2 className="font-display font-bold text-3xl md:text-5xl text-white">Featured Work</h2>
            </div>
            <Link
              href="/portfolio/projects"
              className="text-primary hover:text-accent font-semibold text-sm flex items-center gap-1 group"
            >
              Browse All Projects
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
                      href={`/portfolio/projects/${project.slug}`}
                      className="text-sm font-semibold text-white group-hover:text-primary flex items-center gap-1 transition-colors"
                    >
                      Project Details
                      <ArrowUpRight className="w-4 h-4" />
                    </Link>
                    {project.demoUrl && (
                      <a
                        href={project.demoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-muted hover:text-white transition-colors"
                      >
                        Live Demo
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
            <span className="font-mono text-xs text-primary font-semibold tracking-widest uppercase">Contact</span>
            <h2 className="font-display font-bold text-3xl md:text-5xl text-white">Let&apos;s Build Together.</h2>
            <p className="text-muted text-sm md:text-base leading-relaxed">
              Seeking an enterprise software consult, team scaling mentorship, or a technical implementation advisor? Use the secure portal to dispatch an inquiry.
            </p>
            <div className="flex flex-col gap-2 font-mono text-sm text-gray-400">
              <p>Email: <span className="text-white">alex@rivera-architect.com</span></p>
              <p>Time Zone: <span className="text-white">UTC-07:00 / Pacific</span></p>
            </div>
          </div>

          <div className="lg:col-span-7">
            <ContactForm />
          </div>
        </div>
      </section>
    </div>
  )
}

// Fallback Mock Data Builders
function getDefaultSkills(): any[] {
  return [
    { id: "1", name: "Next.js 15 & React 19", category: "Frontend", proficiency: 98, icon: "Layout" },
    { id: "2", name: "TypeScript", category: "Frontend", proficiency: 95, icon: "FileCode" },
    { id: "3", name: "Tailwind CSS v4", category: "Frontend", proficiency: 92, icon: "Palette" },
    { id: "4", name: "Framer Motion & GSAP", category: "Frontend", proficiency: 88, icon: "Sparkles" },
    { id: "5", name: "Node.js & Go", category: "Backend", proficiency: 90, icon: "Server" },
    { id: "6", name: "PostgreSQL & Prisma", category: "Backend", proficiency: 94, icon: "Database" },
    { id: "7", name: "GraphQL & REST APIs", category: "Backend", proficiency: 87, icon: "Network" },
    { id: "8", name: "Docker & Kubernetes", category: "DevOps", proficiency: 85, icon: "Container" },
    { id: "9", name: "AWS & Vercel", category: "DevOps", proficiency: 88, icon: "Cloud" },
  ]
}

function getDefaultExperiences(): any[] {
  return [
    {
      id: "1",
      company: "Vanguard Systems",
      role: "Principal Software Architect",
      startDate: new Date("2023-03-01"),
      current: true,
      endDate: null,
      location: "San Francisco, CA",
      description: "Lead technical design and development of next-generation cloud platforms using Next.js, Go, and AWS. Establish system architectures for micro-frontend integration, leading a cross-functional team of 14 engineers.",
    },
    {
      id: "2",
      company: "Novatech Lab",
      role: "Senior Fullstack Engineer",
      startDate: new Date("2020-05-15"),
      current: false,
      endDate: new Date("2023-02-28"),
      location: "Remote",
      description: "Designed and deployed high-traffic dashboard suites using React, Node.js, and PostgreSQL. Migrated legacy monolith systems to cloud-native microservices using Docker.",
    },
    {
      id: "3",
      company: "AppGenesis",
      role: "Software Engineer",
      startDate: new Date("2018-06-01"),
      current: false,
      endDate: new Date("2020-05-01"),
      location: "Austin, TX",
      description: "Developed and maintained responsive web client interfaces. Collaborated closely with design leads to construct highly interactive experiences using Framer Motion and GSAP.",
    },
  ]
}

function getDefaultProjects(): any[] {
  return [
    {
      id: "1",
      title: "Cinematic Developer Platform",
      slug: "cinematic-developer-platform",
      description: "An interactive portfolio featuring WebGL particle overlays, smooth scroll systems, and a fully functional content management dashboard.",
      techStack: ["Next.js 15", "React 19", "Prisma", "PostgreSQL", "GSAP", "Tailwind CSS v4"],
      demoUrl: "https://portfolio.alexrivera.dev",
      images: [],
    },
    {
      id: "2",
      title: "Distributed Log Broker (LogStream)",
      slug: "distributed-log-broker-logstream",
      description: "High-throughput, distributed event-streaming message broker written in Go, featuring sub-millisecond pub/sub operations.",
      techStack: ["Go", "Raft Consensus", "WAL", "TCP Socket", "gRPC", "Docker"],
      images: [],
    },
  ]
}
