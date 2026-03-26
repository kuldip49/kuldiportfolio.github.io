import { motion } from 'framer-motion'

const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] } },
}

const education = [
    {
        institution: 'Lovely Professional University',
        degree: 'Bachelor of Technology — Computer Science & Engineering',
        cgpa: '6.42 CGPA',
        period: 'Aug 2023 – Feb 2025',
        location: 'Punjab, India',
    },
    {
        institution: 'Umakanta Academy Eng Medium',
        degree: 'Intermediate — PCM',
        cgpa: '6.75 CGPA',
        period: 'Apr 2021 – Mar 2023',
        location: 'Agartala, Tripura',
    },
    {
        institution: 'Umakanta Academy Eng Medium',
        degree: 'Matriculation',
        cgpa: '8.11 CGPA',
        period: 'May 2020 – Apr 2021',
        location: 'Agartala, Tripura',
    },
]

const certificates = [
    { name: 'C++ Programming OOPS and DSA', org: 'CSE Pathshala', period: 'Jun 2025 – Jul 2025' },
    { name: 'Master Generative AI Apps and Tools', org: 'Infosys', period: 'May 2025 – Jun 2025' },
    { name: 'ChatGPT Made Easy AI Essentials For Coders', org: 'Infosys', period: 'Feb 2025 – Mar 2025' },
    { name: 'Automata Theory AI and ML', org: 'Infosys', period: 'Jan 2025 – Feb 2025' },
]

const achievements = [
    { text: 'Solved 100+ DSA problems on LeetCode and GeeksforGeeks', date: 'Aug 2025' },
    { text: 'Completed Full-Stack Python development course at LPU', date: 'Jul 2025' },
    { text: 'Successfully completed a comprehensive Cloud Computing program focused on Amazon Web Services (AWS), acquiring practical expertise in core AWS services, cloud architecture design, deployment with strategies, security best practices, scalability, monitoring, and cost optimization for production-grade environments. | LPU', date: 'May 2025' },
    { text: 'Achieved excellent performance in the Sports Club, demonstrating strong teamwork, discipline, and athletic commitment. | UKAEM', date: 'Mar 2023' },
]

export default function Experience() {
    return (
        <section id="experience" className="section experience-section">
            <motion.div
                className="section-content"
                initial="hidden"
                whileInView="show"
                viewport={{ once: false, amount: 0.1 }}
                transition={{ staggerChildren: 0.1 }}
            >
                <motion.h2 className="section-title glitch" data-text="CHRONICLES & ACHIEVEMENTS" variants={fadeUp}>
                    Chronicles & Achievements
                </motion.h2>

                <div className="experience-grid">
                    {/* Education Timeline - ED_TRACK */}
                    <motion.div className="timeline" variants={fadeUp}>
                        <h3 className="subsection-title neon-text-purple">:: EDUCATION_TRACK ::</h3>
                        {education.map((edu, i) => (
                            <motion.div
                                key={i}
                                className="glass-card timeline-card neon-border-purple"
                                variants={fadeUp}
                                whileHover={{ x: 10, backgroundColor: 'rgba(138, 43, 226, 0.15)' }}
                            >
                                <div className="system-tag">ED_RECORD_{i+1}</div>
                                <div className="timeline-content">
                                    <h4 className="neon-text-cyan">{edu.institution}</h4>
                                    <p className="timeline-degree">{edu.degree}</p>
                                    <div className="timeline-meta">
                                        <span className="meta-tag">CGPA_VAL: {edu.cgpa}</span>
                                        <span className="meta-tag">TIME_STAMP: {edu.period}</span>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>

                    {/* Right Column: Certs & Achievements */}
                    <div className="experience-right-col">
                        {/* Certificates - CERT_LOG */}
                        <motion.div variants={fadeUp} className="mb-8">
                            <h3 className="subsection-title neon-text-cyan">:: CERTIFICATION_LOG ::</h3>
                            <div className="cert-stack">
                                {certificates.map((cert, i) => (
                                    <motion.div
                                        key={i}
                                        className="glass-card cert-card-slim neon-border-cyan"
                                        variants={fadeUp}
                                        whileHover={{ x: -10, backgroundColor: 'rgba(0, 240, 255, 0.1)' }}
                                    >
                                        <div className="cert-info">
                                            <h4 className="text-sm">{cert.name}</h4>
                                            <p className="cert-org opacity-60 text-xs">{cert.org}</p>
                                        </div>
                                        <span className="cert-date-tag">{cert.period}</span>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>

                        {/* Achievements - ACHIEV_DATA */}
                        <motion.div variants={fadeUp}>
                            <h3 className="subsection-title neon-text-magenta">:: ACHIEVEMENT_DATA ::</h3>
                            <div className="achievements-stack">
                                {achievements.map((ach, i) => (
                                    <motion.div
                                        key={i}
                                        className="glass-card achievement-card neon-border-magenta"
                                        variants={fadeUp}
                                        whileHover={{ scale: 1.02 }}
                                    >
                                        <div className="achiev-icon">🏆</div>
                                        <div className="achiev-text">
                                            <p>{ach.text}</p>
                                            <span className="achievement-date opacity-50 text-xs">{ach.date}</span>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                    </div>
                </div>
            </motion.div>
        </section>
    )
}
