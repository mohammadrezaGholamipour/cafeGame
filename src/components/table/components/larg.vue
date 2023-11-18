<script setup lang="ts">
const props = defineProps(["header"]);
</script>
<template>
  <table class="table-larg">
    <thead class="sticky top-0">
      <tr>
        <td v-for="(header, index) in props.header" :key="index">
          {{ header }}
        </td>
      </tr>
    </thead>
    <tbody>
      <slot />
    </tbody>
  </table>
</template>
<style>
.table-larg {
  @apply w-full p-[10px] shadow-sm text-center rounded-[5px] overflow-y-auto;
}
.table-larg thead tr td {
  @apply font-[dana] text-white font-bold text-[15px] whitespace-nowrap;
  background-color: rgba(29, 91, 121, 1);
}
.table-larg thead tr td:last-child{
  @apply rounded-tl-lg
}
.table-larg thead tr td:first-child{
  @apply rounded-tr-lg
}
.table-larg td {
  @apply px-[5px] py-[10px] text-[13px] font-[kalameh];
}
.table-larg tr {
  @apply border-b border-dashed;
}
.table-larg tr:nth-child(even) {
  background: rgba(29, 91, 121, 0.1);
}
</style>
