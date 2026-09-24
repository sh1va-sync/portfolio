import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
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

type TopicSphere = {
  id: string
  label: string
  groupIndex: number
  tone: string
  x: number
  y: number
  vx: number
  vy: number
  radius: number
}

const TOPICS: TopicSphere[] = GROUPS.map((group, groupIndex) => ({
  id: `${groupIndex}`,
  label: group.title,
  groupIndex,
  tone: group.tone,
  x: 0,
  y: 0,
  vx: 0,
  vy: 0,
  radius: 54,
}))

export function CurrentlyWorking() {
  const { prefersReducedMotion } = useMotionContext()
  const [activeIndex, setActiveIndex] = useState(0)
  const [spheres, setSpheres] = useState(TOPICS)
  const fieldRef = useRef<HTMLDivElement>(null)
  const physicsRef = useRef(TOPICS)
  const dragRef = useRef<{ id: string; lastX: number; lastY: number; lastTime: number } | null>(null)
  const pointerX = useSpring(useMotionValue(0), { stiffness: 120, damping: 22 })
  const pointerY = useSpring(useMotionValue(0), { stiffness: 120, damping: 22 })
  const rotateX = useTransform(pointerY, [-1, 1], [3, -3])
  const rotateY = useTransform(pointerX, [-1, 1], [-4, 4])
  const detailPointerX = useSpring(useMotionValue(0), { stiffness: 180, damping: 24 })
  const detailPointerY = useSpring(useMotionValue(0), { stiffness: 180, damping: 24 })
  const detailRotateX = useTransform(detailPointerY, [-1, 1], [4, -4])
  const detailRotateY = useTransform(detailPointerX, [-1, 1], [-5, 5])

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (prefersReducedMotion) return
    const bounds = event.currentTarget.getBoundingClientRect()
    const x = (event.clientX - bounds.left) / bounds.width
    const y = (event.clientY - bounds.top) / bounds.height
    pointerX.set(x * 2 - 1)
    pointerY.set(y * 2 - 1)
    event.currentTarget.style.setProperty('--map-pointer-x', `${x * 100}%`)
    event.currentTarget.style.setProperty('--map-pointer-y', `${y * 100}%`)
  }
  const ActiveIcon = GROUPS[activeIndex].Icon

  useEffect(() => {
    const field = fieldRef.current
    if (!field) return
    const { width, height } = field.getBoundingClientRect()
    const columns = Math.min(3, Math.max(1, Math.floor(width / 150)))
    const columnWidth = width / (columns + 1)
    const rowHeight = Math.max(120, height / 3)
    const initial = TOPICS.map((sphere, index) => ({
      ...sphere,
      x: Math.max(sphere.radius, Math.min(width - sphere.radius, columnWidth * ((index % columns) + 1))),
      y: Math.max(sphere.radius, Math.min(height - sphere.radius, rowHeight * (Math.floor(index / columns) + 0.65))),
      vx: (index % 2 === 0 ? 1 : -1) * (0.55 + index * 0.1),
      vy: (index % 3 === 0 ? 1 : -1) * (0.35 + (index % 3) * 0.14),
    }))
    physicsRef.current = initial
    setSpheres(initial)
    if (prefersReducedMotion) return

    let frame = 0
    let last = performance.now()
    const tick = (now: number) => {
      const dt = Math.min((now - last) / 16.67, 2)
      last = now
      const current = physicsRef.current
      const bounds = field.getBoundingClientRect()
      const width = bounds.width
      const height = bounds.height
      for (const sphere of current) {
        if (dragRef.current?.id === sphere.id) continue
        sphere.x += sphere.vx * dt
        sphere.y += sphere.vy * dt
        if (sphere.x - sphere.radius < 0 || sphere.x + sphere.radius > width) {
          sphere.x = Math.max(sphere.radius, Math.min(width - sphere.radius, sphere.x))
          sphere.vx *= -1
        }
        if (sphere.y - sphere.radius < 0 || sphere.y + sphere.radius > height) {
          sphere.y = Math.max(sphere.radius, Math.min(height - sphere.radius, sphere.y))
          sphere.vy *= -1
        }
      }
      for (let i = 0; i < current.length; i += 1) {
        for (let j = i + 1; j < current.length; j += 1) {
          const first = current[i]
          const second = current[j]
          const dx = second.x - first.x
          const dy = second.y - first.y
          const distance = Math.hypot(dx, dy) || 0.01
          const minimum = first.radius + second.radius
          if (distance >= minimum) continue
          const nx = dx / distance
          const ny = dy / distance
          const overlap = (minimum - distance) / 2
          first.x -= nx * overlap
          first.y -= ny * overlap
          second.x += nx * overlap
          second.y += ny * overlap
          const relativeVelocity = (second.vx - first.vx) * nx + (second.vy - first.vy) * ny
          if (relativeVelocity < 0) {
            const impulse = -relativeVelocity
            first.vx -= impulse * nx
            first.vy -= impulse * ny
            second.vx += impulse * nx
            second.vy += impulse * ny
          }
        }
      }
      for (const sphere of current) {
        sphere.x = Math.max(sphere.radius, Math.min(width - sphere.radius, sphere.x))
        sphere.y = Math.max(sphere.radius, Math.min(height - sphere.radius, sphere.y))
      }
      setSpheres(current.map((sphere) => ({ ...sphere })))
      frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [prefersReducedMotion])

  const handleSpherePointerDown = (event: React.PointerEvent<HTMLButtonElement>, sphere: TopicSphere) => {
    event.preventDefault()
    event.stopPropagation()
    setActiveIndex(sphere.groupIndex)
    event.currentTarget.setPointerCapture(event.pointerId)
    dragRef.current = { id: sphere.id, lastX: event.clientX, lastY: event.clientY, lastTime: performance.now() }
    sphere.vx = 0
    sphere.vy = 0
  }

  const handleSpherePointerMove = (event: React.PointerEvent<HTMLButtonElement>, sphere: TopicSphere) => {
    if (dragRef.current?.id !== sphere.id || !fieldRef.current) return
    const bounds = fieldRef.current.getBoundingClientRect()
    const now = performance.now()
    const drag = dragRef.current
    sphere.x = Math.max(sphere.radius, Math.min(bounds.width - sphere.radius, event.clientX - bounds.left))
    sphere.y = Math.max(sphere.radius, Math.min(bounds.height - sphere.radius, event.clientY - bounds.top))
    sphere.vx = (event.clientX - drag.lastX) / Math.max(now - drag.lastTime, 1) * 16
    sphere.vy = (event.clientY - drag.lastY) / Math.max(now - drag.lastTime, 1) * 16
    drag.lastX = event.clientX
    drag.lastY = event.clientY
    drag.lastTime = now
    setSpheres(physicsRef.current.map((item) => ({ ...item })))
  }

  const handleSpherePointerUp = (event: React.PointerEvent<HTMLButtonElement>, sphere: TopicSphere) => {
    if (dragRef.current?.id !== sphere.id) return
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId)
    dragRef.current = null
  }

  const handleDetailPointerMove = (event: React.PointerEvent<HTMLElement>) => {
    if (prefersReducedMotion) return
    const bounds = event.currentTarget.getBoundingClientRect()
    const x = (event.clientX - bounds.left) / bounds.width
    const y = (event.clientY - bounds.top) / bounds.height
    detailPointerX.set(x * 2 - 1)
    detailPointerY.set(y * 2 - 1)
    event.currentTarget.style.setProperty('--detail-pointer-x', `${x * 100}%`)
    event.currentTarget.style.setProperty('--detail-pointer-y', `${y * 100}%`)
  }

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
              Focussing on
              <br />
              <em>Gen/Agentic AI</em>
            </motion.h2>
            <p>A visual map of the technologies, tools, and concepts I’m diving into while learning to build useful AI products.</p>
          </div>
        </div>

        <div className="learning-map-layout">
          <motion.div
            className="learning-map"
            onPointerMove={handlePointerMove}
            onPointerLeave={(event) => {
              pointerX.set(0)
              pointerY.set(0)
              event.currentTarget.style.setProperty('--map-pointer-x', '50%')
              event.currentTarget.style.setProperty('--map-pointer-y', '50%')
            }}
            style={{ rotateX: prefersReducedMotion ? 0 : rotateX, rotateY: prefersReducedMotion ? 0 : rotateY }}
          >
          <div className="learning-map-grid" aria-hidden="true" />
          <div className="learning-space-backdrop" aria-hidden="true">
            {Array.from({ length: 26 }, (_, index) => (
              <span key={index} className={`learning-star learning-star-${index % 4}`} />
            ))}
            <i className="learning-nebula learning-nebula-one" />
            <i className="learning-nebula learning-nebula-two" />
          </div>
          <div className="learning-map-instruction">Select a topic</div>
          <div className="learning-sphere-field" ref={fieldRef}>
            {spheres.map((sphere) => (
              <button
                key={sphere.id}
                type="button"
                className={`learning-sphere learning-sphere-${sphere.tone}${GROUPS[activeIndex].topics.includes(sphere.label) ? ' is-active' : ''}`}
                style={{ left: sphere.x - sphere.radius, top: sphere.y - sphere.radius, width: sphere.radius * 2, height: sphere.radius * 2 }}
                onPointerDown={(event) => handleSpherePointerDown(event, sphere)}
                onPointerMove={(event) => handleSpherePointerMove(event, sphere)}
                onPointerUp={(event) => handleSpherePointerUp(event, sphere)}
                onFocus={() => setActiveIndex(sphere.groupIndex)}
                aria-label={`Explore ${sphere.label}`}
              >
                {sphere.label}
              </button>
            ))}
          </div>
          </motion.div>
          <motion.aside
            className="learning-detail-card"
            key={activeIndex}
            initial={prefersReducedMotion ? false : { opacity: 0, x: 18 }}
            animate={{ opacity: 1, x: 0 }}
            whileHover={prefersReducedMotion ? {} : { y: -6, scale: 1.01 }}
            transition={{ duration: 0.45 }}
            style={{ rotateX: prefersReducedMotion ? 0 : detailRotateX, rotateY: prefersReducedMotion ? 0 : detailRotateY }}
            onPointerMove={handleDetailPointerMove}
            onPointerLeave={(event) => {
              detailPointerX.set(0)
              detailPointerY.set(0)
              event.currentTarget.style.setProperty('--detail-pointer-x', '50%')
              event.currentTarget.style.setProperty('--detail-pointer-y', '50%')
            }}
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
