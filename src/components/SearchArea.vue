<template>
    <div class="search-area q-mb-lg q-mx-auto">

        <!-- 職業篩選（複選） -->
        <div class="row justify-center items-center q-gutter-sm q-mb-md">
            <q-btn v-for="(name, id) in CLASS_MAP" :key="id" :label="name" :color="store.selectedClasses.includes(Number(id)) ?
                CLASS_COLORS[Number(id)]!.active :
                CLASS_COLORS[Number(id)]!.inactive" no-caps unelevated @click="store.toggleClass(Number(id))" />
            <q-btn flat rounded no-caps dense color="grey-6" icon="close" label="清除"
                :disable="store.selectedClasses.length === 0" @click="store.clearClasses()" />
        </div>

        <!-- 名稱搜尋 + 搜尋按鈕 + 進階篩選切換 -->
        <div class="row justify-center items-center q-gutter-sm">
            <q-input v-model="store.filters.name" dense outlined dark clearable placeholder="搜尋卡片名稱..."
                class="search-input" @keyup.enter="store.fetchSelectedClasses()">
                <template #prepend>
                    <q-icon name="search" />
                </template>
            </q-input>

            <q-btn unelevated no-caps color="primary" icon="search" label="搜尋" :loading="store.loading"
                @click="store.fetchSelectedClasses()" />

            <q-btn flat rounded no-caps color="grey-4" :icon-right="showAdvanced ? 'expand_less' : 'expand_more'"
                @click="showAdvanced = !showAdvanced">
                進階篩選
            </q-btn>
        </div>

        <!-- 進階篩選面板 -->
        <q-slide-transition>
            <div v-show="showAdvanced" class="advanced-panel q-mt-md q-pa-md rounded-borders">

                <!-- 右上角：清除所有篩選條件 -->
                <div class="row justify-end q-mb-sm">
                    <q-btn flat no-caps dense color="grey-5" icon="clear_all" label="清除所有篩選條件"
                        @click="store.resetFilters()" />
                </div>

                <div class="row q-col-gutter-lg">

                    <!-- ── 左欄 ────────────────────────────── -->
                    <div class="col-12 col-md-4 column q-gutter-md">

                        <!-- 卡包 -->
                        <FilterSection label="卡包">
                            <template #label-append>
                                <ClearBtn @click="store.filters.cardSets = []" />
                            </template>
                            <div class="column q-gutter-xs">
                                <q-checkbox v-for="(name, id) in CARD_SET_NAMES" :key="id"
                                    :model-value="store.filters.cardSets.includes(Number(id))" :label="name" dense dark
                                    color="primary"
                                    @update:model-value="toggleArr(store.filters.cardSets, Number(id))" />
                            </div>
                        </FilterSection>

                        <!-- 攻擊力 / 生命值 -->
                        <FilterSection label="攻擊力 / 生命值">
                            <template #label-append>
                                <ClearBtn @click="store.filters.atkMin = null; store.filters.atkMax = null;
                                store.filters.lifeMin = null; store.filters.lifeMax = null" />
                            </template>
                            <div class="column q-gutter-sm">
                                <div class="row items-center q-gutter-sm">
                                    <span class="text-caption text-grey-5 stat-label">攻擊</span>
                                    <q-input :model-value="store.filters.atkMin ?? ''"
                                        @update:model-value="(v) => (store.filters.atkMin = toNum(v))" type="number"
                                        dense outlined dark clearable placeholder="最小" class="stat-input" />
                                    <span class="text-grey-6">～</span>
                                    <q-input :model-value="store.filters.atkMax ?? ''"
                                        @update:model-value="(v) => (store.filters.atkMax = toNum(v))" type="number"
                                        dense outlined dark clearable placeholder="最大" class="stat-input" />
                                </div>
                                <div class="row items-center q-gutter-sm">
                                    <span class="text-caption text-grey-5 stat-label">生命</span>
                                    <q-input :model-value="store.filters.lifeMin ?? ''"
                                        @update:model-value="(v) => (store.filters.lifeMin = toNum(v))" type="number"
                                        dense outlined dark clearable placeholder="最小" class="stat-input" />
                                    <span class="text-grey-6">～</span>
                                    <q-input :model-value="store.filters.lifeMax ?? ''"
                                        @update:model-value="(v) => (store.filters.lifeMax = toNum(v))" type="number"
                                        dense outlined dark clearable placeholder="最大" class="stat-input" />
                                </div>
                            </div>
                        </FilterSection>

                        <!-- 其他條件 -->
                        <FilterSection label="搜尋範圍包含特殊卡(Token)">
                            <template #label-append>
                                <ClearBtn @click="store.filters.isToken = null; store.filters.hasStyle = null" />
                            </template>
                            <div class="column q-gutter-sm">
                                <div class="column items-start">
                                    <q-btn-toggle v-model="store.filters.isToken" dense flat no-caps rounded
                                        toggle-color="primary" color="grey-8" text-color="white" :options="[
                                            { label: '不篩選', value: null },
                                            { label: '一般', value: false },
                                            { label: '只搜尋特殊卡', value: true },
                                        ]" />
                                </div>
                                <div class="column items-start">
                                    <div class="text-caption text-grey-5 q-mb-xs">擁有特殊插畫風格</div>
                                    <q-btn-toggle v-model="store.filters.hasStyle" dense flat no-caps rounded
                                        toggle-color="primary" color="grey-8" text-color="white" :options="[
                                            { label: '不篩選', value: null },
                                            { label: '有', value: true },
                                            { label: '無', value: false },
                                        ]" />
                                </div>
                            </div>
                        </FilterSection>

                    </div>

                    <!-- ── 右欄 ────────────────────────────── -->
                    <div class="col-12 col-md-8 column q-gutter-md">

                        <!-- 費用 -->
                        <FilterSection label="費用">
                            <template #label-append>
                                <ClearBtn @click="store.filters.costs = []" />
                            </template>
                            <q-chip v-for="opt in COST_OPTIONS" :key="opt.value" clickable dense text-color="white"
                                :label="opt.label"
                                :color="store.filters.costs.includes(opt.value) ? 'green-7' : 'grey-8'"
                                @click="toggleArr(store.filters.costs, opt.value)" />
                        </FilterSection>

                        <!-- 卡片分類 -->
                        <FilterSection label="卡片分類">
                            <template #label-append>
                                <ClearBtn @click="store.filters.types = []" />
                            </template>
                            <q-chip v-for="opt in CARD_TYPE_OPTIONS" :key="opt.value" clickable dense text-color="white"
                                :label="opt.label"
                                :color="store.filters.types.includes(opt.value) ? 'primary' : 'grey-8'"
                                @click="toggleArr(store.filters.types, opt.value)" />
                        </FilterSection>

                        <!-- 稀有度 -->
                        <FilterSection label="稀有度">
                            <template #label-append>
                                <ClearBtn @click="store.filters.rarities = []" />
                            </template>
                            <q-chip v-for="(name, id) in RARITY_NAMES" :key="id" clickable dense text-color="white"
                                :label="name"
                                :color="store.filters.rarities.includes(Number(id)) ? RARITY_COLORS[Number(id)] : 'grey-8'"
                                @click="toggleArr(store.filters.rarities, Number(id))" />
                        </FilterSection>

                        <!-- 種類 -->
                        <FilterSection label="種類">
                            <template #label-append>
                                <ClearBtn @click="store.filters.tribes = []" />
                            </template>
                            <q-chip v-for="(name, id) in TRIBE_NAMES" :key="id" clickable dense text-color="white"
                                :label="name" :color="store.filters.tribes.includes(Number(id)) ? 'teal-7' : 'grey-8'"
                                @click="toggleArr(store.filters.tribes, Number(id))" />
                        </FilterSection>

                        <!-- 能力關鍵字 -->
                        <FilterSection label="能力關鍵字">
                            <template #label-append>
                                <q-btn-toggle v-model="store.filters.skillMode" dense flat no-caps rounded
                                    toggle-color="primary" color="grey-8" text-color="white"
                                    :options="[{ label: 'OR', value: 'OR' }, { label: 'AND', value: 'AND' }]"
                                    class="skill-mode-toggle" />
                                <ClearBtn class="q-ml-xs" @click="store.filters.skills = []" />
                            </template>
                            <q-chip v-for="(name, id) in SKILL_NAMES" :key="id" clickable dense text-color="white"
                                :label="name" :color="store.filters.skills.includes(name) ? 'deep-purple-6' : 'grey-8'"
                                @click="toggleArr(store.filters.skills, name)" />
                        </FilterSection>

                    </div>
                </div>
            </div>
        </q-slide-transition>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useCardsStore, CLASS_MAP } from 'stores/cards';
