import { useState } from 'react'
import { motion } from 'framer-motion'
import { BrainCircuit, Bot, Code2, Database, Layers3, Sparkles, type LucideIcon } from 'lucide-react'
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

export function CurrentlyWorking() {
  const { prefersReducedMotion } = useMotionContext()
  const [activeIndex, setActiveIndex] = useState(0)
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null)
  const activeGroup = GROUPS[activeIndex]
  const ActiveIcon = activeGroup.Icon

  const selectGroup = (index: number) => {
    setActiveIndex(index)
    setSelectedTopic(null)
  }

  return (
    <section className="currently-working section-padding" aria-labelledby="currently-working-title">
      <div className="currently-working-inner">
        <header className="currently-working-heading">
          <div className="currently-working-label">
            <span className="ai-live-dot" />
            Currently working on
          </div>
          <div className="currently-working-heading-copy">
            <motion.h2
              id="currently-working-title"
              initial={prefersReducedMotion ? false : { opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
            >
              Focussing on 
              <br />
              <em>Building with AI.</em>
            </motion.h2>
            <p>I’m exploring the ideas and tools behind AI products that are genuinely useful.</p>
          </div>
        </header>

        <div className="learning-explorer">
          <div className="learning-explorer-nav">
            <span className="learning-explorer-eyebrow"></span>
            <div className="learning-focus-list" role="group" aria-label="Areas I’m learning">
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
                      transition={{ type: 'spring', stiffness: 360, damping: 32 }}
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
          </div>

          <motion.div
            key={activeIndex}
            id="learning-focus-panel"
            className="learning-focus-panel"
            role="region"
            aria-live="polite"
            aria-labelledby={`learning-tab-${activeIndex}`}
            initial={prefersReducedMotion ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
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
            <div className={`learning-orbit learning-orbit-${activeIndex % 2 === 0 ? 'blue' : 'violet'}`} aria-hidden="true">
              <span className="learning-orbit-ring learning-orbit-ring-one" />
              <span className="learning-orbit-ring learning-orbit-ring-two" />
              <span className="learning-orbit-node learning-orbit-node-one" />
              <span className="learning-orbit-node learning-orbit-node-two" />
              <span className="learning-orbit-node learning-orbit-node-three" />
              <motion.span
                className="learning-orbit-core"
                key={activeIndex}
                initial={prefersReducedMotion ? false : { scale: 0.78, rotate: -12 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: 'spring', stiffness: 220, damping: 18 }}
              >
                <ActiveIcon size={28} strokeWidth={1.5} />
              </motion.span>
            </div>
            <h3>{activeGroup.title}</h3>
            <p className="learning-focus-note">{activeGroup.note}</p>
            <p className="learning-focus-description">{GROUP_DETAILS[activeIndex]}</p>
            <div className="learning-focus-divider" />
            <div className="learning-topic-heading">
              <span className="learning-explorer-eyebrow">ON MY RADAR</span>
              {selectedTopic && <span className="learning-topic-selection" role="status">Focus: {selectedTopic}</span>}
            </div>
            <ul className="learning-topic-list">
              {activeGroup.topics.map((topic) => (
                <motion.li
                  key={topic}
                  initial={prefersReducedMotion ? false : { opacity: 0, y: 7 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25, delay: prefersReducedMotion ? 0 : activeGroup.topics.indexOf(topic) * 0.045 }}
                >
                  <button
                    type="button"
                    aria-pressed={selectedTopic === topic}
                    className={selectedTopic === topic ? 'is-selected' : ''}
                    onClick={() => setSelectedTopic((current) => current === topic ? null : topic)}
                  >
                    {topic}
                  </button>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
