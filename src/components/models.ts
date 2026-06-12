/**
 * 卡片基本資訊（通常狀態）
 * 對應 MongoDB cards collection 中的 common 欄位
 */
export interface CardCommon {
  /** 遊戲內卡片 ID（數字），與 Card._id 值相同，型別為 number */
  card_id: number;
  /** 卡片名稱 */
  name: string;
  /** 攻擊力（只有從者有，法術/護符無此欄位） */
  atk?: number;
  /** 生命值（只有從者有，法術/護符無此欄位） */
  life?: number;
  /** 技能文字（含 <color=Keyword>XXX</color> 格式的關鍵字標記） */
  skill_text?: string;
  /** 聲優名稱 */
  cv?: string;
  /** 卡片圖片 hash，完整圖片 URL 為 https://shadowverse-wb.com/uploads/card_image/cht/card/{hash}.png */
  card_image_hash?: string;
  /** 橫幅縮圖 hash，完整圖片 URL 為 https://shadowverse-wb.com/uploads/card_image/cht/list/{hash}.png */
  card_banner_image_hash?: string;
  /** 所屬卡包 ID（對應 CARD_SET_NAMES） */
  card_set_id: number;
  /** 卡片種類：1=從者, 2=護符(倒數), 3=護符(常駐), 4=法術 */
  type: number;
  /** 所屬族群 ID 陣列（對應 TRIBE_NAMES，可複數） */
  tribes: number[];
  /** 是否為特殊卡（Token），Token 卡無法直接編入牌組 */
  is_token: boolean;
  /** 牌組可放入的最大張數，官方限制時會小於預設值 3，undefined 則視為 3 */
  deck_enabled_num?: number;
}

/**
 * 卡片進化後資訊
 * 對應 MongoDB cards collection 中的 evo 欄位
 * 只有從者有進化型態，法術/護符無此欄位
 */
export interface CardEvo {
  /** 進化後名稱（通常與進化前相同） */
  name?: string;
  /** 進化後攻擊力 */
  atk?: number;
  /** 進化後生命值 */
  life?: number;
  /** 進化後技能文字 */
  skill_text?: string;
  /** 進化後卡片圖片 hash */
  card_image_hash?: string;
}

/**
 * 特殊插畫風格卡片的圖片資訊
 * 對應 MongoDB cards collection 中的 style_card_list 陣列元素
 */
export interface StyleCard {
  /** 特殊插畫（通常狀態）圖片 hash */
  hash: string;
  /** 特殊插畫（進化狀態）圖片 hash */
  evo_hash: string;
}

/**
 * 完整卡片資料
 * 對應 MongoDB cards collection 的頂層文件結構
 */
export interface Card {
  /** MongoDB 主鍵（字串），值與 common.card_id 相同，型別為 string */
  _id: string;
  /** 費用 */
  cost: number;
  /** 稀有度（對應 RARITY_NAMES / RARITY_COLORS） */
  rarity: number;
  /** 所屬職業 ID（對應 CLASS_MAP，0=中立） */
  class_id: number;
  /** 通常狀態資訊 */
  common: CardCommon;
  /** 進化後資訊（從者才有） */
  evo?: CardEvo;
  /** 特殊插畫風格列表（無特殊插畫時為空陣列） */
  style_card_list: StyleCard[];
}
