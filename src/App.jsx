import { Canvas } from '@react-three/fiber'
import Navigation from './components/Navigation'
import ScrollObserver from './components/ScrollObserver'
import ScrollProgress from './components/ScrollProgress'
import CustomCursor from './components/CustomCursor'
import Scene from './components/Scene'
import Hero from './sections/Hero'
import About from './sections/About'
import Skills from './sections/Skills'
import Projects from './sections/Projects'
import Experience from './sections/Experience'
import Contact from './sections/Contact'
import { motion } from 'framer-motion'

export default function App() {
    return (
        <div className="app">
            <CustomCursor />
            <ScrollProgress />

            {/* Fixed 3D Canvas Background */}
            <div className="canvas-container">
                <Canvas
                    camera={{ position: [0, 0, 5], fov: 50 }}
                    dpr={[1, 2]}
                    gl={{
                        antialias: true,
                        alpha: true,
                        powerPreference: 'high-performance',
                    }}
                >
                    <Scene />
                </Canvas>
            </div>

            {/* HTML Overlay */}
            <div className="html-overlay">
                <Navigation />
                <ScrollObserver />

                <motion.main 
                    className="sections-wrapper"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1.2, delay: 0.1, ease: "easeInOut" }}
                >
                    <Hero />
                    <About />
                    <Skills />
                    <Projects />
                    <Experience />
                    <Contact />
                </motion.main>
            </div>
        </div>
    )
}
