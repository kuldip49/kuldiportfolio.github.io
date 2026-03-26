import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const skillCategories = [
    {
        id: 'SYS_AI',
        title: 'AI / Machine Learning',
        icon: '🤖',
        status: 'ONLINE',
        skills: [
            { name: 'Supervised Learning', sync: 90, type: 'CORE' },
            { name: 'Unsupervised Learning', sync: 80, type: 'MODULE' },
            { name: 'Reinforcement Learning', sync: 70, type: 'EXPERIMENTAL' },
            { name: 'SVM, Decision Trees', sync: 85, type: 'CORE' },
            { name: 'Model Evaluation (F1, AUC)', sync: 88, type: 'ANALYTICS' },
        ],
    },
    {
        id: 'SYS_DEEP',
        title: 'Deep Learning',
        icon: '🧠',
        status: 'ONLINE',
        skills: [
            { name: 'CNN, RNN, FNN', sync: 88, type: 'CORE' },
            { name: 'Transformer Architecture', sync: 85, type: 'ADVANCED' },
            { name: 'PyTorch & TensorFlow', sync: 82, type: 'FRAMEWORK' },
            { name: 'GANs', sync: 75, type: 'EXPERIMENTAL' },
            { name: 'NLP (RNN & Transformers)', sync: 86, type: 'MODULE' },
        ],
    },
    {
        id: 'SYS_GEN',
        title: 'Generative AI',
        icon: '✨',
        status: 'ONLINE',
        skills: [
            { name: 'Large Language Models', sync: 85, type: 'CORE' },
            { name: 'OpenAI APIs', sync: 90, type: 'INTEGRATION' },
            { name: 'RAG Pipelines', sync: 80, type: 'ARCHITECTURE' },
            { name: 'Prompt Engineering', sync: 92, type: 'CORE' },
            { name: 'Fine-tuning', sync: 75, type: 'EXPERIMENTAL' },
        ],
    },
    {
        id: 'SYS_LANG',
        title: 'Languages & Frameworks',
        icon: '💻',
        status: 'ONLINE',
        skills: [
            { name: 'Python', sync: 95, type: 'CORE_RUNTIME' },
            { name: 'C++, Java', sync: 70, type: 'LEGACY' },
            { name: 'HTML, CSS, JavaScript', sync: 80, type: 'FRONTEND' },
            { name: 'Flask, FastAPI, Django', sync: 85, type: 'BACKEND' },
            { name: 'NumPy, Pandas, Scikit', sync: 90, type: 'LIBRARY' },
        ],
    },
    {
        id: 'SYS_INFRA',
        title: 'Tools & Infrastructure',
        icon: '🛠️',
        status: 'ONLINE',
        skills: [
            { name: 'AWS Cloud Services', sync: 78, type: 'CLOUD' },
            { name: 'Docker & Kubernetes', sync: 75, type: 'CONTAINER' },
            { name: 'Git & GitHub', sync: 90, type: 'VERSION_CTRL' },
            { name: 'MySQL, SQL', sync: 82, type: 'DATABASE' },
            { name: 'Nginx, Linux', sync: 70, type: 'SERVER' },
        ],
    },
    {
        id: 'SYS_DATA',
        title: 'Data Science',
        icon: '📊',
        status: 'ONLINE',
        skills: [
            { name: 'Data Preprocessing', sync: 92, type: 'PIPELINE' },
            { name: 'Data Visualization', sync: 88, type: 'ANALYTICS' },
            { name: 'Statistics & Probability', sync: 80, type: 'MATH_CORE' },
            { name: 'SQL for Data Science', sync: 85, type: 'DATABASE' },
            { name: 'Math for AI', sync: 78, type: 'MATH_CORE' },
        ],
    },
]

export default function Skills() {
    const [activeIndex, setActiveIndex] = useState(0)
    const activeCat = skillCategories[activeIndex]

    return (
        <section id="skills" className="section skills-section">
            <div className="section-content cyberware-wrapper">
                <motion.h2 
                    className="section-title glitch" 
                    data-text="CYBERWARE IMPLANTS"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    Cyberware Implants
                </motion.h2>

                <div className="cyberware-interface">
                    {/* LEFT SIDEBAR: CATEGORIES */}
                    <div className="cyberware-sidebar">
                        <div className="sidebar-header">
                            <span className="sidebar-title">SYSTEM_MODULES</span>
                            <div className="sidebar-line"></div>
                        </div>
                        <div className="sidebar-tabs">
                            {skillCategories.map((cat, i) => (
                                <button
                                    key={cat.id}
                                    className={`cyber-tab ${i === activeIndex ? 'active' : ''}`}
                                    onClick={() => setActiveIndex(i)}
                                    // Add hover sound effect logic here if needed
                                >
                                    <span className="tab-bracket">[</span>
                                    <span className="tab-id">{cat.id}</span>
                                    <span className="tab-bracket">]</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* RIGHT MAIN PANEL: SKILLS */}
                    <div className="cyberware-main">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeCat.id}
                                className="cyberware-display"
                                initial={{ opacity: 0, scale: 0.98, x: 20 }}
                                animate={{ opacity: 1, scale: 1, x: 0 }}
                                exit={{ opacity: 0, scale: 0.98, x: -20 }}
                                transition={{ duration: 0.3 }}
                            >
                                <div className="display-header">
                                    <span className="display-icon">{activeCat.icon}</span>
                                    <h3 className="display-title neon-text-purple">{activeCat.title}</h3>
                                    <span className="display-status">STATUS: {activeCat.status}</span>
                                </div>

                                <div className="upgrade-grid">
                                    {activeCat.skills.map((skill, j) => (
                                        <motion.div
                                            key={skill.name}
                                            className="upgrade-module"
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: j * 0.05 }}
                                        >
                                            <div className="module-top">
                                                <span className="module-type">{skill.type}</span>
                                                <span className="module-sync">{skill.sync}% SYNC</span>
                                            </div>
                                            <h4 className="module-name">{skill.name}</h4>
                                            {/* Tech meter instead of progress bar */}
                                            <div className="module-meter">
                                                {Array.from({ length: 10 }).map((_, idx) => (
                                                    <div 
                                                        key={idx} 
                                                        className={`meter-segment ${idx < Math.floor(skill.sync / 10) ? 'filled' : ''}`}
                                                    />
                                                ))}
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </section>
    )
}
