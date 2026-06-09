/**
 * 職業按鈕顏色
 * active   = 選取時的按鈕色
 * inactive = 未選取時的按鈕色
 * Quasar 色票：https://quasar.dev/style/color-palette
 */
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