<template>
  <q-page class="q-pa-lg">
    <div class="compare-area q-mx-auto">
      <div class="text-h6 text-grey-4 q-mb-md">牌組比較</div>

      <!-- CSV 上傳 -->
      <div class="row items-center q-gutter-sm q-mb-md">
        <q-file v-model="csvFile" outlined dark dense accept=".csv" label="上傳賽事 CSV"
          class="csv-input" @update:model-value="onFileSelected">
          <template #prepend><q-icon name="upload_file" /></template>
        </q-file>
        <q-btn v-if="Object.keys(decksByClass).length" flat no-caps dense color="grey-5"
          icon="clear" label="清除" @click="reset" />
      </div>

      <!-- 錯誤 -->
      <q-banner v-if="error" class="q-mb-md bg-red-9 text-white rounded-borders">
        {{ error }}
      </q-banner>

      <!-- 職業按鈕（有資料才顯示） -->
      <template v-if="Object.keys(decksByClass).length">
        <div class="row items-center q-gutter-sm q-mb-md">
          <q-btn v-for="classId in availableClasses" :key="classId"
            :label="`${CLASS_MAP[classId]} (${decksByClass[classId]?.length ?? 0})`"
            :color="activeClass === classId ? CLASS_COLORS[classId]!.active : CLASS_COLORS[classId]!.inactive"
            no-caps unelevated @click="activeClass = activeClass === classId ? null : classId" />
        </div>

        <!-- 展開的職業圖表 -->
        <template v-if="activeClass !== null">
          <div class="row items-center q-gutter-sm q-mb-sm">
            <span class="text-subtitle2 text-grey-4">
              {{ CLASS_MAP[activeClass] }} —
              共 {{ decksByClass[activeClass]?.length ?? 0 }} 副牌組，
              {{ chartData.length }} 種卡片
            </span>
            <q-space />
            <!-- 排序按鈕 -->
            <q-btn-toggle v-model="sortBy" dense flat no-caps rounded
              toggle-color="primary" color="grey-8" text-color="white"
              :options="[
                { label: '費用', value: 'cost' },
                { label: '攜帶率', value: 'usage' },
              ]" />
            <q-btn flat dense round
              :icon="sortOrder === 'asc' ? 'arrow_upward' : 'arrow_downward'"
              color="grey-4" @click="sortOrder = sortOrder === 'asc' ? 'desc' : 'asc'" />
          </div>
          <!-- 圖表 + 左側卡片列表疊層 -->
          <div class="chart-wrap" :style="{ height: chartHeight }">
            <!-- ECharts（y 軸隱藏，左側留空給卡片列表） -->
            <VChart ref="chartRef" :option="chartOption" style="width:100%;height:100%"
              autoresize @rendered="syncOverlay" />
            <!-- 卡片列表疊在左側，每列由 convertToPixel 精確定位 -->
            <div class="card-overlay">
              <CardRow v-for="(card, i) in chartData" :key="card.cardId"
                :cost="card.cost" :name="card.name"
                :rarity="card.rarity" :banner-url="card.bannerUrl"
                :style="{ top: `${overlayTops[i] ?? 0}px` }" />
            </div>
          </div>
        </template>
      </template>

      <!-- TODO: 改成從 MongoDB 讀取歷史賽事資料 (方案B) -->
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import Papa from 'papaparse';
import { use } from 'echarts/core';
import { BarChart } from 'echarts/charts';
import { GridComponent, TooltipComponent, LegendComponent } from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';
import { getDeckFromURL } from 'src/utils/url';
import { useCardsStore, CLASS_MAP } from 'stores/cards';
import { CLASS_COLORS, CLASS_DECK_COLORS } from 'src/constants/classColorSetting';
import CardRow from 'src/components/CardRow.vue';

const GRID_TOP    = 40;  // ECharts grid.top（legend 高度），卡片列表疊層對齊用
const GRID_BOTTOM = 10;
const ROW_H       = 30;  // 每列高度：CardRow 26px + gap 4px

