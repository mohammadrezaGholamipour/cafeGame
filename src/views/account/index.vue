<script setup lang="ts">
import accountTab from "./components/account-tab.vue";
import slider from "./components/slider.vue";
import Title from "./components/title.vue";
import login from "./login.vue";
</script>
<template>
  <div class="parent-account">
    <!-- ////////////////////// -->
    <div class="right">
      <Title />
      <accountTab />
      <login />
    </div>
    <!-- ///////////////////////// -->
    <slider />
    <!-- ////////////////////////// -->
  </div>
</template>
<style scoped>
.parent-account {
  @apply w-screen h-screen flex p-[20px] justify-center items-center;
}
.right {
  @apply flex flex-col h-full justify-center w-full gap-y-[20px] items-center;
}
</style>
