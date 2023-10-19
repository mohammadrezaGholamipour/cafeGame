<script setup lang="ts">
import type { bill } from "@/types/index";
////////////////////////////////////
const props = defineProps<{ bill: bill }>();
///////////////////////////////////////////
const handleDate = (dateString: Date) => {
  const date = new Date(dateString);
  const today = new Date();
  const timeDiff = today - date;
  const oneDay = 24 * 60 * 60 * 1000;
  ///////////////////////////////////
  if (timeDiff < oneDay) {
    return "امروز";
  } else if (timeDiff < oneDay * 2) {
    return "دیروز";
  } else if (timeDiff < oneDay * 3) {
    return "دو روز پیش";
  } else {
    return date.toLocaleDateString("fa-IR", {
      year: "numeric",
      month: "numeric",
      day: "numeric",
      calendar: "persian",
    });
  }
};
/////////////////////////////////////
const handleTime = (dateString: Date) => {
  const date = new Date(dateString);
  return date.toLocaleTimeString("fa-IR", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    calendar: "persian",
  });
};
</script>
<template>
  <div class="parent-bill-time">
    <div class="bg-[#7cc078] rounded-md">
      <p>اطلاعات شروع :</p>
      {{
        ` ${handleDate(props.bill.startTime)} --
        ${handleTime(props.bill.startTime)} `
      }}
    </div>
    <div class="bg-[#ef6262] rounded-md">
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
  @apply w-full flex justify-between items-center p-3;
}
</style>
