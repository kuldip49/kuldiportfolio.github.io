import { useRef, useMemo, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { MeshReflectorMaterial, Float, Text } from '@react-three/drei'

const SkyscraperMaterial = ({ color, isMobile }) => {
    const materialRef = useRef()
    
    useFrame((state) => {
        if (materialRef.current) {
            materialRef.current.userData.shader.uniforms.uTime.value = state.clock.getElapsedTime()
            materialRef.current.userData.shader.uniforms.uCameraPos.value.copy(state.camera.position)
        }
    })

    return (
        <meshStandardMaterial
            ref={materialRef}
            color={color}
            roughness={0.2}
            metalness={0.9}
            onBeforeCompile={(shader) => {
                shader.uniforms.uTime = { value: 0 }
                shader.uniforms.uCameraPos = { value: new THREE.Vector3() }
                
                shader.vertexShader = shader.vertexShader.replace(
                    '#include <common>',
                    `#include <common>
                     varying vec3 vWorldPos;`
                ).replace(
                    '#include <worldpos_vertex>',
                    `#include <worldpos_vertex>
                     vWorldPos = (modelMatrix * instanceMatrix * vec4(transformed, 1.0)).xyz;`
                )

                shader.fragmentShader = shader.fragmentShader.replace(
                    '#include <common>',
                    `#include <common>
                     varying vec3 vWorldPos;
                     uniform float uTime;
                     uniform vec3 uCameraPos;

                     float hash(vec3 p) {
                         p = fract(p * 0.3183099 + .1);
                         p *= 17.0;
                         return fract(p.x * p.y * p.z * (p.x + p.y + p.z));
                     }
                    `
                ).replace(
                    '#include <emissivemap_fragment>',
                    `#include <emissivemap_fragment>
                     
                     // Procedural Windows
                     vec3 grid = fract(vWorldPos * vec3(0.5, 0.4, 0.5));
                     vec3 id = floor(vWorldPos * vec3(0.5, 0.4, 0.5));
                     
                     float w = step(0.1, grid.x) * step(0.1, grid.y) * step(0.1, grid.z);
                     float h = hash(id);
                     
                     vec3 windowColor = vec3(0.0);
                     if (h > 0.8) {
                        float flicker = sin(uTime * 2.0 + h * 10.0) * 0.5 + 0.5;
                        windowColor = (h > 0.95 ? vec3(0.0, 0.9, 1.0) : vec3(0.5, 0.2, 1.0)) * flicker;
                     }
                     
                     // Proximity Glow
                     float dist = distance(vWorldPos.z, uCameraPos.z);
                     float proximity = smoothstep(60.0, 0.0, dist) * 0.5;
                     vec3 pulseColor = vec3(0.5, 0.0, 1.0) * (sin(uTime * 3.0) * 0.5 + 0.5) * proximity;
                     
                     totalEmissiveRadiance += (windowColor * 1.5 + pulseColor) * w;
                    `
                )
                materialRef.current.userData.shader = shader
            }}
        />
    )
}

function TrafficStreaks({ cityLength }) {
    const meshRef = useRef()
    const count = 40
    const dummy = new THREE.Object3D()
    
    const streaks = useMemo(() => {
        return Array.from({ length: count }, () => ({
            x: (Math.random() > 0.5 ? 1 : -1) * (15 + Math.random() * 5),
            z: Math.random() * -cityLength,
            speed: 50 + Math.random() * 100,
            len: 10 + Math.random() * 30,
            color: Math.random() > 0.5 ? '#00f0ff' : '#ff003c'
        }))
    }, [cityLength])

    useFrame((state, delta) => {
        streaks.forEach((s, i) => {
            s.z += s.speed * delta
            if (s.z > 50) s.z = -cityLength
            
            dummy.position.set(s.x, 0.2, s.z)
            dummy.scale.set(0.2, 0.1, s.len)
            dummy.updateMatrix()
            meshRef.current.setMatrixAt(i, dummy.matrix)
        })
        meshRef.current.instanceMatrix.needsUpdate = true
    })

    return (
        <instancedMesh ref={meshRef} args={[null, null, count]}>
            <boxGeometry args={[1, 1, 1]} />
            <meshBasicMaterial toneMapped={false} transparent opacity={0.6} />
        </instancedMesh>
    )
}

export default function CyberpunkCity({ isMobile }) {
    const buildingRefs = {
        block: useRef(),
        tower: useRef(),
        spire: useRef(),
        neon: useRef(),
    }
    const rainRef = useRef()

    const buildingCount = isMobile ? 120 : 400
    const roadWidth = 35
    const cityLength = 500

    useEffect(() => {
        const dummy = new THREE.Object3D()
        const color = new THREE.Color()
        const neonPalette = [0x8a2be2, 0x00f0ff, 0xff003c]

        const counts = { block: 0, tower: 0, spire: 0 }
        
        for (let i = 0; i < buildingCount; i++) {
            const type = i % 3 === 0 ? 'block' : i % 3 === 1 ? 'tower' : 'spire'
            const ref = buildingRefs[type]
            if (!ref.current) continue

            const z = -Math.random() * cityLength + 100
            const isLeft = Math.random() > 0.5
            const xOffset = roadWidth + (Math.random() * 80)
            const x = isLeft ? -xOffset : xOffset

            let w, h, d
            if (type === 'block') { w = 15; h = 35; d = 15 }
            else if (type === 'tower') { w = 10; h = 75; d = 10 }
            else { w = 8; h = 130; d = 8 }

            w *= (0.7 + Math.random() * 0.6)
            h *= (0.7 + Math.random() * 0.6)
            d *= (0.7 + Math.random() * 0.6)

            dummy.position.set(x, h / 2, z)
            dummy.scale.set(w, h, d)
            dummy.updateMatrix()
            
            ref.current.setMatrixAt(counts[type], dummy.matrix)
            
            if (buildingRefs.neon.current) {
                dummy.scale.set(w * 1.02, 0.4, d * 1.02)
                const bands = isMobile ? 1 : 4
                for (let j = 0; j < bands; j++) {
                    dummy.position.y = (h / (bands + 1)) * (j + 1)
                    dummy.updateMatrix()
                    buildingRefs.neon.current.setMatrixAt(i * bands + j, dummy.matrix)
                    
                    color.set(neonPalette[Math.floor(Math.random() * neonPalette.length)])
                    if (Math.random() > 0.4) color.multiplyScalar(2.5)
                    buildingRefs.neon.current.setColorAt(i * bands + j, color)
                }
            }
            
            counts[type]++
        }

        Object.values(buildingRefs).forEach(ref => {
            if (ref.current) {
                ref.current.instanceMatrix.needsUpdate = true
                if (ref.current.instanceColor) ref.current.instanceColor.needsUpdate = true
            }
        })
    }, [isMobile, buildingCount])

    const rainCount = isMobile ? 800 : 3000
    const rainPositions = useMemo(() => {
        const pos = new Float32Array(rainCount * 3)
        for (let i = 0; i < rainCount; i++) {
            pos[i * 3] = (Math.random() - 0.5) * 300
            pos[i * 3 + 1] = Math.random() * 150
            pos[i * 3 + 2] = (Math.random() - 0.5) * cityLength + 50
        }
        return pos
    }, [isMobile, rainCount, cityLength])

    const flickerColor = useRef(new THREE.Color())

    useFrame((state, delta) => {
        if (rainRef.current) {
            const positions = rainRef.current.geometry.attributes.position.array
            for (let i = 0; i < rainCount; i++) {
                positions[i * 3 + 1] -= delta * 65.0
                positions[i * 3] -= delta * 15.0 // Diagonal rain
                if (positions[i * 3 + 1] < 0) {
                    positions[i * 3 + 1] = 150
                    positions[i * 3] = (Math.random() - 0.5) * 300
                }
            }
            rainRef.current.geometry.attributes.position.needsUpdate = true
        }

        // Flickering Neon Bands (reduced to 2 per frame for performance)
        if (buildingRefs.neon.current) {
            const bands = isMobile ? 1 : 4
            const totalBands = buildingCount * bands
            for (let i = 0; i < 2; i++) {
                const idx = Math.floor(Math.random() * totalBands)
                buildingRefs.neon.current.getColorAt(idx, flickerColor.current)
                const flicker = Math.random() > 0.9 ? 0.3 : 1.5
                flickerColor.current.multiplyScalar(flicker)
                buildingRefs.neon.current.setColorAt(idx, flickerColor.current)
            }
            buildingRefs.neon.current.instanceColor.needsUpdate = true
        }
    })

    return (
        <group>
            <instancedMesh ref={buildingRefs.block} args={[null, null, buildingCount]}>
                <boxGeometry args={[1, 1, 1]} />
                <SkyscraperMaterial color="#0a0a1a" isMobile={isMobile} />
            </instancedMesh>
            <instancedMesh ref={buildingRefs.tower} args={[null, null, buildingCount]}>
                <boxGeometry args={[1, 1, 1]} />
                <SkyscraperMaterial color="#080815" isMobile={isMobile} />
            </instancedMesh>
            <instancedMesh ref={buildingRefs.spire} args={[null, null, buildingCount]}>
                <boxGeometry args={[1, 1, 1]} />
                <SkyscraperMaterial color="#050510" isMobile={isMobile} />
            </instancedMesh>

            <instancedMesh ref={buildingRefs.neon} args={[null, null, buildingCount * (isMobile ? 1 : 4)]}>
                <boxGeometry args={[1, 1, 1]} />
                <meshBasicMaterial toneMapped={false} />
            </instancedMesh>

            <TrafficStreaks cityLength={cityLength} />

            {[
                { pos: [-roadWidth - 20, 60, -120], rot: [0, Math.PI / 4, 0], color: '#00f0ff', text: 'PROJECTS' },
                { pos: [roadWidth + 20, 75, -280], rot: [0, -Math.PI / 4, 0], color: '#8a2be2', text: 'SKILLS' },
                { pos: [-roadWidth - 25, 90, -450], rot: [0, Math.PI / 6, 0], color: '#ff003c', text: 'ACHIEVEMENTS' },
            ].map((b, i) => (
                <group key={i} position={b.pos} rotation={b.rot}>
                    {!isMobile && (
                        <mesh>
                            <planeGeometry args={[35, 20]} />
                            <meshBasicMaterial color={b.color} transparent opacity={0.12} />
                        </mesh>
                    )}
                    <Text
                        position={[0, 0, 0.2]}
                        fontSize={isMobile ? 5 : 4}
                        color={b.color}
                        font={`${import.meta.env.BASE_URL}SpaceGrotesk.ttf`}
                        anchorX="center"
                        anchorY="middle"
                    >
                        {b.text}
                    </Text>
                </group>
            ))}

            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.1, -150]}>
                <planeGeometry args={[roadWidth * 8, cityLength * 2]} />
                {isMobile ? (
                    <meshStandardMaterial color="#020202" roughness={0.3} metalness={0.7} />
                ) : (
                    <MeshReflectorMaterial
                        blur={[400, 100]}
                        resolution={512}
                        mixBlur={1}
                        mixStrength={70}
                        roughness={1}
                        depthScale={1.5}
                        minDepthThreshold={0.4}
                        maxDepthThreshold={1.8}
                        color="#050505"
                        metalness={0.5}
                    />
                )}
            </mesh>

            <points ref={rainRef}>
                <bufferGeometry>
                    <bufferAttribute attach="attributes-position" count={rainCount} array={rainPositions} itemSize={3} />
                </bufferGeometry>
                <pointsMaterial size={isMobile ? 0.3 : 0.18} color="#77aaff" transparent opacity={0.3} depthWrite={false} blending={THREE.AdditiveBlending} />
            </points>
        </group>
    )
}



