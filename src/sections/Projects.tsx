import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { createPortal } from 'react-dom'
import { useNavigate } from 'react-router-dom'
import { LineReveal } from '../components/LineReveal'
import { useScrollReveal } from '../hooks/useScrollReveal'
import { useMotionContext } from '../context/MotionContext'

const EASE = [0.16, 1, 0.3, 1] as const

export const PROJECTS = [
  {
    id: 'lumina',
    title: 'Lumina',
    caption: 'Real-time data visualization platform built for engineering scale.',
    year: '2025',
    role: 'Lead engineer',
    image: '/projects/lumina.png',
    stack: 'React / TypeScript / Data systems',
    story: 'A real-time operations dashboard that turns noisy infrastructure signals into a calm, legible picture of system health.',
  },
  {
    id: 'prose',
    title: 'Prose',
    caption: 'Distraction-free writing tool with AI-assisted suggestion layer.',
    year: '2024',
    role: 'Solo project',
    image: '/projects/prose.png',
    stack: 'React / AI writing tools / Product design',
    story: 'A focused writing environment designed around the quiet space between a first thought and a finished sentence.',
  },
  {
    id: 'orbit',
    title: 'Orbit',
    caption: 'Collaborative task system with constraint-aware smart scheduling.',
    year: '2024',
    role: 'Full-stack engineer',
    image: '/projects/orbit.png',
    stack: 'Next.js / Node.js / PostgreSQL',
    story: 'A collaborative planning system that makes team constraints visible and helps work move without constant coordination overhead.',
  },
] as const

function ProjectRow({ project, reduced }: { project: typeof PROJECTS[number], reduced: boolean }) {
  const [hovered, setHovered] = useState(false)
  const [pointer, setPointer] = useState({ x: 0, y: 0 })
  const navigate = useNavigate()

  const openProject = () => navigate(`/work/${project.id}`)

  return (
    <motion.article
      id={`project-${project.id}`}
      className="project-row"
      data-cursor="hover"
      role="link"
      tabIndex={0}
      initial={reduced ? {} : { opacity: 0, y: 20 }}
      whileInView={reduced ? {} : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.5 }}
      transition={{ duration: 0.6, ease: EASE }}
      onClick={openProject}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault()
          openProject()
        }
      }}
      onMouseMove={(event) => setPointer({ x: event.clientX, y: event.clientY })}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="project-row-main">
        <span className="project-index">{String(PROJECTS.indexOf(project) + 1).padStart(2, '0')}</span>
        <h3>{project.title}</h3>
        <span className="project-year">{project.year}</span>
      </div>
      <div className="project-row-meta">
        <span>{project.caption}</span>
        <span>{project.role}</span>
      </div>

      {createPortal(
        <AnimatePresence>
          {hovered && (
            <motion.div
              className="project-cursor-preview"
              initial={{ opacity: 0, scale: 0.8, rotate: -4 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              exit={{ opacity: 0, scale: 0.8, rotate: 4 }}
              transition={{ duration: 0.25, ease: EASE }}
              style={{
                left: Math.max(16, Math.min(pointer.x + 20, window.innerWidth - 316)),
                top: Math.max(16, Math.min(pointer.y - 110, window.innerHeight - 236)),
              }}
            >
              <img src={project.image} alt="" />
              <span>View project ↗</span>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body,
      )}
    </motion.article>
  )
}

export function Projects() {
  const { ref } = useScrollReveal()
  const { prefersReducedMotion } = useMotionContext()

  return (
    <section id="projects" className="section-padding projects-section">
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div ref={ref as React.RefObject<HTMLDivElement>} style={{ marginBottom: '80px' }}>
          {prefersReducedMotion ? (
            <h2 className="projects-heading">Selected work</h2>
          ) : (
            <LineReveal><h2 className="projects-heading">Selected work</h2></LineReveal>
          )}
          <p className="projects-instruction">Hover to preview / Click to explore</p>
        </div>
        <div className="projects-list">
          {PROJECTS.map((project) => <ProjectRow key={project.id} project={project} reduced={prefersReducedMotion} />)}
        </div>
      </div>
    </section>
  )
}

export function ProjectDetail({ projectId }: { projectId: string }) {
  const project = PROJECTS.find((item) => item.id === projectId) ?? PROJECTS[0]
  const navigate = useNavigate()

  return (
    <section className="project-detail section-padding">
      <button className="project-detail-back" type="button" onClick={() => navigate('/work')}>
        <span aria-hidden="true">←</span> Back to work
      </button>
      <div className="project-detail-hero">
        <p>Selected work / {project.year}</p>
        <h1>{project.title}</h1>
        <span>{project.role}</span>
      </div>
      <div className="project-detail-image"><img src={project.image} alt={`${project.title} project preview`} /></div>
      <div className="project-detail-copy">
        <div><span>About the project</span><h2>{project.caption}</h2></div>
        <div><p>{project.story}</p><p className="project-detail-stack">{project.stack}</p></div>
      </div>
    </section>
  )
}
