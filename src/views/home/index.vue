<script setup lang="ts">
import consoleLine from "./components/console-line.vue";
import consoleBox from "./components/console-box.vue";
import StartBill from "./components/start-bill.vue";
import loading from "@/components/loading.vue";
import type { billFood } from "@/types/index";
import Factor from "./components/Factor.vue";
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
    billFoods: [] as billFood[] | [],
    foodSelected: [] as { foodId: number; count: number }[] | [],
    consoleId: 0,
    billId: 0,
  },
  dialog: {
    status: false,
    loading: false,
    header: false,
    footer: true,
    name: "",
    width: 330,
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
      getTimeStartOrEndBill()
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
    .close(info.billId, getTimeStartOrEndBill())
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
const requestSetFood = () => {
  state.dialog.loading = true;
  handleConsoleLoading(state.consoleSelected.consoleId, true);
  billApi
    .setFood(state.consoleSelected.billId, state.consoleSelected.foodSelected)
    .then(() => {
      pinia.requestGetBill();
      handleCloseDialog();
    })
    .catch(() => {
      handleConsoleLoading(state.consoleSelected.consoleId, false);
      pinia.handleNotification({
        ...pinia.state.notification,
        name: "error",
        status: true,
        textHeader: "خطا",
        textMain: "خوراکی ثبت نشد",
      });
    })
    .finally(() => (state.dialog.loading = false));
};
//////////////////////////////////////////
const handleConsoleStatus = (
  info: { billId: number; consoleId: number },
  status: boolean
) => {
  (status ? handleStartBill : requestCloseBill)(info);
};
//////////////////////////////////////
const handleSetFood = (
  billId: number,
  consoleId: number,
  billFood: billFood[] | []
) => {
  state.consoleSelected.consoleId = consoleId;
  state.consoleSelected.billFoods = billFood;
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
const handleFactor = (
  billId: number,
  consoleId: number,
  billFood: billFood[]
) => {
  state.consoleSelected.billId = billId;
  state.consoleSelected.consoleId = consoleId;
  state.consoleSelected.billFoods = billFood;
  state.dialog.name = "factor";
  state.dialog.footer = false;
  state.dialog.header = true;
  state.dialog.width = 500;
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
    } else if (state.dialog.name === "food") {
      requestSetFood();
    }
    ////////////////////////////////////////
  } else {
    handleCloseDialog();
  }
};
///////////////////////////////////////////////
const handleCloseDialog = () => {
  if (state.dialog.name === "food") pinia.requestGetFood();
  state.dialog.status = false;
  setTimeout(() => {
    state.consoleSelected.hourRateSelected = { id: 0, name: 0 };
    state.consoleSelected.foodSelected = [];
    state.consoleSelected.billFoods = [];
    state.consoleSelected.consoleId = 0;
    state.consoleSelected.billId = 0;
    state.dialog.header = false;
    state.dialog.footer = true;
    state.dialog.width = 330;
    state.dialog.name = "";
  }, 500);
};
//////////////////////////////////////
const getTimeStartOrEndBill = () => {
  let currentDateTime = new Date();
  let tehranOffset = 3.5 * 60 * 60 * 1000;
  let tehranTime = new Date(currentDateTime.getTime() + tehranOffset);
  return tehranTime.toISOString();
};
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
          :billFood="item.billFood"
          v-for="item in HomeData"
          :loading="item.loading"
          @factor="handleFactor"
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
      :loading="state.dialog.loading"
      :header="state.dialog.header"
      :status="state.dialog.status"
      :footer="state.dialog.footer"
      :width="state.dialog.width"
      :btnCancelText="'بازگشت'"
      :btnAcceptText="'تایید'"
      :headerText="'فاکتور'"
      :btnAccept="true"
      :btnCancel="true"
    >
      <!-- /////////////////////////// -->
      <StartBill
        @hourRate="
          (hourRate) => (state.consoleSelected.hourRateSelected = hourRate)
        "
        @drop-list-status="
          (status) => (state.consoleSelected.dropListStatus = status)
        "
        v-if="state.dialog.name === 'startBill'"
        :start-bill="state.consoleSelected"
      />
      <!-- /////////////////////////// -->
      <p v-if="state.dialog.name === 'removeBill'" class="p-1">
        فاکتور مورد نظر حذف شود؟
      </p>
      <!-- /////////////////////////// -->
      <Food
        @foodSelected="(food) => (state.consoleSelected.foodSelected = food)"
        :billFood="state.consoleSelected.billFoods"
        v-if="state.dialog.name === 'food'"
      />
      <Factor
        :consoleId="state.consoleSelected.consoleId"
        :billFoods="state.consoleSelected.billFoods"
        :bill-id="state.consoleSelected.billId"
        v-if="state.dialog.name === 'factor'"
      />
      <!-- /////////////////////////// -->
    </Dialog>
    <!-- //////////////////////////////////// -->
  </div>
</template>
<style scoped>
.parent-home-page {
  @apply w-full h-full flex flex-col justify-start items-start;
}
</style>
