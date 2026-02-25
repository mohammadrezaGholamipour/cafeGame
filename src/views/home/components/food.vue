<script setup lang="ts">
import type { billFood, foodStore, food } from "@/types/index";
import Table from "@/components/table/index.vue";
import { onMounted, reactive, watch } from "vue";
import { usePinia } from "@/store/pinia";
////////////////////////////////////////
const props = defineProps<{ billFood: billFood[] | [] }>();
const emit = defineEmits<{
  foodSelected: [food: { food_id: number; count: number }[]];
}>();
////////////////////////////////////////
let timer: ReturnType<typeof setTimeout>;
const pinia = usePinia();
const state = reactive({
  headerTable: ["ردیف", "نام محصول", "تعداد"],
  foodList: [] as foodStore[],
  foodSelected: [] as { food_id: number; count: number }[],
  search: "",
});
//////////////////
onMounted(() => {
  if (Array.isArray(pinia.state.food)) {
    ///////////////////////////////
    state.foodList = pinia.state.food.map((food: food) => ({
      ...food,
      count: 0,
    }));
    props?.billFood?.forEach(({ food_id, count }) => {
      const foodList = state.foodList.find((food) => food.id === food_id);
      if (foodList) foodList.count = count;
      state.foodSelected.push({ food_id, count });
    });
  }
});
////////////////////////////////
const handleSetFoodData = () => {
  if (Array.isArray(pinia.state.food)) {
    state.foodList = pinia.state.food.map((food: food) => ({
      ...food,
      count: 0,
    }));
    state.foodSelected.forEach(({ food_id, count }) => {
      const foodList = state.foodList.find((food) => food.id === food_id);
      if (foodList) foodList.count = count;
    });
  }
};
/////////////////////////
watch(
  () => state.search,
  (value: string) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      pinia.requestGetFood(value);
    }, 1000);
  }
);
///////////////////////
watch(
  () => pinia.state.food,
  () => handleSetFoodData()
);
////////////////////////////////////
watch(
  () => state.foodSelected,
  () => {
    const food = state.foodSelected.filter(({ count }) => count);
    emit("foodSelected", food);
  },
  { deep: true }
);
////////////////////////////////////
const handleAddOrSubtract = (status: string, food: foodStore) => {
  /////////////////////////////////
  if (status === "add") food.count++;
  else if (food.count) food.count--;
  /////////////////////////////
  const foodSelected = state.foodSelected.find(
    (item) => item.food_id === food.id
  );
  if (foodSelected) foodSelected.count = food.count;
  else state.foodSelected.push({ food_id: food.id, count: food.count });
};
//////////////////////////////////////////
</script>
<template>
  <div class="parent-food">
    <input
      class="input !min-w-[200px] w-full bg-white"
      placeholder="دنبال چی هستی؟"
      v-model.trim="state.search"
      inputmode="search"
      type="text"
      autofocus
    />

    <transition-fade
      class="w-full overflow-hidden overflow-y-auto h-full"
      group
    >
      <!-- //////////////////////// -->
      <Table
        v-if="state.foodList.length"
        :header="state.headerTable"
        :largTable="true"
      >
        <template v-slot:Larg>
          <tr v-for="(food, index) in state.foodList" :key="food.id">
            <td class="w-[55px]">{{ index + 1 }}</td>
            <td>{{ food.name }}</td>
            <td>
              <div class="flex justify-between items-center gap-x-[10px]">
                <img
                  @click="handleAddOrSubtract('add', food)"
                  src="@/assets/image/home/add.svg"
                  class="cursor-pointer"
                />
                <p>{{ food.count }}</p>
                <img
                  @click="handleAddOrSubtract('subtract', food)"
                  src="@/assets/image/home/Low-off.svg"
                  class="cursor-pointer"
                />
              </div>
            </td>
          </tr>
        </template>
        <template v-slot:small>
          <div
            v-for="(food, index) in state.foodList"
            class="small-table"
            :key="food.id"
          >
            <div class="small-table-right">
              <div v-for="(header, index) in state.headerTable" :key="index">
                {{ header }} :
              </div>
            </div>
            <div class="small-table-left">
              <div>{{ index + 1 }}</div>
              <div>{{ food.name }}</div>
              <div class="flex items-center gap-x-[10px]">
                <img
                  @click="handleAddOrSubtract('add', food)"
                  src="@/assets/image/home/add.svg"
                  class="cursor-pointer"
                />
                <p>{{ food.count }}</p>
                <img
                  @click="handleAddOrSubtract('subtract', food)"
                  src="@/assets/image/home/Low-off.svg"
                  class="cursor-pointer"
                />
              </div>
            </div>
          </div>
        </template>
      </Table>
      <!-- //////////////////////// -->
      <img src="@/assets/image/noData.svg" class="w-full h-full" v-else />
      <!-- //////////////////////// -->
    </transition-fade>
  </div>
</template>
<style scoped>
.parent-food {
  @apply w-full transition-all h-[220px] overflow-hidden flex flex-col items-center justify-start gap-y-[10px];
}
</style>
