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
  <transition name="fade-scale">
    <div class="dialog-back-ground" v-show="props.status" ref="dialog">
      <div :style="{ width: `${props.width}px` }" class="dialog-card">
        <!-- ///////////////////////// -->
        <div v-if="props.header" class="dialog-header">
          <p class="font-bold">{{ headerText }}</p>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            @click="handleDialogStatus(false)"
            viewBox="0 0 20 20"
            height="20"
            fill="none"
            width="20"
          >
            <path
              d="M10 0C4.4898 0 0 4.4898 0 10C0 15.5102 4.4898 20 10 20C15.5102 20 20 15.5102 20 10C20 4.4898 15.5102 0 10 0ZM12.551 11.5306C12.8571 11.8367 12.8571 12.3469 12.551 12.6531C12.3469 12.7551 12.2449 12.8571 12.0408 12.8571C11.8367 12.8571 11.6327 12.7551 11.5306 12.6531L10 11.1225L8.46939 12.6531C8.16327 12.9592 7.65306 12.9592 7.34694 12.6531C7.04082 12.3469 7.04082 11.8367 7.34694 11.5306L8.87755 10L7.34694 8.46939C7.04082 8.16327 7.04082 7.65306 7.34694 7.34694C7.65306 7.04082 8.16327 7.04082 8.46939 7.34694L10 8.87755L11.5306 7.34694C11.8367 7.04082 12.3469 7.04082 12.6531 7.34694C12.9592 7.65306 12.9592 8.16327 12.6531 8.46939L11.1225 10L12.551 11.5306Z"
              fill="#EF6262"
            />
          </svg>
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
              'button bg-[#75ca71] text-white',
              { 'bg-gray-400 !cursor-not-allowed': props.loading },
            ]"
            @click="handleDialogStatus(true)"
          >
            <transition-fade class="flex" group>
              <span v-if="props.loading" class="btn-loader"></span>
              <p v-else>{{ props.btnAcceptText }}</p>
            </transition-fade>
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
  </transition>
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
  @apply flex flex-col font-[dana] text-white bg-[#1d5b79] rounded-md shadow-lg p-[10px] gap-y-3 min-w-[300px];
}
.dialog-header {
  @apply flex w-full justify-between items-center;
}
.dialog-footer {
  @apply flex justify-end gap-x-[10px] items-center;
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
.fade-scale-enter-active,
.fade-scale-leave-active {
  transition: opacity 0.5s, transform 0.5s;
}

.fade-scale-enter-from,
.fade-scale-leave-to {
  transition: opacity 0.5s, transform 0.5s;
  transform: scale(0.8);
  opacity: 0;
}
</style>
