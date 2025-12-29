<script setup>
import { onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import { useCompanies } from "@/composables/useCompanies";
const { CompanyDetail, fetchCompanyById } = useCompanies();
const permissionStore = usePermissionStore()

// definePageMeta({
//   middleware: "auth",
//   permission: "agents.show"
// })

const canShowIpAction = computed(() => {
  return (
    permissionStore.hasPermission('company_ips.update') ||
    permissionStore.hasPermission('company_ips.delete')
  )
})


const ipHeaders = computed(() => {
  const baseheaders = [
    { title: "#", key: "sr_no" },
    { title: "Ip", key: "ip_address" },
    { title: "Status", key: "is_active" },
  ]

  if (canShowIpAction.value) {
    baseheaders.push({ title: "Action", key: "action" })
  }

  return baseheaders
})


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



const route = useRoute();

onMounted(async () => {
  fetchCompanyById(route.params.id);
});

</script>
<template>
  <v-card class="mb-4">
    <v-row>
      <v-col cols="12">
        <v-card-title class="border-b-sm d-flex align-center bg-primary">
          <BackNavigation color="text-white" />
          <h4 class="text-h5 py-3 text-white">Company Details</h4>
        </v-card-title>
        <v-card-title class="py-0 border-b-sm header_bg">
          <h4 class="text-h5 py-5">Personal Details</h4>
        </v-card-title>
      </v-col>
    </v-row>
    <v-card-text class="px-0 pt-0">
      <v-row class="border-b-md px-5">
        <v-col cols="6" sm="4" md="3" class="pb-1">
          <p class="font-weight-medium text-color mb-0 lh-22">Company Id</p>
          <p class="font-weight-medium mb-0 lh-22 text-color1">{{ CompanyDetail?.id || "---" }}</p>
        </v-col>
        <v-col cols="6" sm="4" md="3" class="pb-1">
          <p class="font-weight-medium text-color mb-0 lh-22">Company Name</p>
          <p class="font-weight-medium mb-0 lh-22 text-color1">{{ CompanyDetail?.company_name || "---" }}</p>
        </v-col>
        <v-col cols="6" sm="4" md="3" class="pb-1">
          <p class="font-weight-medium text-color mb-0 lh-22">Company Code</p>
          <p class="font-weight-medium mb-0 lh-22 text-color1">{{ CompanyDetail?.company_code || "---" }}</p>
        </v-col>
        <v-col cols="6" sm="4" md="3" class="pb-1">
          <p class="font-weight-medium text-color mb-0 lh-22">Status</p>
          <p class="font-weight-medium mb-0 lh-22 text-color1">
            <VChip :color="CompanyDetail?.user?.status == 1 ? 'success' : 'error'" class="font-weight-medium"
              size="small" variant="elevated">
              {{ CompanyDetail?.user?.status == 1 ? "Active" : "Inactive" }}
            </VChip>
          </p>
        </v-col>
      </v-row>
      <v-row class="border-b-md px-5">
        <v-col cols="6" sm="4" md="3" class="pb-1">
          <p class="font-weight-medium text-color mb-0 lh-22">First Name</p>
          <p class="font-weight-medium mb-0 lh-22 text-color1">{{ CompanyDetail?.user?.first_name || "---" }}</p>
        </v-col>
        <v-col cols="6" sm="4" md="3" class="pb-1">
          <p class="font-weight-medium text-color mb-0 lh-22">Last Name</p>
          <p class="font-weight-medium mb-0 lh-22 text-color1">{{ CompanyDetail?.user?.last_name || "---" }}</p>
        </v-col>
        <v-col cols="6" sm="4" md="3" class="pb-1">
          <p class="font-weight-medium text-color mb-0 lh-22">Email</p>
          <p class="font-weight-medium mb-0 lh-22 text-color1">{{ CompanyDetail?.user?.email || "---" }}</p>
        </v-col>
        <v-col cols="6" sm="4" md="3" class="pb-1">
          <p class="font-weight-medium text-color mb-0 lh-22">Created At</p>
          <p class="font-weight-medium mb-0 lh-22 text-color1">{{ formatDate(CompanyDetail?.created_at) }}</p>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12 pt-0">
          <v-card-title class="py-0 border-b-md header_bg">
            <h4 class="text-h5 py-5">Other Details</h4>
          </v-card-title>
        </v-col>
      </v-row>
      <v-row class="border-b-md px-5">
        <v-col cols="6" sm="4" md="3" class="pb-1">
          <p class="font-weight-medium text-color mb-0 lh-22">User Id</p>
          <p class="font-weight-medium mb-0 lh-22 text-color1">{{ CompanyDetail?.user?.id || "---" }}</p>
        </v-col>
        <v-col cols="6" sm="4" md="3" class="pb-1">
          <p class="font-weight-medium text-color mb-0 lh-22">Api Key</p>
          <p class="font-weight-medium mb-0 lh-22 text-color1">{{ CompanyDetail?.api_key || "---" }}</p>
        </v-col>
        <v-col cols="6" sm="4" md="3" class="pb-1">
          <p class="font-weight-medium text-color mb-0 lh-22">Api Secret</p>
          <p class="font-weight-medium mb-0 lh-22 text-color1">{{ CompanyDetail?.api_secret || "---" }}</p>
        </v-col>
        <v-col cols="6" sm="4" md="3" class="pb-1">
          <p class="font-weight-medium text-color mb-0 lh-22">Webhook Secret</p>
          <p class="font-weight-medium mb-0 lh-22 text-color1">{{ CompanyDetail?.webhook_secret || "---" }}</p>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
  <v-card>
    <v-row>
      <v-col cols="12">
        <v-card-title class="border-b-sm d-flex align-center justify-space-between bg-secondary">
          <h4 class="text-h5 py-3 text-white">Company Ip Whitelist</h4>
          <div class="gap-3 pt-1" v-if="permissionStore.hasPermission('company_ips.create')">
            <VBtn variant="elevated" @click="" color="primary">
              Add Ip
            </VBtn>
          </div>
        </v-card-title>
      </v-col>
    </v-row>
    <v-card-text class="px-0 pb-0 pt-0">
      <v-data-table :headers="ipHeaders" :items="CompanyDetail?.ip_whitelists" item-key="name" hide-default-footer
        class="border-t-sm border-b-sm">
        <template #item.sr_no="{ index }">
          {{ index + 1 }}
        </template>
        <template #item.is_active="{ item }">
          <p class="font-weight-medium mb-0 lh-22 text-color1">
            <VChip :color="item?.is_active == 1 ? 'success' : 'error'" class="font-weight-light fs-12 p-1" size="small"
              variant="elevated">
              {{ item?.is_active === true ? "Active" : "Inactive" }}
            </VChip>
          </p>
        </template>
        <template #item.action="{ item }">
          <VBtn icon variant="text" v-if="permissionStore.hasPermission('company_ips.update')">
            <VIcon icon="tabler-edit" @click="" color="primary"></VIcon>
          </VBtn>
          <VBtn icon variant="text" v-if="permissionStore.hasPermission('company_ips.delete')">
            <VIcon icon="tabler-trash" color="error" @click=""></VIcon>
          </VBtn>
        </template>
      </v-data-table>
    </v-card-text>
  </v-card>
</template>
