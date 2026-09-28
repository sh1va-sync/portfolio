import { useEffect, useRef, useState } from 'react'
import { ArrowDown, ArrowUpRight, MoveUpRight } from 'lucide-react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { Link } from 'react-router-dom'
import { useMotionContext } from '../context/MotionContext'
import './personal.css'

const MOMENTS = [
  {
    number: '01',
    title: 'Chasing the light',
    note: 'The in-between is usually the interesting part.',
    image:
      'https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?auto=format&fit=crop&w=1200&q=85',
    alt: 'Golden evening light settling over a quiet landscape',
    className: 'personal-moment-tall',
  },
  {
    number: '02',
    title: 'A change of pace',
    note: 'A little distance makes room for new perspective.',
    image:
      'https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=1200&q=85',
    alt: 'Still water and mountains beneath a soft, cloudy sky',
    className: 'personal-moment-wide',
  },
  {
    number: '03',
    title: 'Collecting details',
    note: 'Color, texture, and the small things you almost miss.',
    image:
      'https://images.unsplash.com/photo-1490750967868-88aa4486c946?auto=format&fit=crop&w=1200&q=85',
    alt: 'A close-up of soft-colored flowers in afternoon light',
    className: 'personal-moment-short',
  },
]

const REVEAL = {
  hidden: { opacity: 0, y: 36 },
  visible: { opacity: 1, y: 0 },
}

