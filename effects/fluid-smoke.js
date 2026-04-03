// Fluid Smoke ASCII Art Effect for Slide 1
// Inspired by: https://somnai-dreams.github.io/pretext-demos/fluid-smoke.html

export function initFluidSmoke() {
  const canvas = document.getElementById('fluid-canvas')
  if (!canvas) return
  const ctx = canvas.getContext('2d')

  const CHARS = '·∙•◦○◉◎●◐◑◒◓◔◕◖◗◘◙◚◛⊙⊚⊛⊜⊝⊞⊟⊠⊡'
  const CHAR_SIZE = 14
  let cols, rows, particles = []
  let t = 0

  function resize() {
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
    cols = Math.ceil(canvas.width / CHAR_SIZE)
    rows = Math.ceil(canvas.height / CHAR_SIZE)
  }

  // Simplex-like noise using sin
  function noise(x, y, z) {
    const n = Math.sin(x * 1.3 + y * 0.7 + z * 0.5) * 0.5
      + Math.sin(x * 0.4 + y * 1.6 + z * 0.9) * 0.3
      + Math.sin(x * 2.1 - y * 0.9 + z * 1.3) * 0.2
    return n
  }

  function curlNoise(x, y, t) {
    const eps = 0.01
    const n1 = noise(x, y + eps, t)
    const n2 = noise(x, y - eps, t)
    const n3 = noise(x + eps, y, t)
    const n4 = noise(x - eps, y, t)
    return {
      vx: (n1 - n2) / (2 * eps),
      vy: -(n3 - n4) / (2 * eps)
    }
  }

  // Initialize particles spread across canvas
  function initParticles() {
    particles = []
    const count = Math.min(cols * rows * 0.4, 2000)
    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        life: Math.random(),
        speed: 0.5 + Math.random() * 1.5,
        charIdx: Math.floor(Math.random() * CHARS.length)
      })
    }
  }

  let animId = null

  function draw() {
    // Only run when slide 1 is active
    const slide1 = document.getElementById('slide-1')
    if (!slide1 || !slide1.classList.contains('active')) {
      animId = requestAnimationFrame(draw)
      return
    }

    t += 0.003

    // Fade trail
    ctx.fillStyle = 'rgba(6, 6, 10, 0.15)'
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    ctx.font = `${CHAR_SIZE}px monospace`
    ctx.textBaseline = 'top'

    for (const p of particles) {
      const nx = p.x / canvas.width * 4
      const ny = p.y / canvas.height * 4
      const { vx, vy } = curlNoise(nx, ny, t)

      p.x += vx * p.speed * 1.5
      p.y += vy * p.speed * 1.5
      p.life -= 0.002

      // Wrap around edges
      if (p.x < 0) p.x += canvas.width
      if (p.x > canvas.width) p.x -= canvas.width
      if (p.y < 0) p.y += canvas.height
      if (p.y > canvas.height) p.y -= canvas.height

      // Respawn dead particles
      if (p.life <= 0) {
        p.x = Math.random() * canvas.width
        p.y = Math.random() * canvas.height
        p.life = 0.5 + Math.random() * 0.5
        p.charIdx = Math.floor(Math.random() * CHARS.length)
      }

      // Brightness based on curl magnitude
      const mag = Math.sqrt(vx * vx + vy * vy)
      const brightness = Math.min(1, p.life * 2) * Math.min(1, mag * 3)
      const alpha = brightness * 0.8

      // Gold color: rgba(196, 163, 90, alpha)
      ctx.fillStyle = `rgba(196, 163, ${50 + mag * 100}, ${alpha})`
      ctx.fillText(CHARS[p.charIdx % CHARS.length], p.x, p.y)

      // Occasionally change char
      if (Math.random() < 0.01) {
        p.charIdx = Math.floor(Math.random() * CHARS.length)
      }
    }

    animId = requestAnimationFrame(draw)
  }

  window.addEventListener('resize', () => {
    resize()
    initParticles()
  })

  resize()
  initParticles()
  draw()
}
