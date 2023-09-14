<script setup lang="ts">
import FreeConsole from "./components/free-concole.vue";
import User from "./components/user.vue";
</script>
<template>
  <header class="parent-header">
    <FreeConsole />
    <User />
  </header>
</template>
<style scoped>
.parent-header {
  @apply flex w-full justify-between items-center p-[10px] bg-[#1D5B79];
}
</style>
