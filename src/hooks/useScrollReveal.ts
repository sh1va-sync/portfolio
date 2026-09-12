import { useRef } from 'react'
import { useInView } from 'framer-motion'

export function useScrollReveal(amount: number = 0.2) {
  const ref = useRef<HTMLElement>(null)
  const isInView = useInView(ref, { once: true, amount })
  return { ref, isInView }
}
