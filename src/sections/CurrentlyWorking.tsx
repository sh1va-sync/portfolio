import { useState } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { BrainCircuit, Bot, Box, Code2, Database, FileText, Layers3, MessageCircle, Sparkles, type LucideIcon } from 'lucide-react'
import { useMotionContext } from '../context/MotionContext'

type LearningGroup = {
  title: string
  note: string
  topics: string[]
  Icon: LucideIcon
}

const GROUPS: LearningGroup[] = [
  {
    title: 'AI & LLMs',
    note: 'Models · RAG · Agents',
    topics: ['Prompting', 'Context windows', 'Tokenization', 'Embeddings', 'Claude', 'OpenAI'],
    Icon: BrainCircuit,
  },
  {
    title: 'Development',
    note: 'Languages · Frameworks',
    topics: ['Python', 'TypeScript', 'LangChain', 'LangGraph', 'FastAPI', 'SDKs'],
    Icon: Code2,
  },
  {
    title: 'AI Agents',
    note: 'Autonomy · Tool use',
    topics: ['CrewAI', 'Agentic AI', 'Voice agents', 'Tool calling', 'Multi-agent systems'],
    Icon: Bot,
  },
  {
    title: 'Data & Memory',
    note: 'Store · Retrieve · Reason',
    topics: ['RAG', 'Vector databases', 'Knowledge graphs', 'Embeddings'],
    Icon: Database,
  },
  {
    title: 'Tools & Platforms',
    note: 'Build · Deploy · Scale',
    topics: ['OpenAI', 'Claude', 'Docker', 'Vercel', 'Supabase', 'AWS'],
    Icon: Layers3,
  },
  {
    title: 'Emerging interests',
    note: 'Exploring what’s next',
    topics: ['Multimodal AI', 'Human-AI interaction', 'New model releases'],
    Icon: Sparkles,
  },
]

const GROUP_DETAILS = [
  'Exploring how language models understand, generate, and connect ideas.',
  'Learning the tools and frameworks that turn models into products.',
  'Designing agents that can reason, collaborate, and use tools.',
  'Giving intelligent systems memory through retrieval and structured data.',
  'Working with the platforms that make AI products dependable and shippable.',
  'Following the emerging ideas shaping the next generation of interfaces.',
]

const TOPIC_ICONS: LucideIcon[] = [MessageCircle, FileText, Box, Database, Sparkles, BrainCircuit]

