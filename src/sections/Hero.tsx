// import { useRef, useState } from 'react'
// import { AnimatePresence, motion } from 'framer-motion'
// import { LineReveal } from '../components/LineReveal'
// import { MagneticButton } from '../components/MagneticButton'
// import { useMotionContext } from '../context/MotionContext'

// const LINE_1 = 'Hi, I’m Shiva.'
// const LINE_2 = 'I build useful intelligence.'
// const SUBHEAD = 'I’m a software engineer learning to build end-to-end AI systems that integrate into businesses and make meaningful work move faster.'

// function JigglyText({
//   text,
//   gradient = false,
//   spotlight = false,
// }: {
//   text: string
//   gradient?: boolean
//   spotlight?: boolean
// }) {
//   const characterRefs = useRef<Array<HTMLSpanElement | null>>([])
//   const [pointer, setPointer] = useState({ x: -1000, y: -1000 })

//   const handlePointerMove = (event: React.PointerEvent<HTMLSpanElement>) => {
//     setPointer({ x: event.clientX, y: event.clientY })
//   }

//   return (
//     <span
//       onPointerMove={handlePointerMove}
//       onPointerLeave={() => setPointer({ x: -1000, y: -1000 })}
//       className={gradient ? 'gradient-text' : undefined}
//       style={{ display: 'inline' }}
//     >
//       {Array.from(text).map((character, index) => {
//         const bounds = characterRefs.current[index]?.getBoundingClientRect()
//         const characterX = bounds ? bounds.left + bounds.width / 2 : -1000
//         const characterY = bounds ? bounds.top + bounds.height / 2 : -1000
//         const distance = Math.hypot(pointer.x - characterX, pointer.y - characterY)
//         const influence = Math.max(0, 1 - distance / 150)
//         const wave = Math.sin(index * 0.72) * influence
//         const spotlightWave = Math.sin(index * 0.48) * influence

//         return (
//           <motion.span
//             key={`${character}-${index}`}
//             ref={(element) => {
//               characterRefs.current[index] = element
//             }}
//             style={{ display: 'inline-block' }}
//             animate={{
//               y: spotlight ? -influence * 10 : -influence * 7,
//               rotate: spotlight ? spotlightWave * 5 : wave * 4,
//               scale: spotlight ? 1 + influence * 0.05 : 1 + influence * 0.025,
//               filter: `brightness(${1 + influence * (spotlight ? 0.25 : 0.18)}) saturate(${1 + influence * (spotlight ? 0.3 : 0.2)})`,
//               color: spotlight ? undefined : influence > 0.05 ? 'var(--accent)' : undefined,
//               textShadow: spotlight && influence > 0.05
//                 ? `0 0 ${12 + influence * 18}px rgba(37, 99, 235, ${influence * 0.42})`
//                 : '0 0 0 0',
//             }}
//             transition={{ type: 'spring', stiffness: 280, damping: 22, mass: 0.35 }}
//           >
//             {character === ' ' ? '\u00a0' : character}
//           </motion.span>
//         )
//       })}
//     </span>
//   )
// }

// function AgentChatPreview() {
//   const [input, setInput] = useState('')
//   const [messages, setMessages] = useState([
//     { id: 1, sender: 'agent', text: 'Hi, I’m Shiva’s AI agent. Ask me about his work, skills, or what he is building next.' },
//   ])
//   const suggestions = ['What does Shiva build?', 'Tell me about his AI work']

//   const sendMessage = (text = input) => {
//     const trimmed = text.trim()
//     if (!trimmed) return
//     setMessages((current) => [
//       ...current,
//       { id: Date.now(), sender: 'visitor', text: trimmed },
//       { id: Date.now() + 1, sender: 'agent', text: 'I’m being connected soon. For now, explore the work and see what Shiva is learning.' },
//     ])
//     setInput('')
//   }

//   return (
//     <div className="agent-chat-preview">
//       <div className="agent-chat-header">
//         <div className="agent-chat-identity">
//           <span className="ai-live-dot" />
//           <div><strong>Shiva’s agent</strong><span>Here to help</span></div>
//         </div>
//         <span className="agent-chat-status">Preview</span>
//       </div>

