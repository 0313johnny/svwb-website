export interface CardCommon {
  card_id: number;
  name: string;
  atk?: number;
  life?: number;
  skill_text?: string;
  cv?: string;
  card_image_hash?: string;
  card_set_id: number;
  type: number;
  tribes: number[];
  is_token: boolean;
}

export interface CardEvo {
  name?: string;
  atk?: number;
  life?: number;
  skill_text?: string;
  card_image_hash?: string;
}

export interface StyleCard {
  hash: string;
  evo_hash: string;
}

export interface Card {
  _id: string;
  cost: number;
  rarity: number;
  class_id: number;
  common: CardCommon;
  evo?: CardEvo;
  style_card_list: StyleCard[];
}
