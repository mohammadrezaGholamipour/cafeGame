<script setup lang="ts">
import type { billFood, alarmInLocalStorage } from "@/types/index";
import localStorageService from "@/utils/local-storage-service";
import consoleLine from "./components/console-line.vue";
import consoleBox from "./components/console-box.vue";
import StartBill from "./components/start-bill.vue";
import StartTime from "./components/start-time.vue";
import HourRate from "./components/hour-rate.vue";
import loading from "@/components/loading.vue";
import Factor from "./components/factor.vue";
import tools from "./components/tools.vue";
import Alarm from "./components/alarm.vue";
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
    hourRate: 0,
    alarm: {} as alarmInLocalStorage | {},
    billId: 0,
  },
  dialog: {
    status: false,
    loading: false,
    header: false,
    footer: true,
    headerText: "",
    name: "",
    width: 330,
  },
});
////////////////////////////////
const homeData = computed(() => {
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
const requestChangeHourRate = () => {
  state.dialog.loading = true;
  billApi
    .changeMoney(
      state.consoleSelected.billId,
      state.consoleSelected.hourRateSelected.id
    )
    .then(() => {
      pinia.requestGetBill();
      state.dialog.loading = false;
      handleCloseDialog();
    })
    .catch(() => {
      state.dialog.loading = false;
      pinia.handleNotification({
        ...pinia.state.notification,
        name: "error",
        status: true,
        textHeader: "خطا",
        textMain: "قیمت واحد عوض نشد",
      });
    });
};
//////////////////////////////////////////
const requestChangeStartTime = (time: number) => {
  state.dialog.loading = true;
  billApi
    .changeStartTime(state.consoleSelected.billId, time)
    .then(() => {
      pinia.requestGetBill();
      state.dialog.loading = false;
      handleCloseDialog();
    })
    .catch(() => {
      state.dialog.loading = false;
      pinia.handleNotification({
        ...pinia.state.notification,
        name: "error",
        status: true,
        textHeader: "خطا",
        textMain: "زمان تغییر نکرد",
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
const handleRemoveBill = (
  billId: number,
  consoleId: number,
  billFood: billFood[]
): void => {
  if (billFood.length) {
    pinia.handleNotification({
      ...pinia.state.notification,
      name: "error",
      status: true,
      textHeader: "خطا",
      textMain: "ابتدا خوراکی ها را حذف کنید",
    });
  } else {
    state.consoleSelected.consoleId = consoleId;
    state.consoleSelected.billId = billId;
    state.dialog.name = "removeBill";
    state.dialog.status = true;
  }
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
  if (billFood.length) {
    state.consoleSelected.billId = billId;
    state.consoleSelected.consoleId = consoleId;
    state.consoleSelected.billFoods = billFood;
    state.dialog.name = "factor";
    state.dialog.footer = false;
    state.dialog.header = true;
    state.dialog.headerText = "فاکتور";
    state.dialog.width = 500;
    state.dialog.status = true;
  }
};
///////////////////////////////////////////////
const handleChangeHourRate = (billId: number, hourRate: number) => {
  state.consoleSelected.hourRate = hourRate;
  state.consoleSelected.billId = billId;
  state.dialog.name = "hourRate";
  state.dialog.status = true;
};
///////////////////////////////////////////////
const handleStartTime = (billId: number) => {
  state.consoleSelected.billId = billId;
  state.dialog.headerText = "زمان شروع";
  state.dialog.name = "startTime";
  state.dialog.footer = false;
  state.dialog.header = true;
  state.dialog.status = true;
};
///////////////////////////////////////////////
const handleAlarm = (consoleId: number) => {
  //////////////////////////////////////
  const alarm: alarmInLocalStorage[] = localStorageService.getAlarm();
  const alarmSelected = alarm.find((item) => item.consoleId === consoleId);
  //////////////////////////////////////
  state.consoleSelected.consoleId = consoleId;
  if (alarmSelected) state.consoleSelected.alarm = alarmSelected;
  state.dialog.name = "alarm";
  state.dialog.footer = false;
  state.dialog.header = true;
  state.dialog.headerText = "یادآور";
  state.dialog.status = true;
};
///////////////////////////////////////////////
const handleSetAlarm = (time: alarmInLocalStorage): void => {
  const alarm = localStorageService.getAlarm();
  alarm.push(time);
  localStorageService.setAlarm(alarm);
  handleCloseDialog();
};
///////////////////////////////////////////////
const handleRemoveAlarm = (consoleId: number) => {
  const alarmList: alarmInLocalStorage[] = localStorageService.getAlarm();
  const alarm = alarmList.filter((item) => item.consoleId !== consoleId);
  localStorageService.setAlarm(alarm);
  state.consoleSelected.alarm = {};
  const consoleSelected = homeData.value?.find(
    (item) => item.consoleId === consoleId
  );
  if (consoleSelected) {
    consoleSelected.alarmStatus = false;
    pinia.handleAlarmSound();
  }
};
///////////////////////////////////////////////
const handleConsoleLoading = (consoleId: number, status: boolean) => {
  let console = homeData.value?.find((item) => item.consoleId === consoleId);
  if (console) console.loading = status;
};
///////////////////////////////////////////////
const handleOptionStatus = (status: boolean, consoleId: number) => {
  let console = homeData.value?.find((item) => item.consoleId === consoleId);
  if (console) {
    if (status) console.optionStatus = true;
    else console.optionStatus = false;
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
    } else if (state.dialog.name === "hourRate") {
      requestChangeHourRate();
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
    state.consoleSelected.alarm = {};
    state.dialog.header = false;
    state.dialog.footer = true;
    state.dialog.width = 330;
    state.dialog.name = "";
  }, 500);
};
//////////////////////////////////////
const getTimeStartOrEndBill = () => {
  const currentDateTime = new Date();
  const tehranOffset = 3.5 * 60 * 60 * 1000;
  const tehranTime = new Date(
    currentDateTime.getTime() + tehranOffset
  ).toISOString();
  return tehranTime;
};
////////////////////////////////
</script>
<template>
  <div class="parent-home-page">
    <!-- //////////////////////////////////// -->
    <tools @displayMode="state.displayMode = $event" />
    <!-- //////////////////////////////////// -->
    <transition-fade group class="w-full overflow-y-auto h-full">
      <div v-if="homeData?.length" class="parent-console">
        <component
          :is="state.displayMode === 1 ? consoleLine : consoleBox"
          @changeHourRate="handleChangeHourRate"
          :dropListStatus="item.dropListStatus"
          @optionStatus="handleOptionStatus"
          @changeStartTime="handleStartTime"
          :optionStatus="item.optionStatus"
          @removeAlarm="handleRemoveAlarm"
          :alarmStatus="item.alarmStatus"
          @removeBill="handleRemoveBill"
          @status="handleConsoleStatus"
          :costPlayed="item.costPlayed"
          :consoleId="item.consoleId"
          :hourRate="item.hourRate"
          :billFood="item.billFood"
          :costFood="item.costFood"
          v-for="item in homeData"
          :loading="item.loading"
          @factor="handleFactor"
          :status="item.status"
          @food="handleSetFood"
          :billId="item.billId"
          :key="item.consoleId"
          @alarm="handleAlarm"
          :timer="item.timer"
          :name="item.name"
        />
      </div>
      <img
        src="@/assets/image/noData.svg"
        class="w-full h-full"
        v-else-if="homeData"
      />
      <loading v-else />
    </transition-fade>
    <!-- //////////////////////////////////// -->
    <Dialog
      :headerText="state.dialog.headerText"
      @changeStatus="handleDialogStatus"
      :loading="state.dialog.loading"
      :header="state.dialog.header"
      :status="state.dialog.status"
      :footer="state.dialog.footer"
      :width="state.dialog.width"
      :btnCancelText="'بازگشت'"
      :btnAcceptText="'تایید'"
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
      <!-- /////////////////////////// -->
      <Factor
        :consoleId="state.consoleSelected.consoleId"
        :billFoods="state.consoleSelected.billFoods"
        :bill-id="state.consoleSelected.billId"
        v-if="state.dialog.name === 'factor'"
      />
      <!-- /////////////////////////// -->
      <HourRate
        @hourRate="
          (hourRate) => (state.consoleSelected.hourRateSelected = hourRate)
        "
        v-if="state.dialog.name === 'hourRate'"
        :hourRate="state.consoleSelected.hourRate"
      />
      <!-- /////////////////////////// -->
      <StartTime
        v-if="state.dialog.name === 'startTime'"
        :billId="state.consoleSelected.billId"
        :loading="state.dialog.loading"
        @time="requestChangeStartTime"
      />
      <!-- /////////////////////////// -->
      <Alarm
        :consoleId="state.consoleSelected.consoleId"
        v-if="state.dialog.name === 'alarm'"
        :alarm="state.consoleSelected.alarm"
        @removeAlarm="handleRemoveAlarm"
        :loading="state.dialog.loading"
        @setAlarm="handleSetAlarm"
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
