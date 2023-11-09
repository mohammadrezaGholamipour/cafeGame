<script setup lang="ts">
import { moneyPageStep, highlighter } from "@/utils/highlight.js";
import { filterNumbersWithSep } from "@/utils/convert-number";
import PersianNumberToString from "persian-number-tostring";
import { computed, reactive, watch, onMounted } from "vue";
import Table from "@/components/table/index.vue";
import loading from "@/components/loading.vue";
import hourRateApi from "@/api/hourRate.js";
import tools from "./components/tools.vue";
import { usePinia } from "@/store/pinia";
///////////////////////////////////////
const pinia = usePinia();
const state = reactive({
  loading: false,
  headerTable: ["ردیف", "قیمت به عدد", "قیمت به حروف", "عملیات"],
  dialog: {
    name: "",
    hourRateId: 0,
    newHourRate: "",
    status: false,
  },
});
///////////////////////////////////////
onMounted(() => moneyPageStep());
///////////////////////////////////////
const hourRateData = computed(() => {
  if (Array.isArray(pinia.state.hourRate)) {
    return pinia.state.hourRate;
  }
});
//////////////////////////////////////
const requestNewHourRate = (): void => {
  state.loading = true;
  hourRateApi
    .new({
      id: 0,
      rate: state.dialog.newHourRate.replace(/,/g, ""),
    })
    .then(() => {
      pinia.requestGetHourRate(),
        pinia.handleNotification({
          ...pinia.state.notification,
          name: "success",
          status: true,
          textHeader: "موفق",
          textMain: "با موفقیت افزوده شد",
        });
      setTimeout(() => {
        moneyPageStep(1);
      }, 1000);
    })
    .catch(() => {
      pinia.handleNotification({
        ...pinia.state.notification,
        name: "error",
        status: true,
        textHeader: "خطا",
        textMain: "قیمت جدید اضافه نشد",
      });
    })
    .finally(() => {
      state.loading = false;
    });
};
///////////////////////////////////////////////
const requestRemoveHourRate = (): void => {
  state.loading = true;
  hourRateApi
    .delete(state.dialog.hourRateId)
    .then(() => {
      pinia.requestGetHourRate();
      pinia.handleNotification({
        ...pinia.state.notification,
        name: "info",
        status: true,
        textHeader: "اعلان",
        textMain: "قیمت مورد نظر حذف شد",
      });
    })
    .catch(() => {
      pinia.handleNotification({
        ...pinia.state.notification,
        name: "error",
        status: true,
        textHeader: "خطا",
        textMain: "قیمت مورد نظر حذف نشد",
      });
    })
    .finally(() => {
      state.loading = false;
    });
};
///////////////////////////////////////////////
const handleDialogStatus = (status: boolean) => {
  if (status) {
    if (state.dialog.name === "new") {
      if (state.dialog.newHourRate) {
        state.dialog.status = false;
        setTimeout(() => {
          state.dialog.newHourRate = "";
          state.dialog.hourRateId = 0;
          state.dialog.name = "";
        }, 500);
        requestNewHourRate();
      } else {
        pinia.handleNotification({
          ...pinia.state.notification,
          name: "error",
          status: true,
          textHeader: "خطا",
          textMain: "قیمت مورد نظر را وارد کنید",
        });
      }
    } else if (state.dialog.name === "remove") {
      state.dialog.status = false;
      setTimeout(() => {
        state.dialog.newHourRate = "";
        state.dialog.hourRateId = 0;
        state.dialog.name = "";
      }, 500);
      requestRemoveHourRate();
    }
  } else {
    state.dialog.status = false;
    setTimeout(() => {
      state.dialog.newHourRate = "";
      state.dialog.hourRateId = 0;
      state.dialog.name = "";
    }, 500);
  }
};
////////////////////////////
watch(
  () => state.dialog.newHourRate,
  (value) => {
    state.dialog.newHourRate = filterNumbersWithSep(value);
  }
);
////////////////////////////
const handleRemoveMoney = (hourRateId: number) => {
  if (!highlighter.isActive()) {
    state.dialog.hourRateId = hourRateId;
    state.dialog.name = "remove";
    state.dialog.status = true;
  }
};
////////////////////////////
</script>
<template>
  <div class="parent-money-page">
    <!-- //////////////////////// -->
    <tools
      @new="
        (state.dialog.name = 'new'),
          (state.dialog.status = true),
          moneyPageStep(999)
      "
      :loading="state.loading"
    />
    <!-- //////////////////////// -->
    <transition-fade group class="w-full overflow-y-auto h-full px-[10px]">
      <!-- //////////////////////// -->
      <Table v-if="hourRateData?.length" :header="state.headerTable">
        <template v-slot:Larg>
          <tr v-for="(hourRate, index) in hourRateData" :key="hourRate.id">
            <td>{{ index + 1 }}</td>
            <td>{{ hourRate.name.toLocaleString() }}</td>
            <td>{{ PersianNumberToString(hourRate.name) }} تومان</td>
            <td class="flex justify-center">
              <img
                @click="handleRemoveMoney(hourRate.id)"
                src="@/assets/image/table/remove.svg"
                class="cursor-pointer"
                id="remove"
              />
            </td>
          </tr>
        </template>
        <template v-slot:small>
          <div
            v-for="(hourRate, index) in hourRateData"
            :key="hourRate.id"
            class="small-table"
          >
            <div class="small-table-right">
              <div v-for="(header, index) in state.headerTable" :key="index">
                {{ header }} :
              </div>
            </div>
            <div class="small-table-left">
              <div>{{ index + 1 }}</div>
              <div>{{ hourRate.name.toLocaleString() }}</div>
              <div>{{ PersianNumberToString(hourRate.name) }} تومان</div>
              <div class="flex justify-center">
                <img
                  @click="handleRemoveMoney(hourRate.id)"
                  src="@/assets/image/table/remove.svg"
                  class="cursor-pointer"
                  id="remove"
                />
              </div>
            </div>
          </div>
        </template>
      </Table>
      <!-- //////////////////////// -->
      <img
        src="@/assets/image/noData.svg"
        v-else-if="hourRateData"
        class="w-full h-full"
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
      :btnAccept="true"
      :btnCancel="true"
      :loading="false"
      :header="false"
      :footer="true"
      :width="300"
    >
      <!-- ////////////////////////// -->
      <div v-if="state.dialog.name === 'remove'" class="p-1 text-center">
        قیمت مورد نظر حذف شود؟
      </div>
      <!-- ////////////////////////// -->
      <div v-if="state.dialog.name === 'new'" class="p-1 w-full">
        <input
          placeholder="قیمت را به تومان وارد کنید"
          class="input min-w-full bg-white"
          v-model="state.dialog.newHourRate"
          inputmode="numeric"
          type="text"
          autofocus
        />
      </div>
      <!-- ////////////////////////// -->
    </Dialog>
    <!-- /////////////////////// -->
  </div>
</template>
<style scoped>
.parent-money-page {
  @apply w-full h-full flex flex-col justify-start items-start gap-y-[10px];
}
</style>
