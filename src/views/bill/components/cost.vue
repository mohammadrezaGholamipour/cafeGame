<script setup lang="ts">
import Table from "@/components/table/index.vue";
import type { bill } from "@/types/index";
import { reactive } from "vue";
////////////////////////////////////
const props = defineProps<{ bill: bill }>();
const state = reactive({
  headerTable: ["ردیف", "نام محصول", "قیمت واحد", "تعداد", "مبلغ کل"],
});
</script>
<template>
  <div class="parent-bill-cost">
    <!-- ///////////////////////// -->
    <Table :header="state.headerTable">
      <template v-slot:Larg>
        <tr v-for="(food, index) in props.bill.billFoods" :key="food.id">
          <td>{{ index + 1 }}</td>
          <td>{{ food.name }}</td>
          <td>{{ food.cost.toLocaleString() }} تومان</td>
          <td>{{ food.count }}</td>
          <td>{{ (food.cost * food.count).toLocaleString() }} تومان</td>
        </tr>
      </template>
      <template v-slot:small>
        <div
          v-for="(food, index) in props.bill.billFoods"
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
    <div class="cost-totla-and-played mt-[10px]">
      <p>هزنیه بازی شده</p>
      <p>
        {{ (props.bill.finalCost - props.bill.foodCost).toLocaleString() }}
        تومان
      </p>
    </div>
    <!-- ///////////////////////// -->
    <div class="cost-totla-and-played bg-red-500 rounded-md">
      <p>هزینه کل</p>
      <p>
        {{ props.bill.finalCost.toLocaleString() }}
        تومان
      </p>
    </div>
    <!-- ///////////////////////// -->
  </div>
</template>
<style scoped>
.parent-bill-cost {
  @apply w-full max-h-[220px] overflow-y-auto overflow-hidden flex flex-col justify-start items-center;
  background-color: rgba(29, 91, 121, 0.1);
}
.cost-totla-and-played {
  @apply flex w-full items-center justify-between p-[10px];
}
</style>
