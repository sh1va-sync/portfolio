import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { useState } from 'react'
import { BrainCircuit, Bot, Code2, Database, Layers3, Sparkles } from 'lucide-react'
import { useMotionContext } from '../context/MotionContext'

type LearningGroup = {
  title: string
  note: string
  topics: string[]
  Icon: typeof BrainCircuit
  tone: string
}

const GROUPS: LearningGroup[] = [
  {
    title: 'AI & LLMs',
    note: 'Models · RAG · Agents',
    topics: ['Prompting', 'Context windows', 'Tokenization', 'Embeddings', 'Claude', 'OpenAI'],
    Icon: BrainCircuit,
    tone: 'blue',
  },
  {
    title: 'Development',
    note: 'Languages · Frameworks',
    topics: ['Python', 'TypeScript', 'LangChain', 'LangGraph', 'FastAPI', 'SDKs'],
    Icon: Code2,
    tone: 'violet',
  },
  {
    title: 'AI Agents',
    note: 'Autonomy · Tool use',
    topics: ['CrewAI', 'Agentic AI', 'Voice agents', 'Tool calling', 'Multi-agent systems'],
    Icon: Bot,
    tone: 'violet',
  },
  {
    title: 'Data & Memory',
    note: 'Store · Retrieve · Reason',
    topics: ['RAG', 'Vector databases', 'Knowledge graphs', 'Embeddings'],
    Icon: Database,
    tone: 'blue',
  },
  {
    title: 'Tools & Platforms',
    note: 'Build · Deploy · Scale',
    topics: ['OpenAI', 'Claude', 'Docker', 'Vercel', 'Supabase', 'AWS'],
    Icon: Layers3,
    tone: 'blue',
  },
  {
    title: 'Emerging interests',
    note: 'Exploring what’s next',
    topics: ['GPT-6 Astra', 'Claude Mythos Fable-5', 'Multimodal AI', 'Human-AI interaction'],
    Icon: Sparkles,
    tone: 'violet',
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

function LearningNode({
  group,
  index,
  active,
  onActivate,
  prefersReducedMotion,
}: {
  group: LearningGroup
  index: number
  active: boolean
  onActivate: () => void
  prefersReducedMotion: boolean
}) {
  const Icon = group.Icon
  return (
    <motion.div
      className={`learning-node learning-node-${index + 1} learning-node-${group.tone}${active ? ' is-active' : ''}`}
      initial={prefersReducedMotion ? false : { opacity: 0, scale: 0.86, y: 18 }}
      whileInView={prefersReducedMotion ? {} : { opacity: 1, scale: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ delay: index * 0.08, type: 'spring', stiffness: 220, damping: 20 }}
      whileHover={prefersReducedMotion ? {} : { y: -8, scale: 1.03 }}
      onMouseEnter={onActivate}
      onFocus={onActivate}
    >
      <button type="button" onClick={onActivate} aria-pressed={active}>
        <span className="learning-node-icon"><Icon size={20} strokeWidth={1.7} /></span>
        <span className="learning-node-copy"><strong>{group.title}</strong><small>{group.note}</small></span>
      </button>
    </motion.div>
  )
}

export function CurrentlyWorking() {
  const { prefersReducedMotion } = useMotionContext()
  const [activeIndex, setActiveIndex] = useState(0)
  const pointerX = useSpring(useMotionValue(0), { stiffness: 120, damping: 22 })
  const pointerY = useSpring(useMotionValue(0), { stiffness: 120, damping: 22 })
  const rotateX = useTransform(pointerY, [-1, 1], [3, -3])
  const rotateY = useTransform(pointerX, [-1, 1], [-4, 4])

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (prefersReducedMotion) return
    const bounds = event.currentTarget.getBoundingClientRect()
    pointerX.set((event.clientX - bounds.left) / bounds.width * 2 - 1)
    pointerY.set((event.clientY - bounds.top) / bounds.height * 2 - 1)
  }
  const ActiveIcon = GROUPS[activeIndex].Icon

  return (
    <section className="currently-working section-padding" aria-labelledby="currently-working-title">
      <div className="currently-working-inner">
        <div className="currently-working-heading">
          <div className="currently-working-label"><span className="ai-live-dot" /> Currently working on</div>
          <div className="currently-working-heading-copy">
            <motion.h2
              id="currently-working-title"
              initial={prefersReducedMotion ? {} : { opacity: 0, y: 24 }}
              whileInView={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.7 }}
            >
              Skills I’m exploring
              <br />
              <em>right now.</em>
            </motion.h2>
            <p>A visual map of the technologies, tools, and concepts I’m diving into while learning to build useful AI products.</p>
          </div>
        </div>

        <div className="learning-map-layout">
          <motion.div
            className="learning-map"
            onPointerMove={handlePointerMove}
            onPointerLeave={() => { pointerX.set(0); pointerY.set(0) }}
            style={{ rotateX: prefersReducedMotion ? 0 : rotateX, rotateY: prefersReducedMotion ? 0 : rotateY }}
          >
          <div className="learning-map-grid" aria-hidden="true" />
          <div className="learning-map-orbit learning-map-orbit-one" aria-hidden="true" />
          <div className="learning-map-orbit learning-map-orbit-two" aria-hidden="true" />
          <motion.div
            className="learning-map-core"
            animate={prefersReducedMotion ? {} : { scale: [1, 1.025, 1] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          >
            <span className="learning-map-core-mark">△</span>
            <strong>LEARNING<br />TO BUILD</strong>
          </motion.div>

          {GROUPS.map((group, index) => (
            <LearningNode
              key={group.title}
              group={group}
              index={index}
              active={activeIndex === index}
              onActivate={() => setActiveIndex(index)}
              prefersReducedMotion={prefersReducedMotion}
            />
          ))}

          <div className="learning-map-quote">“A map of what I’m learning today,<br />to build a better tomorrow.” <span>— SHIVA</span></div>
          <div className="learning-map-footer"><span className="ai-live-dot" /> Always learning. Always building. <span>→</span></div>
          </motion.div>
          <motion.aside
            className="learning-detail-card"
            key={activeIndex}
            initial={prefersReducedMotion ? false : { opacity: 0, x: 18 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.45 }}
            aria-live="polite"
          >
            <div className="learning-detail-index">01 / 0{activeIndex + 1}</div>
            <div className={`learning-detail-icon learning-node-${GROUPS[activeIndex].tone}`}><ActiveIcon size={22} strokeWidth={1.7} /></div>
            <h3>{GROUPS[activeIndex].title}</h3>
            <p className="learning-detail-note">{GROUPS[activeIndex].note}</p>
            <p>{GROUP_DETAILS[activeIndex]}</p>
            <div className="learning-detail-divider" />
            <span className="learning-detail-label">CURRENTLY EXPLORING</span>
            <div className="learning-detail-topics">
              {GROUPS[activeIndex].topics.slice(0, 4).map((topic) => <button key={topic} type="button">{topic}</button>)}
            </div>
            <button className="learning-detail-action" type="button" onClick={() => setActiveIndex((activeIndex + 1) % GROUPS.length)}>
              Explore next <span>↗</span>
            </button>
          </motion.aside>
        </div>
      </div>
    </section>
  )
}
