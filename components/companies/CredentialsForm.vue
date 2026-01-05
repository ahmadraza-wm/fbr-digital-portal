<script setup>
import { onMounted, ref, nextTick } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useCompanies } from "@/composables/useCompanies";
import { useBanks } from "@/composables/useBanks";
import { usePartnerMappings } from "@/composables/UsePartnerMappings";
const { fetchPartnerConstants, partnerConstant } = useBanks();
const { fetchCompanies, CompaniesList } = useCompanies();
const { statuses, saveCompanyCredentials, fetchCompanyCredentialDetailsById, CredentialsDetails, loading } = usePartnerMappings();
const props = defineProps({ isEdit: Boolean });
const formRef = ref(null);
const formData = ref({
  company_id: null,
  integration_method: "",
  personal_credentials: false,
  baseUrl: "",
  apiKey: "",
  secretKey: "",
  authIp: "",
  status: true,
});
const route = useRoute();
const showPersonalCredentials = computed(() => formData.value.personal_credentials)
const showAuthIp = computed(() => formData.value.integration_method === 'nairagram')
const companyIdComputed = computed({
  get: () => formData.value.company_id,
  set: val => (formData.value.company_id = val),
})

const setForm = () => {
  formData.value = {
    integration_method: CredentialsDetails?.value?.integration_method,
    personal_credentials: CredentialsDetails?.value?.personal_credentials,
    baseUrl: CredentialsDetails?.value?.baseUrl,
    apiKey: CredentialsDetails?.value?.apiKey,
    secretKey: CredentialsDetails?.value?.secretKey,
    authIp: CredentialsDetails?.value?.authIp,
    status: true,
  };
}


const resetForm = async () => {
  await nextTick()

  formRef.value?.resetValidation()

  if (props.isEdit) {
    setForm();
    companyIdComputed.value = route.params.id
  } else {
    formData.value = {
      company_id: null,
      integration_method: "",
      personal_credentials: false,
      baseUrl: "",
      apiKey: "",
      secretKey: "",
      authIp: "",
      status: true,
    }
  }
}

const buildPayload = () => {
  const payload = { ...formData.value }

  if (!payload.personal_credentials) {
    delete payload.baseUrl
    delete payload.apiKey
    delete payload.secretKey
  }

  if (payload.integration_method !== 'nairagram') {
    delete payload.authIp
  }

  if (props.isEdit) {
    delete payload.company_id
  }
  return payload
}


onMounted(async () => {
  if (props.isEdit) {
    await fetchCompanyCredentialDetailsById(route.params.id, route.params.partnerName);
    setForm();
    companyIdComputed.value = route.params.id
  }
  else {
    fetchCompanies();
  }
  fetchPartnerConstants();
});

const submitForm = async () => {
  const { valid } = await formRef.value.validate();

  if (!valid) {
    return;
  }
  const payload = buildPayload()

  const response = await saveCompanyCredentials(props.isEdit, payload, companyIdComputed.value, route.params.partnerId);
  if (response) {
    resetForm();
  }
};
</script>

<template>
  <VForm ref="formRef" @submit.prevent="submitForm">
    <VRow>
      <VCol cols="12" md="6" v-if="!isEdit">
        <span class="fs-13 label-color">Company<span class="text-red">*</span></span>
        <AppAutocomplete v-model="formData.company_id" :items="CompaniesList" item-title="company_name" item-value="id"
          placeholder="Select Company" :rules="!isEdit ? [requiredValidator] : []" />
      </VCol>
      <VCol cols="12" md="6">
        <span class="fs-13 label-color">Partner<span class="text-red">*</span></span>
        <AppAutocomplete v-model="formData.integration_method" :items="partnerConstant?.integration_methods"
          placeholder="Select Partner" :rules="[requiredValidator]" />
      </VCol>
      <VCol cols="12" md="6">
        <span class="fs-13 label-color">Status<span class="text-red">*</span></span>
        <AppAutocomplete v-model="formData.status" :items="statuses" item-title="text" item-value="value"
          placeholder="Select Status" :rules="[requiredValidator]" />
      </VCol>
      <VCol cols="12" md="6" v-if="showAuthIp">
        <span class="fs-13 label-color">Auth Ip<span class="text-red">*</span></span>
        <AppTextField v-model="formData.authIp" :rules="showAuthIp ? [requiredValidator] : []" placeholder="Auth Ip" />
      </VCol>
      <VCol cols="12">
        <VSwitch v-model="formData.personal_credentials" label="Use Personal Credentials" :true-value="true"
          :false-value="false" />
      </VCol>
      <VCol cols="12" md="6" v-if="showPersonalCredentials">
        <span class="fs-13 label-color">Base Url<span class="text-red">*</span></span>
        <AppTextField v-model="formData.baseUrl" :rules="showPersonalCredentials ? [requiredValidator] : []"
          placeholder="Base Url" />
      </VCol>
      <VCol cols="12" md="6" v-if="showPersonalCredentials">
        <span class="fs-13 label-color">Api Key<span class="text-red">*</span></span>
        <AppTextField v-model="formData.apiKey" :rules="showPersonalCredentials ? [requiredValidator] : []"
          placeholder="Api Key" />
      </VCol>
      <VCol cols="12" md="6" v-if="showPersonalCredentials">
        <span class="fs-13 label-color">Api Secret<span class="text-red">*</span></span>
        <AppTextField v-model="formData.secretKey" :rules="showPersonalCredentials ? [requiredValidator] : []"
          placeholder="Api Secret" name="email_fake" autocomplete="off" />
      </VCol>
      <VCol cols="12" class="d-flex gap-4 justify-end">
        <VBtn color="secondary" variant="elevated" @click="resetForm"> Reset </VBtn>
        <VBtn type="submit" variant="tonal" class="login-btn" :loading="loading">
          {{ isEdit ? "Update" : "Create" }} Credentials
        </VBtn>
      </VCol>
    </VRow>
  </VForm>
</template>
