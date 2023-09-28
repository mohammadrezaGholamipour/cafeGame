import { createRouter, createWebHistory } from "vue-router";
import account from "@/views/account/index.vue";
import console from "@/views/console/index.vue";
import notFound from "@/views/not-found.vue";
import money from "@/views/money/index.vue";
import bill from "@/views/bill/index.vue";
import food from "@/views/food/index.vue";
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
        {
          path: "/money",
          name: "money",
          component: money,
        },
        {
          path: "/food",
          name: "food",
          component: food,
        },
        {
          path: "/console",
          name: "console",
          component: console,
        },
        {
          path: "/bill",
          name: "bill",
          component: bill,
        },
      ],
    },
    {
      path: "/account",
      name: "account",
      component: account,
    },
    {
      path: "/:catchAll(.*)",
      name: "notFound",
      component: notFound,
    },
  ],
});

export default router;
