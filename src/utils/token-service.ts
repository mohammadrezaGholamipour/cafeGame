export default {
  getToken: (): string | null => {
    return window.localStorage.getItem("cafeGame");
  },
  setToken: (token: string): void => {
    window.localStorage.setItem("cafeGame", token);
  },
  removeToken: (): void => {
    window.localStorage.removeItem("cafeGame");
  },
};
