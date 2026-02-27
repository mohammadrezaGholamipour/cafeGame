<script setup lang="ts">
import type {
  billFood,
  alarmInLocalStorage,
  CustomMoneyInLocalStorage,
} from "@/types/index";
import localStorageService from "@/utils/local-storage-service";
import consoleLine from "./components/console-line.vue";
import ChangeMoney from "./components/change-money.vue";
import consoleBox from "./components/console-box.vue";
import InputRadio from "./components/input-radio.vue";
import StartBill from "./components/start-bill.vue";
import StartTime from "./components/start-time.vue";
import HourRate from "./components/hour-rate.vue";
import loading from "@/components/loading.vue";
import Factor from "./components/factor.vue";
import tools from "./components/tools.vue";
import Alarm from "./components/alarm.vue";
import { usePinia } from "@/store/pinia";
import Food from "./components/food.vue";
import { computed, reactive } from "vue";
import { useRouter } from "vue-router";
import billApi from "@/api/bill.js";
///////////////////////////////////
const router = useRouter();
const pinia = usePinia();
const state = reactive({
  consoleSelected: {
    dropListStatus: false,
    hourRateSelected: { id: 0, name: 0 },
    payment_method: 0,
    billFoods: [] as billFood[] | [],
    foodSelected: [] as { foodId: number; count: number }[] | [],
    consoleId: 0,
    hourRate: 0,
    alarm: {} as alarmInLocalStorage | {},
    costFood: 0,
    costPlayed: 0,
    customMoney: 0,
    billId: 0,
  },
  dialog: {
    status: false,
    loading: false,
    header: false,
    footer: true,
    headerText: "",
    btnCancelText: "بازگشت",
    btnAcceptText: "تایید",
    name: "",
    width: 330,
  },
});
////////////////////////////////
const homeData = computed(() => {
  if (Array.isArray(pinia.state.home) && Array.isArray(pinia.state.hourRate)) {
    if (pinia.state.home.length && pinia.state.hourRate.length) {
      return pinia.state.home;
    } else {
      return [];
    }
  }
});
/////////////////////////////////////////////////
const requestStartBill = (): void => {
  handleConsoleLoading(state.consoleSelected.consoleId, true);
  billApi
    .start({
      console_id: state.consoleSelected.consoleId,
      unit_price_amount: state.consoleSelected.hourRateSelected.name,
    })
    .then(() => {
      (pinia.requestGetOpenBill(), pinia.requestGetAllBill());
    })
    .catch((errors: any) => {
      handleConsoleLoading(state.consoleSelected.consoleId, false);
      pinia.handleNotification({
        ...pinia.state.notification,
        timer: 3000,
        name: "error",
        status: true,
        textHeader: "خطا",
        textMain: `${errors?.response?.data?.error[0]?.message || "خطای نامشخص"}`,
      });
    });
};
/////////////////////////////////////////////////
const requestCloseBill = (): void => {
  billApi
    .close(state.consoleSelected.billId)

    .then(() => {
      (pinia.requestGetOpenBill(),
        pinia.requestGetAllBill(),
        handleRemoveAlarm(state.consoleSelected.consoleId));
      handleRemoveMoney(state.consoleSelected.consoleId);
    })
    .catch((errors: any) => {
      handleConsoleLoading(state.consoleSelected.consoleId, false);
      pinia.handleNotification({
        ...pinia.state.notification,
        timer: 3000,
        name: "error",
        status: true,
        textHeader: "خطا",
        textMain: `${errors?.response?.data?.error[0]?.message || "خطای نامشخص"}`,
      });
    })
    .finally(() => handleCloseDialog());
};
//////////////////////////////////////////
const requestPaymentMethod = (): void => {
  handleConsoleLoading(state.consoleSelected.consoleId, true);
  billApi
    .update(state.consoleSelected.billId, {
      payment_method: state.consoleSelected.payment_method,
    })
    .then(() => requestCloseBill())
    .catch((errors: any) => {
      handleConsoleLoading(state.consoleSelected.consoleId, false);
      handleCloseDialog();
      pinia.handleNotification({
        ...pinia.state.notification,
        timer: 3000,
        name: "error",
        status: true,
        textHeader: "خطا",
        textMain: `${errors?.response?.data?.error[0]?.message || "خطای نامشخص"}`,
      });
    });
};
//////////////////////////////////////////
const requestRemoveBill = () => {
  handleConsoleLoading(state.consoleSelected.consoleId, true);
  billApi
    .delete(state.consoleSelected.billId)

    .then(() => {
      pinia.requestGetOpenBill();
      pinia.requestGetAllBill();
      handleRemoveAlarm(state.consoleSelected.consoleId);
      handleRemoveMoney(state.consoleSelected.consoleId);
    })
    .catch((errors: any) => {
      handleConsoleLoading(state.consoleSelected.consoleId, false);
      pinia.handleNotification({
        ...pinia.state.notification,
        timer: 3000,
        name: "error",
        status: true,
        textHeader: "خطا",
        textMain: `${errors?.response?.data?.error[0]?.message || "خطای نامشخص"}`,
      });
    });
};
//////////////////////////////////////////
const requestChangeHourRate = () => {
  state.dialog.loading = true;
  billApi
    .update(state.consoleSelected.billId, {
      unit_price_amount: state.consoleSelected.hourRateSelected.name,
    })
    .then(() => {
      pinia.requestGetOpenBill();
      state.dialog.loading = false;
      handleCloseDialog();
    })
    .catch((errors: any) => {
      state.dialog.loading = false;
      pinia.handleNotification({
        ...pinia.state.notification,
        timer: 3000,
        name: "error",
        status: true,
        textHeader: "خطا",
        textMain: `${errors?.response?.data?.error[0]?.message || "خطای نامشخص"}`,
      });
    });
};
//////////////////////////////////////////
const requestChangeStartTime = (time: number) => {
  state.dialog.loading = true;
  billApi
    .update(state.consoleSelected.billId, { start_time_offset_minutes: time })
    .then(() => {
      pinia.requestGetOpenBill();
      pinia.requestGetAllBill();
      state.dialog.loading = false;
      handleCloseDialog();
    })
    .catch((errors: any) => {
      state.dialog.loading = false;
      pinia.handleNotification({
        ...pinia.state.notification,
        timer: 3000,
        name: "error",
        status: true,
        textHeader: "خطا",
        textMain: `${errors?.response?.data?.error[0]?.message || "خطای نامشخص"}`,
      });
    });
};
//////////////////////////////////////////
const requestSetFood = () => {
  state.dialog.loading = true;
  handleConsoleLoading(state.consoleSelected.consoleId, true);
  billApi
    .update(state.consoleSelected.billId, {
      foods: state.consoleSelected.foodSelected,
    })
    .then(() => {
      pinia.requestGetOpenBill();
      handleCloseDialog();
    })
    .catch((errors: any) => {
      handleConsoleLoading(state.consoleSelected.consoleId, false);
      pinia.handleNotification({
        ...pinia.state.notification,
        timer: 3000,
        name: "error",
        status: true,
        textHeader: "خطا",
        textMain: `${errors?.response?.data?.error[0]?.message || "خطای نامشخص"}`,
      });
    })
    .finally(() => (state.dialog.loading = false));
};
//////////////////////////////////////////
const handleConsoleStatus = (
  info: { billId: number; consoleId: number },
  status: boolean,
) => {
  (status ? handleStartBill : handleHadFood)(info);
};
//////////////////////////////////////
const handleHadFood = (info: { billId: number; consoleId: number }) => {
  state.consoleSelected.billId = info.billId;
  state.consoleSelected.consoleId = info.consoleId;
  state.dialog.name = "had-food";
  state.dialog.btnAcceptText = "بله";
  state.dialog.btnCancelText = "خیر";
  state.dialog.status = true;
};
//////////////////////////////////////
const handleSetFood = (
  billId: number,
  consoleId: number,
  bill_foods: billFood[] | [],
) => {
  state.consoleSelected.consoleId = consoleId;
  state.consoleSelected.billFoods = bill_foods ?? [];
  state.consoleSelected.billId = billId;
  state.dialog.name = "food";
  state.dialog.status = true;
};
//////////////////////////////////////
const handleRemoveBill = (
  billId: number,
  consoleId: number,
  bill_foods: billFood[],
): void => {
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
  bill_foods: billFood[],
  customMoney: number,
) => {
  if (bill_foods.length || customMoney) {
    state.consoleSelected.billId = billId;
    state.consoleSelected.consoleId = consoleId;
    state.consoleSelected.billFoods = bill_foods;
    state.consoleSelected.customMoney = customMoney;
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
    (item) => item.consoleId === consoleId,
  );
  if (consoleSelected) {
    consoleSelected.alarmStatus = false;
    pinia.handleAlarmSound();
  }
};
///////////////////////////////////////////////
const handleSetCustomMoney = (inputMoney: number): void => {
  const money = localStorageService.getCustomMoney();
  money.push({ money: inputMoney, consoleId: state.consoleSelected.consoleId });
  localStorageService.setCustomMoney(money);
  const consoleSelected = homeData.value?.find(
    (item) => item.consoleId === state.consoleSelected.consoleId,
  );
  if (consoleSelected) consoleSelected.customMoney = inputMoney;
  handleCloseDialog();
};
///////////////////////////////////////////////
const handleChangeMoney = (
  consoleId: number,
  costFood: number,
  costPlayed: number,
  customMoney: number,
) => {
  state.consoleSelected.consoleId = consoleId;
  state.consoleSelected.costFood = costFood;
  state.consoleSelected.costPlayed = costPlayed;
  state.consoleSelected.customMoney = customMoney;
  state.dialog.headerText = "تغییر قیمت";
  state.dialog.name = "change-money";
  state.dialog.header = true;
  state.dialog.footer = false;
  state.dialog.status = true;
};
///////////////////////////////////////////////
const handleRemoveMoney = (consoleId: number) => {
  const moneyList: CustomMoneyInLocalStorage[] =
    localStorageService.getCustomMoney();
  const money = moneyList.filter((item) => item.consoleId !== consoleId);
  localStorageService.setCustomMoney(money);
  state.consoleSelected.customMoney = 0;
  const consoleSelected = homeData.value?.find(
    (item) => item.consoleId === consoleId,
  );
  if (consoleSelected) consoleSelected.customMoney = 0;
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
    } else if (state.dialog.name === "had-food") {
      state.dialog.btnAcceptText = "تایید";
      state.dialog.btnCancelText = "بازگشت";
      state.dialog.name = "payment-method";
      state.dialog.header = true;
      state.dialog.headerText = "روش پرداخت";
    } else if (state.dialog.name === "payment-method") {
      state.dialog.status = false;
      requestPaymentMethod();
    }
    ////////////////////////////////////////
  } else {
    if (state.dialog.name === "had-food") {
      const bill_foods: billFood[] | [] | undefined = homeData.value?.find(
        ({ billId }) => billId === state.consoleSelected.billId,
      )?.bill_foods;
      state.consoleSelected.billFoods = bill_foods ?? [];
      state.dialog.btnAcceptText = "تایید";
      state.dialog.btnCancelText = "بازگشت";
      state.dialog.name = "food";
    } else {
      handleCloseDialog();
    }
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
    state.consoleSelected.costFood = 0;
    state.consoleSelected.costPlayed = 0;
    state.consoleSelected.customMoney = 0;
    state.dialog.btnCancelText = "بازگشت";
    state.dialog.btnAcceptText = "تایید";
    state.dialog.headerText = "";
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
    currentDateTime.getTime() + tehranOffset,
  ).toISOString();
  return tehranTime;
};
////////////////////////////////
</script>
<template>
  <div class="parent-home-page">
    <!-- //////////////////////////////////// -->
    <tools @displayMode="pinia.handleChangeDisplayMood($event)" />
    <!-- //////////////////////////////////// -->
    <transition-fade group class="w-full overflow-y-auto h-full">
      <div v-if="homeData?.length" class="parent-console">
        <component
          :is="pinia.state.displayMood === 1 ? consoleLine : consoleBox"
          @changeHourRate="handleChangeHourRate"
          :dropListStatus="item.dropListStatus"
          @optionStatus="handleOptionStatus"
          @changeStartTime="handleStartTime"
          :optionStatus="item.optionStatus"
          @removeAlarm="handleRemoveAlarm"
          @changeMoney="handleChangeMoney"
          :alarmStatus="item.alarmStatus"
          :customMoney="item.customMoney"
          @removeBill="handleRemoveBill"
          @status="handleConsoleStatus"
          :costPlayed="item.costPlayed"
          :consoleId="item.consoleId"
          :hourRate="item.hourRate"
          :bill_foods="item.bill_foods"
          :costFood="item.costFood"
          v-for="item in homeData
            .slice()
            .sort((a, b) => a.name.localeCompare(b.name))"
          :loading="item.loading"
          @factor="handleFactor"
          :status="item.status"
          @food="handleSetFood"
          :billId="item.billId"
          :key="item.consoleId"
          @alarm="handleAlarm"
          :timer="item.timer"
          :name="item.name"
          :isDeleted="item.isDeleted"
        />
      </div>
      <div class="parent-no-data" v-else-if="homeData">
        <div class="card-no-data">
          <p>برای استفاده از برنامه باید حداقل یک</p>
          <button
            class="button bg-[#7CC078] text-white p-1"
            @click="router.push('/console')"
          >
            <div class="flex items-center gap-x-[5px]">
              <p class="text-white font-[kalameh]">دستگاه</p>
              <img src="/assets/console.svg" />
            </div>
          </button>
          <p>و</p>
          <button
            class="button bg-[#7CC078] text-white p-1"
            @click="router.push('/money')"
          >
            <div class="flex items-center gap-x-[5px]">
              <p class="text-white font-[kalameh]">قیمت واحد</p>
              <img src="/assets/money.svg" />
            </div>
          </button>
          <p>ایجاد کنید.</p>
        </div>
      </div>
      <loading v-else />
    </transition-fade>
    <!-- //////////////////////////////////// -->
    <Dialog
      :btnCancelText="state.dialog.btnCancelText"
      :btnAcceptText="state.dialog.btnAcceptText"
      :headerText="state.dialog.headerText"
      @changeStatus="handleDialogStatus"
      :loading="state.dialog.loading"
      :header="state.dialog.header"
      :status="state.dialog.status"
      :footer="state.dialog.footer"
      :width="state.dialog.width"
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
      <p
        v-if="state.dialog.name === 'removeBill'"
        class="p-1 pt-4 text-lg font-bold text-center"
      >
        فاکتور مورد نظر حذف شود؟
      </p>
      <!-- /////////////////////////// -->

      <!-- /////////////////////////// -->
      <Factor
        :customMoney="state.consoleSelected.customMoney"
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
      <transition-expand group>
        <p
          class="p-3 text-center text-lg font-bold text-[1rem]"
          v-if="state.dialog.name === 'had-food'"
        >
          خوراکی ها ثبت شده است؟
        </p>
        <!-- /////////////////////////// -->
        <Food
          @foodSelected="(food) => (state.consoleSelected.foodSelected = food)"
          :billFood="state.consoleSelected.billFoods"
          v-if="state.dialog.name === 'food'"
        />
        <!-- /////////////////////////// -->
        <div
          class="w-full flex justify-center items-center"
          v-if="state.dialog.name === 'payment-method'"
        >
          <InputRadio
            @payment-method="
              (value) => (state.consoleSelected.payment_method = value)
            "
          />
        </div>
      </transition-expand>
      <!-- /////////////////////////// -->
      <ChangeMoney
        :customMoney="state.consoleSelected.customMoney"
        :costPlayed="state.consoleSelected.costPlayed"
        :consoleId="state.consoleSelected.consoleId"
        v-if="state.dialog.name === 'change-money'"
        :costFood="state.consoleSelected.costFood"
        @removeMoney="handleRemoveMoney"
        @money="handleSetCustomMoney"
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

.parent-no-data {
  @apply w-full h-full flex justify-center items-center;
}

.card-no-data {
  @apply p-3 flex max-w-[300px] flex-wrap justify-start font-[kalameh] items-center gap-[5px] rounded-md shadow-lg bg-[#1d5b79] text-white;
}
</style>
