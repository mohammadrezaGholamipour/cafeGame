import type {
  alarmInLocalStorage,
  CustomMoneyInLocalStorage,
} from "@/types/index";
export default {
  ///////////////////////////
  getToken: (): string | null => {
    return window.localStorage.getItem("cafeGame");
  },
  setToken: (token: string): void => {
    window.localStorage.setItem("cafeGame", token);
  },
  removeToken: (): void => {
    window.localStorage.removeItem("cafeGame");
  },
  ///////////////////////////
  getAlarm: () => {
    const alarm = window.localStorage.getItem("alarm");
    if (alarm) {
      return JSON.parse(alarm);
    } else {
      return [];
    }
  },
  setAlarm: (alarm: alarmInLocalStorage[]): void => {
    window.localStorage.setItem("alarm", JSON.stringify(alarm));
  },
  ///////////////////////////
  getHighlight: () => {
    const highlight = window.localStorage.getItem("highlight");
    if (highlight) {
      return JSON.parse(highlight);
    } else {
      return [];
    }
  },
  setHighlight: (highlight: string[]): void => {
    window.localStorage.setItem("highlight", JSON.stringify(highlight));
  },
  ///////////////////////////
  getCustomMoney: () => {
    const money = window.localStorage.getItem("money");
    if (money) {
      return JSON.parse(money);
    } else {
      return [];
    }
  },
  setCustomMoney: (money: CustomMoneyInLocalStorage[]): void => {
    window.localStorage.setItem("money", JSON.stringify(money));
  },
};
