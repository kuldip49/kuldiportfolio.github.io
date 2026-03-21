import { useEffect, useState } from 'react'

export default function CustomCursor() {
    const [pos, setPos] = useState({ x: -100, y: -100 })
    const [isHovering, setIsHovering] = useState(false)
    const [isVisible, setIsVisible] = useState(false)

    useEffect(() => {
        // Only enable custom cursor on non-touch devices
        const isTouchDevice = 'ontouchstart' in window
        if (isTouchDevice) return

        setIsVisible(true)

        const onMove = (e) => {
            setPos({ x: e.clientX, y: e.clientY })
        }

        const onEnterInteractive = () => setIsHovering(true)
        const onLeaveInteractive = () => setIsHovering(false)

        window.addEventListener('mousemove', onMove)

        // Observe interactive elements for hover state
        const observer = new MutationObserver(() => {
            const interactives = document.querySelectorAll('a, button, input, textarea, [role="button"]')
            interactives.forEach((el) => {
                el.removeEventListener('mouseenter', onEnterInteractive)
                el.removeEventListener('mouseleave', onLeaveInteractive)
                el.addEventListener('mouseenter', onEnterInteractive)
                el.addEventListener('mouseleave', onLeaveInteractive)
            })
        })

        observer.observe(document.body, { childList: true, subtree: true })

        // Initial pass
        const interactives = document.querySelectorAll('a, button, input, textarea, [role="button"]')
        interactives.forEach((el) => {
            el.addEventListener('mouseenter', onEnterInteractive)
            el.addEventListener('mouseleave', onLeaveInteractive)
        })

        return () => {
            window.removeEventListener('mousemove', onMove)
            observer.disconnect()
        }
    }, [])

    if (!isVisible) return null

    return (
        <>
            <div
                className="custom-cursor"
                style={{
                    left: pos.x,
                    top: pos.y,
                    transform: `translate(-50%, -50%) scale(${isHovering ? 2.5 : 1})`,
                }}
            />
            <div
                className="custom-cursor-dot"
                style={{
                    left: pos.x,
                    top: pos.y,
                }}
            />
        </>
    )
}
