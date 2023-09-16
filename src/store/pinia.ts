import type { Notification } from "@/types/index";
import { defineStore } from "pinia";
import { reactive } from "vue";
///////////////////////////////////
export const usePinia = defineStore("pinia", () => {
  const state = reactive({
    notification: {
      textMain: "",
      textHeader: "",
      status: false,
      name: "success",
      timer: 3000,
    } as Notification,
  });
  ////////////////////////////
  const handleNotification = (data: Notification): void => {
    state.notification = data;
  };
  return { state, handleNotification };
});
