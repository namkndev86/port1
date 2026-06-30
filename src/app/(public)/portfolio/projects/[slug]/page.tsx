import { ProjectService } from "@/services/project.service"
import { notFound } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, ExternalLink, Terminal, Shield, Sparkles } from "lucide-react"
import { GithubIcon as Github } from "@/components/ui/social-icons"
import type { Metadata } from "next"

interface ProjectDetailPageProps {
  params: Promise<{ slug: string }>
}

// Generate dynamic metadata
export async function generateMetadata({ params }: ProjectDetailPageProps): Promise<Metadata> {
  const { slug } = await params
  const projectService = new ProjectService()
  try {
    const project = await projectService.getProjectBySlug(slug)
    return {
      title: project.title,
      description: project.description,
    }
  } catch {
    return {
      title: "Project Detail",
      description: "Showcase project detail overview",
    }
  }
}

export default async function ProjectDetailPage({ params }: ProjectDetailPageProps) {
  const { slug } = await params
  const projectService = new ProjectService()
  let project: any = null

  try {
    project = await projectService.getProjectBySlug(slug)
  } catch (err) {
    // If not found in DB, search mock data
    const mock = getMockProjectBySlug(slug)
    if (!mock) {
      notFound()
    }
    project = mock
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-12 md:py-20 flex flex-col gap-10">
      {/* Back button */}
      <div>
        <Link
          href="/portfolio"
          className="inline-flex items-center gap-2 text-sm text-muted hover:text-white transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Portfolio
        </Link>
      </div>

      {/* Header Info */}
      <div className="flex flex-col gap-4 border-b border-card-border/40 pb-8">
        <h1 className="font-display font-black text-3xl md:text-5xl text-white">
          {project.title}
        </h1>
        <p className="text-muted text-base md:text-lg leading-relaxed max-w-2xl">
          {project.description}
        </p>

        {/* Links row */}
        <div className="flex items-center gap-4 mt-2">
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm font-semibold text-white hover:text-primary transition-colors"
            >
              <Github className="w-4 h-4" />
              Source Code
            </a>
          )}
          {project.demoUrl && (
            <a
              href={project.demoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm font-semibold text-accent hover:text-accent-hover transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
              Live Deployment
            </a>
          )}
        </div>
      </div>

      {/* Detail grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
        
        {/* Main Details Body */}
        <div className="md:col-span-8 flex flex-col gap-8">
          
          {/* Challenge Card */}
          <div className="glass rounded-2xl p-6 border border-red-500/10 bg-red-950/5 flex flex-col gap-3">
            <h3 className="font-display font-bold text-lg text-white flex items-center gap-2">
              <Terminal className="w-5 h-5 text-red-400" />
              Technical Challenge
            </h3>
            <p className="text-muted text-sm leading-relaxed whitespace-pre-line">
              {project.challenges}
            </p>
          </div>

          {/* Solution Card */}
          <div className="glass rounded-2xl p-6 border border-accent/10 bg-accent/5 flex flex-col gap-3">
            <h3 className="font-display font-bold text-lg text-white flex items-center gap-2">
              <Shield className="w-5 h-5 text-accent" />
              Engineering Solution
            </h3>
            <p className="text-muted text-sm leading-relaxed whitespace-pre-line">
              {project.solutions}
            </p>
          </div>

          {/* Project Write-up / Content */}
          <div className="prose prose-invert max-w-none text-muted text-sm md:text-base leading-relaxed flex flex-col gap-6">
            <h3 className="font-display font-bold text-xl text-white border-b border-card-border pb-2">
              Architecture Overview & Setup
            </h3>
            <div className="whitespace-pre-line">
              {project.content}
            </div>
          </div>
        </div>

        {/* Sidebar Info */}
        <div className="md:col-span-4 flex flex-col gap-6">
          
          {/* Tech Stack card */}
          <div className="glass rounded-2xl p-6 flex flex-col gap-4">
            <h4 className="font-display font-bold text-white flex items-center gap-2 text-sm uppercase tracking-wider">
              <Sparkles className="w-4 h-4 text-primary" />
              Technologies
            </h4>
            <div className="flex flex-wrap gap-2">
              {project.techStack.map((tech: string) => (
                <span
                  key={tech}
                  className="px-3 py-1 rounded bg-[#050811] border border-card-border/60 text-xs font-mono text-gray-300"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>

          {/* Project Screenshots */}
          {project.images && project.images.length > 0 && (
            <div className="flex flex-col gap-4">
              <h4 className="font-display font-bold text-white text-sm uppercase tracking-wider">
                Screenshots
              </h4>
              <div className="flex flex-col gap-3">
                {project.images.map((img: any) => (
                  <div key={img.id} className="rounded-xl overflow-hidden border border-card-border glass p-1.5 hover:border-primary/30 transition-colors">
                    <img src={img.url} alt={img.alt || project.title} className="w-full h-auto object-cover rounded-lg" />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// Fallback Mock Projects search by Slug
function getMockProjectBySlug(slug: string) {
  const list = [
    {
      title: "Cinematic Developer Platform",
      slug: "cinematic-developer-platform",
      description: "An interactive portfolio featuring WebGL particle overlays, smooth scroll systems, and a fully functional content management dashboard.",
      content: `### Architecture Breakdown
The Cinematic Developer Platform is structured to offer maximum scrolling efficiency while serving highly interactive pages. By utilizing Next.js 15 Server Components for initial loading and lazy-loading heavy canvas operations, we keep initial load size to a minimum.

### Client-Side Transitions
Custom Framer Motion animations slide layouts upon router page requests. Lenis smooth scroll maintains regular browser coordinates allowing GSAP ScrollTrigger to capture layout positions correctly without lag.`,
      githubUrl: "https://github.com/alexrivera/living-portfolio",
      demoUrl: "https://portfolio.alexrivera.dev",
      techStack: ["Next.js 15", "React 19", "Prisma", "PostgreSQL", "GSAP", "Tailwind CSS v4"],
      challenges: "Syncing smooth scroll behaviors with high-frequency GSAP scroll triggers while ensuring zero layout shifting or canvas tearing on low-spec mobile viewports.",
      solutions: "Custom Lenis context wrapper that synchronizes scroll events with GSAP ScrollTrigger proxy methods, combined with Next.js dynamic routes lazy-loading the heavy canvas scripts.",
      images: [],
    },
    {
      title: "Distributed Log Broker (LogStream)",
      slug: "distributed-log-broker-logstream",
      description: "High-throughput, distributed event-streaming message broker written in Go, featuring sub-millisecond pub/sub operations.",
      content: `### Ingest Lifecycle
When a client SDK writes a log, the message lands in the Leader's memory cache, is assigned a sequential offset, and is written to the Write-Ahead Log (WAL) index.

### Replication & Durability
The Raft module broadcasts log offsets to peer nodes. Once a quorum verifies offset storage, the message is officially marked as committed and is dispatched to listening client sockets.`,
      githubUrl: "https://github.com/alexrivera/logstream",
      demoUrl: null,
      techStack: ["Go", "Raft Consensus", "WAL", "TCP Socket", "gRPC", "Docker"],
      challenges: "Handling cluster partition scenarios gracefully without compromising data durability or experiencing index duplication during recovery phases.",
      solutions: "Implemented a strict term-validation step during leader election in the Raft module, coupled with write-ahead log indexing offsets enforcing transactional offsets.",
      images: [],
    },
  ]
  return list.find((p) => p.slug === slug)
}
