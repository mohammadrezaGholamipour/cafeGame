<script setup lang="ts">
import { onMounted, reactive } from "vue";
////////////////////////
const state = reactive({
  slilderList: [
    { name: "sliderOne" },
    { name: "sliderTwo" },
    { name: "sliderThree" },
    { name: "sliderFour" },
    { name: "sliderFive" },
  ],
  sliderSelected: 0,
});
//////////////////
onMounted(() => {
  handleTimer();
});
////////////////
const handleTimer = () => {
  setInterval(() => {
    if (state.sliderSelected === 4) {
      state.sliderSelected = 0;
    } else {
      state.sliderSelected++;
    }
  }, 2000);
};
</script>
<template>
  <div
    :style="{
      backgroundImage: `url(src/assets/image/account/${
        state.slilderList[state.sliderSelected].name
      }.jpg)`,
      transition: 'background-image 0.5s ease-in-out',
    }"
    class="parent-slider"
  ></div>
</template>
<style scoped>
.parent-slider {
  @apply w-full h-full flex justify-center max-w-[1300px] items-center rounded-md bg-center bg-cover shadow-md;
}
</style>
