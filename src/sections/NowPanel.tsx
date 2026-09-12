import { motion } from 'framer-motion'
import { LineReveal } from '../components/LineReveal'
import { useScrollReveal } from '../hooks/useScrollReveal'
import { useMotionContext } from '../context/MotionContext'

const NOW_DATE   = 'September 2026'
const NOW_LINES  = [
  'Building accessible design systems and exploring constraint-based UI tooling.',
  'Reading about distributed systems and contributing to open-source React libraries.',
  'Open to senior individual contributor roles with strong craft ownership.',
]

export function NowPanel() {
  const { ref, isInView }        = useScrollReveal()
  const { prefersReducedMotion } = useMotionContext()

  return (
    <section
      id="now"
      className="section-padding"
      style={{ display: 'flex', justifyContent: 'center' }}
    >
      <motion.div
        ref={ref as React.RefObject<HTMLDivElement>}
        initial={prefersReducedMotion ? {} : { opacity: 0, scale: 0.98, y: 24 }}
        animate={prefersReducedMotion ? {} : isInView ? { opacity: 1, scale: 1, y: 0 } : { opacity: 0, scale: 0.98, y: 24 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        style={{ maxWidth: '720px', width: '100%' }}
      >
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.25)',
            border: '1px solid rgba(255, 255, 255, 0.9)',
            borderRadius: 'var(--radius-panel)',
            padding: '48px',
            boxShadow: '0 24px 48px -12px rgba(8,8,24,0.06), 0 4px 12px -4px rgba(8,8,24,0.03)',
            textAlign: 'center', // Centered
          }}
        >
          <div style={{ marginBottom: '32px' }}>
            <span
              style={{
                display: 'inline-block',
                fontFamily: 'var(--font-ui)',
                fontSize: '13px',
                fontWeight: 600,
                letterSpacing: '0.04em',
                textTransform: 'uppercase',
                color: 'var(--accent)',
                marginBottom: '16px',
              }}
            >
              {NOW_DATE}
            </span>
            {prefersReducedMotion ? (
              <h2 style={{ fontSize: 'clamp(28px, 4vw, 40px)', fontFamily: 'var(--font-display)', fontWeight: 500, letterSpacing: '-0.02em' }}>What I'm doing now</h2>
            ) : (
              <LineReveal>
                <h2 style={{ fontSize: 'clamp(28px, 4vw, 40px)', fontFamily: 'var(--font-display)', fontWeight: 500, letterSpacing: '-0.02em' }}>
                  What I'm doing now
                </h2>
              </LineReveal>
            )}
          </div>

          <ul style={{ display: 'flex', flexDirection: 'column', gap: '16px', alignItems: 'center' }}>
            {NOW_LINES.map((line) => (
              <li
                key={line}
                style={{
                  fontFamily: 'var(--font-ui)',
                  fontSize: 'clamp(15px, 1.8vw, 17px)',
                  fontWeight: 400,
                  lineHeight: 1.6,
                  color: 'var(--text-muted)',
                  maxWidth: '52ch',
                }}
              >
                {line}
              </li>
            ))}
          </ul>
        </div>
      </motion.div>
    </section>
  )
}
