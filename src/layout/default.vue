<script setup lang="ts">
import Header from "@/components/header/index.vue";
</script>
<template>
  <div class="parent-layout">
    <Header />
  </div>
</template>
<style scoped>
.parent-layout {
  @apply w-screen h-screen flex flex-col justify-start items-center bg-white;
}
</style>
