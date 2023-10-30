<script setup lang="ts">
import { usePinia } from "@/store/pinia";
import { reactive } from "vue";
import anime from "animejs";
/////////////////////////
const emit = defineEmits<{
  hourRate: [hourRate: { id: number; name: number }];
}>();
/////////////////////////
const pinia = usePinia();
const state = reactive({
  dropListStatus: false,
  hourRate: { id: 0, name: 0 },
});
///////////////////////
const handleHourRateSelected = (hourRateId: number) => {
  if (Array.isArray(pinia.state.hourRate)) {
    const hourRateSelected = pinia.state.hourRate.find(
      (item) => item.id === hourRateId
    );
    if (hourRateSelected) {
      emit("hourRate", hourRateSelected);
      state.hourRate = hourRateSelected;
      animateNumber();
    }
  }
};
/////////////////////////
const animateNumber = () => {
  const moneyElement = document.getElementById("money");
  if (moneyElement) {
    anime({
      innerHTML: [
        `${String(state.hourRate.name).replace("000", "")}  هزار تومان`,
      ],
      targets: moneyElement,
      easing: "easeInOutCirc",
      duration: 1000,
      round: 1,
    });
  }
};
</script>
<template>
  <div class="parent-hour-rate">
    <p>قیمت واحد</p>
    <div
      @click="state.dropListStatus = !state.dropListStatus"
      class="flex items-center justify-center relative"
      id="hour-rate"
    >
      <div
        class="flex cursor-pointer items-center gap-x-[5px]"
        v-if="!state.hourRate.id"
      >
        <p>انتخاب کنید</p>
        <img
          src="@/assets/image/home/start-bill-money.svg"
          class="animate-pulse"
        />
      </div>
      <p v-show="state.hourRate.id" id="money"></p>
      <DropList
        @close="state.dropListStatus = false"
        @selected="handleHourRateSelected"
        :status="state.dropListStatus"
        :data="pinia.state.hourRate"
        element="hour-rate"
        :space="'32px'"
      />
    </div>
  </div>
</template>
<style scoped>
.parent-hour-rate {
  @apply p-1 w-full flex justify-between items-center;
}
</style>
