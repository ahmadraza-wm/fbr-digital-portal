<script setup>
definePageMeta({
  middleware: "auth",
  permission: "agent.source.rates"
})
const permissionStore = usePermissionStore()
import { ref, onMounted, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
const { $axios } = useNuxtApp();
const countryCurrencyStore = useCountryCurrencyStore();
const { sending_countries, receiving_countries, pagination } = storeToRefs(countryCurrencyStore);
import { useAgentRates } from "@/composables/agentPortal/useRates";
const { sourceRates, fetchSourceRates, fetchAgentRatesFilters } = useAgentRates();
import { useAgentProfile } from '@/composables/agentPortal/useProfile';
const { fetchProfileDetail, userDetails } = useAgentProfile();
import useUiFeedback from "@/composables/useUiFeedback";
const {
  loading,
  showLoading,
  hideLoading,
  showSuccess,
  showError,
  confirmAction,
} = useUiFeedback();
const filters = ref({
  receiving_country_id: null,
  payer_name: ""
});
const filterRecivingCountries = ref([]);
const payers = ref([]);
const allPayers = ref();
const fetchWithFilters = (params) => {
  return fetchAgentRatesFilters({ ...filters.value, ...params });
}
const { pageNo, itemsPerPage, updateItemsPerPage, loadPage } = usePagination(
  fetchWithFilters,
  {
    initialPage: 1,
    initialPerPage: 10,
  }
);
const headers = [
  { title: "#", key: "sr_no" },
  { title: "Payer", key: "payer_name" },
  { title: "Country", key: "receiving_country_id" },
  { title: "Currency", key: "receiving_country_id" },
  { title: "Rate", key: "rate" },
];
const filtersRates = () => {
  fetchAgentRatesFilters(filters.value);
}
const getRecivingCountries = async (id) => {
  try {
    showLoading('Fetching receiving countries...')

    const response = await $axios.get(`/get/receiving/countries/${id}`)

    if (response.data.success) {
      filterRecivingCountries.value = response.data.data
    } else {
      showError("Failed to fetch receiving countries")
    }

  } catch (error) {
    const responseData = error.response?.data

    if (responseData?.errors) {
      Object.values(responseData.errors).flat().forEach(err => showError(err))
    } else {
      showError(responseData?.message || "Something went wrong")
    }
  } finally {
    hideLoading()
  }
}
const getPayers = async (countryId) => {
  const res = await $axios.get('/agent/payers/list', {
    params: {
      pagination: false,
      force_fetch: true,
    },
  });
  allPayers.value = res.data?.data?.data || [];

  payers.value = allPayers.value.filter(
    payer => Number(payer.country_id) === Number(countryId)
  );
};

watch(
  () => filters.value.receiving_country_id,
  async (newCountryId) => {
    if (newCountryId) {
      filters.value.payer_id = null;
      await getPayers(newCountryId);
    }
  },
  { immediate: true }
);


onMounted(async () => {
  await fetchProfileDetail();
  await fetchSourceRates();
  if (userDetails.value?.country_id) {
    await getRecivingCountries(userDetails?.value.country_id)
  }
});

</script>

<template>
  <v-card>
    <v-row>
      <v-col cols="12">
        <v-card-title class="border-b-sm" style="background-color: lightgrey;">
          <h4 class="text-h5 py-3">Exchange Rates</h4>
        </v-card-title>
      </v-col>
    </v-row>
    <v-card-text class="border-b-sm">
      <VForm @submit.prevent="filtersRates" @reset.prevent="filtersRates">
        <v-row class="ps-0">
          <v-col cols="12" sm="6" md="3">
            <span class="fs-14 label-color font-weight-regular">Receiving Country</span>
            <AppAutocomplete :items="filterRecivingCountries" item-title="name" item-value="id"
              placeholder="Receiving country" v-model="filters.receiving_country_id" />
          </v-col>
          <v-col cols="12" sm="6" md="3">
            <span class="fs-14 label-color font-weight-regular">Payers</span>
            <AppAutocomplete :items="payers" item-title="name" item-value="name" placeholder="Payers"
              v-model="filters.payer_name" />
          </v-col>
          <v-col cols="12 d-flex gap-2 align-end justify-start" sm="10" md="4">
            <VBtn type="submit" variant="tonal" class="login-btn">Search</VBtn>
            <VBtn type="reset" color="secondary" variant="tonal">Reset</VBtn>
          </v-col>
        </v-row>
      </VForm>
    </v-card-text>
    <VCardText class="d-flex flex-wrap gap-4 justify-space-between mt-6 pb-2">
      <div class="me-3 d-flex gap-3">
        <ItemsPerPageSelector v-model="itemsPerPage" @update:model-value="updateItemsPerPage" />
      </div>
    </VCardText>


    <VDatableComponent :headers="headers" :items="sourceRates" :loading="loading" :search="search"
      :pagination="pagination" :pageNo="pageNo" @update:pageNo="pageNo = $event" class="border-t-sm" />
  </v-card>
</template>
