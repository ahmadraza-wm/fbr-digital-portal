<script setup>
import { usePayer } from "@/composables/usePayer";
import { useCountryCurrencyStore } from "@/stores/useCountryCurrencyStore";
import { storeToRefs } from "pinia";
import { ref } from "vue";
definePageMeta({
  middleware: "auth",
  permission: "payers.index"
})
const permissionStore = usePermissionStore()
const countryCurrencyStore = useCountryCurrencyStore();
const { countries, currencies } = storeToRefs(countryCurrencyStore);

const {
  payersList,
  loading,
  error,
  loadingMessage,
  fetchPayers,
  filters,
  resolveStatusVariant,
  deletePayer,
  pagination,
} = usePayer();




const { pageNo, itemsPerPage, updateItemsPerPage, loadPage } = usePagination(
  fetchPayers,
  {
    initialPage: 1,
    initialPerPage: 10,
  }
);
const desserts = [
  {
    id: "1",
    currency: "NEC Money Transfer",
    createdBy: "17 Dec 2024",
    createdAt: "17 Dec 2024",
  },
  {
    id: "2",
    currency: "NEC Money Transfer",
    createdBy: "17 Dec 2024",
    createdAt: "17 Dec 2024",
  },
  {
    id: "3",
    currency: "NEC Money Transfer",
    createdBy: "17 Dec 2024",
    createdAt: "17 Dec 2024",
  },
];
const headers = [
  { title: "#", key: "sr_no" },
  { title: "NAME", key: "name" },
  { title: "Currency", key: "currency" },
  { title: "COUNTRY", key: "country" },
  { title: "Method", key: "method" },
  { title: "STATUS", key: "status" },
  { title: "ACTION", key: "action" },
];

const partners = ref([
  { title: "Bank Transfer", value: "bank" },
  { title: "Cash Pickup", value: "cash" },
  { title: "Mobile Wallet", value: "mobile_wallet" },
]);


const search = () => {
  fetchPayers(filters.value);
};

const resetFilters = () => {
  filters.value = { name: "", method: "", currency_id: "", country_id: "" };
  fetchPayers();
};

const deleteUser = async (id) => {
  await deletePayer(id);
};

const getMethodTitle = (method) => {
  const found = partners.value.find((partner) => partner.value === method);
  return found ? found.title : "Unknown Method";
};

definePageMeta({ middleware: "auth" });
</script>