//       <div className="agent-chat-messages" aria-live="polite">
//         <AnimatePresence initial={false}>
//           {messages.map((message) => (
//             <motion.div
//               key={message.id}
//               className={`agent-chat-message ${message.sender}`}
//               initial={{ opacity: 0, y: 8, scale: 0.96 }}
//               animate={{ opacity: 1, y: 0, scale: 1 }}
//             >
//               {message.text}
//             </motion.div>
//           ))}
//         </AnimatePresence>
//       </div>

//       <div className="agent-chat-suggestions">
//         {suggestions.map((suggestion) => (
//           <button key={suggestion} type="button" onClick={() => sendMessage(suggestion)} data-cursor="hover">
//             {suggestion}
//           </button>
//         ))}
//       </div>

//       <form className="agent-chat-form" onSubmit={(event) => { event.preventDefault(); sendMessage() }}>
//         <input value={input} onChange={(event) => setInput(event.target.value)} placeholder="Ask about Shiva..." aria-label="Ask Shiva’s AI agent" />
//         <button type="submit" aria-label="Send message" disabled={!input.trim()} data-cursor="hover">↗</button>
//       </form>
//       <div className="agent-chat-footer"><span>AI agent interface / coming soon</span><span>↗</span></div>
//     </div>
//   )
// }

// export function Hero() {
//   const { prefersReducedMotion } = useMotionContext()

//   return (
//     <section id="hero" aria-label="Hero" className="hero-section">
//       <div className="hero-grid">
//         <div className="hero-copy">
//           <h1>
//             {prefersReducedMotion ? (
//               <>
//                 <span>{LINE_1}</span>
//                 <span className="gradient-text">{LINE_2}</span>
//               </>
//             ) : (
//               <>
//                 <LineReveal delay={0.2}>
//                   <JigglyText text={LINE_1} />
//                 </LineReveal>
//                 <LineReveal delay={0.35}>
//                   <JigglyText text={LINE_2} gradient spotlight />
//                 </LineReveal>
//               </>
//             )}
//           </h1>

//           <motion.p
//             initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ delay: 0.7, duration: 0.6 }}
//             className="hero-subhead"
//           >
//             {SUBHEAD}
//           </motion.p>

//           <motion.div
//             initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ delay: 0.9, duration: 0.6 }}
//             className="hero-actions"
//           >
//             <MagneticButton href="/work" variant="primary">
//               See what I make <span aria-hidden="true">↗</span>
//             </MagneticButton>
//             <MagneticButton href="/contact" variant="outline">
//               Start a conversation <span aria-hidden="true">✦</span>
//             </MagneticButton>
//           </motion.div>
//         </div>

//         <motion.div
//           initial={prefersReducedMotion ? {} : { opacity: 0, scale: 0.95, y: 20 }}
//           animate={{ opacity: 1, scale: 1, y: 0 }}
//           transition={{ delay: 0.6, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
//           className="hero-visual"
//         >
//           <AgentChatPreview />
//         </motion.div>
//       </div>
//     </section>
//   )
// }


import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { LineReveal } from '../components/LineReveal'
import { MagneticButton } from '../components/MagneticButton'
import { useMotionContext } from '../context/MotionContext'

const LINE_1 = 'Hi, I’m Shiva.'
const LINE_2 = 'I build useful intelligence.'
const SUBHEAD = 'I’m a software engineer learning to build end-to-end AI systems that integrate into businesses and make meaningful work move faster.'

/* ------------------------------------------------------------------ */
/*  Line 1: letters physically dodge the cursor, then spring back     */
/* ------------------------------------------------------------------ */

