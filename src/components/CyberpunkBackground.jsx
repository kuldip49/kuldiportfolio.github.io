import { useRef, useEffect, useCallback } from 'react'
import usePortfolioStore from '../store/usePortfolioStore'

// ─── Color palettes ───
const DARK = {
    bg: [3, 0, 20],
    particles: ['#00f0ff', '#8a2be2', '#ff003c', '#00ffaa'],
    gridColor: 'rgba(0, 240, 255, 0.12)',
    gridGlow: 'rgba(0, 240, 255, 0.25)',
    rainColor: '#00f0ff',
    rainColorAlt: '#8a2be2',
    waveColors: ['#00f0ff', '#8a2be2', '#ff003c'],
    lineColor: 'rgba(0, 240, 255, 0.06)',
    starColor: 'rgba(255,255,255,',
}
const LIGHT = {
    bg: [248, 250, 252],
    particles: ['#0284c7', '#db2777', '#0891b2', '#7c3aed'],
    gridColor: 'rgba(0, 0, 0, 0.06)',
    gridGlow: 'rgba(0, 0, 0, 0.12)',
    rainColor: '#0284c7',
    rainColorAlt: '#db2777',
    waveColors: ['#0284c7', '#db2777', '#e11d48'],
    lineColor: 'rgba(0, 0, 0, 0.03)',
    starColor: 'rgba(30,41,59,',
}

// ─── Helpers ───
const lerp = (a, b, t) => a + (b - a) * t
const rand = (min, max) => Math.random() * (max - min) + min
const dist = (x1, y1, x2, y2) => Math.sqrt((x1 - x2) ** 2 + (y1 - y2) ** 2)

// ─── Rain characters ───
const RAIN_CHARS = '01アイウエオカキクケコ♦◈⚡∞≋⟐▓░サシスセソタチツテト'.split('')

