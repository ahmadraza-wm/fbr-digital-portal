<template>
  <v-card>
    <v-row>
      <v-col cols="12">
        <v-card-title>
          <h4 class="text-h5 py-3">Search Wallets</h4>
        </v-card-title>
      </v-col>
    </v-row>
    <v-divider></v-divider>

    <v-card-text class="pt-1 my-4 pb-3">
      <v-row class="ps-0">
        <v-col cols="12" sm="10" md="10" class="ps-1">
          <v-row>
            <v-col cols="12" sm="6" md="6">
              <span class="fs-16 label-color">Wallet Name</span>
              <AppTextField v-model="filters.name" name="name" placeholder="Wallet Name" autocomplete="off" />
            </v-col>
            <VCol cols="12" sm="6" md="6">
              <span class="fs-16 label-color">Country</span>
              <AppAutocomplete v-model="filters.country_id" :items="countries" item-title="name" item-value="id"
                placeholder="Select Country" />
            </VCol>
          </v-row>
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
      <VBtn color="secondary" variant="tonal" to=""> Export CSV </VBtn>
      <VBtn color="primary" variant="elevated" to="/wallets/add-wallet" prepend-icon="tabler-plus"
        v-if="permissionStore.hasPermission('wallets.store')">
        Add Wallets
      </VBtn>
    </VCardText>

    <VCardText class="px-0 border-t-sm">
      <VDatableComponent :headers="headers" :items="walletList" :loading="loading" :search="filters.name"
        :pagination="pagination" :pageNo="pageNo" @update:pageNo="pageNo = $event">
        <template #item.bank_code="{ item }">
          {{ item.id }}
          <!-- <span v-for="item in item.bank_code">{{ item.reference_code }}, </span> -->
        </template>
        <!-- Name -->
        <template #item.name="{ item }">
          <span>{{ item.name }}</span>
        </template>

        <!-- Country -->
        <template #item.country="{ item }">
          <span>{{ item.country }}</span>
        </template>

        <template #item.status="{ item }">
          <VChip :color="resolveStatusVariant(item.status).color" class="font-weight-medium" size="small">
            {{ resolveStatusVariant(item.status).text }}
          </VChip>
        </template>



        <!-- Action -->
        <template #item.action="{ item }">
          <div class="d-flex gap-1">
            <VBtn icon variant="text" color="medium-emphasis" @click="openAuditLog(item)">
              <VIcon icon="tabler-history" />
            </VBtn>
            <!-- <IconBtn @click="deleteUser(item.id)">
              <VIcon icon="tabler-trash" />
            </IconBtn> -->

            <VBtn icon variant="text" color="medium-emphasis">
              <VIcon icon="tabler-dots-vertical" />
              <VMenu activator="parent">
                <VList>
                  <VListItem :to="`/wallets/partner-code/${item.id}?name=${item.name}`"
                    v-if="permissionStore.hasPermission('partners.show')">
                    <VListItemTitle>Partner Code</VListItemTitle>
                  </VListItem>

                  <!-- <VListItem to="wallets/wallet-payer">
                    <VListItemTitle>Payers</VListItemTitle>
                  </VListItem> -->
                  <VListItem @click="Update(item.id, item.status)"
                    v-if="permissionStore.hasPermission('update.wallets.status')">
                    <VListItemTitle>
                      {{ item.status === 1 ? 'inactive' : 'Active' }}
                    </VListItemTitle>
                  </VListItem>

                </VList>
              </VMenu>
            </VBtn>
          </div>
        </template>
      </VDatableComponent>
    </VCardText>
  </v-card>
  <AuditLog v-if="selectedId" module="Wallet" :id="selectedId" class="mt-4" />
</template>

<script setup>
import { useWallet } from "@/composables/useWallet";
import { onMounted } from "vue";
import { useRoute } from "vue-router";
import AuditLog from '@/components/AuditLog.vue'
definePageMeta({
  middleware: "auth",
  permission: "wallets.index"
})
const permissionStore = usePermissionStore()
const route = useRoute();
const { walletList, fetchWallets, options, headers, deleteWallet, UpdateWalletStatus } =
  useWallet();
const countryCurrencyStore = useCountryCurrencyStore();
const { countries, currencies } = storeToRefs(countryCurrencyStore);


const { pageNo, itemsPerPage, updateItemsPerPage, loadPage } = usePagination(fetchWallets, {
  initialPage: 1,
  initialPerPage: 10,
});

const filters = ref({
  name: "",
  country_id: "",
});

const search = () => {
  fetchWallets({ ...filters.value });
};

const resetFilters = () => {
  filters.value = { name: "", country_id: "" };
  fetchWallets();
};

const deleteUser = async (id) => {
  await deleteWallet(id);
};

const selectedId = ref(null)

const openAuditLog = (item) => {
  if (selectedId.value === item.id) {
    selectedId.value = null
  } else {
    selectedId.value = item.id
  }
}

const resolveStatusVariant = (status) =>
({
  1: { color: "success", text: "Active" },
  0: { color: "error", text: "Inactive" },
}[status] || { color: "info", text: "Unknown" });


const Update = async (id, currentStatus) => {
  const newStatus = currentStatus === 'Active' || currentStatus === 1 ? 0 : 1;
  await UpdateWalletStatus(id, { status: newStatus });
};
onMounted(() => {
  const queryWalletName = route.query.wallet_name;
  const queryCountryId = route.query.rec_country_id;

  filters.value.name = queryWalletName || "";
  filters.value.country_id = queryCountryId ? Number(queryCountryId) : "";

  fetchWallets({ ...filters.value });
});

watch(
  () => route.query,
  (query) => {
    const queryWalletName = route.query.wallet_name;
    const queryCountryId = route.query.rec_country_id;

    filters.value.name = queryWalletName || "";
    filters.value.country_id = queryCountryId ? Number(queryCountryId) : "";

    fetchWallets({ ...filters.value });
  },
  { immediate: true }
);
</script>
