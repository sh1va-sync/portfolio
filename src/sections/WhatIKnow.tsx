import { useEffect, useRef } from 'react'
import { motion, useMotionValue, useAnimationFrame } from 'framer-motion'
import { LineReveal } from '../components/LineReveal'
import { useScrollReveal } from '../hooks/useScrollReveal'
import { useMotionContext } from '../context/MotionContext'
import { 
  SiReact, SiTypescript, SiTailwindcss, SiFramer, SiNextdotjs,
  SiNodedotjs, SiPython, SiPostgresql, SiRedis,
  SiGit, SiDocker, SiVite
} from 'react-icons/si'
import { FaAws } from 'react-icons/fa'

const SKILLS = [
  { name: 'React',         Icon: SiReact,       color: '#61DAFB' },
  { name: 'TypeScript',    Icon: SiTypescript,  color: '#3178C6' },
  { name: 'Next.js',       Icon: SiNextdotjs,   color: '#000000' },
  { name: 'Framer',        Icon: SiFramer,      color: '#0055FF' },
  { name: 'Tailwind',      Icon: SiTailwindcss, color: '#06B6D4' },
  { name: 'Node.js',       Icon: SiNodedotjs,   color: '#339933' },
  { name: 'Python',        Icon: SiPython,      color: '#3776AB' },
  { name: 'PostgreSQL',    Icon: SiPostgresql,  color: '#4169E1' },
  { name: 'Redis',         Icon: SiRedis,       color: '#DC382D' },
  { name: 'Docker',        Icon: SiDocker,      color: '#2496ED' },
  { name: 'AWS',           Icon: FaAws,         color: '#232F3E' },
  { name: 'Vite',          Icon: SiVite,        color: '#646CFF' },
  { name: 'Git',           Icon: SiGit,         color: '#F05032' },
]

function SkillPill({ skill, index, total, reduced, isHovered }: { skill: typeof SKILLS[number], index: number, total: number, reduced: boolean, isHovered: React.MutableRefObject<boolean> }) {
  const left = useMotionValue('50%')
  const top = useMotionValue('50%')
  const scale = useMotionValue(1)
  const zIndex = useMotionValue(10)
  const opacity = useMotionValue(1)

  const elapsed = useRef(0)
  const lastTime = useRef(0)

  // 3D Moving Infinity (Lissajous figure-8)
  useAnimationFrame((time) => {
    if (reduced) return
    const delta = time - (lastTime.current || time)
    lastTime.current = time

    // Normal speed is much slower now, and it drops to 10% speed if the container is hovered
    elapsed.current += isHovered.current ? delta * 0.1 : delta

    const speed = 0.00015 // Slower, more relaxed premium speed
    const offset = (index / total) * Math.PI * 2
    const t = (elapsed.current * speed) + offset

    // Parametric equations for a 3D infinity symbol
    const x = Math.cos(t)         
    const y = Math.sin(2 * t)     
    const z = Math.sin(t)         

    left.set(`${50 + x * 38}%`)   
    top.set(`${50 + y * 28}%`)    
    scale.set(1 + z * 0.3)        
    opacity.set(0.4 + ((z + 1) / 2) * 0.6) 
    zIndex.set(Math.round(z * 100) + 100)  
  })

  // Fallback for reduced motion (static ellipse)
  useEffect(() => {
    if (reduced) {
      const angle = (index / total) * Math.PI * 2
      left.set(`${50 + 38 * Math.cos(angle)}%`)
      top.set(`${50 + 28 * Math.sin(angle)}%`)
    }
  }, [reduced, index, total])

  return (
    <motion.div
      style={{
        position: 'absolute',
        left,
        top,
        scale,
        opacity,
        zIndex,
      }}
    >
      {/* Centering wrapper so 'left' and 'top' represent the exact center of the pill */}
      <div style={{ transform: 'translate(-50%, -50%)' }}>
        
        {/* The actual draggable pill */}
        <motion.div
          drag={!reduced}
          dragSnapToOrigin={true}
          dragElastic={0.2}
          dragTransition={{ bounceStiffness: 400, bounceDamping: 15 }}
          initial={reduced ? { opacity: 1 } : { scale: 0 }}
          animate={reduced ? { opacity: 1 } : { scale: 1 }}
          transition={{ type: 'spring', delay: index * 0.05 }}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '12px 24px',
            backgroundColor: 'rgba(255, 255, 255, 0.7)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            border: '1px solid rgba(255,255,255,0.9)',
            borderRadius: '999px',
            boxShadow: '0 8px 32px -8px rgba(8,8,24,0.1)',
            cursor: reduced ? 'default' : 'grab',
          }}
          whileHover={reduced ? {} : { 
            scale: 1.1, 
            boxShadow: `0 12px 40px -10px ${skill.color}50`,
            border: `1px solid ${skill.color}70`
          }}
          whileTap={reduced ? {} : { scale: 0.95, cursor: 'grabbing' }}
        >
          <div style={{ color: skill.color, fontSize: '24px', display: 'flex' }}>
            <skill.Icon />
          </div>
          <span style={{ fontFamily: 'var(--font-ui)', fontSize: '15px', fontWeight: 600, color: 'var(--text-primary)', userSelect: 'none', whiteSpace: 'nowrap' }}>
            {skill.name}
          </span>
        </motion.div>
      </div>
    </motion.div>
  )
}

export function WhatIKnow() {
  const { ref } = useScrollReveal()
  const { prefersReducedMotion } = useMotionContext()
  const isHovered = useRef(false)

  return (
    <section
      id="what-i-know"
      className="section-padding"
      style={{ textAlign: 'center', overflow: 'hidden' }}
    >
      <div ref={ref as React.RefObject<HTMLDivElement>} style={{ maxWidth: '1200px', margin: '0 auto' }}>
        
        {prefersReducedMotion ? (
          <h2 style={{ fontSize: 'clamp(34px, 5vw, 56px)', fontFamily: 'var(--font-display)', marginBottom: '40px', fontWeight: 500, letterSpacing: '-0.02em' }}>Tech stack</h2>
        ) : (
          <LineReveal>
            <h2 style={{ fontSize: 'clamp(34px, 5vw, 56px)', fontFamily: 'var(--font-display)', marginBottom: '40px', fontWeight: 500, letterSpacing: '-0.02em' }}>
              Tech stack
            </h2>
          </LineReveal>
        )}
        
        <p style={{ fontFamily: 'var(--font-ui)', color: 'var(--text-muted)', marginBottom: '64px' }}>
          Grab and throw the skills around.
        </p>

        {/* Floating Constellation Container */}
        <div
          onMouseEnter={() => (isHovered.current = true)}
          onMouseLeave={() => (isHovered.current = false)}
          style={{
            position: 'relative',
            width: '100%',
            height: '600px',
            margin: '0 auto',
          }}
        >
          {SKILLS.map((skill, index) => (
            <SkillPill 
              key={skill.name} 
              skill={skill} 
              index={index} 
              total={SKILLS.length} 
              reduced={prefersReducedMotion} 
              isHovered={isHovered}
            />
          ))}
        </div>
      </div>
    </section>
  )
}


