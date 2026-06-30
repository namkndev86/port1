import { BlogService } from "@/services/blog.service"
import BlogSearchFilter from "@/components/blog/BlogSearchFilter"
import Link from "next/link"
import { formatDate } from "@/lib/utils"
import { Calendar, ChevronLeft, ChevronRight, User, BookOpen } from "lucide-react"

export const revalidate = 30 // Short cache time for active blog updates

interface BlogPageProps {
  searchParams: Promise<{
    category?: string
    search?: string
    page?: string
  }>
}

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const blogService = new BlogService()
  const params = await searchParams

  const categorySlug = params.category || undefined
  const search = params.search || undefined
  const page = parseInt(params.page || "1", 10)
  const limit = 5

  let posts: any[] = []
  let categories: any[] = []
  let total = 0

  try {
    const [dbData, dbCategories] = await Promise.all([
      blogService.getPosts({ categorySlug, search, page, limit }),
      blogService.getCategories(),
    ])
    posts = dbData.posts
    total = dbData.total
    categories = dbCategories

    if (posts.length === 0 && !categorySlug && !search) {
      posts = getDefaultBlogPosts()
      total = posts.length
      categories = getDefaultCategories()
    }
  } catch (err) {
    console.warn("⚠️ Failed to load database posts. Operating in static fallback mode.", err)
    posts = getDefaultBlogPosts().filter((p) => {
      const matchCat = !categorySlug || p.category.slug === categorySlug
      const matchSearch =
        !search ||
        p.title.toLowerCase().includes(search.toLowerCase()) ||
        p.summary.toLowerCase().includes(search.toLowerCase())
      return matchCat && matchSearch
    })
    total = posts.length
    categories = getDefaultCategories()
  }

  const totalPages = Math.ceil(total / limit) || 1

  return (
    <div className="max-w-4xl mx-auto px-6 py-12 md:py-20 flex flex-col gap-8">
      <div className="flex flex-col gap-3">
        <span className="font-mono text-xs text-primary font-semibold tracking-widest uppercase">Publications</span>
        <h1 className="font-display font-bold text-4xl md:text-6xl text-white">Technical Blog</h1>
        <p className="text-muted text-sm md:text-base max-w-xl">
          Thoughts on distributed systems design, typescript engineering, reactive frontends, and database optimizations.
        </p>
      </div>

      {/* Filter component */}
      <BlogSearchFilter categories={categories} />

      {/* Blog Posts list */}
      <div className="flex flex-col gap-8">
        {posts.map((post) => (
          <article
            key={post.id}
            className="glass rounded-2xl p-6 md:p-8 hover:border-primary/20 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 flex flex-col md:flex-row gap-6 group"
          >
            {/* Image Placeholder Visual */}
            <div className="w-full md:w-44 h-32 bg-gradient-to-br from-[#080d1e] to-[#040812] rounded-xl overflow-hidden border border-card-border shrink-0 flex items-center justify-center relative">
              <div className="absolute inset-0 bg-primary/5" />
              {post.coverImage ? (
                <img src={post.coverImage} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              ) : (
                <BookOpen className="w-8 h-8 text-primary/40 group-hover:scale-110 transition-transform duration-500" />
              )}
            </div>

            {/* Post meta details */}
            <div className="flex flex-col gap-3 flex-1">
              <div className="flex flex-wrap items-center gap-4 text-xs text-muted font-mono">
                <span className="px-2 py-0.5 rounded bg-primary/10 border border-primary/20 text-primary uppercase font-bold text-[10px]">
                  {post.category.name}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  {formatDate(post.createdAt)}
                </span>
              </div>

              <h3 className="font-display font-bold text-xl text-white group-hover:text-primary transition-colors">
                <Link href={`/blog/${post.slug}`}>{post.title}</Link>
              </h3>

              <p className="text-muted text-sm leading-relaxed">{post.summary}</p>

              <div className="flex items-center justify-between border-t border-card-border/40 pt-4 mt-2">
                <span className="flex items-center gap-1.5 text-xs text-muted font-mono">
                  <User className="w-3.5 h-3.5" />
                  Alex Rivera
                </span>
                <Link
                  href={`/blog/${post.slug}`}
                  className="text-xs font-semibold text-white group-hover:text-primary transition-colors"
                >
                  Read Article &rarr;
                </Link>
              </div>
            </div>
          </article>
        ))}

        {posts.length === 0 && (
          <div className="text-center py-20 border border-dashed border-card-border/60 rounded-3xl">
            <p className="text-muted text-sm">No articles found matching the current criteria.</p>
          </div>
        )}
      </div>

      {/* Pagination controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-4 mt-8 border-t border-card-border/40 pt-6">
          <Link
            href={`/blog?page=${Math.max(1, page - 1)}${categorySlug ? `&category=${categorySlug}` : ""}${
              search ? `&search=${search}` : ""
            }`}
            className={`flex items-center gap-1 px-4 py-2 rounded-xl border text-sm font-semibold transition-all ${
              page === 1
                ? "border-card-border/20 text-muted pointer-events-none opacity-40"
                : "glass text-white hover:border-primary"
            }`}
          >
            <ChevronLeft className="w-4 h-4" />
            Previous
          </Link>
          <span className="font-mono text-xs text-muted">
            Page {page} of {totalPages}
          </span>
          <Link
            href={`/blog?page=${Math.min(totalPages, page + 1)}${categorySlug ? `&category=${categorySlug}` : ""}${
              search ? `&search=${search}` : ""
            }`}
            className={`flex items-center gap-1 px-4 py-2 rounded-xl border text-sm font-semibold transition-all ${
              page === totalPages
                ? "border-card-border/20 text-muted pointer-events-none opacity-40"
                : "glass text-white hover:border-primary"
            }`}
          >
            Next
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      )}
    </div>
  )
}

function getDefaultCategories(): any[] {
  return [
    { id: "1", name: "Architecture", slug: "architecture" },
    { id: "2", name: "Engineering", slug: "engineering" },
    { id: "3", name: "Design", slug: "design" },
  ]
}

function getDefaultBlogPosts(): any[] {
  return [
    {
      id: "1",
      title: "Architecting a Resilient Serverless API with Next.js 15",
      slug: "architecting-resilient-serverless-api-nextjs15",
      summary: "Explore advanced caching strategies, connection pooling with Prisma, and error isolation methods inside Next.js 15 serverless functions.",
      coverImage: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=800",
      createdAt: new Date(),
      category: { id: "1", name: "Architecture", slug: "architecture" },
    },
    {
      id: "2",
      title: "Mastering Tailwind CSS v4: What Developers Need to Know",
      slug: "mastering-tailwind-css-v4",
      summary: "Tailwind CSS v4 introduces a fully overhauled compiler, CSS-first configuration, and native cascading variables. Discover the performance implications and migration pathways.",
      coverImage: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?q=80&w=800",
      createdAt: new Date(),
      category: { id: "3", name: "Design", slug: "design" },
    },
  ]
}
