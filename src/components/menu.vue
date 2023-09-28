<script setup lang="ts">
import { usePinia } from "../store/pinia";
import { computed, reactive } from "vue";
import { useRoute } from "vue-router";
/////////////////////////////////////////
const pinia = usePinia();
const route = useRoute();
const state = reactive({
  menuList: [
    {
      id: 1,
      name: "دستگاه ها",
      icon: "src/assets/image/menu/console.svg",
      route: "console",
    },
    {
      id: 2,
      name: "بوفه",
      icon: "src/assets/image/menu/food.svg",
      route: "food",
    },
    {
      id: 3,
      name: "خانه",
      icon: "src/assets/image/menu/home.svg",
      route: "home",
    },
    {
      id: 4,
      name: "فاکتور ها",
      icon: "src/assets/image/menu/bill.svg",
      route: "bill",
    },
    {
      id: 5,
      name: "قیمت ها",
      icon: "src/assets/image/menu/money.svg",
      route: "money",
    },
  ],
});
/////////////////////////
const handleMenuClass = computed(() => {
  if (pinia.state.appWidth > 500) {
    return "mb-5 rounded-[5px]";
  } else {
    return "rounded-t-[10px]";
  }
});
</script>
<template>
  <div :class="['parent-menu', handleMenuClass]">
    <router-link
      :to="{ name: menu.route }"
      :class="[
        'menu-item',
        { 'menu-home': menu.name === 'خانه' },
        { 'menu-active': menu.route === route.name && menu.route !== 'home' },
      ]"
      v-for="menu in state.menuList"
      :key="menu.id"
    >
      <img :src="menu.icon" />
      <p v-if="menu.name !== 'خانه'">{{ menu.name }}</p>
    </router-link>
  </div>
</template>
<style scoped>
.parent-menu {
  @apply flex justify-between items-center w-[330px] bg-[#1D5B79] p-[10px] min-h-[74px];
}
.menu-item {
  @apply flex flex-col transition-all gap-y-[6px] justify-center items-center cursor-pointer;
}
.menu-item p {
  @apply text-white font-[kalameh] text-[0.75rem] whitespace-nowrap;
}
.menu-home {
  @apply p-[12px] rounded-full bg-[#EF6262] border-[4px] border-[#C0C0C0];
}
.menu-active {
  @apply scale-110;
}
</style>
