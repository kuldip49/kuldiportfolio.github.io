import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import usePortfolioStore from '../store/usePortfolioStore'
import { useRef } from 'react'

export default function CameraController() {
    const { camera } = useThree()
    const scrollProgress = usePortfolioStore((s) => s.scrollProgress)
    const mousePosition = usePortfolioStore((s) => s.mousePosition)
    
    const smoothMouse = useRef(new THREE.Vector2(0, 0))
    const smoothScroll = useRef(0)
    const lastScroll = useRef(0)
    const smoothShake = useRef({ x: 0, y: 0 })

    // Cinematic Keyframes for Focus Zones
    const keyframes = [
        { progress: 0.0, z: 150, y: 35, rx: -0.1 },   // Far Entry
        { progress: 0.15, z: 45, y: 15, rx: 0 },     // Hero
        { progress: 0.4, z: -70, y: 18, rx: 0.05 },  // Projects
        { progress: 0.65, z: -210, y: 22, rx: -0.05 }, // Skills
        { progress: 0.85, z: -380, y: 15, rx: 0 },    // Achievements
        { progress: 1.0, z: -550, y: 12, rx: 0.1 }     // Contact
    ]

    const getInterpolatedValue = (p) => {
        for (let i = 0; i < keyframes.length - 1; i++) {
            const current = keyframes[i]
            const next = keyframes[i + 1]
            if (p >= current.progress && p <= next.progress) {
                const alpha = (p - current.progress) / (next.progress - current.progress)
                const easeAlpha = THREE.MathUtils.smoothstep(alpha, 0, 1)
                
                return {
                    z: THREE.MathUtils.lerp(current.z, next.z, easeAlpha),
                    y: THREE.MathUtils.lerp(current.y, next.y, alpha),
                    rx: THREE.MathUtils.lerp(current.rx, next.rx, alpha)
                }
            }
        }
        return keyframes[keyframes.length - 1]
    }

    useFrame((state, delta) => {
        // 1. Smooth Scroll Interpolation
        smoothScroll.current = THREE.MathUtils.lerp(smoothScroll.current, scrollProgress, 0.04)
        const scrollDelta = (smoothScroll.current - lastScroll.current) * 100
        lastScroll.current = smoothScroll.current

        const target = getInterpolatedValue(smoothScroll.current)
        
        camera.position.z = THREE.MathUtils.lerp(camera.position.z, target.z, 0.08)
        const targetY = target.y + Math.cos(state.clock.elapsedTime * 0.5) * 0.5
        camera.position.y = THREE.MathUtils.lerp(camera.position.y, targetY, 0.05)

        // 2. Cinematic Mouse Look (Parallax)
        smoothMouse.current.x = THREE.MathUtils.lerp(smoothMouse.current.x, mousePosition[0], 0.04)
        smoothMouse.current.y = THREE.MathUtils.lerp(smoothMouse.current.y, mousePosition[1], 0.04)
        
        const targetRY = smoothMouse.current.x * 0.2
        const targetRX = target.rx + (smoothMouse.current.y * 0.15)
        
        camera.rotation.y = THREE.MathUtils.lerp(camera.rotation.y, targetRY, 0.05)
        camera.rotation.x = THREE.MathUtils.lerp(camera.rotation.x, targetRX + (scrollDelta * 0.01), 0.05)
        
        // 3. Cinematic Tilt (Rotation Z) — reduced intensity
        const targetRotateZ = (smoothMouse.current.x * -0.05) + (scrollDelta * -0.02)
        camera.rotation.z = THREE.MathUtils.lerp(camera.rotation.z, targetRotateZ, 0.05)

        // 4. Drone Bobbing & Smoothed Screen Shake (no raw Math.random jitter)
        const time = state.clock.elapsedTime
        const shakeIntensity = Math.abs(scrollDelta) * 0.08
        const targetShakeX = Math.sin(time * 17.3) * shakeIntensity
        const targetShakeY = Math.cos(time * 13.7) * shakeIntensity
        smoothShake.current.x = THREE.MathUtils.lerp(smoothShake.current.x, targetShakeX, 0.1)
        smoothShake.current.y = THREE.MathUtils.lerp(smoothShake.current.y, targetShakeY, 0.1)
        
        camera.position.x = Math.sin(time * 0.3) * 1.5 + (smoothMouse.current.x * 4) + smoothShake.current.x
        camera.position.y = THREE.MathUtils.lerp(camera.position.y, targetY + smoothShake.current.y, 0.05)
    })

    return null
}
