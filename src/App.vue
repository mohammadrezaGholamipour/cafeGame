<script setup lang="ts">
import Notification from "@/components/notification.vue";
import { usePinia } from "@/store/pinia";
////////////////////////////////////////////////////////
const pinia = usePinia();
const observer = new ResizeObserver((entries) => {
  const { width: appWidth } = entries[0].contentRect;
  pinia.state.appWidth = appWidth;
});
observer.observe(document.getElementById("app") as HTMLDivElement);
</script>
<template>
  <Notification />
  <!-- <date-picker auto-submit inline  range simple /> -->
  <RouterView />
</template>
<style>
.driver-popover {
  background-color: #1d5b79;
  color: white;
}
.driver-popover * {
  @apply font-[dana];
}
.driver-popover-navigation-btns {
  @apply gap-x-[10px];
}
.driver-popover-footer button {
  @apply flex justify-center m-0 text-center border-none text-white items-center hover:opacity-80 rounded-[3px] min-w-[70px] min-h-[30px] !font-[dana] hover:shadow-md transition-all duration-300;
  text-shadow: none;
}
.driver-popover-next-btn {
  @apply !bg-[#75ca71];
}
.driver-popover-prev-btn {
  @apply !bg-[#ef6262];
}
</style>
