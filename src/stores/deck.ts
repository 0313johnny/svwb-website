// import { defineStore } from 'pinia';
// import { ref, computed } from 'vue';
// import type { Card } from 'components/models';
// import { ROTATION_SET_IDS } from 'src/constants/cardMeta';

// const DECK_MAX = 40;
// const DECK_MAX_EXTENDED = 50; // 超出模式上限，方便微調
// const CARD_DEFAULT_MAX = 3;

// export type GameMode = 'rotation' | 'unlimited';

// export const useDeckStore = defineStore('deck', () => {

//     // 選定的主職業，null = 尚未選擇
//     const deckClass = ref<number | null>(null);

//     // 遊戲模式
//     const gameMode = ref<GameMode>('rotation');

//     // 是否啟用超出模式（上限 50 張）
//     const extendedMode = ref(false);

//     // 牌組內容：card_id → 張數
//     const deckCards = ref<Map<number, number>>(new Map());

//     // 總張數上限（依超出模式決定）
//     const deckMax = computed(() => extendedMode.value ? DECK_MAX_EXTENDED : DECK_MAX);

//     // 總張數
//     const totalCount = computed(() => {
//         // PSEUDO: sum all values in deckCards
//         return 0;
//     });

//     // 是否達到張數上限
//     const isFull = computed(() => {
//         // PSEUDO: return totalCount >= deckMax
//         return false;
//     });

//     // 取得某張卡目前在牌組的張數
//     function getCount(cardId: number): number {
//         // PSEUDO: return deckCards.get(cardId) ?? 0
//         return 0;
//     }

//     // 取得某張卡的張數上限（優先使用資料庫的 deck_enabled_num，fallback 為 3）
//     function getCardMax(card: Card): number {
//         // PSEUDO: return card.common.deck_enabled_num ?? CARD_DEFAULT_MAX
//         return CARD_DEFAULT_MAX;
//     }

//     // 判斷某張卡是否符合當前遊戲模式（輪換：只允許最新五個卡包）
//     function isAvailableInMode(card: Card): boolean {
//         // PSEUDO:
//         // if gameMode === 'unlimited' → return true
//         // return ROTATION_SET_IDS.includes(card.common.card_set_id)
//         return true;
//     }

//     // 判斷某張卡是否可以加入
//     function canAdd(card: Card): boolean {
//         // PSEUDO:
//         // if deckClass is null → false（尚未選職業）
//         // if card.class_id !== 0 && card.class_id !== deckClass → false（職業不符）
//         // if !isAvailableInMode(card) → false（不符合遊戲模式）
//         // if isFull → false
//         // if getCount(card._id) >= getCardMax(card) → false
//         // return true
//         return false;
//     }

//     // 加入一張卡
//     function addCard(card: Card): void {
//         // PSEUDO:
//         // if !canAdd(card) → return
//         // deckCards.set(card._id, getCount(card._id) + 1)
//     }

//     // 移除一張卡（張數歸零時從 Map 刪除）
//     function removeCard(cardId: number): void {
//         // PSEUDO:
//         // current = getCount(cardId)
//         // if current <= 1 → deckCards.delete(cardId)
//         // else → deckCards.set(cardId, current - 1)
//     }

//     // 選擇主職業
//     // 切換前若牌組已有卡片，呼叫端需先顯示警告確認，確認後再呼叫此函數
//     function setDeckClass(classId: number): void {
//         // PSEUDO:
//         // if classId === deckClass → return
//         // deckClass = classId
//         // deckCards.clear()
//     }

//     // 切換遊戲模式（輪換 ↔ 無限）
//     // 切換後若牌組有不符合新模式的卡，自動移除並回傳被移除的卡片列表（供 UI 顯示警告）
//     function setGameMode(mode: GameMode): Card[] {
//         // PSEUDO:
//         // gameMode = mode
//         // removed = []
//         // for each [cardId, count] in deckCards:
//         //   card = lookup cardId
//         //   if !isAvailableInMode(card) → deckCards.delete(cardId), removed.push(card)
//         // return removed
//         return [];
//     }

//     // 清空整副牌組
//     function clearDeck(): void {
//         // PSEUDO:
//         // deckCards.clear()
//     }

//     // 將牌組轉成 card_id 陣列（含重複，供 URL encode 使用）
//     const deckCardIdArray = computed((): number[] => {
//         // PSEUDO:
//         // result = []
//         // for each [id, count] in deckCards → push id × count times
//         // return result
//         return [];
//     });

//     // 匯出牌組 URL
//     function exportURL(): string {
//         // PSEUDO:
//         // if deckClass is null → return ''
//         // return createDeckURL({ gamemode: gameMode, deckClass, cardIdArr: deckCardIdArray, lang: 'cht' })
//         return '';
//     }

//     // 從 URL 匯入牌組
//     function importFromURL(url: string): void {
//         // PSEUDO:
//         // parsed = getDeckFromURL(url)
//         // setDeckClass(parsed.deckClass)
//         // gameMode = parsed.gamemode
//         // for each cardId in parsed.cardIds → addCard(lookup cardId in cardList)
//     }

//     return {
//         deckClass,
//         gameMode,
//         extendedMode,
//         deckCards,
//         deckMax,
//         totalCount,
//         isFull,
//         getCount,
//         getCardMax,
//         isAvailableInMode,
//         canAdd,
//         addCard,
//         removeCard,
//         setDeckClass,
//         setGameMode,
//         clearDeck,
//         deckCardIdArray,
//         exportURL,
//         importFromURL,
//     };
// });
