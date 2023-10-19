<script setup lang="ts">
import consoleLine from "./components/console-line.vue";
import consoleBox from "./components/console-box.vue";
import type { StartBillProps } from "@/types/index";
import StartBill from "./components/start-bill.vue";
import loading from "@/components/loading.vue";
import tools from "./components/tools.vue";
import { usePinia } from "@/store/pinia";
import { computed, reactive } from "vue";
import billApi from "@/api/bill.js";
///////////////////////////////
const pinia = usePinia();
const state = reactive({
  displayMode: 2,
  bill: {
    dropListStatus: false,
    hourRateSelected: { id: 0, name: 0 },
    consoleId: 0,
  } as StartBillProps,
  dialogStatus: false,
});
////////////////////////////////
const HomeData = computed(() => {
  if (Array.isArray(pinia.state.home)) {
    return pinia.state.home;
  }
});
/////////////////////////////////////////////////
const requestStartBill = (): void => {
  handleConsoleLoading(state.bill.consoleId, true);
  billApi
    .start(
      state.bill.consoleId,
      state.bill.hourRateSelected.id,
      new Date().toISOString()
    )
    .then(() => pinia.requestGetBill())
    .catch(() => {
      handleConsoleLoading(state.bill.consoleId, false);
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
const requestCloseBill = (info: {
  billId: number;
  consoleId: number;
}): void => {
  handleConsoleLoading(info.consoleId, true);
  billApi
    .close(info.billId, new Date().toISOString())
    .then(() => pinia.requestGetBill())
    .catch(() => {
      handleConsoleLoading(info.consoleId, false);
      pinia.handleNotification({
        ...pinia.state.notification,
        name: "error",
        status: true,
        textHeader: "خطا",
        textMain: "فاکتور مورد نظر بسته نشد",
      });
    });
};
///////////////////////////////////////////////
const handleShowDialogStartBill = (info: {
  billId: number;
  consoleId: number;
}): void => {
  state.bill.consoleId = info.consoleId;
  state.dialogStatus = true;
};
///////////////////////////////////////////////
const handleDialogStatus = (status: boolean) => {
  if (status) {
    if (state.bill.hourRateSelected.id) {
      requestStartBill();
      state.dialogStatus = false;
      setTimeout(() => {
        state.bill.consoleId = 0;
        state.bill.hourRateSelected = { id: 0, name: 0 };
      }, 500);
    } else {
      pinia.handleNotification({
        ...pinia.state.notification,
        name: "error",
        status: true,
        textHeader: "خطا",
        textMain: "لطفا قیمت واحد را انتخاب کنید",
      });
    }
  } else {
    state.dialogStatus = false;
    setTimeout(() => {
      state.bill.consoleId = 0;
      state.bill.hourRateSelected = { id: 0, name: 0 };
    }, 500);
  }
};
///////////////////////////////////////////////
const handleConsoleStatus = (
  info: { billId: number; consoleId: number },
  status: boolean
) => {
  (status ? handleShowDialogStartBill : requestCloseBill)(info);
};
//////////////////////////////////////
const handleConsoleLoading = (consoleId: number, status: boolean) => {
  if (Array.isArray(pinia.state.home)) {
    let console = pinia.state.home.find((item) => item.consoleId === consoleId);
    if (console) console.loading = status;
  }
};
/////////////////////////////////////////////////
</script>
<template>
  <div class="parent-home-page">
    <!-- //////////////////////////////////// -->
    <tools @displayMode="state.displayMode = $event" />
    <!-- //////////////////////////////////// -->
    <transition-fade group class="w-full overflow-y-auto h-full">
      <div v-if="HomeData?.length" class="parent-console">
        <component
          :is="state.displayMode === 1 ? consoleLine : consoleBox"
          :dropListStatus="item.dropListStatus"
          @status="handleConsoleStatus"
          :costPlayed="item.costPlayed"
          :consoleId="item.consoleId"
          :hourRate="item.hourRate"
          v-for="item in HomeData"
          :loading="item.loading"
          :status="item.status"
          :billId="item.billId"
          :key="item.consoleId"
          :timer="item.timer"
          :name="item.name"
        />
      </div>
      <img
        src="@/assets/image/noData.svg"
        class="w-full h-full"
        v-else-if="HomeData"
      />
      <loading v-else />
    </transition-fade>
    <!-- //////////////////////////////////// -->
    <Dialog
      @changeStatus="handleDialogStatus"
      :status="state.dialogStatus"
      :btnCancelText="'بازگشت'"
      :btnAcceptText="'تایید'"
      :btnAccept="true"
      :btnCancel="true"
      :loading="false"
      :header="false"
      :footer="true"
      :width="300"
    >
      <StartBill
        @hourRate="(hourRate) => (state.bill.hourRateSelected = hourRate)"
        @drop-list-status="(status) => (state.bill.dropListStatus = status)"
        :start-bill="state.bill"
      />
    </Dialog>
    <!-- //////////////////////////////////// -->
  </div>
</template>
<style scoped>
.parent-home-page {
  @apply w-full h-full flex flex-col justify-start items-start;
}
</style>
