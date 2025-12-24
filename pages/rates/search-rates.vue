<script setup>
import { useRules } from "@/composables/useRules";
import { ref, computed, onMounted } from "vue";
const { $axios } = useNuxtApp();
const showAdvancedSearch = ref(false);
const saerch_rates = ref([]);
const permissionStore = usePermissionStore()
definePageMeta({
  middleware: "auth",
  permission: "rate.index"
})
const {
  countries,
  currencies,
  channels,
  countriesWithAll,
  agentsWithAll,
  sending_methods_tags,
  receiving_methods_tags,
} = useRules();

const { agents, fetchAgents } = useAgents();

const loading = ref(false);
const error = ref(null);

const selectedChannel = ref(null);
const selectedAgent = ref(null);
const selectedCountry = ref(null);
const selectedSendingMethod = ref(null);
const selectedReceivingMethod = ref(null);

const pagination = ref(null);

const filteredAgentsWithAll = computed(() => {
  if (!selectedChannel.value || selectedChannel.value === "all") {
    return [{ id: "all", name: "All" }, ...agents.value];
  }

  return [
    { id: "all", name: "All" },
    ...agents.value.filter((agent) => agent.channel === selectedChannel.value),
  ];
});

const fetchSearchRates = async () => {
  loading.value = true;
  try {
    const params = {
      channel: selectedChannel.value,
      sending_country_id: selectedCountry.value,
      agent_id: selectedAgent.value,
      sending_method: selectedSendingMethod.value,
      receiving_method: selectedReceivingMethod.value,
      page: pageNo.value,
      perPage: itemsPerPage.value,
      pagination: itemsPerPage.value !== -1,
    };

    const { data } = await $axios.get("/rate/search/filter", { params });
    const rates = data.data.rates;

    if (Array.isArray(rates)) {
      saerch_rates.value = rates;
      pagination.value = null;
    } else {
      saerch_rates.value = rates.data;
      pagination.value = rates;
    }
  } catch (err) {
    error.value = err;
    console.error("Search failed:", err);
  } finally {
    loading.value = false;
  }
};

const { pageNo, itemsPerPage, updateItemsPerPage, loadPage } = usePagination(
  fetchSearchRates,
  {
    initialPage: 1,
    initialPerPage: 10,
  }
);

const headers = [
  { title: "#", key: "sr_no" },
  { title: "Payer", key: "payer" },
  { title: "Rate Before Spread", key: "rate_before_spread" },
  { title: "Rate After Spread", key: "rate_after_spread" },
];

onMounted(() => {
  fetchAgents({force_fetch:true}, false);
  loadPage(1);
});
</script>

<template>
  <v-card>
    <v-row>
      <v-col cols="12">
        <v-card-title class="py-5 border-b-sm">
          <h4 class="text-h5">Search Rates</h4>
        </v-card-title>
      </v-col>
    </v-row>

    <!-- Filters -->
    <v-card-text class="pt-4 pb-5 border-b-sm mb-5" v-if="permissionStore.hasPermission('rate.search.filter')">
      <VForm @submit.prevent="loadPage(1)">
        <v-row class="ps-0">
          <v-col cols="12" sm="6" md="3">
            <span class="fs-15 label-color font-weight-medium">Channel</span>
            <AppAutocomplete
              v-model="selectedChannel"
              :items="channels"
              placeholder="Select Channel"
            />
          </v-col>
          <v-col cols="12" sm="6" md="3">
            <span class="fs-15 label-color font-weight-medium">Agents</span>
            <AppAutocomplete
              v-model="selectedAgent"
              :items="filteredAgentsWithAll"
              item-title="name"
              item-value="id"
              placeholder="Select Agent"
            />
          </v-col>
          <v-col cols="12" sm="6" md="3">
            <span class="fs-15 label-color font-weight-medium">Country</span>
            <AppAutocomplete
              v-model="selectedCountry"
              :items="countriesWithAll"
              item-title="name"
              item-value="id"
              placeholder="Select Country"
            />
          </v-col>
          <v-col cols="12" sm="6" md="3">
            <span class="fs-15 label-color font-weight-medium">Sending Method</span>
            <AppAutocomplete
              v-model="selectedSendingMethod"
              :items="sending_methods_tags"
              placeholder="Select Sending Method"
            />
          </v-col>
          <v-col cols="12" sm="6" md="3">
            <span class="fs-15 label-color font-weight-medium">Receiving Method</span>
            <AppAutocomplete
              v-model="selectedReceivingMethod"
              :items="receiving_methods_tags"
              placeholder="Select Receiving Method"
            />
          </v-col>
          <VCol cols="12 d-flex gap-2 align-end" sm="10" md="2">
            <VBtn type="submit" variant="tonal" class="login-btn">Search</VBtn>
            <VBtn
              type="reset"
              @click="resetForm"
              variant="tonal"
              color="secondary"
            >
              Reset
            </VBtn>
          </VCol>
        </v-row>
      </VForm>
    </v-card-text>

    <VCardText class="d-flex flex-wrap gap-4 pt-5 pb-2">
        <ItemsPerPageSelector
          v-model="itemsPerPage"
          @update:model-value="updateItemsPerPage"
        />
    </VCardText>

    <VCardText class="px-0">
      <transition name="fade">
        <VCardText class="px-0 pt-0">
          <VDatableComponent
            :headers="headers"
            :items="saerch_rates"
            :loading="loading"
            :pagination="pagination"
            :pageNo="pageNo"
            @update:pageNo="loadPage"
            class="border-t"
          />
        </VCardText>
      </transition>
    </VCardText>
  </v-card>
</template>
