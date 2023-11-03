<script setup lang="ts">
import { onMounted, ref, watch } from "vue";
import JalaliDate from "jalali-date";
////////////////////////
const dateStatus = ref<boolean>(false);
const inputDate = ref<string>();
const jalaliDate = ref<string>();
////////////////////////
onMounted(() => {
  jalaliDate.value = new JalaliDate(new Date()).format("dddd DD MMMM YYYY");
});
////////////////////////
watch(
  () => inputDate.value,
  (value) => {
    console.log(new Date(value ? value : "").toISOString());
    jalaliDate.value = new JalaliDate(new Date(value ? value : "")).format(
      "dddd DD MMMM YYYY"
    );
  },
  { deep: true }
);
</script>
<template>
  <div class="parent-report">
    <!-- ////////////////////////////// -->
    <div class="!p-0">
      <p>تاریخ :</p>
      <date-picker
        @close="dateStatus = false"
        format="YYYY-MM-DD"
        v-model="inputDate"
        :show="dateStatus"
        simple
      />
      <button
        :disabled="false"
        :class="[
          'button bg-[#3ea6da] p-2 text-white',
          { 'bg-gray-400 !cursor-not-allowed': false },
        ]"
        @click="dateStatus = !dateStatus"
      >
        <transition-fade class="flex" group>
          <span v-if="!jalaliDate" class="btn-loader"></span>
          <p v-else>{{ jalaliDate }}</p>
        </transition-fade>
      </button>
    </div>
    <!-- ////////////////////////////// -->
    <div>
      <p>هزینه بازی شده :</p>
      <p>تومان</p>
    </div>
    <!-- ////////////////////////////// -->
    <div class="w-full border !p-0 border-solid border-slate-500"></div>
    <!-- ////////////////////////////// -->
    <div>
      <p>خوراکی های فروخته شده :</p>
      <p>تومان</p>
    </div>
    <!-- ////////////////////////////// -->
    <div>
      <p>جمع کل :</p>
      <p>تومان</p>
    </div>
    <!-- ////////////////////////////// -->
  </div>
</template>
<style>
.parent-report {
  @apply w-full p-2 flex flex-col justify-center items-center;
}
.parent-report > div {
  @apply w-full flex justify-between items-center p-2.5;
}
.vpd-input-group {
  display: none;
}
.vpd-body {
  @apply p-2.5;
}
.vpd-container {
  @apply rounded-md overflow-hidden;
}
.vpd-actions {
  @apply text-center mt-2;
}
.vpd-simple-content .vpd-column {
  @apply gap-y-[10px];
}
.vpd-simple-content .vpd-column .vpd-column-content:after,
.vpd-simple-content .vpd-column .vpd-column-content:before {
  @apply !hidden;
}
.parent-report > div:nth-child(2) {
  @apply mt-3  rounded-t-md;
  background: linear-gradient(92deg, #f8b806 -30.82%, #ff8c04 126.36%);
}
.parent-report > div:nth-child(4) {
  background: linear-gradient(92deg, #f8b806 -30.82%, #ff8c04 126.36%);
}
.parent-report > div:nth-child(5) {
  @apply rounded-b-md;
  background: linear-gradient(95deg, #32bb71 15.3%, #2a9d8f 113.45%);
}
</style>
