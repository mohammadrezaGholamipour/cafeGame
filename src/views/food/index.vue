<script setup lang="ts">
import NewOrEdit from "./components/new-or-edit.vue";
import Table from "@/components/table/index.vue";
import loading from "@/components/loading.vue";
import tools from "./components/tools.vue";
import type { food } from "@/types/index";
import { computed, reactive } from "vue";
import { usePinia } from "@/store/pinia";
import foodApi from "@/api/food";
/////////////////////////////////////////
const pinia = usePinia();
const state = reactive({
  loading: false,
  headerTable: ["ردیف", "نام محصول", "قیمت محصول", "عملیات"],
  newOrEdit: {
    status: false,
    food: {
      id: 0,
      name: "",
      cost: 0,
    },
  },
  removeFood: {
    status: false,
    food: {
      id: 0,
      name: "",
      cost: 0,
    },
  },
});
///////////////////////////////////////
const foodData = computed(() => {
  if (Array.isArray(pinia.state.food)) {
    return pinia.state.food;
  }
});
////////////////////////////////////
const requestUpdateFood = (food: food) => {
  state.loading = true;
  foodApi
    .update(food.id, food)
    .then(() => {
      pinia.requestGetFood(),
        pinia.handleNotification({
          ...pinia.state.notification,
          name: "success",
          status: true,
          textHeader: "موفق",
          textMain: "با موفقیت تغییر کرد",
        });
    })
    .catch(() => {
      pinia.handleNotification({
        ...pinia.state.notification,
        name: "error",
        status: true,
        textHeader: "خطا",
        textMain: "محصول مورد نظر تغییر نکرد",
      });
    })
    .finally(() => {
      state.loading = false;
    });
};
////////////////////////////////////
const requestNewFood = (food: food) => {
  state.loading = true;
  foodApi
    .new(food)
    .then(() => {
      pinia.requestGetFood(),
        pinia.handleNotification({
          ...pinia.state.notification,
          name: "success",
          status: true,
          textHeader: "موفق",
          textMain: "با موفقیت افزوده شد",
        });
    })
    .catch(() => {
      pinia.handleNotification({
        ...pinia.state.notification,
        name: "error",
        status: true,
        textHeader: "خطا",
        textMain: "محصول جدید اضافه نشد",
      });
    })
    .finally(() => {
      state.loading = false;
    });
};
////////////////////////////////////
const requestRemoveFood = () => {
  state.loading = true;
  foodApi
    .delete(state.removeFood.food.id)
    .then(() => {
      pinia.requestGetFood(),
        pinia.handleNotification({
          ...pinia.state.notification,
          name: "info",
          status: true,
          textHeader: "اعلان",
          textMain: "با موفقیت حذف شد",
        });
    })
    .catch(() => {
      pinia.handleNotification({
        ...pinia.state.notification,
        name: "error",
        status: true,
        textHeader: "خطا",
        textMain: "محصول مورد نظر حذف نشد",
      });
    })
    .finally(() => {
      state.loading = false;
    });
};
////////////////////////////////////
const handleSetFoodSelected = ({ id, cost, name }: food) => {
  state.newOrEdit.food.name = name;
  state.newOrEdit.food.cost = cost;
  state.newOrEdit.food.id = id;
  state.newOrEdit.status = true;
};
/////////////////////////////////////////
const handleCloseNewOrEditDialog = () => {
  state.newOrEdit.status = false;
  setTimeout(() => {
    state.newOrEdit.food.name = "";
    state.newOrEdit.food.cost = 0;
    state.newOrEdit.food.id = 0;
  }, 500);
};
/////////////////////////////////////////
const handleRemoveFoodDialog = (status: boolean) => {
  if (status) {
    requestRemoveFood();
  }
  state.removeFood.status = false;
  setTimeout(() => {
    state.removeFood.food.name = "";
    state.removeFood.food.cost = 0;
    state.removeFood.food.id = 0;
  }, 500);
};
/////////////////////////////////////////
</script>
<template>
  <div class="parent-food-page">
    <!-- //////////////////////// -->
    <tools
      @new="state.newOrEdit.status = true"
      @search="pinia.requestGetFood"
      :loading="state.loading"
    />
    <!-- //////////////////////// -->
    <transition-fade group class="w-full overflow-y-auto h-full px-[10px]">
      <!-- //////////////////////// -->
      <Table v-if="foodData?.length" :header="state.headerTable">
        <template v-slot:Larg>
          <tr v-for="(food, index) in foodData" :key="food.id">
            <td>{{ index + 1 }}</td>
            <td>{{ food.name }}</td>
            <td>{{ food.cost.toLocaleString() }} تومان</td>
            <td>
              <div class="flex items-center gap-x-[10px] justify-center">
                <img
                  src="@/assets/image/table/remove.svg"
                  @click="
                    (state.removeFood.food = { ...food }),
                      (state.removeFood.status = true)
                  "
                  class="cursor-pointer"
                />
                <img
                  @click="handleSetFoodSelected(food)"
                  src="@/assets/image/table/edit.svg"
                  class="cursor-pointer"
                />
              </div>
            </td>
          </tr>
        </template>
        <template v-slot:small>
          <div
            v-for="(food, index) in foodData"
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
              <div>{{ food.cost.toLocaleString() }} تومان</div>
              <div class="flex items-center gap-x-[10px] justify-center">
                <img
                  src="@/assets/image/table/remove.svg"
                  @click="
                    (state.removeFood.food = { ...food }),
                      (state.removeFood.status = true)
                  "
                  class="cursor-pointer"
                />
                <img
                  @click="handleSetFoodSelected(food)"
                  src="@/assets/image/table/edit.svg"
                  class="cursor-pointer"
                />
              </div>
            </div>
          </div>
        </template>
      </Table>
      <!-- //////////////////////// -->
      <img
        src="@/assets/image/noData.svg"
        class="w-full h-full"
        v-else-if="foodData"
      />
      <!-- //////////////////////// -->
      <loading v-else />
      <!-- //////////////////////// -->
    </transition-fade>
    <!-- /////////////////////// -->
    <NewOrEdit
      @close="handleCloseNewOrEditDialog"
      @update="requestUpdateFood"
      :loading="state.loading"
      :data="state.newOrEdit"
      @new="requestNewFood"
    />
    <!-- /////////////////////// -->
    <Dialog
      @changeStatus="handleRemoveFoodDialog"
      :status="state.removeFood.status"
      :btnCancelText="'بازگشت'"
      :btnAcceptText="'تایید'"
      :loading="false"
      :btnAccept="true"
      :btnCancel="true"
      :header="false"
      :footer="true"
      :width="300"
    >
      <div class="p-1">{{ state.removeFood.food.name }} حذف شود؟</div>
    </Dialog>
    <!-- /////////////////////// -->
  </div>
</template>
<style scoped>
.parent-food-page {
  @apply w-full h-full flex flex-col justify-start items-start gap-y-[10px];
}
</style>
