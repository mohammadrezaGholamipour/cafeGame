<script setup lang="ts">
import Exit from "./components/exit.vue";
</script>
<template>
  <header class="parent-header">
    <a class="animate-pulse" href="/">
      <img width="100" src="@/assets/image/cafegame.png" />
    </a>
    <Exit />
  </header>
</template>
<style scoped>
.parent-header {
  @apply flex w-full justify-between items-center p-[10px] bg-[#1D5B79];
}
</style>
