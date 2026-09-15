import { motion } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useMotionContext } from '../context/MotionContext'

const WAVE_COPY = 'LET’S MAKE SOMETHING USEFUL · '

export function ContactCTA() {
  const { prefersReducedMotion } = useMotionContext()

  return (
    <section className="contact-cta section-padding" aria-labelledby="contact-cta-title">
      <div className="contact-cta-backdrop" aria-hidden="true">
        <div className="contact-cta-wave contact-cta-wave-one">{WAVE_COPY.repeat(3)}</div>
        <div className="contact-cta-wave contact-cta-wave-two">{WAVE_COPY.repeat(3)}</div>
      </div>

      <motion.div
        className="contact-cta-inner"
        initial={prefersReducedMotion ? false : { opacity: 0, y: 42 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="contact-cta-kicker"><span className="ai-live-dot" /> Have an idea?</div>
        <h2 id="contact-cta-title">
          Got a project<br />
          <em>in mind?</em>
        </h2>
        <p>Let’s turn the rough idea into something clear, useful, and worth remembering.</p>
        <Link className="contact-cta-link" to="/contact">
          <span>Start a conversation</span>
          <span className="contact-cta-link-icon"><ArrowUpRight size={22} strokeWidth={1.7} /></span>
        </Link>
      </motion.div>
    </section>
  )
}
