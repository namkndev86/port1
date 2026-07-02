import { BlogService } from "@/services/blog.service"
import { notFound } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Calendar, User, Clock, Tag } from "lucide-react"
import { formatDate } from "@/lib/utils"
import type { Metadata } from "next"
import { getDictionary } from "@/i18n/get-dictionary"
import { LocaleProvider } from "@/components/common/locale-provider"
import { getTranslation } from "@/i18n/server"
import type { Locale } from "@/i18n/config"

interface BlogPostDetailPageProps {
  params: Promise<{ locale: string; slug: string }>
}

// Generate dynamic metadata
export async function generateMetadata({ params }: BlogPostDetailPageProps): Promise<Metadata> {
  const { slug } = await params
  const blogService = new BlogService()
  try {
    const post = await blogService.getPostBySlug(slug)
    if (post.archived || !post.published) {
      return {
        title: "Blog Publication",
        description: "Read technical publication details",
      }
    }
    return {
      title: post.title,
      description: post.summary,
    }
  } catch {
    return {
      title: "Blog Publication",
      description: "Read technical publication details",
    }
  }
}

export default async function BlogPostDetailPage({ params }: BlogPostDetailPageProps) {
  const { locale, slug } = await params
  const blogService = new BlogService()
  let post: any = null

  const commonDict = await getDictionary(locale as Locale, 'common')
  const blogDict = await getDictionary(locale as Locale, 'blog')
  const dictionary = { common: commonDict, blog: blogDict }
  const { t } = await getTranslation(locale as Locale)

  try {
    post = await blogService.getPostBySlug(slug)
    if (post.archived || !post.published) {
      notFound()
    }
  } catch (err) {
    // Check mock data
    const mock = getMockPostBySlug(slug)
    if (!mock) {
      notFound()
    }
    post = mock
  }

  // Calculate mock reading time
  const wordCount = post.content.split(/\s+/).length
  const readTime = Math.ceil(wordCount / 200)

  const getHref = (path: string) => {
    return path === "/" ? `/${locale}` : `/${locale}${path}`
  }

  return (
    <LocaleProvider locale={locale as Locale} dictionary={dictionary}>
      <article className="max-w-3xl mx-auto px-6 py-12 md:py-20 flex flex-col gap-8">
        {/* Back button */}
        <div>
          <Link
            href={getHref("/blog")}
            className="inline-flex items-center gap-2 text-sm text-muted hover:text-foreground transition-colors group cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            {t('blog.back')}
          </Link>
        </div>

        {/* Header Info */}
        <div className="flex flex-col gap-4 border-b border-card-border/40 pb-6">
          <div className="flex flex-wrap items-center gap-3 text-xs text-muted font-mono">
            <span className="px-2 py-0.5 rounded bg-primary/10 border border-primary/20 text-primary uppercase font-bold text-[10px]">
              {t(`blog.categories.${post.category.slug}` as any) || post.category.name}
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              {t('blog.published_at', { date: formatDate(post.createdAt) })}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              {t('blog.read_time', { minutes: readTime })}
            </span>
          </div>

          <h1 className="font-display font-black text-3xl md:text-5xl text-foreground leading-tight">
            {post.title}
          </h1>

          <div className="flex items-center gap-3 mt-2 text-sm text-muted font-mono">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
              <User className="w-4 h-4" />
            </div>
            <span>{locale === 'vi' ? 'Viết bởi Nguyen Khac Nam' : locale === 'ja' ? '著者：Nguyen Khac Nam' : 'Written by Nguyen Khac Nam'}</span>
          </div>
        </div>

        {/* Cover Image banner */}
        {post.coverImage && (
          <div className="w-full h-64 md:h-96 rounded-2xl overflow-hidden border border-card-border glass p-1">
            <img src={post.coverImage} alt={post.title} className="w-full h-full object-cover rounded-xl" />
          </div>
        )}

        {/* Blog content write-up */}
        <div className="prose dark:prose-invert max-w-none text-muted text-sm md:text-base leading-relaxed flex flex-col gap-6 whitespace-pre-line">
          {post.content}
        </div>

        {/* Tags list */}
        {post.tags && post.tags.length > 0 && (
          <div className="border-t border-card-border/40 pt-6 mt-6 flex items-center gap-2 flex-wrap">
            <Tag className="w-4 h-4 text-muted shrink-0" />
            <span className="text-xs text-muted font-mono mr-1">{locale === 'vi' ? 'Thẻ:' : locale === 'ja' ? 'タグ:' : 'Tags:'}</span>
            {post.tags.map((tag: any) => (
              <span
                key={tag.id}
                className="px-2.5 py-1 rounded bg-card border border-card-border text-xs font-mono text-muted-dark"
              >
                #{tag.name}
              </span>
            ))}
          </div>
        )}
      </article>
    </LocaleProvider>
  )
}

function getMockPostBySlug(slug: string) {
  const list = [
    {
      id: "1",
      title: "Architecting a Resilient Serverless API with Next.js 15",
      slug: "architecting-resilient-serverless-api-nextjs15",
      summary: "Explore advanced caching strategies, connection pooling with Prisma, and error isolation methods inside Next.js 15 serverless functions.",
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
      coverImage: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=800",
      createdAt: new Date(),
      category: { id: "1", name: "Architecture", slug: "architecture" },
      tags: [
        { id: "t1", name: "Next.js" },
        { id: "t2", name: "PostgreSQL" },
      ],
    },
    {
      id: "2",
      title: "Mastering Tailwind CSS v4: What Developers Need to Know",
      slug: "mastering-tailwind-css-v4",
      summary: "Tailwind CSS v4 introduces a fully overhauled compiler, CSS-first configuration, and native cascading variables. Discover the performance implications and migration pathways.",
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
      coverImage: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?q=80&w=800",
      createdAt: new Date(),
      category: { id: "3", name: "Design", slug: "design" },
      tags: [
        { id: "t3", name: "Tailwind CSS" },
        { id: "t4", name: "Performance" },
      ],
    },
  ]
  return list.find((p) => p.slug === slug)
}
