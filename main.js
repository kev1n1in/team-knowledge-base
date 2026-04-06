import { initFluidSmoke } from './effects/fluid-smoke.js'
import './editSystem.js'
import './tokenManager.js'

// ===== Token & Authority Check =====
let currentAuthority = 'readonly' // 'editor', 'authorized', 'readonly'

function initializeAuth() {
  currentAuthority = window.tokenManager.checkAuthority()

  if (currentAuthority === 'editor') {
    // 本機編寫者，首次打開時初始化 token
    window.tokenManager.initializeEditor()
    console.log('本機編寫者已驗證')
  } else if (currentAuthority === 'authorized') {
    // 有有效的 URL token
    console.log('授權編輯者已驗證')
  } else {
    // 無編輯權限
    console.log('唯讀模式')
  }
}

// ===== Slide Engine =====
const slides = document.querySelectorAll('.slide')
const total = slides.length
let current = 0

const counter = document.getElementById('slide-counter')
const clickPrev = document.getElementById('click-prev')
const clickNext = document.getElementById('click-next')

function goTo(index) {
  slides[current].classList.remove('active')

  current = Math.max(0, Math.min(index, total - 1))

  slides[current].classList.add('active')
  counter.textContent = `${current + 1} / ${total}`
}

function handleNavClick(e, delta) {
  if (editMode) return
  clickPrev.style.pointerEvents = 'none'
  clickNext.style.pointerEvents = 'none'
  const el = document.elementFromPoint(e.clientX, e.clientY)
  clickPrev.style.pointerEvents = ''
  clickNext.style.pointerEvents = ''
  const interactive = el?.closest('button, a, [role="button"], .try-it-btn, [contenteditable="true"]')
  if (interactive) { interactive.click(); return }
  goTo(current + delta)
}

clickPrev.addEventListener('click', (e) => handleNavClick(e, -1))
clickNext.addEventListener('click', (e) => handleNavClick(e, 1))

document.addEventListener('keydown', e => {
  if (editMode) return
  if (e.key === 'ArrowRight' || e.key === 'ArrowDown' || e.key === ' ') {
    e.preventDefault()
    goTo(current + 1)
  } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
    e.preventDefault()
    goTo(current - 1)
  }
})

// Init
goTo(0)

// ===== Edit Mode =====
let editMode = false

const editBadge = document.createElement('div')
editBadge.id = 'edit-badge'
document.body.appendChild(editBadge)

const copyBtn = document.createElement('button')
copyBtn.id = 'copy-btn'
copyBtn.textContent = '📋 複製修改後的 HTML'
copyBtn.style.display = 'none'
document.body.appendChild(copyBtn)

const shareBtn = document.createElement('button')
shareBtn.id = 'share-btn'
shareBtn.textContent = '🔗 複製分享鏈接'
shareBtn.style.display = 'none'
document.body.appendChild(shareBtn)

const saveBtn = document.createElement('button')
saveBtn.id = 'save-btn'
saveBtn.textContent = '💾 手動保存'
saveBtn.style.display = 'none'
document.body.appendChild(saveBtn)

const restoreBtn = document.createElement('button')
restoreBtn.id = 'restore-btn'
restoreBtn.textContent = '🔄 恢復原始版本'
restoreBtn.style.display = 'none'
document.body.appendChild(restoreBtn)

function toggleEditMode() {
  // 檢查編輯權限
  if (currentAuthority === 'readonly') {
    alert('⚠ 無編輯權限。如需編輯，請從編寫者的分享鏈接打開。')
    return
  }

  editMode = !editMode
  document.body.classList.toggle('edit-mode', editMode)

  if (editMode) {
    // 進入編輯模式
    window.editSystem.enable()
    const token = window.tokenManager.getToken()
    const expiry = window.tokenManager.formatExpiry(token)
    editBadge.textContent = `✏ 編輯模式 · ${expiry} 後過期（按 E 退出）`
    editBadge.style.display = 'block'
    copyBtn.style.display = 'block'
    shareBtn.style.display = 'block'
    saveBtn.style.display = 'block'
    restoreBtn.style.display = 'block'
  } else {
    // 退出編輯模式
    window.editSystem.disable()
    editBadge.textContent = ''
    editBadge.style.display = 'none'
    copyBtn.style.display = 'none'
    shareBtn.style.display = 'none'
    saveBtn.style.display = 'none'
    restoreBtn.style.display = 'none'
  }
}

document.addEventListener('keydown', e => {
  if ((e.key === 'e' || e.key === 'E') && !e.target.isContentEditable) {
    toggleEditMode()
  }
  if (e.key === 'Escape' && document.activeElement?.isContentEditable) {
    document.activeElement.contentEditable = 'false'
    document.activeElement.blur()
  }
})

document.addEventListener('click', e => {
  if (!editMode) return
  const target = e.target.closest(
    'p, h1, h2, li, .step-title, .step-desc, .case-detail, ' +
    '.summary-text, .stat-label, .example-desc, .example-title, ' +
    '.cover-title, .cover-sub, .big-text, .callout, .note'
  )
  if (target) {
    target.contentEditable = 'true'
    target.focus()
  }
})