export default function CyberpunkBackground() {
    const canvasRef = useRef(null)
    const animRef = useRef(null)
    const mouseRef = useRef({ x: -1000, y: -1000 })
    const stateRef = useRef({
        particles: [],
        rainDrops: [],
        waves: [],
        gridOffset: 0,
        time: 0,
        currentPalette: DARK,
        targetPalette: DARK,
    })

    // ─── Initialize particles ───
    const initParticles = useCallback((w, h) => {
        const count = Math.min(120, Math.floor((w * h) / 8000))
        return Array.from({ length: count }, () => ({
            x: rand(0, w),
            y: rand(0, h),
            vx: rand(-0.3, 0.3),
            vy: rand(-0.6, -0.1),
            size: rand(1, 3),
            opacity: rand(0.2, 0.7),
            pulse: rand(0, Math.PI * 2),
            depth: rand(0.3, 1), // parallax depth
            colorIdx: Math.floor(rand(0, 4)),
        }))
    }, [])

    // ─── Initialize rain ───
    const initRain = useCallback((w, h) => {
        const count = Math.min(40, Math.floor(w / 30))
        return Array.from({ length: count }, () => ({
            x: rand(0, w),
            y: rand(-h, 0),
            speed: rand(1.5, 4),
            chars: Array.from({ length: Math.floor(rand(8, 20)) }, () =>
                RAIN_CHARS[Math.floor(rand(0, RAIN_CHARS.length))]
            ),
            opacity: rand(0.08, 0.25),
            isAlt: Math.random() > 0.7,
            charTimer: 0,
        }))
    }, [])

    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return
        const ctx = canvas.getContext('2d')

        let w, h
        const resize = () => {
            const dpr = Math.min(window.devicePixelRatio || 1, 2)
            w = window.innerWidth
            h = window.innerHeight
            canvas.width = w * dpr
            canvas.height = h * dpr
            canvas.style.width = w + 'px'
            canvas.style.height = h + 'px'
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
            // Re-init particles on resize
            stateRef.current.particles = initParticles(w, h)
            stateRef.current.rainDrops = initRain(w, h)
        }
        resize()
        window.addEventListener('resize', resize)

        // Mouse tracking
        const onMouse = (e) => {
            mouseRef.current.x = e.clientX
            mouseRef.current.y = e.clientY
        }
        window.addEventListener('mousemove', onMouse)

        // ─── MAIN ANIMATION LOOP ───
        const animate = () => {
            const s = stateRef.current
            const theme = usePortfolioStore.getState().theme
            s.targetPalette = theme === 'dark' ? DARK : LIGHT
            s.time += 0.016 // ~60fps time step
            s.gridOffset = (s.gridOffset + 0.5) % 60

            ctx.clearRect(0, 0, w, h)
            const pal = s.targetPalette
            const mx = mouseRef.current.x
            const my = mouseRef.current.y

            // ── 1. Background fill ──
            const isDark = theme === 'dark'
            if (isDark) {
                // Deep space background
                const bgGrad = ctx.createLinearGradient(0, 0, 0, h)
                bgGrad.addColorStop(0, '#030014')
                bgGrad.addColorStop(0.3, '#0a0020')
                bgGrad.addColorStop(0.6, '#050018')
                bgGrad.addColorStop(1, '#030014')
                ctx.fillStyle = bgGrad
                ctx.fillRect(0, 0, w, h)

                // Subtle radial glows
                const glow1 = ctx.createRadialGradient(w * 0.2, h * 0.15, 0, w * 0.2, h * 0.15, w * 0.4)
                glow1.addColorStop(0, 'rgba(138, 43, 226, 0.08)')
                glow1.addColorStop(1, 'transparent')
                ctx.fillStyle = glow1
                ctx.fillRect(0, 0, w, h)

                const glow2 = ctx.createRadialGradient(w * 0.8, h * 0.7, 0, w * 0.8, h * 0.7, w * 0.35)
                glow2.addColorStop(0, 'rgba(0, 240, 255, 0.06)')
                glow2.addColorStop(1, 'transparent')
                ctx.fillStyle = glow2
                ctx.fillRect(0, 0, w, h)
            } else {
                // Light theme background
                const bgGrad = ctx.createLinearGradient(0, 0, 0, h)
                bgGrad.addColorStop(0, '#f8fafc')
                bgGrad.addColorStop(0.5, '#f1f5f9')
                bgGrad.addColorStop(1, '#f8fafc')
                ctx.fillStyle = bgGrad
                ctx.fillRect(0, 0, w, h)

                // Soft corporate glows
                const glow1 = ctx.createRadialGradient(w * 0.15, h * 0.2, 0, w * 0.15, h * 0.2, w * 0.4)
                glow1.addColorStop(0, 'rgba(219, 39, 119, 0.04)')
                glow1.addColorStop(1, 'transparent')
                ctx.fillStyle = glow1
                ctx.fillRect(0, 0, w, h)

                const glow2 = ctx.createRadialGradient(w * 0.85, h * 0.75, 0, w * 0.85, h * 0.75, w * 0.3)
                glow2.addColorStop(0, 'rgba(2, 132, 199, 0.04)')
                glow2.addColorStop(1, 'transparent')
                ctx.fillStyle = glow2
                ctx.fillRect(0, 0, w, h)
            }

            // ── 2. Perspective Grid Floor ──
            drawGrid(ctx, w, h, s.gridOffset, pal, isDark)

            // ── 3. Digital Rain ──
            drawRain(ctx, w, h, s, pal)

            // ── 4. Particle Network ──
            drawParticles(ctx, w, h, s, pal, mx, my)

            // ── 5. Energy Waves ──
            drawWaves(ctx, w, h, s, pal)

            // ── 6. Floating Stars ──
            drawStars(ctx, w, h, s, pal)

            animRef.current = requestAnimationFrame(animate)
        }

        animRef.current = requestAnimationFrame(animate)

        return () => {
            cancelAnimationFrame(animRef.current)
            window.removeEventListener('resize', resize)
            window.removeEventListener('mousemove', onMouse)
        }
    }, [initParticles, initRain])

    return (
        <div className="cyberpunk-bg-layer">
            <canvas ref={canvasRef} className="cyberpunk-canvas" />
            <div className="scanline-overlay" />
            <div className="vignette-overlay" />
        </div>
    )
}

// ═══════════════════════════════════════════
//  DRAWING FUNCTIONS
// ═══════════════════════════════════════════

