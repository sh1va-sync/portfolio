import { motion } from 'framer-motion'
import { useMotionContext } from '../context/MotionContext'

const TOPICS = ['GenAI', 'Agentic AI', 'Product thinking']

export function CurrentlyWorking() {
  const { prefersReducedMotion } = useMotionContext()

  return (
    <section className="currently-working section-padding" aria-labelledby="currently-working-title">
      <div className="currently-working-inner">
        <div className="currently-working-label">
          <span className="ai-live-dot" />
          <span>Currently working on</span>
        </div>
        <div>
          <motion.h2
            id="currently-working-title"
            initial={prefersReducedMotion ? {} : { opacity: 0, y: 24 }}
            whileInView={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.7 }}
          >
            Learning to build
            <br />
            <em>end-to-end AI applications.</em>
          </motion.h2>
          <p>
            From GenAI to Agentic AI: turning capable models into reliable,
            human-centered products that can actually ship.
          </p>
          <div className="currently-working-topics">
            {TOPICS.map((topic) => <span key={topic}>{topic}</span>)}
          </div>
        </div>
      </div>
    </section>
  )
}
