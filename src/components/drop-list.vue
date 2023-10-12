<script setup lang="ts">
import type { DropListProps } from "@/types/index";
////////////////////////
const props = defineProps<DropListProps>();
const emit = defineEmits<{ selected: [id: number]; close: [] }>();
////////////////////////
document.addEventListener("click", (event) => {
  const userElement = document.getElementById(props.element) as HTMLElement;
  ////////////////////////////////////////////////////////
  if (!userElement?.contains(event.target as Node)) {
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
      <div
        v-for="(item, index) in props.data"
        @click="emit('selected', item.id)"
        class="w-full"
        :key="item.id"
      >
        <div class="item-drop-list">
          <p>
            {{ Number(item.name) ? item.name.toLocaleString() : item.name }}
          </p>
          <img v-if="item.image" :src="item.image" />
        </div>
        <div v-if="index < props.data.length - 1" class="line"></div>
      </div>
    </div>
  </transition-expand>
</template>
<style scoped>
.parent-drop-list {
  @apply flex flex-col transition-all z-[99999] overflow-y-scroll overflow-hidden cursor-default justify-start max-h-[125px] pr-[5px] py-[3px] items-center absolute bg-[#1D5B79] rounded-[3px];
  box-shadow: 2px 2px 10px 0px rgba(0, 0, 0, 0.25);
}
.item-drop-list {
  @apply w-full flex gap-x-5 items-center justify-center cursor-pointer;
}
.item-drop-list p {
  @apply w-full font-[kalameh] p-1 text-center text-[0.85rem] text-white;
}
.item-drop-list p:hover {
  @apply text-slate-200 transition-all;
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
