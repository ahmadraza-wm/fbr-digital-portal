<script setup>
import { computed, onMounted, watch } from "vue";
import { useRoute } from "vue-router";
import { usePartners } from "@/composables/usePartners";
const { fetchPartnerDetailsById, loading, partnerDetail } = usePartners();

const permissionStore = usePermissionStore()

definePageMeta({
  middleware: "auth",
  permission: "partners.show"
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
  await fetchPartnerDetailsById(route.params.id);
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
        <v-col cols="6" sm="4" md="3" class="pb-1">
          <p class="font-weight-medium text-color mb-0 lh-22">Partner Name</p>
          <p class="font-weight-medium mb-0 lh-22 text-color1">{{ partnerDetail?.name || "---" }}</p>
        </v-col>
        <v-col cols="6" sm="4" md="3" class="pb-1">
          <p class="font-weight-medium text-color mb-0 lh-22">Partner Prefix</p>
          <p class="font-weight-medium mb-0 lh-22 text-color1">{{ partnerDetail?.prefix || "---" }}</p>
        </v-col>
        <v-col cols="6" sm="4" md="3" class="pb-1">
          <p class="font-weight-medium text-color mb-0 lh-22">Partner Type</p>
          <p class="font-weight-medium mb-0 lh-22 text-color1">{{ partnerDetail?.partner_type || "---" }}</p>
        </v-col>
        <v-col cols="6" sm="4" md="3" class="pb-1">
          <p class="font-weight-medium text-color mb-0 lh-22">Status</p>
          <p class="font-weight-medium mb-0 lh-22 text-color1">
            <VChip :color="partnerDetail?.status == 1 ? 'success' : 'error'" class="font-weight-medium" size="small"
              variant="elevated">
              {{ partnerDetail?.status == 1 ? "Active" : "Inactive" }}
            </VChip>
          </p>
        </v-col>
      </v-row>
      <v-row class="border-b-md px-5">
        <v-col cols="6" sm="4" md="3" class="pb-1">
          <p class="font-weight-medium text-color mb-0 lh-22">Settlement Currency</p>
          <p class="font-weight-medium mb-0 lh-22 text-color1">{{ partnerDetail?.settlement_currency || "---" }}</p>
        </v-col>
        <v-col cols="6" sm="4" md="3" class="pb-1">
          <p class="font-weight-medium text-color mb-0 lh-22">Country</p>
          <p class="font-weight-medium mb-0 lh-22 text-color1">{{ partnerDetail?.country?.name || "---" }}</p>
        </v-col>
        <v-col cols="6" sm="4" md="3" class="pb-1">
          <p class="font-weight-medium text-color mb-0 lh-22">Integration Method</p>
          <p class="font-weight-medium mb-0 lh-22 text-color1">{{ partnerDetail?.integration_method || "---" }}</p>
        </v-col>
        <v-col cols="6" sm="4" md="3" class="pb-1">
          <p class="font-weight-medium text-color mb-0 lh-22">Receiving Methods</p>
          <p class="font-weight-medium mb-0 lh-22 text-color1">
          <div v-if="partnerDetail?.receiving_methods?.length">
            <VChip v-for="(method, index) in partnerDetail.receiving_methods" :key="index" class="me-1 text-capitalize" color="primary"
              size="small">
              {{ method }}
            </VChip>
          </div>
          <div v-else>
            ---
          </div>
          </p>
        </v-col>
      </v-row>
      <v-row class="border-b-md px-5">
        <v-col cols="6" sm="4" md="3" class="pb-1">
          <p class="font-weight-medium text-color mb-0 lh-22">Created At</p>
          <p class="font-weight-medium mb-0 lh-22 text-color1">{{ formatDate(partnerDetail?.created_at) }}</p>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>
