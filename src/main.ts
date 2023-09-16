import DropList from "@/components/drop-list.vue";
import { createPinia } from "pinia";
import "@/assets/css/index.css";
import { createApp } from "vue";
import router from "./router";
import App from "./App.vue";
///////////////////////////
const app = createApp(App);
app.component("DropList", DropList);
app.use(createPinia());
app.use(router);
app.mount("#app");
