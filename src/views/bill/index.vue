<script setup lang="ts">
import Table from "@/components/table/index.vue";
import loading from "@/components/loading.vue";
import tools from "./components/tools.vue";
import type { bill } from "@/types/index";
import { usePinia } from "@/store/pinia";
import { computed, reactive } from "vue";
import cost from "./components/cost.vue";
import Time from "./components/time.vue";
///////////////////////////////////////
const pinia = usePinia();
const state = reactive({
  headerTable: ["ردیف", "شروع و پایان", "شماره دستگاه", "مبلغ کل"],
  dialog: {
    status: false,
    name: "",
    billSelected: {} as bill,
  },
});
///////////////////////////////////////
const billData = computed(() => {
  if (Array.isArray(pinia.state.bill)) {
    return pinia.state.bill;
  }
});
//////////////////////////////////////////
const handleDialog = (bill: bill, name: string) => {
  state.dialog.billSelected = bill;
  state.dialog.name = name;
  state.dialog.status = true;
};
//////////////////////////////////////////
const handleDialogStatus = (status: boolean) => {
  state.dialog.status = false;
};
//////////////////////////////////////////
const handleDate = (dateString: Date) => {
  const date = new Date(dateString);
  const today = new Date();
  const timeDiff = today - date;
  const oneDay = 24 * 60 * 60 * 1000;
  ///////////////////////////////////
  if (timeDiff < oneDay) {
    return "امروز";
  } else if (timeDiff < oneDay * 2) {
    return "دیروز";
  } else if (timeDiff < oneDay * 3) {
    return "دو روز پیش";
  } else {
    return date.toLocaleDateString("fa-IR", {
      year: "numeric",
      month: "numeric",
      day: "numeric",
      calendar: "persian",
    });
  }
};
//////////////////////////////////////////
</script>
<template>
  <div class="parent-bill-page">
    <!-- //////////////////////// -->
    <tools :loading="false" />
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
            <td>
              <button
                class="button mx-auto bg-[#3ea6da] text-white"
                @click="handleDialog(bill, 'time')"
              >
                {{ bill.endTime ? handleDate(bill.endTime) : "درحال اجرا" }}
              </button>
            </td>
            <td>{{ bill.systemName }}</td>
            <td>
              <div class="flex justify-center">
                <button
                  v-if="bill.finalCost && bill.billFoods.length"
                  class="button bg-[#3ea6da] text-white"
                  @click="handleDialog(bill, 'cost')"
                >
                  نمایش
                </button>
                <p v-if="bill.finalCost && !bill.billFoods.length">
                  {{ bill.finalCost.toLocaleString() }}
                </p>
                <p v-if="!bill.finalCost">درحال اجرا</p>
              </div>
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
              <div>
                <button
                  class="button mx-auto bg-[#3ea6da] text-white"
                  @click="handleDialog(bill, 'time')"
                >
                  {{ bill.endTime ? handleDate(bill.endTime) : "درحال اجرا" }}
                </button>
              </div>
              <div>{{ bill.systemId }}</div>
              <div>
                <button
                  v-if="bill.finalCost && bill.billFoods.length"
                  class="button bg-[#3ea6da] text-white"
                  @click="handleDialog(bill, 'cost')"
                >
                  نمایش
                </button>
                <p v-if="bill.finalCost && !bill.billFoods.length">
                  {{ bill.finalCost.toLocaleString() }}
                </p>
                <p v-if="!bill.finalCost">درحال اجرا</p>
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
    <Dialog
      @changeStatus="handleDialogStatus"
      :status="state.dialog.status"
      :btnCancelText="'بازگشت'"
      :btnAcceptText="'تایید'"
      :headerText="'فاکتور'"
      :btnAccept="true"
      :btnCancel="true"
      :loading="false"
      :footer="false"
      :header="true"
      :width="500"
    >
      <cost
        v-if="state.dialog.name === 'cost'"
        :bill="state.dialog.billSelected"
      />
      <Time
        v-if="state.dialog.name === 'time'"
        :bill="state.dialog.billSelected"
      />
    </Dialog>
    <!-- /////////////////////// -->
  </div>
</template>
<style scoped>
.parent-bill-page {
  @apply w-full h-full flex flex-col justify-start items-start gap-y-[10px];
}
</style>
