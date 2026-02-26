<script setup lang="ts">
import { consolePageStep, highlighter } from "@/utils/highlight.js";
import type { consoleTypeApi, bill } from "@/types/index";
import ConsoleLine from "./components/console-line.vue";
import ConsoleBox from "./components/console-box.vue";
import { computed, reactive, onMounted } from "vue";
import loading from "@/components/loading.vue";
import tools from "./components/tools.vue";
import consoleApi from "@/api/console.js";
import { usePinia } from "@/store/pinia";

/////////////////////////////////////
const pinia = usePinia();
const state = reactive({
  requestLoading: false,
  removeConsole: {
    consoleSelected: {
      id: 0,
      name: "",
    },
    dialogStatus: false,
  },
});
///////////////////////////
onMounted(() => consolePageStep());
///////////////////////////
const consoleData = computed(() => {
  if (
    (Array.isArray(pinia.state.console), Array.isArray(pinia.state.allBill))
  ) {
    return pinia.state.console.map(
      ({ id, name, is_deleted }: consoleTypeApi) => {
        /////////////////////////////
        const item = {
          id: 0,
          name: "",
          isDeleted: false,
          playedCost: 0,
          playedTime: { hours: 0, minutes: 0, seconds: 0 },
        };
        ////////////////////////////
        const billData = pinia.state.allBill as bill[];
        const closedBills = billData.filter((bill: bill) => bill.end_time);
        /////////////////////////
        for (const bill of closedBills) {
          if (bill.console_id === id) {
            const startTime = new Date(bill.start_time).getTime();
            const endTime = new Date(bill.end_time).getTime();
            let delta = Math.abs(endTime - startTime) / 1000;
            ////////////////////////////
            let days = Math.floor(delta / 86400);
            delta -= days * 86400;
            let hours = Math.floor(delta / 3600) % 24;
            delta -= hours * 3600;
            let minutes = Math.floor(delta / 60) % 60;
            delta -= minutes * 60;
            let seconds = Math.floor(delta % 60);
            //////////////////////////////
            item.playedTime.hours += hours;
            item.playedTime.minutes += minutes;
            item.playedTime.seconds += seconds;
            if (item.playedTime.minutes >= 60) {
              item.playedTime.hours += Math.floor(item.playedTime.minutes / 60);
              item.playedTime.minutes %= 60;
            }
            if (item.playedTime.seconds >= 60) {
              item.playedTime.minutes += Math.floor(
                item.playedTime.seconds / 60,
              );
              item.playedTime.seconds %= 60;
            }
            item.playedCost += bill.total_price;
          }
        }
        // /////////////////////////
        item.name = name;
        item.id = id;
        item.isDeleted = is_deleted;
        return item;
      },
    );
  }
});
///////////////////////////
const requestRemoveConsole = () => {
  state.requestLoading = true;
  consoleApi
    .delete(state.removeConsole.consoleSelected.id)
    .then(() => {
      pinia.requestGetConsole();
      pinia.handleNotification({
        ...pinia.state.notification,
        name: "info",
        status: true,
        textHeader: "اعلان",
        textMain: "دستگاه حذف شد",
      });
    })
    .catch((errors: any) => {
      pinia.handleNotification({
        ...pinia.state.notification,
        timer: 3000,
        name: "error",
        status: true,
        textHeader: "خطا",
        textMain: `${errors?.response?.data?.error[0]?.message || "خطای نامشخص"}`,
      });
    })
    .finally(() => {
      state.requestLoading = false;
    });
};
///////////////////////////
const requestNewConsole = async () => {
  state.requestLoading = true;
  consoleApi
    .new()
    .then(() => {
      pinia.requestGetConsole();
      pinia.handleNotification({
        ...pinia.state.notification,
        name: "success",
        status: true,
        textHeader: "موفق",
        textMain: "دستگاه جدید اضافه شد",
      });
      setTimeout(() => {
        consolePageStep(1);
      }, 500);
    })
    .catch((errors: any) => {
      pinia.handleNotification({
        ...pinia.state.notification,
        timer: 3000,
        name: "error",
        status: true,
        textHeader: "خطا",
        textMain: `${errors?.response?.data?.error[0]?.message || "خطای نامشخص"}`,
      });
    })
    .finally(() => {
      state.requestLoading = false;
    });
};
///////////////////////////
const handleStatusDialog = (status: boolean) => {
  if (status) {
    requestRemoveConsole();
  }
  state.removeConsole.dialogStatus = false;
  setTimeout(() => {
    state.removeConsole.consoleSelected = {
      id: 0,
      name: "",
    };
  }, 500);
};
///////////////////////////
const handleRemoveConsole = (console: consoleTypeApi) => {
  if (!highlighter.isActive()) {
    state.removeConsole.consoleSelected = console;
    state.removeConsole.dialogStatus = true;
  }
};
///////////////////////////
</script>
<template>
  <div class="parent-console-page">
    <!-- /////////////////////////////////////// -->
    <tools
      @displayMode="pinia.handleChangeDisplayMood($event)"
      :loading="state.requestLoading"
      @new="requestNewConsole"
    />
    <!-- ////////////////////////////////////////// -->
    <transition-fade group class="w-full overflow-y-auto h-full">
      <div v-if="consoleData?.length" class="parent-console">
        <component
          :is="pinia.state.displayMood === 1 ? ConsoleLine : ConsoleBox"
          @remove="handleRemoveConsole(console)"
          :loading="state.requestLoading"
          v-for="console in consoleData.sort((a, b) =>
            a.name.localeCompare(b.name),
          )"
          :name="console.name"
          :id="console.id"
          :playedCost="console.playedCost"
          :playedTime="console.playedTime"
          :key="console.id"
          :isDeleted="console.isDeleted"
        />
      </div>
      <img
        src="@/assets/image/noData.svg"
        v-else-if="consoleData"
        class="w-full h-full"
      />
      <loading v-else />
    </transition-fade>
    <!-- //////////////////////////////////////// -->
    <Dialog
      :status="state.removeConsole.dialogStatus"
      @changeStatus="handleStatusDialog"
      :btnCancelText="'بازگشت'"
      :btnAcceptText="'تایید'"
      :btnAccept="true"
      :btnCancel="true"
      :loading="false"
      :header="false"
      :footer="true"
      :width="300"
    >
      <p class="p-1 text-center">
        {{
          `دستگاه شماره ${state.removeConsole.consoleSelected.name} حذف شود؟`
        }}
      </p>
    </Dialog>
  </div>
</template>
<style scoped>
.parent-console-page {
  @apply w-full h-full flex flex-col justify-start items-start;
}
</style>
