<script setup lang="ts">
import { reactive } from "vue";
///////////////////////
const state = reactive({
  sortConsole: [
    { id: 1, name: "شماره دستگاه" },
    { id: 2, name: "دستگاه های فعال" },
    { id: 3, name: "دستگاه های غیر فعال" },
  ],
  sortConsoleStatus: false,
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
      @click="state.sortConsoleStatus = !state.sortConsoleStatus"
      class="tools-item"
      id="sort-console"
    >
      <p>ترتیب نمایش دستگاه ها</p>
      <img src="@/assets/image/home/sort.svg" />
      <DropList
        @close="state.sortConsoleStatus = false"
        :status="state.sortConsoleStatus"
        :data="state.sortConsole"
        element="sort-console"
        :space="'30px'"
      />
    </div>
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
        :status="state.displayConsoleStatus"
        :data="state.displayConsole"
        element="display-console"
        :space="'30px'"
      />
    </div>
    <!-- /////////////////////// -->
  </div>
</template>
<style scoped>
.parent-tools {
  @apply w-full bg-white shadow-sm justify-center flex items-center h-[40px] gap-x-[10px];
}
.tools-item {
  @apply flex justify-center items-center gap-x-[5px] cursor-pointer relative;
}
.tools-item p {
  @apply text-black font-[kalameh];
}
.line {
  border: 1px solid #c4bcab;
  transform: rotate(180deg);
  height: 100%;
}
</style>
