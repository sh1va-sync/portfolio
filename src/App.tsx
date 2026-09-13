import { AnimatePresence, motion } from 'framer-motion'
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom'
import { MotionProvider }    from './context/MotionContext'
import { useLenis }          from './hooks/useLenis'
import { CustomCursor }      from './components/CustomCursor'
import { Nav }               from './components/Nav'
import { Hero }              from './sections/Hero'
import { WhatIKnow }         from './sections/WhatIKnow'
import { NowPanel }          from './sections/NowPanel'
import { ProjectDetail, Projects } from './sections/Projects'
import { HowIWork }          from './sections/HowIWork'
import { WhereImHeaded }     from './sections/WhereImHeaded'
import { Marquee }           from './sections/Marquee'
import { Contact }           from './sections/Contact'
import { CurrentlyWorking }  from './sections/CurrentlyWorking'

function HomePage() {
  return (
    <>
      <Hero />
      <Marquee />
      <CurrentlyWorking />
    </>
  )
}

function WorkPage() {
  return (
    <>
      <PageIntro eyebrow="01 / Selected work" title="Projects with a point of view." />
      <Projects />
    </>
  )
}

function AboutPage() {
  return (
    <>
      <PageIntro eyebrow="02 / About" title="Thoughtful systems, carefully made." />
      <WhatIKnow />
      <HowIWork />
      <WhereImHeaded />
    </>
  )
}

function NowPage() {
  return (
    <>
      <PageIntro eyebrow="03 / Now" title="A snapshot of what is moving." />
      <NowPanel />
    </>
  )
}

function ContactPage() {
  return <Contact />
}

function PageIntro({ eyebrow, title }: { eyebrow: string, title: string }) {
  return (
    <section className="page-intro">
      <p>{eyebrow}</p>
      <h1>{title}</h1>
    </section>
  )
}

function AppContent() {
  useLenis()
  const location = useLocation()

  return (
    <>
      <CustomCursor />
      
      {/* Global Aurora Background */}
      <div className="aurora-bg">
        <div className="aurora-orb aurora-orb-1" />
        <div className="aurora-orb aurora-orb-2" />
        <div className="aurora-orb aurora-orb-3" />
        <div className="aurora-orb aurora-orb-4" />
      </div>

      <Nav />
      <main style={{ position: 'relative', zIndex: 1, minHeight: '100vh' }}>
        <div className="app-glass">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
            >
              <Routes location={location}>
                <Route path="/" element={<HomePage />} />
                <Route path="/work" element={<WorkPage />} />
                <Route path="/work/:projectId" element={<ProjectRoute />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/now" element={<NowPage />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="*" element={<HomePage />} />
              </Routes>
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </>
  )
}

function ProjectRoute() {
  const location = useLocation()
  const projectId = location.pathname.split('/').pop() ?? ''
  return <ProjectDetail projectId={projectId} />
}

export default function App() {
  return (
    <MotionProvider>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </MotionProvider>
  )
}
