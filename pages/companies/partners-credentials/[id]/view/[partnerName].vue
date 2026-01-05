<script setup>
import { computed, onMounted, watch } from "vue";
import { useRoute } from "vue-router";
import { usePartnerMappings } from "@/composables/UsePartnerMappings";
const { fetchCompanyCredentialDetailsById, CredentialsDetails } = usePartnerMappings();

definePageMeta({
  middleware: "auth",
  permission: "company_partner_credentials.show"
})
const route = useRoute();

const formatDate = (date) => {
  if (!date) return '---'

  const d = new Date(date)
  if (isNaN(d)) return '---'

  return d.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

onMounted(async () => {
  await fetchCompanyCredentialDetailsById(route.params.id, route.params.partnerName);
});

</script>
<template>
  <v-card class="mb-4">
    <v-row>
      <v-col cols="12">
        <v-card-title class="border-b-sm d-flex align-center bg-primary">
          <BackNavigation color="text-white" />
          <h4 class="text-h5 py-3 text-white">Partner Details</h4>
        </v-card-title>
      </v-col>
    </v-row>
    <v-card-text class="px-0 pt-0">
      <v-row class="border-b-md px-5">
        <v-col cols="6" sm="4" class="pb-1">
          <p class="font-weight-medium text-color mb-0 lh-22">Partner</p>
          <p class="font-weight-medium mb-0 lh-22 text-color1">{{ CredentialsDetails?.integration_method || "---" }}</p>
        </v-col>
        <v-col cols="6" sm="4" class="pb-1">
          <p class="font-weight-medium text-color mb-0 lh-22">Personal Credentials</p>
          <p class="font-weight-medium mb-0 lh-22 text-color1">
            <VChip :color="CredentialsDetails?.personal_credentials == 1 ? 'warning' : 'error'"
              class="font-weight-medium" size="small" variant="elevated">
              {{ CredentialsDetails?.personal_credentials == 1 ? "Yes" : "No" }}
            </VChip>
          </p>
        </v-col>
        <v-col cols="6" sm="4" class="pb-1">
          <p class="font-weight-medium text-color mb-0 lh-22">Status</p>
          <p class="font-weight-medium mb-0 lh-22 text-color1">
            <VChip :color="CredentialsDetails?.status == 1 ? 'success' : 'error'" class="font-weight-medium"
              size="small" variant="elevated">
              {{ CredentialsDetails?.status == 1 ? "Active" : "Inactive" }}
            </VChip>
          </p>
        </v-col>
      </v-row>
      <v-row class="border-b-md px-5">
        <v-col cols="6" sm="4" class="pb-1">
          <p class="font-weight-medium text-color mb-0 lh-22">Base Url</p>
          <p class="font-weight-medium mb-0 lh-22 text-color1">{{ CredentialsDetails?.baseUrl || "---" }}</p>
        </v-col>
        <v-col cols="6" sm="4" class="pb-1">
          <p class="font-weight-medium text-color mb-0 lh-22">Api Key</p>
          <p class="font-weight-medium mb-0 lh-22 text-color1">{{ CredentialsDetails?.apiKey || "---" }}</p>
        </v-col>
        <v-col cols="6" sm="4" class="pb-1">
          <p class="font-weight-medium text-color mb-0 lh-22">Api Secret</p>
          <p class="font-weight-medium mb-0 lh-22 text-color1">{{ CredentialsDetails?.secretKey || "---" }}</p>
        </v-col>
      </v-row>
      <v-row class="border-b-md px-5">
        <v-col cols="6" sm="4" class="pb-1">
          <p class="font-weight-medium text-color mb-0 lh-22">Auth IP</p>
          <p class="font-weight-medium mb-0 lh-22 text-color1">{{ CredentialsDetails?.authIp || "---" }}</p>
        </v-col>
        <v-col cols="6" sm="4" class="pb-1">
          <p class="font-weight-medium text-color mb-0 lh-22">Created At</p>
          <p class="font-weight-medium mb-0 lh-22 text-color1">{{ formatDate(CredentialsDetails?.created_at) }}</p>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>
