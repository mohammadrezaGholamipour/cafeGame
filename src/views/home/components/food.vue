<script setup lang="ts">
import type { billFood, foodStore } from "@/types/index";
import Table from "@/components/table/index.vue";
import { onMounted, reactive, watch } from "vue";
import { usePinia } from "@/store/pinia";
////////////////////////////
const props = defineProps<{ billFood: billFood[] | [] }>();
const emit = defineEmits<{
  foodSelected: [food: { foodId: number; count: number }[]];
}>();
///////////////////////////
let timer: ReturnType<typeof setTimeout>;
const pinia = usePinia();
const state = reactive({
  headerTable: ["ردیف", "نام محصول", "تعداد"],
  foodList: [] as foodStore[],
  foodSelected: [] as { foodId: number; count: number }[],
  search: "",
});
//////////////////
onMounted(() => {
  handleSetFoodData();
  props.billFood.forEach(({ foodId, count }) => {
    const food = state.foodList.find((food) => food.id === foodId);
    if (food) {
      food.count = count;
    }
  });
});
////////////////
const handleSetFoodData = () => {
  if (Array.isArray(pinia.state.food)) {
    state.foodList = pinia.state.food.map((food) => ({ ...food, count: 0 }));
  }
};
////////////////
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
///////////////////////
const handleAddAndSubtract = (status: string, food: foodStore) => {
  /////////////////////////////////
  if (status === "add") food.count++;
  else if (food.count) food.count--;
  /////////////////////////////
  const foodItem = state.foodSelected.find((item) => item.foodId === food.id);
  if (foodItem) foodItem.count = food.count;
  else state.foodSelected.push({ foodId: food.id, count: food.count });
  state.foodSelected = state.foodSelected.filter((item) => item.count);
  /////////////////////////////
  emit("foodSelected", state.foodSelected);
};
</script>
<template>
  <div class="parent-food">
    <input
      class="input !min-w-[200px] w-full bg-white"
      placeholder="دنبال چی هستی؟"
      v-model="state.search"
      type="text"
    />
    <transition-fade
      class="w-full overflow-hidden overflow-y-auto h-full"
      group
    >
      <!-- //////////////////////// -->
      <Table v-if="state.foodList.length" :header="state.headerTable">
        <template v-slot:Larg>
          <tr v-for="(food, index) in state.foodList" :key="food.id">
            <td>{{ index + 1 }}</td>
            <td>{{ food.name }}</td>
            <td>
              <div class="flex justify-between items-center">
                <img
                  @click="handleAddAndSubtract('add', food)"
                  src="@/assets/image/home/add.svg"
                  class="cursor-pointer"
                />
                <p>{{ food.count }}</p>
                <img
                  @click="handleAddAndSubtract('subtract', food)"
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
                  @click="handleAddAndSubtract('add', food)"
                  src="@/assets/image/home/add.svg"
                  class="cursor-pointer"
                />
                <p>{{ food.count }}</p>
                <img
                  @click="handleAddAndSubtract('subtract', food)"
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
