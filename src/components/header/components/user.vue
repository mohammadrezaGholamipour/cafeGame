<script setup lang="ts">
import type { Ref } from "vue";
import { ref } from "vue";
///////////////////////////
const dropList = [
  { id: 1, name: "تنظیمات", image: "src/assets/image/account/setting.svg" },
  { id: 2, name: "خروج", image: "src/assets/image/account/exit.svg" },
];
const dropListStatus: Ref<boolean> = ref(false);
</script>
<template>
  <div @click="dropListStatus = !dropListStatus" class="parent-user">
    <p>gholamipour</p>
    <img src="@/assets/image/account/profile.svg" />
    <DropList
      @close="dropListStatus = false"
      :status="dropListStatus"
      :data="dropList"
      :space="'44px'"
    />
  </div>
</template>
<style scoped>
.parent-user {
  @apply flex justify-center items-center gap-x-[5px] cursor-pointer relative;
}
.parent-user p {
  @apply text-white font-[kalameh] text-[0.88rem];
}
</style>
