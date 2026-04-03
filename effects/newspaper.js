// Newspaper pretext cursor-wrap effect for Slide 9 (index 8)
// Uses @chenglou/pretext layoutNextLine() to make text flow around cursor

import { prepareWithSegments, layoutNextLine } from '@chenglou/pretext'

const FONT = '15px Georgia, serif'
const LINE_H = 26
const AVOID_RADIUS = 70

export function initNewspaper() {
  const slide = document.getElementById('slide-10')
  if (!slide) return

  let mouseX = -999
  let mouseY = -999
  let raf = null

  // Custom ink-dot cursor
  const cursorDot = document.createElement('div')
  cursorDot.style.cssText = `
    position: fixed; z-index: 9999; pointer-events: none;
    width: 14px; height: 14px; border-radius: 50%;
    background: #2a1a0a; opacity: 0;
    transform: translate(-50%, -50%);
    transition: opacity 0.2s;
    mix-blend-mode: multiply;
  `
  document.body.appendChild(cursorDot)

  document.addEventListener('mousemove', e => {
    mouseX = e.clientX
    mouseY = e.clientY
    cursorDot.style.left = mouseX + 'px'
    cursorDot.style.top = mouseY + 'px'
    if (slide.classList.contains('active')) scheduleRender()
  })

  const observer = new MutationObserver(() => {
    const isActive = slide.classList.contains('active')
    cursorDot.style.opacity = isActive ? '1' : '0'
    if (isActive) scheduleRender()
  })
  observer.observe(slide, { attributes: true, attributeFilter: ['class'] })

  const columns = [
    {
      id: 'np-col-1',
      text: '在這個瞬息萬變的世界裡，人工智慧已不再是科技公司的專屬魔法。每一位行銷人員、每一位業務、每一位不會寫程式的普通人，都可以用 AI 工具重新定義自己的工作方式。今日本報特別報導，如何在不懂技術的情況下，讓 AI 成為你最強大的工作夥伴。據本報獨家消息，Zeabur 公司已強制要求所有員工每月使用 200 美元的 AI 工具預算，並見證了生產力的大幅提升。「這不是選擇，而是生存之道，」一位不願透露姓名的內部人士表示。'
    },
    {
      id: 'np-col-2',
      text: '與此同時，本報記者深入調查發現，越來越多非技術背景的工作者，正在用 AI 完成過去需要工程師才能做到的事。一位公關公司的行銷總監，在沒有任何工程師支援的情況下，獨立建立了完整的客戶管理系統。「我只是告訴 AI 我想要什麼，它就幫我做出來了，」她說。知識基礎設施的建立，更是企業 AI 化的關鍵一步。不讓寶貴的經驗只存在某個人的腦海中，而是讓整個組織都能受益，這才是真正的智慧企業。'
    },
    {
      id: 'np-col-3',
      text: '移動你的游標，感受文字的力量——這正是 AI 時代的隱喻：工具會為你讓路，讓你的想法自由流動。本報提醒讀者，AI 的價值不在於它有多聰明，而在於你懂不懂得善加利用。從今天開始，把每天重複做的兩小時工作交給 AI，你的時間，值得更好的事。下期預告：我們將深入報導更多來自各行各業的 AI 實戰案例，敬請期待。'
    }
  ]

  // Prepare once per column
  const prepared = {}
  function ensurePrepared() {
    for (const col of columns) {
      if (!prepared[col.id]) {
        try {
          prepared[col.id] = prepareWithSegments(col.text, FONT)
        } catch (e) { /* font not loaded yet */ }
      }
    }
  }

  function renderColumn(col) {
    const el = document.getElementById(col.id)
    if (!el || !prepared[col.id]) return

    const rect = el.getBoundingClientRect()
    const colW = rect.width
    if (colW <= 0) return

    const localX = mouseX - rect.left
    const localY = mouseY - rect.top

    // Layout lines with cursor-avoidance
    const lines = []
    let cursor = { segmentIndex: 0, graphemeIndex: 0 }
    let y = 0

    while (true) {
      const lineMidY = y + LINE_H / 2
      const dy = Math.abs(lineMidY - localY)
      let w = colW
      let x = 0

      if (dy < AVOID_RADIUS) {
        const factor = 1 - dy / AVOID_RADIUS
        const shrink = AVOID_RADIUS * factor * 1.2

        if (localX > 0 && localX < colW) {
          if (localX < colW / 2) {
            // cursor on left → indent text from left
            x = Math.min(shrink, colW * 0.45)
            w = colW - x
          } else {
            // cursor on right → shrink from right
            w = colW - Math.min(shrink, colW * 0.45)
          }
          w = Math.max(w, colW * 0.4)
        }
      }

      const result = layoutNextLine(prepared[col.id], cursor, w)
      if (result === null) break

      lines.push({ text: result.text, x, y })
      cursor = result.end
      y += LINE_H
    }

    // Re-render spans
    el.innerHTML = ''
    el.style.position = 'relative'
    el.style.height = y + 'px'

    for (const line of lines) {
      const span = document.createElement('span')
      span.textContent = line.text
      span.style.cssText = `
        position: absolute;
        left: ${line.x}px;
        top: ${line.y}px;
        white-space: nowrap;
        font: ${FONT};
        line-height: ${LINE_H}px;
        color: #2a1a0a;
      `
      el.appendChild(span)
    }
  }

  function render() {
    raf = null
    if (!slide.classList.contains('active')) return
    ensurePrepared()
    for (const col of columns) renderColumn(col)
  }

  function scheduleRender() {
    if (!raf) raf = requestAnimationFrame(render)
  }
}
