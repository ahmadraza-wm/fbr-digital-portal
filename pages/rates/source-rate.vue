<script setup>
import { useNuxtApp } from "#app";
import { storeToRefs } from "pinia";
import { onMounted, ref } from "vue";
import AuditLog from '@/components/AuditLog.vue'

const permissionStore = usePermissionStore()
definePageMeta({
  middleware: "auth",
  permission: "source.rates"
})

const selectedId = ref(null)

const openAuditLog = (item) => {
  if (selectedId.value === item.id) {
    selectedId.value = null
  } else {
    selectedId.value = item.id
  }
}


const { $axios } = useNuxtApp();
const countryCurrencyStore = useCountryCurrencyStore();
const { currencies } = storeToRefs(countryCurrencyStore);

const loading = ref(false);
const showAdvancedSearch = ref(false);

const sending_currency = ref('');
const receiving_currency = ref('');
const from = ref(null);
const to = ref(null);
const created_by_id = ref(null);
const created_by_idOptions = ref([]);

const headers = [
  { title: "#", key: "sr_no" },
  { title: "Payer", key: "payer" },
  { title: "Sending Currency", key: "sending_currency" },
  { title: "Receiving Currency", key: "receiving_currency" },
  { title: "Main Agent Rate", key: "main_agent_rate" },
  { title: "Rate", key: "rate" },
  { title: "Date", key: "created_at" },
  { title: "Created By", key: "created_by" },
  { title: "Action By", key: "action" },
];

const sourserates = ref([]);
const pagination = ref(null);

const fetchSourceRates = async () => {
  loading.value = true;
  try {
    const params = {
      sending_currency: sending_currency.value,
      receiving_currency: receiving_currency.value,
      from: from.value,
      to: to.value,
      created_by_id: created_by_id.value,
      page: pageNo.value,
      perPage: itemsPerPage.value,
      pagination: itemsPerPage.value !== -1,
    };

    const response = await $axios.get("/source/rate", { params });

    if (response.data.success) {
      const data = response.data.data.source_rates;

      if (Array.isArray(data)) {
        sourserates.value = data;
        pagination.value = null;
      } else {
        sourserates.value = data.data;
        pagination.value = data;
      }
    }
  } catch (err) {
    console.error("Failed to fetch source rates:", err);
  } finally {
    loading.value = false;
  }
};


const { pageNo, itemsPerPage, updateItemsPerPage, loadPage } = usePagination(
  fetchSourceRates,
  {
    initialPage: 1,
    initialPerPage: 10,
  }
);

const fetchBackOfficeUsers = async () => {
  try {
    const response = await $axios.get("/backOfficeUsers");
    created_by_idOptions.value = response.data.data.data.map((item) => ({
      title: item.user.name,
      value: item.user.id,
    }));
  } catch (err) {
    console.error("Error loading back office users:", err);
  }
};

// Handle form submit
const onSearch = () => {
  fetchSourceRates();
};

// Reset form
const onReset = () => {
  sending_currency.value = '';
  receiving_currency.value = '';
  from.value = null;
  to.value = null;
  created_by_id.value = null;
  fetchSourceRates();
};

// Initial fetch
onMounted(() => {
  fetchSourceRates();
  fetchBackOfficeUsers();
});
</script>

<template>
  <v-card>
    <v-row>
      <v-col cols="12">
        <v-card-title class="pt-5">
          <h4 class="text-h5">Source Rates</h4>
        </v-card-title>
      </v-col>
    </v-row>

    <v-card-text class="pt-5 my-4 pb-3 border-t-sm" v-if="permissionStore.hasPermission('source.rate.filter')">
      <VForm @submit.prevent="onSearch">
        <v-row class="ps-0">
          <v-col cols="12" sm="6" md="3">
            <span class="fs-15 label-color font-weight-medium">Src Currency</span>
            <AppAutocomplete v-model="sending_currency" :items="currencies" :item-title="(item) => `${item.code} - ${item.name}`" item-value="code"
              placeholder="Src Currency" dense>
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
                <span v-else>Select Src currency</span>
              </template>
            </AppAutocomplete>

          </v-col>
          <v-col cols="12" sm="6" md="3">
            <span class="fs-15 label-color font-weight-medium">Destination Currency</span>
            <AppAutocomplete v-model="receiving_currency" :items="currencies" :item-title="(item) => `${item.code} - ${item.name}`" item-value="code"
              placeholder="Destination Currency" >
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
                <span v-else>Select destination currency</span>
              </template>
            </AppAutocomplete>
          </v-col>
          <v-col cols="12" sm="6" md="3">
            <span class="fs-15 label-color font-weight-medium">From</span>
            <AppDateTimePicker v-model="from" placeholder="DD-MM-YYYY" :config="{ dateFormat: 'd-m-Y' }" />
          </v-col>
          <v-col cols="12" sm="6" md="3">
            <span class="fs-15 label-color font-weight-medium">To</span>
            <AppDateTimePicker v-model="to" placeholder="DD-MM-YYYY" :config="{ dateFormat: 'd-m-Y' }" />
          </v-col>
          <template v-if="showAdvancedSearch">
            <v-col cols="12" sm="6" md="3">
              <span class="fs-15 label-color font-weight-medium">Created By</span>
              <AppAutocomplete v-model="created_by_id" :items="created_by_idOptions" placeholder="All" />
            </v-col>
          </template>
          <v-col cols="12 d-flex gap-2 align-end justify-start" sm="10" md="4">
            <VBtn type="button" variant="elevated" :color="!showAdvancedSearch ? 'primary' : 'error'"
              @click="showAdvancedSearch = !showAdvancedSearch">
              {{ showAdvancedSearch ? "Hide Advance Search" : "Advance Search" }}
            </VBtn>
            <VBtn type="submit" class="login-btn" variant="tonal"> search </VBtn>
            <VBtn type="reset" @click="onReset" color="secondary" variant="tonal">
              Reset
            </VBtn>
          </v-col>
        </v-row>
      </VForm>
    </v-card-text>

    <v-divider></v-divider>
    <VCardText class="d-flex flex-wrap gap-4 pb-3">
      <div class="me-3 d-flex gap-3">
        <ItemsPerPageSelector v-model="itemsPerPage" @update:model-value="updateItemsPerPage" />
      </div>
      <VSpacer />
    </VCardText>

    <VCardText class="px-0 border-t-sm pb-0">
      <VDatableComponent :headers="headers" :items="sourserates" :loading="loading" :search="search"
        :pagination="pagination" :pageNo="pageNo" @update:pageNo="pageNo = $event">

        <template #item.action="{ item }">

          <VBtn icon variant="text" color="medium-emphasis" @click="openAuditLog(item)">
            <VIcon icon="tabler-history" />
          </VBtn>
        </template>
      </VDatableComponent>
    </VCardText>
  </v-card>

  <AuditLog v-if="selectedId" module="Rate" :id="selectedId" class="mt-4" />
</template>
