import type { alarmInLocalStorage } from "@/types/index";
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
};
