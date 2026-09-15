import { useEffect, useState, type CSSProperties } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useMotionContext } from '../context/MotionContext'

type ChatMessage = {
  id: number
  sender: 'agent' | 'visitor'
  text: string
}

const SUGGESTIONS = [
  'What does Shiva build?',
  'Tell me about his AI work',
  'How does he think?',
]

const RESPONSES = [
  'I build useful interfaces and the AI systems behind them — from thoughtful product surfaces to agentic workflows.',
  'Right now I am learning the full AI stack: GenAI, retrieval, orchestration, and agents that can move work forward.',
  'I start with the real constraint, make the idea tangible, then iterate until the useful thing becomes obvious.',
]

function Typewriter({ text, reducedMotion }: { text: string; reducedMotion: boolean }) {
  const [visibleText, setVisibleText] = useState(reducedMotion ? text : '')

  useEffect(() => {
    if (reducedMotion) {
      setVisibleText(text)
      return
    }

    setVisibleText('')
    let index = 0
    const interval = window.setInterval(() => {
      index += 1
      setVisibleText(text.slice(0, index))
      if (index >= text.length) window.clearInterval(interval)
    }, 14)

    return () => window.clearInterval(interval)
  }, [reducedMotion, text])

  return <>{visibleText}<span className="agent-chat-caret" aria-hidden="true" /></>
}

function AgentChatPreview() {
  const { prefersReducedMotion } = useMotionContext()
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [pointer, setPointer] = useState({ x: 0, y: 0 })

  const sendMessage = (text = input) => {
    const trimmed = text.trim()
    if (!trimmed) return
    const response = RESPONSES[messages.length % RESPONSES.length]
    setMessages((current) => [
      ...current,
      { id: Date.now(), sender: 'visitor', text: trimmed },
      { id: Date.now() + 1, sender: 'agent', text: response },
    ])
    setInput('')
  }

  return (
    <motion.div
      className="agent-chat-preview"
      onPointerMove={(event) => {
        if (prefersReducedMotion) return
        const bounds = event.currentTarget.getBoundingClientRect()
        setPointer({
          x: ((event.clientX - bounds.left) / bounds.width - 0.5) * 2,
          y: ((event.clientY - bounds.top) / bounds.height - 0.5) * 2,
        })
      }}
      onPointerLeave={() => setPointer({ x: 0, y: 0 })}
      style={{
        rotateX: prefersReducedMotion ? 0 : pointer.y * -2.5,
        rotateY: prefersReducedMotion ? 0 : pointer.x * 3,
        '--agent-pointer-x': `${50 + pointer.x * 12}%`,
        '--agent-pointer-y': `${50 + pointer.y * 12}%`,
      } as CSSProperties}
      initial={prefersReducedMotion ? false : { opacity: 0, scale: 0.88, y: 36, rotateX: 8 }}
      animate={{ opacity: 1, scale: 1, y: 0, rotateX: 0 }}
      transition={{ delay: 0.35, duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="agent-chat-orbit agent-chat-orbit-one" />
      <div className="agent-chat-orbit agent-chat-orbit-two" />
      <div className="agent-chat-header">
        <div className="agent-chat-identity">
          <motion.span
            className="ai-live-dot"
            animate={prefersReducedMotion ? {} : { scale: [1, 1.35, 1], opacity: [1, 0.65, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          <div><strong>Shiva’s AI assistant</strong><span>Ask me anything about the work</span></div>
        </div>
        <span className="agent-chat-status">Online</span>
      </div>

      <div className="agent-chat-messages" aria-live="polite">
        <motion.div
          className="agent-chat-message agent agent-welcome"
          initial={prefersReducedMotion ? false : { opacity: 0, y: 18, clipPath: 'inset(0 100% 0 0 round 16px)' }}
          animate={{ opacity: 1, y: 0, clipPath: 'inset(0 0% 0 0 round 16px)' }}
          transition={{ delay: 1.05, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <span className="agent-message-label">ASSISTANT / 00</span>
          <Typewriter
            text="Hi — I’m Shiva’s AI assistant. Ask me about the work, the thinking, or what I’m building next."
            reducedMotion={prefersReducedMotion}
          />
        </motion.div>
        <AnimatePresence initial={false}>
          {messages.map((message, index) => (
            <motion.div
              key={message.id}
              className={`agent-chat-message ${message.sender}`}
              initial={prefersReducedMotion ? false : { opacity: 0, y: 14, scale: 0.94 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.45, delay: message.sender === 'agent' ? 0.2 : 0 }}
            >
              {message.sender === 'agent' && <span className="agent-message-label">ASSISTANT / {String(index + 1).padStart(2, '0')}</span>}
              {message.sender === 'agent' ? <Typewriter text={message.text} reducedMotion={prefersReducedMotion} /> : message.text}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <div className="agent-chat-suggestions">
        {SUGGESTIONS.map((suggestion, index) => (
          <motion.button
            key={suggestion}
            type="button"
            onClick={() => sendMessage(suggestion)}
            data-cursor="hover"
            initial={prefersReducedMotion ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.3 + index * 0.08 }}
          >
            <span>0{index + 1}</span>{suggestion}
          </motion.button>
        ))}
      </div>

      <form className="agent-chat-form" onSubmit={(event) => { event.preventDefault(); sendMessage() }}>
        <span className="agent-chat-prompt-mark">⌁</span>
        <input value={input} onChange={(event) => setInput(event.target.value)} placeholder="Start a conversation..." aria-label="Ask Shiva’s AI assistant" />
        <button type="submit" aria-label="Send message" disabled={!input.trim()} data-cursor="hover">↗</button>
      </form>
      <div className="agent-chat-footer"><span>Local preview / live agent coming soon</span><span className="agent-chat-footer-line" /></div>
    </motion.div>
  )
}

export function Hero() {
  const nameLetters = 'shiva chary'.split('')

  return (
    <section id="hero" aria-label="Shiva’s AI assistant" className="hero-section agent-hero">
      <div className="hero-visual agent-hero-visual">
        <div className="agent-hero-glow" aria-hidden="true" />
        <div className="agent-hero-name" aria-hidden="true">
          {nameLetters.map((letter, index) => (
            <motion.span
              key={`${letter}-${index}`}
              initial={{ opacity: 0, y: 24, rotate: index % 2 ? 4 : -4 }}
              animate={{ opacity: 1, y: 0, rotate: 0 }}
              transition={{ delay: 0.7 + index * 0.08, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            >
              {letter === ' ' ? '\u00a0' : letter}
            </motion.span>
          ))}
        </div>
        <AgentChatPreview />
      </div>
    </section>
  )
}
