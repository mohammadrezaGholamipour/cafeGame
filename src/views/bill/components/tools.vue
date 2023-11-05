<script setup lang="ts">
const emit = defineEmits<{ new: []; report: [] }>();
const props = defineProps<{ loading: boolean }>();
</script>
<template>
  <div class="parent-tools">
    <!-- /////////////////////// -->
    <button
      :disabled="props.loading"
      @click="emit('report')"
      :class="[
        { 'bg-gray-400 !cursor-not-allowed': props.loading },
        'button bg-[#3ea6da] text-white',
      ]"
    >
      <transition-fade class="flex" group>
        <span v-if="props.loading" class="btn-loader"></span>
        <p v-else>گزارش</p>
      </transition-fade>
    </button>
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