import FilterSection from 'src/components/FilterSection.vue';
import ClearBtn from 'src/components/ClearBtn.vue';
import {
    CARD_SET_NAMES,
    RARITY_NAMES,
    RARITY_COLORS,
    CARD_TYPE_OPTIONS,
    TRIBE_NAMES,
    SKILL_NAMES,
    COST_OPTIONS,
} from 'src/constants/cardMeta';
import { CLASS_COLORS } from 'src/constants/classColorSetting';

const props = defineProps<{ storeId?: string }>();
const store = useCardsStore(props.storeId);
const showAdvanced = ref(false);

function toggleArr<T>(arr: T[], value: T) {
    const idx = arr.indexOf(value);
    if (idx === -1) arr.push(value);
    else arr.splice(idx, 1);
}

function toNum(v: string | number | null): number | null {
    if (v === null || v === '') return null;
    const n = Number(v);
    return isNaN(n) ? null : n;
}
</script>

<style scoped lang="scss">
.search-area {
    width: 75%;
    min-width: 320px;
}

.search-input {
    width: 100%;
    max-width: 400px;
}

.advanced-panel {
    background-color: rgba(255, 255, 255, 0.04);
    border: 1px solid rgba(255, 255, 255, 0.08);
}

.stat-input {
    width: 80px;
}

.stat-label {
    width: 28px;
    text-align: right;
}

.skill-mode-toggle {
    border: 1px solid rgba(255, 255, 255, 0.15);
    border-radius: 20px;
}
</style>
