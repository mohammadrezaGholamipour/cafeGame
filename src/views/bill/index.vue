<script setup lang="ts">
import Table from "@/components/table/index.vue";
import loading from "@/components/loading.vue";
import tools from "./components/tools.vue";
import { usePinia } from "@/store/pinia";
import { computed, reactive } from "vue";
///////////////////////////////////////
const pinia = usePinia();
const state = reactive({
  loading: false,
  headerTable: ["ردیف", "شروع و پایان", "شماره دستگاه", "مبلغ کل"],
});
///////////////////////////////////////
const billData = computed(() => {
  if (Array.isArray(pinia.state.bill)) {
    return pinia.state.bill;
  }
});
//////////////////////////////////////////
</script>
<template>
  <div class="parent-bill-page">
    <!-- //////////////////////// -->
    <tools />
    <!-- //////////////////////// -->
    <transition-fade group class="w-full overflow-y-auto h-full px-[10px]">
      <!-- //////////////////////// -->
      <Table v-if="billData?.length" :header="state.headerTable">
        <template v-slot:Larg>
          <tr
            :class="{ '!bg-[#75ca71] text-white': !bill.endTime }"
            v-for="(bill, index) in billData"
            :key="bill.id"
          >
            <td>{{ index + 1 }}</td>
            <td>زمان</td>
            <td>{{ bill.systemName }}</td>
            <td>
              {{
                bill.finalCost ? bill.finalCost.toLocaleString() : "درحال اجرا"
              }}
            </td>
          </tr>
        </template>
        <template v-slot:small>
          <div
            :class="{ '!bg-[#75ca71] text-white': !bill.endTime }"
            v-for="(bill, index) in billData"
            class="small-table"
            :key="bill.id"
          >
            <div class="small-table-right">
              <div v-for="(header, index) in state.headerTable" :key="index">
                {{ header }} :
              </div>
            </div>
            <div class="small-table-left">
              <div>{{ index + 1 }}</div>
              <div>زمان</div>
              <div>{{ bill.systemId }}</div>
              <div>
                {{
                  bill.finalCost
                    ? bill.finalCost.toLocaleString()
                    : "درحال اجرا"
                }}
              </div>
            </div>
          </div>
        </template>
      </Table>
      <!-- //////////////////////// -->
      <img
        src="@/assets/image/noData.svg"
        class="w-full h-full"
        v-else-if="billData"
      />
      <!-- //////////////////////// -->
      <loading v-else />
      <!-- //////////////////////// -->
    </transition-fade>
    <!-- /////////////////////// -->
  </div>
</template>
<style scoped>
.parent-bill-page {
  @apply w-full h-full flex flex-col justify-start items-start gap-y-[10px];
}
</style>
