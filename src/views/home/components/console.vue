<script setup lang="ts">
import { reactive } from "vue";
//////////////////////////////
const state = reactive({
  status: true,
});
/////////////////////
</script>
<template>
  <div
    :class="['parent-console', state.status ? 'active-color' : 'disable-color']"
    v-for="item in 20"
    :key="item"
  >
    <!-- ///////////////////////// -->
    <div
      :class="[
        'console-number',
        state.status ? 'bg-[#1D5B79]' : 'bg-[#C0C0C0]',
      ]"
    >
      <p>{{ item }}</p>
    </div>
    <!-- //////////////////////// -->
    <transition-slide group class="h-full flex justify-start items-center">
      <div v-if="state.status" class="console-main">
        <div class="console-timer">
          <p>2:45:37</p>
          <img src="@/assets/image/home/timer.svg" />
        </div>
        <!-- //////////////////////// -->
        <div class="console-money">
          <p>150,000</p>
          <p>تومان</p>
        </div>
      </div>
      <p v-else class="text-[#565656] font-[kalameh]">دستگاه خالی میباشد :(</p>
    </transition-slide>
    <!-- //////////////////////// -->
    <transition-scale group>
      <div v-if="state.status" class="console-footer">
        <button
          class="button bg-[#EF6262] text-white"
          @click="state.status = false"
        >
          پایان
        </button>
        <button class="button border-[1.5px] border-[#1D5B79] text-[#1D5B79]">
          امکانات
        </button>
      </div>
      <button
        v-else
        class="button bg-[#7CC078] text-white"
        @click="state.status = true"
      >
        <div class="flex items-center gap-x-[5px]">
          <p class="text-white font-[kalameh] text-[0.75rem] mb-1">شروع</p>
          <img src="@/assets/image/home/start.svg" />
        </div>
      </button>
    </transition-scale>
    <!-- //////////////////////// -->
  </div>
</template>
<style scoped>
.parent-console {
  @apply relative transition-all pb-[10px] pt-[30px] gap-y-[3px] w-[300px] h-[130px] rounded-[10px] flex flex-col justify-start items-center;
  box-shadow: 0px 0px 5px 0px rgba(56, 56, 56, 0.25);
}
.console-number {
  @apply w-[40px] transition-all flex justify-center absolute top-[-20px] items-center h-[40px] rounded-full;
}
.console-number p {
  @apply text-white font-[kalameh];
}
.console-main {
  @apply flex flex-col gap-y-[3px] justify-center items-center;
}
.console-timer {
  @apply flex items-center gap-x-[3px];
}
.console-timer p {
  @apply text-black mt-1 font-[dana];
}
.console-money {
  @apply flex items-center gap-x-[3px];
}
.console-money p {
  @apply font-[dana] font-bold text-[1.2rem];
}
.console-footer {
  @apply flex gap-x-[7px] items-center;
}
.active-color {
  background: rgba(29, 91, 121, 0.1);
}
.disable-color {
  background: rgba(222, 222, 222, 0.5);
}
</style>
