<script setup lang="ts">
const props = defineProps(["header"]);
</script>
<template>
  <table class="table-larg">
    <thead>
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
  @apply w-full p-[10px] shadow-sm bg-white text-center rounded-[5px] overflow-hidden;
}
.table-larg thead tr td {
  @apply font-[dana] font-bold text-[15px];
  background-color: rgba(29, 91, 121, 0.2);
}
.table-larg td {
  @apply p-[10px] text-[13px] font-[kalameh];
}
.table-larg tr {
  @apply border-b border-dashed;
}
.table-larg tr:nth-child(even) {
  background: rgba(29, 91, 121, 0.1);
}
</style>
