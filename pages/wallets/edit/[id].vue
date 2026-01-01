<script setup>
import { ref, onMounted } from 'vue'
import walletForm from '@/components/wallets/walletForm.vue';
definePageMeta({
  middleware: "auth",
  permission: "wallets.update"
})
</script>

<template>
  <v-card>
    <v-card-title class="mb-4 d-flex align-center bg-primary">
      <BackNavigation color="text-white" />
      <h4 class="text-h5 py-3 text-white">Upadate Wallet</h4>
    </v-card-title>
    <v-card-text>
      <walletForm :isEdit="true" />
    </v-card-text>
  </v-card>
</template>
