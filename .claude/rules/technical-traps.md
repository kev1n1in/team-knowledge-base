# 技術陷阱防範規則

## SVG 線條與箭頭
- 畫 SVG 線條/箭頭前，確認 `viewBox` 長寬比與容器 CSS 尺寸一致
- 禁止使用 `preserveAspectRatio="none"`（會扭曲線條）
- 優先用 CSS border/pseudo-element 畫簡單連接線，SVG 只用於複雜路徑

## CSS z-index 與 stacking context
- 子元素的 `z-index` 無法逃出父元素的 stacking context
- 修 z-index 問題前，先往上查父元素是否建立了 stacking context
- 點擊穿透問題：用 `elementFromPoint()` 驗證，搭配 `pointer-events` 處理

## DOM 編輯前先讀取
- 對任何檔案做 Edit 前，先 Read 目標區域確認現有內容符合預期
- 避免 blind edit：不要假設上次讀的內容仍然正確

## 互動元素測試
- 測試 slide 內按鈕時，必須模擬通過 click zone 的真實路徑
- 用 `dispatchEvent(new MouseEvent('click', { clientX, clientY }))` 在 click zone 上測試
- 不要直接呼叫 `.click()`（會繞過 overlay）
