<script setup lang="ts">
import dialogBox from "@/components/dialog-box.vue";
</script>
<template>
  <dialogBox
    @changeStatus="console.log($event)"
    :btnCancelText="'بازگشت'"
    :btnAcceptText="'تایید'"
    :headerText="'دیالوگ'"
    :btnCancel="true"
    :btnAccept="true"
    :status="false"
    :footer="true"
    :header="true"
    :width="300"
    >cafeGame</dialogBox
  >
</template>
