<script setup>
import {  onMounted, ref, watch, computed } from "vue";
import { useRoute } from "vue-router";
import { useCompanies } from "@/composables/useCompanies";
import assignPermissions from "@/components/companies/assign-permissions.vue";
import unassignPermissions from "@/components/companies/unassign-permissions.vue";
const { CompanyDetail, fetchCompanyById,user_permissions,fetchPermissionsById } = useCompanies();

definePageMeta({
  middleware: "auth",
  permission: "user_permissions.view"
})
const route = useRoute();
const userId = computed(() => CompanyDetail?.value?.user?.id ?? null)

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

const refreshPermissions = async () => {
  if (userId.value) {
    await fetchPermissionsById(userId.value);
  }
}

onMounted(async () => {
  await fetchCompanyById(route.params.id);
});

watch(
  () => userId.value,
  (newUserId) => {
    if (newUserId) {
      fetchPermissionsById(newUserId)
    }
  },
  { immediate: true }
)


</script>
<template>
  <v-card class="mb-4">
    <v-row>
      <v-col cols="12">
        <v-card-title class="border-b-sm d-flex align-center bg-primary">
          <BackNavigation color="text-white" />
          <h4 class="text-h5 py-3 text-white">Company Details</h4>
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
    </v-card-text>
  </v-card>
  <assignPermissions :userId="CompanyDetail?.user?.id" :user_permissions="user_permissions?.assigned_permissions" @permissions-updated="refreshPermissions"/>
  <unassignPermissions :userId="CompanyDetail?.user?.id" :user_permissions="user_permissions?.unassigned_permissions" @permissions-updated="refreshPermissions"/>
</template>
