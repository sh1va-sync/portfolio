import { useRef } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'
import { useMotionContext } from '../context/MotionContext'

interface MagneticButtonProps {
  children: React.ReactNode
  href?: string
  id?: string
  variant?: 'primary' | 'outline'
  onClick?: () => void
}

const SPRING = { stiffness: 400, damping: 28 }

export function MagneticButton({
  children,
  href,
  id,
  variant = 'primary',
  onClick,
}: MagneticButtonProps) {
  const { isTouchDevice } = useMotionContext()
  const ref = useRef<HTMLAnchorElement & HTMLButtonElement>(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const springX = useSpring(x, SPRING)
  const springY = useSpring(y, SPRING)

  const onMouseMove = (e: React.MouseEvent) => {
    if (isTouchDevice) return
    const rect = ref.current?.getBoundingClientRect()
    if (!rect) return
    const cx = rect.left + rect.width  / 2
    const cy = rect.top  + rect.height / 2
    x.set((e.clientX - cx) * 0.35)
    y.set((e.clientY - cy) * 0.35)
  }

  const onMouseLeave = () => {
    x.set(0)
    y.set(0)
  }

  const base: React.CSSProperties = {
    display:        'inline-flex',
    alignItems:     'center',
    gap:            '8px',
    fontFamily:     'var(--font-ui)',
    fontWeight:     500,
    fontSize:       '15px',
    letterSpacing:  '-0.01em',
    padding:        '14px 28px',
    borderRadius:   'var(--radius-btn)',
    cursor:         'none',
    transition:     'background-color 0.2s ease, color 0.2s ease',
    userSelect:     'none',
  }

  const styles: React.CSSProperties =
    variant === 'primary'
      ? { ...base, backgroundColor: 'var(--accent)', color: '#fff', border: 'none' }
      : { ...base, backgroundColor: 'transparent', color: 'var(--text-primary)', border: '1.5px solid rgba(8,8,24,0.2)' }

  const Tag = href ? motion.a : motion.button

  return (
    <Tag
      ref={ref}
      id={id}
      href={href}
      onClick={onClick}
      data-cursor="hover"
      style={{ ...styles, x: springX, y: springY }}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      whileHover={variant === 'primary' ? { backgroundColor: '#1D4ED8' } : { backgroundColor: 'rgba(37,99,235,0.06)' }}
      whileTap={{ scale: 0.97 }}
    >
      {children}
    </Tag>
  )
}
