<script setup lang="ts">
import Header from "@/components/header/index.vue";
import Menu from "../components/menu.vue";
/////////////////////////////////////////////////
</script>
<template>
  <div class="parent-layout">
    <!-- ///////////////// -->
    <Header />
    <!-- ///////////////// -->
    <main>
      <router-view />
    </main>
    <!-- ///////////////// -->
    <Menu />
    <!-- ///////////////// -->
  </div>
</template>
<style scoped>
.parent-layout {
  @apply w-screen h-screen flex flex-col justify-start items-center bg-slate-50;
}
main {
  @apply flex justify-start items-start w-full h-full overflow-hidden pb-[5px];
}
</style>
