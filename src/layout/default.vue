<script setup lang="ts">
import Header from "@/components/header/index.vue";
import tokenService from "@/utils/token-service";
import accountApi from "@/api/account";
/////////////////////////////////////////////////
const handleAcceptLogin = () => {
  const data = {
    email: "mrzgp2016@gmail.com",
    password: "scorpion2018",
  };
  accountApi
    .login(data)
    .then((response) => {
      tokenService.setToken(response.token);
    })
    .catch((error: object) => {
      console.log(error);
    });
};
</script>
<template>
  <div class="parent-layout">
    <Header />
  </div>
</template>
<style scoped>
.parent-layout {
  @apply w-screen h-screen flex flex-col justify-start items-center bg-white;
}
</style>
