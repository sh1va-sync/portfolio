import { useEffect, useRef, useState, type CSSProperties } from 'react'
import ReactMarkdown from 'react-markdown'
import { AnimatePresence, motion } from 'framer-motion'
import { useMotionContext } from '../context/MotionContext'

type MessageRole = 'user' | 'assistant'

type ChatMessage = {
  id: string
  role: MessageRole
  content: string
  sources?: string[]
  isStreaming?: boolean
}

type HealthState = 'checking' | 'online' | 'offline' | 'degraded'

const API_URL = (import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000').replace(/\/$/, '')
const SESSION_STORAGE_KEY = 'portfolio-agent-chat'

const WELCOME_MESSAGE = "Hey I'm Sync, my boss made me to be his personal assisstant. How can I help?"

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

  return <>{visibleText}</>
}

function readStoredChat(): { conversationId: string | null; messages: ChatMessage[] } {
  try {
    const stored = window.sessionStorage.getItem(SESSION_STORAGE_KEY)
    if (!stored) return { conversationId: null, messages: [] }
    const parsed = JSON.parse(stored) as { conversationId?: unknown; messages?: unknown }
    if (!Array.isArray(parsed.messages)) return { conversationId: null, messages: [] }

    const messages = parsed.messages.filter((message): message is ChatMessage => {
      if (!message || typeof message !== 'object') return false
      const candidate = message as Partial<ChatMessage>
      return typeof candidate.id === 'string'
        && (candidate.role === 'user' || candidate.role === 'assistant')
        && typeof candidate.content === 'string'
        && !candidate.isStreaming
    })

    return {
      conversationId: typeof parsed.conversationId === 'string' ? parsed.conversationId : null,
      messages,
    }
  } catch {
    return { conversationId: null, messages: [] }
  }
}

