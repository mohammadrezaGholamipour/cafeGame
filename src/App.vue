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
