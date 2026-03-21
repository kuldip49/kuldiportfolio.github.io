import { useRef, useMemo, useEffect } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import usePortfolioStore from '../store/usePortfolioStore'

/* ═══════════════════════════════════════════════
   Simplex noise helper (compact, self-contained)
   ═══════════════════════════════════════════════ */
const F3 = 1.0 / 3.0, G3 = 1.0 / 6.0
const grad3 = [[1,1,0],[-1,1,0],[1,-1,0],[-1,-1,0],[1,0,1],[-1,0,1],[1,0,-1],[-1,0,-1],[0,1,1],[0,-1,1],[0,1,-1],[0,-1,-1]]
const perm = new Uint8Array(512)
const p = [151,160,137,91,90,15,131,13,201,95,96,53,194,233,7,225,140,36,103,30,69,142,8,99,37,240,21,10,23,190,6,148,
247,120,234,75,0,26,197,62,94,252,219,203,117,35,11,32,57,177,33,88,237,149,56,87,174,20,125,136,171,168,68,175,
74,165,71,134,139,48,27,166,77,146,158,231,83,111,229,122,60,211,133,230,220,105,92,41,55,46,245,40,244,102,143,
54,65,25,63,161,1,216,80,73,209,76,132,187,208,89,18,169,200,196,135,130,116,188,159,86,164,100,109,198,173,186,
3,64,52,217,226,250,124,123,5,202,38,147,118,126,255,82,85,212,207,206,59,227,47,16,58,17,182,189,28,42,223,183,
170,213,119,248,152,2,44,154,163,70,221,153,101,155,167,43,172,9,129,22,39,253,19,98,108,110,79,113,224,232,178,
185,112,104,218,246,97,228,251,34,242,193,238,210,144,12,191,179,162,241,81,51,145,235,249,14,239,107,49,192,214,
31,181,199,106,157,184,84,204,176,115,121,50,45,127,4,150,254,138,236,205,93,222,114,67,29,24,72,243,141,128,195,
78,66,215,61,156,180]
for (let i = 0; i < 256; i++) { perm[i] = p[i]; perm[i + 256] = p[i] }

function noise3D(x, y, z) {
    let s = (x + y + z) * F3
    let i = Math.floor(x + s), j = Math.floor(y + s), k = Math.floor(z + s)
    let t = (i + j + k) * G3
    let X0 = i - t, Y0 = j - t, Z0 = k - t
    let x0 = x - X0, y0 = y - Y0, z0 = z - Z0
    let i1, j1, k1, i2, j2, k2
    if (x0 >= y0) {
        if (y0 >= z0) { i1=1;j1=0;k1=0;i2=1;j2=1;k2=0 }
        else if (x0 >= z0) { i1=1;j1=0;k1=0;i2=1;j2=0;k2=1 }
        else { i1=0;j1=0;k1=1;i2=1;j2=0;k2=1 }
    } else {
        if (y0 < z0) { i1=0;j1=0;k1=1;i2=0;j2=1;k2=1 }
        else if (x0 < z0) { i1=0;j1=1;k1=0;i2=0;j2=1;k2=1 }
        else { i1=0;j1=1;k1=0;i2=1;j2=1;k2=0 }
    }
    let x1=x0-i1+G3, y1=y0-j1+G3, z1=z0-k1+G3
    let x2=x0-i2+2*G3, y2=y0-j2+2*G3, z2=z0-k2+2*G3
    let x3=x0-1+3*G3, y3=y0-1+3*G3, z3=z0-1+3*G3
    let ii = i & 255, jj = j & 255, kk = k & 255
    let n0=0, n1=0, n2=0, n3=0
    let t0 = 0.6 - x0*x0 - y0*y0 - z0*z0
    if (t0 > 0) { t0 *= t0; let gi = perm[ii + perm[jj + perm[kk]]] % 12; n0 = t0*t0*(grad3[gi][0]*x0+grad3[gi][1]*y0+grad3[gi][2]*z0)}
    let t1 = 0.6 - x1*x1 - y1*y1 - z1*z1
    if (t1 > 0) { t1 *= t1; let gi = perm[ii+i1+perm[jj+j1+perm[kk+k1]]] % 12; n1 = t1*t1*(grad3[gi][0]*x1+grad3[gi][1]*y1+grad3[gi][2]*z1)}
    let t2 = 0.6 - x2*x2 - y2*y2 - z2*z2
    if (t2 > 0) { t2 *= t2; let gi = perm[ii+i2+perm[jj+j2+perm[kk+k2]]] % 12; n2 = t2*t2*(grad3[gi][0]*x2+grad3[gi][1]*y2+grad3[gi][2]*z2)}
    let t3 = 0.6 - x3*x3 - y3*y3 - z3*z3
    if (t3 > 0) { t3 *= t3; let gi = perm[ii+1+perm[jj+1+perm[kk+1]]] % 12; n3 = t3*t3*(grad3[gi][0]*x3+grad3[gi][1]*y3+grad3[gi][2]*z3)}
    return 32.0 * (n0 + n1 + n2 + n3)
}

