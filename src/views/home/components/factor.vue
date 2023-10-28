<script setup lang="ts">
import type { bill, billFood, home } from "@/types/index";
import Table from "@/components/table/index.vue";
import { computed, reactive } from "vue";
import { usePinia } from "@/store/pinia";
////////////////////////////////////
const props = defineProps<{
  billId: number;
  billFoods: billFood[];
  consoleId: number;
}>();
const pinia = usePinia();
const state = reactive({
  headerTable: ["ردیف", "نام محصول", "قیمت واحد", "تعداد", "مبلغ کل"],
});
////////////////////////////////////
const billSelected = computed(() => {
  if (Array.isArray(pinia.state.bill)) {
    const billSelected: bill | undefined = pinia.state.bill.find(
      (item: bill) => item.id === props.billId
    );
    if (billSelected) return billSelected;
  }
});
////////////////////////////////////
const consoleSelected = computed(() => {
  if (Array.isArray(pinia.state.home)) {
    const consoleSelected: home | undefined = pinia.state.home.find(
      (item: home) => item.consoleId === props.consoleId
    );
    if (consoleSelected) return consoleSelected;
  }
});
////////////////////////////////////
</script>
<template>
  <div class="parent-bill-cost">
    <!-- ///////////////////////// -->
    <Table v-if="billSelected?.foodCost" :header="state.headerTable">
      <template v-slot:Larg>
        <tr v-for="(food, index) in props.billFoods" :key="food.id">
          <td>{{ index + 1 }}</td>
          <td>{{ food.name }}</td>
          <td>{{ food.cost.toLocaleString() }} تومان</td>
          <td>{{ food.count }}</td>
          <td>{{ (food.cost * food.count).toLocaleString() }} تومان</td>
        </tr>
      </template>
      <template v-slot:small>
        <div
          v-for="(food, index) in props.billFoods"
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
            <div>{{ food.count }}</div>
            <div>{{ (food.cost * food.count).toLocaleString() }} تومان</div>
          </div>
        </div>
      </template>
    </Table>
    <!-- ///////////////////////// -->
    <div
      class="flex flex-col w-full justify-start items-center bg-red-500 rounded-md"
    >
      <!-- ///////////////////////// -->
      <div v-if="billSelected?.foodCost" class="cost-total">
        <p>هزینه خوراکی</p>
        <p>
          {{ billSelected?.foodCost.toLocaleString() }}
          تومان
        </p>
      </div>
      <!-- ///////////////////////// -->
      <div
        class="w-full border border-dashed border-white"
        v-if="billSelected?.foodCost"
      ></div>
      <!-- ///////////////////////// -->
      <div class="cost-total">
        <p>هزنیه بازی شده</p>
        <p>
          {{ consoleSelected?.costPlayed.toLocaleString() }}
          تومان
        </p>
      </div>
      <!-- ///////////////////////// -->
      <div
        class="w-full border border-separate border-white"
        v-if="billSelected?.foodCost"
      ></div>
      <!-- ///////////////////////// -->
      <div
        class="cost-total bg-white text-black font-bold rounded-b-md"
        v-if="billSelected?.foodCost"
      >
        <p>جمع کل</p>
        <p>
          {{
            (
              billSelected?.foodCost + (consoleSelected?.costPlayed || 0)
            ).toLocaleString()
          }}
          تومان
        </p>
      </div>
      <!-- ///////////////////////// -->
    </div>
  </div>
</template>
<style scoped>
.parent-bill-cost {
  @apply w-full max-h-[220px] overflow-y-auto overflow-hidden flex gap-y-[10px] flex-col justify-start items-center;
  background-color: rgba(29, 91, 121, 0.1);
}
.cost-total {
  @apply flex w-full items-center justify-between p-[10px];
}
</style>