copyBtn.addEventListener('click', () => {
  document.querySelectorAll('[contenteditable]').forEach(el => {
    el.removeAttribute('contenteditable')
  })
  navigator.clipboard.writeText(document.documentElement.outerHTML).then(() => {
    copyBtn.textContent = '✅ 已複製！把它貼給 Claude Code 說「用這個更新 index.html」'
    setTimeout(() => { copyBtn.textContent = '📋 複製修改後的 HTML' }, 3000)
  })
})

shareBtn.addEventListener('click', async () => {
  const result = await window.tokenManager.copyShareLink()
  if (result.success) {
    shareBtn.textContent = '✅ 鏈接已複製！'
    setTimeout(() => { shareBtn.textContent = '🔗 複製分享鏈接' }, 3000)
  } else {
    shareBtn.textContent = '❌ 複製失敗，請手動複製'
    setTimeout(() => { shareBtn.textContent = '🔗 複製分享鏈接' }, 3000)
  }
})

saveBtn.addEventListener('click', () => {
  window.editSystem.saveAll()
  saveBtn.textContent = '✅ 已保存'
  setTimeout(() => { saveBtn.textContent = '💾 手動保存' }, 2000)
})

restoreBtn.addEventListener('click', () => {
  window.editSystem.restore()
})

// ===== Init =====
initializeAuth()
window.editSystem.initialize()

// ===== Hype Background =====
const HYPE_PHRASES = [
  'ＸＸ 已死',
  '你的工作要被取代了',
  '三天的事情我三秒做完',
  '再不學 AI 就跟不上時代',
  '我們公司都已經用ＡＩ',
  'ＸＸ 推出全新工具，未來將不存在 ＸＸＸ',
  '不懂 AI 就是新文盲',
  '五年後你的職位將不存在',
  'AI 時代來了，適者生存',
  '人類創意已經被超越了',
  '這份報告 AI 三分鐘搞定',
  '你還在手動做這個？',
  'AI 一天頂你一個月',
  '不用 AI 就是在浪費時間',
  '我的競爭對手都在用 AI 了',
  'ChatGPT 比你更懂你的客戶',
]

function initHypeBg() {
  const container = document.getElementById('hype-bg')
  if (!container) return

  const MAX_VISIBLE = 10
  const SHOW_DURATION = 5000   // 顯示多久（ms）
  const INTERVAL = 1200        // 多久加一句

  let active = []

  function spawnPhrase() {
    if (active.length >= MAX_VISIBLE) return

    // 隨機挑一句（避免重複）
    const used = new Set(active.map(a => a.text))
    const pool = HYPE_PHRASES.filter(p => !used.has(p))
    if (pool.length === 0) return
    const text = pool[Math.floor(Math.random() * pool.length)]

    // 隨機位置，確保與現有文字保持距離
    const MIN_DIST = 18  // 最小間距（%）
    let x, y, attempts = 0
    do {
      x = 3 + Math.random() * 68
      y = 5 + Math.random() * 82
      attempts++
    } while (
      attempts < 20 &&
      active.some(a => Math.abs(a.x - x) < MIN_DIST && Math.abs(a.y - y) < MIN_DIST / 2)
    )

    const el = document.createElement('span')
    el.className = 'hype-phrase'
    el.textContent = text
    el.style.left = x + '%'
    el.style.top = y + '%'
    container.appendChild(el)

    // Fade in
    requestAnimationFrame(() => requestAnimationFrame(() => el.classList.add('visible')))

    const entry = { text, el, x, y }
    active.push(entry)

    // Fade out 後移除
    setTimeout(() => {
      el.classList.remove('visible')
      setTimeout(() => {
        el.remove()
        active = active.filter(a => a !== entry)
      }, 1300)
    }, SHOW_DURATION)
  }

  setInterval(spawnPhrase, INTERVAL)
  // 一開始多生幾句，快速填滿
  for (let i = 0; i < 5; i++) setTimeout(spawnPhrase, i * 300)
}

initHypeBg()

// ===== Effects =====
initFluidSmoke()

// ===== Try-it Confetti =====
document.getElementById('try-it-btn')?.addEventListener('click', (e) => {
  e.stopPropagation()
  const duration = 1500
  const end = Date.now() + duration

  ;(function frame() {
    // Left edge
    confetti({ particleCount: 3, angle: 60, spread: 55, origin: { x: 0, y: Math.random() } })
    // Right edge
    confetti({ particleCount: 3, angle: 120, spread: 55, origin: { x: 1, y: Math.random() } })
    // Top edge
    confetti({ particleCount: 2, angle: 90, spread: 80, startVelocity: 30, origin: { x: Math.random(), y: 0 } })
    // Bottom edge
    confetti({ particleCount: 2, angle: 270, spread: 80, gravity: -0.5, startVelocity: 25, origin: { x: Math.random(), y: 1 } })

    if (Date.now() < end) requestAnimationFrame(frame)
  })()
})
