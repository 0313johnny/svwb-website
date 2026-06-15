<template>
    <q-dialog :model-value="modelValue" @update:model-value="$emit('update:modelValue', $event)" maximized
        transition-show="fade" transition-hide="fade">
        <q-card class="detail-card column no-wrap" dark>

            <!-- 標題列 -->
            <q-bar class="detail-bar q-px-md">
                <span class="text-subtitle1 text-weight-bold text-grey-3">{{ card.common.name }}</span>
                <q-space />
                <q-btn dense flat round icon="close" color="grey-4" v-close-popup />
            </q-bar>

            <!-- 主體：圖片 + 資訊 -->
            <div class="detail-body row no-wrap col">

                <!-- 左側：卡片圖片 -->
                <div class="image-panel column items-center justify-start q-pa-md q-gutter-sm">
                    <img v-if="currentImageHash"
                        :src="`https://shadowverse-wb.com/uploads/card_image/cht/card/${currentImageHash}.png`"
                        class="card-img" :alt="card.common.name" />
                    <div v-else class="card-img-placeholder row items-center justify-center text-grey-7">
                        <q-icon name="image" size="64px" />
                    </div>

                    <!-- 進化切換（從者才有） -->
                    <q-btn-toggle v-if="card.evo?.card_image_hash" v-model="showEvo" dense unelevated no-caps
                        toggle-color="amber-8" color="grey-9" text-color="grey-4"
                        :options="[{ label: '通常', value: false }, { label: '進化', value: true }]" />

                    <!-- 特殊插畫 -->
                    <div v-if="card.style_card_list.length" class="row q-gutter-xs">
                        <q-avatar v-for="(s, i) in card.style_card_list" :key="i" size="36px"
                            class="style-thumb cursor-pointer" @click="styleIndex = styleIndex === i ? null : i">
                            <img :src="`https://shadowverse-wb.com/uploads/card_image/cht/card/${s.hash}.png`" />
                        </q-avatar>
                    </div>
                </div>

                <!-- 右側：資訊 -->
                <div class="info-panel col q-pa-md column q-gutter-sm">

                    <!-- 基本屬性列 -->
                    <div class="row items-center q-gutter-sm">
                        <q-avatar size="34px" color="green-8" text-color="white" class="text-weight-bold"
                            style="font-size:18px">
                            {{ card.cost }}
                        </q-avatar>
                        <q-chip dense :color="rarityColor" text-color="white" :label="rarityName" />
                        <q-chip dense color="grey-8" text-color="grey-3" :label="className" />
                        <q-chip v-if="typeName" dense color="grey-9" text-color="grey-4" :label="typeName" />
                        <template v-for="t in card.common.tribes" :key="t">
                            <q-chip v-if="TRIBE_NAMES[t]" dense color="indigo-9" text-color="grey-3"
                                :label="TRIBE_NAMES[t]" />
                        </template>
                        <!-- 生命值 = 0 代表為法術或是護符 不顯示攻擊力與生命值 -->
                        <q-chip v-if="currentLife !== 0" dense color="red-9" text-color="white" icon="mdi-sword"
                            :label="String(currentAtk)" />
                        <q-chip v-if="currentLife !== 0" dense color="blue-9" text-color="white" icon="mdi-shield"
                            :label="String(currentLife)" />
                    </div>

                    <!-- 卡包 / Token -->
                    <div class="text-caption text-grey-6">
                        <template v-if="card.common.is_token">
                            <span class="text-amber-7">Token</span>
                        </template>
                        <template v-else>
                            登場卡包：{{ CARD_SET_NAMES[card.common.card_set_id] ?? `卡包 ${card.common.card_set_id}` }}
                            <span v-if="card.common.deck_enabled_num !== undefined" class="q-ml-sm text-orange-6">
                                限制情形：最多攜帶 {{ card.common.deck_enabled_num }} 張
                            </span>
                        </template>
                    </div>

                    <q-separator dark />

                    <!-- 技能文字 -->
                    <div class="skill-block">
                        <div class="text-body2 text-grey-3 skill-text" v-html="parseSkillText(currentSkillText)" />
                    </div>

                    <!-- 卡片介紹 -->
                    <div v-if="currentFlavourText" class="flavour-block">
                        <q-separator dark class="q-mb-sm" />
                        <div class="text-caption text-grey-5 flavour-text">{{ currentFlavourText }}</div>
                    </div>

                    <!-- 聲優 / 繪師 -->
                    <div class="text-caption text-grey-6 q-mt-auto column q-gutter-xs">
                        <div v-if="card.common.cv">CV：{{ card.common.cv }}</div>
                        <div v-if="card.common.illustrator">繪師：{{ card.common.illustrator }}</div>
                    </div>
                </div>
            </div>

        </q-card>
    </q-dialog>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import type { Card } from 'src/components/models';
