import { useRef } from 'react'
import { useScroll, useTransform, type MotionValue } from 'framer-motion'

/**
 * Returns a y MotionValue that moves at `factor` speed relative to normal scroll.
 * factor 0.7 means the element moves at 70% speed → it "lags" 30% behind → parallax.
 */
export function useParallax(factor: number = 0.7): {
  ref: React.RefObject<HTMLDivElement | null>
  y: MotionValue<string>
} {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })

  // A factor < 1 makes the element travel less than the viewport → visual lag
  const range = `${40 * (1 - factor)}%`
  const y = useTransform(scrollYProgress, [0, 1], [`-${range}`, range])

  return { ref, y }
}
