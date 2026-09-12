import { motion } from 'framer-motion'
import { LineReveal } from '../components/LineReveal'
import { useScrollReveal } from '../hooks/useScrollReveal'
import { useMotionContext } from '../context/MotionContext'

const PRINCIPLES = [
  'Start with the constraint, not the solution.',
  'Write code that future-me can delete.',
  'Design in the browser when the problem is interactive.',
  'Ship small, learn fast, iterate with intention.',
  'Clarity is a design decision.',
] as const

export function HowIWork() {
  const { ref }        = useScrollReveal()
  const { prefersReducedMotion } = useMotionContext()

  return (
    <section
      id="how-i-work"
      className="section-padding"
      style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}
    >
      <div ref={ref as React.RefObject<HTMLDivElement>} style={{ width: '100%', maxWidth: '800px' }}>
        
        {prefersReducedMotion ? (
          <h2 style={{ fontSize: 'clamp(34px, 5vw, 56px)', fontFamily: 'var(--font-display)', marginBottom: '64px', fontWeight: 500 }}>How I work</h2>
        ) : (
          <LineReveal>
            <h2 style={{ fontSize: 'clamp(34px, 5vw, 56px)', fontFamily: 'var(--font-display)', marginBottom: '64px', fontWeight: 500 }}>
              How I work
            </h2>
          </LineReveal>
        )}

        <ul style={{ display: 'flex', flexDirection: 'column' }}>
          {PRINCIPLES.map((principle, i) => (
            <motion.li
              key={principle}
              initial={prefersReducedMotion ? {} : { opacity: 0, y: 16 }}
              whileInView={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
              style={{
                fontFamily:   'var(--font-ui)',
                fontSize:     'clamp(18px, 2.5vw, 24px)',
                fontWeight:   400,
                color:        'var(--text-primary)',
                padding:      '24px 0',
                borderBottom: i === PRINCIPLES.length - 1 ? 'none' : '1px solid rgba(8,8,24,0.08)',
              }}
            >
              {principle}
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  )
}
