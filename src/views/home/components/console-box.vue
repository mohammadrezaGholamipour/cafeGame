<script setup lang="ts">
import type { home } from "@/types/index";
//////////////////////////////
const emit = defineEmits<{
  status: [info: { billId: number; consoleId: number }, status: boolean];
  removeBill: [billId: number, consoleId: number];
  food: [
    billId: number,
    consoleId: number,
    billFood: {
      id: number;
      count: number;
      foodId: number;
      billId: number;
      cost: number;
      name: string;
    }[]
  ];
}>();
const props = defineProps<home>();
/////////////////////
</script>
<template>
  <div :class="['console', props.status ? 'active-color' : 'disable-color']">
    <!-- ///////////////////////// -->
    <img
      @click="emit('removeBill', props.billId, props.consoleId)"
      src="@/assets/image/home/remove-bill.svg"
      class="icon-change-bill left-[10px]"
      v-if="props.status"
    />
    <img
      @click="emit('food', props.billId, props.consoleId, props.billFood)"
      src="@/assets/image/home/food-bill.svg"
      class="icon-change-bill right-[10px]"
      v-if="props.status"
    />
    <!-- ///////////////////////// -->
    <transition-scale>
      <div
        :class="[
          'console-number',
          props.status ? 'bg-[#1D5B79]' : 'bg-[#C0C0C0]',
        ]"
        v-if="!props.loading"
      >
        <p>{{ props.name }}</p>
      </div>
    </transition-scale>
    <!-- //////////////////////// -->
    <transition-slide
      class="h-full w-full flex justify-center items-center"
      group
    >
      <div v-if="props.status" class="console-main">
        <div class="console-timer">
          <p>
            {{
              `${props.timer.hours}:${props.timer.minutes}:${props.timer.seconds}`
            }}
          </p>
          <img src="@/assets/image/home/timer.svg" />
        </div>
        <!-- //////////////////////// -->
        <transition-fade group class="console-money">
          <p class="!text-[0.8rem]" v-if="!props.costPlayed">
            درحال محاسبه ...
          </p>
          <div
            class="w-full flex items-center justify-center gap-x-[3px]"
            v-else
          >
            <p>
              {{ props.costPlayed.toLocaleString() }}
            </p>
            <p class="!font-[400]">تومان</p>
          </div>
        </transition-fade>
      </div>
      <p v-else class="text-[#565656] font-[kalameh]">دستگاه خالی میباشد :(</p>
    </transition-slide>
    <!-- //////////////////////// -->
    <transition-scale group>
      <div v-if="props.status" class="console-footer">
        <button
          class="button bg-[#EF6262] text-white"
          @click="
            emit(
              'status',
              { billId: props.billId, consoleId: props.consoleId },
              false
            )
          "
        >
          پایان
        </button>
        <button class="button bg-[#3ea6da] text-white">امکانات</button>
      </div>
      <button
        class="button bg-[#7CC078] text-white"
        @click="
          emit(
            'status',
            { billId: props.billId, consoleId: props.consoleId },
            true
          )
        "
        v-else
      >
        <div class="flex items-center gap-x-[5px]">
          <p class="text-white font-[kalameh] text-[0.75rem] mb-1">شروع</p>
          <img src="@/assets/image/home/start.svg" />
        </div>
      </button>
    </transition-scale>
    <!-- //////////////////////// -->
    <transition-fade>
      <div v-if="props.loading" class="parent-console-loader">
        <span class="console-loader" />
      </div>
    </transition-fade>
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
.icon-change-bill {
  @apply cursor-pointer hover:scale-110 transition-all absolute top-[10px];
}
</style>
