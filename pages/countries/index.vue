<script setup>
import useUiFeedback from "@/composables/useUiFeedback";
import { useCountryCurrencyStore } from "@/stores/useCountryCurrencyStore";
import { storeToRefs } from "pinia";
import { onMounted, ref } from "vue";

const { $axios } = useNuxtApp();
definePageMeta({
  middleware: "auth",
  permission: "countries.list"
})
const countryCurrencyStore = useCountryCurrencyStore();
const { countries, currencies } = storeToRefs(countryCurrencyStore);

const { loading, showLoading, hideLoading, showError, showSuccess } = useUiFeedback();

const {
  countriesList,
  currenciesList,
  currencyPagination,
  countryPagination,
  fetchCountriesList,
  fetchCurrenciesList,
} = useAgents();

const { pageNo, itemsPerPage, updateItemsPerPage, loadPage } = usePagination(
  fetchCountriesList,
  {
    initialPage: 1,
    initialPerPage: 10,
  }
);

const options = ref({
  page: 1,
  itemsPerPage: 5,
  sortBy: [""],
  sortDesc: [false],
});

const selectedCountry = ref("");
const selectedCurrency = ref("");
const phoneCode = ref("");

const headers = [
  { title: "#", key: "sr_no" },
  { title: "Country Name", key: "name" },
  { title: "Currency", key: "currency" },
  { title: "Capital", key: "capital" },
  { title: "ISO2", key: "iso2" },
  { title: "ISO3", key: "iso3" },
  { title: "Phone Code", key: "dial_code", isEditing: false },
];

const resolveStatusVariant = (status) => {
  const statuses = {
    1: { color: "primary", text: "Current" },
    2: { color: "success", text: "Professional" },
    3: { color: "error", text: "Rejected" },
    4: { color: "warning", text: "Resigned" },
  };
  return statuses[status] || { color: "info", text: "Applied" };
};

const searchCurrencies = async () => {
  showLoading("Fetching countries...");
  try {
    await fetchCountriesList({
      name: selectedCountry.value,
      currency: selectedCurrency.value,
      dial_code: phoneCode.value,
    });
  } catch (error) {
    showError("Failed to fetch countries.");
    console.error(error);
  } finally {
    hideLoading();
  }
};

const resetFilters = async () => {
  selectedCountry.value = "";
  selectedCurrency.value = "";
  phoneCode.value = "";

  showLoading("Resetting filters and fetching all countries...");
  try {
    await fetchCountriesList();
  } catch (error) {
    showError("Failed to reset and fetch countries.");
    console.error(error);
  } finally {
    hideLoading();
  }
};

const updateDialCode = async (country) => {
  showLoading(`Updating dial code for ${country.name}...`);
  try {
    await $axios.patch(`/country/update/${country.id}`, {
      dial_code: country.dial_code,
    });
    showSuccess("Dial code updated successfully.");
  } catch (error) {
    showError("Failed to update dial code.");
    console.error("Failed to update dial code:", error);
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
          <h4 class="text-h5 py-3">Countries</h4>
        </v-card-title>
      </v-col>
    </v-row>
    <v-divider></v-divider>

    <v-card-text class="pt-1 my-4 pb-3">
      <VForm @submit.prevent="searchCurrencies">
        <v-row class="ps-0">
          <v-col cols="12" sm="10" md="10" class="ps-1">
            <v-row>
              <v-col cols="12" sm="6" md="4">
                <span class="fs-15 label-color">Country Name</span>
                <v-autocomplete
                  v-model="selectedCountry"
                  :items="countries.map((c) => c.name)"
                  placeholder="Select Country"
                />
              </v-col>

              <v-col cols="12" sm="6" md="4">
                <span class="fs-15 label-color">Currency</span>
                <v-autocomplete
                  v-model="selectedCurrency"
                  :items="currencies.map((c) => c.code)"
                  placeholder="Select Currency"
                />
              </v-col>
              <VCol cols="12" sm="6" md="4">
                <span class="fs-15 label-color">Phone Code</span>
                <v-autocomplete
                  v-model="phoneCode"
                  :items="countries.map((c) => c.dial_code)"
                  placeholder="Select Phone Code"
                />
              </VCol>
            </v-row>
          </v-col>
          <VCol cols="12" sm="10" md="2" class="d-flex gap-2 align-end">
            <VBtn type="submit" variant="tonal" class="login-btn"> Search </VBtn>
            <VBtn type="reset" variant="tonal" color="secondary" @click="resetFilters">
              Reset
            </VBtn>
          </VCol>
        </v-row>
      </VForm>
    </v-card-text>
    <v-divider></v-divider>

    <VCardText class="d-flex flex-wrap gap-4">
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
        :items="countriesList"
        :loading="loading"
        :search="search"
        :pagination="countryPagination"
        :pageNo="pageNo"
        @update:pageNo="pageNo = $event"
      />
      <!-- Name -->
      <template #item.name="{ item }">
        <span>{{ item.name }}</span>
      </template>
      <template #item.fullName="{ item }">
        <div class="d-flex align-center">
          <VAvatar
            size="32"
            :color="item.avatar ? '' : 'primary'"
            :class="item.avatar ? '' : 'v-avatar-light-bg primary--text'"
            :variant="!item.avatar ? 'tonal' : undefined"
          >
            <VImg v-if="item.avatar" :src="item.avatar" />
          </VAvatar>
          <div class="d-flex flex-column ps-2">
            <span class="text-truncate v-data-table__td">{{ item.name }}</span>
          </div>
        </div>
      </template>

      <template #item.dial_code="{ item }">
        <div
          v-if="!item.isEditing"
          class="d-flex align-items-center justify-space-between py-1 input-bg rounded"
          variant="elevated"
        >
          <span class="fs-14 ps-2 input-color">{{ item.dial_code }}</span>
          <VIcon
            icon="tabler-pencil"
            class="cursor-pointer fs-14 me-2 input-color"
            @click="item.isEditing = true"
          />
        </div>
        <v-text-field
          v-else
          v-model="item.dial_code"
          dense
          single-line
          hide-details
          class="partner-code-field"
          @blur="
            () => {
              item.isEditing = false;
              updateDialCode(item);
            }
          "
          @keyup.enter="
            () => {
              item.isEditing = false;
              updateDialCode(item);
            }
          "
        />
      </template>
    </VCardText>
  </v-card>
</template>
