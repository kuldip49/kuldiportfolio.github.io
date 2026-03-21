import { Suspense } from 'react'
import { EffectComposer, Bloom } from '@react-three/postprocessing'
import ParticleField from './ParticleField'
import MouseTracker from './MouseTracker'

export default function Scene() {
    return (
        <>
            <ambientLight intensity={0.15} />

            <Suspense fallback={null}>
                <ParticleField />
            </Suspense>

            <MouseTracker />

            <EffectComposer>
                <Bloom
                    intensity={0.8}
                    luminanceThreshold={0.1}
                    luminanceSmoothing={0.9}
                    mipmapBlur
                />
            </EffectComposer>
        </>
    )
}