export function CurrentlyWorking() {
  const { prefersReducedMotion, isTouchDevice } = useMotionContext()
  const [activeIndex, setActiveIndex] = useState(0)
  const [selectedTopic, setSelectedTopic] = useState(GROUPS[0].topics[0])
  const activeGroup = GROUPS[activeIndex]
  const ActiveIcon = activeGroup.Icon
  const pointerX = useMotionValue(0)
  const pointerY = useMotionValue(0)
  const rotateX = useSpring(useTransform(pointerY, [-1, 1], [2, -2]), { stiffness: 180, damping: 24 })
  const rotateY = useSpring(useTransform(pointerX, [-1, 1], [-2, 2]), { stiffness: 180, damping: 24 })

  const selectGroup = (index: number) => {
    setActiveIndex(index)
    setSelectedTopic(GROUPS[index].topics[0])
  }

  const handlePanelPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (prefersReducedMotion || isTouchDevice || event.pointerType !== 'mouse') return
    const bounds = event.currentTarget.getBoundingClientRect()
    const x = (event.clientX - bounds.left) / bounds.width
    const y = (event.clientY - bounds.top) / bounds.height
    pointerX.set(x * 2 - 1)
    pointerY.set(y * 2 - 1)
    event.currentTarget.style.setProperty('--focus-pointer-x', `${x * 100}%`)
    event.currentTarget.style.setProperty('--focus-pointer-y', `${y * 100}%`)
  }

  const resetPanelPointer = (event: React.PointerEvent<HTMLDivElement>) => {
    pointerX.set(0)
    pointerY.set(0)
    event.currentTarget.style.setProperty('--focus-pointer-x', '50%')
    event.currentTarget.style.setProperty('--focus-pointer-y', '35%')
  }

  return (
    <section className="currently-working section-padding" aria-labelledby="currently-working-title">
      <div className="currently-working-inner">
        <header className="currently-working-heading">
          <div className="currently-working-label"><span className="ai-live-dot" /> Currently learning</div>
          <div className="currently-working-heading-copy">
            <h2 id="currently-working-title">Exploring AI, one idea at a time.</h2>
            <p>I’m learning the tools and techniques behind useful AI products.</p>
          </div>
        </header>

        <div className="learning-explorer">
          <nav className="learning-explorer-nav" aria-label="Learning areas">
            <span className="learning-explorer-eyebrow">AREAS OF INTEREST</span>
            <div className="learning-focus-list">
              {GROUPS.map(({ title, note, Icon }, index) => (
                <button
                  key={title}
                  id={`learning-tab-${index}`}
                  type="button"
                  aria-pressed={activeIndex === index}
                  className={`learning-focus-option${activeIndex === index ? ' is-active' : ''}`}
                  onClick={() => selectGroup(index)}
                >
                  {activeIndex === index && (
                    <motion.span
                      className="learning-focus-highlight"
                      layoutId="learning-focus-highlight"
                      transition={prefersReducedMotion ? { duration: 0 } : { type: 'spring', stiffness: 360, damping: 32 }}
                      aria-hidden="true"
                    />
                  )}
                  <span className="learning-focus-icon"><Icon size={17} strokeWidth={1.8} /></span>
                  <span className="learning-focus-copy">
                    <strong>{title}</strong>
                    <small>{note}</small>
                  </span>
                  <span className="learning-focus-arrow" aria-hidden="true">↗</span>
                </button>
              ))}
            </div>
          </nav>

          <motion.div
            key={activeIndex}
            className="learning-focus-panel"
            role="region"
            aria-live="polite"
            aria-labelledby={`learning-tab-${activeIndex}`}
            initial={prefersReducedMotion ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            onPointerMove={handlePanelPointerMove}
            onPointerLeave={resetPanelPointer}
            style={{
              rotateX: prefersReducedMotion || isTouchDevice ? 0 : rotateX,
              rotateY: prefersReducedMotion || isTouchDevice ? 0 : rotateY,
              transformPerspective: 1100,
            }}
          >
            <div className="learning-focus-panel-top">
              <span>EXPLORING {String(activeIndex + 1).padStart(2, '0')} / {String(GROUPS.length).padStart(2, '0')}</span>
              <button
                className="learning-next-button"
                type="button"
                onClick={() => selectGroup((activeIndex + 1) % GROUPS.length)}
                aria-label={`Explore ${GROUPS[(activeIndex + 1) % GROUPS.length].title} next`}
              >
                Next focus <span aria-hidden="true">↗</span>
              </button>
            </div>
            <div className="learning-focus-summary">
              <motion.span
                className={`learning-focus-panel-icon learning-focus-panel-icon-${activeIndex % 2 === 0 ? 'blue' : 'violet'}`}
                key={activeIndex}
                initial={prefersReducedMotion ? false : { scale: 0.85, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={prefersReducedMotion ? { duration: 0 } : { type: 'spring', stiffness: 240, damping: 20 }}
                aria-hidden="true"
              >
                <ActiveIcon size={21} strokeWidth={1.7} />
              </motion.span>
              <div>
                <h3>{activeGroup.title}</h3>
                <p className="learning-focus-note">{activeGroup.note}</p>
                <p className="learning-focus-description">{GROUP_DETAILS[activeIndex]}</p>
              </div>
            </div>
            <div className="learning-focus-divider" />
            <div className="learning-tech-inset">
              <div className="learning-topic-heading">
                <span className="learning-explorer-eyebrow"><strong>TECH</strong> I’M LEARNING</span>
                <span className="learning-topic-selection" role="status">{selectedTopic}</span>
              </div>
              <ul className="learning-topic-list">
                {activeGroup.topics.map((topic, index) => {
                  const TopicIcon = TOPIC_ICONS[index % TOPIC_ICONS.length]
                  const isSelected = selectedTopic === topic
                  return (
                    <motion.li
                      key={topic}
                      initial={prefersReducedMotion ? false : { opacity: 0, y: 7 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.25, delay: prefersReducedMotion ? 0 : index * 0.045 }}
                    >
                      <button
                        type="button"
                        aria-pressed={isSelected}
                        className={isSelected ? 'is-selected' : ''}
                        onClick={() => setSelectedTopic(topic)}
                      >
                        {isSelected && (
                          <motion.span
                            className="learning-topic-highlight"
                            layoutId="learning-topic-highlight"
                            transition={prefersReducedMotion ? { duration: 0 } : { type: 'spring', stiffness: 320, damping: 28 }}
                            aria-hidden="true"
                          />
                        )}
                        <TopicIcon size={18} strokeWidth={1.8} aria-hidden="true" />
                        <span>{topic}</span>
                      </button>
                    </motion.li>
                  )
                })}
              </ul>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
