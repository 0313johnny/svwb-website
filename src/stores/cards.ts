import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { Card } from 'components/models';

export const CLASS_MAP: Record<number, string> = {
  0: '中立',
  1: '精靈',
  2: '皇家護衛',
  3: '巫師',
  4: '龍族',
  5: '夜魔',
  6: '主教',
  7: '復仇者',
};

export interface CardFilters {
  classes: number[];      // 空陣列 = 顯示全部職業
  name: string;
  cardSets: number[];
  costs: number[];        // 0~9 精確，10 代表 >= 10
  types: number[];        // 1=從者, 2&3=護符(倒數與非倒數), 4=法術
  rarities: number[];
  tribes: number[];
  skills: string[];       // 關鍵字文字
  skillMode: 'OR' | 'AND';
  atkMin: number | null;
  atkMax: number | null;
  lifeMin: number | null;
  lifeMax: number | null;
  isToken: boolean | null;
  hasStyle: boolean | null;
}

const defaultFilters = (): CardFilters => ({
  classes: [],
  name: '',
  cardSets: [],
  costs: [],
  types: [],
  rarities: [],
  tribes: [],
  skills: [],
  skillMode: 'OR',
  atkMin: null,
  atkMax: null,
  lifeMin: null,
  lifeMax: null,
  isToken: null,
  hasStyle: null,
});

/** 從 skill_text 中提取 <color=Keyword>XXX</color> 的 XXX 列表 */
function extractKeywords(skillText: string): string[] {
  const regex = /<color=Keyword>(.*?)<\/color>/g;
  const keywords: string[] = [];
  let match;
  while ((match = regex.exec(skillText)) !== null) {
    if (!keywords.includes(match[1]!)) keywords.push(match[1]!);
  }
  return keywords;
}

const API_BASE = import.meta.env.VITE_API_BASE ?? 'https://svwb-website-production.up.railway.app';

/** 以 storeId 建立獨立實例，不同頁面各自維護狀態 */
export function useCardsStore(storeId = 'cards') {
  return defineStore(storeId, () => {
  const cardList = ref<Card[]>([]);
  const loading = ref(false);

  /** 使用者正在編輯的條件（尚未送出） */
  const filters = ref<CardFilters>(defaultFilters());
  /** 已套用至結果的條件（按下搜尋後才更新） */
  const appliedFilters = ref<CardFilters>(defaultFilters());

  const filteredCardList = computed(() => {
    let list = cardList.value;
    const f = appliedFilters.value;

    // 費用（10 代表 >= 10）
    if (f.costs.length) {
      list = list.filter((c) =>
        f.costs.some((fc) => (fc === 10 ? c.cost >= 10 : c.cost === fc)),
      );
    }

    // 職業
    if (f.classes.length) {
      list = list.filter((c) => f.classes.includes(c.class_id));
    }

    // 卡包
    if (f.cardSets.length) {
      list = list.filter((c) => f.cardSets.includes(c.common.card_set_id));
    }

    // 稀有度
    if (f.rarities.length) {
      list = list.filter((c) => f.rarities.includes(c.rarity));
    }

    // 卡片分類（type 2 & 3 皆為護符）
    if (f.types.length) {
      list = list.filter((c) =>
        f.types.some((ft) =>
          ft === 2 ? c.common.type === 2 || c.common.type === 3 : c.common.type === ft,
        ),
      );
    }

    // 名稱
    if (f.name.trim()) {
      const kw = f.name.trim();
      list = list.filter((c) => c.common.name.includes(kw));
    }
  
    // 族群（OR）
    if (f.tribes.length) {
      list = list.filter((c) => f.tribes.some((tr) => c.common.tribes.includes(tr)));
    }

    // 能力關鍵字（OR / AND 可切換）
    if (f.skills.length) {
      list = list.filter((c) => {
        const kws = extractKeywords(c.common.skill_text ?? '');
        return f.skillMode === 'AND'
          ? f.skills.every((sk) => kws.includes(sk))
          : f.skills.some((sk) => kws.includes(sk));
      });
    }

    // 攻擊力範圍
    if (f.atkMin !== null) list = list.filter((c) => (c.common.atk ?? 0) >= f.atkMin!);
    if (f.atkMax !== null) list = list.filter((c) => (c.common.atk ?? 0) <= f.atkMax!);

    // 生命值範圍
    if (f.lifeMin !== null) list = list.filter((c) => (c.common.life ?? 0) >= f.lifeMin!);
    if (f.lifeMax !== null) list = list.filter((c) => (c.common.life ?? 0) <= f.lifeMax!);

    // Token
    if (f.isToken !== null) list = list.filter((c) => c.common.is_token === f.isToken);

    // 特殊風格
    if (f.hasStyle !== null) {
      list = list.filter((c) =>
        f.hasStyle ? c.style_card_list.length > 0 : c.style_card_list.length === 0,
      );
    }

    // TODO : 這個 Sort 需要再修正
    return list.slice().sort((a, b) =>
      a.cost - b.cost ||
      a.class_id - b.class_id ||
      a.common.card_set_id - b.common.card_set_id ||
      a.rarity - b.rarity ||
      a.common.type - b.common.type
    );
  });

  /** 一次抓全部卡片，同時將 pending filters 套用 */
  async function fetchCards() {
    appliedFilters.value = JSON.parse(JSON.stringify(filters.value)) as CardFilters;
    loading.value = true;
    try {
      const res = await fetch(`${API_BASE}/api/cards`).then(
        (r) => r.json() as Promise<{ success: boolean; data: Card[] }>,
      );
      cardList.value = res.success ? res.data : [];
    } catch (e) {
      console.error('Failed to fetch cards:', e);
      cardList.value = [];
    } finally {
      loading.value = false;
    }
  }

  function resetFilters() {
    const mode = filters.value.skillMode;
    const clean = { ...defaultFilters(), skillMode: mode };
    filters.value = clean;
    appliedFilters.value = JSON.parse(JSON.stringify(clean)) as CardFilters;
  }

  return {
    cardList,
    filteredCardList,
    loading,
    filters,
    appliedFilters,
    fetchCards,
    resetFilters,
  };
  })();
}
