<script setup lang="ts">
import { computed, reactive, watch } from "vue";
////////////////////////////////////////
const emit = defineEmits<{ changeTab: [Tab: string] }>();
const state = reactive({
  status: "login",
});
const translateTab = computed(() => {
  return state.status === "login" ? "translate-x-[-100%]" : "translate-x-[0%]";
});
/////////////////////////////////////
watch(
  () => state.status,
  () => {
    console.log(state.status);
    emit("changeTab", state.status);
  }
);
</script>
<template>
  <div class="parent-account-tab">
    <p @click="state.status = 'register'">ثبت نام</p>
    <p @click="state.status = 'login'">وارد شدن</p>
    <div :class="['tab-selected', translateTab]">
      <p>{{ state.status === "login" ? "وارد شدن" : "ثبت نام" }}</p>
    </div>
  </div>
</template>
<style scoped>
.parent-account-tab {
  @apply w-[300px] relative rounded-[33px] p-[5px] min-h-[50px] flex justify-between items-center;
  background: rgba(29, 91, 121, 0.1);
}
.parent-account-tab > p {
  @apply font-[kalameh] w-[130px] text-center text-[#656565] cursor-pointer;
}
.tab-selected {
  @apply bg-[#1D5B79] absolute rounded-[33px] flex justify-center items-center h-[40px] w-[144px] transition-all duration-500;
  box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.25);
}
.tab-selected > p {
  @apply font-[kalameh]  text-white;
}
</style>