export function PersonalPage() {
  const heroRef = useRef<HTMLElement>(null)
  const returnRef = useRef<HTMLElement>(null)
  const [isReturnRevealed, setIsReturnRevealed] = useState(false)
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  })
  const imageY = useTransform(scrollYProgress, [0, 1], ['0%', '18%'])
  const portraitY = useTransform(scrollYProgress, [0, 1], ['0%', '16%'])
  const quoteY = useTransform(scrollYProgress, [0, 1], ['0%', '10%'])
  const contentY = useTransform(scrollYProgress, [0, 1], ['0%', '-22%'])
  const contentOpacity = useTransform(scrollYProgress, [0, 0.72], [1, 0])
  const { prefersReducedMotion } = useMotionContext()

  useEffect(() => {
    const returnElement = returnRef.current
    if (!returnElement) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        setIsReturnRevealed(true)
        observer.disconnect()
      },
      { threshold: 0.15 }
    )

    observer.observe(returnElement)
    return () => observer.disconnect()
  }, [])

  return (
    <div className="personal-page">
      <section className="personal-hero" ref={heroRef}>
        <motion.div
          className="personal-hero-background"
          style={{ y: prefersReducedMotion ? 0 : imageY }}
          aria-hidden="true"
        >
          <img src="/personal/beach.png" alt="" fetchPriority="high" />
        </motion.div>
        <div className="personal-hero-shade" aria-hidden="true" />

        <motion.div
          className="personal-hero-script"
          style={{ y: prefersReducedMotion ? 0 : quoteY }}
        >
          <blockquote>
          जिंदगी, thodi
          </blockquote>
          <blockquote style={{textAlign: "right"}}>
           सी filmy.
          </blockquote>
        </motion.div>

        <motion.div
          className="personal-portrait-layer"
          style={{ y: prefersReducedMotion ? 0 : portraitY }}
          aria-hidden="true"
        >
          <img src="/personal/portrait.png" alt="" fetchPriority="high" />
        </motion.div>

        <motion.div
          className="personal-hero-content"
          style={{
            y: prefersReducedMotion ? 0 : contentY,
            opacity: prefersReducedMotion ? 1 : contentOpacity,
          }}
        >
          <div className="personal-hero-top">
            <p className="personal-eyebrow">
              <span className="personal-live-dot" />
              A little more of me
            </p>
            <span className="personal-hero-edition">Somewhere by the sea</span>
          </div>

          <div className="personal-hero-index">
            <span>Coastal days</span>
            <span className="personal-hero-index-divider" />
            <a className="personal-scroll-link" href="#the-little-things">
              <span>Scroll to wander</span>
              <ArrowDown size={15} strokeWidth={1.5} />
            </a>
          </div>
        </motion.div>
      </section>

      <div className="personal-marquee" aria-hidden="true">
        <div className="personal-marquee-track">
          {Array.from({ length: 4 }, (_, index) => (
            <span key={index}>
              OUTSIDE THE LINES <i>✳</i> ALWAYS LOOKING CLOSER <i>✳</i>
            </span>
          ))}
        </div>
      </div>

      <section className="personal-intro" id="the-little-things">
        <motion.div
          className="personal-intro-label"
          variants={REVEAL}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: prefersReducedMotion ? 0 : 0.7 }}
        >
          <span className="personal-section-index">01 / A different frame</span>
          <span className="personal-label-line" />
        </motion.div>
        <motion.div
          className="personal-intro-copy"
          variants={REVEAL}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: prefersReducedMotion ? 0 : 0.8, delay: 0.08 }}
        >
          <h2>
            The best parts
            <br />
            <em>don’t need a plan.</em>
          </h2>
          <p>
            Not every good idea starts at a desk. Sometimes it’s a new view, a
            familiar song, or simply taking the long way home. Here are a few
            frames from the softer side of the story.
          </p>
        </motion.div>
        <div className="personal-intro-stamp" aria-hidden="true">
          <span>STAY</span>
          <span>CURIOUS</span>
          <span className="personal-stamp-star">✳</span>
        </div>
      </section>

      <section className="personal-moments" aria-label="A few things worth noticing">
        <div className="personal-moments-heading">
          <span className="personal-section-index">02 / The little things</span>
          <span>Collected, not curated too carefully.</span>
        </div>

        <div className="personal-moments-grid">
          {MOMENTS.map((moment, index) => (
            <motion.figure
              className={`personal-moment ${moment.className}`}
              key={moment.number}
              initial={prefersReducedMotion ? false : { opacity: 0, y: 48 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{
                duration: prefersReducedMotion ? 0 : 0.75,
                delay: prefersReducedMotion ? 0 : index * 0.12,
              }}
            >
              <div className="personal-moment-image">
                <img src={moment.image} alt={moment.alt} loading="lazy" />
                <span className="personal-moment-number">{moment.number}</span>
                <span className="personal-moment-open" aria-hidden="true">
                  <MoveUpRight size={17} />
                </span>
              </div>
              <figcaption>
                <div>
                  <h3>{moment.title}</h3>
                  <p>{moment.note}</p>
                </div>
                <span className="personal-caption-index">0{index + 1}</span>
              </figcaption>
            </motion.figure>
          ))}
        </div>
      </section>

      <section className="personal-film" aria-labelledby="personal-film-title">
        <div className="personal-film-frame">
          <video
            autoPlay={!prefersReducedMotion}
            muted
            loop={!prefersReducedMotion}
            playsInline
            controls={prefersReducedMotion}
            poster="https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=2000&q=85"
            aria-label="A quiet moving flower, a moment to slow down"
          >
            <source
              src="https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4"
              type="video/mp4"
            />
          </video>
          <div className="personal-film-overlay">
            <span className="personal-film-label">03 / A slower frame</span>
            <span className="personal-film-play" aria-hidden="true">
              <ArrowUpRight size={19} strokeWidth={1.5} />
            </span>
            <h2 id="personal-film-title">
              Make space
              <br />
              <em>to notice.</em>
            </h2>
            <span className="personal-film-caption">A small pause in the scroll</span>
          </div>
          <span className="personal-film-grain" aria-hidden="true" />
        </div>
      </section>

      <section className="personal-note">
        <motion.p
          className="personal-section-index"
          variants={REVEAL}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          transition={{ duration: prefersReducedMotion ? 0 : 0.6 }}
        >
          04 / A note to self
        </motion.p>
        <motion.blockquote
          variants={REVEAL}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: prefersReducedMotion ? 0 : 0.8, delay: 0.08 }}
        >
          “Stay open to the things you didn’t know you were looking for.”
        </motion.blockquote>
        <span className="personal-note-signature">— Shiva</span>
        <span className="personal-note-orbit personal-note-orbit-one" aria-hidden="true" />
        <span className="personal-note-orbit personal-note-orbit-two" aria-hidden="true" />
      </section>

      <section className="personal-outro">
        <div className="personal-outro-top">
          <span className="personal-section-index">05 / Until next time</span>
          <span>Thanks for being here.</span>
        </div>
        <h2>
          That’s the
          <br />
          <em>whole picture.</em>
        </h2>
        <div className="personal-outro-bottom">
          <p>
            The rest is still unfolding. If something here made you smile, I’d
            love to hear about it.
          </p>
          <a className="personal-contact-link" href="mailto:shivacharyguddoju@gmail.com">
            Say hello <ArrowUpRight size={18} />
          </a>
        </div>
        <div className="personal-outro-watermark" aria-hidden="true">SC</div>
      </section>

      <section
        className="personal-return"
        aria-label="Return to the professional portfolio"
        ref={returnRef}
      >
        <p className="personal-section-index">The other side of the story</p>
        <motion.div
          className="personal-return-reveal"
          initial={prefersReducedMotion ? false : { clipPath: 'inset(0 0 100% 0)' }}
          animate={{ clipPath: isReturnRevealed ? 'inset(0 0 0% 0)' : 'inset(0 0 100% 0)' }}
          transition={{ duration: prefersReducedMotion ? 0 : 1, ease: [0.76, 0, 0.24, 1] }}
        >
          <Link className="personal-return-link" to="/">
            <span>Back to the professional portfolio</span>
            <ArrowUpRight size={20} strokeWidth={1.5} />
          </Link>
        </motion.div>
        <span className="personal-return-note">Same person. Different perspective.</span>
      </section>
    </div>
  )
}
