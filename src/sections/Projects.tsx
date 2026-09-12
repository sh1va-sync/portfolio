import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { LineReveal } from '../components/LineReveal'
import { useScrollReveal } from '../hooks/useScrollReveal'
import { useMotionContext } from '../context/MotionContext'

const EASE = [0.16, 1, 0.3, 1] as const

const PROJECTS = [
  {
    id:      'lumina',
    title:   'Lumina',
    caption: 'Real-time data visualization platform built for engineering scale.',
    year:    '2025',
    role:    'Lead engineer',
  },
  {
    id:      'prose',
    title:   'Prose',
    caption: 'Distraction-free writing tool with AI-assisted suggestion layer.',
    year:    '2024',
    role:    'Solo project',
  },
  {
    id:      'orbit',
    title:   'Orbit',
    caption: 'Collaborative task system with constraint-aware smart scheduling.',
    year:    '2024',
    role:    'Full-stack engineer',
  },
] as const

function ProjectRow({ project, reduced }: { project: typeof PROJECTS[number], reduced: boolean }) {
  const [hovered, setHovered] = useState(false)

  return (
    <motion.article
      id={`project-${project.id}`}
      data-cursor="hover"
      initial={reduced ? {} : { opacity: 0, y: 20 }}
      whileInView={reduced ? {} : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.5 }}
      transition={{ duration: 0.6, ease: EASE }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        padding: '48px 0',
        borderBottom: '1px solid rgba(8,8,24,0.08)',
        cursor: 'none',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
        <h3
          style={{
            fontFamily: 'var(--font-display)',
            fontVariationSettings: '"opsz" 72',
            fontWeight: 500,
            fontSize: 'clamp(40px, 6vw, 80px)',
            letterSpacing: '-0.03em',
            margin: 0,
            color: 'var(--text-primary)',
            transition: 'color 0.3s ease',
            ...(hovered && { color: 'var(--accent)' }),
          }}
        >
          {project.title}
        </h3>
        
        <span
          style={{
            fontFamily: 'var(--font-ui)',
            fontSize: 'clamp(14px, 1.5vw, 16px)',
            fontWeight: 500,
            color: 'var(--text-muted)',
            transition: 'opacity 0.3s ease',
            opacity: hovered ? 1 : 0.4,
          }}
        >
          {project.year}
        </span>
      </div>

      <AnimatePresence>
        {hovered && !reduced && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: EASE }}
            style={{ overflow: 'hidden' }}
          >
            <div style={{ paddingTop: '24px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <p
                style={{
                  fontFamily: 'var(--font-ui)',
                  fontSize: 'clamp(16px, 2vw, 20px)',
                  color: 'var(--text-primary)',
                  maxWidth: '60ch',
                }}
              >
                {project.caption}
              </p>
              <span
                style={{
                  fontFamily: 'var(--font-ui)',
                  fontSize: '14px',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em',
                  color: 'var(--accent)',
                }}
              >
                {project.role}
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Fallback for reduced motion (always show details) */}
      {reduced && (
        <div style={{ paddingTop: '24px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <p style={{ fontFamily: 'var(--font-ui)', fontSize: '20px', color: 'var(--text-primary)' }}>
            {project.caption}
          </p>
          <span style={{ fontFamily: 'var(--font-ui)', fontSize: '14px', fontWeight: 600, color: 'var(--accent)' }}>
            {project.role}
          </span>
        </div>
      )}
    </motion.article>
  )
}

export function Projects() {
  const { ref } = useScrollReveal()
  const { prefersReducedMotion } = useMotionContext()

  return (
    <section id="projects" className="section-padding">
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div ref={ref as React.RefObject<HTMLDivElement>} style={{ marginBottom: '80px' }}>
          {prefersReducedMotion ? (
            <h2 style={{ fontSize: 'clamp(34px, 5vw, 56px)', fontFamily: 'var(--font-display)', fontWeight: 500 }}>Selected work</h2>
          ) : (
            <LineReveal>
              <h2 style={{ fontSize: 'clamp(34px, 5vw, 56px)', fontFamily: 'var(--font-display)', fontWeight: 500 }}>
                Selected work
              </h2>
            </LineReveal>
          )}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', borderTop: '1px solid rgba(8,8,24,0.08)' }}>
          {PROJECTS.map((project) => (
            <ProjectRow key={project.id} project={project} reduced={prefersReducedMotion} />
          ))}
        </div>
      </div>
    </section>
  )
}
