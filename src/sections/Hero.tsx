import { useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { LineReveal } from '../components/LineReveal'
import { MagneticButton } from '../components/MagneticButton'
import { useMotionContext } from '../context/MotionContext'

const LINE_1 = 'Hi, I’m Shiva.'
const LINE_2 = 'I build useful intelligence.'
const SUBHEAD = 'I’m a software engineer learning to build end-to-end AI systems that integrate into businesses and make meaningful work move faster.'

function JigglyText({ text, gradient = false, ripple = false }: { text: string, gradient?: boolean, ripple?: boolean }) {
  const characterRefs = useRef<Array<HTMLSpanElement | null>>([])
  const [pointer, setPointer] = useState({ x: -1000, y: -1000 })

  const handlePointerMove = (event: React.PointerEvent<HTMLSpanElement>) => {
    setPointer({ x: event.clientX, y: event.clientY })
  }

  return (
    <span
      onPointerMove={handlePointerMove}
      onPointerLeave={() => setPointer({ x: -1000, y: -1000 })}
      className={gradient ? 'gradient-text' : undefined}
      style={{ display: 'inline' }}
    >
      {Array.from(text).map((character, index) => {
        const bounds = characterRefs.current[index]?.getBoundingClientRect()
        const characterX = bounds ? bounds.left + bounds.width / 2 : -1000
        const characterY = bounds ? bounds.top + bounds.height / 2 : -1000
        const distance = Math.hypot(pointer.x - characterX, pointer.y - characterY)
        const influence = Math.max(0, 1 - distance / 120)

        return (
          <motion.span
            key={`${character}-${index}`}
            ref={(element) => {
              characterRefs.current[index] = element
            }}
            style={{ display: 'inline-block' }}
            animate={{
              rotate: ripple
                ? influence * Math.sin(index * 0.9) * 8
                : influence * (index % 2 === 0 ? -5 : 5),
              skewX: ripple ? influence * Math.cos(index * 0.7) * 3 : 0,
              scaleX: ripple ? 1 + influence * 0.04 : 1,
              color: influence > 0.05 ? 'var(--accent)' : undefined,
            }}
            transition={{ type: 'spring', stiffness: ripple ? 300 : 360, damping: 24, mass: 0.4 }}
          >
            {character === ' ' ? '\u00a0' : character}
          </motion.span>
        )
      })}
    </span>
  )
}

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
                  <JigglyText text={LINE_1} />
                </LineReveal>
                <LineReveal delay={0.35}>
                  <JigglyText text={LINE_2} gradient ripple />
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
