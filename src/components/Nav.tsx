import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Moon, Palette, Sun } from 'lucide-react'
import { useMotionContext } from '../context/MotionContext'
import { useNavigate } from 'react-router-dom'

const NAV_LINKS = [
  { label: 'Home', href: '/', number: '00' },
  { label: 'Work', href: '/work', number: '01' },
  { label: 'About', href: '/about', number: '02' },
  { label: 'Contact', href: '/contact', number: '03' },
]

const EASE = [0.16, 1, 0.3, 1] as const

export function Nav() {
  const [isOpen, setIsOpen] = useState(false)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [isLogoExpanded, setIsLogoExpanded] = useState(false)
  const [isArtistic, setIsArtistic] = useState(false)
  const [isModeTransitioning, setIsModeTransitioning] = useState(false)
  const [isDark, setIsDark] = useState(() => {
    if (typeof window === 'undefined') return false
    const stored = window.localStorage.getItem('portfolio-theme')
    return stored ? stored === 'dark' : true
  })
  const { prefersReducedMotion } = useMotionContext()
  const navigate = useNavigate()

  useEffect(() => {
    document.documentElement.dataset.theme = isDark ? 'dark' : 'light'
    window.localStorage.setItem('portfolio-theme', isDark ? 'dark' : 'light')
  }, [isDark])

  useEffect(() => {
    document.documentElement.dataset.mode = isArtistic ? 'artistic' : 'technical'
    window.localStorage.setItem('portfolio-mode', isArtistic ? 'artistic' : 'technical')
  }, [isArtistic])

  useEffect(() => {
    const storedMode = window.localStorage.getItem('portfolio-mode')
    if (storedMode === 'artistic') setIsArtistic(true)
    setIsLogoExpanded(true)
    const timeout = window.setTimeout(() => setIsLogoExpanded(false), 1000)
    return () => window.clearTimeout(timeout)
  }, [])

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsOpen(false)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])

  const navigateTo = (href: string) => {
    setIsOpen(false)

    if (prefersReducedMotion) {
      navigate(href)
      return
    }

    setIsTransitioning(true)
    window.setTimeout(() => {
      navigate(href)
      window.scrollTo(0, 0)
      window.setTimeout(() => setIsTransitioning(false), 450)
    }, 480)
  }

  const toggleArtisticMode = () => {
    setIsModeTransitioning(true)
    setIsArtistic((artistic) => !artistic)
    window.setTimeout(() => setIsModeTransitioning(false), prefersReducedMotion ? 0 : 850)
  }

  return (
    <>
      <motion.nav
        role="navigation"
        aria-label="Primary navigation"
        initial={{ y: -24, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.2, ease: EASE }}
        style={{
          position: 'fixed',
          top: '24px',
          left: '24px',
          right: '24px',
          zIndex: 100,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          pointerEvents: 'none',
        }}
      >
        <div className={`nav-logo-shell${isLogoExpanded ? ' is-expanded' : ''}`}>
          <motion.div className="nav-logo" layout transition={{ duration: prefersReducedMotion ? 0 : 0.65, ease: EASE }}>
          <button
            type="button"
            className="nav-logo-trigger"
            aria-label={isLogoExpanded ? 'Collapse logo controls' : 'Open logo controls'}
            aria-expanded={isLogoExpanded}
            onClick={() => setIsLogoExpanded((expanded) => !expanded)}
            data-cursor="hover"
          >
            <img className="nav-signature" src="/signature.svg" alt="Shiva signature" />
          </button>
          </motion.div>

          <AnimatePresence>
            {isLogoExpanded && (
              <motion.div className="nav-logo-controls" initial={{ opacity: 0, scaleX: 0.2, x: -14 }} animate={{ opacity: 1, scaleX: 1, x: 0 }} exit={{ opacity: 0, scaleX: 0.2, x: -14 }} transition={{ duration: prefersReducedMotion ? 0 : 0.45, ease: EASE }}>
                <button type="button" onClick={() => setIsDark((dark) => !dark)} title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}>
                  {isDark ? <Sun size={15} /> : <Moon size={15} />}
                  <span>{isDark ? 'Light' : 'Dark'}</span>
                </button>
                <button type="button" className={isArtistic ? 'is-active' : ''} onClick={toggleArtisticMode} title="Switch artistic mode">
                  <Palette size={15} />
                  <span>{isArtistic ? 'Studio' : 'Art'}</span>
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      <AnimatePresence>
        {isModeTransitioning && !prefersReducedMotion && (
          <div className="mode-transition" aria-hidden="true">
            <motion.i className="mode-ripple mode-ripple-white" initial={{ scale: 0, opacity: 0.9 }} animate={{ scale: 3.6, opacity: 0 }} transition={{ duration: 0.95, ease: EASE }} />
            <motion.i className="mode-ripple mode-ripple-violet" initial={{ scale: 0, opacity: 0.85 }} animate={{ scale: 3.1, opacity: 0 }} transition={{ duration: 0.95, delay: 0.08, ease: EASE }} />
            <motion.i className="mode-ripple mode-ripple-blue" initial={{ scale: 0, opacity: 0.9 }} animate={{ scale: 2.6, opacity: 0 }} transition={{ duration: 0.95, delay: 0.16, ease: EASE }} />
          </div>
        )}
      </AnimatePresence>

        <button
          type="button"
          aria-label={isOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={isOpen}
          onClick={() => setIsOpen((open) => !open)}
          data-cursor="hover"
          style={{
            pointerEvents: 'auto',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            height: '48px',
            padding: '0 18px',
            border: '1px solid rgba(255,255,255,0.92)',
            borderRadius: '999px',
            background: isOpen ? 'var(--text-primary)' : 'var(--accent)',
            color: '#fff',
            boxShadow: isOpen ? '0 12px 30px rgba(8,8,24,0.18)' : '0 12px 30px rgba(37,99,235,0.28)',
            backdropFilter: 'blur(18px)',
            WebkitBackdropFilter: 'blur(18px)',
            fontFamily: 'var(--font-ui)',
            fontSize: '11px',
            fontWeight: 700,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            cursor: 'pointer',
            transition: 'background 0.3s ease, color 0.3s ease',
          }}
        >
          <span>{isOpen ? 'Close' : 'Menu'}</span>
          <span aria-hidden="true" style={{ display: 'grid', gap: '4px' }}>
            <motion.i
              animate={{ rotate: isOpen ? 45 : 0, y: isOpen ? 4 : 0 }}
              style={{ display: 'block', width: '16px', height: '1px', background: 'currentColor' }}
            />
            <motion.i
              animate={{ rotate: isOpen ? -45 : 0, y: isOpen ? -1 : 0 }}
              style={{ display: 'block', width: '16px', height: '1px', background: 'currentColor' }}
            />
          </span>
        </button>
      </motion.nav>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Site menu"
            className="menu-overlay"
            initial={{ clipPath: 'inset(0 0 100% 0)' }}
            animate={{ clipPath: 'inset(0 0 0% 0)' }}
            exit={{ clipPath: 'inset(100% 0 0% 0)' }}
            transition={{ duration: prefersReducedMotion ? 0 : 0.7, ease: EASE }}
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 90,
              display: 'grid',
              gridTemplateRows: 'auto minmax(0, 1fr) auto',
              rowGap: 'clamp(18px, 4vh, 44px)',
              minHeight: '100dvh',
              padding: 'clamp(96px, 13vh, 132px) clamp(24px, 8vw, 120px) 24px',
              background: 'linear-gradient(135deg, #07112f 0%, #172e78 52%, #2563eb 100%)',
              color: '#fff',
              overflow: 'auto',
            }}
          >
            <div style={{ position: 'absolute', top: '18%', right: '8%', width: '30vw', height: '30vw', borderRadius: '50%', background: 'rgba(147,197,253,0.18)', filter: 'blur(30px)', pointerEvents: 'none' }} />
            <div className="menu-header" style={{ position: 'relative', display: 'flex', justifyContent: 'space-between', gap: '32px' }}>
              <div>
                <p style={{ marginBottom: '20px', fontFamily: 'var(--font-ui)', fontSize: '11px', fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.6)' }}>
                  Navigation
                </p>
                <p style={{ maxWidth: '260px', fontFamily: 'var(--font-display)', fontSize: 'clamp(18px, 2.5vw, 28px)', lineHeight: 1.15 }}>
                  A small map of the things I make.
                </p>
              </div>
              <span style={{ alignSelf: 'flex-start', fontFamily: 'var(--font-ui)', fontSize: '12px', color: 'rgba(255,255,255,0.6)' }}>
                2026 / SC
              </span>
            </div>

            <nav className="menu-links" style={{ position: 'relative', display: 'flex', minHeight: 0, flexDirection: 'column', justifyContent: 'center', alignItems: 'flex-start', gap: 'clamp(2px, 0.7vh, 8px)', overflowY: 'auto', padding: '4px 0' }}>
              {NAV_LINKS.map((link, index) => (
                <motion.button
                  key={link.label}
                  type="button"
                  onClick={() => navigateTo(link.href)}
                  data-cursor="hover"
                  initial={{ opacity: 0, x: -40 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: prefersReducedMotion ? 0 : 0.12 + index * 0.08, duration: 0.65, ease: EASE }}
                  style={{
                    display: 'flex',
                    alignItems: 'baseline',
                    gap: 'clamp(16px, 3vw, 40px)',
                    padding: '2px 0',
                    border: 0,
                    background: 'transparent',
                    color: '#fff',
                    fontFamily: 'var(--font-display)',
                    fontSize: 'clamp(42px, 7.8vw, 104px)',
                    lineHeight: 0.86,
                    letterSpacing: '-0.055em',
                    whiteSpace: 'nowrap',
                    cursor: 'pointer',
                  }}
                  whileHover={{ x: 18, color: '#bfdbfe' }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span style={{ fontFamily: 'var(--font-ui)', fontSize: '12px', fontWeight: 600, letterSpacing: '0.08em', color: 'rgba(255,255,255,0.55)' }}>
                    {link.number}
                  </span>
                  {link.label}
                </motion.button>
              ))}
            </nav>

            <div className="menu-footer" style={{ position: 'relative', display: 'flex', justifyContent: 'space-between', gap: '24px', borderTop: '1px solid rgba(255,255,255,0.22)', paddingTop: '14px', fontFamily: 'var(--font-ui)', fontSize: '12px', lineHeight: 1.3, color: 'rgba(255,255,255,0.65)' }}>
              <span>Available for thoughtful work</span>
              <span>Scroll / Select</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isTransitioning && (
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '-100%' }}
            transition={{ duration: 0.48, ease: EASE }}
            style={{ position: 'fixed', inset: 0, zIndex: 200, background: 'var(--text-primary)', pointerEvents: 'none' }}
          />
        )}
      </AnimatePresence>
    </>
  )
}
