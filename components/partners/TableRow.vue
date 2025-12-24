<script setup>
const { headers, options, userList } = defineProps({
  headers: Array,
  options: Object,
  userList: Array
});


</script>

<template>
  <VDataTable
    class="partner-list"
    :headers="headers"
    :items="user"
    :items-per-page="options.itemsPerPage"
    :page="options.page"
    :options="options"
  />
</template>

