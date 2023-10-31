<script setup lang="ts">
import type { home } from "@/types/index";
//////////////////////////////
const emit = defineEmits<{
  status: [info: { billId: number; consoleId: number }, status: boolean];
  removeBill: [
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
  optionStatus: [status: boolean, consoleId: number];
  hourRate: [billId: number];
  changeStartTime: [billId: number];
  alarm: [consoleId: number];
  removeAlarm: [consoleId: number];
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
              :class="
                props.billFood.length ? 'cursor-pointer' : 'cursor-not-allowed'
              "
              class="flex items-center gap-x-[5px]"
              v-else
            >
              <p>{{ (props.costPlayed + props.costFood).toLocaleString() }}</p>
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
            @click="
              emit('removeBill', props.billId, props.consoleId, props.billFood)
            "
            src="@/assets/image/home/remove-bill.svg"
            class="icon-change-bill ml-[14px]"
          />
          <button
            @click="emit('optionStatus', true, props.consoleId)"
            class="button bg-[#3ea6da] text-white"
          >
            امکانات
          </button>
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
    <transition-slide>
      <div
        @click="emit('optionStatus', false, props.consoleId)"
        class="parent-console-option"
        v-if="props.optionStatus"
      >
        <div class="close-option">
          <img src="@/assets/image/close.svg" />
        </div>
        <div>
          <div @click="emit('hourRate', props.billId)" class="option-box">
            <img src="@/assets/image/home/money-option.svg" />
            <p>قیمت واحد</p>
          </div>
          <div
            @click="emit('changeStartTime', props.billId)"
            class="option-box"
          >
            <img src="@/assets/image/home/bill-time-option.svg" />
            <p>زمان شروع</p>
          </div>
          <div @click="emit('alarm', props.consoleId)" class="option-box">
            <img src="@/assets/image/home/alarm-option.svg" />
            <p>یادآور</p>
          </div>
        </div>
      </div>
    </transition-slide>
    <!-- //////////////////////// -->
    <transition-fade>
      <div v-if="props.alarmStatus" class="parent-show-alarm">
        <button
          class="button p-2 bg-[#EF6262] text-white"
          @click="emit('removeAlarm', props.consoleId)"
        >
          متوجه شدم
        </button>
      </div>
    </transition-fade>
    <!-- //////////////////////// -->
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
.parent-console-option {
  @apply absolute flex justify-between items-center px-[10px] rounded-[5px] w-full h-full backdrop-blur-md;
}
.parent-console-option > div {
  @apply flex items-center gap-x-[10px];
}
.option-box {
  @apply w-[70px] hover:opacity-80 transition-all h-[70px] gap-y-[5px] cursor-pointer shadow-md flex flex-col items-center justify-center rounded-[5px];
}
.option-box p {
  @apply text-[#1C274C] font-bold font-[kalameh] text-[13px];
}
.option-box:nth-child(1) {
  @apply border-2 border-[#32bb71];
  background: linear-gradient(95deg, #32bb71 15.3%, #2a9d8f 113.45%);
}
.option-box:nth-child(2) {
  @apply border-2 border-[#2d82b2];
  background: linear-gradient(94deg, #2d82b2 -6.52%, #329abb 108.61%);
}
.option-box:nth-child(3) {
  @apply border-2 border-[#f8b806];
  background: linear-gradient(92deg, #f8b806 -30.82%, #ff8c04 126.36%);
}
.close-option {
  @apply w-[40px] h-[40px] border-2 border-[#ef6262] rounded-full cursor-pointer bg-slate-300 shadow-md flex justify-center items-center;
}
.parent-show-alarm {
  @apply w-full h-full absolute flex left-0 justify-center top-0 backdrop-blur-lg items-center rounded-[5px];
  background: linear-gradient(92deg, #f8b8069a -30.82%, #ff8e04ab 126.36%);
}
</style>
