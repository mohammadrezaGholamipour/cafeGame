<script setup lang="ts">
import { useForm, useField } from "vee-validate";
import { usePinia } from "@/store/pinia";
import { reactive } from "vue";
import * as yup from "yup";
/////////////////////////
const emit = defineEmits<{ register: [data: object] }>();
const props = defineProps({
  loading: {
    type: Boolean,
    required: true,
  },
});
let timer: ReturnType<typeof setTimeout>;
const pinia = usePinia();
const state = reactive({
  schema: yup.object({
    userName: yup
      .string()
      .min(4, "حداقل چهار کاراکتر باید باشد")
      .required("نام و نام خانوادگی را وارد کنید")
      .test(
        "is-english",
        "لطفا نام و نام خانوادگی را به لاتین وارد کنید",
        (value) => /^[a-zA-Z\s]+$/.test(value)
      ),
    email: yup
      .string()
      .required("ایمیل خود را وارد کنید")
      .email("ایمیل معتبر نمیباشد"),
    password: yup
      .string()
      .min(4, "حداقل چهار کاراکتر باید باشد")
      .required("رمز خود را وارد کنید"),
    repeatPassword: yup
      .string()
      .oneOf([yup.ref("password"), null], "پسورد تکرار شده اشتباه است")
      .required("رمز خود را تکرار کنید"),
    mobile: yup
      .string()
      .matches(
        /^(((\+98|0098)-?)|0)9[0-9]{2}-?[0-9]{3}-?[0-9]{4}$/,
        "شماره تلفن صحیح نمیباشد"
      )
      .required("تلفن همراه خود را وارد کنید"),
  }),
});
///////////////////////////////////////////////////////////////////
const { handleSubmit } = useForm({ validationSchema: state.schema });
const { value: repeatPassword } = useField("repeatPassword");
const { value: userName } = useField("userName");
const { value: password } = useField("password");
const { value: mobile } = useField("mobile");
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
const handleRegister = () => {
  clearTimeout(timer);
  timer = setTimeout(
    handleSubmit((values): void => {
      values.userName = values.userName.replace(" ", "-");
      emit("register", values);
    }, onInvalidSubmit),
    1000
  );
};
</script>
<template>
  <div class="parent-register">
    <!-- //////////////////////// -->
    <div class="parent-inputs">
      <div class="input-and-title">
        <p>نام و نام خانوادگی:</p>
        <input
          placeholder="نام و نام خانوادگی خود را وارد کنید"
          v-model="userName"
          inputmode="text"
          class="input"
        />
      </div>
      <div class="input-and-title">
        <p>ایمیل:</p>
        <input
          placeholder="ایمیل خود را وارد کنید"
          inputmode="email"
          v-model="email"
          class="input"
          type="email"
        />
      </div>
      <div class="input-and-title">
        <p>رمز عبور:</p>
        <input
          placeholder="رمز عبور خود را وارد کنید"
          v-model="password"
          type="password"
          class="input"
        />
      </div>
      <div class="input-and-title">
        <p>تکرار رمز عبور:</p>
        <input
          placeholder="رمز عبور خود را تکرار کنید"
          v-model="repeatPassword"
          type="password"
          class="input"
        />
      </div>
      <div class="input-and-title">
        <p>تلفن همراه:</p>
        <input
          placeholder="تلفن همراه خود را وارد کنید"
          v-model="mobile"
          inputmode="tel"
          class="input"
          type="tel"
        />
      </div>
    </div>
    <!-- //////////////////////// -->
    <button
      :disabled="props.loading"
      :class="[
        'button bg-[#75ca71] text-white',
        { 'bg-gray-400 !cursor-not-allowed': props.loading },
      ]"
      @click="handleRegister"
    >
      <transition-fade class="flex" group>
        <span v-if="props.loading" class="btn-loader"></span>
        <p v-else>ثبت نام</p>
      </transition-fade>
    </button>
  </div>
</template>
<style scoped>
.parent-register {
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
