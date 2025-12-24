<script setup>
import { ref, onMounted, watch } from "vue";
import { useCountryCurrencyStore } from "@/stores/useCountryCurrencyStore";
import { storeToRefs } from "pinia";
import useUiFeedback from "@/composables/useUiFeedback";
definePageMeta({
  middleware: "auth",
  permission: "currencies.list"
})
const {
  countriesList,
  currenciesList,
  currencyPagination,
  countryPagination,
  fetchCountriesList,
  fetchCurrenciesList,
} = useAgents();

const { showLoading, hideLoading, showError } = useUiFeedback();

const { pageNo, itemsPerPage, updateItemsPerPage, loadPage } = usePagination(
  fetchCurrenciesList,
  {
    initialPage: 1,
    initialPerPage: 10,
  }
);

const options = ref({
  page: 1,
  sortBy: [""],
  sortDesc: [false],
});

const currencyName = ref("");
const currencyCode = ref("");

const headers = [
  { title: "#", key: "sr_no" },
  { title: "NAME", key: "name" },
  { title: "CODE", key: "code" },
];

const searchCurrencies = async () => {
  showLoading("Fetching currencies...");
  try {
    await fetchCurrenciesList({
      name: currencyName.value,
      code: currencyCode.value,
    });
  } catch (error) {
    showError("Failed to fetch currencies.");
    console.error(error);
  } finally {
    hideLoading();
  }
};

const resetFilters = async () => {
  currencyName.value = "";
  currencyCode.value = "";
  showLoading("Resetting filters and fetching all currencies...");
  try {
    await fetchCurrenciesList();
  } catch (error) {
    showError("Failed to reset and fetch currencies.");
    console.error(error);
  } finally {
    hideLoading();
  }
};
</script>

<template>
  <v-card>
    <v-row>
      <v-col cols="12">
        <v-card-title>
          <h4 class="text-h5 py-3">Currencies List</h4>
        </v-card-title>
      </v-col>
    </v-row>
    <v-divider></v-divider>
    <v-card-text class="pt-1 my-4 pb-3">
      <VForm @submit.prevent="searchCurrencies">
        <v-row class="ps-0">
          <v-col cols="12" sm="10" md="10" class="ps-1">
            <v-row>
              <v-col cols="12" sm="6" md="6">
                <span class="fs-15 label-color">Currency Name</span>
                <AppTextField
                  v-model="currencyName"
                  name="currencyName"
                  placeholder="Type.."
                  autocomplete="off"
                />
              </v-col>

              <v-col cols="12" sm="6" md="6">
                <span class="fs-15 label-color">Currency Code</span>
                <AppTextField
                  v-model="currencyCode"
                  name="currency_code"
                  placeholder="Type.."
                  autocomplete="off"
                />
              </v-col>
            </v-row>
          </v-col>
          <VCol cols="12 d-flex gap-2 align-end" sm="10" md="2">
            <VBtn type="submit" variant="tonal" class="login-btn"> Search </VBtn>
            <VBtn @click="resetFilters" variant="tonal" color="secondary"> Reset </VBtn>
          </VCol>
        </v-row>
      </VForm>
    </v-card-text>
    <v-divider></v-divider>
    <VCardText class="d-flex flex-wrap gap-4 pb-2">
      <div class="me-3 d-flex gap-3">
        <ItemsPerPageSelector
          v-model="itemsPerPage"
          @update:model-value="updateItemsPerPage"
        />
      </div>
      <VSpacer />
    </VCardText>
    <VCardText class="px-0">
      <VDatableComponent
        :headers="headers"
        :items="currenciesList"
        :loading="loading"
        :search="search"
        :pagination="currencyPagination"
        :pageNo="pageNo"
        @update:pageNo="pageNo = $event"
        class="border-t-sm"
      />
    </VCardText>
  </v-card>
</template>
