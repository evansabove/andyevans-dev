<template>
  <div v-editable="blok" class="table-container">
    <table class="table">
      <thead>
        <tr>
          <th v-for="header in blok.Table.thead">{{ header.value }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="row in blok.Table.tbody">
          <td v-for="cell in row.body">{{ cell.value }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
defineProps({ blok: Object })
</script>

<style scoped>
table {
  @apply w-full;
  @apply border border-purple-900 rounded-md border-separate;
  @apply mb-10;
}

td,
th {
  @apply border-t border-l border-purple-900;
  @apply text-left;
  @apply p-2;
}

th {
  @apply border-t-0;
}

td:first-child,
th:first-child {
  @apply border-l-0;
}
</style>