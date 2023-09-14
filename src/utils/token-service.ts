export default {
  getToken: () => {
    return window.localStorage.getItem("cafeGame");
  },
  setToken: (token: string) => {
    window.localStorage.setItem("cafeGame", token);
  },
  removeToken: () => {
    window.localStorage.removeItem("tokenWebApp");
  },
};
