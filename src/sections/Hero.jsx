import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

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

export default function Hero() {
    const typedText = useTypingEffect(roles)
    const name = "Kuldip Dhar".split("")

    return (
        <section id="hero" className="section hero-section">
            <motion.div
                className="section-content hero-content"
                variants={containerVars}
                initial="hidden"
                whileInView="show"
                viewport={{ once: false, amount: 0.3 }}
            >
                <motion.p className="hero-greeting" variants={itemVars}>
                    &lt;Hello World /&gt;
                </motion.p>
                
                <motion.h1 
                    className="hero-name" 
                    variants={letterContainerVariants}
                    style={{ display: 'inline-flex', flexWrap: 'wrap' }}
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

                <motion.div className="hero-typing" variants={itemVars}>
                    <span>{typedText}</span>
                    <span className="cursor-blink" />
                </motion.div>
                
                <motion.p className="hero-subtitle" variants={itemVars}>
                    Building intelligent systems at the intersection of{' '}
                    <span className="highlight">Deep Learning</span>,{' '}
                    <span className="highlight">NLP</span> &{' '}
                    <span className="highlight">Computer Vision</span>
                </motion.p>
                
                <motion.div className="hero-cta" variants={itemVars}>
                    <a href="#projects" className="btn btn-primary">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
                        View Projects
                    </a>
                    <a href="#contact" className="btn btn-secondary">
                        Hire Me
                    </a>
                    <a href="#contact" className="btn btn-outline">
                        Get in Touch →
                    </a>
                </motion.div>
            </motion.div>
        </section>
    )
}
