import { useRef } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { LineReveal } from '../components/LineReveal'
import { useScrollReveal } from '../hooks/useScrollReveal'
import { useMotionContext } from '../context/MotionContext'

const PRINCIPLES = [
  { label: 'Understand', text: 'Start with the constraint, not the solution.', detail: 'Find the real friction before choosing a tool.', outcome: 'A sharper brief' },
  { label: 'Stay flexible', text: 'Write code that future-me can delete.', detail: 'Keep the seams visible so the next change stays easy.', outcome: 'A flexible foundation' },
  { label: 'Make tangible', text: 'Design in the browser when the problem is interactive.', detail: 'Prototype the feeling early, then let it guide the system.', outcome: 'A living prototype' },
  { label: 'Keep moving', text: 'Ship small, learn fast, iterate with intention.', detail: 'Release the smallest useful signal and learn from it.', outcome: 'A useful feedback loop' },
  { label: 'Find clarity', text: 'Clarity is a design decision.', detail: 'Remove noise until the important thing becomes obvious.', outcome: 'A confident interface' },
] as const

function PrincipleCard({ principle, index, reduced }: {
  principle: typeof PRINCIPLES[number]
  index: number
  reduced: boolean
}) {
  const cardRef = useRef<HTMLLIElement>(null)
  const pointerX = useMotionValue(0)
  const pointerY = useMotionValue(0)
  const rotateX = useSpring(useTransform(pointerY, [-1, 1], [4, -4]), { stiffness: 220, damping: 26 })
  const rotateY = useSpring(useTransform(pointerX, [-1, 1], [-5, 5]), { stiffness: 220, damping: 26 })

  const handlePointerMove = (event: React.PointerEvent<HTMLLIElement>) => {
    if (reduced) return
    const bounds = cardRef.current?.getBoundingClientRect()
    const card = cardRef.current
    if (!bounds || !card) return
    const x = (event.clientX - bounds.left) / bounds.width
    const y = (event.clientY - bounds.top) / bounds.height
    pointerX.set(x * 2 - 1)
    pointerY.set(y * 2 - 1)
    card.style.setProperty('--shine-x', `${x * 100}%`)
    card.style.setProperty('--shine-y', `${y * 100}%`)
  }

  const resetPointer = () => {
    pointerX.set(0)
    pointerY.set(0)
    cardRef.current?.style.setProperty('--shine-x', '50%')
    cardRef.current?.style.setProperty('--shine-y', '50%')
  }

  return (
    <motion.li
      ref={cardRef}
      className={index === 0 ? 'principle-card principle-card-featured' : 'principle-card'}
      initial={reduced ? {} : { opacity: 0, y: 16 }}
      whileInView={reduced ? {} : { opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
      style={{ rotateX, rotateY, transformPerspective: 900 }}
      onPointerMove={handlePointerMove}
      onPointerLeave={resetPointer}
    >
      <div className="principle-card-shine" aria-hidden="true" />
      <span className="principle-number">0{index + 1}</span>
      <span className="principle-label">{principle.label}</span>
      <span className="principle-arrow" aria-hidden="true">↗</span>
      <strong>{principle.text}</strong>
      <p>{principle.detail}</p>
      <span className="principle-outcome"><small>Creates</small>{principle.outcome}</span>
    </motion.li>
  )
}

export function HowIWork() {
  const { ref } = useScrollReveal()
  const { prefersReducedMotion } = useMotionContext()

  return (
    <section id="how-i-work" className="section-padding how-i-work-section">
      <div ref={ref as React.RefObject<HTMLDivElement>} className="how-i-work-container">
        <div className="how-i-work-heading">
          <span className="section-kicker">03 / Working principles</span>
          <div>
        {prefersReducedMotion ? (
          <h2>How I work</h2>
        ) : (
          <LineReveal>
            <h2>How I work</h2>
          </LineReveal>
        )}
          </div>
          <p>Good work is a series of useful decisions, made visible.</p>
        </div>

        <ul className="principles-grid">
          {PRINCIPLES.map((principle, i) => (
            <PrincipleCard key={principle.text} principle={principle} index={i} reduced={prefersReducedMotion} />
          ))}
        </ul>
      </div>
    </section>
  )
}
