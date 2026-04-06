# 外部系統寫入規則（不可跳過）

## 寫入三步驟
1. 讀取現有結構（`spreadsheets.values.get` + C 欄 hyperlink）並展示給使用者
2. 問清楚：「數據要放哪一欄哪一列？」
3. 等使用者明確說「寫入」「可以」才執行

## 禁止行為
- 禁止 `appendRow` / `values.append` 到已有格式的試算表（會破壞結構）
- 禁止在未確認位置前 `update` 任何格子
- 禁止在使用者確認前執行任何寫入

## 比對資料對應
- 試算表若有超連結欄（如影片連結），用 `spreadsheets.get` + `fields: hyperlink` 提取 video ID，比對對應列
