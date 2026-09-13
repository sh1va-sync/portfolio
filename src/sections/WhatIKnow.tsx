import { useState } from 'react'
import { motion } from 'framer-motion'
import { LineReveal } from '../components/LineReveal'
import { useMotionContext } from '../context/MotionContext'
import {
  SiReact, SiTypescript, SiTailwindcss, SiFramer, SiNextdotjs,
  SiNodedotjs, SiPython, SiPostgresql, SiRedis, SiGit, SiDocker, SiVite,
} from 'react-icons/si'
import { FaAws, FaBrain, FaDatabase, FaLayerGroup } from 'react-icons/fa'

type Technology = {
  name: string
  note: string
  Icon: typeof SiReact
  color: string
}

const CATEGORIES = [
  {
    id: 'interface',
    label: 'Interfaces',
    eyebrow: '01 / Interfaces',
    description: 'Expressive, responsive frontends that feel as good as they function.',
    Icon: FaLayerGroup,
    technologies: [
      { name: 'React', note: 'UI systems', Icon: SiReact, color: '#61DAFB' },
      { name: 'TypeScript', note: 'Typed interfaces', Icon: SiTypescript, color: '#3178C6' },
      { name: 'Next.js', note: 'Product surfaces', Icon: SiNextdotjs, color: '#111827' },
      { name: 'Tailwind', note: 'Visual language', Icon: SiTailwindcss, color: '#06B6D4' },
      { name: 'Framer Motion', note: 'Motion design', Icon: SiFramer, color: '#0055FF' },
      { name: 'Vite', note: 'Fast feedback', Icon: SiVite, color: '#646CFF' },
    ],
  },
  {
    id: 'systems',
    label: 'Systems',
    eyebrow: '02 / Systems',
    description: 'Reliable foundations for data, APIs, and the work behind the screen.',
    Icon: FaDatabase,
    technologies: [
      { name: 'Node.js', note: 'API layers', Icon: SiNodedotjs, color: '#339933' },
      { name: 'Python', note: 'Automation + AI', Icon: SiPython, color: '#3776AB' },
      { name: 'PostgreSQL', note: 'Structured data', Icon: SiPostgresql, color: '#4169E1' },
      { name: 'Redis', note: 'Fast state', Icon: SiRedis, color: '#DC382D' },
      { name: 'Docker', note: 'Portable builds', Icon: SiDocker, color: '#2496ED' },
      { name: 'AWS', note: 'Cloud shipping', Icon: FaAws, color: '#FF9900' },
    ],
  },
  {
    id: 'intelligence',
    label: 'Intelligence',
    eyebrow: '03 / Intelligence',
    description: 'Tools I use to turn capable models into useful, human-centred products.',
    Icon: FaBrain,
    technologies: [
      { name: 'Python', note: 'Model workflows', Icon: SiPython, color: '#3776AB' },
      { name: 'Node.js', note: 'Agent services', Icon: SiNodedotjs, color: '#339933' },
      { name: 'PostgreSQL', note: 'Knowledge stores', Icon: SiPostgresql, color: '#4169E1' },
      { name: 'Redis', note: 'Conversation state', Icon: SiRedis, color: '#DC382D' },
      { name: 'Git', note: 'Versioned thinking', Icon: SiGit, color: '#F05032' },
      { name: 'Docker', note: 'Repeatable agents', Icon: SiDocker, color: '#2496ED' },
    ],
  },
] satisfies Array<{
  id: string
  label: string
  eyebrow: string
  description: string
  Icon: typeof FaBrain
  technologies: Technology[]
}>

function TechnologyCard({ technology, index, reduced }: { technology: Technology, index: number, reduced: boolean }) {
  const Icon = technology.Icon

  return (
    <motion.article
      className="technology-card"
      initial={reduced ? false : { opacity: 0, y: 18 }}
      whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ delay: index * 0.06, duration: 0.45 }}
      whileHover={reduced ? undefined : { y: -8, rotate: index % 2 ? 1 : -1 }}
      style={{ '--technology-color': technology.color } as React.CSSProperties}
    >
      <div className="technology-card-icon"><Icon /></div>
      <div className="technology-card-copy">
        <strong>{technology.name}</strong>
        <span>{technology.note}</span>
      </div>
      <span className="technology-card-arrow" aria-hidden="true">↗</span>
    </motion.article>
  )
}

export function WhatIKnow() {
  const { prefersReducedMotion } = useMotionContext()
  const [activeId, setActiveId] = useState(CATEGORIES[0].id)
  const activeCategory = CATEGORIES.find((category) => category.id === activeId) ?? CATEGORIES[0]
  const CategoryIcon = activeCategory.Icon

  return (
    <section id="technologies" className="section-padding technologies-section">
      <div className="technologies-container">
        <div className="technologies-intro">
          <div>
            <span className="section-kicker">02 / The toolkit</span>
            {prefersReducedMotion ? (
              <h2>Technologies I work with.</h2>
            ) : (
              <LineReveal><h2>Technologies I work with.</h2></LineReveal>
            )}
          </div>
          <p>
            A growing toolkit for building thoughtful interfaces, dependable systems,
            and the intelligence that connects them.
          </p>
        </div>

        <div className="technology-tabs" role="tablist" aria-label="Technology categories">
          {CATEGORIES.map((category) => {
            const Icon = category.Icon
            const isActive = category.id === activeId
            return (
              <button
                key={category.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                className={isActive ? 'technology-tab is-active' : 'technology-tab'}
                onClick={() => setActiveId(category.id)}
              >
                <Icon aria-hidden="true" />
                <span>{category.label}</span>
                <small>0{CATEGORIES.indexOf(category) + 1}</small>
              </button>
            )
          })}
        </div>

        <motion.div
          className="technology-panel"
          key={activeCategory.id}
          initial={prefersReducedMotion ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
        >
          <div className="technology-panel-heading">
            <div className="technology-panel-icon"><CategoryIcon /></div>
            <div>
              <span>{activeCategory.eyebrow}</span>
              <h3>{activeCategory.label}</h3>
            </div>
            <p>{activeCategory.description}</p>
          </div>
          <div className="technology-grid">
            {activeCategory.technologies.map((technology, index) => (
              <TechnologyCard
                key={`${activeCategory.id}-${technology.name}`}
                technology={technology}
                index={index}
                reduced={prefersReducedMotion}
              />
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
