<script setup>
import { useCashDestincation } from "@/composables/useCashDestincation";
import { onMounted, ref } from "vue";
import { useRoute } from "vue-router"; // 👈 import the route
import AuditLog from '@/components/AuditLog.vue'
definePageMeta({
  middleware: "auth",
  permission: "destinations.search"
})
const permissionStore = usePermissionStore()
const route = useRoute();

const countryCurrencyStore = useCountryCurrencyStore();
const { countries, currencies } = storeToRefs(countryCurrencyStore);
const {
  cashDestinations,
  headers,
  loading,
  loadingMessage,
  errorMessage,
  successMessage,
  fetchCashDestinations,
  filterCashDestinations,
  saveCashDestination,
  resolveStatusVariant,
  deleteCashDestination,
  showError,
  showLoading,
  hideLoading,
  pagination,
} = useCashDestincation();

const { pageNo, itemsPerPage, updateItemsPerPage, loadPage } = usePagination(fetchCashDestinations, {
  initialPage: 1,
  initialPerPage: 10,
});

const { $axios } = useNuxtApp();

const filters = ref({
  destination_name: "",
  country_id: "",
  city_name: "",
  payer_id: "",
  partner_id: "",

});

const allPayers =  ref([]);
const payers = ref([]);
const partners = ref([]);

const fetchPartners = async (filters = {}) => {

  showLoading("Fetching partners...");
  try {
    const response = await $axios.get("/partners/list?pagination=false", { params: filters });

    if (response.data.success) {
      partners.value = response.data.data.data;

    } else {
      showError("Failed to fetch partners");
    }
  } catch (error) {
    showError("Something went wrong");
  } finally {
    hideLoading();
  }
};

const selectedId = ref(null)

const openAuditLog = (item) => {
  if (selectedId.value === item.id) {
    selectedId.value = null
  } else {
    selectedId.value = item.id
  }
}




watch(() => filters.value.country_id, async (newCountryId) => {
  if (newCountryId) {
    filters.value.payer_id = "";
    await getPartnerPayers(newCountryId);
  } else {
    payers.value = [];
  }
});

const getPartnerPayers = async (countryId) => {
  const res = await $axios.get(`/payers/list?pagination=false`);
  allPayers.value = res.data?.data?.data || [];

  payers.value = allPayers.value.filter(
      payer => Number(payer.country_id) === Number(countryId) && payer.method === 'cash'
    );
};


const deleteUser = async (id) => {
  await deleteCashDestination(id);
};

onMounted(() => {
  const query = route.query;

  filters.value.destination_name = query.cash_destination_name || "";
  filters.value.country_id = query.rec_country_id ? Number(query.rec_country_id) : "";

  filterCashDestinations({ ...filters.value });
  fetchCashDestinations();
  getPartnerPayers();
  fetchPartners();
});

watch(
  () => route.query,
  (query) => {
    filters.value.destination_name = query.cash_destination_name || "";
    filters.value.country_id = query.rec_country_id ? Number(query.rec_country_id) : "";

    filterCashDestinations({ ...filters.value });
  },
  { immediate: true }
);


const search = () => {
  filterCashDestinations({ ...filters.value, ...options.value });
};


const resetFilters = () => {
  filters.value = { name: "", currency_id: "", country_id: "", city_name: "", payer_id: "" };
  fetchCashDestinations();
};
const options = ref({
  itemsPerPage: 5,
  page: 1,
});
definePageMeta({
  middleware: "auth",
});
</script>

