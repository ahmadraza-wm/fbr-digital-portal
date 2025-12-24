<script setup>
definePageMeta({
  middleware: "auth",
  permission: "agent.customer.ledger.details"
})
const permissionStore = usePermissionStore()
import { onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
const route = useRoute();
const router = useRouter();
import { useCustomer } from "@/composables/agentPortal/useCustomers";
const {fetchCustomers, customersList, pagination,fetchCustomersFilters} = useCustomer();
const headers = [
  { title: "#", key: "sr_no" },
  { title: "Customer ID", key: "id" },
  { title: "Customer Name", key: "name" },
  { title: "Customer Address", key: "address" },
  { title: "City", key: "city" },
  { title: "Action", key: "action" },
];
const activeFilters = ref({});
const search = ref("");

const fetchWithFilters = (params) => {
  return fetchCustomersFilters({ ...activeFilters.value, ...params });
}
const { pageNo, itemsPerPage, updateItemsPerPage, loadPage } = usePagination(
  fetchWithFilters,
  {
    initialPage: 1,
    initialPerPage: 10,
  }
);
function handleFilter(payload) {
  activeFilters.value = payload;
  loadPage(1);
}

function handleReset() {
  activeFilters.value = {};
  fetchCustomers();
}

onMounted(()=>{
  fetchCustomers();
});

</script>

<template>
  <v-card>
    <v-row>
      <v-col cols="12">
        <v-card-title class="border-b-sm" style="background-color: lightgrey;">
          <h4 class="text-h5 py-3">Search Customer Ledger</h4>
        </v-card-title>
      </v-col>
    </v-row>
    <v-card-text class="border-b-sm">
      <CustomersFilter @filter="handleFilter" @reset="handleReset" />
    </v-card-text>
    <VCardText class="d-flex flex-wrap gap-4 justify-space-between mt-5 pb-2">
      <div class="me-3 d-flex gap-3">
        <ItemsPerPageSelector v-model="itemsPerPage" @update:model-value="updateItemsPerPage" />
      </div>
    </VCardText>


    <VDatableComponent :headers="headers" :items="customersList" :loading="loading" :search="search" :pagination="pagination"
      :pageNo="pageNo" @update:pageNo="pageNo = $event" class="border-t-sm">
      <template #item.action="{ item }">
        <div class="d-flex gap-2">
          <VBtn color="secondary" type="button" :to="`/agent/customers/ledger-view/${item.id}`" target="_blank" variant="tonal" size="small">
            View Ledger
          </VBtn>
        </div>
      </template>
    </VDatableComponent>
  </v-card>
</template>
