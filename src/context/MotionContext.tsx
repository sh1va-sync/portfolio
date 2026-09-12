import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'

interface MotionContextValue {
  prefersReducedMotion: boolean
  isTouchDevice: boolean
}

const MotionContext = createContext<MotionContextValue>({
  prefersReducedMotion: false,
  isTouchDevice: false,
})

export function MotionProvider({ children }: { children: ReactNode }) {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)
  const [isTouchDevice, setIsTouchDevice] = useState(false)

  useEffect(() => {
    const mqMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
    const mqTouch  = window.matchMedia('(pointer: coarse)')

    setPrefersReducedMotion(mqMotion.matches)
    setIsTouchDevice(mqTouch.matches)

    const motionHandler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches)
    const touchHandler  = (e: MediaQueryListEvent) => setIsTouchDevice(e.matches)

    mqMotion.addEventListener('change', motionHandler)
    mqTouch.addEventListener('change', touchHandler)

    return () => {
      mqMotion.removeEventListener('change', motionHandler)
      mqTouch.removeEventListener('change', touchHandler)
    }
  }, [])

  return (
    <MotionContext.Provider value={{ prefersReducedMotion, isTouchDevice }}>
      {children}
    </MotionContext.Provider>
  )
}

export const useMotionContext = () => useContext(MotionContext)
