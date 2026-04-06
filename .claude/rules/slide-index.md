# 簡報專案快速索引（aama/index.html）

> 避免每次重讀大檔。修改專案後請同步更新。

## CSS 自訂屬性（style.css :root）
```
--gold: rgba(196,163,90,1)    --gold-dim: rgba(196,163,90,0.6)
--dark: #06060a               --dark2: #0f0f18
--accent: #7c6cfc (purple)    --accent2: #c46a5a (coral)
--text: #f0ede8               --text-dim: #9a9590
--paper: #f4eee0              --ink: #2a1a0a    --ink-dim: #5a4a3a
```

## Slide 清單（共 25 頁）
| # | ID | 內容 |
|---|-----|------|
| 1 | slide-1 | 封面（fluid canvas smoke） |
| 2 | slide-intro-hype | 你真的有必要使用 AI 嗎？（floating phrases） |
| 3 | slide-intro-evolution | AI Engineering 的進化（4欄：Prompt/Context/Agent/Harness） |
| 4 | slide-harness | Harness（馬匹圖） |
| 5 | slide-layers | 三層不是取代，而是範圍更廣（巢狀圖） |
| 6 | slide-core | Agentic AI 定義 + agent-flow |
| 7 | slide-creativity | 兩張圖片展示 |
| 8 | slide-risk | 過渡文字頁 |
| 9 | slide-cost | 成本（skeleton GIF + 3 卡片） |
| 10 | slide-overview | 企業／個人導入 AI（3欄） |
| 11 | slide-daily-why | 為什麼用 Claude Code 做簡報？ |
| 12 | slide-daily-compare | Claude Code vs 其他工具（含「點我」confetti） |
| 13 | slide-step1 | 把簡報模板做成 Skill |
| 14 | slide-skills | 什麼是 Skills（Nespresso 圖） |
| 15 | slide-kb | 建立 AI 知識基礎設施 |
| 16 | slide-kb-problems | 知識庫靠人維護不夠 |
| 17 | slide-kb-inspiration | 兩個靈感來源 |
| 18 | slide-kb-mapping | 概念底層邏輯 |
| 19 | slide-kb-loop | 自我進化循環 |
| 20 | slide-iterate | 建立迭代閉環 |
| 21 | slide-agents | Agents 的武裝實作 |
| 22 | slide-demo-intro | 公司內部實際例子 - 標題 |
| 23 | slide-demo-result | 公司內部實際例子 - Demo 截圖 |
| 24 | slide-demo-arch | 公司內部實際例子 - SVG 架構圖（含動畫） |
| 25 | slide-summary | Summary + Q&A |

## 特殊規則
- **新增 slide** 後：`total` 自動從 `slides.length` 取，計數器不需手動改
- **編輯模式**：按 `E` 進入，`Esc` 完成，複製 HTML 按按鈕

## 新 Slide HTML 樣板
插入在 `<!-- Navigation -->` 上方：
```html
<div class="slide" id="slide-N">
  <div class="slide-content">
    <div class="step-badge">Step 0X · 小標</div>  <!-- 選用 -->
    <h2>標題</h2>
    <div class="slide-body">
      <!-- 內容 -->
    </div>
  </div>
</div>
```

## Icon 資產（assets/icons/）
`anthropic.svg` · `google.svg` · `googlecloud.svg` · `youtube.svg` · `googlesheets.svg`

用法（SVG 白化）：
```html
<img src="assets/icons/X.svg" width="28" height="28" />
```
```css
.arch-icon img { filter: brightness(0) invert(1); opacity: 0.9; }
```

## Arch Tree 座標系
- 容器：`.arch-tree` = `position:relative; width:720px; height:482px`
- 節點：`position:absolute; transform:translateX(-50%); width:152px`
- 主軸 x=360，左支 x=160，右支 x=560
- SVG：`viewBox="0 0 720 482"`，class `.arch-connectors`
