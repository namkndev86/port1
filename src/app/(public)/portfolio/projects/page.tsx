import { ProjectService } from "@/services/project.service"
import ProjectsFilterList from "@/components/portfolio/ProjectsFilterList"

export const revalidate = 60

export default async function ProjectsPage() {
  const projectService = new ProjectService()
  let projects = []

  try {
    projects = await projectService.getProjects()
    if (projects.length === 0) {
      projects = getDefaultProjects()
    }
  } catch (err) {
    console.warn("⚠️ Failed to load database projects. Using fallback.", err)
    projects = getDefaultProjects()
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-12 md:py-20 flex flex-col gap-10">
      <div className="flex flex-col gap-3">
        <span className="font-mono text-xs text-primary font-semibold tracking-widest uppercase">Showcase</span>
        <h1 className="font-display font-bold text-4xl md:text-6xl text-white">All Projects</h1>
        <p className="text-muted text-sm md:text-base max-w-xl">
          Browse through the complete engineering portfolio, ranging from high-throughput backend services in Go to visual frontend suites.
        </p>
      </div>

      <ProjectsFilterList projects={projects} />
    </div>
  )
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
