<script setup lang="ts">
import type { DropListProps } from "@/types/index";
////////////////////////
const props = defineProps<DropListProps>();
const emit = defineEmits(["close"]);
////////////////////////
document.addEventListener("click", (event) => {
  const userElement = document.getElementById(props.element) as HTMLElement;
  ////////////////////////////////////////////////////////
  if (!userElement.contains(event.target as Node)) {
    emit("close");
  }
});
</script>
<template>
  <transition-expand>
    <div
      :style="{ top: props.space }"
      class="parent-drop-list"
      v-if="props.status"
    >
      <div class="w-full" v-for="(item, index) in props.data" :key="item.id">
        <div class="item-drop-list">
          <p>{{ item.name }}</p>
          <img v-if="item.image" :src="item.image" />
        </div>
        <div v-if="index < props.data.length - 1" class="line"></div>
      </div>
    </div>
  </transition-expand>
</template>
<style scoped>
.parent-drop-list {
  @apply flex flex-col z-[9999] cursor-default justify-start p-[7px] min-w-[70px] items-center absolute  bg-[#1D5B79] rounded-[6px];
  box-shadow: 2px 2px 10px 0px rgba(0, 0, 0, 0.25);
}
.item-drop-list {
  @apply w-full flex justify-between gap-x-5 items-center cursor-pointer;
}
.item-drop-list p {
  @apply w-full font-[kalameh] p-1 text-[0.85rem] text-white;
}
.item-drop-list:hover {
  @apply bg-slate-500 rounded-md transition-all;
}
.line {
  border: 1px solid #ffffff;
  transform: rotate(180deg);
  margin: 5px 0px;
  align-self: stretch;
  width: 100%;
  height: 0px;
  flex: none;
}
</style>
