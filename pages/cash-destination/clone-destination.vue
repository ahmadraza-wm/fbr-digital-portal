<script setup>
const { $axios } = useNuxtApp();
import useUiFeedback from "@/composables/useUiFeedback";
import { useCashDestincation } from "@/composables/useCashDestincation";
import { onMounted, ref } from "vue";
import { useRoute } from "vue-router";
const pageNo = ref(1);
const {
  loading,
  showLoading,
  hideLoading,
  showSuccess,
  showError,
  confirmAction,
} = useUiFeedback();
const route = useRoute();
const countryCurrencyStore = useCountryCurrencyStore();
const { countries, currencies } = storeToRefs(countryCurrencyStore);
const {
  cashDestinations,
  filterCashDestinations,
  pagination,
} = useCashDestincation();

const selectedCountry = ref(null)
const selectedPayer = ref(null)
const selectedClonePayer = ref(null)
const allPayers = ref([]);
const payers = ref([]);
const filters = ref({
  country_id: "",
  payer_id: "",
  new_payer_id: ""
});

watch(() => filters.value.country_id, async (newCountryId) => {
  if (newCountryId) {
    filters.value.payer_id = "";
    await getPartnerPayers(newCountryId);
  } else {
    payers.value = [];
  }
});
const search = () => {
  filterCashDestinations({
    ...filters.value,
    page: pageNo.value
  });
};

const getPartnerPayers = async (countryId) => {
  try {
    const res = await $axios.get(`/payers/list?pagination=false`);

    // store full list in allPayers
    allPayers.value = res.data?.data?.data || [];

    // filter by country_id for dropdown
    payers.value = allPayers.value.filter(
      payer => Number(payer.country_id) === Number(countryId) && payer.method === 'cash'
    );

    console.log("Filtered Payers:", payers.value);
  } catch (error) {
    console.error("Error fetching payers:", error);
  }
};

watch(() => filters.value.payer_id, () => {
  pageNo.value = 1;
  search();
});

const saveCloneDestination = async () => {
  showLoading("Saving Clone destination...");
  try {
    const response = await $axios.post("/clone/destination", filters.value);
    if (response.status === 200 || response.status === 201) {
      showSuccess("Cash destination added successfully!");
      setTimeout(() => router.push("/cash-destination"), 1500);
    }
  } catch (error) {
    console.error("Error saving cash destination:", error);
    const messages = error.response?.data?.errors
      ? Object.values(error.response.data.errors).flat()
      : error.response?.data?.message || "Something went wrong";
    showError(messages);
  } finally {
    hideLoading();
  }
};

const header = ref([
  { title: "#", key: "sr_no" },
  { title: "Code", key: "id" },
  { title: "Destinations", key: "destination_name" },
  { title: "Country", key: "country" },
]);

</script>

<template>
  <v-card>
    <VCardTitle style="background-color: #e6e6e6;">
      <h4 class="text-h4 py-2">Clone Destination</h4>
    </VCardTitle>

    <VCardText class="mt-4">
      <VForm @submit.prevent="">
        <VRow>
          <v-col cols="12" md="6">
            <span class="fs-14 label-color font-weight-regular">Countries <span class="text-red">*</span></span>
            <AppAutocomplete v-model="filters.country_id" :items="countries" item-title="name" item-value="id"
              placeholder="Select Country" :rules="[requiredValidator]" />
          </v-col>
          <v-col cols="12" md="6">
            <span class="fs-14 label-color font-weight-regular">Payer From Clone <span class="text-red">*</span></span>
            <AppAutocomplete v-model="filters.payer_id" :items="payers" :item-title="(item) => {
              const n = item?.name ?? '';
              const m = item?.method ?? '';
              return n && m ? `${n} - ${m}` : n || m;
            }" item-value="id" placeholder="Select Payer" >
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
          </v-col>
        </VRow>
      </VForm>
    </VCardText>
    <v-card-text class="px-0 pb-0 border-t-sm" v-if="filters.payer_id">
      <VDatableComponent :headers="header" :items="!loading ? cashDestinations : []" :loading="loading" :search="search"
        :pagination="pagination" :pageNo="pageNo" @update:pageNo="pageNo = $event" class="border-b-sm">
      </VDatableComponent>
      <VRow class="px-3 py-3">
        <VCol class="px-4 py-3 pb filter row d-flex align-center justify-space-between">
          <h4 class="text-h5 py-2">Payer Destinations</h4>
        </VCol>
        <v-col cols='12' md="6" class="d-flex align-center justify-end gap-3">
          <span class="fs-15 label-color font-weight-bold">Select Payer To Clone :</span>
          <AppAutocomplete v-model="filters.new_payer_id" :items="payers.filter(p => p.id !== filters.payer_id)"
            :item-title="(item) => {
              const n = item?.name ?? '';
              const m = item?.method ?? '';
              return n && m ? `${n} - ${m}` : n || m;
            }" item-value="id" placeholder="Select Payer to clone" ><template #item="{ item, props, selected }">
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
          <VBtn color="primary" variant="elevated" @click="saveCloneDestination()">Clone Destination</VBtn>
          <!-- <VBtn color="red" variant="elevated" class="ms-3" @click="deleteLastClonedRow">Delete</VBtn> -->
        </v-col>
      </VRow>
    </v-card-text>
  </v-card>
</template>
