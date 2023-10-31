<script setup lang="ts">
import type { alarmInLocalStorage } from "@/types/index";
import { filterNumbers } from "@/utils/convert-number";
import type { home } from "@/types/index";
import { usePinia } from "@/store/pinia";
import { reactive, watch } from "vue";
///////////////////////////////////////////////
const props = defineProps<{
  consoleId: number;
  loading: boolean;
  alarm: alarmInLocalStorage;
}>();
const emit = defineEmits<{
  setAlarm: [time: { hour: number; minute: number; consoleId: number }];
  removeAlarm: [consoleId: number];
}>();
const pinia = usePinia();
const state = reactive({
  hour: "" as string | number,
  minute: "" as string | number,
});
///////////////////////////////////////////////
watch(
  () => state.hour,
  (value) => {
    state.hour = filterNumbers(value);
    if (Number(state.hour) > 24) state.hour = "";
  }
);
watch(
  () => state.minute,
  (value) => {
    state.minute = filterNumbers(value);
    if (Number(state.minute) > 60) state.minute = "";
  }
);
///////////////////////////////////////////////
const handleAlarm = () => {
  if (state.minute) {
    const timer = handleGetConsoleTimer();
    const consoleMinute = Number(timer?.hours) * 60 + Number(timer?.minutes);
    const inputMinute = Number(state.hour) * 60 + Number(state.minute);
    if (Number(consoleMinute) < Number(inputMinute)) {
      emit("setAlarm", {
        minute: Number(state.minute),
        hour: Number(state.hour),
        consoleId: props.consoleId,
      });
    } else {
      pinia.handleNotification({
        ...pinia.state.notification,
        name: "error",
        status: true,
        textHeader: "خطا",
        textMain: `یادآور باید بیشتر از ${timer?.minutes} : ${timer?.hours} باشد`,
      });
    }
  } else {
    pinia.handleNotification({
      ...pinia.state.notification,
      name: "error",
      status: true,
      textHeader: "خطا",
      textMain: "لطفا مقدار مورد نظر را وارد کنید",
    });
  }
};
//////////////////////////////////////
const handleGetConsoleTimer = () => {
  if (Array.isArray(pinia.state.home)) {
    const consoleSelected: home | undefined = pinia.state.home.find(
      ({ consoleId }) => consoleId === props.consoleId
    );
    if (consoleSelected) {
      return consoleSelected.timer;
    }
  }
};
//////////////////////////////////////
</script>
<template>
  <transition-fade group class="parent-alarm">
    <div v-if="props.alarm.consoleId" class="parent-alarm-list">
      <div class="flex items-center gap-x-[10px]">
        <p>یادآور تنظیم شده :</p>
        <p class="bg-[#7CC078] text-white p-1 px-2 rounded-md">
          {{ ` ${props.alarm.minute} : ${props.alarm.hour}` }}
        </p>
      </div>
      <img
        @click="emit('removeAlarm', props.consoleId)"
        src="@/assets/image/close.svg"
        class="cursor-pointer"
      />
    </div>
    <div v-else class="parent-set-alarm">
      <!-- /////////////////////// -->
      <p class="text-lg">
        تایمر دستگاه :
        {{
          `${handleGetConsoleTimer()?.hours}:${
            handleGetConsoleTimer()?.minutes
          }:${handleGetConsoleTimer()?.seconds}`
        }}
      </p>
      <!-- /////////////////////// -->
      <div class="parent-input">
        <input
          v-model="state.minute"
          placeholder="دقیقه"
          class="input"
          type="text"
        />
        :
        <input
          v-model="state.hour"
          placeholder="ساعت"
          class="input"
          type="text"
        />
      </div>
      <!-- ///////////////////////// -->
      <button
        :disabled="props.loading"
        @click="handleAlarm"
        :class="[
          'button bg-[#7CC078] text-white mt-1',
          { 'bg-gray-400 !cursor-not-allowed': props.loading },
        ]"
      >
        <transition-fade class="flex" group>
          <span v-if="props.loading" class="btn-loader"></span>
          <p v-else>ثبت</p>
        </transition-fade>
      </button>
    </div>
  </transition-fade>
</template>
<style scoped>
.parent-alarm {
  @apply w-full flex justify-center items-center;
}
.parent-set-alarm {
  @apply w-full flex flex-col justify-center items-center gap-y-[5px];
}
.parent-input {
  @apply w-full flex justify-center gap-x-[10px] items-center;
}
.parent-input input {
  @apply text-center bg-white min-w-[50px] w-[75px];
}
.parent-alarm-list {
  @apply flex w-full text-slate-700 font-[kalameh] text-lg bg-white justify-between items-center p-2 rounded-md;
}
</style>
