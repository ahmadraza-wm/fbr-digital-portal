<script setup>
import { ref, onMounted } from 'vue'
import CredentialsForm from '@/components/companies/CredentialsForm.vue';

definePageMeta({
  middleware: "auth",
  permission: "company_partner_credentials.create"
})
</script>

<template>
    <v-card>
        <v-card-title class="mb-4 d-flex align-center bg-primary">
            <h4 class="text-h5 py-3 text-white">Create Partner Credentials</h4>
        </v-card-title>
        <v-card-text>
            <CredentialsForm/>
        </v-card-text>
    </v-card>
</template>
