<script setup lang="ts">
import type { LoginResponse, register } from "@/types/index";
import AccountTab from "./components/account-tab.vue";
import tokenService from "@/utils/token-service";
import Slider from "./components/slider.vue";
import Title from "./components/title.vue";
import AccountApi from "@/api/account.js";
import { usePinia } from "@/store/pinia";
import { useRouter } from "vue-router";
import Register from "./register.vue";
import Login from "./login.vue";
import { reactive } from "vue";
///////////////////////////////
const router = useRouter();
const pinia = usePinia();
const state = reactive({
  requestLoading: false,
  tabSelected: "login",
});
/////////////////////////////
const requestLogin = (data: object): void => {
  state.requestLoading = true;
  AccountApi.login(data)
    .then((response: LoginResponse) => {
      tokenService.setToken(response.token);
      router.push("/");
    })
    .catch(() => {
      pinia.handleNotification({
        ...pinia.state.notification,
        name: "error",
        status: true,
        textHeader: "خطا",
        textMain: "مجوز ورود ندارید",
      });
    })
    .finally(() => {
      state.requestLoading = false;
    });
};
/////////////////////////////
const requestRegister = (data: register): void => {
  state.requestLoading = true;
  AccountApi.register(data)
    .then((response: object) => {
      console.log(response);
    })
    .catch(() => {
      pinia.handleNotification({
        ...pinia.state.notification,
        name: "error",
        status: true,
        textHeader: "خطا",
        textMain: "ثبت نام انجام نشد",
      });
    })
    .finally(() => {
      state.requestLoading = false;
    });
};
</script>
<template>
  <div class="parent-account">
    <!-- ////////////////////// -->
    <div class="right">
      <Title />
      <AccountTab @changeTab="state.tabSelected = $event" />
      <transition-scale group>
        <Login
          v-if="state.tabSelected === 'login'"
          :loading="state.requestLoading"
          @login="requestLogin"
        />
        <Register
          :loading="state.requestLoading"
          @register="requestRegister"
          v-else
        />
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
