<script setup lang="ts">
import { computed, ref, watch } from "vue";
import type { bill } from "@/types/index";
import JalaliDate from "jalali-date";
////////////////////////
const emit = defineEmits<{ report: [startDate: string, endDate: string] }>();
const props = defineProps<{ bills: bill[] }>();
const startDateStatus = ref<boolean>(false);
const endDateDateStatus = ref<boolean>(false);
const inputDate = ref<{ startDate: string; endDate: string }>({
  startDate: "",
  endDate: "",
});
////////////////////////
watch(
  () => inputDate.value,
  (value) => {
    if (value.startDate && value.endDate) {
      emit(
        "report",
        `${value.startDate}T00:00:00.000Z`,
        `${value.endDate}T23:59:59.999Z`
      );
    }
  },
  { deep: true }
);
////////////////////////
const handleShowDate = computed(() => {
  const date = { startDate: "انتخاب کنید", endDate: "انتخاب کنید" };
  if (inputDate.value.startDate) {
    date.startDate = new JalaliDate(new Date(inputDate.value.startDate)).format(
      "dddd DD MMMM YYYY"
    );
  }
  if (inputDate.value.endDate) {
    date.endDate = new JalaliDate(new Date(inputDate.value.endDate)).format(
      "dddd DD MMMM YYYY"
    );
  }
  return date;
});
////////////////////////
const handleTotallCost = computed(() => {
  const foodCost = props.bills.reduce(
    (total, item) => total + (item.foodCost || 0),
    0
  );
  const playCost = props.bills.reduce(
    (total, item) => total + (item.total_price),
    0
  );
  const finalCost = props.bills.reduce(
    (total, item) => total + (item.total_price || 0),
    0
  );
  return { foodCost, playCost, finalCost, factorLength: props.bills.length };
});
////////////////////////
</script>
<template>
  <div class="parent-report">
    <!-- ////////////////////////////// -->
    <div class="!p-0">
      <div class="flex items-center gap-x-[5px]">
        <p>تاریخ شروع :</p>
        <date-picker @close="startDateStatus = false" v-model="inputDate.startDate" :show="startDateStatus"
          format="YYYY-MM-DD" simple />
        <button :disabled="false" :class="[
          'button bg-[#7CC078] p-2 text-white',
          { 'bg-gray-400 !cursor-not-allowed': false },
        ]" @click="startDateStatus = !startDateStatus">
          <p>{{ handleShowDate.startDate }}</p>
        </button>
      </div>
      <div class="flex items-center gap-x-[5px]">
        <p>تاریخ پایان :</p>
        <date-picker @close="endDateDateStatus = false" v-model="inputDate.endDate" :show="endDateDateStatus"
          format="YYYY-MM-DD" simple />
        <button :disabled="false" :class="[
          'button bg-[#EF6262] p-2 text-white',
          { 'bg-gray-400 !cursor-not-allowed': false },
        ]" @click="endDateDateStatus = !endDateDateStatus">
          <p>{{ handleShowDate.endDate }}</p>
        </button>
      </div>
    </div>
    <!-- ////////////////////////////// -->
    <div>
      <p>تعداد فاکتور :</p>
      <p>{{ handleTotallCost.factorLength }} عدد</p>
    </div>
    <!-- ////////////////////////////// -->
    <div class="w-full border !p-0 border-solid border-slate-500"></div>
    <!-- ////////////////////////////// -->
    <div>
      <p>هزینه بازی شده :</p>
      <p>{{ handleTotallCost.playCost.toLocaleString() }} تومان</p>
    </div>
    <!-- ////////////////////////////// -->
    <div class="w-full border !p-0 border-solid border-slate-500"></div>
    <!-- ////////////////////////////// -->
    <div>
      <p>خوراکی های فروخته شده :</p>
      <p>{{ handleTotallCost.foodCost.toLocaleString() }} تومان</p>
    </div>
    <!-- ////////////////////////////// -->
    <div>
      <p>جمع کل :</p>
      <p>{{ (handleTotallCost.finalCost + handleTotallCost.foodCost).toLocaleString() }} تومان</p>
    </div>
    <!-- ////////////////////////////// -->
  </div>
</template>
<style>
.parent-report {
  @apply w-full p-2 flex flex-col justify-center items-center;
}

.parent-report>div {
  @apply w-full flex justify-between items-center p-2.5 flex-wrap whitespace-nowrap gap-[10px];
}

.vpd-input-group {
  display: none !important;
}

.vpd-body {
  @apply p-2.5 !important;
}

.vpd-container {
  @apply rounded-md overflow-hidden !important;
}

.vpd-actions {
  @apply text-center mt-2 !important;
}

.vpd-simple-content .vpd-column {
  @apply gap-y-[10px] !important;
}

.vpd-simple-content .vpd-column .vpd-column-content:after,
.vpd-simple-content .vpd-column .vpd-column-content:before {
  @apply !hidden !important;
}

.parent-report>div:nth-child(2) {
  @apply mt-3 rounded-t-md;
  background: linear-gradient(92deg, #f8b806 -30.82%, #ff8c04 126.36%);
}

.parent-report>div:nth-child(4) {
  background: linear-gradient(92deg, #f8b806 -30.82%, #ff8c04 126.36%);
}

.parent-report>div:nth-child(6) {
  background: linear-gradient(92deg, #f8b806 -30.82%, #ff8c04 126.36%);
}

.parent-report>div:nth-child(7) {
  @apply rounded-b-md;
  background: linear-gradient(95deg, #32bb71 15.3%, #2a9d8f 113.45%);
}
</style>
