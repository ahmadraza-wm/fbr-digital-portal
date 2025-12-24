<script setup>
import { useRoute } from 'vue-router'
import ratesForm from '@/components/promotions/ratesForm.vue';
import AuditLog from '@/components/AuditLog.vue';
definePageMeta({
  middleware: "auth",
  permission: "customerRates.update"
})
const route = useRoute()
const customerRateId = route.params.id
</script>
<template>
  <ratesForm :isEdit="true" />
<AuditLog module="CustomerRate" :id="customerRateId" class="mt-6" />
</template>

