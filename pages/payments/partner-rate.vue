<script setup>
import { ref, watch, computed } from "vue";
import { usePartners } from "@/composables/usePartners";
import useUiFeedback from "@/composables/useUiFeedback";
import { useNuxtApp } from "#app";
definePageMeta({
  middleware: "auth",
  permission: "partner.rates"
})
const permissionStore = usePermissionStore()
const countryCurrencyStore = useCountryCurrencyStore();
// const { receiving_countries } = storeToRefs(countryCurrencyStore);

const { $axios } = useNuxtApp();
const { partners, partners_type } = usePartners();
const { loading, showLoading, hideLoading, showSuccess, showError } =
  useUiFeedback();

const selectedType = ref(null);
const selectedPartner = ref(null);
const selectedCurrency = ref(null);
const selectedCurrencyId = ref(null);
const selectedCountry = ref(null);
const showPartnerDetails = ref(false);
const selectedPartnerDetails = ref(null);
const ratesData = ref([]);
const currencyList = ref([]);
const receiving_countries = ref([]);
const generalRates = ref({});

function groupBy(array, key) {
  return array.reduce((result, item) => {
    const groupKey = item[key] || "Unknown";
    if (!result[groupKey]) result[groupKey] = [];
    result[groupKey].push(item);
    return result;
  }, {});
}

const groupedRates = computed(() =>
  groupBy(ratesData.value, "receiving_country")
);

const partnerOptions = computed(() =>
  (partners.value || []).map((p) => ({
    ...p,
    title: p.name,
    value: p.id,
  }))
);

watch([selectedPartner, selectedType], async ([partnerId, type]) => {
  const partner = (partners.value || []).find((p) => p.id === partnerId);
  if (!partner || !type) return;

  selectedPartnerDetails.value = partner;

  if (type === "sc") {
    selectedCurrency.value = partner.settlement_currency;
    selectedCurrencyId.value = partner.currency_id;
    currencyList.value = [
      {
        title: partner.settlement_currency,
        value: partner.currency_id,
      },
    ];
  }

  if (type === "dc") {
    const res = await $axios.get("/get/sending/currencies");
    currencyList.value = res.data.data.map((c) => ({
      title: c.code,
      value: c.id,
    }));
    selectedCurrency.value = null;
    selectedCurrencyId.value = null;
  }

  const countryRes = await $axios.get("/partners/countries", {
    params: {
      partner_id: partnerId,
    },
  });
  receiving_countries.value = countryRes.data.data;
});

watch(selectedCurrency, (newCurrency) => {
  if (newCurrency && selectedType.value === "dc") {
    selectedCurrencyId.value = newCurrency;
  }
});

const handleSearch = async () => {
  if (
    selectedType.value &&
    selectedPartner.value &&
    selectedCurrencyId.value &&
    selectedCountry.value?.length
  ) {
    showPartnerDetails.value = true;

    try {
      const res = await $axios.get("/rates/partner", {
        params: {
          partner_type: selectedType.value,
          partner_id: selectedPartner.value,
          settlement_currency_id: selectedCurrencyId.value,
          "receiving_country_ids[]": selectedCountry.value,
        },
      });

      const reactiveRates = (res.data.data || []).map((item) => ({
        ...item,
        rate: item.rate ?? "",
        receiving_country: item.dealing_currency,
      }));

      ratesData.value = reactiveRates;
    } catch (error) {
      const messages = error.response?.data?.errors
        ? Object.values(error.response.data.errors).flat()
        : error.response?.data?.message || "Something went wrong";

      showError(messages);
    }
  } else {
    showPartnerDetails.value = false;
    showError("Please select all required fields before searching.");
  }
};

const applyGeneralRateToCountry = (country) => {
  const rateValue = generalRates.value[country];

  if (!rateValue || !groupedRates.value[country]) return;

  groupedRates.value[country].forEach((payer) => {
    // Only overwrite if current rate is empty or 0
    if (!payer.rate || payer.rate) {
      payer.rate = rateValue;
    }
  });
};

