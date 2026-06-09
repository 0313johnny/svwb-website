<template>
  <q-page class="q-pa-lg">
    <div class="test-area q-mx-auto">
      <div class="text-h6 text-grey-4 q-mb-md">牌組 URL 解析測試</div>

      <!-- 輸入 -->
      <q-input
        v-model="inputUrl"
        outlined dark clearable
        label="貼上牌組 URL"
        placeholder="https://shadowverse-wb.com/cht/deck/detail/?hash=..."
        class="q-mb-md"
      />
      <q-btn unelevated no-caps color="primary" label="解析" icon="search" @click="parse" />

      <!-- 錯誤 -->
      <q-banner v-if="error" class="q-mt-md bg-red-9 text-white rounded-borders">
        {{ error }}
      </q-banner>

      <!-- 結果 -->
      <template v-if="result">
        <q-separator dark class="q-my-md" />

        <!-- 基本資訊 -->
        <div class="row q-gutter-md q-mb-md">
          <q-chip dense color="grey-8" text-color="white" :label="`遊戲模式：${gamemodeName}`" />
          <q-chip dense color="grey-8" text-color="white" :label="`職業：${deckClassName}`" />
          <q-chip dense color="grey-8" text-color="white" :label="`語言：${result.lang}`" />
          <q-chip dense color="grey-8" text-color="white" :label="`共 ${result.cards.length} 張`" />
        </div>

        <!-- 卡片列表（依卡片 ID 分組） -->
        <div class="column q-gutter-xs">
          <div
            v-for="entry in groupedCards" :key="entry.cardId"
            class="card-row row items-center q-px-md q-py-xs rounded-borders"
          >
            <span class="text-grey-3 col">{{ entry.cardId }}</span>
            <q-badge color="primary" :label="`× ${entry.count}`" />
          </div>
        </div>
      </template>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { getDeckFromURL, GAMEMODE, DECK_CLASS, type Deck } from 'src/utils/url';

const inputUrl = ref('');
const result   = ref<Deck | null>(null);
const error    = ref('');

function parse() {
  error.value  = '';
  result.value = null;
  if (!inputUrl.value.trim()) return;

  try {
    result.value = getDeckFromURL(inputUrl.value.trim());
  } catch (e) {
    error.value = `解析失敗：${String(e)}`;
  }
}

// 依 card ID 分組並計算數量
const groupedCards = computed(() => {
  if (!result.value) return [];
  const map = new Map<number, number>();
  for (const id of result.value.cards) {
    map.set(id, (map.get(id) ?? 0) + 1);
  }
  return Array.from(map.entries())
    .map(([cardId, count]) => ({ cardId, count }))
    .sort((a, b) => a.cardId - b.cardId);
});

// 遊戲模式對照
const GAMEMODE_NAMES: Record<string, string> = {
  [GAMEMODE.ROTATION]: '輪替',
  [GAMEMODE.UNLIMITED]: '無限',
  [GAMEMODE.INFINITY]: '無窮',
};

// 職業對照
const DECK_CLASS_NAMES: Record<string, string> = {
  [DECK_CLASS.NEUTRAL]:     '中立',
  [DECK_CLASS.FORESTCRAFT]: '精靈',
  [DECK_CLASS.SWORDCRAFT]:  '皇家護衛',
  [DECK_CLASS.RUNECRAFT]:   '巫師',
  [DECK_CLASS.DRAGONCRAFT]: '龍族',
  [DECK_CLASS.ABYSSCRAFT]:  '夢魘',
  [DECK_CLASS.HEAVENCRAFT]: '主教',
  [DECK_CLASS.PORTALCRAFT]: '復仇者',
};

const gamemodeName  = computed(() => GAMEMODE_NAMES[result.value?.gamemode ?? ''] ?? result.value?.gamemode ?? '-');
const deckClassName = computed(() => DECK_CLASS_NAMES[result.value?.deckClass ?? ''] ?? result.value?.deckClass ?? '-');
</script>

<style scoped lang="scss">
.test-area {
  width: 75%;
  min-width: 320px;
  max-width: 800px;
}

.card-row {
  background-color: rgba(255, 255, 255, 0.04);

  &:hover {
    background-color: rgba(255, 255, 255, 0.08);
  }
}
</style>
