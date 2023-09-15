<script setup lang="ts">
import Notification from "@/components/notification.vue";
import Header from "@/components/header/index.vue";
import tokenService from "@/utils/token-service";
import accountApi from "@/api/account";
import { onMounted } from "vue";
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
</script>
<template>
  <div class="parent-layout">
    <Header />
    <main>
      <Notification />
    </main>
  </div>
</template>
<style scoped>
.parent-layout {
  @apply w-screen h-screen flex flex-col justify-start items-center bg-white min-w-[300px];
}
</style>