/* ═══════════════════════════════════════════════
   Helper
   ═══════════════════════════════════════════════ */
function lerp(a, b, t) { return a + (b - a) * t }

function isMobile() {
    return typeof window !== 'undefined' && window.innerWidth < 768
}

/* ═══════════════════════════════════════════════
   Shooting Data Packet sub-component
   ═══════════════════════════════════════════════ */
function DataPackets({ nodePositions, count }) {
    const meshRef = useRef()
    const packets = useMemo(() => {
        const arr = []
        for (let i = 0; i < count; i++) {
            const startIdx = Math.floor(Math.random() * (nodePositions.length / 3))
            let endIdx = Math.floor(Math.random() * (nodePositions.length / 3))
            while (endIdx === startIdx) endIdx = Math.floor(Math.random() * (nodePositions.length / 3))
            arr.push({
                startIdx,
                endIdx,
                progress: Math.random(),
                speed: 0.1 + Math.random() * 0.2, // Slower speed
                delay: Math.random() * 8,
                active: false,
            })
        }
        return arr
    }, [nodePositions, count])

    const dummy = useMemo(() => new THREE.Object3D(), [])

    useFrame((state) => {
        if (!meshRef.current) return
        const time = state.clock.elapsedTime

        packets.forEach((p, i) => {
            if (time > p.delay) p.active = true
            if (!p.active) {
                dummy.position.set(0, 0, -1000)
                dummy.scale.setScalar(0)
                dummy.updateMatrix()
                meshRef.current.setMatrixAt(i, dummy.matrix)
                return
            }

            p.progress += p.speed * 0.016
            if (p.progress > 1) {
                p.progress = 0
                p.startIdx = p.endIdx
                p.endIdx = Math.floor(Math.random() * (nodePositions.length / 3))
                p.delay = time + 2 + Math.random() * 5
                p.active = false
            }

            const si = p.startIdx * 3
            const ei = p.endIdx * 3
            const t = p.progress
            const x = lerp(nodePositions[si], nodePositions[ei], t)
            const y = lerp(nodePositions[si + 1], nodePositions[ei + 1], t)
            const z = lerp(nodePositions[si + 2], nodePositions[ei + 2], t)

            dummy.position.set(x, y, z)
            const pulse = 0.8 + Math.sin(t * Math.PI) * 0.6
            dummy.scale.setScalar(pulse * 0.03) // Slightly smaller
            dummy.updateMatrix()
            meshRef.current.setMatrixAt(i, dummy.matrix)
        })

        meshRef.current.instanceMatrix.needsUpdate = true
    })

    return (
        <instancedMesh ref={meshRef} args={[null, null, count]}>
            <sphereGeometry args={[1, 6, 6]} />
            <meshBasicMaterial color="#00f0ff" transparent opacity={0.7} />
        </instancedMesh>
    )
}

/* ═══════════════════════════════════════════════
   Main Neural Network Background
   ═══════════════════════════════════════════════ */
