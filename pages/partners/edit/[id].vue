<script setup>
import { ref, onMounted } from 'vue'
import PartnerForm from '@/components/partners/PartnerForm.vue';
definePageMeta({
  middleware: "auth",
  permission: "partners.update"
})
</script>

<template>
  <v-card>
    <v-card-title class="mb-4 d-flex align-center bg-primary">
      <BackNavigation color="text-white" />
      <h4 class="text-h5 py-3 text-white">Upadate Partner</h4>
    </v-card-title>
    <v-card-text>
      <PartnerForm :isEdit="true" />
    </v-card-text>
  </v-card>
</template>
