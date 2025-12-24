<script setup>
import { onMounted } from "vue";
import CustomerFilter from "@/components/customers/CustomerFilter.vue";
import { useCustomer } from "@/composables/useCustomer";
const permissionStore = usePermissionStore()
definePageMeta({
  middleware: "auth",
  permission: "customers.list"
})

const {
  headers,
  customersList,
  loading,
  fetchCustomers,
  fetchCustomersFilters,
  resolveStatusVariant,
  pagination,
} = useCustomer();

const { pageNo, itemsPerPage, updateItemsPerPage, loadPage } = usePagination(
  fetchCustomers,
  {
    initialPage: 1,
    initialPerPage: 10,
  }
);

const showAdvancedSearch = ref(false);

function handleFilter(filters) {
  fetchCustomersFilters(filters);
}

function handleReset() {
  fetchCustomersFilters();
}

</script>

<template>
  <v-card>
    <v-row>
      <v-col cols="12">
        <v-card-title class="border-b-sm">
          <h4 class="text-h5 py-3">Customer List</h4>
        </v-card-title>
      </v-col>
    </v-row>
    <v-card-text>
      <CustomerFilter @filter="handleFilter" @reset="handleReset" />
    </v-card-text>
    <VCardText class="d-flex justify-space-between border-t-sm border-b-sm pb-3">
      <div class="mt-6">
        <ItemsPerPageSelector v-model="itemsPerPage" @update:model-value="updateItemsPerPage" />
      </div>
      <VBtn color="secondary" variant="tonal" to="" prepend-icon="tabler-upload" class="mt-6">
        Export CSV
      </VBtn>

      <!-- <VBtn
        color="primary"
        variant="elevated"
        to="customers/add-document"
        prepend-icon="tabler-plus"
      >
        Add Documents</VBtn
      > -->
    </VCardText>

    <VCardText class="px-0 pb-0">
      <VDatableComponent :headers="headers" :items="customersList" :loading="loading" :search="search"
        :pagination="pagination" :pageNo="pageNo" @update:pageNo="pageNo = $event">
        <!----Name with id and status-->
        <template #item.fullName="{ item }">
          <div style="display: flex; align-items: center">
            <VIcon :icon="item.verified
                ? 'tabler-circle-check-filled'
                : 'tabler-circle-x-filled'
              " size="28" :color="item.verified ? 'success' : 'error'" />

            <span class="pl-1">{{ item.id }}</span>
          </div>
          <div class="fs-13 text-wrap">{{ item.fullName }}</div>
        </template>
        <!-- Email/Phone -->
        <template #item.email="{ item }">
          <div class="fs-13">
            {{ item.phone }} <br />
            {{ item.email }}
          </div>
        </template>
        <!---Address-->
        <template #item.channel="{ item }">
          <div class="fs-13">{{ item.channel }}</div>

          <div style="display: flex; align-items: center">
            <VChip :style="{
              backgroundColor: item.status === 1 ? '#28C76F29' : '#FF9F4329',
              color: item.status === 1 ? '#28C76F' : '#FF9F43',

              marginTop: '2px',
            }" class="font-weight-light fs-12 p-1" size="small">
              {{ item.status === 1 ? "Active" : "Inactive" }}
            </VChip>
          </div>
        </template>
        <!-- status -->
        <template #item.status="{ item }">
          <VChip :color="resolveStatusVariant(item.status).color" class="font-weight-medium" size="small">
            {{ resolveStatusVariant(item.status).text }}
          </VChip>
        </template>
        <!-- Actions -->
        <template #item.action="{ item }">
          <div class="d-flex gap-1">
            <VBtn icon variant="text" color="medium-emphasis">
              <VIcon icon="tabler-dots-vertical" />
              <VMenu activator="parent">
                <VList>
                  <VListItem :to="`/customers/view/${item.id}`" v-if="permissionStore.hasPermission('customers.view')">
                    <VListItemTitle>View</VListItemTitle>
                  </VListItem>

                  <VListItem :to="`/customers/edit/${item.id}`" v-if="permissionStore.hasPermission('customers.update')">
                    <VListItemTitle>Edit</VListItemTitle>
                  </VListItem>
                  <VListItem :to="`/customers/documents/${item.id}`" v-if="permissionStore.hasPermission('customer.document.upload')">
                    <VListItemTitle>Add Document</VListItemTitle>
                  </VListItem>
                </VList>
              </VMenu>
            </VBtn>
          </div>
        </template>
      </VDatableComponent>
    </VCardText>
  </v-card>
</template>
