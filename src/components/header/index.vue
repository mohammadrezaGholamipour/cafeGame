<script setup lang="ts">
import freeConsole from "./components/free-concole.vue";
import user from "./components/user.vue";
</script>
<template>
  <header class="parent-header">
    <freeConsole />
    <user />
  </header>
</template>
<style scoped>
.parent-header {
  @apply flex w-full justify-between items-center p-[10px] bg-[#1D5B79];
}
</style>
