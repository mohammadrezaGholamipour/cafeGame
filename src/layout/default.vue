<script setup lang="ts">
import Header from "@/components/header/index.vue";
import tokenService from "@/utils/token-service";
import { usePinia } from "@/store/pinia";
import accountApi from "@/api/account";
import { onMounted } from "vue";
/////////////////////////////////////////////////
const pinia = usePinia();
/////////////////////////////////////////////////
onMounted(() => {
  handleLogin();
});
/////////////////////////////////////////////////
const handleLogin = (): void => {
  const data = {
    email: "mrzgp2016@gmail.com",
    password: "scorpion2018",
  };
  accountApi
    .login(data)
    .then((response) => {
      tokenService.setToken(response.token);
    })
    .catch((error) => {
      console.log(error);
    });
};
const handleNotification = (): void => {
  pinia.handleNotification({
    ...pinia.state.notification,
    status: !pinia.state.notification.status,
  });
};
</script>
<template>
  <div class="parent-layout">
    <Header />
    <button @click="handleNotification" class="button bg-[#7CC078]">
      notificatin
    </button>
  </div>
</template>
<style scoped>
.parent-layout {
  @apply w-screen h-screen flex flex-col justify-start items-center bg-white min-w-[300px];
}
main {
  @apply w-full h-full;
}
</style>
