<script setup>
definePageMeta({
  middleware: "auth",
  permission: "company_partner_credentials.index"
})
import { usePartnerMappings } from "@/composables/UsePartnerMappings";
const { fetchCompanyCredentialsList, CredentialsList, DeleteCompanyCredential } = usePartnerMappings();
const permissionStore = usePermissionStore()
import { onMounted, ref } from "vue";
import { useRoute } from "vue-router";
const route = useRoute();
const filters = ref({});
const headers = [
  { title: "#", key: "sr_no" },
  { title: "Partner", key: "integration_method" },
  { title: "Personal Credentials", key: "personal_credentials" },
  { title: "Status", key: "status" },
  { title: "Created At", key: "created_at" },
  { title: "Action", key: "action" },
];
const options = ref({
  page: 1,
  itemsPerPage: 50,
  sortBy: [""],
  sortDesc: [false],
});

onMounted(() => {
  fetchCompanyCredentialsList(route.params.id);
});
</script>

<template>
  <v-card>
    <v-row>
      <v-col cols="12">
        <v-card-title class="border-b-sm bg-primary">
          <h4 class="text-h5 py-3 text-white">Company Partners Credentials</h4>
        </v-card-title>
      </v-col>
    </v-row>
    <VCardText class="flex-wrap gap-4 d-flex justify-space-between align-center border-t-sm">
      <div class="me-3 d-flex gap-3">
        <span class="fs-16 pt-2">Show</span>
        <AppAutocomplete v-model="options.itemsPerPage" :items="[
          { value: -1, title: 'All' },
          { value: 50, title: '50' },
          { value: 100, title: '100' },
        ]" style="inline-size: 6.25rem;" @update:model-value="itemsPerPage = parseInt($event, 10)" />
      </div>
    </VCardText>
    <VCardText class="px-0">
      <PaginatedDataTable :headers="headers" :items="CredentialsList" :options="options" :loading="loading"
        :search="search" @update:options="options = $event">
        <template #item.personal_credentials="{ item }">
          <div>
            <VChip :color="item.personal_credentials ? 'warning' : 'error'" class="font-weight-light p-1" size="small"
              variant="elevated">
              {{ item.personal_credentials ? 'Yes' : 'No' }}
            </VChip>
          </div>
        </template>
        <template #item.status="{ item }">
          <div>
            <VChip :color="item.status ? 'success' : 'error'" class="font-weight-light p-1" size="small"
              variant="elevated">
              {{ item.status ? 'Active' : 'Inactive' }}
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
              <VBtn icon variant="text" :to="`/companies/partners-credentials/${route.params.id}/view/${item.integration_method}`" color="medium-emphasis"
                v-if="permissionStore.hasPermission('company_partner_credentials.show')">
                <VIcon icon="tabler-eye" />
              </VBtn>
              <VBtn icon variant="text" color="medium-emphasis">
                <VIcon icon="tabler-dots-vertical" />
                <VMenu activator="parent">
                  <VList>
                    <VListItem :to="`/companies/partners-credentials/${route.params.id}/edit/${item.integration_method}/${item.id}`"
                      v-if="permissionStore.hasPermission('company_partner_credentials.update')">
                      <VListItemTitle>Edit</VListItemTitle>
                    </VListItem>
                  </VList>
                </VMenu>
              </VBtn>
              <VBtn icon variant="text" @click="DeleteCompanyCredential(item.id, route.params.id)"
                color="medium-emphasis" v-if="permissionStore.hasPermission('company_partner_credentials.delete')">
                <VIcon icon="tabler-trash" color="error" />
              </VBtn>
            </div>
          </div>
        </template>
        <template #bottom>
          <VCardText class="pt-2 pb-0 border-t-sm">
            <div class="d-flex flex-wrap justify-space-between align-center gap-y-2 mt-2">
              <span class="text-caption text-muted">
                Showing
                {{ (options.page - 1) * options.itemsPerPage + 1 }}
                to
                {{ Math.min(options.page * options.itemsPerPage, CredentialsList.length) }}
                of {{ CredentialsList.length }} entries
              </span>
              <VPagination v-model="options.page" :total-visible="$vuetify.display.smAndDown ? 3 : 5"
                :length="Math.ceil(CredentialsList.length / options.itemsPerPage)" />
            </div>
          </VCardText>
        </template>
      </PaginatedDataTable>
    </VCardText>
  </v-card>
</template>
