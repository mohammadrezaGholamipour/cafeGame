<script setup lang="ts"></script>
<template>
  <div class="parent-login">
    <!-- //////////////////////// -->
    <div class="parent-inputs">
    <div class="input-and-title">
      <p>ایمیل:</p>
      <input placeholder="ایمیل خود را وارد کنید" class="input" />
    </div>
    <div class="input-and-title">
      <p>رمز عبور:</p>
      <input placeholder="رمز عبور خود را وارد کنید" class="input" />
    </div>
    </div>
    <!-- //////////////////////// -->
    <button class="button bg-[#75ca71] text-white">وارد شدن</button>
  </div>
</template>
<style scoped>
.parent-login {
  @apply flex flex-col w-full max-w-[300px] justify-start items-center gap-y-[20px];
}
.parent-inputs{
  @apply w-full flex flex-col justify-start items-center
}
.input-and-title {
  @apply w-full flex flex-col items-start gap-y-[5px];
}
.input-and-title p {
  @apply font-[kalameh] font-bold;
}
</style>
