import { useEffect, useState } from 'react'
import { motion, useSpring } from 'framer-motion'

export default function CustomCursor() {
    const [isHovering, setIsHovering] = useState(false)
    const [isVisible, setIsVisible] = useState(false)

    // Spring physics for buttery smooth motion
    const springConfig = { damping: 25, stiffness: 400, mass: 0.5 }
    const cursorX = useSpring(-100, springConfig)
    const cursorY = useSpring(-100, springConfig)
    
    // Dot springs for tighter tracking
    const dotSpringConfig = { damping: 40, stiffness: 1000, mass: 0.1 }
    const dotX = useSpring(-100, dotSpringConfig)
    const dotY = useSpring(-100, dotSpringConfig)

    useEffect(() => {
        // Only enable custom cursor on non-touch devices
        const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0
        if (isTouchDevice) return

        setIsVisible(true)

        const onMove = (e) => {
            cursorX.set(e.clientX)
            cursorY.set(e.clientY)
            dotX.set(e.clientX)
            dotY.set(e.clientY)
        }

        const onEnterInteractive = () => setIsHovering(true)
        const onLeaveInteractive = () => setIsHovering(false)

        window.addEventListener('mousemove', onMove)

        // Observe interactive elements for hover state
        const observer = new MutationObserver(() => {
            const interactives = document.querySelectorAll('a, button, input, [role="button"], .interactive')
            interactives.forEach((el) => {
                el.removeEventListener('mouseenter', onEnterInteractive)
                el.removeEventListener('mouseleave', onLeaveInteractive)
                el.addEventListener('mouseenter', onEnterInteractive)
                el.addEventListener('mouseleave', onLeaveInteractive)
            })
        })

        observer.observe(document.body, { childList: true, subtree: true })

        // Initial pass
        const interactives = document.querySelectorAll('a, button, input, [role="button"], .interactive')
        interactives.forEach((el) => {
            el.addEventListener('mouseenter', onEnterInteractive)
            el.addEventListener('mouseleave', onLeaveInteractive)
        })

        return () => {
            window.removeEventListener('mousemove', onMove)
            observer.disconnect()
        }
    }, [cursorX, cursorY, dotX, dotY])

    if (!isVisible) return null

    return (
        <>
            <motion.div
                className="custom-cursor"
                style={{
                    x: cursorX,
                    y: cursorY,
                    transform: 'translate(-50%, -50%)',
                    position: 'fixed',
                    pointerEvents: 'none',
                    zIndex: 9999,
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    border: '1.5px solid',
                    mixBlendMode: 'difference',
                }}
                animate={{
                    scale: isHovering ? 2.5 : 1,
                    backgroundColor: isHovering ? 'rgba(168, 85, 247, 0.15)' : 'transparent',
                    borderColor: isHovering ? 'rgba(168, 85, 247, 0.8)' : 'rgba(168, 85, 247, 0.5)',
                }}
                transition={{ duration: 0.2 }}
            />
            <motion.div
                className="custom-cursor-dot"
                style={{
                    x: dotX,
                    y: dotY,
                    transform: 'translate(-50%, -50%)',
                    position: 'fixed',
                    pointerEvents: 'none',
                    zIndex: 9999,
                    width: '6px',
                    height: '6px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--color-accent-purple)',
                    boxShadow: '0 0 10px rgba(168, 85, 247, 0.8)',
                }}
                animate={{
                    scale: isHovering ? 0 : 1,
                    opacity: isHovering ? 0 : 1
                }}
                transition={{ duration: 0.2 }}
            />
        </>
    )
}
