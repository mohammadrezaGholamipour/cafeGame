<script setup lang="ts">
import localStorageService from "@/utils/local-storage-service";
import Header from "@/components/header/index.vue";
import Menu from "../components/menu.vue";
import { usePinia } from "@/store/pinia";
import { onMounted } from "vue";
/////////////////////////////////
const pinia = usePinia();
onMounted(async () => {
  pinia.handleChangeDisplayMood(localStorageService.getDisplayMood());
  await pinia.requestGetConsole(),
    await pinia.requestGetHourRate(),
    await pinia.requestGetFood(),
    await pinia.requestGetOpenBill();
  await pinia.requestGetAllBill();
});
///////////////////////////////
window.onfocus = () => {
  pinia.state.home = false;
  pinia.requestGetOpenBill();
};
///////////////////////////////
</script>
<template>
  <div class="parent-layout">
    <!-- ///////////////// -->
    <Header />
    <!-- ///////////////// -->
    <main id="main">
      <!-- ///////////////////////// -->
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>
    <!-- ///////////////// -->
    <Menu />
    <!-- ///////////////////////// -->
  </div>
</template>
<style scoped>
.parent-layout {
  @apply w-screen overflow-hidden h-[100vh] flex flex-col justify-start items-center bg-slate-50;
}
main {
  @apply flex justify-start items-start w-full  overflow-hidden pb-[5px];
  height: calc(100vh - 85px);
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.1s;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>
