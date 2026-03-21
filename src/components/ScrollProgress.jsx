import { useEffect } from 'react'
import { motion, useScroll, useSpring } from 'framer-motion'
import usePortfolioStore from '../store/usePortfolioStore'

export default function ScrollProgress() {
    const { scrollYProgress } = useScroll()
    const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30 })
    const setScrollProgress = usePortfolioStore((s) => s.setScrollProgress)

    useEffect(() => {
        return scrollYProgress.on('change', (v) => {
            setScrollProgress(v)
        })
    }, [scrollYProgress, setScrollProgress])

    return (
        <motion.div
            className="scroll-progress"
            style={{ scaleX, transformOrigin: '0%' }}
        />
    )
}
