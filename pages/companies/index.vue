<script setup>
definePageMeta({
  middleware: "auth",
  permission: "companies.list"
})
const permissionStore = usePermissionStore()
import { onMounted, ref } from "vue";
import { useCompanies } from "@/composables/useCompanies";
const { CompaniesList, fetchCompanies } = useCompanies();
const filters = ref({});
const headers = [
  { title: "#", key: "sr_no" },
  { title: "Name", key: "company_name" },
  { title: "Code", key: "company_code" },
  { title: "Email", key: "email" },
  { title: "Status", key: "status" },
  { title: "Created At", key: "created_at" },
  { title: "Action", key: "action" },
];


onMounted(() => {
  fetchCompanies();
});
</script>

<template>
  <v-card>
    <v-row>
      <v-col cols="12">
        <v-card-title class="border-b-sm bg-primary">
          <h4 class="text-h5 py-3 text-white">Companies List</h4>
        </v-card-title>
      </v-col>
    </v-row>
    <VCardText class="d-flex flex-wrap gap-4 justify-space-between pb-2">
      <div class="me-3 d-flex gap-3">
        <itemPerPage v-model="itemsPerPage" @update:model-value="updateItemsPerPage" />
      </div>
    </VCardText>


    <VDatableComponent :headers="headers" :items="CompaniesList" :loading="loading" :search="search"
      :pagination="pagination" :pageNo="pageNo" @update:pageNo="pageNo = $event" class="border-t-sm">
      <template #item.company_name="{ item }">
        <div class="text-wrap text-capitalize">{{ item.company_name }}</div>
      </template>
      <template #item.status="{ item }">
        <div>
          <VChip :color="item.user?.status ? 'success' : 'error'" class="font-weight-light p-1" size="small"
            variant="elevated">
            {{ item.user?.status ? 'Active' : 'Inactive' }}
          </VChip>
        </div>
      </template>
      <template #item.email="{ item }">
        <div class="text-wrap">{{ item.user.email }}</div>
      </template>
      <template #item.created_at="{ item }">
        <div class="text-grey">{{ new Date(item.created_at).toLocaleDateString('en-GB', {
          day: '2-digit',
          month: 'short',
          year: 'numeric'
        }) }}
        </div>
      </template>
      <template #item.action="{ item }">
        <div>
          <div class="d-flex gap-1">
            <VBtn icon variant="text" :to="`/companies/view/${item.id}`" color="medium-emphasis" v-if="permissionStore.hasPermission('companies.show')">
              <VIcon icon="tabler-eye" />
            </VBtn>
            <VBtn icon variant="text" color="medium-emphasis">
              <VIcon icon="tabler-dots-vertical" />
              <VMenu activator="parent">
                <VList>
                  <VListItem :to="`/companies/edit/${item.id}`" v-if="permissionStore.hasPermission('companies.update')">
                    <VListItemTitle>Edit</VListItemTitle>
                  </VListItem>
                  <VListItem :to="`/companies/manage-permissions/${item.id}`" v-if="permissionStore.hasPermission('user_permissions.view')">
                    <VListItemTitle>Manage Permissions</VListItemTitle>
                  </VListItem>
                  <VListItem :to="`/companies/login-ip-settings/${item.id}`" v-if="permissionStore.hasPermission('company_ips.create')">
                    <VListItemTitle>Login Ip Settings</VListItemTitle>
                  </VListItem>
                  <VListItem :to="`/companies/api-keys-webhooks/${item.id}`" v-if="permissionStore.hasPermission('company_security.secrets.view')">
                    <VListItemTitle>Api Keys & Webhooks</VListItemTitle>
                  </VListItem>
                </VList>
              </VMenu>
            </VBtn>
          </div>
        </div>
      </template>
    </VDatableComponent>
  </v-card>
</template>