<template>
  <v-card>
    <v-row>
      <v-col cols="12">
        <v-card-title class="d-flex justify-space-between align-center">
          <h4 class="text-h5 py-3">Cash Destination</h4>
          <VBtn type="submit" variant="elevated" color="primary" to="cash-destination/add-destination" v-if="permissionStore.hasPermission('destinations.store')">
            Add Cash Destination
          </VBtn>
        </v-card-title>
      </v-col>
    </v-row>
    <v-divider></v-divider>

    <v-card-text class="pt-1 my-4 pb-3">
      <v-row class="ps-0">
        <v-col cols="12" sm="6" md="3">
          <span class="fs-15 label-color">Destination Name</span>

          <AppTextField v-model="filters.destination_name" Placeholder="Destination Name" />
        </v-col>
        <v-col cols="12" sm="6" md="3">
          <span class="fs-15 label-color">Country</span>

          <AppAutocomplete v-model="filters.country_id" :items="countries" item-title="name" item-value="id"
            placeholder="Select Country"></AppAutocomplete>
        </v-col>
        <!-- <VCol cols="12" sm="6" md="3">
            <span class="fs-15 label-color">Company</span>
            <AppAutocomplete :items="country" placeholder="Select Company" />
          </VCol> -->
        <VCol cols="12" sm="6" md="3">
          <span class="fs-15 label-color">Payers</span>
          <AppAutocomplete v-model="filters.payer_id" :items="payers" item-title="name" item-value="id"
            placeholder="Select Payer"> 
            <template #item="{ item, props, selected }">
                    <div v-bind="props" class="px-3 py-1 mb-2" :class="selected ? 'bg-primary text-white' : 'text-body'"
                      style="border-radius: 4px;">
                      {{ item?.name || item?.raw?.name }} - <b class="bg-primary px-1 py-1 rounded text-capitalize">{{ item?.method === 'mobile_wallet' ? 'mobile wallet' : item?.method  || item?.raw?.method === 'mobile_wallet' ? 'mobile wallet' : item?.raw?.method
                        }}</b>
                    </div>
                  </template>

                  <template #selection="{ item }">
                    <span v-if="item">
                      {{ item?.name || item?.raw?.name }} - <b class="text-primary text-capitalize">{{ item?.method === 'mobile_wallet' ? 'mobile wallet' : item?.method  || item?.raw?.method === 'mobile_wallet' ? 'mobile wallet' : item?.raw?.method
                        }}</b>
                    </span>
                    <span v-else>Select method</span>
                  </template>
          </AppAutocomplete>
        </VCol>
        <VCol cols="12" sm="6" md="3">
          <span class="fs-15 label-color">Partners</span>
          <AppAutocomplete v-model="filters.partner_id" :items="partners" item-title="name" item-value="id"
            placeholder="Select Partner" />
        </VCol>
        <VCol cols="12" sm="6" md="3">
          <span class="fs-15 label-color">City Name</span>
          <AppTextField v-model="filters.city_name" placeholder="City Name" />
        </VCol>

        <VCol cols="12 d-flex gap-2 align-end justify-start" sm="10" md="4">
          <VBtn @click="search" variant="tonal" class="login-btn">
            Search
          </VBtn>
          <VBtn @click="resetFilters" type="reset " variant="tonal" color="secondary">
            Reset
          </VBtn>
        </VCol>
      </v-row>
    </v-card-text>
    <v-divider></v-divider>
    <VCardText class="d-flex flex-wrap gap-4 justify-between pb-2">
      <div class="me-3 d-flex gap-3">
        <ItemsPerPageSelector
          v-model="itemsPerPage"
          @update:model-value="updateItemsPerPage"
        />
      </div>
      <VSpacer />

      <VBtn color="secondary" variant="tonal" to="" prepend-icon="tabler-upload">
        Export CSV
      </VBtn>

      <VBtn color="primary" variant="elevated" :to="'cash-destination/clone-destination'" target="_blank"> Clone
        Destination </VBtn>
    </VCardText>

    <VCardText class="px-0 border-t-sm">
    <VDatableComponent
        :headers="headers"
        :items="cashDestinations"
        :loading="loading"
        :search="search"
        :pagination="pagination"
        :pageNo="pageNo"
        @update:pageNo="pageNo = $event"
      >
        <!-- Status -->
        <template #item.status="{ item }">
          <VChip :color="resolveStatusVariant(item.status).color" class="font-weight-medium" size="small">
            {{ resolveStatusVariant(item.status).text }}
          </VChip>
        </template>

        <!-- Actions -->
        <template #item.action="{ item }">
          
          <div class="d-flex gap-1">
              <VBtn
                icon
                variant="text"
                color="medium-emphasis"
                @click="openAuditLog(item)"
              >
              <VIcon icon="tabler-history" />
            </VBtn>
            <IconBtn @click="deleteUser(item.id)" class="d-none">
              <VIcon icon="tabler-trash" />
            </IconBtn>

            <VBtn icon variant="text" color="medium-emphasis" v-if="permissionStore.hasPermission('destination.partners.list')">
              <VIcon icon="tabler-dots-vertical" />
              <VMenu activator="parent">
                <VList>
                  <VListItem :to="`cash-destination/destination-code/${item.id}?name=${item.destination_name}`">
                    <VListItemTitle>Cash Destination Code</VListItemTitle>
                  </VListItem>
                </VList>
              </VMenu>
            </VBtn>
          </div>
        </template>
      </VDatableComponent>
    </VCardText>
  </v-card>
    <AuditLog
      v-if="selectedId"
      module="CashDestination"
      :id="selectedId"
      class="mt-4"
    />
</template>
