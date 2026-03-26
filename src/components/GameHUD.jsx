import { useEffect, useState, useRef } from 'react'
import { motion, useSpring, useTransform } from 'framer-motion'
import usePortfolioStore from '../store/usePortfolioStore'

const sectionXP = {
    hero: { label: 'SYSTEM::BOOT', xp: 0 },
    projects: { label: 'DATA_VAULT::ACCESSED', xp: 200 },
    skills: { label: 'CORE_SCAN::COMPLETE', xp: 450 },
    experience: { label: 'ARCHIVE::DECODED', xp: 700 },
    contact: { label: 'UPLINK::ESTABLISHED', xp: 1000 },
}

export default function GameHUD() {
    const theme = usePortfolioStore((s) => s.theme)
    const toggleTheme = usePortfolioStore((s) => s.toggleTheme)
    const energy = usePortfolioStore((s) => s.energy)
    const addEnergy = usePortfolioStore((s) => s.addEnergy)
    
    const activeSection = usePortfolioStore((s) => s.activeSection)
    const [visitedSections, setVisitedSections] = useState(new Set(['hero']))
    const [clicks, setClicks] = useState(0)
    const [showLevelUp, setShowLevelUp] = useState(false)
    const lastSection = useRef('hero')

    // Recharge Energy loop
    useEffect(() => {
        const interval = setInterval(() => {
            addEnergy(1)
        }, 500)
        return () => clearInterval(interval)
    }, [addEnergy])

    // Update visited logic
    useEffect(() => {
        if (!visitedSections.has(activeSection)) {
            setVisitedSections(prev => new Set([...prev, activeSection]))
        }
    }, [activeSection, visitedSections])

    // XP based on exploration + clicks
    const xp = Math.min(1000, (visitedSections.size - 1) * 200 + clicks * 5)
    const level = Math.floor(xp / 250) + 1
    const xpInLevel = xp % 250
    const xpBarWidth = (xpInLevel / 250) * 100

    const springXP = useSpring(xpBarWidth, { stiffness: 100, damping: 20 })
    const displayXPWidth = useTransform(springXP, v => `${v}%`)
    
    const springEnergy = useSpring(energy, { stiffness: 100, damping: 20 })
    const displayEnergyWidth = useTransform(springEnergy, v => `${v}%`)

    useEffect(() => {
        springXP.set(xpBarWidth)
        springEnergy.set(energy)
    }, [xpBarWidth, energy, springXP, springEnergy])

    // Count clicks for bonus stats
    useEffect(() => {
        const handleClick = () => setClicks(c => c + 1)
        window.addEventListener('click', handleClick)
        return () => window.removeEventListener('click', handleClick)
    }, [])

    // Level up flash
    useEffect(() => {
        if (activeSection !== lastSection.current && sectionXP[activeSection]) {
            lastSection.current = activeSection
            setShowLevelUp(true)
            setTimeout(() => setShowLevelUp(false), 2000)
        }
    }, [activeSection])

    const sectionInfo = sectionXP[activeSection] || sectionXP.hero

    return (
        <>
            <div className="game-hud">
                <div className="hud-top">
                    {/* Level Display */}
                    <div className="hud-level">
                        <span className="hud-label">LVL</span>
                        <span className="hud-value">{level}</span>
                    </div>

                    {/* Resources (XP + ENERGY) */}
                    <div className="hud-resources">
                        <div className="hud-bar-container">
                            <span className="hud-label">EXP</span>
                            <div className="hud-xp-bar-bg">
                                <motion.div className="hud-xp-bar-fill" style={{ width: displayXPWidth }} />
                            </div>
                            <span className="hud-bar-value">{xp}</span>
                        </div>
                        <div className="hud-bar-container">
                            <span className="hud-label">ENR</span>
                            <div className="hud-energy-bar-bg">
                                <motion.div className="hud-energy-bar-fill" style={{ width: displayEnergyWidth }} />
                            </div>
                            <span className="hud-bar-value">{energy}%</span>
                        </div>
                    </div>

                    {/* Controls & Stats */}
                    <div className="hud-controls">
                        <span className="hud-stat">⚡ {clicks}</span>
                        <button 
                            className="hud-theme-toggle" 
                            onClick={toggleTheme}
                            title="Toggle Override Theme"
                        >
                            {theme === 'dark' ? 'OVERRIDE_ON' : 'OVERRIDE_OFF'}
                        </button>
                    </div>
                </div>
            </div>

            {/* Section unlock notification */}
            {showLevelUp && (
                <motion.div
                    className="section-unlock"
                    initial={{ opacity: 0, y: 30, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.4, ease: [0.25, 1, 0.5, 1] }}
                >
                    <div className="unlock-icon">◈</div>
                    <div className="unlock-text">
                        <span className="unlock-label">{sectionInfo.label}</span>
                        <span className="unlock-xp">+{sectionInfo.xp} XP</span>
                    </div>
                </motion.div>
            )}
        </>
    )
}
