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
  if (Array.isArray(pinia.state.openBill)) {
    const billSelected: bill | undefined = pinia.state.openBill.find(
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
    <Table :header="state.headerTable">
      <template v-slot:Larg>
        <tr v-for="(food, index) in props.billFoods" :key="food.id">
          <td>{{ index + 1 }}</td>
          <td>{{ food.name }}</td>
          <td>{{ food.cost?.toLocaleString() }} تومان</td>
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
    <div class="flex flex-col w-full justify-start items-center rounded-md">
      <!-- ///////////////////////// -->
      <div class="cost-total rounded-t-md">
        <p>هزینه خوراکی</p>
        <p>
          {{ billSelected?.foodCost.toLocaleString() }}
          تومان
        </p>
      </div>
      <!-- ///////////////////////// -->
      <div class="w-full border border-solid border-slate-500"></div>
      <!-- ///////////////////////// -->
      <div class="cost-total">
        <p>هزنیه بازی شده</p>
        <p>
          {{ consoleSelected?.costPlayed.toLocaleString() }}
          تومان
        </p>
      </div>
      <!-- ///////////////////////// -->
      <div class="cost-total">
        <p>جمع کل</p>
        <p>
          {{
            (
              (billSelected?.foodCost || 0) + (consoleSelected?.costPlayed || 0)
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
  background: linear-gradient(92deg, #f8b806 -30.82%, #ff8c04 126.36%);
}

.cost-total:nth-child(4) {
  @apply font-bold rounded-b-md text-white;
  background: linear-gradient(95deg, #32bb71 15.3%, #2a9d8f 113.45%);
}
</style>
