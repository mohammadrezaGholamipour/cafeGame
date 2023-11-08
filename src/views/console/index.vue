<script setup lang="ts">
import localStorageService from "@/utils/local-storage-service";
import type { consoleTypeApi, bill } from "@/types/index";
import ConsoleLine from "./components/console-line.vue";
import { consolePageStep } from "@/utils/highlight.js";
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
  displayMode: 2,
  removeConsole: {
    consoleSelected: {
      id: 0,
      name: "",
    },
    dialogStatus: false,
  },
});
///////////////////////////
onMounted(() => {
  const highlight = localStorageService.getHighlight();
  if (!highlight.includes("console")) consolePageStep();
});
///////////////////////////
const consoleData = computed(() => {
  if (
    Array.isArray(pinia.state.console) &&
    Array.isArray(pinia.state.allBill)
  ) {
    return pinia.state.console.map(({ id, name }: consoleTypeApi) => {
      /////////////////////////////
      const item = {
        id: 0,
        name: "",
        playedCost: 0,
        playedTime: { hours: 0, minutes: 0, seconds: 0 },
      };
      ////////////////////////////
      const billData = pinia.state.allBill as bill[];
      const closedBills = billData.filter((bill: bill) => bill.endTime);
      /////////////////////////
      for (const bill of closedBills) {
        if (bill.systemId === id) {
          const startTime = new Date(bill.startTime).getTime();
          const endTime = new Date(bill.endTime).getTime();
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
            item.playedTime.minutes += Math.floor(item.playedTime.seconds / 60);
            item.playedTime.seconds %= 60;
          }
          item.playedCost += bill.finalCost - bill.foodCost;
        }
      }
      /////////////////////////
      item.name = name;
      item.id = id;
      return item;
    });
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
    .catch(() => {
      pinia.handleNotification({
        ...pinia.state.notification,
        name: "error",
        status: true,
        textHeader: "خطا",
        textMain: "امکان حذف دستگاه وجود ندارد",
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
    .new({
      id: 0,
      name: String((consoleData.value?.length || 0) + 1),
    })
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
    .catch(() => {
      pinia.handleNotification({
        ...pinia.state.notification,
        name: "error",
        status: true,
        textHeader: "خطا",
        textMain: "دستگاه جدید افزوده نشد",
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
</script>
<template>
  <div class="parent-console-page">
    <!-- /////////////////////////////////////// -->
    <tools
      @displayMode="state.displayMode = $event"
      :loading="state.requestLoading"
      @new="requestNewConsole"
    />
    <!-- ////////////////////////////////////////// -->
    <transition-fade group class="w-full overflow-y-auto h-full">
      <div v-if="consoleData?.length" class="parent-console">
        <component
          :is="state.displayMode === 1 ? ConsoleLine : ConsoleBox"
          @remove="
            (state.removeConsole.consoleSelected = console),
              (state.removeConsole.dialogStatus = true)
          "
          :playedCost="console.playedCost"
          :playedTime="console.playedTime"
          :loading="state.requestLoading"
          v-for="console in consoleData"
          :name="console.name"
          :id="console.id"
          :key="console.id"
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
