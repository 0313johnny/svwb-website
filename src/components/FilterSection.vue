<template>
  <div class="filter-section q-mb-md">
    <div class="row items-center q-mb-xs">
      <span class="filter-label text-caption text-grey-5 text-weight-bold">{{ label }}</span>
      <q-space />
      <slot name="label-append" />
    </div>
    <div class="row q-gutter-xs items-center">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{ label: string }>();
</script>

<style scoped lang="scss">
.filter-label {
  letter-spacing: 0.05em;
}
</style>
