"use client"

import { motion, useInView } from "framer-motion"
import { useRef } from "react"
import * as LucideIcons from "lucide-react"
import { Skill } from "@prisma/client"

interface SkillsSectionProps {
  skills: Skill[]
}

// Sub-component for individual skill item with entry animation and hover effects
function SkillItem({ skill }: { skill: Skill }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.1 })

  // Resolve Lucide icon
  const Icon = (LucideIcons as any)[skill.icon || "Code"] || LucideIcons.Code

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 15 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="flex items-center gap-3.5 p-4 rounded-xl glass glass-hover group"
    >
      <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center text-primary group-hover:text-accent transition-colors duration-300">
        <Icon className="w-4 h-4 transition-transform duration-300 group-hover:scale-110" />
      </div>
      <span className="font-semibold text-white text-sm md:text-base transition-colors duration-300">
        {skill.name}
      </span>
    </motion.div>
  )
}

export default function SkillsSection({ skills }: SkillsSectionProps) {
  // Group skills by category
  const categories = Array.from(new Set(skills.map((s) => s.category)))

  return (
    <section id="skills" className="w-full py-20 border-b border-card-border/40 relative">
      {/* Visual background glow */}
      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-72 h-72 bg-accent/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div className="flex flex-col gap-2">
            <span className="font-mono text-xs text-primary font-semibold tracking-widest uppercase">Competencies</span>
            <h2 className="font-display font-bold text-3xl md:text-5xl text-white">Technical Arsenal</h2>
          </div>
          <p className="text-muted text-sm md:text-base max-w-sm">
            Proven proficiencies across engineering, design systems, architectural layouts, and scalable cloud-native operations.
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((category) => (
            <div key={category} className="flex flex-col gap-5">
              <h3 className="font-display font-semibold text-lg text-white border-b border-card-border pb-2 capitalize tracking-wide flex items-center justify-between">
                <span>{category}</span>
                <span className="w-1.5 h-1.5 rounded-full bg-primary" />
              </h3>

              <div className="flex flex-col gap-4">
                {skills
                  .filter((s) => s.category === category)
                  .map((skill) => (
                    <SkillItem key={skill.id} skill={skill} />
                  ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
