<script setup>
import { ref, onMounted } from 'vue'
import walletForm from '@/components/wallets/walletForm.vue';
definePageMeta({
  middleware: "auth",
  permission: "wallets.create"
})
</script>

<template>
    <v-card>
        <v-card-title class="mb-4 d-flex align-center bg-primary">
            <h4 class="text-h5 py-3 text-white">Create Wallet</h4>
        </v-card-title>
        <v-card-text>
          <walletForm/>
        </v-card-text>
    </v-card>
</template>
