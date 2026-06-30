"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowRight, BookOpen, Sparkles } from "lucide-react"

export default function HomePage() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring" as const,
        stiffness: 100,
        damping: 15,
      },
    },
  }

  return (
    <div className="relative min-h-[calc(100vh-6rem)] w-full flex items-center justify-center overflow-hidden px-6">
      {/* Background Cinematic Lighting Blobs */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/20 rounded-full blur-[120px] animate-pulse-slow -z-10" />
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-[450px] h-[450px] bg-accent/10 rounded-full blur-[150px] animate-pulse-slow -z-10" />

      {/* Floating Network grid visual (CSS only) */}
      <div 
        className="absolute inset-0 opacity-[0.03] -z-10" 
        style={{
          backgroundImage: `radial-gradient(circle, #fff 1px, transparent 1px)`,
          backgroundSize: "24px 24px"
        }}
      />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-4xl w-full text-center flex flex-col items-center gap-6"
      >
        {/* Intro Badge */}
        <motion.div
          variants={itemVariants}
          className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full glass border border-primary/20 text-xs font-mono text-primary font-semibold tracking-wide uppercase shadow-lg shadow-primary/5"
        >
          <Sparkles className="w-3.5 h-3.5" />
          Systems Architect & Designer
        </motion.div>

        {/* Developer Name */}
        <motion.h1
          variants={itemVariants}
          className="font-display font-black text-5xl md:text-8xl tracking-tight leading-none text-gradient flex flex-col md:flex-row gap-0 md:gap-4 justify-center"
        >
          <span>Alex</span> <span className="text-primary">Rivera</span>
        </motion.h1>

        {/* Professional Title */}
        <motion.h2
          variants={itemVariants}
          className="font-display font-semibold text-xl md:text-3xl text-white max-w-2xl tracking-wide leading-snug"
        >
          Senior Fullstack Architect & AI Engineer
        </motion.h2>

        {/* Tagline */}
        <motion.p
          variants={itemVariants}
          className="font-sans text-muted max-w-xl text-base md:text-lg leading-relaxed px-4"
        >
          Crafting high-performance distributed systems, containerized cloud services, and cinematic frontend experiences that wow developers.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          variants={itemVariants}
          className="flex flex-col sm:flex-row items-center gap-4 mt-4 w-full justify-center px-6 sm:px-0"
        >
          <Link
            href="/portfolio"
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 bg-primary hover:bg-primary-hover text-white font-semibold rounded-full shadow-lg shadow-primary/25 hover:shadow-primary-hover/30 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 group"
          >
            Explore Portfolio
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link
            href="/blog"
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 glass hover:bg-white/5 text-white font-semibold rounded-full hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 group"
          >
            <BookOpen className="w-4 h-4 text-muted group-hover:text-primary transition-colors" />
            Read Blog
          </Link>
        </motion.div>
      </motion.div>
    </div>
  )
}
