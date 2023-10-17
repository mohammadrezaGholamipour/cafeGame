<script setup lang="ts">
import Small from "./components/small.vue";
import Larg from "./components/larg.vue";
import { usePinia } from "@/store/pinia";
////////////////////////////////////////
const props = defineProps(["header"]);
const pinia = usePinia();
</script>
<template>
  <transition-fade class="parent-table" group>
    <Larg v-if="pinia.state.appWidth > 600" :header="props.header">
      <slot name="Larg" />
    </Larg>
    <Small v-else >
      <slot name="small" />
    </Small>
  </transition-fade>
</template>
<style scoped>
.parent-table {
  @apply w-full h-full flex flex-col justify-start items-center;
}
</style>