function RepelText({ text }: { text: string }) {
  const containerRef = useRef<HTMLSpanElement | null>(null)
  const charRefs = useRef<Array<HTMLSpanElement | null>>([])
  const [pointer, setPointer] = useState({ x: -1000, y: -1000 })

  const handlePointerMove = (event: React.PointerEvent<HTMLSpanElement>) => {
    setPointer({ x: event.clientX, y: event.clientY })
  }
  const handlePointerLeave = () => setPointer({ x: -1000, y: -1000 })

  return (
    <span
      ref={containerRef}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      style={{ display: 'inline-block' }}
    >
      {Array.from(text).map((character, index) => {
        const bounds = charRefs.current[index]?.getBoundingClientRect()
        const cx = bounds ? bounds.left + bounds.width / 2 : -1000
        const cy = bounds ? bounds.top + bounds.height / 2 : -1000
        const dx = cx - pointer.x
        const dy = cy - pointer.y
        const distance = Math.hypot(dx, dy)
        const radius = 90
        const influence = Math.max(0, 1 - distance / radius)
        // push directly away from the pointer, stronger the closer it is
        const angle = Math.atan2(dy, dx)
        const pushX = Math.cos(angle) * influence * 26
        const pushY = Math.sin(angle) * influence * 26

        return (
          <motion.span
            key={`${character}-${index}`}
            ref={(el) => {
              charRefs.current[index] = el
            }}
            style={{ display: 'inline-block' }}
            animate={{
              x: pushX,
              y: pushY,
              rotate: influence * (index % 2 === 0 ? 10 : -10),
              scale: 1 - influence * 0.12,
              color: influence > 0.4 ? 'var(--accent)' : undefined,
            }}
            transition={{ type: 'spring', stiffness: 420, damping: 18, mass: 0.4 }}
          >
            {character === ' ' ? '\u00a0' : character}
          </motion.span>
        )
      })}
    </span>
  )
}

/* ------------------------------------------------------------------ */
/*  Line 2: 3D flip-card letters + whole-line tilt toward the cursor  */
/* ------------------------------------------------------------------ */

function FlipChar({
  character,
  influence,
}: {
  character: string
  influence: number
}) {
  // 0 -> 1 maps to a 0deg -> 180deg flip, front face shows the normal
  // character, back face shows a bold accent-colored version.
  const rotation = influence * 180

  return (
    <span
      style={{
        display: 'inline-block',
        perspective: 400,
      }}
    >
      <motion.span
        style={{
          display: 'inline-block',
          position: 'relative',
          transformStyle: 'preserve-3d',
        }}
        animate={{ rotateY: rotation, y: -influence * 6, scale: 1 + influence * 0.08 }}
        transition={{ type: 'spring', stiffness: 260, damping: 22, mass: 0.4 }}
      >
        <span
          style={{
            display: 'inline-block',
            backfaceVisibility: 'hidden',
          }}
        >
          {character === ' ' ? '\u00a0' : character}
        </span>
        <span
          aria-hidden="true"
          style={{
            display: 'inline-block',
            position: 'absolute',
            inset: 0,
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
            color: 'var(--accent)',
            fontWeight: 700,
            textShadow: `0 0 ${10 + influence * 14}px rgba(37, 99, 235, ${influence * 0.6})`,
          }}
        >
          {character === ' ' ? '\u00a0' : character}
        </span>
      </motion.span>
    </span>
  )
}

function FlipTiltText({ text }: { text: string }) {
  const containerRef = useRef<HTMLSpanElement | null>(null)
  const charRefs = useRef<Array<HTMLSpanElement | null>>([])
  const [pointer, setPointer] = useState({ x: -1000, y: -1000 })
  const [influences, setInfluences] = useState<number[]>(() => Array.from(text).map(() => 0))
  const [tilt, setTilt] = useState({ x: 0, y: 0 })

  const handlePointerMove = (event: React.PointerEvent<HTMLSpanElement>) => {
    setPointer({ x: event.clientX, y: event.clientY })

    const bounds = containerRef.current?.getBoundingClientRect()
    if (bounds) {
      const relX = (event.clientX - bounds.left) / bounds.width - 0.5
      const relY = (event.clientY - bounds.top) / bounds.height - 0.5
      setTilt({ x: relY * -10, y: relX * 10 })
    }
  }

  const handlePointerLeave = () => {
    setPointer({ x: -1000, y: -1000 })
    setTilt({ x: 0, y: 0 })
  }

  useEffect(() => {
    const next = Array.from(text).map((_, index) => {
      const bounds = charRefs.current[index]?.getBoundingClientRect()
      if (!bounds) return 0
      const cx = bounds.left + bounds.width / 2
      const cy = bounds.top + bounds.height / 2
      const distance = Math.hypot(cx - pointer.x, cy - pointer.y)
      return Math.max(0, 1 - distance / 100)
    })
    setInfluences(next)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pointer, text])

  return (
    <motion.span
      ref={containerRef}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      className="gradient-text"
      style={{ display: 'inline-block', transformStyle: 'preserve-3d' }}
      animate={{ rotateX: tilt.x, rotateY: tilt.y }}
      transition={{ type: 'spring', stiffness: 150, damping: 20 }}
    >
      {Array.from(text).map((character, index) => (
        <span
          key={`${character}-${index}`}
          ref={(el) => {
            charRefs.current[index] = el
          }}
          style={{ display: 'inline-block' }}
        >
          <FlipChar character={character} influence={influences[index] ?? 0} />
        </span>
      ))}
    </motion.span>
  )
}

