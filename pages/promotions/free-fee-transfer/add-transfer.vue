<script setup>
import transferForm from '@/components/promotions/transferForm.vue';
definePageMeta({
  middleware: "auth",
  permission: "fee_free_transfers.store"
})
</script>
<template>
  <transferForm :isEdit="false" />
</template>
