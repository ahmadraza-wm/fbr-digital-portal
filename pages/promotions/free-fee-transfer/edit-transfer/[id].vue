<script setup>
import transferForm from '@/components/promotions/transferForm.vue';
import AuditLog from '@/components/AuditLog.vue'
definePageMeta({
  middleware: "auth",
  permission: "fee_free_transfers.update"
})
const route = useRoute()
const feeId = route.params.id
</script>
<template>
  <transferForm :isEdit="true" />
    <AuditLog
   
      module="FeeFreeTransfer"
      :id="feeId"
      class="mt-4"
    />
</template>
