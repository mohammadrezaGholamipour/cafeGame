<script setup lang="ts">
import { reactive } from "vue";
///////////////////////
const emit = defineEmits<{ displayMode: [mood: number] }>();
const state = reactive({
  displayConsole: [
    { id: 1, name: "خطی" },
    { id: 2, name: "باکسی" },
  ],
  displayConsoleStatus: false,
});
</script>
<template>
  <div class="parent-tools">
    <!-- /////////////////////// -->
    <div
      @click="state.displayConsoleStatus = !state.displayConsoleStatus"
      id="display-console"
      class="tools-item"
    >
      <p>مدل نمایش دستگاه</p>
      <img src="@/assets/image/home/display.svg" />
      <DropList
        @close="state.displayConsoleStatus = false"
        @selected="emit('displayMode', $event)"
        :status="state.displayConsoleStatus"
        :data="state.displayConsole"
        element="display-console"
        :space="'32px'"
      />
    </div>
    <!-- /////////////////////// -->
  </div>
</template>
<style scoped>
.parent-tools {
  @apply w-full bg-white shadow-sm justify-center flex-wrap flex items-center p-[10px] h-auto gap-[10px];
}
.tools-item {
  @apply flex justify-center items-center gap-x-[5px] cursor-pointer relative;
}
.tools-item p {
  @apply text-black font-[kalameh] whitespace-nowrap;
}
.line {
  border: 1px solid #c4bcab;
  transform: rotate(180deg);
  height: 100%;
}
</style>
