<script setup lang="ts">
import { handleDate, handleTime } from "@/utils/handleDateAndTime";
import type { bill } from "@/types/index";
////////////////////////////////////
const props = defineProps<{ bill: bill }>();
///////////////////////////////////////////
</script>
<template>
  <div class="parent-bill-time">
    <div>
      <p>اطلاعات شروع :</p>
      {{
        ` ${handleDate(props.bill.startTime)} --
        ${handleTime(props.bill.startTime)} `
      }}
    </div>
    <div>
      <p>اطلاعات پایان :</p>
      {{
        props.bill.endTime
          ? ` ${handleDate(props.bill.endTime)} --
        ${handleTime(props.bill.endTime)} `
          : "درحال اجرا"
      }}
    </div>
  </div>
</template>
<style scoped>
.parent-bill-time {
  @apply w-full gap-y-[10px] flex flex-col justify-start items-center;
  background-color: rgba(29, 91, 121, 0.1);
}
.parent-bill-time > div {
  @apply w-full flex justify-between items-center p-3 rounded-md;
}
.parent-bill-time div:nth-child(1) {
  background: linear-gradient(95deg, #32bb71 15.3%, #2a9d8f 113.45%);
}
.parent-bill-time div:nth-child(2) {
  background: linear-gradient(95deg, #f6743e -6.96%, #d42525 108.25%);
}
</style>
