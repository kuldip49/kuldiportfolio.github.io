import { motion } from 'framer-motion'
import usePortfolioStore from '../store/usePortfolioStore'
import { sectionOrder, sectionLabels } from '../config/sectionPresets'

export default function Navigation() {
    const activeSection = usePortfolioStore((s) => s.activeSection)
    const setSection = usePortfolioStore((s) => s.setSection)

    const handleClick = (section) => {
        setSection(section)
        const el = document.getElementById(section)
        if (el) {
            el.scrollIntoView({ behavior: 'smooth' })
        }
    }

    return (
        <nav className="nav-dots" aria-label="Section navigation">
            {sectionOrder.map((section) => {
                const isActive = activeSection === section
                return (
                    <button
                        key={section}
                        className={`nav-dot ${isActive ? 'active' : ''}`}
                        onClick={() => handleClick(section)}
                        aria-label={`Navigate to ${sectionLabels[section]}`}
                    >
                        <motion.span
                            className="nav-dot-inner"
                            animate={{
                                scale: isActive ? 1.5 : 1,
                                backgroundColor: isActive ? '#a855f7' : 'rgba(255,255,255,0.25)',
                                boxShadow: isActive
                                    ? '0 0 12px rgba(168,85,247,0.6)'
                                    : '0 0 0px rgba(168,85,247,0)',
                            }}
                            transition={{ duration: 0.3 }}
                        />
                        <span className="nav-label">{sectionLabels[section]}</span>
                    </button>
                )
            })}
        </nav>
    )
}
