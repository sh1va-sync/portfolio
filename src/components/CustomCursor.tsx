import { useEffect, useState } from 'react'
import { motion, useSpring } from 'framer-motion'
import { useMousePosition } from '../hooks/useMousePosition'
import { useMotionContext } from '../context/MotionContext'

type CursorState = 'default' | 'hover' | 'hero'

export function CustomCursor() {
  const { isTouchDevice } = useMotionContext()
  const { x: mouseX, y: mouseY } = useMousePosition()
  const [cursorState, setCursorState] = useState<CursorState>('default')

  const ringX = useSpring(mouseX, { stiffness: 300, damping: 30 })
  const ringY = useSpring(mouseY, { stiffness: 300, damping: 30 })

  useEffect(() => {
    if (isTouchDevice) return
    const handleOver = (e: MouseEvent) => {
      const el = (e.target as HTMLElement).closest('[data-cursor]') as HTMLElement | null
      if (el?.dataset.cursor) {
        setCursorState(el.dataset.cursor as CursorState)
      } else {
        setCursorState('default')
      }
    }
    window.addEventListener('mouseover', handleOver, { passive: true })
    return () => window.removeEventListener('mouseover', handleOver)
  }, [isTouchDevice])

  if (isTouchDevice) return null

  const isHover = cursorState === 'hover'
  const isHero  = cursorState === 'hero'

  return (
    <>
      <motion.div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          translateX: '-50%',
          translateY: '-50%',
          x: mouseX,
          y: mouseY,
          width: 8,
          height: 8,
          borderRadius: '50%',
          backgroundColor: 'var(--text-primary)', // Dark dot
          pointerEvents: 'none',
          zIndex: 9999,
        }}
        animate={{ opacity: isHover || isHero ? 0 : 1 }}
        transition={{ duration: 0.15 }}
      />

      <motion.div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          translateX: '-50%',
          translateY: '-50%',
          x: ringX,
          y: ringY,
          borderRadius: '50%',
          pointerEvents: 'none',
          zIndex: 9998,
        }}
        animate={{
          width:           isHover ? 64 : 40,
          height:          isHover ? 64 : 40,
          backgroundColor: isHover ? 'rgba(37,99,235,0.1)' : 'transparent', // Blue tint on hover
          border:          isHover ? '0px solid transparent' : '1px solid rgba(8,8,24,0.15)', // Darker border
          opacity:         isHero ? 0 : 1,
        }}
        transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
      />
    </>
  )
}
