import { initFluidSmoke } from './effects/fluid-smoke.js'
import { initNewspaper } from './effects/newspaper.js'

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
  // Update nav color for newspaper slide (slide 10 = index 9)
  const isNewspaper = current === 9
  counter.style.color = isNewspaper ? '#5a4a3a' : ''
}

clickPrev.addEventListener('click', () => { if (!editMode) goTo(current - 1) })
clickNext.addEventListener('click', () => { if (!editMode) goTo(current + 1) })

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

function toggleEditMode() {
  editMode = !editMode
  document.body.classList.toggle('edit-mode', editMode)
  editBadge.textContent = editMode ? '✏ 編輯模式（按 E 退出，Esc 完成單格編輯）' : ''
  copyBtn.style.display = editMode ? 'block' : 'none'
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
    '.cover-title, .cover-sub, .big-text, .callout, .note, ' +
    '.newspaper-title, .newspaper-date, .newspaper-headline'
  )
  if (target && !target.closest('#slide-10 .newspaper-columns')) {
    target.contentEditable = 'true'
    target.focus()
  }
})

copyBtn.addEventListener('click', () => {
  // Clean up contenteditable attrs before copying
  document.querySelectorAll('[contenteditable]').forEach(el => {
    el.removeAttribute('contenteditable')
  })
  navigator.clipboard.writeText(document.documentElement.outerHTML).then(() => {
    copyBtn.textContent = '✅ 已複製！把它貼給 Claude Code 說「用這個更新 index.html」'
    setTimeout(() => { copyBtn.textContent = '📋 複製修改後的 HTML' }, 3000)
  })
})

// ===== Effects =====
initFluidSmoke()
initNewspaper()
