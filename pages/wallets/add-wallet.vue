<script setup>
import BackNavigation from "@/@core/components/BackNavigation.vue";
import useUiFeedback from "@/composables/useUiFeedback";
import { useWallet } from "@/composables/useWallet";
import { watch } from "vue";
definePageMeta({
  middleware: "auth",
  permission: "wallets.store"
})
const {
  loading,
  showLoading,
  hideLoading,
  showSuccess,
  showError,
  confirmAction,
} = useUiFeedback();

const { walletList, fetchWallets, options, headers, deleteWallet, submitForm } =
  useWallet();
const countryCurrencyStore = useCountryCurrencyStore();
const { countries, currencies } = storeToRefs(countryCurrencyStore);

import { ref } from "vue";
const { $axios } = useNuxtApp();

const formRef = ref(null);

const walletData = ref({
  name: "",
  country_id: null,
});

const handleSubmit = async () => {
  const { valid } = await formRef.value.validate();

  if (valid) {
    await submitForm(walletData.value);
    resetForm();
  }
};

const resetForm = () => {
  walletData.value = {
    name: "",
    country_id: null,
  };
  formRef.value.reset();
};

const countryWallets = ref([]);

watch(
  () => walletData.value.country_id,
  async (newCountryId) => {
    if (newCountryId) {
      await fetchCountryWallets(newCountryId);
    } else {
      countryWallets.value = [];
    }
  }
);

const fetchCountryWallets = async (countryId) => {
  try {
    const response = await $axios.get("/wallets?pagination=false", {
      params: {
        country_id: countryId,
      },
    });
    countryWallets.value = response.data.data.data;
  } catch (error) {
    console.error("Error fetching wallets:", error);
    showError("Failed to load wallets for selected country.");
  }
};
</script>
<template>
  <v-card>
    <v-row>
      <v-col cols="12">
        <v-card-title class="border-b-sm d-flex align-center bg-grey">
          <BackNavigation />
          <h4 class="text-h4 py-3">Add Wallets</h4>
        </v-card-title>
      </v-col>
    </v-row>

    <v-card-text class="pt-1 my-4 pb-3">
      <VForm @submit.prevent="handleSubmit" ref="formRef">
        <v-row class="ps-0">
          <v-col cols="12" sm="6" md="6">
            <span class="fs-15 label-color font-weight-medium" v-html="requiredLabel('Wallet Name')"></span>
            <AppTextField v-model="walletData.name" name="walletName" placeholder="Name" :rules="[requiredValidator]" autocomplete="off"/>
          </v-col>
          <v-col cols="12" sm="6" md="6">
            <span class="fs-15 label-color font-weight-medium" v-html="requiredLabel('Country')"></span>

            <AppAutocomplete v-model="walletData.country_id" name="country" placeholder="Country" :items="countries"
              item-title="name" item-value="id" :rules="[requiredValidator]" autocomplete="off" />
          </v-col>

          <VCol cols="12" md="12" class="d-flex gap-2 align-end justify-end">
            <VBtn type="reset" color="secondary" class="" variant="tonal">
              Reset
            </VBtn>
            <VBtn type="submit" :loading="loading" class="login-btn" variant="tonal">
              Create Wallet
            </VBtn>
          </VCol>
        </v-row>
      </VForm>
    </v-card-text>
    <v-card-text class="pb-10 px-0">
      <v-row>
        <v-col cols="12">
          <v-card-title class="border-b-sm border-t-sm">
            <h4 class="text-h4 py-3">Country Wallets</h4>
          </v-card-title>
        </v-col>
      </v-row>
      <v-table class="text-no-wrap">
        <thead>
          <tr>
            <th>#</th>
            <th>Code</th>
            <th>Wallet Name</th>
            <th>Added BY</th>
            <th>Created At</th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="(item, index) in countryWallets" :key="item.id">
            <td>{{ index + 1 }}</td>
            <!-- Serial number -->
            <td>{{ item.id }}</td>
            <td>{{ item.name }}</td>
            <td>{{ item.created_by }}</td>
            <td>{{ item.created_at }}</td>
          </tr>
        </tbody>
      </v-table>
    </v-card-text>
  </v-card>
</template>
