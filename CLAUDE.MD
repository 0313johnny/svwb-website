我正在開發一個《Shadowverse: Worlds Beyond》的第三方組牌網站。目前進度如下：


後端與資料庫：已成功使用 Python 爬蟲將官方 API 限制 30 張的分頁資料（offset 遞增）爬取完畢。資料結構包含 card_details 等四個列表。目前已成功串接至 MongoDB Atlas 雲端資料庫（有設置 0.0.0.0/0 與安全帳密），資料庫名為 shadowverse_wb，內含 cards collection，每張卡片以 card_id 作為 _id 主鍵，內含 common 與 evo 巢狀結構。後端使用 Node.js Express 開出 /api/cards?class_id=X 接口，會自動以 cost: 1 遞增排序。

前端進度：已完成一個基本能動的 Vue 3 CDN 篩選職業 MVP。

現在目標：我想把前端轉移成比較有規模的 Vue 3 (Vite + Quasar + Pinia + Vue Router) 工程化專案。
請在這個上下文基礎上，協助我開始建構專案。 