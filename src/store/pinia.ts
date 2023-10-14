import type {
  Notification,
  home,
  consoleTypeApi,
  bill,
  food,
  hourRate,
} from "@/types/index";
import hourRateApi from "@/api/hourRate.js";
import consoleApi from "@/api/console.js";
import { reactive, watch } from "vue";
import foodApi from "@/api/food.js";
import billApi from "@/api/bill.js";
import { defineStore } from "pinia";
////////////////////////////////
export const usePinia = defineStore("pinia", () => {
  const state = reactive({
    notification: {
      textMain: "",
      textHeader: "",
      status: false,
      name: "success",
      timer: 3000,
    } as Notification,
    appWidth: 1366,
    console: false as boolean | consoleTypeApi[],
    hourRate: false as boolean | hourRate[],
    food: false as boolean | food[],
    bill: false as boolean | bill[],
    home: false as boolean | home[],
  });
  ////////////////////////////
  watch(
    () => state.bill,
    () => handleHomeData()
  );
  ////////////////////////////
  const handleNotification = (data: Notification): void => {
    state.notification = data;
  };
  ////////////////////////////
  const requestGetConsole = async (): Promise<void | []> => {
    try {
      const response: consoleTypeApi[] = await consoleApi.get();
      state.console = response;
      handleHomeData();
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
  ///////////////////////////////////////////////////
  const requestGetHourRate = async (): Promise<void> => {
    try {
      const response: [] = await hourRateApi.get();
      state.hourRate = response.map(({ id, rate }) => ({ id, name: rate }));
    } catch (error) {
      handleNotification({
        ...state.notification,
        name: "error",
        status: true,
        textHeader: "خطا",
        textMain: "لیست هزینه بازی دریافت نشد",
      });
    }
  };
  ////////////////////////////////////
  const requestGetFood = async (): Promise<void> => {
    try {
      const response: food[] = await foodApi.get();
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
  //////////////////////////////////////////////////
  const requestGetBill = async (): Promise<void> => {
    try {
      const response: bill[] = await billApi.get();
      state.bill = response.map((bill) => ({
        ...bill,
        foodCost: calculateFoodCost(bill),
      }));
    } catch (error) {
      handleNotification({
        ...state.notification,
        name: "error",
        status: true,
        textHeader: "خطا",
        textMain: "لیست فاکتور دریافت نشد",
      });
    }
  };
  //////////////////////////////////
  const handleHomeData = async () => {
    if (
      Array.isArray(state.console) &&
      Array.isArray(state.bill) &&
      Array.isArray(state.hourRate)
    ) {
      state.home = state.console.map(({ id: consoleId, name }) => ({
        timer: { hours: 0, minutes: 0, seconds: 0 },
        dropListStatus: false,
        hourRate: 0,
        interval: 0,
        costPlayed: 0,
        status: false,
        loading: false,
        billId: 0,
        consoleId,
        name,
      }));
      ////////////////////////////////////////////////////////////////
      const uniqueSystemIds = new Set();
      const unclosedBills = state.bill.filter(
        (item) =>
          !item.endTime &&
          !uniqueSystemIds.has(item.systemId) &&
          uniqueSystemIds.add(item.systemId)
      );
      ////////////////////////////////////////////////////////////////
      for (let { hourRateId, startTime, systemId, id } of unclosedBills) {
        for (let console of state.home) {
          if (systemId === console.consoleId && !console.interval) {
            const hourRateSelected = state.hourRate.find(
              (item) => item.id === hourRateId
            );
            console.hourRate = hourRateSelected?.name
              ? hourRateSelected?.name
              : 0;
            ////////////////////////////////////////
            handleConsoleTimer(console);
            let delta =
              Math.abs(new Date().getTime() - new Date(startTime).getTime()) /
              1000;
            let days = Math.floor(delta / 86400);
            delta -= days * 86400;
            let hours = Math.floor(delta / 3600) % 24;
            delta -= hours * 3600;
            let minutes = Math.floor(delta / 60) % 60;
            delta -= minutes * 60;
            let seconds = Math.floor(delta % 60);
            ////////////////////////
            console.timer.seconds = seconds;
            console.timer.minutes = minutes;
            console.timer.hours = hours;
            console.billId = id;
            console.status = true;
            /////////////////////////////////
          }
        }
      }
    }
  };
  //////////////////////////////////
  const calculateFoodCost = (bill: bill): number => {
    let foodCost = 0;
    if (Array.isArray(state.food) && bill.billFoods.length) {
      for (const foodBill of bill.billFoods) {
        for (const food of state.food) {
          if (foodBill.foodId === food.id) {
            foodCost += foodBill.count * food.cost;
            break;
          }
        }
      }
    }
    return foodCost;
  };

  //////////////////////////
  const handleConsoleTimer = (console: home): void => {
    let { hourRate, timer } = console;
    console.interval = setInterval(() => {
      const minutesMoney = (hourRate / 60) * timer.minutes;
      timer.seconds++;
      if (timer.seconds == 60) {
        timer.seconds = 0;
        timer.minutes++;
      }
      if (timer.minutes == 60) {
        timer.minutes = 0;
        timer.hours++;
      }
      if (timer.hours > 0) {
        console.costPlayed = Math.round(timer.hours * hourRate + minutesMoney);
      } else {
        console.costPlayed = Math.round(hourRate);
      }
    }, 1000);
  };
  //////////////////////////
  return {
    handleNotification,
    requestGetHourRate,
    requestGetConsole,
    requestGetFood,
    requestGetBill,
    handleHomeData,
    state,
  };
});
