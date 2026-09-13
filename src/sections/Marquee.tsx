import { useMotionContext } from '../context/MotionContext'

const WORDS = [
  'OPEN FOR NEW OPPORTUNITIES',
  'AVAILABLE FOR FREELANCE',
  'OPEN FOR NEW OPPORTUNITIES',
  'AVAILABLE FOR FREELANCE',
]

export function Marquee() {
  const { prefersReducedMotion } = useMotionContext()

  return (
    <section className="marquee-section" style={{ overflow: 'hidden', padding: '64px 0', borderTop: '1px solid rgba(8,8,24,0.06)' }}>
      <div
        className={prefersReducedMotion ? '' : 'marquee-track'}
        style={{
          display: 'flex',
          gap: '40px',
          alignItems: 'center',
          whiteSpace: 'nowrap',
          padding: '0 20px',
        }}
      >
        {[...WORDS, ...WORDS].map((word, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '40px' }}>
            <span
              className="marquee-word"
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(40px, 8vw, 80px)',
                fontWeight: 600,
                letterSpacing: '-0.02em',
                color: 'transparent',
                WebkitTextStroke: '1px rgba(8,8,24,0.15)',
                textTransform: 'uppercase',
                transition: 'color 0.3s ease',
                cursor: 'default',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--accent)')}
              onMouseLeave={(e) => (e.currentTarget.style.color = 'transparent')}
            >
              {word}
            </span>
            <span className="marquee-separator" style={{ color: 'var(--accent)', fontSize: '24px' }}>✺</span>
          </div>
        ))}
      </div>
    </section>
  )
}
