import { useFrame, useThree } from '@react-three/fiber'
import usePortfolioStore from '../store/usePortfolioStore'

export default function MouseTracker() {
    const setMouse = usePortfolioStore((s) => s.setMouse)

    useFrame(({ pointer }) => {
        setMouse(pointer.x, pointer.y)
    })

    return null
}
