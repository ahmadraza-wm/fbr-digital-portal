<script setup>
import GatewayForm from '@/components/gateways/gatewayForm.vue';
import BackNavigation from "@/@core/components/BackNavigation.vue";
definePageMeta({
  middleware: "auth",
  permission: "gateways.store"
})
</script>

<template>
<v-card>
    <v-card-title class="border-b-sm d-flex lign-center">
        <BackNavigation />
       <h4 class="text-h5 py-2 px-1">Add Gateway</h4>
    </v-card-title>
    <v-card-text class="py-5">
        <GatewayForm  mode="create" />
    </v-card-text>
</v-card>

</template>

