import { Suspense } from 'react'
import { EffectComposer, Bloom, Noise, Vignette, SMAA } from '@react-three/postprocessing'
import CyberpunkCity from './CyberpunkCity'
import CameraController from './CameraController'
import MouseTracker from './MouseTracker'
import SkillsConstellation from './SkillsConstellation'

export default function Scene() {
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768

    return (
        <>
            {/* Cyberpunk Depth Fog (reduced to show more city) */}
            <fogExp2 attach="fog" args={['#050510', isMobile ? 0.008 : 0.004]} />
            
            {/* Ambient city light */}
            <ambientLight intensity={isMobile ? 1.0 : 0.8} color="#0a0a20" />
            <directionalLight position={[50, 100, 50]} intensity={3.5} color="#8a2be2" />
            
            {/* High-intensity street spotlights */}
            <spotLight position={[0, 80, -150]} intensity={isMobile ? 10.0 : 25.0} color="#00f0ff" angle={0.4} penumbra={1} distance={400} castShadow />

            <Suspense fallback={null}>
                <CyberpunkCity isMobile={isMobile} />
                <CameraController isMobile={isMobile} />
                <SkillsConstellation />
            </Suspense>

            <MouseTracker />

            <EffectComposer disableNormalPass>
                <SMAA />
                <Bloom
                    intensity={isMobile ? 0.8 : 1.5}
                    luminanceThreshold={0.3}
                    luminanceSmoothing={0.9}
                    mipmapBlur
                />
                {!isMobile && <Noise opacity={0.05} />}
                <Vignette eskil={false} offset={0.1} darkness={1.1} />
            </EffectComposer>
        </>
    )
}