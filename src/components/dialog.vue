<script setup lang="ts">
import type { DialogProps } from "@/types/index";
import { ref, watch } from "vue";
////////////////////////////////
const emit = defineEmits<{ changeStatus: [status: boolean] }>();
const props = defineProps<DialogProps>();
/////////////////////////////////////////
const dialog = ref<HTMLDivElement | null>();
////////////////////////////
watch(
  () => props.status,
  (value) => {
    if (value) {
      const app = document.getElementById("app") as HTMLDivElement;
      if (dialog.value) app.insertBefore(dialog.value, app.firstChild);
    } else {
      setTimeout(() => {
        document.getElementsByClassName("dialog-back-ground")[0].remove();
      }, 500);
    }
  }
);
///////////////////////////////////////////
const handleDialogStatus = (status: boolean) => {
  emit("changeStatus", status);
};
</script>

<template>
    <div class="dialog-back-ground" v-show="props.status" ref="dialog">
      <div
        :style="{ width: `${props.width}px` }"
        class="dialog-card"
        id="dialog"
      >
        <!-- ///////////////////////// -->
        <div v-if="props.header" class="dialog-header">
          <p class="font-bold">{{ headerText }}</p>
          <img
            @click="handleDialogStatus(false)"
            src="@/assets/image/close.svg"
            class="cursor-pointer"
          />
        </div>
        <!-- ////////////////////////// -->
        <div v-if="props.header" class="line"></div>
        <!-- ////////////////////////// -->
        <slot />
        <!-- ////////////////////////// -->
        <div v-if="props.footer" class="line"></div>
        <!-- ////////////////////////// -->
        <div v-if="props.footer" class="dialog-footer">
          <button
            :disabled="props.loading"
            v-if="props.btnAccept"
            :class="[
              'button bg-[#7CC078] text-white',
              { 'bg-gray-400 !cursor-not-allowed': props.loading },
            ]"
            @click="handleDialogStatus(true)"
          >
            <span v-if="props.loading" class="btn-loader"></span>
            <p v-else>{{ props.btnAcceptText }}</p>
          </button>
          <button
            class="button bg-white text-black"
            @click="handleDialogStatus(false)"
            v-if="props.btnCancel"
          >
            {{ props.btnCancelText }}
          </button>
        </div>
        <!-- /////////////////////////// -->
      </div>
    </div>
</template>
<style scoped>
.dialog-back-ground {
  @apply backdrop-blur-sm;
  justify-content: center;
  align-items: center;
  position: absolute;
  padding: 0 10px;
  z-index: 10000;
  display: flex;
  height: 100vh;
  width: 100vw;
}
.dialog-card {
  @apply flex flex-col font-[dana] text-white bg-[#1d5b79] rounded-md p-[10px] gap-y-3 min-w-[300px];
}
.dialog-header {
  @apply flex w-full justify-between items-center;
}
.dialog-footer {
  @apply flex justify-center gap-x-[10px] items-center;
}
.line {
  width: 100%;
  height: 0px;
  border: 1px solid #c0c0c0;
  transform: rotate(-180deg);
  flex: none;
  align-self: stretch;
  flex-grow: 0;
}
</style>
