<script setup lang="ts">
import type { consolePage, consoleTypeApi, bill } from "@/types/index";
import ConsoleLine from "./components/console-line.vue";
import ConsoleBox from "./components/console-box.vue";
import loading from "@/components/loading.vue";
import tools from "./components/tools.vue";
import { usePinia } from "@/store/pinia";
import { computed, reactive } from "vue";
/////////////////////////////////////
const pinia = usePinia();
const state = reactive({
  displayMode: 2,
  console: false as boolean | consolePage[],
});
///////////////////////////
const consoleData = computed(() => {
  if (Array.isArray(pinia.state.console) && Array.isArray(pinia.state.bill)) {
    return pinia.state.console.map(({ id, name }: consoleTypeApi) => {
      /////////////////////////
      const item = {
        id: 0,
        name: "",
        playedCost: 0,
        playedTime: { hours: 0, minutes: 0, seconds: 0 },
      };
      /////////////////////////
      const billData = pinia.state.bill as bill[];
      const closedBills = billData.filter((bill: bill) => bill.endTime);
      /////////////////////////
      for (const bill of closedBills) {
        if (bill.systemId === id) {
          const startTime = new Date(bill.startTime).getTime();
          const endTime = new Date(bill.endTime).getTime();
          let delta = Math.abs(endTime - startTime) / 1000;
          ////////////////////////////
          let days = Math.floor(delta / 86400);
          delta -= days * 86400;
          let hours = Math.floor(delta / 3600) % 24;
          delta -= hours * 3600;
          let minutes = Math.floor(delta / 60) % 60;
          delta -= minutes * 60;
          let seconds = Math.floor(delta % 60);
          //////////////////////////////
          item.playedTime.hours += hours;
          item.playedTime.minutes += minutes;
          item.playedTime.seconds += seconds;
          if (item.playedTime.minutes >= 60) {
            item.playedTime.hours += Math.floor(item.playedTime.minutes / 60);
            item.playedTime.minutes %= 60;
          }
          if (item.playedTime.seconds >= 60) {
            item.playedTime.minutes += Math.floor(item.playedTime.seconds / 60);
            item.playedTime.seconds %= 60;
          }
          item.playedCost += bill.finalCost - bill.foodCost;
        }
      }
      /////////////////////////
      item.name = name;
      item.id = id;
      return item;
    });
  }
});
///////////////////////////
</script>
<template>
  <div class="parent-console-page">
    <tools @displayMode="state.displayMode = $event" />
    <transition-fade group class="w-full overflow-y-auto h-full">
      <div v-if="pinia.state.home" class="parent-console">
        <component
          :is="state.displayMode === 1 ? ConsoleLine : ConsoleBox"
          :playedCost="console.playedCost"
          :playedTime="console.playedTime"
          v-for="console in consoleData"
          :name="console.name"
          :id="console.id"
          :key="console.id"
        />
      </div>
      <loading v-else />
    </transition-fade>
  </div>
</template>
<style scoped>
.parent-console-page {
  @apply w-full h-full flex flex-col justify-start items-start;
}
</style>
