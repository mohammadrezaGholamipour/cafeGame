<script setup lang="ts">
import consoleLine from "./components/console-line.vue";
import consoleBox from "./components/console-box.vue";
import loading from "./components/loading.vue";
import tools from "./components/tools.vue";
import { usePinia } from "@/store/pinia";
import { computed, reactive } from "vue";
import billApi from "@/api/bill.js";
///////////////////////////////
const pinia = usePinia();
const state = reactive({
  displayMode: 2,
  startBill: {
    dropListStatus: false,
    hourRateSelected: 0,
    dialogStatus: false,
    consoleId: 0,
  },
});
////////////////////////////////
const HomeData = computed(() => {
  if (Array.isArray(pinia.state.home)) {
    return pinia.state.home;
  }
});
/////////////////////////////////////////////////
const requestStartBill = (): void => {
  billApi
    .start()
    .then(() => pinia.requestGetBill())
    .catch(() => {
      pinia.handleNotification({
        ...pinia.state.notification,
        name: "error",
        status: true,
        textHeader: "خطا",
        textMain: "شروع فاکتور انجام نشد",
      });
    });
};
/////////////////////////////////////////////////
const requestCloseBill = (billId: number): void => {
  handleConsoleLoading(billId);
  billApi
    .close(billId, new Date().toISOString())
    .then(() => pinia.requestGetBill())
    .catch(() => {
      handleConsoleLoading(billId);
      pinia.handleNotification({
        ...pinia.state.notification,
        name: "error",
        status: true,
        textHeader: "خطا",
        textMain: "فاکتور مورد نظر بسته نشد",
      });
    })
    .finally(() => {
      handleConsoleLoading(billId);
    });
};
///////////////////////////////////////////////
const handleShowDialog = (consoleId: number): void => {
  state.startBill.consoleId = consoleId;
  state.startBill.dialogStatus = true;
};
///////////////////////////////////////////////
const handleConsoleLoading = (billId: number) => {
  if (Array.isArray(pinia.state.home)) {
    let console = pinia.state.home.find((item) => item.billId === billId);
    if (console) console.loading = !console.loading;
  }
};
</script>
<template>
  <div class="parent-home">
    <!-- //////////////////////////////////// -->
    <tools @displayMode="state.displayMode = $event" />
    <!-- //////////////////////////////////// -->
    <transition-fade group class="w-full h-full">
      <div v-if="pinia.state.home" class="parent-console">
        <component
          :is="state.displayMode === 1 ? consoleLine : consoleBox"
          :dropListStatus="item.dropListStatus"
          :costPlayed="item.costPlayed"
          :consoleId="item.consoleId"
          @close="requestCloseBill"
          :hourRate="item.hourRate"
          @start="handleShowDialog"
          v-for="item in HomeData"
          :loading="item.loading"
          :status="item.status"
          :billId="item.billId"
          :key="item.consoleId"
          :timer="item.timer"
          :name="item.name"
        />
      </div>
      <loading v-else />
    </transition-fade>
    <!-- //////////////////////////////////// -->
    <!-- <Dialog
      :status="state.startBill.dialogStatus"
      :btnCancelText="'بازگشت'"
      :btnAcceptText="'شروع'"
      :btnAccept="true"
      :btnCancel="true"
      :header="false"
      :footer="true"
      :width="300"
    >
      <div class="flex w-full flex-col items-center justify-center">
        <div id="start-bill" class="flex w-full items-center justify-between">
          <div class="flex items-center">
            <p>قیمت واحد را انتخاب کنید</p>
            <p>(اجباری)</p>
          </div>
          <DropList
            @close="state.startBill.dropListStatus = false"
            :status="state.startBill.dropListStatus"
            :data="pinia.state.hourRate"
            element="start-bill"
            :space="'32px'"
          />
        </div>
      </div>
    </Dialog> -->
    <!-- //////////////////////////////////// -->
  </div>
</template>
<style scoped>
.parent-home {
  @apply w-full h-full flex flex-col justify-start items-start;
}
.parent-console {
  @apply w-full h-full overflow-hidden overflow-y-auto grid justify-center gap-[25px] justify-items-center items-start content-start pt-[30px] p-[10px];
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
}
</style>
