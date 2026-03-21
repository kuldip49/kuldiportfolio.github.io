import { useRef } from 'react'
import { motion } from 'framer-motion'

const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] } },
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

    const handleMouseMove = (e) => {
        const card = cardRef.current
        if (!card) return
        const rect = card.getBoundingClientRect()
        const x = e.clientX - rect.left
        const y = e.clientY - rect.top
        const centerX = rect.width / 2
        const centerY = rect.height / 2
        const rotateX = ((y - centerY) / centerY) * -5
        const rotateY = ((x - centerX) / centerX) * 5
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`
    }

    const handleMouseLeave = () => {
        if (cardRef.current) {
            cardRef.current.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)'
        }
    }

    return (
        <div
            ref={cardRef}
            className="glass-card project-card"
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{ transition: 'transform 0.15s ease' }}
        >
            <div className="project-header">
                <div>
                    <h3>{project.title}</h3>
                    {project.subtitle && <p className="project-subtitle">{project.subtitle}</p>}
                </div>
                <span className="project-date">{project.date}</span>
            </div>

            <div className="project-tags">
                {project.tags.map((tag) => (
                    <span key={tag} className="tag">{tag}</span>
                ))}
            </div>

            <ul className="project-details">
                {project.description.map((desc, j) => (
                    <li key={j}>{desc}</li>
                ))}
            </ul>

            <a
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-outline"
            >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/></svg>
                View on GitHub
            </a>
        </div>
    )
}

export default function Projects() {
    return (
        <section id="projects" className="section projects-section">
            <motion.div
                className="section-content"
                initial="hidden"
                whileInView="show"
                viewport={{ once: false, amount: 0.15 }}
                transition={{ staggerChildren: 0.15 }}
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
