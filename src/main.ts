import VueTransitions from "@morev/vue-transitions";
import DropList from "@/components/drop-list.vue";
import Dialog from "@/components/dialog.vue";
import "@/utils/convert-persian-number";
import "@morev/vue-transitions/styles";
import { createPinia } from "pinia";
import "@/assets/css/index.css";
import { createApp } from "vue";
import router from "./router";
import App from "./App.vue";
///////////////////////////
const app = createApp(App);
app.component("DropList", DropList);
app.component("Dialog", Dialog);
app.use(VueTransitions);
app.use(createPinia());
app.use(router);
app.mount("#app");
