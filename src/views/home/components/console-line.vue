<script setup lang="ts"></script>
<template>
  <div class="console active-color">
    <div class="console-left">
      <div class="console-number">1</div>
      <div class="parent-money-and-timer">
        <div class="console-money">
          <p>100.000</p>
          <p class="!font-[400]">تومان</p>
        </div>
        <div class="console-timer">
          <p>2:37:45</p>
        </div>
      </div>
    </div>
    <div class="console-right">
      <button class="button bg-[#3ea6da] text-white">امکانات</button>
      <button class="button bg-[#EF6262] text-white">پایان</button>
    </div>
  </div>
</template>
<style scoped>
.console {
  @apply min-w-[300px] pl-[10px] w-[300px] rounded-[5px] min-h-[75px] h-[75px] overflow-hidden flex justify-between items-center;
  box-shadow: 0px 0px 5px 0px rgba(135, 135, 135, 0.25);
border-left: 3px solid var(--blue, #1D5B79);
}
.console-left {
  @apply flex h-full items-center gap-x-[10px];
}
.console-number {
  @apply flex bg-[#1D5B79] text-white min-w-[29px] h-full items-center justify-center;
}
.console-money {
  @apply flex items-center gap-x-[3px];
}
.console-money p {
  @apply font-[dana] font-bold text-[15px];
}
.console-timer {
  @apply flex items-center gap-x-[5px];
}
.console-timer p {
  @apply text-black  font-[dana];
}
.parent-money-and-timer {
  @apply flex h-full gap-y-[10px] flex-col justify-center items-center;
}
.console-right {
  @apply flex flex-col justify-center items-center h-full gap-y-[4px];
}
</style>
