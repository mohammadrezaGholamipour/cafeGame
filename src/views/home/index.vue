<script setup lang="ts">
import console from "./components/console.vue";
import tools from "./components/tools.vue";
</script>
<template>
  <div class="parent-home">
    <tools />
    <div class="main-home">
      <console />
    </div>
  </div>
</template>
<style scoped>
.parent-home {
  @apply w-full h-full flex flex-col justify-start items-start;
}
.main-home {
  @apply w-full h-full overflow-hidden overflow-y-auto grid justify-center gap-[25px] justify-items-center items-start content-start pt-[30px] p-[10px];
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
}
</style>
