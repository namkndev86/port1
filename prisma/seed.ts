import "dotenv/config"
import { PrismaClient, Role } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'
import * as bcrypt from 'bcryptjs'

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
})
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

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
      email: 'namkndev86@gmail.com',
      password: hashedPassword,
      role: Role.ADMIN,
    },
  })
  console.log('👤 Admin user created:', adminUser.email)

  // 2. Create Profile
  const profile = await prisma.profile.create({
    data: {
      userId: adminUser.id,
      name: 'Nguyen Khac Nam',
      title: 'Frontend Developer',
      tagline: 'Building high-performance enterprise web applications and crafting reusable frontend interfaces.',
      bio: 'Frontend Developer with 3+ years of experience building enterprise-scale web applications using React and TypeScript. Specializing in leading frontend development for business-critical modules, designing scalable architectures, building reusable component systems, and optimizing application performance.',
      avatarUrl: '/images/avatar.jpg',
      resumeUrl: '/documents/resume.pdf',
      githubUrl: 'https://github.com/namkndev86/',
      linkedinUrl: 'https://www.linkedin.com/in/namkndev86/',
      twitterUrl: 'https://x.com/namkndev86',
    },
  })
  console.log('📄 Admin profile created')

  // 3. Create Skills
  const skillsData = [
    // Frontend
    { name: 'React & Next.js', category: 'Frontend', proficiency: 95, icon: 'Layout' },
    { name: 'TypeScript & JavaScript', category: 'Frontend', proficiency: 95, icon: 'FileCode' },
    { name: 'Redux & MobX', category: 'Frontend', proficiency: 90, icon: 'Layers' },
    { name: 'Tailwind CSS & UI Libraries', category: 'Frontend', proficiency: 92, icon: 'Palette' },
    // Backend & DB
    { name: 'Node.js & Spring Boot', category: 'Backend', proficiency: 70, icon: 'Server' },
    { name: 'PostgreSQL & MongoDB', category: 'Backend', proficiency: 75, icon: 'Database' },
    { name: 'WebSocket & Realtime APIs', category: 'Backend', proficiency: 80, icon: 'Network' },
    // DevOps
    { name: 'Docker & Git Workflows', category: 'DevOps', proficiency: 80, icon: 'Container' },
    { name: 'Nx & Monorepo Tools', category: 'DevOps', proficiency: 75, icon: 'Workflow' },
  ]

  for (const skill of skillsData) {
    await prisma.skill.create({ data: skill })
  }
  console.log(`⚡ Seeded ${skillsData.length} skills`)

  // 4. Create Experience
  const experiencesData = [
    {
      company: 'Viettel High Tech',
      role: 'Frontend Developer (Onsite)',
      startDate: new Date('2026-01-01'),
      current: true,
      location: 'Hanoi, Vietnam',
      description: 'Owned the frontend implementation of live camera monitoring and playback features, including video rendering, stream controls, player interactions, and error handling for various streaming states. Designed and maintained interactive monitoring interfaces integrating Viettel Maps API, real-time vehicle tracking, camera visualization, and operational management workflows. Integrated WebSocket-based communication to deliver real-time updates for vehicle locations, camera statuses, alerts, and monitoring events.',
    },
    {
      company: 'VTI Joint Stock Company',
      role: 'Frontend Developer',
      startDate: new Date('2024-07-15'),
      endDate: new Date('2026-01-15'),
      current: false,
      location: 'Hanoi, Vietnam',
      description: 'Led frontend development for MESCORE and WMS-X modules, managing a team of 5 frontend engineers and coordinating delivery within a 15-member frontend organization. Designed and maintained scalable frontend architecture for MESCORE and WMS-X, including component structure, routing, state management, design system integration, and shared utilities. Established standardized data management patterns across Global State (Redux), Server State (SWR), and Local State. Optimized performance using virtualization, memoization, and lazy loading for datasets exceeding 300,000 records.',
    },
    {
      company: 'Vietnam Maritime Corporation (VIMC)',
      role: 'Fullstack Developer (Onsite)',
      startDate: new Date('2022-10-01'),
      endDate: new Date('2024-05-01'),
      current: false,
      location: 'Hanoi, Vietnam',
      description: 'Developed new pages and features for document workflows and approval systems using React, MobX, and Ant Design. Extended and maintained CKEditor 5 and Tiptap integrations. Built backend REST APIs with Spring Boot, Express, and Prisma ORM with PostgreSQL / MongoDB databases.',
    },
    {
      company: 'Thinkdiff AI Co., Ltd',
      role: 'Intern Next.js Developer',
      startDate: new Date('2022-08-01'),
      endDate: new Date('2022-09-30'),
      current: false,
      location: 'Hanoi, Vietnam',
      description: 'Developed note management features (CRUD) using Next.js 13 and Ant Design. Implemented App Router, dynamic routing, and built responsive user interfaces using TailwindCSS.',
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
      title: 'Vtracking Viettel',
      slug: 'vtracking-viettel',
      description: 'Vehicle tracking and online monitoring solution utilizing GPS, mobile data transmission, and Geographic Information Systems (GIS) to provide real-time tracking and location monitoring.',
      content: `### Overview
VTracking is a vehicle tracking and online monitoring solution that utilizes GPS technology, mobile data transmission, and Geographic Information Systems (GIS) to provide real-time vehicle tracking and location monitoring on digital maps.

### Technical Stack
- **Frontend**: jQuery, Bootstrap, Twirl Template (SSR), Viettel Maps API, WebSocket, Video Streaming (JSMpeg, Jessibuca)
- **Backend**: Play Framework, Microservices (Go, PostgreSQL, MongoDB, Kafka, ClickHouse)
`,
      githubUrl: 'https://github.com/namkndev86/port1',
      featured: true,
      techStack: ['jQuery', 'Bootstrap', 'WebSocket', 'Video Streaming', 'Play Framework', 'Go'],
      challenges: 'Handling heavy live video streams and sub-second location updates on high-frequency vehicle markers on maps.',
      solutions: 'Optimized markers render pipeline using canvas-based marker clustering, and implemented a WebSocket throttle handler to smooth marker transitions.',
    },
  })

  const project2 = await prisma.project.create({
    data: {
      title: 'Manufacturing Execution System (MES-X)',
      slug: 'manufacturing-execution-system-mes-x',
      description: 'A comprehensive management solution that provides an overview of the entire manufacturing process with 5 modules: MESCore, WMS-X, MMS-X, QMS-X, PMS-X.',
      content: `### Overview
A comprehensive management solution that provides an overview of the entire manufacturing process with 5 modules: MESCore, WMS-X, MMS-X, QMS-X, PMS-X.

### Technical Stack
- **Frontend**: React, Redux, Redux-Saga, SWR, React Hook Form, Material UI, Recharts, React Virtuoso
- **Backend**: Microservices (NestJS, PostgreSQL, MongoDB, Kafka, Redis, ClickHouse)
`,
      githubUrl: 'https://github.com/namkndev86/port1',
      featured: true,
      techStack: ['React', 'Redux', 'SWR', 'React Hook Form', 'Material UI', 'NestJS'],
      challenges: 'Optimizing list performance for massive tables containing 300,000+ data rows with sub-millisecond input response.',
      solutions: 'Integrated React Virtuoso for window-based row rendering virtualization, memoized table components, and structured local component inputs.',
    },
  })

  const project3 = await prisma.project.create({
    data: {
      title: 'VIMC E-Office & VIMC LINES',
      slug: 'vimc-e-office-lines',
      description: 'Internal document workflow management, task assignment, container logistics operations and supply chain tracking suites for Vietnam Maritime Corporation.',
      content: `### Overview
E-Office provides features for document processing, task management, records management, and online internal communication. VIMC LINES provides container transportation services, port operations, and logistics supply chain services.

### Technical Stack
- **Frontend**: React, MobX, Ant Design, Styled-Components, React Query, Axios, i18next, Tiptap Editor
- **Backend**: Java (Spring Boot), Express, Prisma ORM, PostgreSQL / MySQL, Redis
`,
      githubUrl: 'https://github.com/namkndev86/port1',
      featured: true,
      techStack: ['React', 'MobX', 'Ant Design', 'Spring Boot', 'Express', 'Prisma ORM'],
      challenges: 'Ensuring consistent UI style libraries while bridging two distinct systems running different React state managers.',
      solutions: 'Developed custom wrappers mapping Ant Design styles over styled-components, and integrated modular React Query instances for API caching.',
    },
  })

  const project4 = await prisma.project.create({
    data: {
      title: 'SamNotes',
      slug: 'samnotes',
      description: 'Intuitive web application to log notes, tasks, ideas and access user workspace metadata anywhere, anytime.',
      content: `### Overview
A web app to note information, ideas, tasks and access the application anytime, anywhere.

### Technical Stack
- **Frontend**: Next.js 13, TailwindCSS, Ant Design
- **Backend**: Python (Flask), MySQL
`,
      githubUrl: 'https://github.com/namkndev86/port1',
      featured: true,
      techStack: ['Next.js 13', 'TailwindCSS', 'Ant Design', 'Flask', 'MySQL'],
      challenges: 'Implementing routing rules matching Next.js 13 App Router specs during early migration periods.',
      solutions: 'Leveraged dynamic path params layouts and compiled static routes where client interactivity was minimized.',
    },
  })

  console.log('🎨 Seeded projects')

  // 8. Create Project Images
  await prisma.projectImage.createMany({
    data: [
      {
        projectId: project1.id,
        url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=800',
        alt: 'Vtracking Viettel Mockup',
        isMain: true,
      },
      {
        projectId: project2.id,
        url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=800',
        alt: 'Manufacturing Execution System Performance',
        isMain: true,
      },
      {
        projectId: project3.id,
        url: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=800',
        alt: 'VIMC E-Office & LINES Client UI',
        isMain: true,
      },
      {
        projectId: project4.id,
        url: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?q=80&w=800',
        alt: 'SamNotes App Workspace',
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
