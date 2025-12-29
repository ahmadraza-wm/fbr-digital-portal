<script setup>
import { ref, onMounted } from 'vue'
import CompanyForm from '@/components/CompanyForm.vue';
definePageMeta({
  middleware: "auth",
  permission: "companies.create"
})
</script>

<template>
    <v-card>
        <v-card-title class="mb-4 d-flex align-center bg-primary">
            <h4 class="text-h5 py-3 text-white">Create Company</h4>
        </v-card-title>
        <v-card-text>
            <CompanyForm/>
        </v-card-text>
    </v-card>
</template>
