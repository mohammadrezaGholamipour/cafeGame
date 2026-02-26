<script setup lang="ts">
import localStorageService from "@/utils/local-storage-service";
import Exit from "./components/exit.vue";
import VoiceCommand from "./components/voiceCommand.vue";
import { ref } from "vue";
////////////////////////////////////
const dialogStatus = ref<boolean>(false);
//////////////////////////////////////
const handleDialogStatus = (status: boolean) => {
  if (status) {
    localStorageService.removeToken();
    window.location.href = "/account";
  }
  dialogStatus.value = false;
};
</script>
<template>
  <header class="parent-header">
    <VoiceCommand />
    <a href="/">
      <img width="100" src="@/assets/image/cafegame.png" />
    </a>
    <Exit @exit="dialogStatus = true" />
  </header>
  <Dialog
    @changeStatus="handleDialogStatus"
    :btnCancelText="'بازگشت'"
    :btnAcceptText="'تایید'"
    :headerText="'فاکتور'"
    :status="dialogStatus"
    :btnAccept="true"
    :btnCancel="true"
    :loading="false"
    :footer="true"
    :header="false"
    :width="300"
  >
    <p class="p-3 text-center text-lg font-bold ">از برنامه خارج میشوید؟</p>
  </Dialog>
</template>
<style scoped>
.parent-header {
  @apply flex w-full flex-wrap gap-3 justify-items-center justify-between items-center p-[10px] bg-[#1D5B79];
}
</style>
