import { createRouter, createWebHistory } from "vue-router";
import layout from "@/layout/default.vue";
import home from "@/views/home.vue";
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
  ],
});

export default router;
