<script setup lang="ts">
import type { consolePage } from "@/types/index";
//////////////////////////////
const emit = defineEmits<{
  remove: [];
}>();
const props = defineProps<consolePage>();
/////////////////////
</script>
<template>
  <div class="console active-color">
    <!-- ///////////////////////// -->
    <transition-scale>
      <div class="console-number bg-[#1D5B79]">
        <p>{{ props.name }}</p>
      </div>
    </transition-scale>
    <!-- //////////////////////// -->
    <div class="console-main">
      <div class="console-timer">
        <p>
          {{
            `${props.playedTime.hours}:${props.playedTime.minutes}:${props.playedTime.seconds}`
          }}
        </p>
        <img src="@/assets/image/home/timer.svg" />
      </div>
      <!-- //////////////////////// -->
      <div group class="console-money">
        <div class="w-full flex items-center justify-center gap-x-[3px]">
          <p>
            {{ props.playedCost.toLocaleString() }}
          </p>
          <p class="!font-[400]">تومان</p>
        </div>
      </div>
    </div>
    <!-- //////////////////////// -->
    <div class="console-footer">
      <button class="button bg-[#EF6262] text-white">حذف</button>
    </div>
    <!-- //////////////////////// -->
  </div>
</template>
<style scoped>
.console {
  @apply relative transition-all pb-[10px] pt-[25px] gap-y-[3px] w-[300px] h-[130px] rounded-[10px] flex flex-col justify-start items-center;
  box-shadow: 0px 0px 5px 0px rgba(56, 56, 56, 0.25);
}
.console-number {
  @apply w-[40px] shadow-md transition-all flex justify-center absolute top-[-20px] items-center h-[40px] rounded-full;
}
.console-number p {
  @apply text-white font-[kalameh];
}
.console-main {
  @apply w-full flex flex-col gap-y-[3px] justify-center items-center;
}
.console-timer {
  @apply w-full flex items-center justify-center gap-x-[5px];
}
.console-timer p {
  @apply text-black mt-1 font-[dana];
}
.console-money {
  @apply w-full justify-center flex items-center gap-x-[3px] h-[30px];
}
.console-money p {
  @apply font-[dana] font-bold text-[15px];
}
.console-footer {
  @apply flex gap-x-[7px] items-center;
}
</style>
