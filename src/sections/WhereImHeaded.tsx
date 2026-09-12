import { LineReveal } from '../components/LineReveal'
import { useScrollReveal } from '../hooks/useScrollReveal'
import { useMotionContext } from '../context/MotionContext'

const STATEMENT =
  'Toward interfaces that get out of the way — and the teams that care enough to build them right.'

export function WhereImHeaded() {
  const { ref }        = useScrollReveal()
  const { prefersReducedMotion } = useMotionContext()

  return (
    <section
      id="where-im-headed"
      className="section-padding"
      style={{
        display:         'flex',
        alignItems:      'center',
        justifyContent:  'center',
        textAlign:       'center',
        minHeight:       '60vh',
      }}
    >
      <div ref={ref as React.RefObject<HTMLDivElement>} style={{ maxWidth: '900px', padding: '0 24px' }}>
        {prefersReducedMotion ? (
          <h2 style={{ fontSize: 'clamp(28px, 5vw, 52px)', fontFamily: 'var(--font-display)', fontWeight: 480, lineHeight: 1.15, letterSpacing: '-0.02em', color: 'var(--text-primary)' }}>
            {STATEMENT}
          </h2>
        ) : (
          <LineReveal>
            <h2 style={{ fontSize: 'clamp(28px, 5vw, 52px)', fontFamily: 'var(--font-display)', fontWeight: 480, lineHeight: 1.15, letterSpacing: '-0.02em', color: 'var(--text-primary)' }}>
              {STATEMENT}
            </h2>
          </LineReveal>
        )}
      </div>
    </section>
  )
}
