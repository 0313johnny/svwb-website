<template>
  <div class="card-row row items-center q-px-sm rounded-borders"
    :style="bannerUrl
      ? { backgroundImage: `url(${bannerUrl})`, backgroundSize: 'cover', backgroundPosition: 'right center', backgroundRepeat: 'no-repeat' }
      : {}">
    <q-avatar size="22px" color="green-8" text-color="white"
      class="text-weight-bold q-mr-sm flex-shrink-0" style="font-size:11px">
      {{ cost ?? '?' }}
    </q-avatar>
    <span class="col text-caption ellipsis text-weight-bold card-name-shadow"
      :class="`text-${rarityColor}`">
      {{ name }}
    </span>
    <slot />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { RARITY_COLORS } from 'src/constants/cardMeta';

const props = defineProps<{
  cost: number;
  name: string;
  rarity: number;
  bannerUrl?: string | undefined;
}>();

const rarityColor = computed(() => RARITY_COLORS[props.rarity] ?? 'grey-3');
</script>

<style scoped lang="scss">
.card-row {
  height: 32px;
  overflow: hidden;
  background-color: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(100, 233, 238, 0.1);
  transition: border-color 0.15s ease, box-shadow 0.15s ease;

  &:hover {
    border-color: rgba(100, 233, 238, 0.5);
    box-shadow: var(--glow-sm);
  }
}

.card-name-shadow {
  text-shadow: 0 1px 4px rgba(0, 0, 0, 0.9), 0 0 8px rgba(0, 0, 0, 0.7);
}
</style>