function drawGrid(ctx, w, h, offset, pal, isDark) {
    const gridY = h * 0.55
    const gridH = h - gridY
    const lineCount = 25
    const cellSize = 60

    ctx.save()

    // Horizontal lines (perspective)
    for (let i = 0; i <= lineCount; i++) {
        const t = i / lineCount
        const y = gridY + gridH * (t ** 1.8) // perspective compression
        const alpha = isDark ? 0.04 + t * 0.12 : 0.02 + t * 0.08
        ctx.strokeStyle = isDark
            ? `rgba(0, 240, 255, ${alpha})`
            : `rgba(0, 0, 0, ${alpha})`
        ctx.lineWidth = 0.5 + t * 0.5
        ctx.beginPath()
        ctx.moveTo(0, y)
        ctx.lineTo(w, y)
        ctx.stroke()
    }

    // Vertical lines (converging to vanishing point)
    const vanishX = w * 0.5
    const vanishY = gridY
    const vLines = 30
    for (let i = -vLines; i <= vLines; i++) {
        const bottomX = vanishX + i * cellSize
        const t = Math.abs(i) / vLines
        const alpha = isDark ? 0.08 * (1 - t * 0.5) : 0.05 * (1 - t * 0.5)
        ctx.strokeStyle = isDark
            ? `rgba(0, 240, 255, ${alpha})`
            : `rgba(0, 0, 0, ${alpha})`
        ctx.lineWidth = 0.5
        ctx.beginPath()
        ctx.moveTo(vanishX, vanishY)
        ctx.lineTo(bottomX, h)
        ctx.stroke()
    }

    // Scrolling highlight line
    const scrollY = gridY + ((offset / 60) * gridH)
    if (isDark) {
        ctx.strokeStyle = `rgba(0, 240, 255, 0.3)`
        ctx.lineWidth = 1.5
        ctx.shadowColor = '#00f0ff'
        ctx.shadowBlur = 8
        ctx.beginPath()
        ctx.moveTo(0, scrollY)
        ctx.lineTo(w, scrollY)
        ctx.stroke()
        ctx.shadowBlur = 0
    }

    ctx.restore()
}

function drawRain(ctx, w, h, state, pal) {
    ctx.save()
    ctx.font = '10px "JetBrains Mono", monospace'

    for (const drop of state.rainDrops) {
        drop.y += drop.speed
        drop.charTimer += 0.016

        // Reset when off screen
        if (drop.y > h + 200) {
            drop.y = rand(-300, -50)
            drop.x = rand(0, w)
        }

        // Randomize a character every so often
        if (drop.charTimer > 0.3) {
            drop.charTimer = 0
            const idx = Math.floor(rand(0, drop.chars.length))
            drop.chars[idx] = RAIN_CHARS[Math.floor(rand(0, RAIN_CHARS.length))]
        }

        const color = drop.isAlt ? pal.rainColorAlt : pal.rainColor
        for (let i = 0; i < drop.chars.length; i++) {
            const charY = drop.y + i * 14
            if (charY < -20 || charY > h + 20) continue
            const fadeOut = 1 - (i / drop.chars.length)
            const alpha = drop.opacity * fadeOut
            ctx.fillStyle = color
            ctx.globalAlpha = alpha
            ctx.fillText(drop.chars[i], drop.x, charY)
        }
    }
    ctx.globalAlpha = 1
    ctx.restore()
}

function drawParticles(ctx, w, h, state, pal, mx, my) {
    const particles = state.particles
    const CONNECTION_DIST = 120
    const MOUSE_RADIUS = 180

    // Update & draw particles
    for (let i = 0; i < particles.length; i++) {
        const p = particles[i]
        p.pulse += 0.02

        // Mouse repulsion
        const d = dist(p.x, p.y, mx, my)
        if (d < MOUSE_RADIUS && d > 0) {
            const force = (1 - d / MOUSE_RADIUS) * 2
            const angle = Math.atan2(p.y - my, p.x - mx)
            p.vx += Math.cos(angle) * force * 0.3
            p.vy += Math.sin(angle) * force * 0.3
        }

        // Apply velocity with damping
        p.x += p.vx * p.depth
        p.y += p.vy * p.depth
        p.vx *= 0.98
        p.vy *= 0.98

        // Slowly drift upward
        p.vy -= 0.003

        // Wrap around edges
        if (p.x < -10) p.x = w + 10
        if (p.x > w + 10) p.x = -10
        if (p.y < -10) p.y = h + 10
        if (p.y > h + 10) p.y = -10

        // Draw particle
        const glow = (Math.sin(p.pulse) * 0.3 + 0.7) * p.opacity
        const color = pal.particles[p.colorIdx]
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size * (0.8 + Math.sin(p.pulse) * 0.2), 0, Math.PI * 2)
        ctx.fillStyle = color
        ctx.globalAlpha = glow
        ctx.fill()

        // Glow effect for nearby mouse
        if (d < MOUSE_RADIUS) {
            ctx.beginPath()
            ctx.arc(p.x, p.y, p.size * 3, 0, Math.PI * 2)
            ctx.fillStyle = color
            ctx.globalAlpha = glow * 0.15 * (1 - d / MOUSE_RADIUS)
            ctx.fill()
        }
    }

    // Draw connections
    ctx.globalAlpha = 1
    for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
            const d = dist(particles[i].x, particles[i].y, particles[j].x, particles[j].y)
            if (d < CONNECTION_DIST) {
                const alpha = (1 - d / CONNECTION_DIST) * 0.15
                ctx.strokeStyle = pal.lineColor
                ctx.globalAlpha = alpha / 0.15  // Scale relative to lineColor's own alpha
                ctx.lineWidth = 0.5
                ctx.beginPath()
                ctx.moveTo(particles[i].x, particles[i].y)
                ctx.lineTo(particles[j].x, particles[j].y)
                ctx.stroke()
            }
        }
    }
    ctx.globalAlpha = 1
}

