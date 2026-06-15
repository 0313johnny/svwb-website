/**
 * 牌組基底（Deck Archetypes）
 *
 * ─────────────────────────────────────────────────────────────
 * 【新增版本】
 *   1. 在此資料夾新增 vXX.Y.ts，(x 年 y 月) 格式填入 archetypes
 *   2. 在下方 import 並加入 ARCHETYPE_VERSIONS 陣列末端
 *   classifyDeck 預設使用最新版本（陣列最後一項）。
 *
 * 【維護 Archetype】
 *   - coreCards：缺少即不認定為此類型的關鍵牌（建議 4–8 張）
 *   - flexCards：常見但非必放、或有替代品的牌（可省略）
 *
 * 【調整比對門檻】
 *   classifyDeck() 內，預設核心牌門檻為 0.75（75%）。
 *   若某類型的核心牌較多、或變體差異大，可視情況調低至 0.6：
 *
 *     if (coreRate < 0.6) continue;  // ← 改這裡
 *
 * 【未來：以實際張數計算加權（目前未啟用）】
 *   若日後需要區分「放 1 張科技牌」vs「放 3 張主力牌」，可改為：
 *
 *     const deckCountMap = new Map<number, number>();
 *     for (const id of deckCards) deckCountMap.set(id, (deckCountMap.get(id) ?? 0) + 1);
 *
 *     const coreScore = arch.coreCards.reduce((sum, id) => {
 *       const actual   = deckCountMap.get(id) ?? 0;
 *       const expected = 3;
 *       return sum + Math.min(actual / expected, 1);
 *     }, 0) / arch.coreCards.length;
 *
 *   啟用時 classifyDeck 參數需改為未 dedup 的原始陣列。
 *
 * TODO: 跨版本牌組變化比較功能
 *   - 選取兩個版本，對相同 archetype id 的 coreCards 差異做 diff
 *   - 或對賽事 CSV 分別以兩個版本分類，比較各類型佔比變化
 * ─────────────────────────────────────────────────────────────
 */

export interface DeckArchetype {
    id: string;
    name: string;
    classId: number;
    description?: string;
    coreCards: number[];
    flexCards?: number[];
}

export interface ArchetypeVersion {
    id: string;        // 版本識別碼，e.g. 'v26.4'
    label: string;     // 顯示名稱，e.g. '2026年4月 / 第5彈'
    archetypes: DeckArchetype[];
}

// ── 版本列表（新版本加在陣列末端）────────────────────────────
import v26_6 from './v26.6';
// import v26_8 from './v26.8';  // ← 新增版本時在此加一行

export const ARCHETYPE_VERSIONS: ArchetypeVersion[] = [
    v26_6,
    // v26_8,
];

export const LATEST_VERSION: ArchetypeVersion =
    ARCHETYPE_VERSIONS[ARCHETYPE_VERSIONS.length - 1]!;

/**
 * 比對一副牌組屬於哪個牌組基底。
 * @param deckCards  已解碼的卡片 ID 陣列（允許重複，內部會自動 dedup）
 * @param archetypes 要比對的 archetype 清單，預設使用最新版本
 * @returns 最匹配的 DeckArchetype，無法識別時回傳 null
 */
export function classifyDeck(
    deckCards: number[],
    archetypes: DeckArchetype[] = LATEST_VERSION.archetypes,
): DeckArchetype | null {
    const deckSet = new Set(deckCards);
    let best: { archetype: DeckArchetype | null; score: number } = { archetype: null, score: 0 };

    for (const arch of archetypes) {
        if (!arch.coreCards.length) continue;

        const coreMatched = arch.coreCards.filter((id) => deckSet.has(id)).length;
        const coreRate = coreMatched / arch.coreCards.length;

        // 核心牌未達門檻直接排除（調整門檻請參考檔案頂部說明）
        if (coreRate < 0.75) continue;

        const flexTotal = arch.flexCards?.length ?? 0;
        const flexMatched = flexTotal
            ? arch.flexCards!.filter((id) => deckSet.has(id)).length
            : 0;
        const flexRate = flexTotal ? flexMatched / flexTotal : 0;

        // 核心牌佔 80%，非核心牌佔 20%
        const score = coreRate * 0.8 + flexRate * 0.2;
        if (score > best.score) best = { archetype: arch, score };
    }

    return best.archetype;
}
