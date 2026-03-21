import { useRef, useState, useEffect } from 'react'
import { motion, useInView } from 'framer-motion'

const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] } },
}

function AnimatedCounter({ target, duration = 2000, suffix = '' }) {
    const [count, setCount] = useState(0)
    const ref = useRef(null)
    const inView = useInView(ref, { once: true, amount: 0.5 })

    useEffect(() => {
        if (!inView) return
        let start = 0
        const step = target / (duration / 16)
        const timer = setInterval(() => {
            start += step
            if (start >= target) {
                setCount(target)
                clearInterval(timer)
            } else {
                setCount(Math.floor(start))
            }
        }, 16)
        return () => clearInterval(timer)
    }, [inView, target, duration])

    return <span ref={ref}>{count}{suffix}</span>
}

function TiltCard({ children, className = '' }) {
    const cardRef = useRef(null)

    const handleMouseMove = (e) => {
        const card = cardRef.current
        if (!card) return
        const rect = card.getBoundingClientRect()
        const x = e.clientX - rect.left
        const y = e.clientY - rect.top
        const centerX = rect.width / 2
        const centerY = rect.height / 2
        const rotateX = ((y - centerY) / centerY) * -8
        const rotateY = ((x - centerX) / centerX) * 8
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`
    }

    const handleMouseLeave = () => {
        if (cardRef.current) {
            cardRef.current.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)'
        }
    }

    return (
        <div
            ref={cardRef}
            className={`glass-card tilt-card ${className}`}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{ transition: 'transform 0.15s ease' }}
        >
            {children}
        </div>
    )
}

export default function About() {
    return (
        <section id="about" className="section about-section">
            <motion.div
                className="section-content"
                initial="hidden"
                whileInView="show"
                viewport={{ once: false, amount: 0.2 }}
                transition={{ staggerChildren: 0.15 }}
            >
                <motion.h2 className="section-title" variants={fadeUp}>
                    About Me
                </motion.h2>

                <motion.div variants={fadeUp}>
                    <TiltCard>
                        <p>
                            I'm a <strong>Computer Science graduate</strong> from Lovely Professional University
                            (B.Tech, 6.30 CGPA) with a deep passion for Artificial Intelligence and Machine Learning.
                        </p>
                        <p>
                            My expertise spans the full AI pipeline — from data preprocessing and visualization
                            to building production-grade models using <strong>PyTorch</strong>, <strong>TensorFlow</strong>,
                            and <strong>Scikit-Learn</strong>. I specialize in deep learning architectures including
                            CNNs, RNNs, Transformers, and GANs.
                        </p>
                        <p>
                            I build end-to-end intelligent applications using <strong>Flask</strong>, <strong>FastAPI</strong>,
                            and <strong>OpenAI APIs</strong>, with deployment through <strong>Docker</strong> and{' '}
                            <strong>Kubernetes</strong> on <strong>AWS</strong>.
                        </p>
                    </TiltCard>
                </motion.div>

                <motion.div className="counter-grid" variants={fadeUp}>
                    <div className="glass-card counter-card">
                        <span className="counter-number">
                            <AnimatedCounter target={2} suffix="+" />
                        </span>
                        <span className="counter-label">Projects Completed</span>
                    </div>
                    <div className="glass-card counter-card">
                        <span className="counter-number">
                            <AnimatedCounter target={20} suffix="+" />
                        </span>
                        <span className="counter-label">Technologies Used</span>
                    </div>
                    <div className="glass-card counter-card">
                        <span className="counter-number">
                            <AnimatedCounter target={100} suffix="+" />
                        </span>
                        <span className="counter-label">DSA Problems Solved</span>
                    </div>
                    <div className="glass-card counter-card">
                        <span className="counter-number">
                            <AnimatedCounter target={4} />
                        </span>
                        <span className="counter-label">Certifications</span>
                    </div>
                </motion.div>

                <motion.div className="info-grid" variants={fadeUp}>
                    <div className="glass-card info-card">
                        <span className="info-icon">🎓</span>
                        <h3>Education</h3>
                        <p>B.Tech CSE — LPU, Punjab</p>
                        <span className="info-date">2023 – 2025</span>
                    </div>
                    <div className="glass-card info-card">
                        <span className="info-icon">📍</span>
                        <h3>Location</h3>
                        <p>Agartala, Tripura</p>
                        <span className="info-date">India</span>
                    </div>
                    <div className="glass-card info-card">
                        <span className="info-icon">🧠</span>
                        <h3>Focus</h3>
                        <p>AI/ML & Deep Learning</p>
                        <span className="info-date">GenAI, LLMs, NLP</span>
                    </div>
                </motion.div>
            </motion.div>
        </section>
    )
}
