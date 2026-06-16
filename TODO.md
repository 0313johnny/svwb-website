# TODO

## 卡片圖鑑

- [x] 點選卡片時跳轉到卡片資訊頁面（CardDetail.vue dialog）
- [ ] 卡片特殊插畫檢視功能消失（疑似 git filter-repo 重寫歷史時遺失，需要重新確認 CardItem.vue / CardsList.vue 中圖鑑列表本身是否能直接看特殊插畫，目前只有 CardDetail dialog 內有切換）

## 牌組比較

- [ ] 長條圖百分比加總未滿 100% 的修正遺失（已確認：`src/pages/DeckCompare.vue` 目前 `chartData` 仍用 `Math.round((cnt / deckCount) * 100)` 計算 data，會造成四捨五入誤差。先前討論的修正方式是 data 存 float 原始值、只在 label/tooltip formatter 用 `.toFixed(1)` 顯示，但這個修正沒有 commit 進 git，疑似當時只在本地測試未 push，或被 git filter-repo 重寫歷史時連帶遺失。需要重新套用該修正並 push）

## 組牌器

- [ ] 點選圖鑑上的卡片時，右方的牌組區域加入對應卡片

## 賽事

- [ ] 賽事戰報抓取
- [ ] 賽事資訊整理頁面
