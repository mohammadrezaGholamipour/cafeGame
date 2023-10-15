<script setup lang="ts">
import { filterNumbersWithSep } from "@/utils/convert-number";
import { useForm, useField } from "vee-validate";
import type { food } from "@/types/index";
import { usePinia } from "@/store/pinia";
import { reactive, watch } from "vue";
import * as yup from "yup";
////////////////////////////
const props = defineProps<{
  data: { status: boolean; food: food };
}>();
const emit = defineEmits<{
  close: [];
  update: [food: food];
  new: [food: food];
}>();
/////////////////////////////
let timer: ReturnType<typeof setTimeout>;
const pinia = usePinia();
const state = reactive({
  schema: yup.object({
    name: yup.string().required("لطفا نام محصول را وارد کنید"),
    cost: yup.string().required("لطفا قیمت محصول را وارد کنید"),
    id: yup.number(),
  }),
});
////////////////////////////////////////
const { handleSubmit } = useForm({ validationSchema: state.schema });
const { value: name } = useField("name");
const { value: cost } = useField("cost");
const { value: id } = useField("id");
////////////////////////////////////
function onInvalidSubmit({ errors }) {
  const error: string[] = Object.values(errors);
  pinia.handleNotification({
    ...pinia.state.notification,
    name: "error",
    status: true,
    textHeader: "خطا",
    textMain: error[0],
  });
}
/////////////////////////////////
const handleFood = () => {
  clearTimeout(timer);
  timer = setTimeout(
    handleSubmit((values: food) => {
      values.cost = values.cost.replace(",", "");
      if (props.data.food.id) {
        values.id = props.data.food.id;
        emit("update", values);
      } else {
        values.id = 0;
        emit("new", values);
      }
      emit("close");
    }, onInvalidSubmit),
    1000
  );
};
////////////////////////////////
const handleDialogStatus = (status: boolean) => {
  if (status) {
    handleFood();
  } else {
    emit("close");
  }
};
/////////////////////////////
watch(
  () => props.data,
  () => {
    name.value = props.data.food.name;
    cost.value = props.data.food.cost;
    id.value = props.data.food.id;
  },
  { deep: true }
);
/////////////////////////////
watch(
  () => cost.value,
  (value) => {
    cost.value = filterNumbersWithSep(value);
  }
);
/////////////////////////////
</script>
<template>
  <Dialog
    @changeStatus="handleDialogStatus"
    :status="props.data.status"
    :btnCancelText="'بازگشت'"
    :btnAcceptText="'تایید'"
    :btnAccept="true"
    :btnCancel="true"
    :header="false"
    :footer="true"
    :width="300"
  >
    <!-- ///////////////////// -->
    <div class="w-full flex flex-col gap-y-[10px] items-center justify-center">
      <input
        class="input min-w-[200px] bg-white"
        placeholder="نام محصول"
        v-model="name"
        type="text"
      />
      <input
        class="input min-w-[200px] bg-white"
        placeholder="قیمت محصول"
        v-model="cost"
        type="text"
      />
    </div>
    <!-- ///////////////////// -->
  </Dialog>
</template>
<style scoped></style>