function MarkdownMessage({ content }: { content: string }) {
  return (
    <div className="agent-markdown">
      <ReactMarkdown
        components={{
          a: ({ href, children }) => (
            <a href={href} target="_blank" rel="noreferrer">{children}</a>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  )
}

function LetterByLetterMessage({
  content,
  reducedMotion,
  onComplete,
}: {
  content: string
  reducedMotion: boolean
  onComplete: () => void
}) {
  const [visibleText, setVisibleText] = useState(reducedMotion ? content : '')

  useEffect(() => {
    if (reducedMotion) {
      setVisibleText(content)
      onComplete()
      return
    }

    let index = 0
    const interval = window.setInterval(() => {
      index += 1
      setVisibleText(content.slice(0, index))
      if (index >= content.length) {
        window.clearInterval(interval)
        onComplete()
      }
    }, 14)

    return () => window.clearInterval(interval)
  }, [content, onComplete, reducedMotion])

  return (
    <MarkdownMessage content={visibleText} />
  )
}

async function getErrorMessage(response: Response, fallback: string) {
  try {
    const data = await response.json() as { detail?: string; message?: string }
    return data.message || data.detail || fallback
  } catch {
    return fallback
  }
}

function createMessage(role: MessageRole, content: string, isStreaming = false): ChatMessage {
  return {
    id: `${role}-${Date.now()}-${Math.random().toString(36).slice(2)}`,
    role,
    content,
    isStreaming,
  }
}

function AgentChatPreview() {
  const { prefersReducedMotion } = useMotionContext()
  const storedChat = useRef(readStoredChat()).current
  const messagesContainerRef = useRef<HTMLDivElement>(null)
  const requestController = useRef<AbortController | null>(null)
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState<ChatMessage[]>(storedChat.messages)
  const [conversationId, setConversationId] = useState<string | null>(storedChat.conversationId)
  const [health, setHealth] = useState<HealthState>('checking')
  const [isSending, setIsSending] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [lastFailedMessage, setLastFailedMessage] = useState<string | null>(null)
  const [pointer, setPointer] = useState({ x: 0, y: 0 })

  useEffect(() => {
    window.sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify({
      conversationId,
      messages: messages.filter((message) => !message.isStreaming),
    }))
  }, [conversationId, messages])

  useEffect(() => {
    const container = messagesContainerRef.current
    if (container) {
      container.scrollTop = container.scrollHeight
    }
  }, [messages, error])

  useEffect(() => {
    const controller = new AbortController()
    fetch(`${API_URL}/api/health`, { signal: controller.signal })
      .then(async (response) => {
        if (!response.ok) throw new Error('Health request failed')
        const data = await response.json() as { status?: string; knowledge_ready?: boolean }
        setHealth(data.status === 'ok' && data.knowledge_ready !== false ? 'online' : 'degraded')
      })
      .catch(() => {
        if (!controller.signal.aborted) setHealth('offline')
      })

    return () => controller.abort()
  }, [])

  useEffect(() => () => requestController.current?.abort(), [])

  const sendMessage = async (text = input) => {
    const trimmed = text.trim()
    if (!trimmed || isSending || health !== 'online') return

    const history = messages.map(({ role, content }) => ({ role, content }))
    const userMessage = createMessage('user', trimmed)
    const assistantMessage = createMessage('assistant', '', true)

    setMessages((current) => [...current, userMessage, assistantMessage])
    setInput('')
    setError(null)
    setLastFailedMessage(null)
    setIsSending(true)

    const controller = new AbortController()
    requestController.current = controller

    try {
      const response = await fetch(`${API_URL}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal,
        body: JSON.stringify({
          conversation_id: conversationId,
          message: trimmed,
          history,
        }),
      })

      if (!response.ok) {
        const fallback = response.status === 429
          ? 'Whoa, slow down a second. Give me a beat, then ask again.'
          : response.status === 502
            ? 'Sync hit a temporary glitch. Try sending that again.'
            : response.status === 422
              ? 'Please check your message and try again.'
              : `Chat request failed (${response.status}).`
        throw new Error(await getErrorMessage(response, fallback))
      }

      const data = await response.json() as {
        conversation_id?: string | null
        message?: string
        sources?: string[]
      }

      const reply = data.message || 'I did not receive a response. Try that again.'
      setConversationId(data.conversation_id ?? conversationId)
      setMessages((current) => current.map((message) =>
        message.id === assistantMessage.id
          ? { ...message, content: reply, sources: data.sources ?? [], isStreaming: true }
          : message
      ))
    } catch (requestError) {
      if (controller.signal.aborted) return
      const message = requestError instanceof Error ? requestError.message : 'Sync hit a temporary glitch. Try sending that again.'
      setMessages((current) => current.filter((item) => item.id !== assistantMessage.id))
      setError(message)
      setLastFailedMessage(trimmed)
    } finally {
      if (requestController.current === controller) requestController.current = null
      setIsSending(false)
    }
  }

  const startNewConversation = () => {
    requestController.current?.abort()
    setConversationId(null)
    setMessages([])
    setInput('')
    setError(null)
    setLastFailedMessage(null)
    setIsSending(false)
  }

  const healthLabel = health === 'online'
    ? 'Online'
    : health === 'checking'
      ? 'Connecting'
      : health === 'degraded'
        ? 'Knowledge offline'
        : 'Offline'
  const canSend = health === 'online' && !isSending

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
          <div><strong>Sync</strong><span>Ask me anything about the my boss</span></div>
        </div>
        <span className={`agent-chat-status agent-chat-status-${health}`}>{healthLabel}</span>
      </div>

      <div
        ref={messagesContainerRef}
        className="agent-chat-messages"
        aria-live="polite"
        data-lenis-prevent
      >
        <motion.div
          className="agent-chat-message agent agent-welcome"
          initial={prefersReducedMotion ? false : { opacity: 0, y: 18, clipPath: 'inset(0 100% 0 0 round 16px)' }}
          animate={{ opacity: 1, y: 0, clipPath: 'inset(0 0% 0 0 round 16px)' }}
          transition={{ delay: 1.05, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <Typewriter text={WELCOME_MESSAGE} reducedMotion={prefersReducedMotion} />
        </motion.div>
        <AnimatePresence initial={false}>
          {messages.map((message) => (
            <motion.div
              key={message.id}
              className={`agent-chat-message ${message.role === 'assistant' ? 'agent' : 'visitor'}`}
              initial={prefersReducedMotion ? false : { opacity: 0, y: 14, scale: 0.94 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.45, delay: message.role === 'assistant' ? 0.2 : 0 }}
            >
              {message.role === 'assistant'
                ? message.isStreaming && !message.content
                  ? <span className="agent-chat-typing" aria-label="Assistant is typing"><i /><i /><i /></span>
                  : message.isStreaming
                    ? (
                      <LetterByLetterMessage
                        content={message.content}
                        reducedMotion={prefersReducedMotion}
                        onComplete={() => {
                          setMessages((current) => current.map((item) => (
                            item.id === message.id ? { ...item, isStreaming: false } : item
                          )))
                        }}
                      />
                    )
                    : <MarkdownMessage content={message.content} />
                : message.content}
            </motion.div>
          ))}
        </AnimatePresence>
        {health === 'offline' && (
          <div className="agent-chat-connection-note" role="status">
            Sync is offline right now. Start the backend and refresh to continue.
          </div>
        )}
        {health === 'degraded' && (
          <div className="agent-chat-connection-note" role="status">
            Sync is connected, but its knowledge base is still warming up.
          </div>
        )}
        {error && (
          <div className="agent-chat-error" role="alert">
            <span>{error}</span>
            {lastFailedMessage && <button type="button" onClick={() => sendMessage(lastFailedMessage)} disabled={!canSend}>Retry</button>}
          </div>
        )}
      </div>

      <form className="agent-chat-form" onSubmit={(event) => { event.preventDefault(); void sendMessage() }}>
        <span className="agent-chat-prompt-mark">⌁</span>
        <input
          value={input}
          onChange={(event) => setInput(event.target.value)}
          placeholder={health === 'online' ? 'Start a conversation...' : 'Sync is not connected yet'}
          aria-label="Ask Shiva’s AI assistant"
          disabled={!canSend}
        />
        <button type="submit" aria-label="Send message" disabled={!input.trim() || !canSend} data-cursor="hover">↗</button>
      </form>
      <div className="agent-chat-footer">
        <span>{isSending ? 'Sync / thinking...' : conversationId ? 'Conversation saved for this session' : 'Powered by Sync'}</span>
        <div className="agent-chat-footer-actions">
          {messages.length > 0 && <button type="button" onClick={startNewConversation}>New conversation</button>}
          <span className="agent-chat-footer-line" />
        </div>
      </div>
    </motion.div>
  )
}

export function Hero() {
  return (
    <section id="hero" aria-label="Shiva’s AI assistant" className="hero-section agent-hero">
      <div className="hero-visual agent-hero-visual">
        <div className="agent-hero-glow" aria-hidden="true" />
        <AgentChatPreview />
      </div>
    </section>
  )
}
