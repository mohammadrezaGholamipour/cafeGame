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
  CustomMoneyInLocalStorage,
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
    allBill: false as boolean | bill[],
    openBill: false as boolean | bill[],
    home: false as boolean | home[],
    displayMood: 2 as number,
  });
  ////////////////////////////
  watch(
    () => state.openBill,
    () => handleHomeData(),
  );
  ////////////////////////////
  const handleChangeDisplayMood = (displayMood: number) => {
    localStorageService.setDisplayMood(displayMood);
    state.displayMood = displayMood;
  };
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
      state.hourRate = response.map(({ id, price }) => ({ id, name: price }));
      handleHomeData();
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
      state.food = response.map((item: any) => ({
        id: item.id,
        name: item.name,
        cost: item.price,
      }));
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
  const requestGetAllBill = async (
    startDate?: string,
    endDate?: string,
  ): Promise<void> => {
    const query = {
      ...(startDate && { startDate }),
      ...(endDate && { endDate }),
    };
    try {
      const response: bill[] = await billApi.get(query);
      state.allBill = response
        .map((bill) => ({
          ...bill,
          foodCost: handleFoodCostForAllBill(bill.bill_foods),
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
  const requestGetOpenBill = async (): Promise<void> => {
    try {
      const response: bill[] = await billApi.open();
      state.openBill = response.map((bill) => ({
        ...bill,
        foodCost: handleFoodCostForOpenBill(bill.bill_foods),
      }));
    } catch (error) {
      handleNotification({
        ...state.notification,
        name: "error",
        status: true,
        textHeader: "خطا",
        textMain: "لیست فاکتور های باز دریافت نشد",
      });
    }
  };
  //////////////////////////////////
  const handleHomeData = () => {
    if (
      Array.isArray(state.console) &&
      Array.isArray(state.openBill) &&
      Array.isArray(state.hourRate)
    ) {
      state.home = state.console.map(({ id: consoleId, name, is_deleted }) => ({
        timer: { hours: 0, minutes: 0, seconds: 0 },
        dropListStatus: false,
        hourRate: 0,
        interval: 0,
        costPlayed: 0,
        costFood: 0,
        status: false,
        loading: false,
        bill_foods: [],
        optionStatus: false,
        customMoney: 0,
        alarmStatus: false,
        billId: 0,
        consoleId,
        name,
        isDeleted: is_deleted,
      }));
      ////////////////////////////////////////////////////////////////
      for (let {
        unit_price_amount,
        start_time,
        console_id,
        id,
        bill_foods,
        foodCost,
      } of state.openBill) {
        for (let console of state.home) {
          if (console_id === console.consoleId && !console.interval) {
            const hourRateSelected = state.hourRate.find(
              (item) => item.name === unit_price_amount,
            );
            console.hourRate = hourRateSelected?.name
              ? hourRateSelected.name
              : 0;
            ////////////////////////////////////////
            const money: CustomMoneyInLocalStorage[] =
              localStorageService.getCustomMoney();
            const moneySelected = money.find(
              (item) => item.consoleId === console.consoleId,
            );
            if (moneySelected) console.customMoney = moneySelected.money;
            ////////////////////////////////////////
            handleConsoleTimer(console);
            const start = new Date(start_time);

            const nowUTC = new Date();

            const tehranOffsetMs = 3.5 * 60 * 60 * 1000;

            const startTehran = new Date(start.getTime() + tehranOffsetMs);

            const nowTehran = new Date(nowUTC.getTime());

            let delta = Math.floor(
              (nowTehran.getTime() - startTehran.getTime()) / 1000,
            );
            const days = Math.floor(delta / 86400);
            delta -= days * 86400;
            const hours = Math.floor(delta / 3600);
            delta -= hours * 3600;
            const minutes = Math.floor(delta / 60);
            delta -= minutes * 60;
            const seconds = delta;
            ////////////////////////
            console.costFood = foodCost;
            console.timer.seconds = seconds;
            console.timer.minutes = minutes;
            console.timer.hours = hours;
            console.bill_foods = bill_foods;
            console.billId = id;
            console.status = true;
            /////////////////////////////////
          }
        }
      }
    }
  };
  //////////////////////////////////
  const handleFoodCostForOpenBill = (billFoods: billFood[] | []): number => {
    let foodCost = 0;
    if (Array.isArray(state.food) && billFoods.length) {
      for (const foodBill of billFoods) {
        for (const food of state.food) {
          if (foodBill.food_id === food.id) {
            foodBill.name = food.name;
            foodBill.price = food.cost;
            foodCost += foodBill.count * food.cost;
            break;
          }
        }
      }
    }
    return foodCost;
  };
  //////////////////////////
  const handleFoodCostForAllBill = (billFoods: billFood[] | []): number => {
    let foodCost = 0;
    if (billFoods.length) {
      for (const foodBill of billFoods) {
        foodCost += foodBill.count * foodBill.price;
      }
    }
    return foodCost;
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
    if (!a.end_time && !b.end_time) {
      return (
        new Date(b.start_time).getTime() - new Date(a.start_time).getTime()
      );
    }
    if (!a.end_time) {
      return -1;
    }
    if (!b.end_time) {
      return 1;
    }
    return new Date(b.end_time).getTime() - new Date(a.end_time).getTime();
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
          (item) => item.consoleId === consoleId,
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
        console.costPlayed =
          Math.ceil((timer.hours * hourRate + minutesMoney) / 1000) * 1000;
      } else {
        console.costPlayed = hourRate;
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
    handleChangeDisplayMood,
    handleNotification,
    requestGetOpenBill,
    requestGetHourRate,
    requestGetConsole,
    requestGetAllBill,
    handleAlarmSound,
    requestGetFood,
    handleHomeData,
    state,
  };
});
