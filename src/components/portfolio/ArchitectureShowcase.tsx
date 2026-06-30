"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Server, Database, Globe, Layers, ShieldCheck, Zap } from "lucide-react"
import { useTranslation } from "@/components/common/locale-provider"

const architectureNodes = [
  {
    id: "cdn",
    name: "Vercel CDN Edge",
    icon: Globe,
    description: "Serves globally distributed static files and statically compiled Next.js routes. Directs incoming client transactions to closest geographic serverless nodes.",
    tech: "Edge Routing, Edge Cache",
    x: "10%",
    y: "50%",
  },
  {
    id: "routing",
    name: "Next.js 15 Middleware",
    icon: ShieldCheck,
    description: "Evaluates cookies and auth status via next-auth to guard secure endpoints (like /admin) at the edge, before computing route page files.",
    tech: "Edge Auth, Route Guarding",
    x: "30%",
    y: "50%",
  },
  {
    id: "app",
    name: "Next.js Server Actions / APIs",
    icon: Zap,
    description: "Server Actions execute secure mutation routines on request. Server Components read queries directly, compiling layout frames on demand with React 19.",
    tech: "Server Actions, RSC, Route Handlers",
    x: "52%",
    y: "50%",
  },
  {
    id: "services",
    name: "Service & Validation Layer",
    icon: Layers,
    description: "Validates inputs shape using type-safe Zod schema rules. Houses domain-logic modules, throws custom boundary errors, and triggers password hashing.",
    tech: "Service layer, Zod validation",
    x: "72%",
    y: "30%",
  },
  {
    id: "prisma",
    name: "Prisma ORM Layer",
    icon: Server,
    description: "Type-safe database abstraction client. Manages query generation and local connection pooling parameters to prevent exhaustion in serverless nodes.",
    tech: "Prisma Client, Connection Pooling",
    x: "72%",
    y: "70%",
  },
  {
    id: "db",
    name: "Neon / PostgreSQL",
    icon: Database,
    description: "Cloud-native, serverless PostgreSQL primary database. Enforces structural entity relations, saves message queues, and stores blog markdown logs.",
    tech: "Serverless Postgres, Neon Database",
    x: "90%",
    y: "50%",
  },
]

export default function ArchitectureShowcase() {
  const { t } = useTranslation()
  const [activeNode, setActiveNode] = useState<typeof architectureNodes[0] | null>(null)

  return (
    <section id="architecture" className="w-full py-20 border-b border-card-border/40 relative overflow-hidden">
      {/* Background radial highlight */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[160px] pointer-events-none -z-10" />

      <div className="max-w-6xl mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-4">
          <div className="flex flex-col gap-2">
            <span className="font-mono text-xs text-primary font-semibold tracking-widest uppercase">{t('portfolio.architecture.subtitle')}</span>
            <h2 className="font-display font-bold text-3xl md:text-5xl text-white">{t('portfolio.architecture.title')}</h2>
          </div>
          <p className="text-muted text-sm md:text-base max-w-sm">
            {t('portfolio.architecture.desc')}
          </p>
        </div>

        {/* Diagram Canvas Container */}
        <div className="w-full glass rounded-3xl p-6 md:p-12 min-h-[400px] flex flex-col lg:flex-row gap-8 items-center justify-between shadow-2xl relative">
          {/* Interactive SVG Nodes Layout */}
          <div className="w-full lg:w-2/3 h-[250px] sm:h-[350px] relative border border-card-border/50 rounded-2xl bg-[#030611]/80 p-4">
            
            {/* SVG Connecting Paths */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="grad-line" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#6366f1" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#10b981" stopOpacity="0.4" />
                </linearGradient>
              </defs>
              {/* Path 1: CDN -> Routing */}
              <line x1="15%" y1="50%" x2="30%" y2="50%" stroke="url(#grad-line)" strokeWidth="2" strokeDasharray="5,5" />
              {/* Path 2: Routing -> App */}
              <line x1="35%" y1="50%" x2="52%" y2="50%" stroke="url(#grad-line)" strokeWidth="2" />
              {/* Path 3: App -> Services (split) */}
              <path d="M 57% 50% Q 64.5% 50% 64.5% 30% T 72% 30%" fill="none" stroke="url(#grad-line)" strokeWidth="2" />
              {/* Path 4: App -> Prisma (split) */}
              <path d="M 57% 50% Q 64.5% 50% 64.5% 70% T 72% 70%" fill="none" stroke="url(#grad-line)" strokeWidth="2" />
              {/* Path 5: Services -> DB */}
              <path d="M 77% 30% Q 83.5% 30% 83.5% 50% T 90% 50%" fill="none" stroke="url(#grad-line)" strokeWidth="2" />
              {/* Path 6: Prisma -> DB */}
              <path d="M 77% 70% Q 83.5% 70% 83.5% 50% T 90% 50%" fill="none" stroke="url(#grad-line)" strokeWidth="2" />
            </svg>

            {/* Nodes */}
            {architectureNodes.map((node) => {
              const Icon = node.icon
              const isSelected = activeNode?.id === node.id

              return (
                <button
                  key={node.id}
                  onClick={() => setActiveNode(node)}
                  className="absolute cursor-pointer flex flex-col items-center group -translate-x-1/2 -translate-y-1/2 transition-transform duration-300 hover:scale-110"
                  style={{ left: node.x, top: node.y }}
                >
                  <div
                    className={`w-10 h-10 sm:w-14 sm:h-14 rounded-xl border flex items-center justify-center transition-all duration-300 shadow-lg ${
                      isSelected
                        ? "bg-primary border-primary text-white scale-110 shadow-primary/20"
                        : "bg-[#0b0f19] border-card-border text-muted group-hover:text-white group-hover:border-primary/50"
                    }`}
                  >
                    <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
                  </div>
                  <span className="hidden sm:block text-[10px] sm:text-xs font-mono font-semibold text-gray-400 mt-2 text-center group-hover:text-white max-w-[80px]">
                    {node.name.split(" ")[0]}
                  </span>
                </button>
              )
            })}
          </div>

          {/* Details Sidebar panel */}
          <div className="w-full lg:w-1/3 flex flex-col justify-center min-h-[180px]">
            <AnimatePresence mode="wait">
              {activeNode ? (
                <motion.div
                  key={activeNode.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                  className="flex flex-col gap-3 p-5 rounded-2xl bg-primary/5 border border-primary/20"
                >
                  <span className="font-mono text-xs font-bold text-accent uppercase tracking-wide">
                    {activeNode.tech}
                  </span>
                  <h3 className="font-display font-bold text-xl text-white">
                    {activeNode.name}
                  </h3>
                  <p className="text-muted text-sm leading-relaxed">
                    {activeNode.description}
                  </p>
                </motion.div>
              ) : (
                <motion.div
                  key="empty-state"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center justify-center text-center p-6 border border-dashed border-card-border/60 rounded-2xl h-full"
                >
                  <p className="text-muted text-sm">
                    {t('portfolio.architecture.empty')}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  )
}
