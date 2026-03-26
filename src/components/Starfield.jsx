import { useMemo } from 'react'

export default function Starfield() {
    const stars = useMemo(() => {
        return Array.from({ length: 80 }, (_, i) => ({
            id: i,
            left: Math.random() * 100,
            top: Math.random() * 100,
            size: Math.random() * 2.5 + 0.5,
            delay: Math.random() * 5,
            duration: Math.random() * 3 + 2,
            opacity: Math.random() * 0.6 + 0.2,
        }))
    }, [])

    return (
        <div className="starfield" aria-hidden="true">
            {stars.map((star) => (
                <div
                    key={star.id}
                    className="star"
                    style={{
                        left: `${star.left}%`,
                        top: `${star.top}%`,
                        width: `${star.size}px`,
                        height: `${star.size}px`,
                        opacity: star.opacity,
                        animationDelay: `${star.delay}s`,
                        animationDuration: `${star.duration}s`,
                    }}
                />
            ))}
        </div>
    )
}
