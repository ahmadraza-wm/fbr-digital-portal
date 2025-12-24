<script setup>
import GatewayForm from '@/components/gateways/gatewayForm.vue';
import BackNavigation from "@/@core/components/BackNavigation.vue";
import AuditLog from '@/components/AuditLog.vue'

const route = useRoute()
const gatewayId = route.params.id
definePageMeta({
  middleware: "auth",
  permission: "gateways.update"
})
</script>

<template>
<v-card>
    <v-card-title  class="border-b-sm d-flex align-center">
        <BackNavigation />
       <h4 class="text-h5 py-2 px-1">Edit Gateway</h4>
    </v-card-title>
    <v-card-text class="py-5">
        <GatewayForm mode="edit"/>
    </v-card-text>
</v-card>
  <AuditLog module="Gateway" :id="gatewayId" class="mt-4"/>
</template>

