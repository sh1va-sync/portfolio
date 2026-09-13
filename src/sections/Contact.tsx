import { type FormEvent, useState } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'
import { LineReveal } from '../components/LineReveal'
import { useMotionContext } from '../context/MotionContext'

const LINKS = [
  { id: 'link-github', label: 'github', href: 'https://github.com/sh1va-sync' },
  { id: 'link-linkedin', label: 'linkedin', href: 'https://www.linkedin.com/' },
  { id: 'link-instagram', label: 'instagram', href: 'https://www.instagram.com/' },
] as const

export function Contact() {
  const { prefersReducedMotion } = useMotionContext()
  const [submitted, setSubmitted] = useState(false)
  const pointerX = useMotionValue(0)
  const pointerY = useMotionValue(0)
  const springX = useSpring(pointerX, { stiffness: 180, damping: 24 })
  const springY = useSpring(pointerY, { stiffness: 180, damping: 24 })

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setSubmitted(true)
    event.currentTarget.reset()
  }

  const handlePointerMove = (event: React.PointerEvent<HTMLFormElement>) => {
    if (prefersReducedMotion) return
    const bounds = event.currentTarget.getBoundingClientRect()
    pointerX.set((event.clientX - bounds.left - bounds.width / 2) * 0.08)
    pointerY.set((event.clientY - bounds.top - bounds.height / 2) * 0.08)
  }

  const resetPointer = () => {
    pointerX.set(0)
    pointerY.set(0)
  }

  return (
    <footer id="contact" className="section-padding contact-page">
      <div className="contact-container">
        <div className="contact-heading">
          {prefersReducedMotion ? (
            <h2>Let&apos;s talk</h2>
          ) : (
            <LineReveal><h2>Let&apos;s talk</h2></LineReveal>
          )}
        </div>

        <div className="contact-layout">
          <motion.form
            className="contact-form"
            onSubmit={handleSubmit}
            onPointerMove={handlePointerMove}
            onPointerLeave={resetPointer}
            style={{ x: springX, y: springY }}
          >
            <div className="contact-form-glow" aria-hidden="true" />
            <div className="contact-form-heading">
              <span>01 / Say hello</span>
              <strong>{submitted ? 'Message received.' : 'Tell me about your idea.'}</strong>
            </div>
            <label>
              Your name
              <input name="name" type="text" placeholder="What should I call you?" required />
            </label>
            <label>
              Your email
              <input name="email" type="email" placeholder="you@company.com" required />
            </label>
            <label>
              Your message
              <textarea name="message" rows={4} placeholder="A little context goes a long way..." required />
            </label>
            <button type="submit" className="contact-submit">
              <span>{submitted ? 'Send another message' : 'Send message'}</span>
              <span aria-hidden="true">↗</span>
            </button>
            <p className="contact-form-note">
              {submitted ? 'Thanks for reaching out. I will get back to you soon.' : 'No pitch deck required. Just bring a good question.'}
            </p>
          </motion.form>

          <nav className="contact-socials" aria-label="Social links">
            <span className="contact-socials-label">02 / Find me online</span>
            <div>
              {LINKS.map((link, index) => (
                <motion.a
                  key={link.id}
                  href={link.href}
                  target="_blank"
                  rel="noreferrer"
                  data-cursor="hover"
                  initial={prefersReducedMotion ? false : { opacity: 0, x: -18 }}
                  whileInView={prefersReducedMotion ? undefined : { opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{ delay: index * 0.08, duration: 0.5 }}
                  whileHover={prefersReducedMotion ? undefined : { x: 12 }}
                >
                  <span>{link.label}</span>
                  <span aria-hidden="true">↗</span>
                </motion.a>
              ))}
            </div>
          </nav>
        </div>
      </div>
    </footer>
  )
}
