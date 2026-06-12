<template>
  <q-page class="q-pa-md">
    <SearchArea store-id="deckBuilder" />

    <div v-if="store.loading" class="column items-center q-py-xl">
      <q-spinner-rings color="primary" size="60px" />
      <div class="q-mt-sm text-grey-5">正在撈取卡片...</div>
    </div>

    <div v-else class="card-grid row justify-center q-gutter-md q-mx-auto">
      <CardItem v-for="card in store.filteredCardList" :key="card._id" :card="card" />
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useCardsStore } from 'stores/cards';
import SearchArea from 'src/components/SearchArea.vue';
import CardItem from 'src/components/CardItem.vue';

const store = useCardsStore('deckBuilder');

onMounted(() => {
  void store.fetchCards();
});
</script>

<style scoped lang="scss">
.card-grid {
  width: 75%;
  min-width: 320px;
  max-width: 1200px;
}
</style>
