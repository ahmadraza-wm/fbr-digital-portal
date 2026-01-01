<script setup>
import { ref, onMounted } from 'vue'
import BankForm from '@/components/banks/BankForm.vue';
definePageMeta({
  middleware: "auth",
  permission: "bank_partners.update"
})
</script>

<template>
  <v-card>
    <v-card-title class="mb-4 d-flex align-center bg-primary">
      <BackNavigation color="text-white" />
      <h4 class="text-h5 py-3 text-white">Update Bank</h4>
    </v-card-title>
    <v-card-text>
      <BankForm isEdit="true" />
    </v-card-text>
  </v-card>
</template>
