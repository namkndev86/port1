"use client"

import { motion, useInView } from "framer-motion"
import { useRef, useEffect, useState } from "react"
import * as LucideIcons from "lucide-react"
import { Skill } from "@prisma/client"

interface SkillsSectionProps {
  skills: Skill[]
}

// Sub-component for individual skill item with count-up animation
function SkillItem({ skill }: { skill: Skill }) {
  const [count, setCount] = useState(0)
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.1 })

  useEffect(() => {
    if (isInView) {
      let start = 0
      const end = skill.proficiency
      const duration = 1.5 // seconds
      const stepTime = Math.abs(Math.floor((duration * 1000) / end))
      
      const timer = setInterval(() => {
        start += 1
        setCount(start)
        if (start >= end) {
          clearInterval(timer)
        }
      }, stepTime)

      return () => clearInterval(timer)
    }
  }, [isInView, skill.proficiency])

  // Resolve Lucide icon
  const Icon = (LucideIcons as any)[skill.icon || "Code"] || LucideIcons.Code

  return (
    <div ref={ref} className="flex flex-col gap-2 p-5 rounded-2xl glass hover:border-primary/20 transition-all duration-300">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
            <Icon className="w-4 h-4" />
          </div>
          <span className="font-semibold text-white text-sm md:text-base">{skill.name}</span>
        </div>
        <span className="font-mono text-xs md:text-sm font-bold text-accent">{count}%</span>
      </div>

      {/* Progress Bar Track */}
      <div className="w-full h-2 bg-[#050811] rounded-full overflow-hidden border border-card-border/40">
        <motion.div
          initial={{ width: 0 }}
          animate={isInView ? { width: `${skill.proficiency}%` } : {}}
          transition={{ type: "spring", stiffness: 40, damping: 15, delay: 0.1 }}
          className="h-full bg-gradient-to-r from-primary to-accent rounded-full"
        />
      </div>
    </div>
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
