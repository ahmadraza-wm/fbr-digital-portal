<script setup>
import { useBanks } from "@/composables/useBanks";
import { useCountries } from "@/composables/useCountries";
import { onMounted, ref } from "vue";
import { useRoute } from "vue-router";
const { fetchCountries, CountriesList } = useCountries();
const props = defineProps({ isEdit: Boolean });
const formRef = ref('')
const formData = ref({
  name: "",
  country_id: null,
  bank_code: "",
  status: null,
});
const route = useRoute();
const { statuses, saveBank, bankDetail, loading, fetchBankDetailsById } = useBanks();

const setForm = () => {
  formData.value = {
    name: bankDetail?.value?.name,
    country_id: bankDetail?.value?.country.id,
    bank_code: bankDetail?.value?.bank_code,
    status: bankDetail?.value?.status,
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
      bank_code: "",
      status: null,
    }
  }
}

onMounted(async () => {
  if (props.isEdit) {
    await fetchBankDetailsById(route.params.id)
    setForm();
  }
  fetchCountries();
});

const submitForm = async () => {
  const { valid } = await formRef.value.validate();

  if (!valid) {
    return;
  }
  saveBank(props.isEdit, formData.value, route.params.id);
};
</script>

<template>
  <VForm ref="formRef" @submit.prevent="submitForm">
    <VRow>
      <VCol cols="12" md="6">
        <span class="fs-13 label-color">Bank Name<span class="text-red">*</span></span>
        <AppTextField v-model="formData.name" placeholder="Bank Name" :rules="[requiredValidator]" />
      </VCol>
      <VCol cols="12" md="6">
        <span class="fs-13 label-color">Bank Code<span class="text-red">*</span></span>
        <AppTextField v-model="formData.bank_code" placeholder="Bank Code" :rules="[requiredValidator]" />
      </VCol>
      <VCol cols="12" md="6">
        <span class="fs-13 label-color">Country<span class="text-red">*</span></span>
        <AppAutocomplete v-model="formData.country_id" :items="CountriesList" item-title="name" item-value="id"
          placeholder="Select Country" :rules="[requiredValidator]" />
      </VCol>
      <VCol cols="12" md="6" v-if="isEdit">
        <span class="fs-13 label-color">Status<span class="text-red">*</span></span>
        <AppAutocomplete v-model="formData.status" :items="statuses" item-title="text" item-value="value"
          placeholder="Select Status" :rules="[requiredValidator]" />
      </VCol>
      <VCol cols="12" class="d-flex gap-4 justify-end">
        <VBtn color="secondary" variant="elevated" @click="resetForm"> Reset </VBtn>
        <VBtn type="submit" variant="tonal" class="login-btn" :loading="loading">
          {{ isEdit ? "Update Bank" : "Create Bank" }}
        </VBtn>
      </VCol>
    </VRow>
  </VForm>
</template>
