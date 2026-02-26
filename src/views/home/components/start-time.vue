<script setup lang="ts">
import { filterNumbers } from "@/utils/convert-number";
import type { home } from "@/types/index";
import { usePinia } from "@/store/pinia";
import { reactive, watch } from "vue";
///////////////////////////////////////
const emit = defineEmits<{
  time: [time: number];
}>();
const props = defineProps<{ billId: number; loading: boolean }>();
const pinia = usePinia();
const state = reactive({
  minute: "" as number | string,
});
/////////////////////////
watch(
  () => state.minute,
  (value) => {
    state.minute = filterNumbers(value);
  },
);
/////////////////////////////
const handleIncrease = () => {
  if (state.minute) {
    emit("time", Number(state.minute));
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
/////////////////////////////
const handleDecrease = () => {
  if (state.minute) {
    const timer = handleGetBillTimer();
    const minute = Number(timer?.hours) * 60 + Number(timer?.minutes);
    if (minute >= Number(state.minute)) {
      emit("time", Number(-state.minute));
    } else {
      pinia.handleNotification({
        ...pinia.state.notification,
        timer: 3000,
        name: "error",
        status: true,
        textHeader: "خطا",
        textMain: "بیشتر از حد مجاز",
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
/////////////////////////
const handleGetBillTimer = () => {
  if (Array.isArray(pinia.state.home)) {
    const billSelected: home | undefined = pinia.state.home.find(
      ({ billId }) => billId === props.billId,
    );
    if (billSelected) {
      return billSelected.timer;
    }
  }
};
</script>
<template>
  <div class="parent-start-time">
    <input
      class="input bg-white w-full"
      placeholder="برحسب دقیقه"
      v-model="state.minute"
      inputmode="numeric"
      type="text"
    />

    <div class="parent-btn">
      <!-- //////////////////////// -->
      <button
        :disabled="props.loading"
        @click="handleIncrease"
        :class="[
          'button bg-[#7CC078] text-white',
          { 'bg-gray-400 !cursor-not-allowed': props.loading },
        ]"
      >
        <transition-fade class="flex" group>
          <span v-if="props.loading" class="btn-loader"></span>
          <p v-else>افزایش</p>
        </transition-fade>
      </button>
      <!-- /////////////////////// -->
      <p class="text-lg">
        {{
          `${handleGetBillTimer()?.hours}:${handleGetBillTimer()?.minutes}:${
            handleGetBillTimer()?.seconds
          }`
        }}
      </p>
      <!-- /////////////////////// -->
      <button
        :disabled="props.loading"
        @click="handleDecrease"
        :class="[
          'button bg-[#EF6262] text-white',
          { 'bg-gray-400 !cursor-not-allowed': props.loading },
        ]"
      >
        <transition-fade class="flex" group>
          <span v-if="props.loading" class="btn-loader"></span>
          <p v-else>کاهش</p>
        </transition-fade>
      </button>
      <!-- ///////////////////////// -->
    </div>
  </div>
</template>
<style scoped>
.parent-start-time {
  @apply w-full p-1 flex flex-col gap-y-[10px] justify-center items-center;
}
.parent-btn {
  @apply flex w-full justify-between items-center gap-x-[10px];
}
.right {
  @apply w-full flex flex-col gap-y-[10px] justify-center items-center;
}
</style>
