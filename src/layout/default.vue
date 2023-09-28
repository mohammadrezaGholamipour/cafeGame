<script setup lang="ts">
import Header from "@/components/header/index.vue";
/////////////////////////////////////////////////
</script>
<template>
  <div class="parent-layout">
    <Header />
    <main>
      <router-view />
    </main>
  </div>
</template>
<style scoped>
.parent-layout {
  @apply w-screen h-screen flex flex-col justify-start items-center bg-white;
}
main {
  @apply flex justify-start items-start w-full h-full;
}
</style>
