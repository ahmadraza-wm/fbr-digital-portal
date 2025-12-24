<script setup>
import { ref, onMounted } from "vue";
import PartnerForm from "@/components/partners/PartnerForm.vue";
import { useRoute } from "vue-router";
import BackNavigation from "@/@core/components/BackNavigation.vue";
definePageMeta({
  middleware: "auth",
  permission: "partners.update"
})
const route = useRoute();
const partnerData = ref(null);
const { $axios } = useNuxtApp();

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
  <v-card v-if="partnerData">
    <v-card-title class="d-flex align-center" style="background-color: lightgrey;">
      <BackNavigation />
      <h4 class="text-h5 py-3 px-2">Edit Partner</h4></v-card-title
    >
    <v-card-text class="mt-4">
      <PartnerForm :isEdit="true" :partnerData="partnerData" />
    </v-card-text>
  </v-card>
</template>
