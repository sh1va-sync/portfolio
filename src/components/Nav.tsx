import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

const NAV_LINKS = [
  { label: 'Work',    href: '#projects' },
  { label: 'About',   href: '#how-i-work' },
  { label: 'Contact', href: '#contact' },
]

export function Nav() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > window.innerHeight * 0.5)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <motion.nav
      role="navigation"
      aria-label="Primary navigation"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center', // Centered nav
        padding: '20px 40px',
        borderBottom: scrolled ? '1px solid rgba(8,8,24,0.06)' : '1px solid transparent',
        backgroundColor: scrolled ? 'rgba(255,255,255,0.75)' : 'transparent',
        backdropFilter: scrolled ? 'blur(20px) saturate(160%)' : 'none',
        WebkitBackdropFilter: scrolled ? 'blur(20px) saturate(160%)' : 'none',
        transition: 'all 0.4s ease',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '64px' }}>
        <a
          href="#"
          id="nav-logo"
          data-cursor="hover"
          style={{
            fontFamily: 'var(--font-display)',
            fontVariationSettings: '"opsz" 36',
            fontWeight: 600,
            fontSize: '18px',
            color: 'var(--text-primary)',
            letterSpacing: '-0.01em',
          }}
        >
          SC
        </a>

        <ul style={{ display: 'flex', gap: '32px' }}>
          {NAV_LINKS.map(({ label, href }) => (
            <li key={label}>
              <a
                id={`nav-link-${label.toLowerCase()}`}
                href={href}
                data-cursor="hover"
                style={{
                  fontFamily: 'var(--font-ui)',
                  fontWeight: 500,
                  fontSize: '14px',
                  color: 'var(--text-muted)',
                  transition: 'color 0.2s ease',
                }}
                onMouseEnter={e => ((e.currentTarget as HTMLElement).style.color = 'var(--accent)')}
                onMouseLeave={e => ((e.currentTarget as HTMLElement).style.color = 'var(--text-muted)')}
              >
                {label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </motion.nav>
  )
}
