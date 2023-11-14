<script setup lang="ts">
import { filterNumbers } from "@/utils/convert-number";
import { usePinia } from "@/store/pinia";
import { reactive, watch } from "vue";
///////////////////////////////////////
const emit = defineEmits<{
  money: [number];
  removeMoney: [number];
}>();
const props = defineProps<{
  consoleId: number;
  costFood: number;
  costPlayed: number;
  customMoney: number;
}>();
const pinia = usePinia();
const state = reactive({
  inputMoney: "" as number | string,
});
/////////////////////////
watch(
  () => state.inputMoney,
  (value) => {
    state.inputMoney = filterNumbers(value);
  }
);
/////////////////////////////
const handleIncrease = () => {
  if (state.inputMoney) {
    emit("money", Number(state.inputMoney));
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
  if (state.inputMoney) {
    emit("money", -Number(state.inputMoney));
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
////////////////////////////
</script>
<template>
  <transition-fade group class="parent-change-money">
    <div class="parent-money-list" v-if="props.customMoney">
      <p>
        {{
          props.customMoney > 0
            ? `${props.customMoney.toLocaleString()}  تومان افزایش یافته است`
            : `${String(props.customMoney.toLocaleString()).replace(
                "-",
                ""
              )} تومان کاهش یافته است`
        }}
      </p>
      <img
        src="@/assets/image/close.svg"
        @click="emit('removeMoney', props.consoleId)"
        class="cursor-pointer"
      />
    </div>
    <div v-else class="parent-input-and-btn-change-money">
      <input
        placeholder="قیمت را به تومان وارد کنید"
        class="input bg-white w-full"
        v-model="state.inputMoney"
        inputmode="numeric"
        type="text"
      />

      <div class="parent-btn">
        <!-- //////////////////////// -->
        <button @click="handleIncrease" class="button bg-[#7CC078] text-white">
          <p>افزایش</p>
        </button>
        <!-- /////////////////////// -->
        <p class="text-[1rem] font-[kalameh]">
          {{ `${(props.costFood + props.costPlayed).toLocaleString()} تومان` }}
        </p>
        <!-- /////////////////////// -->
        <button @click="handleDecrease" class="button bg-[#EF6262] text-white">
          <p>کاهش</p>
        </button>
        <!-- ///////////////////////// -->
      </div>
    </div>
  </transition-fade>
</template>
<style scoped>
.parent-change-money {
  @apply w-full p-1 flex justify-center items-center;
}
.parent-input-and-btn-change-money {
  @apply w-full flex flex-col gap-y-[10px] justify-center items-center;
}
.parent-btn {
  @apply flex w-full justify-between items-center gap-x-[10px];
}
.right {
  @apply w-full flex flex-col gap-y-[10px] justify-center items-center;
}
.parent-money-list {
  @apply flex w-full text-slate-700 font-[kalameh] bg-white justify-between items-center p-2 rounded-md;
}
</style>