use([BarChart, GridComponent, TooltipComponent, LegendComponent, CanvasRenderer]);

// ── 卡表 ─────────────────────────────────────────────────────
const cardStore = useCardsStore('deckCompare');
if (!cardStore.cardList.length) void cardStore.fetchCards();

function lookupCard(cardId: number) {
  return cardStore.cardList.find((c) => c.common.card_id === cardId);
}

// ── 狀態 ─────────────────────────────────────────────────────
const csvFile = ref<File | null>(null);
const error   = ref('');

// 依職業分組：classId → Map<cardId, count>[]
const decksByClass = ref<Record<number, Map<number, number>[]>>({});

// 目前展開的職業，null = 全收合
const activeClass = ref<number | null>(null);

// 排序設定
const sortBy    = ref<'cost' | 'usage'>('cost');
const sortOrder = ref<'asc' | 'desc'>('asc');

// 有資料的職業清單（排序 1-7）
const availableClasses = computed(() =>
  Object.keys(decksByClass.value).map(Number).sort((a, b) => a - b)
);

// ── CSV 解析 ──────────────────────────────────────────────────
function onFileSelected(file: File | null) {
  if (!file) return;
  error.value = '';
  decksByClass.value = {};
  activeClass.value = null;

  Papa.parse<Record<string, string>>(file, {
    header: true,
    skipEmptyLines: true,
    complete(results) {
      try {
        const grouped: Record<number, Map<number, number>[]> = {};

        for (const row of results.data) {
          const entries = [
            { url: row['牌組(一) 連結'] },
            { url: row['牌組(二) 連結'] },
          ];

          for (const { url } of entries) {
            if (!url?.trim()) continue;
            try {
              const deck = getDeckFromURL(url.trim());
              const classId = parseInt(deck.deckClass);
              if (isNaN(classId) || classId === 0) continue;

              const map = new Map<number, number>();
              for (const id of deck.cards) {
                map.set(id, (map.get(id) ?? 0) + 1);
              }

              if (!grouped[classId]) grouped[classId] = [];
              grouped[classId]?.push(map);
            } catch {
              // 單筆 URL 解析失敗時跳過
            }
          }
        }

        decksByClass.value = grouped;
      } catch (e) {
        error.value = `CSV 解析失敗：${String(e)}`;
      }
    },
    error(e) {
      error.value = `檔案讀取失敗：${e.message}`;
    },
  });
}

// ── 統計資料（依 activeClass） ────────────────────────────────
const chartData = computed(() => {
  if (activeClass.value === null) return [];
  const maps = decksByClass.value[activeClass.value] ?? [];
  if (!maps.length || !cardStore.cardList.length) return [];

  // 收集該職業牌組中出現過的所有 cardId
  const allIds = new Set<number>();
  for (const map of maps) {
    for (const id of map.keys()) allIds.add(id);
  }

  const stats = [];
  for (const cardId of allIds) {
    const card = lookupCard(cardId);
    if (!card) continue;
    // 只顯示該職業卡 + 中立卡
    if (card.class_id !== 0 && card.class_id !== activeClass.value) continue;

    const hash = card.common.card_banner_image_hash;
    stats.push({
      cardId,
      name:      card.common.name,
      cost:      card.cost,
      classId:   card.class_id,
      setId:     card.common.card_set_id,
      rarity:    card.rarity,
      type:      card.common.type,
      counts:    maps.map((m) => m.get(cardId) ?? 0),
      bannerUrl: hash ? `https://shadowverse-wb.com/uploads/card_image/cht/list/${hash}.png` : undefined,
    });
  }

  const dir = sortOrder.value === 'asc' ? 1 : -1;

  if (sortBy.value === 'usage') {
    // 攜帶率：有放該卡（count > 0）的牌組數佔比，高到低
    return stats.sort((a, b) => {
      const usageA = a.counts.filter((v) => v > 0).length;
      const usageB = b.counts.filter((v) => v > 0).length;
      return (usageB - usageA) * dir;
    });
  }

  // 費用排序（預設），費用相同則依職業→卡包→稀有度→種類
  return stats.sort((a, b) =>
    (a.cost    - b.cost    ||
     a.classId - b.classId ||
     a.setId   - b.setId   ||
     a.rarity  - b.rarity  ||
     a.type    - b.type) * dir
  );
});

