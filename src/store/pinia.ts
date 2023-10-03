import type { Notification } from "@/types/index";
import consoleApi from "@/api/console.js";
import moneyApi from "@/api/money.js";
import foodApi from "@/api/food.js";
import billApi from "@/api/bill.js";
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
    appWidth: 0,
    console: false as boolean | { status: boolean }[],
    money: false as boolean | [],
    food: false as boolean | [],
    bill: false as boolean | [],
    homePage: false,
  });
  ////////////////////////////
  const handleNotification = (data: Notification): void => {
    state.notification = data;
  };
  ////////////////////////////
  const requestGetConsole = async (): Promise<void | []> => {
    try {
      const response: [] = await consoleApi.get();
      state.console = response.map((item: object) => {
        return { ...item, status: false };
      });
    } catch (error) {
      handleNotification({
        ...state.notification,
        name: "error",
        status: true,
        textHeader: "خطا",
        textMain: "لیست دستگاه دریافت نشد",
      });
    }
  };
  ////////////////////////////////////
  const requestGetMoney = async (): Promise<void> => {
    try {
      const response = await moneyApi.get();
      state.money = response;
    } catch (error) {
      handleNotification({
        ...state.notification,
        name: "error",
        status: true,
        textHeader: "خطا",
        textMain: "لیست هزنیه بازی دریافت نشد",
      });
    }
  };
  ////////////////////////////////////
  const requestGetFood = async (): Promise<void> => {
    try {
      const response = await foodApi.get();
      state.food = response;
    } catch (error) {
      handleNotification({
        ...state.notification,
        name: "error",
        status: true,
        textHeader: "خطا",
        textMain: "لیست بوفه دریافت نشد",
      });
    }
  };
  //////////////////////////
  const requestGetBill = (): void => {
    billApi
      .get()
      .then((response: []) => {
        state.bill = response;
      })
      .catch(() => {
        handleNotification({
          ...state.notification,
          name: "error",
          status: true,
          textHeader: "خطا",
          textMain: "لیست فاکتور دریافت نشد",
        });
      });
  };
  //////////////////////////
  return {
    handleNotification,
    requestGetConsole,
    requestGetMoney,
    requestGetFood,
    requestGetBill,
    state,
  };
});
