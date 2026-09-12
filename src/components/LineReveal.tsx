import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

interface LineRevealProps {
  children: React.ReactNode
  delay?: number
  style?: React.CSSProperties
  className?: string
}

const EASE = [0.16, 1, 0.3, 1] as const

/**
 * Wraps children in an overflow:hidden clip, then slides content up into view
 * when it enters the viewport. The classic Awwwards line-reveal technique.
 */
export function LineReveal({
  children,
  delay = 0,
  style,
  className,
}: LineRevealProps) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, amount: 0.6 })

  return (
    <div
      ref={ref}
      className={className}
      style={{ overflow: 'hidden', ...style }}
    >
      <motion.div
        initial={{ y: '110%', opacity: 0 }}
        animate={isInView ? { y: '0%', opacity: 1 } : { y: '110%', opacity: 0 }}
        transition={{ delay, duration: 0.85, ease: EASE }}
      >
        {children}
      </motion.div>
    </div>
  )
}
