import { PrismaClient, Role } from '@prisma/client'
import * as bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seeding...')

  // Clear existing data (in order of relations)
  await prisma.contactMessage.deleteMany({})
  await prisma.projectImage.deleteMany({})
  await prisma.blogPost.deleteMany({})
  await prisma.blogTag.deleteMany({})
  await prisma.blogCategory.deleteMany({})
  await prisma.project.deleteMany({})
  await prisma.experience.deleteMany({})
  await prisma.skill.deleteMany({})
  await prisma.profile.deleteMany({})
  await prisma.user.deleteMany({})

  console.log('🧹 Cleaned existing database tables')

  // 1. Create Admin User
  const hashedPassword = bcrypt.hashSync('Password123!', 10)
  const adminUser = await prisma.user.create({
    data: {
      email: 'admin@portfolio.com',
      password: hashedPassword,
      role: Role.ADMIN,
    },
  })
  console.log('👤 Admin user created:', adminUser.email)

  // 2. Create Profile
  const profile = await prisma.profile.create({
    data: {
      userId: adminUser.id,
      name: 'Alex Rivera',
      title: 'Senior Fullstack Architect & AI Engineer',
      tagline: 'Crafting high-performance distributed systems and cinematic frontend experiences.',
      bio: 'I am a software architect and creative developer with over 8 years of experience building scalable web applications. Specializing in Next.js, Go, TypeScript, and cloud-native infrastructure, I bridge the gap between complex backend architectures and highly polished, interactive user interfaces.',
      avatarUrl: '/images/avatar.jpg',
      resumeUrl: '/documents/resume.pdf',
      githubUrl: 'https://github.com',
      linkedinUrl: 'https://linkedin.com',
      twitterUrl: 'https://twitter.com',
    },
  })
  console.log('📄 Admin profile created')

  // 3. Create Skills
  const skillsData = [
    // Frontend
    { name: 'Next.js 15 & React 19', category: 'Frontend', proficiency: 98, icon: 'Layout' },
    { name: 'TypeScript', category: 'Frontend', proficiency: 95, icon: 'FileCode' },
    { name: 'Tailwind CSS v4', category: 'Frontend', proficiency: 92, icon: 'Palette' },
    { name: 'Framer Motion & GSAP', category: 'Frontend', proficiency: 88, icon: 'Sparkles' },
    // Backend & DB
    { name: 'Node.js & Go', category: 'Backend', proficiency: 90, icon: 'Server' },
    { name: 'PostgreSQL & Prisma', category: 'Backend', proficiency: 94, icon: 'Database' },
    { name: 'GraphQL & REST APIs', category: 'Backend', proficiency: 92, icon: 'Network' },
    // DevOps
    { name: 'Docker & Kubernetes', category: 'DevOps', proficiency: 85, icon: 'Container' },
    { name: 'AWS & Vercel', category: 'DevOps', proficiency: 88, icon: 'Cloud' },
    { name: 'CI/CD (GitHub Actions)', category: 'DevOps', proficiency: 87, icon: 'Workflow' },
  ]

  for (const skill of skillsData) {
    await prisma.skill.create({ data: skill })
  }
  console.log(`⚡ Seeded ${skillsData.length} skills`)

  // 4. Create Experience
  const experiencesData = [
    {
      company: 'Vanguard Systems',
      role: 'Principal Software Architect',
      startDate: new Date('2023-03-01'),
      current: true,
      location: 'San Francisco, CA (Hybrid)',
      description: 'Lead technical design and development of next-generation cloud platforms using Next.js, Go, and AWS. Establish system architectures for micro-frontend integration, leading a cross-functional team of 14 engineers. Optimized database query engines leading to a 34% reduction in API response times.',
    },
    {
      company: 'Novatech Lab',
      role: 'Senior Fullstack Engineer',
      startDate: new Date('2020-05-15'),
      endDate: new Date('2023-02-28'),
      current: false,
      location: 'Remote',
      description: 'Designed and deployed high-traffic dashboard suites using React, Node.js, and PostgreSQL. Migrated legacy monolith systems to cloud-native microservices using Docker. Implemented real-time analytical reporting services consuming Kafka event buses.',
    },
    {
      company: 'AppGenesis',
      role: 'Software Engineer',
      startDate: new Date('2018-06-01'),
      endDate: new Date('2020-05-01'),
      current: false,
      location: 'Austin, TX',
      description: 'Developed and maintained responsive web client interfaces. Collaborated closely with design leads to construct highly interactive experiences using Framer Motion and GSAP. Managed CI/CD workflows and automated end-to-end testing cycles.',
    },
  ]

  for (const exp of experiencesData) {
    await prisma.experience.create({ data: exp })
  }
  console.log(`💼 Seeded ${experiencesData.length} experience records`)

  // 5. Create Blog Categories & Tags
  const catArchitecture = await prisma.blogCategory.create({
    data: { name: 'Architecture', slug: 'architecture' },
  })
  const catEngineering = await prisma.blogCategory.create({
    data: { name: 'Engineering', slug: 'engineering' },
  })
  const catDesign = await prisma.blogCategory.create({
    data: { name: 'Design', slug: 'design' },
  })

  const tagNextjs = await prisma.blogTag.create({
    data: { name: 'Next.js', slug: 'nextjs' },
  })
  const tagTailwind = await prisma.blogTag.create({
    data: { name: 'Tailwind CSS', slug: 'tailwind' },
  })
  const tagPostgres = await prisma.blogTag.create({
    data: { name: 'PostgreSQL', slug: 'postgres' },
  })
  const tagWebperf = await prisma.blogTag.create({
    data: { name: 'Performance', slug: 'performance' },
  })
  console.log('🏷️ Seeded blog categories and tags')

  // 6. Create Blog Posts
  await prisma.blogPost.create({
    data: {
      title: 'Architecting a Resilient Serverless API with Next.js 15',
      slug: 'architecting-resilient-serverless-api-nextjs15',
      summary: 'Explore advanced caching strategies, connection pooling with Prisma, and error isolation methods inside Next.js 15 serverless functions.',
      content: `## The Serverless Database Connection Dilemma

One of the most persistent hurdles in serverless environments is database connection management. Unlike traditional long-running Node.js servers, serverless functions scale horizontally instantly, spinning up and tearing down container instances rapidly. If not properly configured, each instance establishes a separate connection to your PostgreSQL database, quickly exhausting the maximum connection limit.

### Using Prisma Client Singleton

To mitigate connection exhaustion, we instantiate the Prisma client using a global singleton pattern in development and leverage database proxies like Neon Connection Pooling or Supabase Supavisor in production.

\`\`\`typescript
import { PrismaClient } from '@prisma/client'

const prismaClientSingleton = () => {
  return new PrismaClient()
}

declare global {
  var prismaGlobal: undefined | ReturnType<typeof prismaClientSingleton>
}

const prisma = globalThis.prismaGlobal ?? prismaClientSingleton()
export default prisma
\`\`\`

### Caching and Revalidation

With the Next.js 15 App Router, you can leverage dynamic routing tags and the fetch cache to optimize read operations:

*   Use \`revalidatePath\` to selectively purge cached routes upon content mutation.
*   Enforce \`stale-while-revalidate\` patterns using Route Handler headers to serve instantaneous cached payloads while fetching fresh updates asynchronously.
`,
      published: true,
      publishedAt: new Date(),
      coverImage: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=800',
      authorId: adminUser.id,
      categoryId: catArchitecture.id,
      tags: { connect: [{ id: tagNextjs.id }, { id: tagPostgres.id }] },
    },
  })

  await prisma.blogPost.create({
    data: {
      title: 'Mastering Tailwind CSS v4: What Developers Need to Know',
      slug: 'mastering-tailwind-css-v4',
      summary: 'Tailwind CSS v4 introduces a fully overhauled compiler, CSS-first configuration, and native cascading variables. Discover the performance implications and migration pathways.',
      content: `## The Evolution of Utility-First Styling

Tailwind CSS v4 marks a dramatic shift in how utility styles are compiled. Moving away from the JavaScript-based configuration model (\`tailwind.config.js\`), version 4 adopts a native CSS architecture. 

### CSS-First Configurations

Instead of writing a JavaScript configuration, you customize your design tokens directly inside your global CSS file using standard CSS custom properties or specific custom Tailwind directives:

\`\`\`css
@import "tailwindcss";

@theme {
  --color-brand-500: #3b82f6;
  --font-display: "Outfit", sans-serif;
  --animate-orbit: orbit 10s linear infinite;
}
\`\`\`

### Dramatic Compilation Performance Gains

Thanks to the Rust-based compiler engine (Oxide), compilation speeds are up to 10x faster compared to v3, enabling instant Hot Module Replacement (HMR) and significantly lighter build payloads.
`,
      published: true,
      publishedAt: new Date(),
      coverImage: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?q=80&w=800',
      authorId: adminUser.id,
      categoryId: catDesign.id,
      tags: { connect: [{ id: tagTailwind.id }, { id: tagWebperf.id }] },
    },
  })
  console.log('✍️ Seeded blog posts')

  // 7. Create Projects
  const project1 = await prisma.project.create({
    data: {
      title: 'Cinematic Developer Platform',
      slug: 'cinematic-developer-platform',
      description: 'An interactive portfolio featuring WebGL particle overlays, smooth scroll systems, and a fully functional content management dashboard.',
      content: `### Overview
This Living Portfolio Platform represents a highly customized showcase project featuring deep integrations of Framer Motion, GSAP, and Lenis smooth scroll engines. It provides a modular backend utilizing Nest-style Services and Repositories to isolate business logic, enabling simple management of data sources via an encrypted Admin Portal.

### Technical Stack
- **Framework**: Next.js 15 (App Router, React 19)
- **Database**: PostgreSQL with Prisma ORM
- **Animation**: GSAP (ScrollTrigger), Framer Motion, Lenis Smooth Scroll
- **CMS**: NextAuth with Credentials flow, React Hook Form + Zod
- **Styling**: Tailwind CSS v4, Lucide React
`,
      githubUrl: 'https://github.com/alexrivera/living-portfolio',
      demoUrl: 'https://portfolio.alexrivera.dev',
      featured: true,
      techStack: ['Next.js 15', 'React 19', 'Prisma', 'PostgreSQL', 'GSAP', 'Tailwind CSS v4'],
      challenges: 'Syncing smooth scroll behaviors with high-frequency GSAP scroll triggers while ensuring zero layout shifting or canvas tearing on low-spec mobile viewports.',
      solutions: 'Custom Lenis context wrapper that synchronizes scroll events with GSAP ScrollTrigger proxy methods, combined with Next.js dynamic routes lazy-loading the heavy canvas scripts.',
    },
  })

  const project2 = await prisma.project.create({
    data: {
      title: 'Distributed Log Broker (LogStream)',
      slug: 'distributed-log-broker-logstream',
      description: 'High-throughput, distributed event-streaming message broker written in Go, featuring sub-millisecond pub/sub operations.',
      content: `### Overview
LogStream is a distributed event broker designed to ingest, replicate, and persist streaming logs. Operating on a custom TCP binary protocol, it facilitates cluster replication using a lightweight Raft consensus algorithm, yielding high write throughput.

### Technical Stack
- **Backend Language**: Go (Golang)
- **Consensus**: Custom Raft Protocol Implementation
- **Storage Engine**: Write-Ahead Log (WAL) with Indexing
- **Client SDK**: Go, Node.js, Python
`,
      githubUrl: 'https://github.com/alexrivera/logstream',
      featured: true,
      techStack: ['Go', 'Raft Consensus', 'WAL', 'TCP Socket', 'gRPC', 'Docker'],
      challenges: 'Handling cluster partition scenarios gracefully without compromising data durability or experiencing index duplication during recovery phases.',
      solutions: 'Implemented a strict term-validation step during leader election in the Raft module, coupled with write-ahead log indexing offsets enforcing transactional offsets.',
    },
  })

  console.log('🎨 Seeded projects')

  // 8. Create Project Images
  await prisma.projectImage.createMany({
    data: [
      {
        projectId: project1.id,
        url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=800',
        alt: 'Cinematic Developer Platform Home Mockup',
        isMain: true,
      },
      {
        projectId: project2.id,
        url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=800',
        alt: 'Distributed Log Broker Performance Chart',
        isMain: true,
      },
    ],
  })
  console.log('🖼️ Seeded project screenshots')

  // 9. Create Contact Messages
  await prisma.contactMessage.createMany({
    data: [
      {
        name: 'Sarah Connor',
        email: 'sarah@cyberdyne.com',
        subject: 'Inquiry: Cloud Migration Contract',
        message: 'Hello Alex, I read your post about resilient serverless architectures. We are planning to migrate our main system to Next.js and Go on AWS, and we would love to bring you on as a consulting architect. Let me know when you are available to chat!',
        read: false,
      },
      {
        name: 'Bruce Wayne',
        email: 'bruce@waynecorp.com',
        subject: 'Urgent: Tech Stack Consultation',
        message: 'Need a customized analytics dashboard configured with sub-second response queries over large scale databases. Saw your LogStream project. Let me know your rates.',
        read: true,
      },
    ],
  })
  console.log('✉️ Seeded contact messages')

  console.log('🎉 Seeding successfully completed!')
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
