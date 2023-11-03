import localStorageService from "@/utils/local-storage-service";
import type {
  Notification,
  home,
  consoleTypeApi,
  bill,
  food,
  hourRate,
  billFood,
  alarmInLocalStorage,
} from "@/types/index";
import hourRateApi from "@/api/hourRate.js";
import consoleApi from "@/api/console.js";
import { reactive, watch } from "vue";
import foodApi from "@/api/food.js";
import billApi from "@/api/bill.js";
import { defineStore } from "pinia";
////////////////////////////////
export const usePinia = defineStore("pinia", () => {
  let sound = new Audio("/assets/alarm.wav");
  const state = reactive({
    notification: {
      textMain: "",
      textHeader: "",
      status: false,
      name: "success",
      timer: 2000,
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
  const requestGetFood = async (name?: string): Promise<void> => {
    const query = { ...(name && { name }) };
    try {
      const response: food[] = await foodApi.get(query);
      state.food = response;
    } catch {
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
      state.bill = response
        .map((bill) => ({
          ...bill,
          systemName: handleGetSystmeNameById(bill.systemId),
          foodCost: handleFoodCost(bill.billFoods),
          billFoods: handleBillFoods(bill.billFoods),
        }))
        .sort(sortBills);
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
        costFood: 0,
        status: false,
        loading: false,
        billFood: [],
        optionStatus: false,
        alarmStatus: false,
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
      for (let {
        hourRateId,
        startTime,
        systemId,
        id,
        billFoods,
      } of unclosedBills) {
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
            console.costFood = handleFoodCost(billFoods);
            console.timer.seconds = seconds;
            console.timer.minutes = minutes;
            console.timer.hours = hours;
            console.billFood = billFoods;
            console.billId = id;
            console.status = true;
            /////////////////////////////////
          }
        }
      }
    }
  };
  //////////////////////////////////
  const handleFoodCost = (billFoods: billFood[]): number => {
    let foodCost = 0;
    if (Array.isArray(state.food) && billFoods.length) {
      for (const foodBill of billFoods) {
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
  const handleBillFoods = (billFoods: billFood[]) => {
    let setFood = [] as billFood[];
    if (Array.isArray(state.food) && billFoods.length) {
      for (const foodBill of billFoods) {
        for (const food of state.food) {
          if (foodBill.foodId === food.id) {
            setFood.push({
              id: food.id,
              count: foodBill.count,
              foodId: foodBill.foodId,
              billId: foodBill.billId,
              cost: food.cost,
              name: food.name,
            });
            break;
          }
        }
      }
    }
    return setFood;
  };
  //////////////////////////
  const handleGetSystmeNameById = (systemId: number): string => {
    let consoleName: string | undefined = "";
    if (Array.isArray(state.console)) {
      consoleName = state.console.find((item) => item.id === systemId)?.name;
    }
    return consoleName ? consoleName : "";
  };
  //////////////////////////
  const sortBills = (a: bill, b: bill): number => {
    if (!a.endTime && !b.endTime) {
      return new Date(b.startTime).getTime() - new Date(a.startTime).getTime();
    }
    if (!a.endTime) {
      return -1;
    }
    if (!b.endTime) {
      return 1;
    }
    return new Date(b.endTime).getTime() - new Date(a.endTime).getTime();
  };
  //////////////////////////
  const handleConsoleTimer = (console: home): void => {
    let { hourRate, timer, consoleId } = console;
    //////////////////////////////////
    console.interval = setInterval(() => {
      timer.seconds++;
      if (timer.seconds === 60) {
        // ///////////////////
        timer.seconds = 0;
        timer.minutes++;
        /////////////////////
        const alarm: alarmInLocalStorage[] = localStorageService.getAlarm();
        const alarmSelected = alarm.find(
          (item) => item.consoleId === consoleId
        );
        if (alarmSelected) {
          const { hour, minute } = alarmSelected;
          const alarmMinute = Number(hour) * 60 + Number(minute);
          const timerMinute = Number(timer.hours) * 60 + Number(timer.minutes);
          if (timerMinute >= alarmMinute && !console.alarmStatus) {
            console.alarmStatus = true;
            handleAlarmSound();
          }
        }
        ///////////////////
      }
      if (timer.minutes === 60) {
        timer.minutes = 0;
        timer.hours++;
      }
      if (timer.hours > 0) {
        const minutesMoney = (hourRate / 60) * timer.minutes;
        console.costPlayed = Math.round(timer.hours * hourRate + minutesMoney);
      } else {
        console.costPlayed = Math.round(hourRate);
      }
      /////////////////////////////////
    }, 1000);
  };
  //////////////////////////
  const handleAlarmSound = () => {
    if (Array.isArray(state.home)) {
      const status = state.home.some((item) => item.alarmStatus);
      if (status) {
        if (sound.paused) sound.play();
      } else {
        sound.pause();
      }
    }
  };
  //////////////////////////
  return {
    handleNotification,
    requestGetHourRate,
    requestGetConsole,
    handleAlarmSound,
    requestGetFood,
    requestGetBill,
    handleHomeData,
    state,
  };
});