function drawWaves(ctx, w, h, state, pal) {
    // Generate waves periodically
    if (!state.waves) state.waves = []
    if (state.waves.length < 3 && Math.random() < 0.003) {
        state.waves.push({
            y: rand(h * 0.1, h * 0.9),
            progress: 0,
            speed: rand(0.003, 0.008),
            colorIdx: Math.floor(rand(0, pal.waveColors.length)),
            width: rand(150, 350),
        })
    }

    ctx.save()
    for (let i = state.waves.length - 1; i >= 0; i--) {
        const wave = state.waves[i]
        wave.progress += wave.speed

        if (wave.progress > 1.3) {
            state.waves.splice(i, 1)
            continue
        }

        const x = wave.progress * (w + wave.width * 2) - wave.width
        const alpha = wave.progress < 0.1
            ? wave.progress / 0.1
            : wave.progress > 1.0
                ? 1 - (wave.progress - 1.0) / 0.3
                : 1

        const grad = ctx.createLinearGradient(x - wave.width, 0, x + wave.width, 0)
        const color = pal.waveColors[wave.colorIdx % pal.waveColors.length]
        grad.addColorStop(0, 'transparent')
        grad.addColorStop(0.3, color)
        grad.addColorStop(0.5, color)
        grad.addColorStop(0.7, color)
        grad.addColorStop(1, 'transparent')

        ctx.globalAlpha = alpha * 0.35
        ctx.strokeStyle = grad
        ctx.lineWidth = 1.5
        ctx.shadowColor = color
        ctx.shadowBlur = 12
        ctx.beginPath()
        ctx.moveTo(x - wave.width, wave.y)
        ctx.lineTo(x + wave.width, wave.y)
        ctx.stroke()

        // Secondary thinner glow
        ctx.globalAlpha = alpha * 0.15
        ctx.lineWidth = 4
        ctx.shadowBlur = 20
        ctx.beginPath()
        ctx.moveTo(x - wave.width, wave.y)
        ctx.lineTo(x + wave.width, wave.y)
        ctx.stroke()
        ctx.shadowBlur = 0
    }
    ctx.globalAlpha = 1
    ctx.restore()
}

function drawStars(ctx, w, h, state, pal) {
    // Use deterministic seed based on position
    const starCount = 50
    const time = state.time

    ctx.save()
    for (let i = 0; i < starCount; i++) {
        // Pseudo-random fixed positions using golden ratio
        const gx = ((i * 0.618033988749) % 1) * w
        const gy = ((i * 0.381966011251) % 1) * h * 0.6

        const twinkle = Math.sin(time * (1.5 + (i % 5) * 0.3) + i * 1.7)
        const size = 0.5 + (i % 3) * 0.4
        const alpha = 0.15 + twinkle * 0.25 + 0.25

        ctx.beginPath()
        ctx.arc(gx, gy, size, 0, Math.PI * 2)
        ctx.fillStyle = `${pal.starColor}${alpha.toFixed(2)})`
        ctx.fill()

        // Cross-shaped glint on bright stars
        if (alpha > 0.5 && size > 0.8) {
            ctx.strokeStyle = `${pal.starColor}${(alpha * 0.4).toFixed(2)})`
            ctx.lineWidth = 0.3
            ctx.beginPath()
            ctx.moveTo(gx - 3, gy)
            ctx.lineTo(gx + 3, gy)
            ctx.moveTo(gx, gy - 3)
            ctx.lineTo(gx, gy + 3)
            ctx.stroke()
        }
    }
    ctx.restore()
}
