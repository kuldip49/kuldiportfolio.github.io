import { useState, useCallback, useRef, useEffect } from 'react'

function Particle({ x, y, color, angle, speed, size }) {
    const ref = useRef(null)
    
    useEffect(() => {
        if (!ref.current) return
        const el = ref.current
        const vx = Math.cos(angle) * speed
        const vy = Math.sin(angle) * speed
        let px = 0, py = 0, opacity = 1, scale = 1
        let frame
        
        const animate = () => {
            px += vx
            py += vy + 1.5 // gravity
            opacity -= 0.02
            scale -= 0.01
            
            if (opacity <= 0) {
                el.style.display = 'none'
                return
            }
            
            el.style.transform = `translate(${px}px, ${py}px) scale(${Math.max(scale, 0)})`
            el.style.opacity = opacity
            frame = requestAnimationFrame(animate)
        }
        
        frame = requestAnimationFrame(animate)
        return () => cancelAnimationFrame(frame)
    }, [angle, speed])

    return (
        <div
            ref={ref}
            className="click-particle"
            style={{
                left: x,
                top: y,
                width: size,
                height: size,
                background: color,
                boxShadow: `0 0 ${size * 2}px ${color}, 0 0 ${size * 4}px ${color}`,
            }}
        />
    )
}

export default function ClickParticles() {
    const [particles, setParticles] = useState([])
    const idRef = useRef(0)

    const handleClick = useCallback((e) => {
        const colors = ['#00f0ff', '#8a2be2', '#ff003c', '#00ffaa', '#ffaa00', '#ff00ff']
        const count = 12 + Math.floor(Math.random() * 8)
        const newParticles = []
        
        for (let i = 0; i < count; i++) {
            newParticles.push({
                id: idRef.current++,
                x: e.clientX,
                y: e.clientY,
                color: colors[Math.floor(Math.random() * colors.length)],
                angle: (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.5,
                speed: 3 + Math.random() * 8,
                size: 3 + Math.random() * 5,
            })
        }
        
        setParticles(prev => [...prev.slice(-40), ...newParticles])
        
        // Clean up after animation completes
        setTimeout(() => {
            setParticles(prev => prev.filter(p => !newParticles.find(np => np.id === p.id)))
        }, 1500)
    }, [])

    useEffect(() => {
        window.addEventListener('click', handleClick)
        return () => window.removeEventListener('click', handleClick)
    }, [handleClick])

    return (
        <div className="click-particles-layer" aria-hidden="true">
            {particles.map(p => (
                <Particle key={p.id} {...p} />
            ))}
        </div>
    )
}
