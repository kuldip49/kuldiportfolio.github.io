import { motion } from 'framer-motion'
import usePortfolioStore from '../store/usePortfolioStore'

const LABELS = {
    hero: 'SYSTEM',
    projects: 'PROJECTS',
    skills: 'SKILLS',
    experience: 'EXPERIENCE',
    contact: 'CONTACT'
}
const sectionOrder = ['hero', 'projects', 'skills', 'experience', 'contact']

export default function Navigation() {
    const activeSection = usePortfolioStore((s) => s.activeSection)
    const setSection = usePortfolioStore((s) => s.setSection)

    return (
        <nav className="game-hud-menu" aria-label="Game Menu">
            <div className="hud-menu-container">
                {sectionOrder.map((section) => {
                    const isActive = activeSection === section
                    return (
                        <button
                            key={section}
                            className={`hud-menu-btn ${isActive ? 'active' : ''}`}
                            onClick={() => setSection(section)}
                            aria-label={`Navigate to ${section}`}
                        >
                            <span className="btn-bracket">[</span>
                            <span className="btn-label">{LABELS[section]}</span>
                            <span className="btn-bracket">]</span>
                        </button>
                    )
                })}
            </div>
        </nav>
    )
}
