<script setup lang="ts">
import { handleDate, handleTime } from "@/utils/handleDateAndTime";
import type { bill } from "@/types/index";
import JalaliDate from "jalali-date";
import { computed } from "vue";
////////////////////////////////////
const props = defineProps<{ bill: bill }>();
///////////////////////////////////////////
const startDate = computed(() => {
  const dateObj = new Date(props.bill.start_time + "Z");

  const formatted = new Intl.DateTimeFormat("fa-IR-u-ca-persian", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(dateObj);

  return formatted;
});
const endDate = computed(() => {
  const dateObj = new Date(props.bill.end_time + "Z");

  const formatted = new Intl.DateTimeFormat("fa-IR-u-ca-persian", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    timeZone: "Asia/Tehran",
  }).format(dateObj);

  return formatted;
});
</script>
<template>
  <div class="parent-bill-time">
    <div>
      <p>اطلاعات شروع :</p>
      {{ `${startDate}  --${handleTime(props.bill.start_time)} ` }}
    </div>
    <div>
      <p>اطلاعات پایان :</p>
      {{
        props.bill.end_time
          ? ` ${endDate} -- ${handleTime(props.bill.end_time)} `
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
