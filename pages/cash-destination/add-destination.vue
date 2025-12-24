<script setup>
import BackNavigation from "@/@core/components/BackNavigation.vue";
import { useCashDestincation } from "@/composables/useCashDestincation";
import useUiFeedback from "@/composables/useUiFeedback";
import { onMounted, ref, watch } from "vue";
definePageMeta({
  middleware: "auth",
  permission: "destinations.store"
})
const countryCurrencyStore = useCountryCurrencyStore();
const { countries, currencies } = storeToRefs(countryCurrencyStore);
const { $axios } = useNuxtApp();

const payers = ref([]);

const {
  loading,
  showLoading,
  hideLoading,
  showSuccess,
  showError,
  confirmAction,
} = useUiFeedback();

const props = defineProps({ isEdit: Boolean, partnerData: Object });
const {
  cashDestinations,
  headers,
  statuses,
  anyWhere,
  fetchCashDestinations,
  saveCashDestination,
  resolveStatusVariant,
  deleteCashDestination,
} = useCashDestincation();

const formData = ref({
  anywhere: 0,
  country_id: "",
  payer_id: "",
  destination_name: "",
  city_name: "",
  address: "",
  status: "",
});

watch(() => formData.value.country_id, async (newCountryId) => {
  if (newCountryId) {
    formData.value.payer_id = "";
    await getPartnerPayers(newCountryId);
  } else {
    payers.value = [];
  }
});

const getPartnerPayers = async (countryId) => {
  const res = await $axios.get(`/payers/list?pagination=false`);
  const allPayers = res.data.data.data;

  payers.value = allPayers.filter(payer => payer.country_id === countryId);

};

onMounted(() => {
  getPartnerPayers();
});

// const requiredValidator = (v) => !!v || "This field is required";
const requiredValidator = (v) => v !== null && v !== undefined && v !== '' ? true : "This field is required";


const submitForm = () => {
  saveCashDestination(formData.value);
};
</script>

<template>
  <v-card>
    <v-row>
      <v-col cols="12">
        <v-card-title class="d-flex align-center" style="background-color: lightgray;">
          <BackNavigation />
          <h4 class="text-h4 py-3">Add Cash Destination</h4>
        </v-card-title>
      </v-col>
    </v-row>

    <v-card-text class="pt-1 my-4 pb-3">
      <VForm @submit.prevent="submitForm">
        <v-row class="ps-0">
          <v-col cols="12" sm="6" md="6">
            <span class="fs-15 label-color" v-html="requiredLabel('Anywhere')"></span>
            <AppAutocomplete v-model="formData.anywhere" :rules="[requiredValidator]" :items="anyWhere"
              item-title="text" item-value="value" placeholder="YES" />
          </v-col>
          <VCol cols="12" sm="6" md="6">
            <span class="fs-15 label-color" v-html="requiredLabel('Country')"></span>
            <AppAutocomplete v-model="formData.country_id" :rules="[requiredValidator]" :items="countries"
              item-title="name" item-value="id" placeholder="Select Country"></AppAutocomplete>
          </VCol>
          <VCol cols="12" sm="6" md="6">
            <span class="fs-15 lable-color" v-html="requiredLabel('City Name')"></span>
            <AppTextField name="city" v-model="formData.city_name" placeholder="City Name" :rules="[requiredValidator]"
              autocomplete="off">
            </AppTextField>
          </VCol>
          <VCol cols="12" sm="6" md="6">
            <span class="fs-15 label-color" v-html="requiredLabel('Payer')"></span>
            <AppAutocomplete v-model="formData.payer_id" :rules="[requiredValidator]" :items="payers" :item-title="(item) => {
              const n = item?.name ?? '';
              const m = item?.method ?? '';
              return n && m ? `${n} - ${m}` : n || m;
            }" item-value="id" />
          </VCol>
          <VCol cols="12" sm="6" md="6">
            <span class="fs-15 lable-color" v-html="requiredLabel('Destination Name')"></span>
            <AppTextField name="destination_name" v-model="formData.destination_name" placeholder="Destination Name"
              :rules="[requiredValidator]">
            </AppTextField>
          </VCol>
          <VCol cols="12" sm="6" md="6">
            <span class="fs-15 label-color" v-html="requiredLabel('Status')"></span>
            <AppAutocomplete :items="statuses" v-model="formData.status" item-title="text" item-value="value"
              placeholder="Status" :rules="[requiredValidator]" />
          </VCol>
          <VCol cols="12">
            <span class="fs-15 label-color" v-html="requiredLabel('Address')"></span>
            <AppTextarea placeholder="Type here" v-model="formData.address" :rules="[requiredValidator]" rows="3">
            </AppTextarea>
          </VCol>

          <VCol cols="12 d-flex gap-2 align-end justify-end">
            <VBtn type="reset" variant="tonal" color="">Reset</VBtn>
            <VBtn type="submit" variant="elevated" color="white" class="login-btn" :loading="loading">
              Create Destination
            </VBtn>
          </VCol>
        </v-row>
      </VForm>
    </v-card-text>
  </v-card>
</template>
