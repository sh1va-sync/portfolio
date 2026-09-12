import { LineReveal } from '../components/LineReveal'
import { MagneticButton } from '../components/MagneticButton'
import { useMotionContext } from '../context/MotionContext'

const EMAIL  = 'shiva@example.com'
const LINKS  = [
  { id: 'link-github',   label: 'GitHub',   href: 'https://github.com/'   },
  { id: 'link-linkedin', label: 'LinkedIn', href: 'https://linkedin.com/' },
] as const

export function Contact() {
  const { prefersReducedMotion } = useMotionContext()
  const year = new Date().getFullYear()

  return (
    <footer
      id="contact"
      className="section-padding"
      style={{
        backgroundColor: 'transparent', // Let global glassmorphism shine through
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        borderTop: '1px solid rgba(8,8,24,0.04)',
      }}
    >
      <div style={{ maxWidth: '800px', width: '100%' }}>
        
        {/* Giant "Reach Me" Heading */}
        <div style={{ marginBottom: '64px' }}>
          {prefersReducedMotion ? (
            <h2 style={{ fontSize: 'clamp(56px, 12vw, 140px)', fontFamily: 'var(--font-display)', fontWeight: 600, letterSpacing: '-0.04em', lineHeight: 0.9 }}>
              Let's talk
            </h2>
          ) : (
            <LineReveal>
              <h2 style={{ fontSize: 'clamp(56px, 12vw, 140px)', fontFamily: 'var(--font-display)', fontWeight: 600, letterSpacing: '-0.04em', lineHeight: 0.9 }}>
                Let's talk
              </h2>
            </LineReveal>
          )}
        </div>

        {/* Magnetic Button Links */}
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '24px', marginBottom: '120px' }}>
          <MagneticButton href={`mailto:${EMAIL}`} variant="primary">
            Send an email
          </MagneticButton>
          {LINKS.map(link => (
            <MagneticButton key={link.id} href={link.href} variant="outline">
              {link.label}
            </MagneticButton>
          ))}
        </div>

        {/* Footer bottom */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderTop: '1px solid rgba(8,8,24,0.08)',
            paddingTop: '32px',
          }}
        >
          <span style={{ fontFamily: 'var(--font-ui)', fontSize: '14px', fontWeight: 500, color: 'var(--text-muted)' }}>
            Shiva Chary
          </span>
          <span style={{ fontFamily: 'var(--font-ui)', fontSize: '14px', fontWeight: 500, color: 'var(--text-muted)' }}>
            {year}
          </span>
        </div>
      </div>
    </footer>
  )
}
