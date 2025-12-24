<script setup>
import PayerForm from '@/components/partners/PayerForm.vue';
import BackNavigation from "@/@core/components/BackNavigation.vue";
import AuditLog from '@/components/AuditLog.vue'
definePageMeta({
  middleware: "auth",
  permission: "payers.update"
})
const permissionStore = usePermissionStore()

const route = useRoute()
const payerId = route.params.id

const desserts = [
  {
    id: "1",
    currency: "NEC Money Transfer",
    createdBy: "17 Dec 2024",
    createdAt: "17 Dec 2024",
  },
  {
    id: "2",
    currency: "NEC Money Transfer",
    createdBy: "17 Dec 2024",
    createdAt: "17 Dec 2024",
  },
  {
    id: "3",
    currency: "NEC Money Transfer",
    createdBy: "17 Dec 2024",
    createdAt: "17 Dec 2024",
  },
];
</script>

<template>
<v-card>
    <v-card-title class="border-b-sm d-flex align-center py-3 bg-grey">
     <BackNavigation />
       <h4 class="text-h5 py-2 px-2">Edit Payer</h4>
    </v-card-title>
    <v-card-text class="py-5">
        <PayerForm :isEdit="true" />
    </v-card-text>
</v-card>
 <AuditLog module="Payer" :id="payerId" class="mt-4"/>
</template>
