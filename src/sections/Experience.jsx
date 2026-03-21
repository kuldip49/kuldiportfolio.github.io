import { motion } from 'framer-motion'

const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] } },
}

const education = [
    {
        institution: 'Lovely Professional University',
        degree: 'Bachelor of Technology — Computer Science & Engineering',
        cgpa: '6.30 CGPA',
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
    { text: 'Completed AWS Cloud Computing program — architecture, security, scalability', date: 'May 2025' },
    { text: 'Achieved excellent performance in Sports Club — teamwork, discipline, commitment', date: 'Mar 2023' },
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
                <motion.h2 className="section-title" variants={fadeUp}>
                    Experience & Education
                </motion.h2>

                {/* Education Timeline */}
                <motion.div className="timeline" variants={fadeUp}>
                    <h3 className="subsection-title">Education</h3>
                    {education.map((edu, i) => (
                        <motion.div
                            key={i}
                            className="glass-card timeline-card"
                            variants={fadeUp}
                            whileHover={{ x: 6 }}
                        >
                            <div className="timeline-dot" />
                            <div className="timeline-content">
                                <h4>{edu.institution}</h4>
                                <p className="timeline-degree">{edu.degree}</p>
                                <div className="timeline-meta">
                                    <span>📊 {edu.cgpa}</span>
                                    <span>📅 {edu.period}</span>
                                    <span>📍 {edu.location}</span>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>

                {/* Certificates */}
                <motion.div variants={fadeUp}>
                    <h3 className="subsection-title">Certifications</h3>
                    <div className="cert-grid">
                        {certificates.map((cert, i) => (
                            <motion.div
                                key={i}
                                className="glass-card cert-card"
                                variants={fadeUp}
                                whileHover={{ scale: 1.02, y: -3 }}
                            >
                                <h4>{cert.name}</h4>
                                <p className="cert-org">{cert.org}</p>
                                <span className="cert-date">{cert.period}</span>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>

                {/* Achievements */}
                <motion.div variants={fadeUp}>
                    <h3 className="subsection-title">Achievements</h3>
                    <div className="achievements-list">
                        {achievements.map((ach, i) => (
                            <motion.div
                                key={i}
                                className="glass-card achievement-card"
                                variants={fadeUp}
                                whileHover={{ x: 6 }}
                            >
                                <p>🏆 {ach.text}</p>
                                <span className="achievement-date">{ach.date}</span>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            </motion.div>
        </section>
    )
}
