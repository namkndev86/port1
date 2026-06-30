"use client"

import { motion } from "framer-motion"
import { formatDate } from "@/lib/utils"
import { Experience } from "@prisma/client"
import { Calendar, MapPin, Briefcase } from "lucide-react"

import { useTranslation } from "@/components/common/locale-provider"

interface ExperienceTimelineProps {
  experiences: Experience[]
}

export default function ExperienceTimeline({ experiences }: ExperienceTimelineProps) {
  const { t } = useTranslation()

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.15,
      },
    },
  }

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring" as const,
        stiffness: 80,
        damping: 15,
      },
    },
  }

  return (
    <section id="experience" className="w-full py-20 border-b border-card-border/40 relative">
      {/* Background visual element */}
      <div className="absolute left-10 top-1/2 w-64 h-64 bg-primary/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-4">
          <div className="flex flex-col gap-2">
            <span className="font-mono text-xs text-primary font-semibold tracking-widest uppercase">{t('portfolio.experience.subtitle')}</span>
            <h2 className="font-display font-bold text-3xl md:text-5xl text-white">{t('portfolio.experience.title')}</h2>
          </div>
          <p className="text-muted text-sm md:text-base max-w-sm">
            {t('portfolio.experience.desc')}
          </p>
        </div>

        {/* Timeline Track */}
        <div className="relative border-l border-card-border pl-6 md:pl-10 ml-2 md:ml-6 flex flex-col gap-12">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.15 }}
            className="flex flex-col gap-12"
          >
            {experiences.map((exp) => (
              <motion.div
                key={exp.id}
                variants={cardVariants}
                className="relative group"
              >
                {/* Timeline Dot Indicator */}
                <div className="absolute -left-[31px] md:-left-[47px] top-1.5 w-4 h-4 rounded-full bg-background border-2 border-primary group-hover:bg-primary group-hover:scale-125 transition-all duration-300 z-10 flex items-center justify-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>

                {/* Content Box */}
                <div className="glass rounded-2xl p-6 md:p-8 hover:border-primary/20 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                    <div className="flex flex-col gap-1">
                      <h3 className="font-display font-bold text-lg md:text-xl text-white group-hover:text-primary transition-colors">
                        {exp.role}
                      </h3>
                      <span className="text-sm font-semibold text-accent flex items-center gap-1.5">
                        <Briefcase className="w-3.5 h-3.5" />
                        {exp.company}
                      </span>
                    </div>

                    <div className="flex flex-col sm:items-end gap-1.5 text-xs md:text-sm text-muted">
                      <span className="flex items-center gap-1.5 font-mono">
                        <Calendar className="w-3.5 h-3.5" />
                        {formatDate(exp.startDate)} &mdash; {exp.current ? t('portfolio.experience.current') : exp.endDate ? formatDate(exp.endDate) : ""}
                      </span>
                      {exp.location && (
                        <span className="flex items-center gap-1.5 font-mono">
                          <MapPin className="w-3.5 h-3.5" />
                          {exp.location}
                        </span>
                      )}
                    </div>
                  </div>

                  <p className="text-muted text-sm md:text-base leading-relaxed whitespace-pre-line border-t border-card-border/40 pt-4">
                    {exp.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
