<script setup>
import { computed, onMounted, watch } from "vue";
import { useRoute } from "vue-router";
import { useCashDestinations } from "@/composables/useCashDestinations";
import { useWallets } from "@/composables/useWallets";
const { fetchDestinationDetailsById, DestDetail, fetchDestinationPartnersList, CashDestinationsList } = useCashDestinations();
const permissionStore = usePermissionStore()

definePageMeta({
  middleware: "auth",
  permission: "cash_destinations.show"
})
const route = useRoute();

const headers = ref([
  { title: "#", key: "sr_no" },
  { title: "Partner Name", key: "integration_method" },
  { title: "Reference Code", key: "reference_code" },
  { title: "Status", key: "status" },
  { title: "Created At", key: "created_at" },
]);

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
  await fetchDestinationDetailsById(route.params.id);
  if (permissionStore.hasPermission('cash_destination_partners.view')) {
    await fetchDestinationPartnersList(route.params.id);
  }
});

</script>
<template>
  <v-card class="mb-4">
    <v-row>
      <v-col cols="12">
        <v-card-title class="border-b-sm d-flex align-center bg-primary">
          <BackNavigation color="text-white" />
          <h4 class="text-h5 py-3 text-white">Cash Destination Details</h4>
        </v-card-title>
      </v-col>
    </v-row>
    <v-card-text class="px-0 pt-0">
      <v-row class="border-b-md px-5">
        <v-col cols="6" sm="4" md="3" class="pb-1">
          <p class="font-weight-medium text-color mb-0 lh-22">Destination Name</p>
          <p class="font-weight-medium mb-0 lh-22 text-color1">{{ DestDetail?.destination_name || "---" }}</p>
        </v-col>
        <v-col cols="6" sm="4" md="3" class="pb-1">
          <p class="font-weight-medium text-color mb-0 lh-22">Destination Code</p>
          <p class="font-weight-medium mb-0 lh-22 text-color1">{{ DestDetail?.destination_code || "---" }}</p>
        </v-col>
        <v-col cols="6" sm="4" md="3" class="pb-1">
          <p class="font-weight-medium text-color mb-0 lh-22">Status</p>
          <p class="font-weight-medium mb-0 lh-22 text-color1">
            <VChip :color="DestDetail?.status == 1 ? 'success' : 'error'" class="font-weight-medium" size="small"
              variant="elevated">
              {{ DestDetail?.status == 1 ? "Active" : "Inactive" }}
            </VChip>
          </p>
        </v-col>
        <v-col cols="6" sm="4" md="3" class="pb-1">
          <p class="font-weight-medium text-color mb-0 lh-22">Address</p>
          <p class="font-weight-medium mb-0 lh-22 text-color1">{{ DestDetail?.address || "---" }}</p>
        </v-col>
      </v-row>
      <v-row class="border-b-md px-5">
         <v-col cols="6" sm="4" md="3" class="pb-1">
          <p class="font-weight-medium text-color mb-0 lh-22">City</p>
          <p class="font-weight-medium mb-0 lh-22 text-color1">{{ DestDetail?.city_name || "---" }}</p>
        </v-col>
        <v-col cols="6" sm="4" md="3" class="pb-1">
          <p class="font-weight-medium text-color mb-0 lh-22">Country</p>
          <p class="font-weight-medium mb-0 lh-22 text-color1">{{ DestDetail?.country?.name || "---" }}</p>
        </v-col>
        <v-col cols="6" sm="4" md="3" class="pb-1">
          <p class="font-weight-medium text-color mb-0 lh-22">AnyWhere</p>
          <p class="font-weight-medium mb-0 lh-22 text-color1">
            <VChip :color="DestDetail?.anywhere == 1 ? 'warning' : 'error'" class="font-weight-medium" size="small"
              variant="elevated">
              {{ DestDetail?.anywhere == 1 ? "Yes" : "No" }}
            </VChip>
          </p>
        </v-col>
        <v-col cols="6" sm="4" md="3" class="pb-1">
          <p class="font-weight-medium text-color mb-0 lh-22">Created At</p>
          <p class="font-weight-medium mb-0 lh-22 text-color1">{{ formatDate(DestDetail?.created_at) }}</p>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
  <v-card class="mb-4" v-if="permissionStore.hasPermission('cash_destination_partners.view')">
    <v-row>
      <v-col cols="12">
        <v-card-title class="border-b-sm d-flex align-center justify-space-between bg-secondary">
          <h4 class="text-h5 py-3 text-white">Cash Destination Code</h4>
        </v-card-title>
      </v-col>
    </v-row>
    <v-card-text class="px-0 pb-0 pt-0">
      <v-data-table :headers="headers" :items="CashDestinationsList" item-key="name" hide-default-footer
        class="border-t-sm border-b-sm">
        <template #item.sr_no="{ index }">
          {{ index + 1 }}
        </template>
        <template #item.integration_method="{ item }">
          <span class="text-capitalize">{{ item.integration_method }}</span>
        </template>
        <template #item.status="{ item }">
          <div>
            <VChip :color="item.status ? 'success' : 'error'" class="font-weight-light p-1" size="small"
              variant="elevated">
              {{ item.status ? 'Active' : 'Inactive' }}
            </VChip>
          </div>
        </template>
        <template #item.created_at="{ item }">
          {{ formatDate(item.created_at) }}
        </template>
      </v-data-table>
    </v-card-text>
  </v-card>
</template>
