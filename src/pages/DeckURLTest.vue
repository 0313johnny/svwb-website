<template>
    <q-page class="q-pa-lg">
        <div class="test-area q-mx-auto">
            <div class="text-h6 text-grey-4 q-mb-md">牌組 URL 解析測試</div>

            <!-- 輸入 -->
            <q-input v-model="inputUrl" outlined dark clearable label="貼上牌組 URL"
                placeholder="https://shadowverse-wb.com/cht/deck/detail/?hash=..." class="q-mb-md" />
            <q-btn unelevated no-caps color="primary" label="解析" icon="search" @click="parse" />

            <!-- 錯誤 -->
            <q-banner v-if="error" class="q-mt-md bg-red-9 text-white rounded-borders">
                {{ error }}
            </q-banner>

            <!-- 卡表載入中 -->
            <q-banner v-if="cardStore.loading" class="q-mt-md bg-grey-9 text-grey-4 rounded-borders">
                卡表載入中...
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

                <!-- 卡片列表（三欄，每欄最多 14 種） -->
                <div class="row q-col-gutter-sm">
                    <div v-for="(col, ci) in cardColumns" :key="ci" class="col-4 column q-gutter-xs">
                        <CardRow v-for="entry in col" :key="entry.cardId" :cost="entry.cost" :name="entry.name"
                            :rarity="entry.rarity" :banner-url="entry.bannerUrl">
                            <span class="count-badge q-ml-xs">×{{ entry.count }}</span>
                        </CardRow>
                    </div>
                </div>
            </template>
        </div>
    </q-page>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { getDeckFromURL, GAMEMODE, DECK_CLASS, type Deck } from 'src/utils/url';
import { useCardsStore } from 'stores/cards';
import type { Card } from 'src/components/models';
import CardRow from 'src/components/CardRow.vue';

const inputUrl = ref('');
const result = ref<Deck | null>(null);
const error = ref('');

// 使用獨立 store 實例載入完整卡表
const cardStore = useCardsStore('deckURLTest');
onMounted(() => { void cardStore.fetchCards(); });

function lookupCard(cardId: number): Card | undefined {
    return cardStore.cardList.find((c) => c.common.card_id === cardId);
}

function parse() {
    error.value = '';
    result.value = null;
    if (!inputUrl.value.trim()) return;

    try {
        result.value = getDeckFromURL(inputUrl.value.trim());
    } catch (e) {
        error.value = `解析失敗：${String(e)}`;
    }
}

// 依 card ID 分組、計算數量、查詢卡片資訊，並依費用→職業→卡包→稀有度→種類排序
const groupedCards = computed(() => {
    if (!result.value) return [];
    const map = new Map<number, number>();
    for (const id of result.value.cards) {
        map.set(id, (map.get(id) ?? 0) + 1);
    }
    return Array.from(map.entries())
        .map(([cardId, count]) => {
            const card = lookupCard(cardId);
            const hash = card?.common.card_banner_image_hash;
            return {
                cardId,
                count,
                name: card?.common.name ?? `(未知 ${cardId})`,
                cost: card?.cost ?? 999,
                classId: card?.class_id ?? 999,
                setId: card?.common.card_set_id ?? 999,
                rarity: card?.rarity ?? 0,
                type: card?.common.type ?? 999,
                bannerUrl: hash ? `https://shadowverse-wb.com/uploads/card_image/cht/list/${hash}.png` : undefined,
            };
        })
        .sort((a, b) =>
            a.cost - b.cost ||
            a.classId - b.classId ||
            a.setId - b.setId ||
            a.rarity - b.rarity ||
            a.type - b.type
        );
});

// 將卡片列表切成三欄，每欄最多 14 種
const COLUMN_MAX = 8;
const cardColumns = computed(() => {
    const cards = groupedCards.value;
    const cols: (typeof cards)[] = [[], [], []];
    cards.forEach((entry, i) => {
        const col = Math.min(Math.floor(i / COLUMN_MAX), 2);
        cols[col]!.push(entry);
    });
    return cols;
});

// 遊戲模式對照
const GAMEMODE_NAMES: Record<string, string> = {
    [GAMEMODE.ROTATION]: '輪替',
    [GAMEMODE.UNLIMITED]: '無限',
    [GAMEMODE.INFINITY]: '無窮',
};

// 職業對照
const DECK_CLASS_NAMES: Record<string, string> = {
    [DECK_CLASS.NEUTRAL]: '中立',
    [DECK_CLASS.FORESTCRAFT]: '精靈',
    [DECK_CLASS.SWORDCRAFT]: '皇家護衛',
    [DECK_CLASS.RUNECRAFT]: '巫師',
    [DECK_CLASS.DRAGONCRAFT]: '龍族',
    [DECK_CLASS.ABYSSCRAFT]: '夜魔',
    [DECK_CLASS.HEAVENCRAFT]: '主教',
    [DECK_CLASS.PORTALCRAFT]: '復仇者',
};

const gamemodeName = computed(() => GAMEMODE_NAMES[result.value?.gamemode ?? ''] ?? result.value?.gamemode ?? '-');
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
    overflow: hidden;

    &:hover {
        filter: brightness(1.15);
    }
}

.card-name-shadow {
    text-shadow: 0 1px 4px rgba(0, 0, 0, 0.9), 0 0 8px rgba(0, 0, 0, 0.7);
}

.count-badge {
    font-size: 11px;
    font-weight: bold;
    color: white;
    padding: 2px 6px;
    border-radius: 8px;
    background-color: rgba(0, 0, 0, 0.22);
    backdrop-filter: blur(8px);
    flex-shrink: 0;
}
</style>
