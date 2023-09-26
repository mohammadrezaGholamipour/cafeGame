<script setup lang="ts">
import type { DropListProps } from "@/types/index";
////////////////////////
const props = defineProps<DropListProps>();
const emit = defineEmits(["close"]);
////////////////////////
document.addEventListener("click", (event) => {
  const userElement = document.querySelector(".parent-user") as HTMLElement;
  ////////////////////////////////////////////////////////
  if (!userElement.contains(event.target as Node)) {
    emit("close");
  }
});
</script>
<template>
  <transition-fade>
    <div
      :style="{ top: props.space }"
      class="parent-drop-list"
      v-if="props.status"
    >
      <div class="w-full" v-for="(item, index) in props.data" :key="item.id">
        <div class="item-drop-list">
          <p>{{ item.name }}</p>
          <img :src="item.image" />
        </div>
        <div v-if="index < props.data.length - 1" class="line"></div>
      </div>
    </div>
  </transition-fade>
</template>
<style scoped>
.parent-drop-list {
  @apply flex flex-col cursor-default justify-start min-w-[70px] items-center absolute p-[7px] bg-[#1D5B79] rounded-[6px];
  box-shadow: 2px 2px 10px 0px rgba(0, 0, 0, 0.25);
}
.item-drop-list {
  @apply w-full flex justify-between gap-x-5 items-center cursor-pointer;
}
.item-drop-list p {
  @apply font-[kalameh] text-[0.85rem] text-white;
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
