import { motion }          from 'framer-motion'
import { MotionProvider }    from './context/MotionContext'
import { useLenis }          from './hooks/useLenis'
import { CustomCursor }      from './components/CustomCursor'
import { Nav }               from './components/Nav'
import { Hero }              from './sections/Hero'
import { WhatIKnow }         from './sections/WhatIKnow'
import { NowPanel }          from './sections/NowPanel'
import { Projects }          from './sections/Projects'
import { HowIWork }          from './sections/HowIWork'
import { WhereImHeaded }     from './sections/WhereImHeaded'
import { Marquee }           from './sections/Marquee'
import { Contact }           from './sections/Contact'

function AppContent() {
  useLenis()

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
        <div style={{
          background: 'rgba(255, 255, 255, 0.35)',
          backdropFilter: 'blur(40px) saturate(150%)',
          WebkitBackdropFilter: 'blur(40px) saturate(150%)',
          minHeight: '100vh',
          width: '100%',
        }}>
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          >
            <Hero />
            <WhatIKnow />
            <NowPanel />
            <Projects />
            <HowIWork />
            <WhereImHeaded />
            <Marquee />
            <Contact />
          </motion.div>
        </div>
      </main>
    </>
  )
}

export default function App() {
  return (
    <MotionProvider>
      <AppContent />
    </MotionProvider>
  )
}
