<script setup>
import { onMounted } from "vue";
import BeneficiaryFilter from "@/components/beneficiary/BeneficiaryFilter.vue";
import { useBeneficiary } from "@/composables/useBeneficiary";
const permissionStore = usePermissionStore()
definePageMeta({
  middleware: "auth",
  permission: "beneficiaries.lists"
})
const {
  headers,
  customersList,
  loading,
  options,
  fetchCustomers,
  fetchCustomersFilters,
  resolveStatusVariant,
  pagination,
} = useBeneficiary();


const { pageNo, itemsPerPage, updateItemsPerPage, loadPage } = usePagination(
  fetchCustomers,
  {
    initialPage: 1,
    initialPerPage: 10,
  },
);

const showAdvancedSearch = ref(false);

function handleFilter(filters) {
  fetchCustomersFilters(filters);
}

function handleReset() {
  fetchCustomers();
}

</script>
<template>
  <v-card>
    <v-row>
      <v-col cols="12">
        <v-card-title class="border-b-sm">
          <h4 class="text-h5 py-3">Customer Beneficiary List</h4>
        </v-card-title>
      </v-col>
    </v-row>

    <v-card-text class="pt-1 my-4 pb-3">
      <BeneficiaryFilter @filter="handleFilter" @reset="handleReset" />
    </v-card-text>
    <VCardText
      class="d-flex flex-wrap gap-4 justify-between item-center border-t-sm border-b-sm pb-3"
    >
      <div class="me-3 d-flex gap-3 pt-6">
        <ItemsPerPageSelector
          v-model="itemsPerPage"
          @update:model-value="updateItemsPerPage"
        />
      </div>
      <VSpacer />
    </VCardText>

    <VCardText class="px-0 pb-0">
      <VDatableComponent
        :headers="headers"
        :items="customersList"
        :loading="loading"
        :search="search"
        :pagination="pagination"
        :pageNo="pageNo"
        @update:pageNo="pageNo = $event"
      >
        <!-- Name with ID and Status -->
        <template #item.name="{ item }">
          <div>
            <div class="fs-13 font-weight-medium">{{ item.id }}</div>
            <div class="fs-13">{{ item.name }}</div>
          </div>
        </template>

        <!-- Email/Phone -->
        <template #item.contact="{ item }">
          <div>
            <div class="fs-13">{{ item.phone_number }}</div>
            <div class="fs-13 text-muted">{{ item.email }}</div>
          </div>
        </template>

        <!-- Channel with Status -->
        <template #item.channel="{ item }">
          <div class="fs-13">{{ item.channel }}</div>

          <VChip
            :style="{
              backgroundColor: item.status === 1 ? '#28C76F29' : '#FF9F4329',
              color: item.status === 1 ? '#28C76F' : '#FF9F43',
              marginTop: '4px',
            }"
            class="font-weight-light fs-12 p-1 mt-1"
            size="small"
          >
            {{ item.status === 1 ? "Active" : "Inactive" }}
          </VChip>
        </template>

        <!-- Actions -->
        <template #item.action="{ item }">
          <div class="d-flex gap-1">
            <VBtn
              icon
              variant="text"
              :to="`/beneficiaries/view-beneficiary/${item.id}`"
              color="medium-emphasis" v-if="permissionStore.hasPermission('customer.beneficiary.view')"
            >
              <VIcon icon="tabler-eye" />
            </VBtn>

            <VBtn icon variant="text" color="medium-emphasis">
              <VIcon icon="tabler-dots-vertical" />
              <VMenu activator="parent">
                <VList>
                  <VListItem :to="`/beneficiaries/add-bank/${item.id}`" v-if="permissionStore.hasPermission('beneficiary.bank.create')">
                    <VListItemTitle>Add Beneficiary Bank</VListItemTitle>
                  </VListItem>
                  <VListItem :to="`/beneficiaries/add-beneficiary-doc/${item.id}`" v-if="permissionStore.hasPermission('beneficiary.document.upload')">
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
