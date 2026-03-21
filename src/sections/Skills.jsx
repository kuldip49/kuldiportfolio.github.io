import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] } },
}

const skillCategories = [
    {
        title: 'AI / Machine Learning',
        icon: '🤖',
        skills: [
            { name: 'Supervised Learning', level: 90 },
            { name: 'Unsupervised Learning', level: 80 },
            { name: 'Reinforcement Learning', level: 70 },
            { name: 'SVM, Decision Trees', level: 85 },
            { name: 'Model Evaluation (F1, AUC)', level: 88 },
        ],
    },
    {
        title: 'Deep Learning',
        icon: '🧠',
        skills: [
            { name: 'CNN, RNN, FNN', level: 88 },
            { name: 'Transformer Architecture', level: 85 },
            { name: 'PyTorch & TensorFlow', level: 82 },
            { name: 'GANs', level: 75 },
            { name: 'NLP (RNN & Transformers)', level: 86 },
        ],
    },
    {
        title: 'Generative AI',
        icon: '✨',
        skills: [
            { name: 'Large Language Models', level: 85 },
            { name: 'OpenAI APIs', level: 90 },
            { name: 'RAG Pipelines', level: 80 },
            { name: 'Prompt Engineering', level: 92 },
            { name: 'Fine-tuning', level: 75 },
        ],
    },
    {
        title: 'Languages & Frameworks',
        icon: '💻',
        skills: [
            { name: 'Python', level: 95 },
            { name: 'C++, Java', level: 70 },
            { name: 'HTML, CSS, JavaScript', level: 80 },
            { name: 'Flask, FastAPI, Django', level: 85 },
            { name: 'NumPy, Pandas, Scikit-Learn', level: 90 },
        ],
    },
    {
        title: 'Tools & Infrastructure',
        icon: '🛠️',
        skills: [
            { name: 'AWS Cloud Services', level: 78 },
            { name: 'Docker & Kubernetes', level: 75 },
            { name: 'Git & GitHub', level: 90 },
            { name: 'MySQL, SQL', level: 82 },
            { name: 'Nginx, Linux', level: 70 },
        ],
    },
    {
        title: 'Data Science',
        icon: '📊',
        skills: [
            { name: 'Data Preprocessing', level: 92 },
            { name: 'Data Visualization', level: 88 },
            { name: 'Statistics & Probability', level: 80 },
            { name: 'SQL for Data Science', level: 85 },
            { name: 'Math for AI', level: 78 },
        ],
    },
]

function SkillBar({ name, level, delay = 0 }) {
    const ref = useRef(null)
    const inView = useInView(ref, { once: true, amount: 0.5 })

    return (
        <div className="skill-item" ref={ref}>
            <div className="skill-item-header">
                <span className="skill-item-name">{name}</span>
                <span className="skill-item-percent">{level}%</span>
            </div>
            <div className="skill-bar">
                <div
                    className="skill-bar-fill"
                    style={{
                        transform: inView ? `scaleX(${level / 100})` : 'scaleX(0)',
                        transitionDelay: `${delay * 0.1}s`,
                    }}
                />
            </div>
        </div>
    )
}

export default function Skills() {
    return (
        <section id="skills" className="section skills-section">
            <motion.div
                className="section-content"
                initial="hidden"
                whileInView="show"
                viewport={{ once: false, amount: 0.1 }}
                transition={{ staggerChildren: 0.08 }}
            >
                <motion.h2 className="section-title" variants={fadeUp}>
                    Skills & Expertise
                </motion.h2>

                <div className="skills-grid">
                    {skillCategories.map((cat, i) => (
                        <motion.div
                            key={cat.title}
                            className="glass-card skill-card"
                            variants={fadeUp}
                            custom={i}
                        >
                            <div className="skill-card-header">
                                <span className="skill-icon">{cat.icon}</span>
                                <h3>{cat.title}</h3>
                            </div>
                            <div className="skill-list">
                                {cat.skills.map((skill, j) => (
                                    <SkillBar
                                        key={skill.name}
                                        name={skill.name}
                                        level={skill.level}
                                        delay={j}
                                    />
                                ))}
                            </div>
                        </motion.div>
                    ))}
                </div>
            </motion.div>
        </section>
    )
}
