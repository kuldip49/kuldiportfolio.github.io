import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { Float, Text, Line, Sphere } from '@react-three/drei'

const skillNodes = [
    { name: 'AI / ML', pos: [0, 20, -210], color: '#00f0ff', skills: ['Supervised', 'Unsupervised', 'RL', 'SVM'] },
    { name: 'Deep Learning', pos: [-25, 25, -230], color: '#8a2be2', skills: ['CNN', 'RNN', 'Transformers', 'GANs'] },
    { name: 'Generative AI', pos: [25, 18, -230], color: '#ff003c', skills: ['LLMs', 'RAG', 'Prompt Eng', 'Fine-tuning'] },
    { name: 'Languages', pos: [-15, 10, -190], color: '#00ffaa', skills: ['Python', 'C++', 'Java', 'JS'] },
    { name: 'Tools', pos: [20, 12, -190], color: '#ffaa00', skills: ['AWS', 'Docker', 'Kubernetes', 'Git'] },
]

function Connection({ start, end, color }) {
    const points = useMemo(() => [new THREE.Vector3(...start), new THREE.Vector3(...end)], [start, end])
    return <Line points={points} color={color} lineWidth={0.5} transparent opacity={0.3} />
}

function Node({ name, pos, color, subSkills }) {
    const groupRef = useRef()
    
    useFrame((state) => {
        if (groupRef.current) {
            groupRef.current.rotation.y += 0.005
        }
    })

    return (
        <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
            <group position={pos} ref={groupRef}>
                {/* Main Node */}
                <Sphere args={[1.2, 16, 16]}>
                    <meshBasicMaterial color={color} toneMapped={false} />
                </Sphere>
                <Text
                    position={[0, 2.5, 0]}
                    fontSize={1.2}
                    color={color}
                    font={`${import.meta.env.BASE_URL}SpaceGrotesk.ttf`}
                    anchorX="center"
                    anchorY="middle"
                >
                    {name}
                </Text>

                {/* Sub-nodes */}
                {subSkills.map((skill, i) => {
                    const angle = (i / subSkills.length) * Math.PI * 2
                    const r = 5
                    const x = Math.cos(angle) * r
                    const y = Math.sin(angle) * r
                    const subPos = [x, y, 0]
                    
                    return (
                        <group key={skill} position={subPos}>
                            <Sphere args={[0.4, 8, 8]}>
                                <meshBasicMaterial color={color} opacity={0.6} transparent />
                            </Sphere>
                            <Text
                                position={[0, 1.2, 0]}
                                fontSize={0.6}
                                color="#ffffff"
                                opacity={0.8}
                                transparent
                            >
                                {skill}
                            </Text>
                            <Line 
                                points={[new THREE.Vector3(0, 0, 0), new THREE.Vector3(-x, -y, 0)]} 
                                color={color} 
                                lineWidth={0.2} 
                                transparent 
                                opacity={0.2} 
                            />
                        </group>
                    )
                })}
            </group>
        </Float>
    )
}

export default function SkillsConstellation() {
    return (
        <group>
            {skillNodes.map((node, i) => (
                <group key={node.name}>
                    <Node 
                        name={node.name} 
                        pos={node.pos} 
                        color={node.color} 
                        subSkills={node.skills} 
                    />
                    {/* Connect to center or nearby nodes */}
                    {i > 0 && (
                        <Connection 
                            start={node.pos} 
                            end={skillNodes[0].pos} 
                            color={node.color} 
                        />
                    )}
                </group>
            ))}
        </group>
    )
}
