<script setup lang="ts">
const emit = defineEmits<{ exit: [] }>();
</script>
<template>
  <div @click="emit('exit')" class="parent-exit">
    <p>خارج شدن</p>
    <img src="@/assets/image/header/exit.svg" />
  </div>
</template>
<style scoped>
.parent-exit {
  @apply flex items-center gap-x-3 cursor-pointer;
}
.parent-exit p {
  @apply font-[kalameh] text-white;
}
</style>
