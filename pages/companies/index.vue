<script setup>
definePageMeta({
  middleware: "auth",
  permission: "companies.view"
})
const permissionStore = usePermissionStore()
import { onMounted, ref } from "vue";
import { useCompanies } from "@/composables/useCompanies";
const { CompaniesList, fetchCompanies } = useCompanies();
// const { pageNo, itemsPerPage, updateItemsPerPage, loadPage } = usePagination(
//   fetchAgentTransactions,
//   {
//     initialPage: 1,
//     initialPerPage: 50,
//   }
// );
const filters = ref({});
const headers = [
  { title: "#", key: "sr_no" },
  { title: "ID", key: "id" },
  { title: "Name", key: "company_name" },
  { title: "Code", key: "company_code" },
  { title: "Status", key: "status" },
  { title: "Created At", key: "created_at" },
  { title: "Action", key: "action" },
];

function handleFilter(payload) {
  // empty values remove (best practice)
  filters.value = Object.fromEntries(
    Object.entries(payload).filter(([_, v]) => v !== "" && v !== null)
  );

  // page reset
  pageNo.value = 1;

  // fetchAgentTransactions({
  //   page: pageNo.value,
  //   per_page: itemsPerPage.value,
  //   ...filters.value,
  // });
}


function handleReset() {
  filters.value = {};
  pageNo.value = 1;

  // fetchAgentTransactions({
  //   page: pageNo.value,
  //   per_page: itemsPerPage.value,
  // });
}


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
            <VBtn icon variant="text" :to="`/companies/view/${item.id}`" color="medium-emphasis">
              <VIcon icon="tabler-eye" />
            </VBtn>
            <VBtn icon variant="text" color="medium-emphasis">
              <VIcon icon="tabler-dots-vertical" />
              <VMenu activator="parent">
                <VList>
                  <VListItem :to="`/companies/edit/${item.id}`">
                    <VListItemTitle>Edit</VListItemTitle>
                  </VListItem>
                  <VListItem>
                    <VListItemTitle>Permissions</VListItemTitle>
                  </VListItem>
                  <VListItem>
                    <VListItemTitle>Login Ip Settings</VListItemTitle>
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
