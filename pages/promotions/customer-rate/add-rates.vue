<script setup>
import ratesForm from '@/components/promotions/ratesForm.vue';
definePageMeta({
  middleware: "auth",
  permission: "customerRates.store"
})
</script>
<template>
  <ratesForm :isEdit="false" />
</template>

