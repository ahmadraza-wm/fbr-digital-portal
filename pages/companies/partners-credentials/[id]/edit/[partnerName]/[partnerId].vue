<script setup>
import { ref, onMounted } from 'vue'
import CredentialsForm from '@/components/companies/CredentialsForm.vue';

definePageMeta({
  middleware: "auth",
  permission: "company_partner_credentials.update"
})
</script>

<template>
  <v-card>
    <v-card-title class="mb-4 d-flex align-center bg-primary">
      <BackNavigation color="text-white" />
      <h4 class="text-h5 py-3 text-white">Update Partner Credentials</h4>
    </v-card-title>
    <v-card-text>
      <CredentialsForm :isEdit="true" />
    </v-card-text>
  </v-card>
</template>
