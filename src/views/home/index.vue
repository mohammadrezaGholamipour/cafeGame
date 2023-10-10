<script setup lang="ts">
import consoleLine from "./components/console-line.vue";
import consoleBox from "./components/console-box.vue";
import StartBill from "./components/start-bill.vue";
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
    hourRateSelected: { id: 0, name: 0 },
    dialogStatus: false,
    consoleId: 0,
  },
  displayConsole: [
    { id: 1, name: "خطی" },
    { id: 2, name: "باکسی" },
  ],
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
    .start(state.startBill.consoleId, state.startBill.hourRateSelected)
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
const handleShowDialogStartBill = (consoleId: number): void => {
  state.startBill.consoleId = consoleId;
  state.startBill.dialogStatus = true;
};
///////////////////////////////////////////////
const handleDialogStartBill = (status: boolean) => {
  if (status && state.startBill.hourRateSelected) {
    requestStartBill();
  }
  state.startBill.dialogStatus = false;
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
          @start="handleShowDialogStartBill"
          :costPlayed="item.costPlayed"
          :consoleId="item.consoleId"
          @close="requestCloseBill"
          :hourRate="item.hourRate"
          v-for="item in HomeData"
          :loading="item.loading"
          :status="item.status"
          :billId="item.billId"
          :key="item.consoleId"
          :timer="item.timer"
          :name="item.name"
        />
        <!-- //////////////////////////////////// -->
        <Dialog
          :status="state.startBill.dialogStatus"
          @changeStatus="handleDialogStartBill"
          :btnCancelText="'بازگشت'"
          :btnAcceptText="'شروع'"
          :btnAccept="true"
          :btnCancel="true"
          :header="false"
          :footer="true"
          :width="300"
        >
          <StartBill
            @drop-list-status="
              (status) => (state.startBill.dropListStatus = status)
            "
            @hourRate="
              (hourRate) => (state.startBill.hourRateSelected = hourRate)
            "
            :start-bill="state.startBill"
          />
        </Dialog>
        <!-- //////////////////////////////////// -->
      </div>
      <loading v-else />
    </transition-fade>
  </div>
</template>
<style scoped>
.parent-home {
  @apply w-full h-full flex flex-col justify-start items-start;
}
.parent-console {
  @apply w-full h-full overflow-hidden overflow-y-auto grid justify-center gap-[25px] justify-items-center items-start content-start py-[30px] p-[10px];
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
}
</style>