import {
    RARITY_NAMES, RARITY_COLORS, CARD_SET_NAMES, TRIBE_NAMES, CARD_TYPE_OPTIONS,
} from 'src/constants/cardMeta';
import { CLASS_MAP } from 'stores/cards';

const props = defineProps<{ modelValue: boolean; card: Card }>();
defineEmits<{ 'update:modelValue': [value: boolean] }>();

const showEvo = ref(false);
const styleIndex = ref<number | null>(null);

watch(() => props.modelValue, (open) => {
    if (open) { showEvo.value = false; styleIndex.value = null; }
});

// 切換職業/稀有度顯示
const rarityName = computed(() => RARITY_NAMES[props.card.rarity] ?? String(props.card.rarity));
const rarityColor = computed(() => {
    const q = RARITY_COLORS[props.card.rarity];
    // RARITY_COLORS 存的是 Quasar 色票名稱，需轉成背景色
    const map: Record<string, string> = {
        'brown-6': 'brown-6', 'grey-5': 'grey-5', 'amber-6': 'amber-6', 'deep-orange-6': 'deep-orange-6',
    };
    return map[q ?? ''] ?? 'grey-7';
});
const className = computed(() => CLASS_MAP[props.card.class_id] ?? String(props.card.class_id));
const typeName = computed(() => {
    const t = props.card.common.type;
    if (t === 2 || t === 3) return '護符';
    return CARD_TYPE_OPTIONS.find((o) => o.value === t)?.label ?? String(t);
});

// 目前顯示的圖片、數值、文字
const currentImageHash = computed(() => {
    if (styleIndex.value !== null) {
        const s = props.card.style_card_list[styleIndex.value];
        return showEvo.value ? s?.evo_hash : s?.hash;
    }
    return showEvo.value
        ? (props.card.evo?.card_image_hash ?? props.card.common.card_image_hash)
        : props.card.common.card_image_hash;
});

// ATK/Life 固定使用通常狀態數值，不隨進化切換改變
const currentAtk = computed(() => props.card.common.atk);
const currentLife = computed(() => props.card.common.life);

// 技能文字與卡牌介紹皆隨進化切換
const currentSkillText = computed(() =>
    (showEvo.value ? props.card.evo?.skill_text : props.card.common.skill_text) ?? '');
const currentFlavourText = computed(() =>
    showEvo.value ? (props.card.evo?.flavour_text ?? props.card.common.flavour_text) : props.card.common.flavour_text);

// 解析技能文字中的 <color=Keyword>XXX</color> 標籤
function parseSkillText(text: string): string {
    return text
        .replace(/<color=Keyword>(.*?)<\/color>/g, '<span class="kw">$1</span>')
        .replace(/\n/g, '<br/>');
}
</script>

<style scoped lang="scss">
.detail-card {
    width: min(860px, 96vw);
    max-height: 96vh;
    margin: auto;
    background-color: #1a1a2e;
}

.detail-bar {
    background-color: rgba(255, 255, 255, 0.05);
    border-bottom: 1px solid rgba(255, 255, 255, 0.08);
    min-height: 40px;
}

.detail-body {
    overflow-y: auto;
}

.image-panel {
    width: 260px;
    flex-shrink: 0;
    border-right: 1px solid rgba(255, 255, 255, 0.06);
}

.card-img {
    width: 220px;
    border-radius: 8px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.6);
}

.card-img-placeholder {
    width: 220px;
    height: 300px;
    background: rgba(255, 255, 255, 0.04);
    border-radius: 8px;
}

.style-thumb {
    border: 2px solid transparent;
    border-radius: 6px;
    transition: border-color 0.15s;

    &:hover {
        border-color: rgba(255, 255, 255, 0.3);
    }
}

.info-panel {
    min-width: 0;
}

.skill-text {
    line-height: 1.7;
    white-space: pre-wrap;

    :deep(.kw) {
        color: #ffd54f;
        font-weight: bold;
    }
}

.flavour-text {
    line-height: 1.6;
    white-space: pre-wrap;
    font-style: italic;
    opacity: 0.75;
}
</style>
