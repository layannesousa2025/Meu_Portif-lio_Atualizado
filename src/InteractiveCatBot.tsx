import { useEffect, useRef, useState, useCallback } from 'react'
import * as THREE from 'three'
import catinhoImg from './img/img-3d.png'

interface InteractiveCatBotProps {
  onInteract?: (quote: string) => void
  className?: string
}

const QUOTES = [
  'Já tentou desligar e ligar de novo? 😄',
  'Compilando ideias e transformando em código! 🚀',
  'Zero bugs encontrados... só carinho! 🐾',
  'git commit -m "adicionei mais café e fofura" ☕✨',
  'Dica: Confira meus projetos logo abaixo! 💻',
  'Estou de olho no seu cursor! 👀',
  'Frontend, Backend & UX com amor! 💜',
  'Tudo 100% responsivo e otimizado! ⚡',
  'Miau! Seja bem-vindo(a) ao portfólio da Layanne! 🐱',
]

export function InteractiveCatBot({ onInteract, className = '' }: InteractiveCatBotProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const containerRef = useRef<HTMLDivElement | null>(null)
  const [hasWebGlError, setHasWebGlError] = useState(false)
  const [quoteIndex, setQuoteIndex] = useState(0)

  // Face expression state
  const faceStateRef = useRef({
    eyeOffset: { x: 0, y: 0 },
    blinkProgress: 0, // 0 = open, 1 = closed
    isHappy: false,
    happyTimer: 0,
    blushAlpha: 0.4,
    mouthSmile: 0.5,
  })

  // Bot physical state for animation
  const animStateRef = useRef({
    targetRotX: 0,
    targetRotY: 0,
    currentRotX: 0,
    currentRotY: 0,
    jumpY: 0,
    jumpVelocity: 0,
    waveLeftArm: 0,
    waveRightArm: 0,
    earWiggle: 0,
    earWiggleTimer: 0,
    isHovered: false,
  })

  const triggerInteraction = useCallback(() => {
    // Jump & happy reaction
    animStateRef.current.jumpVelocity = 0.16
    animStateRef.current.waveRightArm = 1.2
    faceStateRef.current.isHappy = true
    faceStateRef.current.happyTimer = 2.4
    faceStateRef.current.blushAlpha = 0.9

    // Cycle quote
    setQuoteIndex((prev) => {
      const next = (prev + 1) % QUOTES.length
      if (onInteract) {
        onInteract(QUOTES[next])
      }
      return next
    })
  }, [onInteract])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    let renderer: THREE.WebGLRenderer
    try {
      renderer = new THREE.WebGLRenderer({
        canvas,
        alpha: true,
        antialias: true,
        powerPreference: 'high-performance',
      })
    } catch {
      setHasWebGlError(true)
      return
    }

    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2))
    renderer.setSize(386, 500, false)
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.15

    const scene = new THREE.Scene()

    const camera = new THREE.PerspectiveCamera(40, 386 / 500, 0.1, 100)
    camera.position.set(0, 0.2, 8.8)

    // ─── Lighting ─────────────────────────────────────────────────────────
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.4)
    scene.add(ambientLight)

    // Key light (soft cool white)
    const keyLight = new THREE.DirectionalLight(0xffffff, 2.0)
    keyLight.position.set(3, 5, 5)
    scene.add(keyLight)

    // Fill light from left (subtle lavender)
    const fillLight = new THREE.DirectionalLight(0xc4b5fd, 1.2)
    fillLight.position.set(-4, 3, 2)
    scene.add(fillLight)

    // Rim light from bottom-back (vibrant violet/indigo)
    const rimLight = new THREE.PointLight(0x818cf8, 3.5, 12)
    rimLight.position.set(0, -2, -3)
    scene.add(rimLight)

    // Pink accent point light (front-right, highlights headphones/collar)
    const pinkAccent = new THREE.PointLight(0xf472b6, 2.5, 8)
    pinkAccent.position.set(2.5, 1, 2.5)
    scene.add(pinkAccent)

    // ─── Materials ────────────────────────────────────────────────────────
    const whiteRobotMat = new THREE.MeshStandardMaterial({
      color: 0xf8f9fe,
      roughness: 0.18,
      metalness: 0.08,
    })

    const pinkAccentMat = new THREE.MeshStandardMaterial({
      color: 0xf472b6,
      roughness: 0.28,
      metalness: 0.15,
      emissive: 0xec4899,
      emissiveIntensity: 0.18,
    })

    const earInnerMat = new THREE.MeshStandardMaterial({
      color: 0xfbcfe8,
      roughness: 0.4,
      metalness: 0.05,
    })

    const purpleGlowMat = new THREE.MeshStandardMaterial({
      color: 0xa78bfa,
      emissive: 0x8b5cf6,
      emissiveIntensity: 0.7,
      roughness: 0.2,
    })

    const darkPlasticMat = new THREE.MeshStandardMaterial({
      color: 0x1f2130,
      roughness: 0.35,
      metalness: 0.4,
    })

    // ─── Dynamic Face Visor Canvas & Texture ─────────────────────────────
    const faceCanvas = document.createElement('canvas')
    faceCanvas.width = 512
    faceCanvas.height = 320
    const ctx = faceCanvas.getContext('2d')!
    const faceTexture = new THREE.CanvasTexture(faceCanvas)
    faceTexture.minFilter = THREE.LinearFilter
    faceTexture.magFilter = THREE.LinearFilter

    const visorMat = new THREE.MeshStandardMaterial({
      map: faceTexture,
      emissive: 0xffffff,
      emissiveMap: faceTexture,
      emissiveIntensity: 0.45,
      roughness: 0.1,
      metalness: 0.2,
      transparent: true,
      opacity: 0.98,
    })

    // Helper to draw face onto the dynamic texture
    const updateFaceCanvas = () => {
      const { eyeOffset, blinkProgress, isHappy, blushAlpha } = faceStateRef.current
      ctx.clearRect(0, 0, faceCanvas.width, faceCanvas.height)

      // Visor Screen Base (Curved dark cyber screen)
      const grad = ctx.createLinearGradient(0, 0, 0, faceCanvas.height)
      grad.addColorStop(0, '#131222')
      grad.addColorStop(0.5, '#1e1c32')
      grad.addColorStop(1, '#100f1c')
      ctx.fillStyle = grad
      ctx.beginPath()
      ctx.roundRect(14, 16, faceCanvas.width - 28, faceCanvas.height - 32, 54)
      ctx.fill()

      // Subtle cyber glass reflection highlight
      const glossGrad = ctx.createLinearGradient(0, 16, 0, 110)
      glossGrad.addColorStop(0, 'rgba(255, 255, 255, 0.22)')
      glossGrad.addColorStop(1, 'rgba(255, 255, 255, 0)')
      ctx.fillStyle = glossGrad
      ctx.beginPath()
      ctx.roundRect(24, 20, faceCanvas.width - 48, 75, 38)
      ctx.fill()

      // Glowing Blushing Cheeks
      if (blushAlpha > 0.05) {
        ctx.save()
        ctx.fillStyle = `rgba(255, 105, 180, ${blushAlpha * 0.5})`
        ctx.beginPath()
        ctx.ellipse(115, 215, 34, 18, 0, 0, Math.PI * 2)
        ctx.fill()

        ctx.beginPath()
        ctx.ellipse(faceCanvas.width - 115, 215, 34, 18, 0, 0, Math.PI * 2)
        ctx.fill()
        ctx.restore()
      }

      // Eyes parameters
      const eyeSpacing = 110
      const centerX = faceCanvas.width / 2
      const centerY = 145 + eyeOffset.y * 14
      const leftEyeX = centerX - eyeSpacing + eyeOffset.x * 20
      const rightEyeX = centerX + eyeSpacing + eyeOffset.x * 20

      const eyePink = '#ff3388'
      const eyePinkGlow = 'rgba(255, 51, 136, 0.65)'

      ctx.save()
      ctx.shadowColor = eyePink
      ctx.shadowBlur = 24

      if (isHappy) {
        // Joyful smiling eyes `^ ^`
        ctx.strokeStyle = eyePink
        ctx.lineWidth = 14
        ctx.lineCap = 'round'

        // Left happy arc
        ctx.beginPath()
        ctx.arc(leftEyeX, centerY + 10, 32, Math.PI * 1.15, Math.PI * 1.85, false)
        ctx.stroke()

        // Right happy arc
        ctx.beginPath()
        ctx.arc(rightEyeX, centerY + 10, 32, Math.PI * 1.15, Math.PI * 1.85, false)
        ctx.stroke()
      } else {
        // Normal / Tracking Kawaii Robot Eyes
        const eyeHeight = Math.max(2, 48 * (1 - blinkProgress))
        const eyeWidth = 32

        // Left Eye
        ctx.fillStyle = eyePink
        ctx.beginPath()
        ctx.ellipse(leftEyeX, centerY, eyeWidth, eyeHeight, 0, 0, Math.PI * 2)
        ctx.fill()

        // Right Eye
        ctx.beginPath()
        ctx.ellipse(rightEyeX, centerY, eyeWidth, eyeHeight, 0, 0, Math.PI * 2)
        ctx.fill()

        // White Sparkle Highlights (only when open)
        if (blinkProgress < 0.6) {
          ctx.shadowBlur = 4
          ctx.shadowColor = '#ffffff'
          ctx.fillStyle = '#ffffff'

          // Left sparkles
          ctx.beginPath()
          ctx.ellipse(leftEyeX - 10, centerY - eyeHeight * 0.35, 10, 14, -0.2, 0, Math.PI * 2)
          ctx.fill()
          ctx.beginPath()
          ctx.arc(leftEyeX + 11, centerY + eyeHeight * 0.25, 6, 0, Math.PI * 2)
          ctx.fill()

          // Right sparkles
          ctx.beginPath()
          ctx.ellipse(rightEyeX - 10, centerY - eyeHeight * 0.35, 10, 14, -0.2, 0, Math.PI * 2)
          ctx.fill()
          ctx.beginPath()
          ctx.arc(rightEyeX + 11, centerY + eyeHeight * 0.25, 6, 0, Math.PI * 2)
          ctx.fill()
        }
      }

      // Cat Mouth `:3`
      ctx.strokeStyle = eyePink
      ctx.lineWidth = 9
      ctx.lineCap = 'round'
      ctx.shadowBlur = 12
      ctx.shadowColor = eyePinkGlow

      const mouthY = 210
      ctx.beginPath()
      // Left curl of `:3`
      ctx.arc(centerX - 13, mouthY, 15, 0, Math.PI * 0.85, false)
      // Right curl of `:3`
      ctx.arc(centerX + 13, mouthY, 15, Math.PI * 0.15, Math.PI, false)
      ctx.stroke()

      ctx.restore()
      faceTexture.needsUpdate = true
    }

    // Initial render of face
    updateFaceCanvas()

    // ─── 3D Model Hierarchy ───────────────────────────────────────────────
    const botRoot = new THREE.Group()
    scene.add(botRoot)

    const botFloatGroup = new THREE.Group()
    botRoot.add(botFloatGroup)

    const headGroup = new THREE.Group()
    headGroup.position.set(0, 0.95, 0)
    botFloatGroup.add(headGroup)

    const bodyGroup = new THREE.Group()
    bodyGroup.position.set(0, -0.4, 0)
    botFloatGroup.add(bodyGroup)

    // ─── Head Assembly ───────────────────────────────────────────────────
    // Main Head Sphere
    const headGeo = new THREE.SphereGeometry(1.36, 40, 32)
    const headMesh = new THREE.Mesh(headGeo, whiteRobotMat)
    headGroup.add(headMesh)

    // Curved Screen Visor on Front of Head
    // Centered around phi = PI * 0.5 (which is +Z, directly facing the camera)
    const visorGeo = new THREE.SphereGeometry(
      1.38,
      40,
      28,
      Math.PI * 0.14,
      Math.PI * 0.72,
      Math.PI * 0.22,
      Math.PI * 0.46
    )
    const visorMesh = new THREE.Mesh(visorGeo, visorMat)
    headGroup.add(visorMesh)

    // ─── Cat Ears ────────────────────────────────────────────────────────
    const earGroup = new THREE.Group()
    headGroup.add(earGroup)

    const createEar = (isLeft: boolean) => {
      const earSub = new THREE.Group()
      const sign = isLeft ? -1 : 1

      // Outer white ear cone
      const outerEarGeo = new THREE.ConeGeometry(0.52, 0.95, 4)
      outerEarGeo.rotateY(Math.PI * 0.25)
      const outerEar = new THREE.Mesh(outerEarGeo, whiteRobotMat)
      earSub.add(outerEar)

      // Inner pink ear facet
      const innerEarGeo = new THREE.ConeGeometry(0.38, 0.76, 4)
      innerEarGeo.rotateY(Math.PI * 0.25)
      const innerEar = new THREE.Mesh(innerEarGeo, earInnerMat)
      innerEar.position.set(0, -0.04, 0.09)
      innerEar.scale.set(0.9, 0.9, 0.4)
      earSub.add(innerEar)

      earSub.position.set(sign * 0.85, 1.32, -0.05)
      earSub.rotation.z = -sign * 0.32
      earSub.rotation.x = -0.1
      earSub.rotation.y = sign * 0.15

      return earSub
    }

    const leftEar = createEar(true)
    const rightEar = createEar(false)
    earGroup.add(leftEar)
    earGroup.add(rightEar)

    // ─── Headphones & Headset ────────────────────────────────────────────
    // Headband over the crown
    const headbandGeo = new THREE.TorusGeometry(1.42, 0.11, 16, 40, Math.PI)
    const headband = new THREE.Mesh(headbandGeo, pinkAccentMat)
    headband.rotation.z = Math.PI
    headband.rotation.x = 0.12
    headGroup.add(headband)

    // Earcups
    const createEarcup = (isLeft: boolean) => {
      const cup = new THREE.Group()
      const sign = isLeft ? -1 : 1

      // Outer ring
      const cupBodyGeo = new THREE.CylinderGeometry(0.48, 0.48, 0.28, 32)
      cupBodyGeo.rotateZ(Math.PI * 0.5)
      const cupBody = new THREE.Mesh(cupBodyGeo, pinkAccentMat)
      cup.add(cupBody)

      // Inner metallic disc
      const capGeo = new THREE.CylinderGeometry(0.34, 0.34, 0.32, 24)
      capGeo.rotateZ(Math.PI * 0.5)
      const cap = new THREE.Mesh(capGeo, darkPlasticMat)
      cup.add(cap)

      cup.position.set(sign * 1.34, 0.05, 0.05)
      return cup
    }

    const leftCup = createEarcup(true)
    const rightCup = createEarcup(false)
    headGroup.add(leftCup)
    headGroup.add(rightCup)

    // Sleek curved headset microphone attached to right earcup
    const micGroup = new THREE.Group()
    const micCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(1.34, 0.0, 0.1),
      new THREE.Vector3(1.22, -0.22, 0.65),
      new THREE.Vector3(0.68, -0.28, 1.25),
    ])
    const micTubeGeo = new THREE.TubeGeometry(micCurve, 20, 0.04, 10, false)
    const micArm = new THREE.Mesh(micTubeGeo, darkPlasticMat)
    micGroup.add(micArm)

    // Glowing mic capsule at the tip
    const micTipGeo = new THREE.SphereGeometry(0.12, 16, 16)
    const micTip = new THREE.Mesh(micTipGeo, purpleGlowMat)
    micTip.position.set(0.68, -0.28, 1.25)
    micGroup.add(micTip)

    headGroup.add(micGroup)

    // ─── Torso / Body Assembly ───────────────────────────────────────────
    // Tapered cylindrical upper body
    const bodyGeo = new THREE.CylinderGeometry(1.02, 1.28, 1.35, 36)
    const bodyMesh = new THREE.Mesh(bodyGeo, whiteRobotMat)
    bodyGroup.add(bodyMesh)

    // Chest Lavender Emblem Button
    const chestButtonGeo = new THREE.CylinderGeometry(0.28, 0.28, 0.08, 24)
    chestButtonGeo.rotateX(Math.PI * 0.5)
    const chestButton = new THREE.Mesh(chestButtonGeo, purpleGlowMat)
    chestButton.position.set(0, 0.22, 1.1)
    bodyGroup.add(chestButton)

    // Pink Waist Ring Belt
    const beltGeo = new THREE.TorusGeometry(1.3, 0.09, 16, 40)
    beltGeo.rotateX(Math.PI * 0.5)
    const belt = new THREE.Mesh(beltGeo, pinkAccentMat)
    belt.position.set(0, -0.68, 0)
    bodyGroup.add(belt)

    // Lower Floating Base Dome (smooth rounded base)
    const baseDomeGeo = new THREE.SphereGeometry(1.28, 36, 24, 0, Math.PI * 2, Math.PI * 0.5, Math.PI * 0.5)
    const baseDome = new THREE.Mesh(baseDomeGeo, whiteRobotMat)
    baseDome.position.set(0, -0.68, 0)
    bodyGroup.add(baseDome)

    // ─── Arms ────────────────────────────────────────────────────────────
    const createArm = (isLeft: boolean) => {
      const armGroup = new THREE.Group()
      const sign = isLeft ? -1 : 1

      // Shoulder joint
      const shoulderGeo = new THREE.SphereGeometry(0.19, 16, 16)
      const shoulder = new THREE.Mesh(shoulderGeo, pinkAccentMat)
      armGroup.add(shoulder)

      // Limb
      const limbGeo = new THREE.CylinderGeometry(0.18, 0.16, 0.95, 20)
      limbGeo.translate(0, -0.45, 0)
      const limb = new THREE.Mesh(limbGeo, whiteRobotMat)
      armGroup.add(limb)

      // Hand sphere
      const handGeo = new THREE.SphereGeometry(0.24, 18, 18)
      handGeo.translate(0, -0.95, 0)
      const hand = new THREE.Mesh(handGeo, pinkAccentMat)
      armGroup.add(hand)

      armGroup.position.set(sign * 1.35, 0.25, 0)
      armGroup.rotation.z = -sign * 0.22
      return armGroup
    }

    const leftArm = createArm(true)
    const rightArm = createArm(false)
    bodyGroup.add(leftArm)
    bodyGroup.add(rightArm)

    // ─── Holographic Cyber Pedestal Beneath Bot ──────────────────────────
    const holoRingGeo = new THREE.TorusGeometry(1.5, 0.035, 16, 48)
    holoRingGeo.rotateX(Math.PI * 0.5)
    const holoRingMat = new THREE.MeshBasicMaterial({
      color: 0x818cf8,
      transparent: true,
      opacity: 0.5,
    })
    const holoRing = new THREE.Mesh(holoRingGeo, holoRingMat)
    holoRing.position.set(0, -2.45, 0)
    botRoot.add(holoRing)

    const outerRingGeo = new THREE.TorusGeometry(1.85, 0.02, 16, 48)
    outerRingGeo.rotateX(Math.PI * 0.5)
    const outerRingMat = new THREE.MeshBasicMaterial({
      color: 0xc084fc,
      transparent: true,
      opacity: 0.3,
    })
    const outerRing = new THREE.Mesh(outerRingGeo, outerRingMat)
    outerRing.position.set(0, -2.45, 0)
    botRoot.add(outerRing)

    // ─── Sparkle Cyber Particles ─────────────────────────────────────────
    const particleCount = 28
    const particleGeo = new THREE.BufferGeometry()
    const particlePositions = new Float32Array(particleCount * 3)
    const particleSpeeds = new Float32Array(particleCount)

    for (let i = 0; i < particleCount; i++) {
      const radius = 1.2 + Math.random() * 1.6
      const angle = Math.random() * Math.PI * 2
      particlePositions[i * 3] = Math.cos(angle) * radius
      particlePositions[i * 3 + 1] = -2.4 + Math.random() * 4.2
      particlePositions[i * 3 + 2] = Math.sin(angle) * radius
      particleSpeeds[i] = 0.4 + Math.random() * 0.6
    }
    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3))

    const particleMat = new THREE.PointsMaterial({
      color: 0xa5b4fc,
      size: 0.08,
      transparent: true,
      opacity: 0.65,
      blending: THREE.AdditiveBlending,
    })
    const particles = new THREE.Points(particleGeo, particleMat)
    botRoot.add(particles)

    // ─── Pointer Event Handlers ──────────────────────────────────────────
    const handlePointerMove = (e: MouseEvent | TouchEvent) => {
      let clientX = 0
      let clientY = 0

      if ('touches' in e && e.touches.length > 0) {
        clientX = e.touches[0].clientX
        clientY = e.touches[0].clientY
      } else if ('clientX' in e) {
        clientX = e.clientX
        clientY = e.clientY
      } else {
        return
      }

      const rect = canvas.getBoundingClientRect()
      // Center of canvas on screen
      const centerX = rect.left + rect.width / 2
      const centerY = rect.top + rect.height / 2

      // Normalized coordinates from -1 to 1 based on distance to canvas center
      const nx = Math.max(-1, Math.min(1, (clientX - centerX) / (window.innerWidth * 0.4)))
      const ny = Math.max(-1, Math.min(1, (clientY - centerY) / (window.innerHeight * 0.4)))

      animStateRef.current.targetRotY = nx * 0.42
      animStateRef.current.targetRotX = ny * 0.28
      faceStateRef.current.eyeOffset.x = nx
      faceStateRef.current.eyeOffset.y = ny
    }

    const handlePointerEnter = () => {
      animStateRef.current.isHovered = true
      faceStateRef.current.blushAlpha = 0.65
    }

    const handlePointerLeave = () => {
      animStateRef.current.isHovered = false
      animStateRef.current.targetRotX = 0
      animStateRef.current.targetRotY = 0
      faceStateRef.current.eyeOffset.x = 0
      faceStateRef.current.eyeOffset.y = 0
      if (!faceStateRef.current.isHappy) {
        faceStateRef.current.blushAlpha = 0.35
      }
    }

    window.addEventListener('mousemove', handlePointerMove, { passive: true })
    window.addEventListener('touchmove', handlePointerMove, { passive: true })
    canvas.addEventListener('mouseenter', handlePointerEnter)
    canvas.addEventListener('mouseleave', handlePointerLeave)

    // ─── Main Animation Loop ─────────────────────────────────────────────
    let reqId = 0
    let lastTime = performance.now()
    let blinkTimer = 2.0

    const renderLoop = (timeNow: number) => {
      reqId = requestAnimationFrame(renderLoop)

      const dt = Math.min((timeNow - lastTime) / 1000, 0.1)
      lastTime = timeNow

      // 1. Natural Idle Eye Blink
      blinkTimer -= dt
      if (blinkTimer <= 0) {
        faceStateRef.current.blinkProgress += dt * 7.5
        if (faceStateRef.current.blinkProgress >= 1) {
          faceStateRef.current.blinkProgress = 0
          blinkTimer = 2.8 + Math.random() * 3.2
        }
      } else {
        faceStateRef.current.blinkProgress = 0
      }

      // Happy state countdown
      if (faceStateRef.current.isHappy) {
        faceStateRef.current.happyTimer -= dt
        if (faceStateRef.current.happyTimer <= 0) {
          faceStateRef.current.isHappy = false
          faceStateRef.current.blushAlpha = animStateRef.current.isHovered ? 0.65 : 0.35
        }
      }

      // 2. Ear Wiggle
      animStateRef.current.earWiggleTimer -= dt
      if (animStateRef.current.earWiggleTimer <= 0) {
        animStateRef.current.earWiggle = Math.sin(timeNow * 0.02) * 0.12
        if (animStateRef.current.earWiggleTimer < -0.4) {
          animStateRef.current.earWiggleTimer = 3.5 + Math.random() * 4
          animStateRef.current.earWiggle = 0
        }
      } else {
        animStateRef.current.earWiggle = 0
      }

      leftEar.rotation.z = 0.32 + animStateRef.current.earWiggle
      rightEar.rotation.z = -0.32 - animStateRef.current.earWiggle

      // 3. Smooth Mouse Tracking LERP
      const lerpSpeed = 0.08
      animStateRef.current.currentRotY += (animStateRef.current.targetRotY - animStateRef.current.currentRotY) * lerpSpeed
      animStateRef.current.currentRotX += (animStateRef.current.targetRotX - animStateRef.current.currentRotX) * lerpSpeed

      // Head leads rotation
      headGroup.rotation.y = animStateRef.current.currentRotY
      headGroup.rotation.x = animStateRef.current.currentRotX
      headGroup.rotation.z = -animStateRef.current.currentRotY * 0.15

      // Body follows smoothly with slight delay
      bodyGroup.rotation.y = animStateRef.current.currentRotY * 0.5
      bodyGroup.rotation.x = animStateRef.current.currentRotX * 0.3

      // 4. Physical Jump & Bounce Simulation
      if (animStateRef.current.jumpVelocity !== 0 || animStateRef.current.jumpY > 0) {
        animStateRef.current.jumpY += animStateRef.current.jumpVelocity
        animStateRef.current.jumpVelocity -= 0.65 * dt // Gravity
        if (animStateRef.current.jumpY <= 0) {
          animStateRef.current.jumpY = 0
          animStateRef.current.jumpVelocity = 0
        }
      }

      // 5. Idle Hover & Breathing
      const hoverY = Math.sin(timeNow * 0.0018) * 0.1
      const breatheScale = 1 + Math.sin(timeNow * 0.0024) * 0.015

      botFloatGroup.position.y = hoverY + animStateRef.current.jumpY
      botFloatGroup.scale.set(breatheScale, breatheScale, breatheScale)

      // 6. Arm Animations & Wave on Click
      if (animStateRef.current.waveRightArm > 0) {
        animStateRef.current.waveRightArm -= dt * 1.5
        const waveAngle = Math.sin(timeNow * 0.018) * 0.45 + 0.8
        rightArm.rotation.z = -waveAngle
        rightArm.rotation.x = -0.3
      } else {
        rightArm.rotation.z = 0.22 + Math.sin(timeNow * 0.0018) * 0.04
        rightArm.rotation.x = 0
      }
      leftArm.rotation.z = -0.22 - Math.sin(timeNow * 0.0018) * 0.04

      // 7. Holographic Rings Rotation
      holoRing.rotation.z += 0.008
      outerRing.rotation.z -= 0.005

      // 8. Cyber Particles Drift
      const positions = particleGeo.attributes.position.array as Float32Array
      for (let i = 0; i < particleCount; i++) {
        positions[i * 3 + 1] += particleSpeeds[i] * dt
        if (positions[i * 3 + 1] > 2.8) {
          positions[i * 3 + 1] = -2.4
        }
      }
      particleGeo.attributes.position.needsUpdate = true

      // 9. Update Dynamic Face Canvas
      updateFaceCanvas()

      renderer.render(scene, camera)
    }

    reqId = requestAnimationFrame(renderLoop)

    // ─── Cleanup ─────────────────────────────────────────────────────────
    return () => {
      cancelAnimationFrame(reqId)
      window.removeEventListener('mousemove', handlePointerMove)
      window.removeEventListener('touchmove', handlePointerMove)
      canvas.removeEventListener('mouseenter', handlePointerEnter)
      canvas.removeEventListener('mouseleave', handlePointerLeave)

      faceTexture.dispose()
      renderer.dispose()
    }
  }, [])

  if (hasWebGlError) {
    // Graceful fallback to image if browser disables WebGL
    return (
      <div className={`w-full h-full flex items-center justify-center p-3 relative z-0 animate-breathe ${className}`}>
        <img
          src={catinhoImg}
          alt="Gatinho robô"
          className="cat-head w-full h-full object-contain drop-shadow-[0_0_28px_rgba(99,102,241,0.6)] cursor-pointer"
          onClick={triggerInteraction}
        />
      </div>
    )
  }

  return (
    <div
      ref={containerRef}
      className={`w-full h-full relative flex items-center justify-center select-none ${className}`}
      onClick={triggerInteraction}
      title="Clique para brincar com o gatinho!"
    >
      <canvas
        ref={canvasRef}
        id="bot"
        aria-label="Personagem 3D interativo"
        width={386}
        height={500}
        className="w-full h-full object-contain cursor-pointer drop-shadow-[0_0_35px_rgba(99,102,241,0.45)] transition-transform duration-200 active:scale-95"
      />
    </div>
  )
}
