<script setup lang="ts">
import consoleLine from "./components/console-line.vue";
import consoleBox from "./components/console-box.vue";
import StartBill from "./components/start-bill.vue";
import loading from "@/components/loading.vue";
import tools from "./components/tools.vue";
import { usePinia } from "@/store/pinia";
import { computed, reactive } from "vue";
import Food from "./components/food.vue";
import billApi from "@/api/bill.js";
///////////////////////////////
const pinia = usePinia();
const state = reactive({
  displayMode: 2,
  consoleSelected: {
    dropListStatus: false,
    hourRateSelected: { id: 0, name: 0 },
    consoleId: 0,
    billId: 0,
  },
  dialog: {
    status: false,
    name: "",
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
  handleConsoleLoading(state.consoleSelected.consoleId, true);
  billApi
    .start(
      state.consoleSelected.consoleId,
      state.consoleSelected.hourRateSelected.id,
      new Date().toISOString()
    )
    .then(() => pinia.requestGetBill())
    .catch(() => {
      handleConsoleLoading(state.consoleSelected.consoleId, false);
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
//////////////////////////////////////////
const requestRemoveBill = () => {
  handleConsoleLoading(state.consoleSelected.consoleId, true);
  billApi
    .delete(state.consoleSelected.billId)
    .then(() => pinia.requestGetBill())
    .catch(() => {
      handleConsoleLoading(state.consoleSelected.consoleId, false);
      pinia.handleNotification({
        ...pinia.state.notification,
        name: "error",
        status: true,
        textHeader: "خطا",
        textMain: "فاکتور مورد نظر حذف نشد",
      });
    });
};
//////////////////////////////////////////
const handleConsoleStatus = (
  info: { billId: number; consoleId: number },
  status: boolean
) => {
  (status ? handleStartBill : requestCloseBill)(info);
};
//////////////////////////////////////
const handleSetFood = (billId: number) => {
  state.consoleSelected.billId = billId;
  state.dialog.name = "food";
  state.dialog.status = true;
};
//////////////////////////////////////
const handleRemoveBill = (billId: number, consoleId: number): void => {
  state.consoleSelected.consoleId = consoleId;
  state.consoleSelected.billId = billId;
  state.dialog.name = "removeBill";
  state.dialog.status = true;
};
//////////////////////////////////////
const handleStartBill = (info: { billId: number; consoleId: number }): void => {
  state.consoleSelected.consoleId = info.consoleId;
  state.dialog.name = "startBill";
  state.dialog.status = true;
};
///////////////////////////////////////////////
const handleConsoleLoading = (consoleId: number, status: boolean) => {
  if (Array.isArray(pinia.state.home)) {
    let console = pinia.state.home.find((item) => item.consoleId === consoleId);
    if (console) console.loading = status;
  }
};
///////////////////////////////////////////////
const handleDialogStatus = (status: boolean) => {
  if (status) {
    ////////////////////////////////////////
    if (state.dialog.name === "startBill") {
      if (state.consoleSelected.hourRateSelected.id) {
        requestStartBill();
        handleCloseDialog();
      } else {
        pinia.handleNotification({
          ...pinia.state.notification,
          name: "error",
          status: true,
          textHeader: "خطا",
          textMain: "لطفا قیمت واحد را انتخاب کنید",
        });
      }
    } else if (state.dialog.name === "removeBill") {
      requestRemoveBill();
      handleCloseDialog();
    }
    ////////////////////////////////////////
  } else {
    handleCloseDialog();
  }
};
///////////////////////////////////////////////
const handleCloseDialog = () => {
  state.dialog.status = false;
  setTimeout(() => {
    state.dialog.name = "";
    state.consoleSelected.consoleId = 0;
    state.consoleSelected.hourRateSelected = { id: 0, name: 0 };
    state.consoleSelected.billId = 0;
  }, 500);
};
//////////////////////////////////////
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
          @removeBill="handleRemoveBill"
          @status="handleConsoleStatus"
          :costPlayed="item.costPlayed"
          :consoleId="item.consoleId"
          :hourRate="item.hourRate"
          v-for="item in HomeData"
          :loading="item.loading"
          :status="item.status"
          @food="handleSetFood"
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
      :status="state.dialog.status"
      :btnCancelText="'بازگشت'"
      :btnAcceptText="'تایید'"
      :btnAccept="true"
      :btnCancel="true"
      :loading="false"
      :header="false"
      :footer="true"
      :width="330"
    >
      <!-- /////////////////////////// -->
      <StartBill
        @hourRate="
          (hourRate) => (state.consoleSelected.hourRateSelected = hourRate)
        "
        @drop-list-status="
          (status) => (state.consoleSelected.dropListStatus = status)
        "
        :start-bill="state.consoleSelected"
        v-if="state.dialog.name === 'startBill'"
      />
      <!-- /////////////////////////// -->
      <p v-if="state.dialog.name === 'removeBill'" class="p-1">
        فاکتور مورد نظر حذف شود؟
      </p>
      <!-- /////////////////////////// -->
      <Food v-if="state.dialog.name === 'food'" />
    </Dialog>
    <!-- //////////////////////////////////// -->
  </div>
</template>
<style scoped>
.parent-home-page {
  @apply w-full h-full flex flex-col justify-start items-start;
}
</style>
