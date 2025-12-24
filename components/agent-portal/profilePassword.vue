<script setup>
import { ref, watch } from 'vue';
import { useNuxtApp } from "#app";
import useUiFeedback from "@/composables/useUiFeedback";
const { $axios } = useNuxtApp();
const {
  loading,
  showLoading,
  hideLoading,
  showSuccess,
  showError,
  confirmAction,
} = useUiFeedback();


const UpdatePassword = async (formdata) => {
  showLoading("Updating your password...");
  try {
    const response = await $axios.post("/change/password", formdata);

    if (response.data.message == 'Password updated successfully') {
      showSuccess(response.data.message);

      // Reset form fields
      formdata.password = "";
      formdata.password_confirmation = "";

      // Reset validation state
      formRef.value.resetValidation();
    }
    else {
      showError(response.data.message);
    }
  } catch (error) {
    console.error("AgentDeposit:", error);
    const messages = error.response?.data?.errors
      ? Object.values(error.response.data.errors).flat()
      : error.response?.data?.message || "Something went wrong";
    showError(messages);
  } finally {
    hideLoading();
  }
};

const formRef = ref('');
const formdata = ref({
  password: '',
  password_confirmation: ''
});

const updateForm = async (e) => {
  e.preventDefault();
  const { valid } = await formRef.value.validate();

  if (!valid) {
    return;
  }
  UpdatePassword(formdata.value);
};
</script>
<template>
  <v-card>
    <v-card-text class="px-4 pt-4">
      <VForm @submit="updateForm" ref="formRef">
        <VRow>
          <!-- <v-col cols="12" md="6">
            <span class="fs-15 label-color font-weight-medium">Current Password<span class="text-red">*</span></span>
            <AppTextField name="password_fake" type="password" v-model="formdata.currend_password" placeholder="************"
              :rules="[requiredValidator]"
              autocomplete="new-password" />
          </v-col> -->
          <v-col cols="12" md="6">
            <span class="fs-15 label-color font-weight-medium">New Password<span class="text-red">*</span></span>
            <AppTextField name="password_fake" type="password" v-model="formdata.password" placeholder="************"
              :rules="[requiredValidator, passwordValidator]" autocomplete="new-password" />
          </v-col>
          <v-col cols="12" md="6">
            <span class="fs-15 label-color font-weight-medium">Confirm New Password<span
                class="text-red">*</span></span>
            <AppTextField name="password_fake" type="password" v-model="formdata.password_confirmation"
              placeholder="************"
              :rules="[requiredValidator, passwordValidator, confirmedValidator(formdata.password_confirmation, formdata.password)]"
              autocomplete="off" />
          </v-col>
          <v-col cols="12" class="d-flex justify-end gap-4">
            <VBtn type="reset" color="secondary" variant="tonal"> Reset </VBtn>
            <VBtn type="submit" variant="tonal" class="login-btn">
              Change Password
            </VBtn>
          </v-col>
        </VRow>
      </VForm>
    </v-card-text>
  </v-card>
</template>
