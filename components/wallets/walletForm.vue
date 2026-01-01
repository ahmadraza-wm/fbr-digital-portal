<script setup>
import { onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useWallets } from "@/composables/useWallets";
import { useCountries } from "@/composables/useCountries";
const { fetchCountries, CountriesList } = useCountries();
const props = defineProps({ isEdit: Boolean });
const formRef = ref('')
const formData = ref({
  name: "",
  country_id: null,
  wallet_code: "",
  is_active: null,
});
const route = useRoute();
const { statuses, saveWallet,fetchWalletDetailsById , loading,walletDetail } = useWallets();

const setForm = () => {
  formData.value = {
    name: walletDetail?.value?.name,
    country_id: walletDetail?.value?.country.id,
    wallet_code: walletDetail?.value?.wallet_code,
    is_active: walletDetail?.value?.is_active,
  };
}


const resetForm = () => {
  if (formRef.value) {
    formRef.value.resetValidation();
  }
  if (props.isEdit) {
    setForm();
  }
  else {
    formData.value = {
      name: "",
      country_id: null,
      wallet_code: "",
      is_active: null,
    }
  }
}

onMounted(async () => {
  if (props.isEdit) {
    await fetchWalletDetailsById(route.params.id)
    setForm();
  }
  fetchCountries();
});

const submitForm = async () => {
  const { valid } = await formRef.value.validate();

  if (!valid) {
    return;
  }
  saveWallet(props.isEdit, formData.value, route.params.id);
};
</script>

<template>
  <VForm ref="formRef" @submit.prevent="submitForm">
    <VRow>
      <VCol cols="12" md="6">
        <span class="fs-13 label-color">Wallet Name<span class="text-red">*</span></span>
        <AppTextField v-model="formData.name" placeholder="Wallet Name" :rules="[requiredValidator]" />
      </VCol>
      <VCol cols="12" md="6">
        <span class="fs-13 label-color">Wallet Code<span class="text-red">*</span></span>
        <AppTextField v-model="formData.wallet_code" placeholder="Wallet Code" :rules="[requiredValidator]" />
      </VCol>
      <VCol cols="12" md="6">
        <span class="fs-13 label-color">Country<span class="text-red">*</span></span>
        <AppAutocomplete v-model="formData.country_id" :items="CountriesList" item-title="name" item-value="id"
          placeholder="Select Country" :rules="[requiredValidator]" />
      </VCol>
      <VCol cols="12" md="6" v-if="isEdit">
        <span class="fs-13 label-color">Status<span class="text-red">*</span></span>
        <AppAutocomplete v-model="formData.is_active" :items="statuses" item-title="text" item-value="value"
          placeholder="Select Status" :rules="[requiredValidator]" />
      </VCol>
      <VCol cols="12" class="d-flex gap-4 justify-end">
        <VBtn color="secondary" variant="elevated" @click="resetForm"> Reset </VBtn>
        <VBtn type="submit" variant="tonal" class="login-btn" :loading="loading">
          {{ isEdit ? "Update Wallet" : "Create Wallet" }}
        </VBtn>
      </VCol>
    </VRow>
  </VForm>
</template>
