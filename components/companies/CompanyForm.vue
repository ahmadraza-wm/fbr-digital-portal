<script setup>
import { onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useCompanies } from "@/composables/useCompanies";
const props = defineProps({ isEdit: Boolean });
const formRef = ref('')
const formData = ref({
  company_name: "",
  company_code: "",
  email: "",
  first_name: "",
  last_name: "",
  password: "",
  status: "",
});
const route = useRoute();
const { statuses, saveCompany, CompanyDetail, fetchCompanyById } = useCompanies();
const showPassword = ref(false);

const togglePassword = () => {
  showPassword.value = !showPassword.value;
};

const setForm = () => {
  formData.value = {
    company_name: CompanyDetail?.value.company_name,
    company_code: CompanyDetail?.value.company_code,
    email: CompanyDetail?.value.user?.email,
    first_name: CompanyDetail?.value.user?.first_name,
    last_name: CompanyDetail?.value.user?.last_name,
    password: "",
    status: CompanyDetail?.value.user?.status,
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
      company_name: "",
      company_code: "",
      email: "",
      first_name: "",
      last_name: "",
      password: "",
      status: "",
    }
  }
}

onMounted(async() => {
  if (props.isEdit) {
    await fetchCompanyById(route.params.id)
    setForm();
  }
});

const submitForm = async () => {
  const { valid } = await formRef.value.validate();

  if (!valid) {
    return;
  }
  saveCompany(props.isEdit, formData.value, route.params.id);
};
</script>

<template>
  <VForm ref="formRef" @submit.prevent="submitForm">
    <VRow>
      <VCol cols="12" md="6">
        <span class="fs-13 label-color">Company Name<span class="text-red">*</span></span>
        <AppTextField v-model="formData.company_name" placeholder="Company Name" :rules="[requiredValidator]"/>
      </VCol>
      <VCol cols="12" md="6">
        <span class="fs-13 label-color">Company Code<span class="text-red">*</span></span>
        <AppTextField v-model="formData.company_code" placeholder="Company Code" :rules="[requiredValidator]"/>
      </VCol>
      <VCol cols="12" md="6">
        <span class="fs-13 label-color">First Name<span class="text-red">*</span></span>
        <AppTextField v-model="formData.first_name" :rules="[requiredValidator]" placeholder="First Name" />
      </VCol>
      <VCol cols="12" md="6">
        <span class="fs-13 label-color">Last Name<span class="text-red">*</span></span>
        <AppTextField v-model="formData.last_name" :rules="[requiredValidator]" placeholder="Last Name" />
      </VCol>
      <VCol cols="12" md="6">
        <span class="fs-13 label-color">Email<span class="text-red">*</span></span>
        <AppTextField v-model="formData.email" :rules="[requiredValidator, emailValidator]" placeholder="Email"
          name="email_fake" autocomplete="off" />
      </VCol>
      <VCol cols="12" md="6">
        <span class="fs-13 label-color">Password<span v-if="!props.isEdit || formData.password" class="text-red">*</span></span>
        <AppTextField v-model="formData.password" :type="showPassword ? 'text' : 'password'" placeholder="••••••••"
          name="new-password" autocomplete="new-password" :rules="!props.isEdit || formData.password ?[requiredValidator, passwordValidator]:[]"
          :append-inner-icon="showPassword ? 'tabler-eye-off' : 'tabler-eye'" @click:append-inner="togglePassword"
          append-inner-icon-color="primary" />
      </VCol>

      <VCol cols="12" md="6" v-if="isEdit">
        <span class="fs-13 label-color">Status<span class="text-red">*</span></span>
        <AppAutocomplete v-model="formData.status" :items="statuses" item-title="text" item-value="value"
          placeholder="Select Status" :rules="[requiredValidator]" />
      </VCol>

      <VCol cols="12" class="d-flex gap-4 justify-end">
        <VBtn color="secondary" variant="elevated" @click="resetForm"> Reset </VBtn>
        <VBtn type="submit" variant="tonal" class="login-btn" :loading="loading">
          {{ isEdit ? "Update Company" : "Create Company" }}
        </VBtn>
      </VCol>
    </VRow>
  </VForm>
</template>
