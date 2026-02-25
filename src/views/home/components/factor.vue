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
  customMoney: number;
}>();
const pinia = usePinia();
const state = reactive({
  headerTable: ["نام محصول", "قیمت واحد", "تعداد", "مبلغ کل"],
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
const totalMoney = computed(() => {
  const money =
    (billSelected.value?.foodCost || 0) +
    (consoleSelected.value?.costPlayed || 0) +
    (props.customMoney || 0);
  if (money > 0) {
    return `${money.toLocaleString()} تومان`;
  } else if (money < 0) {
    return `${money.toLocaleString().replace("-", "")} تومان طلب کار`;
  } else if (money === 0) {
    return "تسویه شده";
  }
});
////////////////////////////////////
</script>
<template>
  <div class="parent-bill-cost">
    <!-- ///////////////////////// -->
    <Table
      v-if="props.billFoods.length"
      :header="state.headerTable"
      :largTable="true"
    >
      <template v-slot:Larg>
        <tr v-for="food in props.billFoods" :key="food.id">
          <td>{{ food.name }}</td>
          <td>{{ food.price?.toLocaleString() }} تومان</td>
          <td>{{ food.count }}</td>
          <td>{{ (food.price * food.count).toLocaleString() }} تومان</td>
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
            <div>{{ food.price.toLocaleString() }} تومان</div>
            <div>{{ food.count }}</div>
            <div>{{ (food.price * food.count).toLocaleString() }} تومان</div>
          </div>
        </div>
      </template>
    </Table>
    <!-- ///////////////////////// -->
    <div class="flex flex-col w-full justify-start items-center rounded-md">
      <!-- ///////////////////////// -->
      <div v-if="props.billFoods.length" class="cost-total">
        <p>هزینه خوراکی</p>
        <p>
          {{ billSelected?.foodCost.toLocaleString() }}
          تومان
        </p>
      </div>
      <!-- ///////////////////////// -->
      <div
        class="w-full border border-solid border-slate-500"
        v-if="props.billFoods.length"
      ></div>
      <!-- ///////////////////////// -->
      <div v-if="props.customMoney" class="cost-total">
        <p>تغییر دستی قیمت</p>
        <p>
          {{
            props.customMoney > 0
              ? `${props.customMoney.toLocaleString()} افزایش`
              : `${props.customMoney.toLocaleString().replace("-", "")} کاهش`
          }}
        </p>
      </div>
      <!-- ///////////////////////// -->
      <div
        class="w-full border border-solid border-slate-500"
        v-if="props.customMoney"
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
      <div class="cost-total">
        <p>جمع کل</p>
        <p>
          {{ totalMoney }}
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
  background: linear-gradient(95deg, #f6743e -6.96%, #d42525 108.25%);
}

.cost-total:last-child {
  @apply text-[1rem] font-[kalameh] rounded-b-md text-white;
  background: linear-gradient(95deg, #32bb71 15.3%, #2a9d8f 113.45%);
}
.cost-total:first-child {
  @apply rounded-t-md;
}
</style>
