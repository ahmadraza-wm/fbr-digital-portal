<script setup>
import { ref, onMounted } from "vue";
import PartnerDetail from "@/components/partners/PartnerDetail.vue";
import { useRoute } from "vue-router";
const { $axios } = useNuxtApp();
import AuditLog from '@/components/AuditLog.vue'


const route = useRoute();
const partnerData = ref(null);

onMounted(async () => {
  try {
    const response = await $axios.get(`/partner/${route.params.id}`);
    partnerData.value = response.data.data;
  } catch (error) {
    console.error("Failed to fetch partner data", error);
  }
});
</script>
<template>
  <v-card>
    <v-row>
      <v-col cols="12">
        <v-card-title class="border-b-sm">
          <h4 class="text-h5 py-3">Partner Details</h4>
        </v-card-title>
      </v-col>
    </v-row>
    <v-card-text class="px-0">
      <!-- Pass partnerData as a prop -->
      <PartnerDetail v-if="partnerData" :partner="partnerData" />
    </v-card-text>
  </v-card>
  <v-card class="mt-6 px-0">
    <v-row>
      <v-col cols="12">
        <v-card-title class="border-b-sm">
          <h4 class="text-h5 py-3">Partner Balance</h4>
        </v-card-title>
      </v-col>
    </v-row>
    <v-card-text class="pb-10 px-0">
      <v-row class="border-b-sm px-5">
        <v-col cols="12" sm="6" md="4" class="pb-1">
          <p class="font-weight-medium text-color mb-0 lh-22">StatusCode</p>
          <p class="font-weight-medium mb-0 lh-22 text-color1">100</p>
        </v-col>
        <v-col cols="12" sm="6" md="4" class="pb-1">
          <p class="font-weight-medium text-color mb-0 lh-22">StatusDesc</p>
          <p class="font-weight-medium mb-0 lh-22 text-color1">Success</p>
        </v-col>
        <v-col cols="12" sm="6" md="4" class="pb-1">
          <p class="font-weight-medium text-color mb-0 lh-22">FundsAvailable</p>
          <p class="font-weight-medium mb-0 lh-22 text-color1">17,657.83</p>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
   <AuditLog
    module="Partner"
    :id="route.params.id"
    class="mt-4"
  />
</template>
