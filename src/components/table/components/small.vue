<template>
  <div class="parent-small-table">
    <slot />
  </div>
</template>
<style>
.parent-small-table {
  @apply flex flex-col justify-start items-center gap-y-[10px];
}
.small-table {
  @apply flex shadow-sm w-[300px] border border-dashed border-white justify-between items-start gap-x-[10px] rounded-[10px] p-[15px];
  background: rgba(29, 91, 121, 0.1);
}
.small-table-right {
  @apply flex flex-col gap-y-[10px] font-[dana] items-start font-bold text-[15px];
}
.small-table-left {
  @apply flex flex-col gap-y-[10px] font-[kalameh] items-end text-[13px];
}
.small-table > div > div {
  @apply h-[30px];
}
</style>
