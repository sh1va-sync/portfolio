import { type FormEvent, useState } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'
import { LineReveal } from '../components/LineReveal'
import { useMotionContext } from '../context/MotionContext'

const LINKS = [
  { id: 'link-github', label: 'github', href: 'https://github.com/sh1va-sync' },
  { id: 'link-linkedin', label: 'linkedin', href: 'https://www.linkedin.com/in/shiva-chary-guddoju-867b93290/' },
  { id: 'link-instagram', label: 'instagram', href: 'https://www.instagram.com/shiva_f1111' },
] as const

const CONTACT_EMAIL = 'shivacharyguddoju@gmail.com'

type FormSubmitResponse = {
  success?: boolean | string
  message?: string
}

export function Contact() {
  const { prefersReducedMotion } = useMotionContext()
  const [submitted, setSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const pointerX = useMotionValue(0)
  const pointerY = useMotionValue(0)
  const springX = useSpring(pointerX, { stiffness: 180, damping: 24 })
  const springY = useSpring(pointerY, { stiffness: 180, damping: 24 })

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const form = event.currentTarget
    setIsSubmitting(true)
    setSubmitted(false)
    setSubmitError(null)

    const formData = new FormData(form)
    const payload = Object.fromEntries(formData.entries())
    payload._subject = 'New message from your portfolio'

    try {
      const response = await fetch(`https://formsubmit.co/ajax/${CONTACT_EMAIL}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(payload),
      })
      let result: FormSubmitResponse
      try {
        result = await response.json() as FormSubmitResponse
      } catch {
        throw new Error('The email service returned an invalid response. Please try again.')
      }

      if (!response.ok || !result.success) {
        throw new Error(result.message || 'Your message could not be sent. Please try again.')
      }

      setSubmitted(true)
      form.reset()
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'Your message could not be sent. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
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
              <strong>{isSubmitting ? 'Sending your message...' : submitted ? 'Message received.' : 'Tell me about your idea.'}</strong>
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
            <button type="submit" className="contact-submit" disabled={isSubmitting}>
              <span>{isSubmitting ? 'Sending...' : submitted ? 'Send another message' : 'Send message'}</span>
              <span aria-hidden="true">↗</span>
            </button>
            <p className="contact-form-note" role={submitError ? 'alert' : 'status'} aria-live="polite">
              {submitError || (submitted ? 'Thanks for reaching out. I will get back to you soon.' : 'No pitch deck required. Just bring a good question.')}
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