const buildRatesPayload = () => {
  const allRates = [];

  Object.values(groupedRates.value).forEach((payers) => {
    payers.forEach((payer) => {
      const finalRate = payer.rate;

      if (finalRate && Number(finalRate) > 0) {
        allRates.push({
          payer_id: payer.payer_id,
          rate: finalRate,
          rate_type: selectedType.value,
          settlement_currency_id: selectedCurrencyId.value,
          partner_id: selectedPartner.value,
        });
      }
    });
  });

  return { rates: allRates };
};

const submitRates = async () => {
  const payload = buildRatesPayload();

  if (!payload.rates.length) {
    showError("No rates to submit.");
    return;
  }

  try {
    showLoading();
    await $axios.post("/partner/rates/update", payload);
    showSuccess("Rates updated successfully!");
  } catch (err) {
    const message = err.response?.data?.message || "Failed to update rates.";
    showError(message);
  } finally {
    hideLoading();
  }
};
</script>

<template>
  <v-card>
    <v-row>
      <v-col cols="12">
        <v-card-title class="border-b-sm d-flex align-center">
          <h4 class="text-h4 py-4">Partner Rate</h4>
        </v-card-title>
        <v-card-text>
          <VForm @submit.prevent="handleSearch">
            <VRow class="mt-2">
              <VCol cols="4">
                <span class="fs-13 label-color">Partner Type</span>
                <v-autocomplete v-model="selectedType" :items="partners_type" item-title="title" item-value="value"
                  placeholder="Partner Type" />
              </VCol>

              <VCol cols="4">
                <span class="fs-13 label-color">Partners</span>
                <v-autocomplete v-model="selectedPartner" :items="partnerOptions" item-title="title" item-value="value"
                  placeholder="Partners" />
              </VCol>

              <!-- Settlement Currency appears only when a partner is selected -->
              <VCol cols="4" v-if="selectedPartner">
                <span class="fs-13 label-color">Settlement Currency</span>
                <v-autocomplete v-if="selectedPartner" v-model="selectedCurrency" :items="currencyList"
                  item-title="title" item-value="value" placeholder="Settlement Currency" />
              </VCol>

              <VCol cols="12">
                <span class="fs-13 label-color">Receiving Country</span>
                <v-autocomplete v-model="selectedCountry" :items="receiving_countries" item-title="name" item-value="id"
                  multiple chips closable-chips placeholder="Receiving Country" />
              </VCol>
              <v-col class="d-flex justify-end">
                <VBtn class="login-btn ms-3" color="white" @click="handleSearch">Search</VBtn>
              </v-col>
            </VRow>
            <div class="parter-detail" v-if="showPartnerDetails">
              <VRow class="mt-7 border-b-sm border-t-sm" v-if="selectedPartnerDetails">
                <VCol cols="3">
                  <p class="fs-15 font-weight-medium text-color mb-1">Name</p>
                  <p class="text-color1 mb-0 fs-15 font-weight-medium">
                    {{ selectedPartnerDetails.name || "-" }}
                  </p>
                </VCol>
                <VCol cols="3">
                  <p class="fs-15 font-weight-medium text-color mb-1">Email</p>
                  <p class="text-color1 mb-0 fs-15 font-weight-medium">
                    {{ selectedPartnerDetails.email || "-" }}
                  </p>
                </VCol>
                <VCol cols="3">
                  <p class="fs-15 font-weight-medium text-color mb-1">
                    Username
                  </p>
                  <p class="text-color1 mb-0 fs-15 font-weight-medium">
                    {{ selectedPartnerDetails.user_name || "-" }}
                  </p>
                </VCol>
                <VCol cols="3">
                  <p class="fs-15 font-weight-medium text-color mb-1">
                    Settlement Currency
                  </p>
                  <p class="text-color1 mb-0 fs-15 font-weight-medium">
                    {{ selectedPartnerDetails.settlement_currency || "-" }}
                  </p>
                </VCol>
              </VRow>

              <VRow class="mt-2 border-b-sm" v-if="selectedPartnerDetails">
                <VCol cols="3">
                  <p class="fs-15 font-weight-medium text-color mb-1">
                    Country
                  </p>
                  <p class="text-color1 mb-0 fs-15 font-weight-medium">
                    {{ selectedPartnerDetails.country || "-" }}
                  </p>
                </VCol>
                <VCol cols="3">
                  <p class="fs-15 font-weight-medium text-color mb-1">Status</p>
                  <p class="text-color1 mb-0 fs-15 font-weight-medium">
                    <VChip :color="selectedPartnerDetails.status === 1
                        ? 'success'
                        : 'error'
                      " size="small">
                      {{
                        selectedPartnerDetails.status === 1
                          ? "Active"
                          : "Inactive"
                      }}
                    </VChip>
                  </p>
                </VCol>
              </VRow>

              <!-- <VRow>
                <v-alert type="error" variant="tonal" class="py-4 mt-4 mx-3">
                  <Vcol cols="12">
                    Transfer payer PAY BY BANK (ZERO FEE) is not linked to this
                    partner. Click here to link
                    <span color="primary">
                      <NuxtLink class="text-decoration-underline"
                        >Partner Payer</NuxtLink
                      >
                    </span>
                  </Vcol>
                </v-alert>
              </VRow> -->
              <v-table class="mt-7 border-b-sm">
                <thead>
                  <tr style="background-color: #f9f6f6">
                    <th class="text-left">#</th>
                    <th class="text-left">Payers</th>
                    <th class="text-left">Method</th>
                    <th class="text-left">Dealing Currency</th>
                    <th class="text-left">Settlement Currency</th>
                    <th class="text-left">rate</th>
                    <th class="text-left">Added By</th>
                    <th class="text-left">Last Updated</th>
                  </tr>
                </thead>
                <tbody v-if="ratesData.length">
                  <template v-for="(rates, country) in groupedRates" :key="country">
                    <!-- General Rate Input Row for Country -->
                    <tr>
                      <td colspan="4">
                        <VChip color="info" variant="tonal">{{
                          country
                          }}</VChip>
                      </td>
                      <td colspan="2">
                        <AppTextField type="number" v-model="generalRates[country]" name="general-rate"
                          placeholder="General Rate" @change="applyGeneralRateToCountry(country)" v-if="permissionStore.hasPermission('partner.rates.update')" />
                      </td>
                      <td colspan="2"></td>
                    </tr>

                    <!-- List of payers for this country -->
                    <tr v-for="(rate, index) in rates" :key="`${country}-${index}`">
                      <td>{{ index + 1 }}</td>
                      <td>{{ rate.payer_name }}</td>
                      <td>{{ rate.payer_method }}</td>
                      <td>{{ rate.dealing_currency }}</td>
                      <td>{{ rate.settlement_currency }}</td>
                      <td>
                        <AppTextField type="number" v-model="rate.rate" name="rate" placeholder="Rate" :readonly="!permissionStore.hasPermission('partner.rates.update')"/>
                      </td>
                      <td>{{ rate.added_by?.name || "-" }}</td>
                      <td>{{ rate.created_at }}</td>
                    </tr>
                  </template>
                </tbody>
              </v-table>
              <VRow>
                <v-col Cols="12 " v-if="permissionStore.hasPermission('partner.rates.update')">
                  <div class="d-flex justify-end mt-6 gap-3">
                    <VBtn color="secondary" variant="tonal">Cancel</VBtn>
                    <VBtn class="login-btn" color="white" @click="submitRates">Update Rates</VBtn>
                  </div>
                </v-col>
              </VRow>
            </div>
          </VForm>
        </v-card-text>
      </v-col>
    </v-row>
  </v-card>
</template>
