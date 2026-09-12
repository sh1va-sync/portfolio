import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { LineReveal } from '../components/LineReveal'
import { MagneticButton } from '../components/MagneticButton'
import { useMotionContext } from '../context/MotionContext'

const LINE_1 = 'Building intelligence'
const LINE_2 = 'into interfaces.'
const SUBHEAD = 'I design and engineer digital experiences that bridge the gap between human intent and machine capability.'

function ChatInterface() {
  const [messages, setMessages] = useState([
    { id: 1, sender: 'ai', text: "Hi, I'm Shiva's AI assistant. I can answer questions about his work, experience, or availability." }
  ])
  const [input, setInput] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return
    
    // Add user message
    const newUserMsg = { id: Date.now(), sender: 'user', text: input }
    setMessages(prev => [...prev, newUserMsg])
    setInput('')
    
    // Simulate AI typing response
    setTimeout(() => {
      setMessages(prev => [
        ...prev, 
        { id: Date.now() + 1, sender: 'ai', text: "I'm just a visual demo right now, but imagine if I were fully hooked up to an LLM!" }
      ])
    }, 1000)
  }

  return (
    <div
      style={{
        width: '100%',
        maxWidth: '440px',
        backgroundColor: 'rgba(255, 255, 255, 0.7)',
        backdropFilter: 'blur(24px) saturate(180%)',
        WebkitBackdropFilter: 'blur(24px) saturate(180%)',
        border: '1px solid rgba(255,255,255,0.9)',
        borderRadius: '24px',
        boxShadow: '0 32px 64px -16px rgba(8,8,24,0.08), 0 4px 12px -4px rgba(8,8,24,0.04)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        height: '480px',
      }}
    >
      {/* Header */}
      <div style={{ padding: '20px 24px', borderBottom: '1px solid rgba(8,8,24,0.06)', display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--accent)' }} />
        <span style={{ fontFamily: 'var(--font-ui)', fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)' }}>
          AI Assistant
        </span>
      </div>

      {/* Message Area */}
      <div style={{ flex: 1, padding: '24px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <AnimatePresence initial={false}>
          {messages.map(msg => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              style={{
                alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                maxWidth: '85%',
                padding: '12px 16px',
                borderRadius: '16px',
                borderBottomLeftRadius: msg.sender === 'ai' ? '4px' : '16px',
                borderBottomRightRadius: msg.sender === 'user' ? '4px' : '16px',
                backgroundColor: msg.sender === 'user' ? 'var(--accent)' : 'rgba(8,8,24,0.04)',
                color: msg.sender === 'user' ? '#fff' : 'var(--text-primary)',
                fontFamily: 'var(--font-ui)',
                fontSize: '14.5px',
                lineHeight: 1.5,
              }}
            >
              {msg.text}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Input Area */}
      <form onSubmit={handleSubmit} style={{ padding: '16px 24px', borderTop: '1px solid rgba(8,8,24,0.06)', display: 'flex', gap: '12px' }}>
        <input
          type="text"
          placeholder="Ask me anything..."
          value={input}
          onChange={e => setInput(e.target.value)}
          style={{
            flex: 1,
            backgroundColor: 'transparent',
            border: 'none',
            outline: 'none',
            fontFamily: 'var(--font-ui)',
            fontSize: '15px',
            color: 'var(--text-primary)',
          }}
        />
        <button
          type="submit"
          style={{
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            backgroundColor: 'var(--text-primary)',
            color: '#fff',
            border: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            opacity: input.trim() ? 1 : 0.4,
            transition: 'opacity 0.2s',
          }}
        >
          ↑
        </button>
      </form>
    </div>
  )
}

export function Hero() {
  const { prefersReducedMotion } = useMotionContext()

  return (
    <section
      id="hero"
      aria-label="Hero"
      style={{
        position: 'relative',
        minHeight: '100svh',
        display: 'flex',
        alignItems: 'center',
        padding: '120px 40px',
      }}
    >
      <div 
        style={{ 
          maxWidth: '1300px', 
          width: '100%', 
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
          gap: '80px',
          alignItems: 'center',
        }}
      >
        
        {/* Left Side: Copy */}
        <div style={{ position: 'relative', zIndex: 1, textAlign: 'left' }}>
          
          <h1
            style={{
              fontFamily: 'var(--font-display)',
              fontVariationSettings: '"opsz" 144',
              fontWeight: 560,
              fontSize: 'clamp(3.5rem, 7vw, 6.5rem)',
              lineHeight: 0.95,
              letterSpacing: '-0.03em',
              color: 'var(--text-primary)',
              marginBottom: '2rem',
            }}
          >
            {prefersReducedMotion ? (
              <>
                <div>{LINE_1}</div>
                <div className="gradient-text">{LINE_2}</div>
              </>
            ) : (
              <>
                <LineReveal delay={0.2}>{LINE_1}</LineReveal>
                <LineReveal delay={0.35}>
                  <span className="gradient-text">{LINE_2}</span>
                </LineReveal>
              </>
            )}
          </h1>

          <motion.p
            initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.6 }}
            style={{
              fontFamily: 'var(--font-ui)',
              fontSize: 'clamp(17px, 2vw, 22px)',
              fontWeight: 400,
              lineHeight: 1.5,
              color: 'var(--text-muted)',
              maxWidth: '46ch',
              marginBottom: '48px',
            }}
          >
            {SUBHEAD}
          </motion.p>

          <motion.div
            initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.6 }}
            style={{ display: 'flex', gap: '16px' }}
          >
            <MagneticButton href="/work" variant="primary">
              View selected work
            </MagneticButton>
            <MagneticButton href="/contact" variant="outline">
              Get in touch
            </MagneticButton>
          </motion.div>
        </div>

        {/* Right Side: Chat UI */}
        <motion.div
          initial={prefersReducedMotion ? {} : { opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          style={{ display: 'flex', justifyContent: 'center' }}
        >
          <ChatInterface />
        </motion.div>

      </div>
    </section>
  )
}
