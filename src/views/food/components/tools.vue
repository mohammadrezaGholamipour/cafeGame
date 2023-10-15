<script setup lang="ts">
const emit = defineEmits<{ new: [] }>();
const props = defineProps<{ loading: boolean }>();
</script>
<template>
  <div class="parent-tools">
    <!-- /////////////////////// -->
    <button
      :disabled="props.loading"
      :class="[
        'button h-[40px] bg-[#75ca71] text-white',
        { 'bg-gray-400 !cursor-not-allowed': props.loading },
      ]"
      @click="emit('new')"
    >
      <transition-fade class="flex" group>
        <span v-if="props.loading" class="btn-loader"></span>
        <p v-else>افزودن</p>
      </transition-fade>
    </button>
    <!-- /////////////////////// -->
    <input
      class="input !min-w-[200px] w-[220px]"
      placeholder="دنبال چی هستی؟"
      type="text"
    />
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
