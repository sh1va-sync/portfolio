import { useEffect } from 'react'
import { useMotionValue } from 'framer-motion'

export function useMousePosition() {
  const x = useMotionValue(
    typeof window !== 'undefined' ? window.innerWidth / 2 : 0
  )
  const y = useMotionValue(
    typeof window !== 'undefined' ? window.innerHeight / 2 : 0
  )

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      x.set(e.clientX)
      y.set(e.clientY)
    }
    window.addEventListener('mousemove', handler, { passive: true })
    return () => window.removeEventListener('mousemove', handler)
  }, [x, y])

  return { x, y }
}
