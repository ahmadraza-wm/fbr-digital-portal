<script setup>
import { ref, onMounted } from 'vue'
import DestinationsForm from '@/components/cashDestinations/DestinationsForm.vue';
definePageMeta({
  middleware: "auth",
  permission: "cash_destinations.create"
})
</script>

<template>
    <v-card>
        <v-card-title class="mb-4 d-flex align-center bg-primary">
            <h4 class="text-h5 py-3 text-white">Create Cash Destination</h4>
        </v-card-title>
        <v-card-text>
          <DestinationsForm/>
        </v-card-text>
    </v-card>
</template>
