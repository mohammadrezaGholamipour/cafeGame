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
    <div class="console-right">
      <div class="console-number bg-[#1D5B79]">
        <p>{{ props.name }}</p>
      </div>
      <div class="parent-money-and-timer">
        <div class="flex items-center gap-x-[5px]">
          <p class="font-[dana] font-[700]">
            {{ props.playedCost.toLocaleString() }}
          </p>
          <p class="font-[dana]">تومان</p>
        </div>
        <div class="console-timer">
          <p>
            {{
              `${props.playedTime.hours}:${props.playedTime.minutes}:${props.playedTime.seconds}`
            }}
          </p>
          <img src="@/assets/image/home/timer.svg" />
        </div>
      </div>
    </div>
    <div class="console-left">
      <button
        :disabled="props.loading"
        :class="[
          'button bg-[#EF6262] text-white',
          { 'bg-gray-400 !cursor-not-allowed': props.loading },
        ]"
        @click="emit('remove')"
      >
        <transition-fade class="flex" group>
          <span v-if="props.loading" class="btn-loader"></span>
          <p v-else>حذف</p>
        </transition-fade>
      </button>
    </div>
    <!-- ///////////////////////////// -->
  </div>
</template>
<style scoped>
.console {
  @apply min-w-[300px] relative border-l-[3px] pl-[10px] transition-all w-[300px] rounded-[5px] min-h-[80px] h-[80px] overflow-hidden flex justify-between items-center;
  box-shadow: 0px 0px 5px 0px rgba(135, 135, 135, 0.25);
}
.console-right {
  @apply flex h-full items-center gap-x-[10px];
}
.console-number {
  @apply flex text-white min-w-[29px] h-full items-center justify-center;
}
.console-number p {
  @apply text-white font-[kalameh];
}
.console-money {
  @apply flex items-center gap-x-[3px];
}
.console-money p {
  @apply font-[dana] font-bold text-[15px];
}
.console-timer {
  @apply flex items-center gap-x-[5px];
}
.console-timer p {
  @apply text-black mt-1 font-[dana];
}
.parent-money-and-timer {
  @apply flex h-full gap-y-[5px] flex-col justify-center items-start;
}
.console-left {
  @apply flex flex-col justify-center items-center h-full gap-y-[5px];
}
</style>
