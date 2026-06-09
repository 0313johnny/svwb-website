<template>
  <q-card class="card-item" dark bordered>
    <!-- 卡片圖片：暫時停用，避免大量請求官方伺服器，待規劃本地下載後啟用 -->
    <div class="card-image-wrapper">
      <img v-if="card.common.card_image_hash"
        :src="`https://shadowverse-wb.com/uploads/card_image/cht/card/${card.common.card_image_hash}.png`"
        :alt="card.common.name" class="card-image" />
      <div v-else class="card-image-placeholder row items-center justify-center text-grey-7">
        <q-icon name="image" size="48px" />
      </div>
    </div>
    <!-- <div class="card-image-placeholder row items-center justify-center text-grey-7">
      <q-icon name="image" size="48px" />
    </div> -->

    <!-- <q-card-section class="q-pt-sm q-pb-xs">
      <div class="text-subtitle1 text-white text-weight-bold ellipsis">{{ card.common.name }}</div>

      <div class="row items-center q-gutter-xs q-mt-xs">
        <q-chip dense color="green-7" text-color="light" :label="String(card.cost)" class="text-weight-bold" />
        <template v-if="card.common.atk !== undefined">
          <q-chip dense color="red-8" text-color="white" icon="mdi-sword" :label="String(card.common.atk)" />
          <q-chip dense color="blue-8" text-color="white" icon="mdi-shield" :label="String(card.common.life)" />
        </template>
</div>
</q-card-section> -->
  </q-card>
</template>

<script setup lang="ts">
import type { Card } from 'src/components/models';

defineProps<{ card: Card }>();
</script>

<style scoped lang="scss">
.card-item {
  width: 180px;
  background-color: $dark;
}

.card-image-wrapper {
  width: 100%;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.card-image {
  width: 100%;
  display: block;
  object-fit: cover;
}

.card-image-placeholder {
  width: 100%;
  height: 120px;
  background-color: rgba(255, 255, 255, 0.05);
}
</style>
