<script setup>
import { ref, onMounted } from 'vue'
import CompanyForm from '@/components/CompanyForm.vue';
definePageMeta({
  middleware: "auth",
  permission: "companies.update"
})
</script>

<template>
  <v-card>
    <v-card-title class="mb-4 d-flex align-center bg-primary">
      <BackNavigation color="text-white" />
      <h4 class="text-h5 py-3 text-white">Update Company</h4>
    </v-card-title>
    <v-card-text>
      <CompanyForm isEdit="true" />
    </v-card-text>
  </v-card>
</template>
