import { useRef } from 'react'
import { motion, useSpring, useTransform } from 'framer-motion'

const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.25, 1, 0.5, 1] } },
}

const projects = [
    {
        title: 'CPU Scheduling Simulator',
        date: 'Apr 2025 – Jun 2025',
        link: 'https://github.com/kuldip49',
        tags: ['C++', 'Python', 'Operating Systems', 'Gantt Charts'],
        description: [
            'Developed a CPU Scheduling Simulator using C++/Python to demonstrate operating system process management with dynamic Gantt Chart visualization.',
            'Implemented major scheduling algorithms including FCFS, SJF, Round Robin, and Priority Scheduling with calculated waiting/turnaround times.',
            'Built an interactive interface for inputting burst time, arrival time, priority, and time quantum.',
            'Validated correctness with edge cases including simultaneous arrivals, zero burst time, and high-priority starvation.',
        ],
    },
    {
        title: 'Neurowrite Rehab (NWR)',
        subtitle: 'For Dysgraphia Impairments',
        date: 'Jan 2025 – Mar 2025',
        link: 'https://github.com/kuldip49',
        tags: ['Neural Networks', 'OCR', 'Motor Analysis', 'Healthcare'],
        description: [
            'Proposed a novel adaptive neural framework for dysgraphia-focused handwriting recognition incorporating motor signal analysis.',
            'Conducted comparative experiments against conventional OCR systems, demonstrating statistically significant performance gains.',
            'Explored correlations between stroke kinematics and dysgraphia severity levels using feature attribution techniques.',
            'Delivered a scalable, modular system architecture suitable for integration into digital therapy platforms.',
        ],
    },
]

function ProjectCard({ project }) {
    const cardRef = useRef(null)

    // Framer Motion Springs for silky smooth 3D tilt
    const x = useSpring(0, { stiffness: 400, damping: 30, mass: 0.8 })
    const y = useSpring(0, { stiffness: 400, damping: 30, mass: 0.8 })

    // Map mouse position to rotation degrees
    const rotateX = useTransform(y, [-50, 50], [8, -8])
    const rotateY = useTransform(x, [-50, 50], [-8, 8])

    const handleMouseMove = (e) => {
        const card = cardRef.current
        if (!card) return
        const rect = card.getBoundingClientRect()
        // Normalized relative coordinates (-50 to 50 roughly)
        const mouseX = e.clientX - rect.left - rect.width / 2
        const mouseY = e.clientY - rect.top - rect.height / 2
        
        x.set(mouseX / (rect.width/2) * 50)
        y.set(mouseY / (rect.height/2) * 50)
    }

    const handleMouseLeave = () => {
        x.set(0)
        y.set(0)
    }

    return (
        <motion.div
            ref={cardRef}
            className="glass-card project-card neon-border-cyan"
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{ 
                rotateX, 
                rotateY, 
                transformStyle: 'preserve-3d',
                transformPerspective: 1200 
            }}
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
        >
            <div className="project-status" style={{ fontSize: '0.6rem', color: 'var(--color-accent-cyan)', opacity: 0.6, marginBottom: '8px' }}>
                DATA_LINK::ESTABLISHED // SECTOR_{project.title.slice(0, 3).toUpperCase()}
            </div>
            <div className="project-header" style={{ transform: 'translateZ(30px)' }}>
                <div>
                    <h3 className="glitch-subtle neon-text-cyan">{project.title}</h3>
                    {project.subtitle && <p className="project-subtitle">{project.subtitle}</p>}
                </div>
                <span className="project-date">{project.date}</span>
            </div>

            <div className="project-tags" style={{ transform: 'translateZ(20px)' }}>
                {project.tags.map((tag) => (
                    <span key={tag} className="tag">{tag}</span>
                ))}
            </div>

            <ul className="project-details" style={{ transform: 'translateZ(10px)' }}>
                {project.description.map((desc, j) => (
                    <li key={j}>{desc}</li>
                ))}
            </ul>

            <motion.a
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-outline neon-border-cyan"
                style={{ transform: 'translateZ(40px)', color: 'var(--color-accent-cyan)' }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
            >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/></svg>
                ACCESS_REPOSITORY
            </motion.a>
        </motion.div>
    )
}

export default function Projects() {
    return (
        <section id="projects" className="section projects-section">
            <motion.div
                className="section-content"
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.15 }}
                transition={{ staggerChildren: 0.2 }}
            >
                <motion.h2 className="section-title" variants={fadeUp}>
                    Projects
                </motion.h2>

                <div className="projects-list">
                    {projects.map((project) => (
                        <motion.div key={project.title} variants={fadeUp}>
                            <ProjectCard project={project} />
                        </motion.div>
                    ))}
                </div>
            </motion.div>
        </section>
    )
}
