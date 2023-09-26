import { createRouter, createWebHistory } from "vue-router";
import account from "@/views/account/index.vue";
import layout from "@/layout/default.vue";
import home from "@/views/home/index.vue";
/////////////////////////////
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "layout",
      component: layout,
      children: [
        {
          path: "/",
          name: "home",
          component: home,
        },
      ],
    },
    {
      path: "/account",
      name: "account",
      component: account,
    },
  ],
});

export default router;
