<script setup>
import promotionsForm from '@/components/promotions/promotionsForm.vue';
import AuditLog from '@/components/AuditLog.vue'
definePageMeta({
  middleware: "auth",
  permission: "promotions.update"
})
const route = useRoute()
const promotionId = route.params.id

</script>
<template>
  <promotionsForm :isEdit="true" />
    <AuditLog
   
      module="Promotion"
      :id="promotionId"
      class="mt-4"
    />
</template>
