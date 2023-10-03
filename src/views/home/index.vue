<script setup lang="ts">
import consoleLine from "./components/console-line.vue";
import consoleBox from "./components/console-box.vue";
import loading from "./components/loading.vue";
import tools from "./components/tools.vue";
import { onMounted, reactive } from "vue";
///////////////////////////////
const state = reactive({
  displayMode: 2,
});
/////////////////////////
</script>
<template>
  <div class="parent-home">
    <tools @displayMode="state.displayMode = $event" />
    <transition-fade group class="w-full h-full">
      <component
        :is="state.displayMode === 1 ? consoleLine : consoleBox"
        v-if="true"
      />
      <loading v-else />
    </transition-fade>
  </div>
</template>
<style scoped>
.parent-home {
  @apply w-full h-full flex flex-col justify-start items-start;
}
</style>
