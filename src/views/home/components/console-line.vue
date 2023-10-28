<script setup lang="ts">
import type { home } from "@/types/index";
//////////////////////////////
const emit = defineEmits<{
  status: [info: { billId: number; consoleId: number }, status: boolean];
  removeBill: [billId: number, consoleId: number];
  factor: [
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
  <div
    :class="[
      'console',
      props.status
        ? 'active-color  border-[#1d5b79]'
        : 'disable-color  border-[#C0C0C0]',
    ]"
  >
    <div class="console-right">
      <div
        :class="[
          props.status ? 'bg-[#1D5B79]' : 'bg-[#C0C0C0]',
          'console-number',
        ]"
      >
        <p>{{ props.name }}</p>
      </div>
      <transition-fade class="h-full flex items-center" group>
        <div v-if="$props.status" class="parent-money-and-timer">
          <div class="console-timer">
            <p>
              {{
                `${props.timer.hours}:${props.timer.minutes}:${props.timer.seconds}`
              }}
            </p>
            <img src="@/assets/image/home/timer.svg" />
          </div>
          <transition-fade group class="console-money">
            <p class="!text-[0.8rem]" v-if="!props.costPlayed">
              درحال محاسبه ...
            </p>
            <div
              @click="
                emit('factor', props.billId, props.consoleId, props.billFood)
              "
              class="flex items-center cursor-pointer gap-x-[5px]"
              v-else
            >
              <p>{{ props.costPlayed.toLocaleString() }}</p>
              <p class="!font-[400]">تومان</p>
            </div>
          </transition-fade>
        </div>
        <p v-else class="text-[#565656] font-[kalameh]">
          دستگاه خالی میباشد :(
        </p>
      </transition-fade>
    </div>
    <transition-slide group>
      <div v-if="props.status" class="console-left">
        <div>
          <img
            @click="emit('removeBill', props.billId, props.consoleId)"
            src="@/assets/image/home/remove-bill.svg"
            class="icon-change-bill ml-[14px]"
          />
          <button class="button bg-[#3ea6da] text-white">امکانات</button>
        </div>
        <div>
          <img
            @click="emit('food', props.billId, props.consoleId, props.billFood)"
            src="@/assets/image/home/food-bill.svg"
            class="icon-change-bill ml-[10px]"
          />
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
        </div>
      </div>
      <button
        @click="
          emit(
            'status',
            { billId: props.billId, consoleId: props.consoleId },
            true
          )
        "
        v-else
        class="button bg-[#7CC078] text-white"
      >
        <div class="flex items-center gap-x-[5px]">
          <p class="text-white font-[kalameh] text-[0.75rem] mb-1">شروع</p>
          <img src="@/assets/image/home/start.svg" />
        </div>
      </button>
    </transition-slide>
    <!-- ///////////////////////////// -->
    <transition-fade>
      <div v-if="props.loading" class="parent-console-loader">
        <span class="console-loader" />
      </div>
    </transition-fade>
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
.console-left > div {
  @apply flex w-full justify-end items-center;
}
.icon-change-bill {
  @apply cursor-pointer hover:scale-110 transition-all;
}
</style>
