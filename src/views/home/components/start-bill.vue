<script setup lang="ts">
import type { StartBillProps } from "@/types/index";
import { usePinia } from "@/store/pinia";
import anime from "animejs";
/////////////////////////////////////////
const props = defineProps<{ startBill: StartBillProps }>();
const emit = defineEmits<{
  hourRate: [hourRateSelected: { id: number; name: number }];
  dropListStatus: [status: boolean];
}>();
const pinia = usePinia();
////////////////////////
const handleHourRateSelected = (hourRateId: number) => {
  if (Array.isArray(pinia.state.hourRate)) {
    const hourRateSelected = pinia.state.hourRate.find(
      (item) => item.id === hourRateId
    );
    if (hourRateSelected) {
      emit("hourRate", hourRateSelected);
    }
  }
  animateNumber();
};
////////////////////////
const animateNumber = () => {
  const moneyElement = document.getElementById("money");
  if (moneyElement) {
    anime({
      innerHTML: [
        `${String(props.startBill.hourRateSelected.name).replace(
          "000",
          ""
        )}  هزار تومان`,
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
  <div class="parent-start-bill">
    <div>
      <div class="flex items-center gap-x-[3px]">
        <p>قیمت واحد</p>
        <p class="text-[12px] text-[#ffd54a]">(اجباری)</p>
      </div>
      <div
        @click="emit('dropListStatus', !props.startBill.dropListStatus)"
        class="relative cursor-pointer flex justify-center"
        id="start-bill"
      >
        <div
          v-if="!props.startBill.hourRateSelected.id"
          class="flex items-center gap-x-[5px]"
        >
          <p class="text-[12px] font-bold">انتخاب کنید</p>
          <img src="@/assets/image/home/start-bill-money.svg" />
        </div>
        <p v-show="props.startBill.hourRateSelected.id" id="money"></p>
        <DropList
          :status="props.startBill.dropListStatus"
          @close="emit('dropListStatus', false)"
          @selected="handleHourRateSelected"
          :data="pinia.state.hourRate"
          element="start-bill"
          :space="'32px'"
        />
      </div>
    </div>
  </div>
</template>
<style scoped>
.parent-start-bill {
  @apply flex w-full flex-col items-center justify-center;
}
.parent-start-bill > div {
  @apply flex w-full items-center justify-between;
}
</style>
