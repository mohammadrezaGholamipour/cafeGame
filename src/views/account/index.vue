<script setup lang="ts">
import { reactive } from "vue";
import AccountTab from "./components/account-tab.vue";
import Slider from "./components/slider.vue";
import Title from "./components/title.vue";
import { usePinia } from "@/store/pinia";
import Register from "./register.vue";
import Login from "./login.vue";
///////////////////////////////
const pinia = usePinia();
const state = reactive({
  tabSelected: "login",
});
</script>
<template>
  <div class="parent-account">
    <!-- ////////////////////// -->
    <div class="right">
      <Title />
      <AccountTab @changeTab="state.tabSelected = $event" />
      <transition-scale group>
        <Login v-if="state.tabSelected === 'login'" />
        <Register v-else />
      </transition-scale>
    </div>
    <!-- ///////////////////////// -->
    <Slider v-if="pinia.state.appWidth > 750" />
    <!-- ////////////////////////// -->
  </div>
</template>
<style scoped>
.parent-account {
  @apply w-screen h-screen  flex p-[20px] justify-center items-center;
}
.right {
  @apply flex flex-col h-full justify-center w-full gap-y-[20px] items-start overflow-x-auto sm:items-center;
}
</style>
