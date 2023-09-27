<script setup lang="ts">
import { useForm, useField } from "vee-validate";
import { usePinia } from "@/store/pinia";
import { reactive } from "vue";
import * as yup from "yup";
//////////////////////////////
let timer: ReturnType<typeof setTimeout>;
const pinia = usePinia();
const state = reactive({
  schema: yup.object({
    email: yup
      .string()
      .required("ایمیل خود را وارد کنید")
      .email("ایمیل معتبر نمیباشد"),
    password: yup.string().required("رمز خود را وارد کنید"),
  }),
});
////////////////////////////////////////
const { handleSubmit } = useForm({ validationSchema: state.schema });
const { value: password } = useField("password");
const { value: email } = useField("email");
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
const handleLogin = () => {
  clearTimeout(timer);
  timer = setTimeout(
    handleSubmit((values: object) => {
      console.log(values);
    }, onInvalidSubmit),
    1000
  );
};
</script>
<template>
  <div class="parent-login">
    <!-- //////////////////////// -->
    <div class="parent-inputs">
      <div class="input-and-title">
        <p>ایمیل:</p>
        <input
          placeholder="ایمیل خود را وارد کنید"
          v-model="email"
          class="input"
        />
      </div>
      <div class="input-and-title">
        <p>رمز عبور:</p>
        <input
          placeholder="رمز عبور خود را وارد کنید"
          v-model="password"
          class="input"
        />
      </div>
    </div>
    <!-- //////////////////////// -->
    <button class="button bg-[#75ca71] text-white" @click="handleLogin">
      وارد شدن
    </button>
  </div>
</template>
<style scoped>
.parent-login {
  @apply flex flex-col w-full max-w-[300px] justify-start items-center gap-y-[20px];
}
.parent-inputs {
  @apply w-full flex flex-col justify-start items-center;
}
.input-and-title {
  @apply w-full flex flex-col items-start gap-y-[5px];
}
.input-and-title p {
  @apply font-[kalameh] font-bold;
}
</style>
