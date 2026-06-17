<template>
  <q-page class="q-pa-lg">
    <div class="admin-area q-mx-auto">
      <div class="text-h6 text-grey-4 q-mb-xs">Archetype 管理工具</div>
      <div class="text-caption text-grey-6 q-mb-md">此頁面不在導覽列中，路徑：/admin/archetypes</div>

      <!-- 牌組 URL 輸入 -->
      <q-input v-model="inputUrl" outlined dark clearable label="貼上牌組 URL"
        placeholder="https://shadowverse-wb.com/cht/deck/detail/?hash=..."
        class="q-mb-sm" @keyup.enter="parse" />
      <div class="row q-gutter-sm q-mb-lg">
        <q-btn unelevated no-caps color="primary" label="解析" icon="search" @click="parse" />
        <q-btn v-if="cards.length" flat no-caps color="grey-5" label="清除" @click="clear" />
      </div>

      <!-- 錯誤 -->
      <q-banner v-if="error" class="q-mb-md bg-red-9 text-white rounded-borders">{{ error }}</q-banner>

      <!-- 卡表載入中 -->
      <q-banner v-if="cardStore.loading" class="q-mb-md bg-dark text-grey-4 rounded-borders">
        卡表載入中...
      </q-banner>

      <!-- 解析結果 -->
      <template v-if="cards.length">
        <div class="row items-center q-mb-sm q-gutter-sm">
          <span class="text-subtitle2 text-grey-4">共 {{ cards.length }} 種卡片</span>
          <q-space />
          <q-btn-toggle v-model="copyMode" dense flat no-caps rounded toggle-color="primary"
            color="dark" text-color="white"
            :options="[{ label: '全選為 core', value: 'core' }, { label: '全選為 flex', value: 'flex' }]" />
          <q-btn unelevated no-caps size="sm" color="teal-8" icon="content_copy"
            label="複製陣列" @click="copyArray" />
        </div>

        <!-- 說明 -->
        <div class="text-caption text-grey-6 q-mb-md">
          勾選要加入的卡片，切換 core / flex，再按「複製陣列」取得可貼入 deckArchetypes.ts 的格式。
        </div>

        <!-- 卡片列表 -->
        <div class="card-list q-gutter-xs">
          <div v-for="card in cards" :key="card.cardId"
            class="card-item row items-center q-px-sm q-py-xs rounded-borders"
            :class="{ selected: card.selected }">

            <q-checkbox v-model="card.selected" dense color="primary" class="q-mr-sm" />

            <!-- 費用泡泡 -->
            <q-avatar size="20px" color="green-8" text-color="white"
              class="text-weight-bold q-mr-sm flex-shrink-0" style="font-size:10px">
              {{ card.cost }}
            </q-avatar>

            <!-- 卡名 -->
            <span class="col text-caption text-weight-bold text-grey-3 q-mr-md ellipsis">
              {{ card.name }}
            </span>

            <!-- ID -->
            <span class="text-caption text-grey-6 q-mr-md mono">{{ card.cardId }}</span>

            <!-- core / flex 切換 -->
            <q-btn-toggle v-if="card.selected" v-model="card.role" dense flat no-caps
              toggle-color="primary" color="dark" text-color="grey-5" size="xs"
              :options="[{ label: 'core', value: 'core' }, { label: 'flex', value: 'flex' }]" />
            <span v-else class="text-caption text-grey-8" style="width:80px" />
          </div>
        </div>

        <!-- 預覽輸出 -->
        <div class="q-mt-lg">
          <div class="text-caption text-grey-5 q-mb-xs">預覽輸出</div>
          <pre class="output-preview q-pa-md rounded-borders text-caption">{{ previewOutput }}</pre>
        </div>
      </template>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useQuasar } from 'quasar';
import { getDeckFromURL } from 'src/utils/url';
import { useCardsStore } from 'stores/cards';

const $q = useQuasar();
const cardStore = useCardsStore('admin');
onMounted(() => { if (!cardStore.cardList.length) void cardStore.fetchCards(); });

const inputUrl = ref('');
const error    = ref('');
const copyMode = ref<'core' | 'flex'>('core');

interface CardEntry {
  cardId:   number;
  name:     string;
  cost:     number;
  selected: boolean;
  role:     'core' | 'flex';
}
const cards = ref<CardEntry[]>([]);

function parse() {
  error.value = '';
  cards.value = [];
  if (!inputUrl.value.trim()) return;

  try {
    const deck  = getDeckFromURL(inputUrl.value.trim());
    const dedup = new Map<number, number>();
    for (const id of deck.cards) dedup.set(id, (dedup.get(id) ?? 0) + 1);

    cards.value = Array.from(dedup.keys())
      .map((cardId) => {
        const card = cardStore.cardList.find((c) => c.common.card_id === cardId);
        return {
          cardId,
          name:     card?.common.name ?? `(未知 ${cardId})`,
          cost:     card?.cost ?? 99,
          selected: true,
          role:     copyMode.value,
        };
      })
      .sort((a, b) => a.cost - b.cost || a.cardId - b.cardId);
  } catch (e) {
    error.value = `解析失敗：${String(e)}`;
  }
}

function clear() {
  inputUrl.value = '';
  cards.value    = [];
  error.value    = '';
}

// 選中的 core / flex 分組
const selectedCore = computed(() => cards.value.filter((c) => c.selected && c.role === 'core'));
const selectedFlex = computed(() => cards.value.filter((c) => c.selected && c.role === 'flex'));

// 產生可貼入 .ts 的格式
const previewOutput = computed(() => {
  const fmtList = (list: CardEntry[]) =>
    list.map((c) => `            ${c.cardId}, // ${c.name}`).join('\n');

  const core = selectedCore.value.length
    ? `        coreCards: [\n${fmtList(selectedCore.value)}\n        ],`
    : '        coreCards: [],';

  const flex = selectedFlex.value.length
    ? `        flexCards: [\n${fmtList(selectedFlex.value)}\n        ],`
    : '        flexCards: [],';

  return `{\n    id: '',\n    name: '',\n    classId: 0,\n    description: '',\n${core}\n${flex}\n},`;
});

function copyArray() {
  void navigator.clipboard.writeText(previewOutput.value).then(() => {
    $q.notify({ type: 'positive', message: '已複製到剪貼簿', timeout: 1500 });
  });
}
</script>

<style scoped lang="scss">
.admin-area {
  width: 75%;
  min-width: 320px;
  max-width: 800px;
}

.card-list {
  display: flex;
  flex-direction: column;
}

.card-item {
  background-color: rgba(255, 255, 255, 0.04);
  transition: background-color 0.15s;

  &.selected {
    background-color: rgba(255, 255, 255, 0.08);
  }
}

.mono {
  font-family: monospace;
  letter-spacing: 0.03em;
}

.output-preview {
  background-color: rgba(0, 0, 0, 0.4);
  color: #aed6a0;
  font-family: monospace;
  font-size: 12px;
  white-space: pre;
  overflow-x: auto;
}
</style>
