import { useEffect } from 'react'
import Lenis from 'lenis'

export const LENIS_SCROLL_TO_TOP_EVENT = 'portfolio:scroll-to-top'

export function useLenis() {
  useEffect(() => {
    const lenis = new Lenis({
      lerp: 0.035, // Very low lerp for heavy, laggy, premium scroll feel
      wheelMultiplier: 0.9,
      smoothWheel: true,
    })

    const handleScrollToTop = () => {
      lenis.scrollTo(0, { immediate: true, force: true })
    }
    window.addEventListener(LENIS_SCROLL_TO_TOP_EVENT, handleScrollToTop)

    let rafId: number

    function raf(time: number) {
      lenis.raf(time)
      rafId = requestAnimationFrame(raf)
    }

    rafId = requestAnimationFrame(raf)

    return () => {
      cancelAnimationFrame(rafId)
      window.removeEventListener(LENIS_SCROLL_TO_TOP_EVENT, handleScrollToTop)
      lenis.destroy()
    }
  }, [])
}
