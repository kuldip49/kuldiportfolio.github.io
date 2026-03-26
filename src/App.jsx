import { Canvas } from '@react-three/fiber'
import { AnimatePresence, motion } from 'framer-motion'
import usePortfolioStore from './store/usePortfolioStore'
import Navigation from './components/Navigation'
import CyberpunkBackground from './components/CyberpunkBackground'
import ClickParticles from './components/ClickParticles'
import GameHUD from './components/GameHUD'
import Scene from './components/Scene'
import Hero from './sections/Hero'
import Skills from './sections/Skills'
import Projects from './sections/Projects'
import Experience from './sections/Experience'
import Contact from './sections/Contact'

// Page transition variants
const pageVariants = {
    initial: { opacity: 0, scale: 0.9, y: 20 },
    in: { opacity: 1, scale: 1, y: 0 },
    out: { opacity: 0, scale: 1.1, y: -20 }
}

const pageTransition = {
    type: 'tween',
    ease: 'anticipate',
    duration: 0.5
}

export default function App() {
    const activeSection = usePortfolioStore(s => s.activeSection)
    const theme = usePortfolioStore(s => s.theme)

    return (
        <div className={`app game-mode ${theme}-theme`}>
            <CyberpunkBackground />
            <ClickParticles />
            <GameHUD />

            {/* Fixed 3D Canvas Background */}
            <div className="canvas-container">
                <Canvas
                    camera={{ position: [0, 10, 40], fov: 50 }}
                    dpr={[1, 1.5]}
                    gl={{
                        antialias: true,
                        alpha: true,
                        powerPreference: 'high-performance',
                    }}
                >
                    <Scene />
                </Canvas>
            </div>

            {/* Game UI Content */}
            <div className="game-ui-wrapper">
                <div className="hologram-overlay" />
                <Navigation />
                
                <div className="game-screen-container">
                    <AnimatePresence mode="wait">
                        {activeSection === 'hero' && (
                            <motion.div key="hero" className="game-screen" variants={pageVariants} initial="initial" animate="in" exit="out" transition={pageTransition}>
                                <Hero />
                            </motion.div>
                        )}
                        {activeSection === 'projects' && (
                            <motion.div key="projects" className="game-screen" variants={pageVariants} initial="initial" animate="in" exit="out" transition={pageTransition}>
                                <Projects />
                            </motion.div>
                        )}
                        {activeSection === 'skills' && (
                            <motion.div key="skills" className="game-screen" variants={pageVariants} initial="initial" animate="in" exit="out" transition={pageTransition}>
                                <Skills />
                            </motion.div>
                        )}
                        {activeSection === 'experience' && (
                            <motion.div key="experience" className="game-screen" variants={pageVariants} initial="initial" animate="in" exit="out" transition={pageTransition}>
                                <Experience />
                            </motion.div>
                        )}
                        {activeSection === 'contact' && (
                            <motion.div key="contact" className="game-screen" variants={pageVariants} initial="initial" animate="in" exit="out" transition={pageTransition}>
                                <Contact />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    )
}
