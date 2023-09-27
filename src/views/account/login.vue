<script setup lang="ts">
import AccountTab from "./components/account-tab.vue";
import Title from "./components/title.vue";
</script>
<template>
  <div class="parent-login">
    <Title />
    <AccountTab />
  </div>
</template>
<style scoped>
.parent-login {
  @apply flex flex-col justify-start items-center;
}
</style>
