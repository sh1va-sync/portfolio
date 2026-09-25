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
    id: 'smile-dental',
    title: 'Smile Desk',
    caption: 'Smile Desk is an AI powered Dental FrontDesk.',
    year: '2026',
    role: 'Built with claude',
    image: '/projects/smileDesk.png',
    stack: 'React / Python / RAG / Tool Calling',
    story: 'AI Powered Dental Front Desk which assists users to deal with dental related problems, the AI agent talks to user to assess their problem, helps them solve it at home or if the user needs to get a consultation it provides info about local dental clinics and offers to book an appointment.',
    liveUrl: 'https://www.google.com',
    githubUrl: 'https://github.com/sh1va-sync/dental-ai-voice-agent',
  },
  {
    id: 'metaconnect',
    title: 'Meta-Connect',
    caption: 'Realtime 2D Virtual Office space',
    year: '2025',
    role: 'Solo project',
    image: '/projects/metaconnect.png',
    stack: 'React / Node / Express / Realtime Systems / MongoDB',
    story: 'A virtual office space where users can create their own rooms, invite others and collaborate in real-time. Users can move around the space and communicate with each other through voice, video and text chat.',
    liveUrl: '',
    githubUrl: 'https://github.com/sh1va-sync/the_metaApp_project',
  },
  {
    id: 'pneumo-ai',
    title: 'Pneumo.ai',
    caption: 'Pneumonia detection system using Deeplearning',
    year: '2024',
    role: 'Full-stack engineer',
    image: '/projects/orbit.png',
    stack: 'Next.js / Node.js / ',
    story: 'A web application that uses deep learning model to detect pneumonia from chest X-ray images. Users can upload their X-ray images and the system will analyze them and provide a diagnosis.',
    liveUrl: '',
    githubUrl: 'https://github.com/sh1va-sync/pneumo_ai',
  },
  {
    id: 'sync-ai',
    title: 'Sync.ai',
    caption: 'AI powered personal assistant for myself',
    year: '2026',
    role: 'Built with github-copilot',
    image: '/projects/orbit.png',
    stack: 'Python / FastAPI / RAG / RAG / ChromaDB / Gemini',
    story: 'A personal AI assistant that helps me manage my tasks, schedule, and emails. It is powered by Google Gemini and can understand natural language commands and queries. It answer question based on given knowledge only.',
    liveUrl: '',
    githubUrl: 'https://github.com/sh1va-sync/pneumo_ai',
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
        <div className="project-detail-hero-meta">
          <div className="project-detail-live-action" aria-label={`${project.title} live site`}>
            {project.liveUrl ? (
              <a className="project-detail-live-button" href={project.liveUrl} target="_blank" rel="noreferrer" data-cursor="hover" aria-label="Visit live site">
                <span>Live</span><span aria-hidden="true">↗</span>
              </a>
            ) : (
              <span className="project-detail-live-button project-detail-action-disabled" aria-disabled="true">
                <span>Live</span><span aria-hidden="true">↗</span>
              </span>
            )}
          </div>
          <p>Selected work / {project.year}</p>
        </div>
        <h1>{project.title}</h1>
        <span>{project.role}</span>
      </div>
      <div className="project-detail-image"><img src={project.image} alt={`${project.title} project preview`} /></div>
      <div className="project-detail-github-action" aria-label={`${project.title} GitHub repository`}>
        {project.githubUrl ? (
          <a className="project-detail-github-button" href={project.githubUrl} target="_blank" rel="noreferrer" data-cursor="hover">
            View source on GitHub <span aria-hidden="true">↗</span>
          </a>
        ) : (
          <span className="project-detail-github-button project-detail-action-disabled" aria-disabled="true">
            GitHub repository unavailable <span aria-hidden="true">↗</span>
          </span>
        )}
      </div>
      <div className="project-detail-copy">
        <div><span>About the project</span><h2>{project.caption}</h2></div>
        <div><p>{project.story}</p><p className="project-detail-stack">{project.stack}</p></div>
      </div>
    </section>
  )
}
