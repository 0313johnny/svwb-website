//  Encoding Shadowverse cards' id
//  card id format contain five parts:
//  1. card packs (3 digits)
//  2. class (forestcraft, swordcraft, runecraft etc.)
//     0 = neutral
//     1 = forestcraft
//     2 = swordcraft
//     3 = runecraft
//     4 = dragoncraft
//     5 = abysscraft
//     6 = heavencraft
//     7 = portalcraft
//  3. rarity (1 to 4 represent copper, silver, gold, and legendary in order)
//  4. type (1 to 4 represent follower, amulet, countable amulet, and spell in order)
//  5. serial (3 digits)

//  Encoding id using 64 characters including 0-9, A-Z, a-z, '-' and '_'.
//  The algorithm is same as Radix64 but the mapping string is different.

// Sample Url
// https://shadowverse-wb.com/cht/deck/detail/?hash=1.7.dBdg.dBdg.dBdg.dBus.dBus.dC5M.dCL8.dCL8.dCL8.dyRQ.dyRQ.dyRQ.dywM.dywM.dywM.eL5E.eL5E.eL5E.eLN-.eLN-.eLN-.eLae.eLae.eLae.ej_8.ej_8.ej_8.f5jk.f5jk.f5jk.f5wE.f5wE.f5wE.f69s.f69s.f69s.f6PU.f6PU.f6PU.f6Pe

const BASE64_MAP = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz-_';

function idToHash(n: number): string {
  const hash: string[] = [];

  while (n) {
    hash.push(BASE64_MAP[n % 64]!);
    n = Math.floor(n / 64);
  }

  hash.reverse();
  return hash.join('');
}

function hashToId(hash: string): number {
  let id = 0;

  for (let i = 0; i < hash.length; i++) {
    const ch = hash[i]!;
    if (ch >= '0' && ch <= '9')
      id = id * 64 + ch.charCodeAt(0) - '0'.charCodeAt(0);
    else if (ch >= 'A' && ch <= 'Z')
      id = id * 64 + ch.charCodeAt(0) - 'A'.charCodeAt(0) + 10;
    else if (ch >= 'a' && ch <= 'z')
      id = id * 64 + ch.charCodeAt(0) - 'a'.charCodeAt(0) + 36;
    else if (ch === '-')
      id = id * 64 + 62;
    else if (ch === '_')
      id = id * 64 + 63;
  }

  return id;
}

export const GAMEMODE = {
  ROTATION: 1,
  UNLIMITED: 2,
  INFINITY: 3,
} as const;

export type Gamemode = (typeof GAMEMODE)[keyof typeof GAMEMODE];

export const DECK_CLASS = {
  NEUTRAL:     0,
  FORESTCRAFT: 1,
  SWORDCRAFT:  2,
  RUNECRAFT:   3,
  DRAGONCRAFT: 4,
  ABYSSCRAFT:  5,
  HEAVENCRAFT: 6,
  PORTALCRAFT: 7,
} as const;

export type DeckClass = (typeof DECK_CLASS)[keyof typeof DECK_CLASS];

export const SUPPORTED_LANGS = ['cht', 'ja', 'en', 'kr'] as const;
export type SupportedLang = (typeof SUPPORTED_LANGS)[number];

const PORTAL_ORIGIN = 'https://shadowverse-wb.com';

function portalBase(lang: SupportedLang): string {
  return `${PORTAL_ORIGIN}/${lang}/deck/detail/?hash=`;
}

export interface DeckURLParams {
  gamemode: Gamemode;
  deckClass: DeckClass;
  cardIdArr: number[];
  lang?: SupportedLang; // 預設 'cht'
}

export interface Deck {
  gamemode: string;
  deckClass: string;
  lang: SupportedLang;
  cards: number[];
}

export function createDeckURL({
  gamemode,
  deckClass,
  cardIdArr,
  lang = 'cht',
}: DeckURLParams): string {
  const hashedCards = cardIdArr.map((id) => idToHash(id));
  const cardIdStr = hashedCards.join('.');
  return `${portalBase(lang)}${gamemode}.${deckClass}.${cardIdStr}`;
}

export function getDeckFromURL(url: string): Deck {
  // 從路徑中解析語言，例如 /cht/、/ja/
  const langMatch = url.match(new RegExp(`${PORTAL_ORIGIN}/([^/]+)/`));
  const lang = (SUPPORTED_LANGS as readonly string[]).includes(langMatch?.[1] ?? '')
    ? (langMatch![1] as SupportedLang)
    : 'cht';

  // 取出 hash= 之後的部分
  const hash = url.split('?hash=')[1] ?? '';

  // example: 1.7.dBdg.dBdg.dBdg......f6Pe
  // 1 = gamemode, 7 = deckClass, 其餘 40 個為卡片 hash
  const parts      = hash.split('.');
  const gamemode   = parts[0]!;
  const deckClass  = parts[1]!;
  const cardHashes = parts.slice(2);

  const decodedCards = cardHashes.map((card) => hashToId(card));

  return { gamemode, deckClass, lang, cards: decodedCards };
}
