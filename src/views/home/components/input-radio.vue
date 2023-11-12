<script setup lang="ts">
import { reactive } from "vue";
//////////////////////////////
const emit = defineEmits<{ paymentMethod: [number] }>();
const state = reactive({
  inputRadios: [
    { label: "کارت", status: true, value: 0 },
    { label: "نقد", status: false, value: 1 },
  ],
});
//////////////////////////////
const handleInputRadio = (inputRadio: {
  label: string;
  status: boolean;
  value: number;
}) => {
  state.inputRadios.forEach((item) => (item.status = false));
  inputRadio.status = true;
  emit("paymentMethod", inputRadio.value);
};
//////////////////////////////
</script>
<template>
  <div class="parent-input-radios">
    <div
      v-for="(item, index) in state.inputRadios"
      @click="handleInputRadio(item)"
      class="input-radio"
      :key="index"
    >
      <p>{{ item.label }}</p>
      <div
        :class="
          item.status
            ? 'radio-active transition-all'
            : 'radio-Inactive transition-all'
        "
      ></div>
    </div>
  </div>
</template>
<style scoped>
.parent-input-radios {
  @apply flex items-center justify-start gap-x-5;
}
.input-radio {
  @apply flex items-center gap-x-2 cursor-pointer;
}
.radio-Inactive {
  @apply w-[22px] h-[22px] bg-slate-300 rounded-full shadow-sm;
}
.radio-active {
  @apply w-[22px] h-[22px] bg-[#F4F4F4] rounded-full shadow-sm border-blue-500 border-[6px];
}
</style>