/* ------------------------------------------------------------------ */

function AgentChatPreview() {
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState([
    { id: 1, sender: 'agent', text: 'Hi, I’m Shiva’s AI agent. Ask me about his work, skills, or what he is building next.' },
  ])
  const suggestions = ['What does Shiva build?', 'Tell me about his AI work']

  const sendMessage = (text = input) => {
    const trimmed = text.trim()
    if (!trimmed) return
    setMessages((current) => [
      ...current,
      { id: Date.now(), sender: 'visitor', text: trimmed },
      { id: Date.now() + 1, sender: 'agent', text: 'I’m being connected soon. For now, explore the work and see what Shiva is learning.' },
    ])
    setInput('')
  }

  return (
    <div className="agent-chat-preview">
      <div className="agent-chat-header">
        <div className="agent-chat-identity">
          <span className="ai-live-dot" />
          <div><strong>Shiva’s agent</strong><span>Here to help</span></div>
        </div>
        <span className="agent-chat-status">Preview</span>
      </div>

      <div className="agent-chat-messages" aria-live="polite">
        <AnimatePresence initial={false}>
          {messages.map((message) => (
            <motion.div
              key={message.id}
              className={`agent-chat-message ${message.sender}`}
              initial={{ opacity: 0, y: 8, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
            >
              {message.text}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <div className="agent-chat-suggestions">
        {suggestions.map((suggestion) => (
          <button key={suggestion} type="button" onClick={() => sendMessage(suggestion)} data-cursor="hover">
            {suggestion}
          </button>
        ))}
      </div>

      <form className="agent-chat-form" onSubmit={(event) => { event.preventDefault(); sendMessage() }}>
        <input value={input} onChange={(event) => setInput(event.target.value)} placeholder="Ask about Shiva..." aria-label="Ask Shiva’s AI agent" />
        <button type="submit" aria-label="Send message" disabled={!input.trim()} data-cursor="hover">↗</button>
      </form>
      <div className="agent-chat-footer"><span>AI agent interface / coming soon</span><span>↗</span></div>
    </div>
  )
}

export function Hero() {
  const { prefersReducedMotion } = useMotionContext()

  return (
    <section id="hero" aria-label="Hero" className="hero-section">
      <div className="hero-grid">
        <div className="hero-copy">
          <h1>
            {prefersReducedMotion ? (
              <>
                <span>{LINE_1}</span>
                <span className="gradient-text">{LINE_2}</span>
              </>
            ) : (
              <>
                <LineReveal delay={0.2}>
                  <RepelText text={LINE_1} />
                </LineReveal>
                <LineReveal delay={0.35}>
                  <FlipTiltText text={LINE_2} />
                </LineReveal>
              </>
            )}
          </h1>

          <motion.p
            initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.6 }}
            className="hero-subhead"
          >
            {SUBHEAD}
          </motion.p>

          <motion.div
            initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.6 }}
            className="hero-actions"
          >
            <MagneticButton href="/work" variant="primary">
              See what I make <span aria-hidden="true">↗</span>
            </MagneticButton>
            <MagneticButton href="/contact" variant="outline">
              Start a conversation <span aria-hidden="true">✦</span>
            </MagneticButton>
          </motion.div>
        </div>

        <motion.div
          initial={prefersReducedMotion ? {} : { opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="hero-visual"
        >
          <AgentChatPreview />
        </motion.div>
      </div>
    </section>
  )
}