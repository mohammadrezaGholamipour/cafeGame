<script setup lang="ts">
import Header from "@/components/header/index.vue";
import Menu from "../components/menu.vue";
import { usePinia } from "@/store/pinia";
import { onMounted } from "vue";
/////////////////////////////////
const pinia = usePinia();
onMounted(async () => {
  try {
    await Promise.all([
      pinia.requestGetConsole(),
      pinia.requestGetMoney(),
      pinia.requestGetFood(),
    ]);
  } catch (error) {
    pinia.handleNotification({
      ...pinia.state.notification,
      name: "error",
      status: true,
      textHeader: "خطا",
      textMain: "دریافت اطلاعات با خطا مواجه شد",
    });
  }
});
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
