<script setup>
import { useUsers } from "@/composables/useUsers";
import { ref } from "vue";

const statusItem = ref([
  { title: "Active", value: 1 },
  { title: "Inactive", value: 0 },
]);
definePageMeta({
  middleware: "auth",
  permission: "register.backoffice.user"
})

const {
  formdata,
  resetForm,
  registerUser,
  formRef
} = useUsers()

const submitForm = async () => {
  const { valid } = await formRef.value.validate();

  if (!valid) {
    return;
  }
  registerUser(formdata.value)
};

</script>
<template>
  <v-card>
    <v-row>
      <v-col cols="12">
        <v-card-title class="border-b-sm" style="background-color: lightgrey;">
          <div class="d-flex align-center">
            <BackNavigation />
            <h4 class="text-h5 py-3">Add User</h4>
          </div>
        </v-card-title>
      </v-col>
    </v-row>
    <v-card-text class="px-4 pt-4">
      <VForm @submit.prevent="submitForm" ref="formRef">
        <VRow>
          <v-col cols="12" md="6">
            <span class="fs-15 label-color font-weight-medium">Name<span class="text-red">*</span></span>
            <AppTextField name="name" v-model="formdata.first_name" placeholder="Name" :rules="[requiredValidator]"
              autocomplete="off" />
          </v-col>
          <v-col cols="12" md="6">
            <span class="fs-15 label-color font-weight-medium">Email<span class="text-red">*</span></span>
            <AppTextField type="email" v-model="formdata.email" placeholder="Email" autocomplete="off" name="email_fake"
              :rules="[requiredValidator, emailValidator]" />
          </v-col>
          <v-col cols="12" md="6">
            <span class="fs-15 label-color font-weight-medium">Password<span class="text-red">*</span></span>
            <AppTextField name="password_fake" type="password" v-model="formdata.password" placeholder="************"
              :rules="[requiredValidator , passwordValidator]" autocomplete="off" />
          </v-col>
          <v-col cols="12" md="6">
            <span class="fs-15 label-color font-weight-medium">Confirm Password<span class="text-red">*</span></span>
            <AppTextField name="password" type="password" v-model="formdata.password_confirmation"
              placeholder="************"
              :rules="[requiredValidator , passwordValidator, confirmedValidator(formdata.password_confirmation, formdata.password)]"
              autocomplete="off" />
          </v-col>
          <v-col cols="12" md="6">
            <span class="fs-15 label-color font-weight-medium">Status<span class="text-red">*</span></span>
            <AppAutocomplete :items="statusItem" v-model="formdata.status" placeholder="Select status"
              :rules="[requiredValidator]" />
          </v-col>
          <v-col cols="12" class="d-flex justify-end gap-4">
            <VBtn color="secondary" variant="tonal" @click="resetForm"> Reset </VBtn>
            <VBtn type="submit" variant="tonal" class="login-btn">
              Add User
            </VBtn>
          </v-col>
        </VRow>
      </VForm>
    </v-card-text>
  </v-card>
</template>
