/**
 * 牌組基底（Deck Archetypes）
 *
 * 用途：定義各職業的主流牌組雛型，供 DeckURLTest 與 DeckCompare 自動分類。
 *
 * ─────────────────────────────────────────────────────────────
 * 【新增版本】
 *   在 ARCHETYPE_VERSIONS 陣列末端新增一個 ArchetypeVersion 物件。
 *   建議作法：複製上一版本的 archetypes 陣列後依新卡包調整。
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
    id: string;        // 版本識別碼，e.g. 'v1.4'
    label: string;     // 顯示名稱，e.g. '2026年4月 / 第5彈'
    archetypes: DeckArchetype[];
}

// ── 版本列表（新版本加在陣列末端）────────────────────────────
export const ARCHETYPE_VERSIONS: ArchetypeVersion[] = [
    {
        id: 'v1.0',
        label: '2026年6月/誅神弒滅者 S2',
        archetypes: [
            // ── 夜魔（classId: 5）─────────────────────────────────────


            // ── 精靈（classId: 1）─────────────────────────────────────
            {
                id: 'Evolution Forestcraft',
                name: '進化精靈',
                classId: 1,
                description: '',
                coreCards: [],
                flexCards: [],
            },

            // ── 皇家護衛（classId: 2）─────────────────────────────────
            {
                id: 'Swordcraft',
                name: '快攻皇家護衛',
                classId: 2,
                description: '',
                coreCards: [],
                flexCards: [],
            },

            // ── 巫師（classId: 3）─────────────────────────────────────
            {
                id: 'Dirt-Runecraft',
                name: '土之秘術巫師',
                classId: 3,
                description: '',
                coreCards: [
                    10732120, // 俏麗的捕食者
                    10732110, // 魅力飛怪
                    10434120, // 天才美少女鍊金術師‧卡莉歐斯托蘿
                    10432120, // 艱辛的旅程‧米蕾羽＆麗婕特
                    10733110, // 詭甜的化身
                    10234120, // 堅定的鍊金術師‧諾曼
                    10404110, // 天司長的後繼者‧聖德芬
                    10734110, // 萬食的弒滅者‧菈菈安瑟姆
                    10234110, // 暴食的弒滅者‧菈菈安瑟姆
                    10734120, // 迷人的傑作
                ],
                flexCards: [
                    10433310, // 鍊金爆炎
                    10732310, // 暴食的點心
                    10733310, // 貪食的魔力
                ],
            },

            // ── 龍族（classId: 4）─────────────────────────────────────
            {
                id: 'Ramp Dragoncraft',
                name: '跳費龍族',
                classId: 4,
                description: '',
                coreCards: [],
                flexCards: [],
            },

            {
                id: 'Midrange Abysscraft',
                name: '中速夜魔',
                classId: 5,
                description: '',
                coreCards: [
                    10754110, // 徒姬
                    10754120, // 馬可米蘭
                    10354120, // 沉默x愛絕
                ],
                flexCards: [],
            },
            {
                id: 'Evolution Abysscraft',
                name: '進化夜魔',
                classId: 5,
                description: '',
                coreCards: [
                    10403110, // 葛蘭姬塔
                    10404110, // 聖德芬
                    10453110, // 涅槃
                    10454110, // 闇龍
                    10454120, // 彼列
                ],
                flexCards: [],
            },
            {
                id: 'Milteo Abysscraft',
                name: '戀人夜魔',
                classId: 5,
                description: '',
                coreCards: [
                    10554110, // 戀人與節制
                    10303110, // 滿懷勇氣的少女
                ],
                flexCards: [],
            },

            // ── 主教（classId: 6）─────────────────────────────────────
            {
                id: 'heaven-control',
                name: '控制主教',
                classId: 6,
                description: '',
                coreCards: [],
                flexCards: [],
            },

            // ── 復仇者（classId: 7）───────────────────────────────────
            {
                id: 'Artifact Portalcraft',
                name: '創造物復仇者',
                classId: 7,
                description: '',
                coreCards: [
                    10271210, // 創造物彈射裝置
                    10272310, // 伊卡洛斯的飛翔
                    10771310, // 街頭疾走
                    10471130, // 報恩的技師‧艾札克
                    10674120, // 古老天斧‧尤格傑特
                    10772110, // 自在的滑板玩家
                    10773110, // 野性的播報員
                    10572110, // 次世代地理學家
                    10274120, // 心魂武藝‧迦爾拉
                    10774110, // 虛刻的弒滅者‧史考雷特
                ],
                flexCards: [
                    10774120, // 奮勉奔逐‧妙
                    10473110, // 思慕蒼空的歸還者‧卡希烏斯
                ],
            },
        ],
    },
    // 新增版本請複製上方物件並貼在此處，修改 id、label 與 archetypes
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