// ── ECharts option ────────────────────────────────────────────
const DEFAULT_STACK_COLORS: [string, string, string, string] = ['#37474F', '#1565C0', '#2E7D32', '#F57F17'];

const chartOption = computed(() => {
  if (!chartData.value.length) return {};

  const cards      = chartData.value;
  const deckCount  = (decksByClass.value[activeClass.value!] ?? []).length;
  const cardNames  = cards.map((c) => `[${c.cost}] ${c.name}`);
  const stackColors = CLASS_DECK_COLORS[activeClass.value!] ?? DEFAULT_STACK_COLORS;

  const seriesData = [0, 1, 2, 3].map((n) => ({
    name: `${n}張`,
    type: 'bar' as const,
    stack: 'total',
    barWidth: ROW_H - 4,        // 26px，與 CardRow 高度相同
    barCategoryGap: '0%',
    itemStyle: { color: stackColors[n] },
    label: {
      show: true,
      color: '#fff',
      fontSize: 10,
      formatter: (p: { value: number }) => p.value >= 5 ? `${p.value}%` : '',
    },
    data: cards.map((c) => {
      const cnt = c.counts.filter((v) => v === n).length;
      return deckCount ? Math.round((cnt / deckCount) * 100) : 0;
    }),
  }));

  return {
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' },
      formatter: (params: { seriesName: string; value: number }[]) =>
        params.map((p) => `${p.seriesName}：${p.value}%`).join('<br/>'),
    },
    legend: {
      data: ['0張', '1張', '2張', '3張'],
      textStyle: { color: '#aaa' },
    },
    grid: { left: '220px', right: '20px', top: `${GRID_TOP}px`, bottom: `${GRID_BOTTOM}px` },
    xAxis: {
      type: 'value',
      max: 100,
      axisLabel: { formatter: '{value}%', color: '#888' },
    },
    yAxis: {
      type: 'category',
      data: cardNames,
      inverse: true,
      axisLabel: { show: false },
      axisTick: { show: false },
      axisLine: { show: false },
    },
    series: seriesData,
  };
});

// canvas 總高 = grid.top + n×ROW_H + grid.bottom，讓 slot 高精確等於 ROW_H
const chartHeight = computed(() =>
  `${Math.max(300, chartData.value.length * ROW_H + GRID_TOP + GRID_BOTTOM)}px`
);

// ── 疊層精確定位 ──────────────────────────────────────────────
const chartRef    = ref();
const overlayTops = ref<number[]>([]);

function syncOverlay() {
  const chart = chartRef.value?.chart;
  if (!chart) return;
  overlayTops.value = chartData.value.map((_, i) => {
    // convertToPixel 回傳該 category 中心的 y 座標（相對於 canvas）
    const centerY = chart.convertToPixel({ yAxisIndex: 0 }, i) as number;
    return centerY - 13; // 13 = CardRow 高度 26px 的一半
  });
}

// 排序或職業切換時重新同步（圖表重繪後 @rendered 也會觸發）
watch(chartData, () => { overlayTops.value = []; });

// ── 重置 ──────────────────────────────────────────────────────
function reset() {
  csvFile.value      = null;
  decksByClass.value = {};
  activeClass.value  = null;
  error.value        = '';
}
</script>

<style scoped lang="scss">
.compare-area {
  width: 75%;
  min-width: 320px;
  max-width: 1400px;
}

.csv-input {
  min-width: 280px;
}

.chart-wrap {
  position: relative;
  width: 100%;
}

.card-overlay {
  position: absolute;
  inset: 0;
  width: 220px;
  pointer-events: none;

  // 每個 CardRow 用 absolute top 獨立定位，不靠 flex 累積
  :deep(.card-row) {
    position: absolute;
    width: 100%;
  }
}
</style>
