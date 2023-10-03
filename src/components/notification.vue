<script setup lang="ts">
import { ref, watch, nextTick } from "vue";
import { usePinia } from "@/store/pinia";
import type { Ref } from "vue";
//////////////////////////////////////
const notification: Ref<HTMLDivElement | null> = ref(null);
let timer: ReturnType<typeof setTimeout>;
const pinia = usePinia();
//////////////////////////////////
watch(
  () => pinia.state.notification.status,
  async (value) => {
    if (value) {
      await nextTick();
      notification.value?.classList.remove("disable");
      notification.value?.classList.add("active");
      handleCloseTimer();
    } else {
      clearTimeout(timer);
      notification.value?.classList.remove("active");
      notification.value?.classList.add("disable");
    }
  }
);
////////////////////////////////
const handleCloseTimer = () => {
  timer = setTimeout(() => {
    pinia.handleNotification({
      ...pinia.state.notification,
      status: false,
    });
  }, pinia.state.notification.timer);
};
</script>
<template>
  <div
    :class="[`parent-notification disable ${pinia.state.notification.name}`]"
    @click="
      pinia.handleNotification({
        ...pinia.state.notification,
        status: false,
      })
    "
    ref="notification"
  >
    <div>
      <p>{{ pinia.state.notification.textHeader }}</p>
      <p>{{ pinia.state.notification.textMain }}</p>
    </div>
    <img
      :src="`src/assets/image/notification/${pinia.state.notification.name}.svg`"
    />
  </div>
</template>
<style scoped>
.parent-notification {
  @apply flex fixed justify-between w-[300px] p-[20px] rounded-l-[12px] transition-all cursor-pointer z-[99999];
}
.parent-notification > div {
  @apply flex flex-col items-start gap-y-[4px];
}
.parent-notification > div p {
  @apply text-white font-[kalameh];
}
.parent-notification > div p:first-child {
  @apply text-[0.88rem] font-[600];
}
.parent-notification > div p:last-child {
  @apply text-[0.80rem];
}
.active {
  @apply translate-x-0;
}
.disable {
  @apply translate-x-[300px];
}
.success {
  background: linear-gradient(95deg, #32bb71 15.3%, #2a9d8f 113.45%);
  border: 1px solid #43d590;
}
.error {
  background: linear-gradient(95deg, #f6743e -6.96%, #d42525 108.25%);
  border: 1px solid #f0863a;
}
.warning {
  background: linear-gradient(92deg, #f8b806 -30.82%, #ff8c04 126.36%);
  border: 1px solid #ffdf8d;
}
.info {
  background: linear-gradient(94deg, #2d82b2 -6.52%, #329abb 108.61%);
  border: 1px solid #7bcfed;
}
</style>
