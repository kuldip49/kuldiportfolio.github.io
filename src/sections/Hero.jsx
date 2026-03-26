import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import usePortfolioStore from '../store/usePortfolioStore'

const roles = [
    'AI/ML Engineer',
    'Full-Stack Developer',
    'Problem Solver',
    'Deep Learning Enthusiast',
]

function useTypingEffect(strings, typingSpeed = 70, deletingSpeed = 35, pauseDuration = 2000) {
    const [text, setText] = useState('')
    const [stringIndex, setStringIndex] = useState(0)
    const [isDeleting, setIsDeleting] = useState(false)

    useEffect(() => {
        const currentString = strings[stringIndex]

        const timeout = setTimeout(() => {
            if (!isDeleting) {
                setText(currentString.slice(0, text.length + 1))
                if (text.length === currentString.length) {
                    setTimeout(() => setIsDeleting(true), pauseDuration)
                }
            } else {
                setText(currentString.slice(0, text.length - 1))
                if (text.length === 0) {
                    setIsDeleting(false)
                    setStringIndex((prev) => (prev + 1) % strings.length)
                }
            }
        }, isDeleting ? deletingSpeed : typingSpeed)

        return () => clearTimeout(timeout)
    }, [text, isDeleting, stringIndex, strings, typingSpeed, deletingSpeed, pauseDuration])

    return text
}

const containerVars = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.1,
        },
    },
}

const itemVars = {
    hidden: { opacity: 0, y: 20 },
    show: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.8, ease: [0.4, 0, 0.2, 1] },
    },
}

const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] } },
}

// Letter animation for Kuldip Dhar
const letterContainerVariants = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.04,
            delayChildren: 0.4,
        },
    },
}

const letterVariants = {
    hidden: { opacity: 0, scale: 0.95, filter: 'blur(8px)' },
    show: {
        opacity: 1,
        scale: 1,
        filter: 'blur(0px)',
        transition: { duration: 0.6, ease: [0.4, 0, 0.2, 1] },
    },
}

const letterHover = {
    y: -4,
    textShadow: '0px 10px 20px rgba(168, 85, 247, 0.6)',
    transition: { duration: 0.2, ease: 'easeOut' },
}

// Avatar hologram animation
const avatarVariants = {
    hidden: { opacity: 0, scale: 0.8, rotate: -5 },
    show: {
        opacity: 1,
        scale: 1,
        rotate: 0,
        transition: { duration: 1, ease: [0.25, 1, 0.5, 1], delay: 0.2 },
    },
}

export default function Hero() {
    const typedText = useTypingEffect(roles)
    const name = "Kuldip Dhar".split("")

    return (
        <section id="hero" className="section hero-section">
            <motion.div
                className="section-content hero-content hero-layout"
                variants={containerVars}
                initial="hidden"
                whileInView="show"
                viewport={{ once: false, amount: 0.3 }}
            >
                {/* Left side: Text content */}
                <div className="hero-text-side">
                    <motion.p
                        className="hero-subtitle neon-text-cyan"
                        variants={fadeUp}
                        style={{ letterSpacing: '0.3em', fontSize: '0.8rem', marginBottom: '1rem' }}
                    >
                        :: INITIALIZING_CORE_SYSTEMS ::
                    </motion.p>
                    
                    <div className="hero-name-container">
                        <div className="scanning-line" />
                        <motion.h1 
                            className="hero-name glitch" 
                            variants={letterContainerVariants}
                            style={{ display: 'inline-flex', flexWrap: 'nowrap', whiteSpace: 'nowrap' }}
                            data-text="KULDIP DHAR"
                        >
                            {name.map((char, index) => (
                                <motion.span
                                    key={index}
                                    variants={letterVariants}
                                    whileHover={letterHover}
                                    style={{ 
                                        display: 'inline-block',
                                        whiteSpace: char === " " ? "pre" : "normal"
                                    }}
                                >
                                    {char}
                                </motion.span>
                            ))}
                        </motion.h1>
                    </div>

                    {/* Typing effect role display */}
                    <motion.div className="hero-typing-role" variants={fadeUp}>
                        <span className="typing-prefix">&gt;_</span>
                        <span className="typing-text">{typedText}</span>
                        <span className="typing-cursor">|</span>
                    </motion.div>

                    <motion.div 
                        className="hero-role-container"
                        variants={fadeUp}
                    >
                        <span className="role-tag">AI/ML ENGINEER</span>
                        <span className="role-divider">|</span>
                        <span className="role-tag">FULL-STACK DEVELOPER</span>
                    </motion.div>
                    
                    <motion.p className="hero-subtitle" variants={itemVars}>
                        Building intelligent systems at the intersection of{' '}
                        <span className="highlight">Deep Learning</span>,{' '}
                        <span className="highlight">NLP</span> &{' '}
                        <span className="highlight">Computer Vision</span>
                    </motion.p>
                    
                    <motion.div className="hero-cta" variants={itemVars}>
                        <button onClick={() => usePortfolioStore.getState().setSection('projects')} className="btn btn-primary">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
                            View Projects
                        </button>
                        <button onClick={() => usePortfolioStore.getState().setSection('contact')} className="btn btn-secondary">
                            Hire Me
                        </button>
                        <a href={`${import.meta.env.BASE_URL}Kuldip_Dhar_CV.pdf`} download="Kuldip_Dhar_CV.pdf" className="btn btn-animated">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                            Download CV
                        </a>
                    </motion.div>
                </div>

                {/* Right side: Holographic Avatar */}
                <motion.div className="hero-avatar-side" variants={avatarVariants}>
                    <div className="avatar-hologram">
                        <div className="hologram-ring ring-1" />
                        <div className="hologram-ring ring-2" />
                        <div className="hologram-ring ring-3" />
                        <div className="avatar-frame">
                            <img 
                                src={`${import.meta.env.BASE_URL}kuldip-photo.jpg`}
                                alt="Kuldip Dhar" 
                                className="avatar-image"
                            />
                            <div className="avatar-glitch-overlay" />
                        </div>
                        <div className="avatar-hud-label">
                            <span className="hud-dot" />
                            <span>OPERATOR::KULDIP_DHAR</span>
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </section>
    )
}
