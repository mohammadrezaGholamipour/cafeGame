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
  }
);
</script>
<template>
  <div class="parent-report">
    <!-- ////////////////////////////// -->
    <div>
      <p>تاریخ :</p>
      <date-picker
        @close="dateStatus = false"
        format="YYYY-MM-DD"
        v-model="inputDate"
        :show="dateStatus"
        id="date-picker"
        simple
      />
      <p @click="dateStatus = !dateStatus">{{ jalaliDate }}</p>
    </div>
    <!-- ////////////////////////////// -->
    <div>
      <p>هزینه بازی شده :</p>
      <p>تومان</p>
    </div>
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
  @apply w-full flex flex-col justify-center items-center gap-y-[10px];
}
.parent-report > div {
  @apply w-full flex justify-between items-center;
}
#date-picker .vpd-input-group {
  display: none;
}
</style>