export default function ParticleField() {
    const groupRef = useRef()
    const pointsRef = useRef()
    const linesRef = useRef()
    const targetPreset = usePortfolioStore((s) => s.targetPreset)
    const mousePosition = usePortfolioStore((s) => s.mousePosition)

    const mobile = useMemo(() => isMobile(), [])
    // Increased density for a much more active, animated background
    const nodeCount = mobile ? 500 : 1500 
    const connectionDistance = mobile ? 1.0 : 0.85
    // Double the connections for a dense web
    const maxConnections = mobile ? 300 : 1200
    const packetCount = mobile ? 8 : 25

    // ── Node positions & velocities ──
    const { basePositions, positions } = useMemo(() => {
        const basePositions = new Float32Array(nodeCount * 3)
        const positions = new Float32Array(nodeCount * 3)

        for (let i = 0; i < nodeCount; i++) {
            const i3 = i * 3
            const theta = Math.random() * Math.PI * 2
            const phi = Math.acos(2 * Math.random() - 1)
            const r = 1.0 + Math.random() * 2.5

            basePositions[i3] = r * Math.sin(phi) * Math.cos(theta)
            basePositions[i3 + 1] = r * Math.sin(phi) * Math.sin(theta)
            basePositions[i3 + 2] = r * Math.cos(phi)

            positions[i3] = basePositions[i3]
            positions[i3 + 1] = basePositions[i3 + 1]
            positions[i3 + 2] = basePositions[i3 + 2]
        }
        return { basePositions, positions }
    }, [nodeCount])

    const nodeRandoms = useMemo(() => {
        const arr = new Float32Array(nodeCount)
        for (let i = 0; i < nodeCount; i++) arr[i] = Math.random()
        return arr
    }, [nodeCount])

    // ── Node shader ──
    const nodeMaterial = useMemo(() => {
        return new THREE.ShaderMaterial({
            uniforms: {
                uTime: { value: 0 },
                uColor1: { value: new THREE.Vector3(0.0, 0.94, 1.0) },
                uColor2: { value: new THREE.Vector3(0.54, 0.17, 0.89) },
                uMouse: { value: new THREE.Vector2(0, 0) },
                uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) },
            },
            vertexShader: `
                uniform float uTime;
                uniform vec2 uMouse;
                uniform float uPixelRatio;

                attribute float aRandom;

                varying float vAlpha;
                varying float vColorMix;

                void main() {
                    vec3 pos = position;

                    vec4 mvPos = modelViewMatrix * vec4(pos, 1.0);
                    gl_Position = projectionMatrix * mvPos;

                    // Slow down pulse significantly
                    float pulse = 0.8 + 0.2 * sin(uTime * 0.5 + aRandom * 6.28);
                    
                    // Depth based sizing (Foreground bright and sharp, Background dim and small)
                    float depthFactor = smoothstep(6.0, 1.0, -mvPos.z);
                    float baseSize = mix(1.0, 4.0, depthFactor * aRandom);
                    
                    gl_PointSize = baseSize * pulse * uPixelRatio * (1.5 / -mvPos.z);

                    // Deeper fade out for background particles
                    vAlpha = mix(0.05, 0.8, depthFactor) * pulse;
                    vColorMix = smoothstep(-2.0, 2.0, pos.y) * 0.5 + aRandom * 0.5;
                }
            `,
            fragmentShader: `
                uniform vec3 uColor1;
                uniform vec3 uColor2;
                uniform float uTime;

                varying float vAlpha;
                varying float vColorMix;

                void main() {
                    float d = length(gl_PointCoord - 0.5);
                    if (d > 0.5) discard;

                    float strength = 1.0 - smoothstep(0.0, 0.5, d);
                    strength = pow(strength, 2.0); // Tighter glow radius

                    vec3 color = mix(uColor1, uColor2, vColorMix);
                    color += vec3(0.2) * pow(strength, 4.0);

                    gl_FragColor = vec4(color, strength * vAlpha);
                }
            `,
            transparent: true,
            depthWrite: false,
            blending: THREE.AdditiveBlending,
        })
    }, [])

    // ── Connection lines buffer ──
    const linePositions = useMemo(() => new Float32Array(maxConnections * 6), [maxConnections])
    const lineColors = useMemo(() => new Float32Array(maxConnections * 6), [maxConnections])

    const lineGeometry = useMemo(() => {
        const geo = new THREE.BufferGeometry()
        geo.setAttribute('position', new THREE.BufferAttribute(linePositions, 3))
        geo.setAttribute('color', new THREE.BufferAttribute(lineColors, 3))
        geo.setDrawRange(0, 0)
        return geo
    }, [linePositions, lineColors])

    const lineMaterial = useMemo(() => {
        return new THREE.LineBasicMaterial({
            vertexColors: true,
            transparent: true,
            opacity: 0.25, // Increased line opacity for more visible connections
            blending: THREE.AdditiveBlending,
            depthWrite: false,
        })
    }, [])

    const nodeGeometry = useMemo(() => {
        const geo = new THREE.BufferGeometry()
        geo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
        geo.setAttribute('aRandom', new THREE.BufferAttribute(nodeRandoms, 1))
        return geo
    }, [positions, nodeRandoms])

    const smoothMouse = useRef(new THREE.Vector2(0, 0))

    useFrame((state) => {
        // Sped up global time for a more animated, active feel
        const time = state.clock.elapsedTime * 1.2
        const mat = nodeMaterial

        mat.uniforms.uTime.value = time

        smoothMouse.current.x = lerp(smoothMouse.current.x, mousePosition[0], 0.02)
        smoothMouse.current.y = lerp(smoothMouse.current.y, mousePosition[1], 0.02)
        mat.uniforms.uMouse.value.copy(smoothMouse.current)

        const tc1 = targetPreset.particleColor
        const tc2 = targetPreset.glowColor
        const uc1 = mat.uniforms.uColor1.value
        const uc2 = mat.uniforms.uColor2.value
        uc1.x = lerp(uc1.x, tc1[0], 0.01)
        uc1.y = lerp(uc1.y, tc1[1], 0.01)
        uc1.z = lerp(uc1.z, tc1[2], 0.01)
        uc2.x = lerp(uc2.x, tc2[0], 0.01)
        uc2.y = lerp(uc2.y, tc2[1], 0.01)
        uc2.z = lerp(uc2.z, tc2[2], 0.01)

        // Increased noise speed and scale for fluid motion
        const noiseSpeed = 0.2
        const noiseScale = 0.4
        const mouseInfluence = 1.0
        const mx = smoothMouse.current.x * 2
        const my = smoothMouse.current.y * 2

        for (let i = 0; i < nodeCount; i++) {
            const i3 = i * 3
            const bx = basePositions[i3]
            const by = basePositions[i3 + 1]
            const bz = basePositions[i3 + 2]

            const nx = noise3D(bx * 0.4 + time * noiseSpeed, by * 0.4, bz * 0.4) * noiseScale
            const ny = noise3D(bx * 0.4, by * 0.4 + time * noiseSpeed, bz * 0.4 + 1.5) * noiseScale
            const nz = noise3D(bx * 0.4 + 2.5, by * 0.4, bz * 0.4 + time * noiseSpeed) * noiseScale

            let px = bx + nx
            let py = by + ny
            let pz = bz + nz

            const dx = px - mx
            const dy = py - my
            const distSq = dx * dx + dy * dy + pz * pz
            const dist = Math.sqrt(distSq)
            if (dist < 2.0 && dist > 0.01) {
                const force = (2.0 - dist) * 0.08 * mouseInfluence
                px += (dx / dist) * force
                py += (dy / dist) * force
            }

            // More subtle parallax shift
            px += smoothMouse.current.x * 0.15 * (1 - nodeRandoms[i] * 0.5)
            py += smoothMouse.current.y * 0.15 * (1 - nodeRandoms[i] * 0.5)

            positions[i3] = px
            positions[i3 + 1] = py
            positions[i3 + 2] = pz
        }

        nodeGeometry.attributes.position.needsUpdate = true

        let lineIdx = 0
        const maxDist = connectionDistance
        const maxDistSq = maxDist * maxDist

        const step = mobile ? 4 : 2
        for (let i = 0; i < nodeCount && lineIdx < maxConnections; i += step) {
            const i3 = i * 3
            const ax = positions[i3]
            const ay = positions[i3 + 1]
            const az = positions[i3 + 2]

            // Only connect particles in the mid/foreground for cleaner look
            if (az < -1.5) continue

            for (let j = i + 1; j < nodeCount && lineIdx < maxConnections; j += step) {
                const j3 = j * 3
                const dx = ax - positions[j3]
                const dy = ay - positions[j3 + 1]
                const dz = az - positions[j3 + 2]
                const dSq = dx * dx + dy * dy + dz * dz

                if (dSq < maxDistSq) {
                    const li = lineIdx * 6
                    linePositions[li] = ax
                    linePositions[li + 1] = ay
                    linePositions[li + 2] = az
                    linePositions[li + 3] = positions[j3]
                    linePositions[li + 4] = positions[j3 + 1]
                    linePositions[li + 5] = positions[j3 + 2]

                    const alpha = 1 - Math.sqrt(dSq) / maxDist
                    const pulse = 0.5 + 0.5 * Math.sin(time * 1.5 + i * 0.2)

                    const r = lerp(uc1.x, uc2.x, 0.5) * alpha * pulse
                    const g = lerp(uc1.y, uc2.y, 0.5) * alpha * pulse
                    const b = lerp(uc1.z, uc2.z, 0.5) * alpha * pulse

                    lineColors[li] = r; lineColors[li + 1] = g; lineColors[li + 2] = b
                    lineColors[li + 3] = r; lineColors[li + 4] = g; lineColors[li + 5] = b

                    lineIdx++
                }
            }
        }

        lineGeometry.setDrawRange(0, lineIdx * 2)
        lineGeometry.attributes.position.needsUpdate = true
        lineGeometry.attributes.color.needsUpdate = true

        if (groupRef.current) {
            groupRef.current.rotation.y = time * 0.1
            groupRef.current.rotation.x = Math.sin(time * 0.08) * 0.06
        }
    })

    useEffect(() => {
        const onResize = () => {
            nodeMaterial.uniforms.uPixelRatio.value = Math.min(window.devicePixelRatio, 2)
        }
        window.addEventListener('resize', onResize)
        return () => window.removeEventListener('resize', onResize)
    }, [nodeMaterial])

    return (
        <group ref={groupRef}>
            <points ref={pointsRef} geometry={nodeGeometry} material={nodeMaterial} />
            <lineSegments ref={linesRef} geometry={lineGeometry} material={lineMaterial} />
            <DataPackets nodePositions={positions} count={packetCount} />
        </group>
    )
}
