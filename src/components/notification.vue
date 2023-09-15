<script setup lang="ts">
import { usePinia } from "@/store/pinia";
//////////////////////////////////////
const pinia = usePinia();
//////////////////////////
</script>
<template>
  <div class="parent-notification">
    <div>
      <p>با موفقیت انجام شد</p>
      <p>خوراکی ها با موفقیت ثبت شد</p>
    </div>
    <img src="@/assets/image/notification/Success.svg" />
  </div>
</template>
<style scoped>
.parent-notification {
  @apply flex justify-between w-[300px] p-[20px] rounded-[12px];
  background: linear-gradient(95deg, #32bb71 15.3%, #2a9d8f 113.45%);
  border: 1px solid #43d590;
}
.parent-notification > div {
  @apply flex flex-col items-start gap-y-[4px];
}
.parent-notification > div p {
  @apply text-white font-[kalameh];
}
.parent-notification > div p:first-child {
  @apply text-[0.88rem] font-[600];
}
.parent-notification > div p:last-child {
  @apply text-[0.80rem];
}
</style>
