<script setup>
import GatewayForm from "@/components/gateways/gatewayForm.vue";
</script>
<template>
  <v-card>
    <v-card-title class="border-b-sm">
      <h4 class="text-h5 py-2 px-2">Edit Gateway</h4>
    </v-card-title>
    <v-card-text class="py-5">
      <GatewayForm :isEdit="true" />
    </v-card-text>
  </v-card>
</template>
