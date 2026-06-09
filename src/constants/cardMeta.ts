export const CARD_SET_NAMES: Record<number, string> = {
  10000: '基本卡',
  10001: '傳說揭幕',
  10002: '無限進化',
  10003: '絕傑的繼承者',
  10004: '蒼空六龍',
  10005: '花醉遊戲',
  10006: '天啟盟約',
  10007: '誅神弒滅者',
};

export const RARITY_NAMES: Record<number, string> = {
  1: '青銅',
  2: '白銀',
  3: '黃金',
  4: '傳說',
};

export const RARITY_COLORS: Record<number, string> = {
  1: 'brown-6',
  2: 'grey-5',
  3: 'amber-6',
  4: 'deep-orange-6',
};

// type 2 (倒數護符) 與 type 3 (一般護符) 在遊戲中統一顯示為「護符」
export const CARD_TYPE_OPTIONS = [
  { value: 1, label: '從者' },
  { value: 2, label: '護符' }, // 匹配 type 2 & 3
  { value: 4, label: '法術' },
];

// 排除 id=0 的「-」（無族群）
export const TRIBE_NAMES: Record<number, string> = {
  2: '士兵',
  3: '魯米那斯',
  4: '雷維翁',
  5: '妖精',
  6: '死者',
  8: '土之印',
  11: '馬納歷亞',
  12: '巨像',
  13: '式神',
  14: '創造物',
  15: '人偶',
  17: '海洋',
  18: '財寶',
  19: '獵境者',
  20: '弒滅者',
};

export const SKILL_NAMES: Record<number, string> = {
  1: '入場曲',
  2: '謝幕曲',
  3: '進化時',
  4: '攻擊時',
  5: '守護',
  6: '疾馳',
  7: '潛行',
  8: '必殺',
  9: '吸血',
  10: '覺醒',
  12: '魔力增幅時',
  13: '倒數',
  14: '死靈術',
  15: '土之秘術',
  16: '突進',
  17: '交戰時',
  18: '爆能強化',
  19: '亡者召還',
  22: '激奏',
  23: '瞬念召喚',
  24: '結晶',
  25: '融合',
  26: '協作',
  27: '土之印',
  29: '連擊',
  30: '威懾',
  31: '光紋',
  32: '障壁',
  33: '超進化時',
  34: '模式',
  35: '策動',
  36: '紋章',
  38: '啟示錄牌組',
  39: '信仰',
  40: '馬塞班恩牌組',
  41: '奧義',
  42: '解放奧義',
};

// 費用選項：0~9 精確比對，value=10 代表「10以上」
export const COST_OPTIONS = [
  ...Array.from({ length: 10 }, (_, i) => ({ value: i, label: String(i) })),
  { value: 10, label: '10+' },
];
