import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import usePortfolioStore from '../store/usePortfolioStore'

export default function MouseTracker() {
    const setMouse = usePortfolioStore((s) => s.setMouse)
    const lastX = useRef(0)
    const lastY = useRef(0)

    useFrame(({ pointer }) => {
        // Only update zustand when mouse has moved significantly
        const dx = Math.abs(pointer.x - lastX.current)
        const dy = Math.abs(pointer.y - lastY.current)
        if (dx > 0.01 || dy > 0.01) {
            lastX.current = pointer.x
            lastY.current = pointer.y
            setMouse(pointer.x, pointer.y)
        }
    })

    return null
}
