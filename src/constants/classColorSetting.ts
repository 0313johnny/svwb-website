/**
 * 職業按鈕顏色
 * active   = 選取時的按鈕色
 * inactive = 未選取時的按鈕色
 * Quasar 色票：https://quasar.dev/style/color-palette
 */
/**
 * 牌組比較圖表的堆疊長條顏色，依職業區分
 * index 0 = 0張（最暗）, 1 = 1張, 2 = 2張, 3 = 3張（最亮）
 */
export const CLASS_DECK_COLORS: Record<number, [string, string, string, string]> = {
  1: ['#1B3A1F', '#2E7D32', '#43A047', '#81C784'], // 精靈：暗綠 → 亮綠
  2: ['#3A2E00', '#F9A825', '#FDD835', '#FFF176'], // 皇家護衛：暗黃 → 亮黃
  3: ['#1A1A4A', '#283593', '#3949AB', '#7986CB'], // 巫師：暗靛藍 → 亮靛藍
  4: ['#3A1A00', '#E65100', '#F4511E', '#FF8A65'], // 龍族：暗橘 → 亮橘
  5: ['#1A0000', '#7B1A1A', '#C62828', '#EF9A9A'], // 夢魘：暗紅 → 亮暗紅
  6: ['#1C1C1C', '#546E7A', '#90A4AE', '#CFD8DC'], // 主教：暗灰 → 銀灰
  7: ['#002A3A', '#0277BD', '#29B6F6', '#80D8FF'], // 復仇者：暗天藍 → 亮天藍
};

export const CLASS_COLORS: Record<number, { active: string; inactive: string }> = {
  0: { active: 'grey-5',        inactive: 'grey-9'    }, // 中立
  1: { active: 'green-5',       inactive: 'green-10'  }, // 精靈
  2: { active: 'yellow-5',      inactive: 'yellow-8'  }, // 皇家護衛
  3: { active: 'indigo-5',      inactive: 'indigo-10' }, // 巫師
  4: { active: 'orange-5',      inactive: 'orange-10' }, // 龍族
  5: { active: 'pink-5',        inactive: 'pink-10'   }, // 夢魘
  6: { active: 'blue-grey-5',   inactive: 'blue-grey-10' }, // 主教
  7: { active: 'cyan-5',        inactive: 'cyan-10'   }, // 復仇者
};