<template>
  <v-card>
    <v-row>
      <v-col cols="12">
        <v-card-title class="border-b-sm">
          <h4 class="text-h5 py-3">Payer List</h4>
        </v-card-title>
      </v-col>
    </v-row>

    <v-card-text class="pt-1 my-4 pb-3">
      <v-row class="ps-0">
        <v-col cols="12" sm="6" md="3">
          <span class="fs-16 label-color font-weight-medium">Name</span>
          <AppTextField v-model="filters.name" placeholder="Name" />
        </v-col>
        <v-col cols="12" sm="6" md="3">
          <span class="fs-16 label-color font-weight-medium">Currency</span>
          <v-autocomplete v-model="filters.currency_id" :items="currencies" :item-title="(item) => {
            const n = item?.code ?? '';
            const m = item?.name ?? '';
            return n && m ? `${n} - ${m}` : n || m;
          }" item-value="id" placeholder="Select Currency">
            <template #item="{ item, props, selected }">
              <div v-bind="props" class="px-3 py-1 mb-2" :class="selected ? 'bg-primary text-white' : 'text-body'"
                style="border-radius: 4px;">
                {{ item?.code || item?.raw?.code }} - <b class="bg-primary px-1 py-1 rounded">{{ item?.name ||
                  item?.raw?.name }}</b>
              </div>
            </template>

            <template #selection="{ item }">
              <span v-if="item">
                {{ item?.code || item?.raw?.code }} - <b class="text-primary">{{ item?.name || item?.raw?.name }}</b>
              </span>
              <span v-else>Select base currency</span>
            </template>
          </v-autocomplete>
        </v-col>
        <v-col cols="12" sm="6" md="3">
          <span class="fs-16 label-color font-weight-medium">Method</span>
          <v-autocomplete v-model="filters.method" :items="partners" placeholder="Select Method" />
        </v-col>
        <v-col cols="12" sm="6" md="3">
          <span class="fs-16 label-color font-weight-medium">Country</span>
          <v-autocomplete v-model="filters.country_id" :items="countries" item-title="name" item-value="id"
            placeholder="Select Country" />
        </v-col>
        <v-col cols="12 d-flex gap-2 align-end" sm="10" md="2">
          <VBtn @click="search" variant="tonal" class="login-btn">Search</VBtn>
          <VBtn @click="resetFilters" variant="tonal" color="secondary">Reset</VBtn>
        </v-col>
      </v-row>
    </v-card-text>

    <v-divider></v-divider>

    <VCardText class="d-flex flex-wrap gap-4 pb-2">
      <div class="me-3 d-flex gap-3">
        <ItemsPerPageSelector v-model="itemsPerPage" @update:model-value="updateItemsPerPage" />
      </div>
      <VSpacer />

      <VBtn color="primary" variant="elevated" to="/payers/create-payer"
        v-if="permissionStore.hasPermission('payers.create')">
        Create Payer
      </VBtn>
    </VCardText>

    <VCardText class="px-0 border-t-sm">
      <VDatableComponent :headers="headers" :items="payersList" :loading="loading" :search="search"
        :pagination="pagination" :pageNo="pageNo" @update:pageNo="pageNo = $event">
        <template #item.fullName="{ item }">
          <div class="d-flex align-center">
            <div class="d-flex flex-column">
              <span class="text-truncate v-data-table__td">{{
                item.fullName
                }}</span>
            </div>
          </div>
        </template>

        <template #item.country="{ item }">
          <div class="d-flex align-center">
            <div class="d-flex flex-column">
              <span class="text-truncate v-data-table__td">{{
                item.country
                }}</span>
            </div>
          </div>
        </template>

        <template #item.method="{ item }">
          <div class="d-flex align-center">
            <div class="d-flex flex-column">
              <span class="text-truncate v-data-table__td">{{
                getMethodTitle(item.method)
                }}</span>
            </div>
          </div>
        </template>

        <template #item.status="{ item }">
          <VChip :color="resolveStatusVariant(item.status).color" class="font-weight-medium" size="small">
            {{ resolveStatusVariant(item.status).text }}
          </VChip>
        </template>

        <template #item.action="{ item }">
          <div class="d-flex gap-1">
            <VBtn icon variant="text" color="medium-emphasis" v-if="permissionStore.hasPermission('payers.update')">
              <IconBtn>
                <NuxtLink class="menu-link" :to="`/payers/edit-payer/${item.id}`">
                  <VIcon icon="tabler-edit" />
                </NuxtLink>
              </IconBtn>
            </VBtn>

            <IconBtn @click="deleteUser(item.id)" class="d-none">
              <VIcon icon="tabler-trash" />
            </IconBtn>
            <VBtn v-if="item.method == 'bank' && permissionStore.hasPermission('bank.fields.list')" icon variant="text"
              color="medium-emphasis">
              <VIcon icon="tabler-dots-vertical" />
              <VMenu activator="parent">
                <VList>
                  <VListItem :to="`/payers/manage-payerBank?id=${item.id}&country_id=${item.country_id}`">
                    <VListItemTitle>Manage Fields</VListItemTitle>
                  </VListItem>
                </VList>
              </VMenu>
            </VBtn>
          </div>
        </template>
      </VDatableComponent>
    </VCardText>
  </v-card>



  <VSnackbar v-model="loadingMessage" color="info">
    {{ loadingMessage }}
  </VSnackbar>
</template>
