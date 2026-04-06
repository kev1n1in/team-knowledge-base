# Claude 工作規範（目錄索引）

> 本檔為精簡索引。詳細規則在 `.claude/rules/` 下，按需讀取。

## 核心禁令
- 禁止在使用者確認前寫入外部系統
- 禁止 blind edit（未先 Read 就 Edit）
- 禁止使用 `preserveAspectRatio="none"`
- 缺資訊就問，不猜

## 溝通規則
- OAuth 帳號：問「要用哪個帳號？」不自動選
- 寫入位置：問「放哪一格？」不自行假設
- 有截圖/圖片需求：先問使用者能否提供原檔

## 規則索引（按需讀取 `.claude/rules/`）

| 檔案 | 何時讀取 |
|------|---------|
| `slide-index.md` | 編輯簡報時（25 頁清單、CSS 變數、樣板） |
| `external-write.md` | 寫入 Sheets/外部系統時（三步驟） |
| `technical-traps.md` | 寫 SVG/CSS/DOM 時（陷阱防範） |
