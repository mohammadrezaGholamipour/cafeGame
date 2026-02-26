<script setup lang="ts">
import localStorageService from "@/utils/local-storage-service";
import type { AccountResponse, register } from "@/types/index";
import AccountTab from "./components/account-tab.vue";
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
    .then((response: AccountResponse) => {
      localStorageService.setToken(response.access_token);
      router.push("/");
    })
    .catch((errors: any) => {
      pinia.handleNotification({
        ...pinia.state.notification,
        timer: 3000,
        name: "error",
        status: true,
        textHeader: "خطا",
        textMain: `${errors?.response?.data?.error[0]?.message || "ورودامکان پذیر نمیباشد"}`,
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
    .then(() => requestLogin({ email: data.email, password: data.password }))
    .catch((errors: any) => {
      pinia.handleNotification({
        ...pinia.state.notification,
        timer: 3000,
        name: "error",
        status: true,
        textHeader: "خطا",
        textMain: `${errors?.response?.data?.error[0]?.message || "خطای نامشخص"}`,
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
  @apply w-screen h-screen flex p-[20px] justify-center items-center;
}

.right {
  @apply flex flex-col h-full justify-center w-full gap-y-[20px] items-start overflow-x-auto sm:items-center;
}
</style>
