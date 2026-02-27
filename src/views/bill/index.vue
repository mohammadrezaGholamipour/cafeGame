<script setup lang="ts">
import { handleDate } from "@/utils/handleDateAndTime";
import Table from "@/components/table/index.vue";
import loading from "@/components/loading.vue";
import Report from "./components/report.vue";
import tools from "./components/tools.vue";
import type { bill } from "@/types/index";
import { usePinia } from "@/store/pinia";
import { computed, reactive } from "vue";
import cost from "./components/cost.vue";
import Time from "./components/time.vue";
import JalaliDate from "jalali-date";
///////////////////////////////////////
const pinia = usePinia();
const state = reactive({
  headerTable: [
    "ردیف",
    "شروع و پایان",
    "شماره دستگاه",
    "روش پرداخت",
    "مبلغ کل",
  ],
  dialog: {
    status: false,
    name: "",
    billSelected: {} as bill,
  },
});
/////////////////////////////////////
const billData = computed(() => {
  if (Array.isArray(pinia.state.allBill)) {
    return pinia.state.allBill;
  } else [];
});
//////////////////////////////////////////
const handleDialogCostAndTimer = (bill: bill, name: string) => {
  state.dialog.billSelected = bill;
  state.dialog.name = name;
  state.dialog.status = true;
};
//////////////////////////////////////////
const handleShowReport = () => {
  state.dialog.name = "report";
  state.dialog.status = true;
};
//////////////////////////////////////////
const handleDialogStatus = (status: boolean) => {
  if (status) {
  } else {
    if (state.dialog.name === "report") pinia.requestGetAllBill();
    setTimeout(() => {
      state.dialog.name = "";
    }, 500);
  }
  state.dialog.status = status;
};
//////////////////////////////////////////
const endDate = (date: string) => {

  const dateObj = new Date(date + "Z");
  const formatted = new Intl.DateTimeFormat("fa-IR-u-ca-persian", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    timeZone: "Asia/Tehran",
  }).format(dateObj);

  return formatted;
};

//////////////////////////////////////////
</script>
<template>
  <div class="parent-bill-page">
    <!-- //////////////////////// -->
    <tools @report="handleShowReport" :loading="false" />
    <!-- //////////////////////// -->
    <transition-fade group class="w-full overflow-y-auto h-full px-[10px]">
      <!-- //////////////////////// -->
      <Table v-if="billData?.length" :header="state.headerTable">
        <template v-slot:Larg>
          <tr
            :class="{ '!bg-[#75ca71] text-white': !bill.end_time }"
            v-for="(bill, index) in billData"
            :key="bill.id"
          >
            <td>{{ index + 1 }}</td>
            <td>
              <button
                class="button mx-auto px-2 pt-1 bg-[#3ea6da] text-white"
                @click="handleDialogCostAndTimer(bill, 'time')"
              >
                {{ bill.end_time ? endDate(bill.end_time) : "درحال اجرا" }}
              </button>
            </td>
            <td>{{ bill.console.name }}</td>
            <td>
              {{
                bill.total_price
                  ? bill.payment_method === 0
                    ? "کارت"
                    : "نقد"
                  : "-"
              }}
            </td>
            <td>
              <div class="flex justify-center">
                <button
                  v-if="bill.total_price && bill?.bill_foods?.length"
                  class="button bg-[#3ea6da] text-white"
                  @click="handleDialogCostAndTimer(bill, 'cost')"
                >
                  نمایش
                </button>
                <p v-if="bill.total_price && !bill?.bill_foods?.length">
                  {{ bill.total_price.toLocaleString() }}
                </p>
                <p v-if="!bill.total_price" class="text-amber-200 text-lg">
                  درحال اجرا
                </p>
              </div>
            </td>
          </tr>
        </template>
        <template v-slot:small>
          <div
            :class="{ '!bg-[#75ca71] text-white': !bill.end_time }"
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
                  class="button mx-auto px-2 pt-1 bg-[#3ea6da] text-white"
                  @click="handleDialogCostAndTimer(bill, 'time')"
                >
                  {{ bill.end_time ? endDate(bill.end_time) : "درحال اجرا" }}
                </button>
              </div>
              <div>{{ bill.console_id }}</div>
              <div>
                {{
                  bill.total_price
                    ? bill.payment_method === 0
                      ? "کارت"
                      : "نقد"
                    : "-"
                }}
              </div>
              <div>
                <button
                  @click="handleDialogCostAndTimer(bill, 'cost')"
                  v-if="bill.total_price && bill?.bill_foods?.length"
                  class="button bg-[#3ea6da] text-white"
                >
                  نمایش
                </button>
                <p v-if="bill.total_price && !bill?.bill_foods?.length">
                  {{ bill.total_price.toLocaleString() }}
                </p>
                <p v-if="!bill.total_price">درحال اجرا</p>
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
      <Report
        @report="
          (startDate, endDate) => pinia.requestGetAllBill(startDate, endDate)
        "
        v-if="state.dialog.name === 'report' && billData"
        :bills="billData"
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
