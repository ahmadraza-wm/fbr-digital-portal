<script setup>
import { useUsers } from "@/composables/useUsers";
import { ref, watch } from 'vue';
// const requiredValidator = (v) => !!v || "This field is required";
const requiredValidator = (v) =>
  v !== null && v !== undefined && v !== "" ? true : "This field is required";
const statusItem = ref([
  { title: "Active", value: 1 },
  { title: "Inactive", value: 0 },
]);


const props = defineProps({
  userId: {
    type: String,
    required: true,
  },
  singleuser: {
    type: Object,
    required: true,
  }
});


const {
  formdata,
  updateUser,
  resetForm,
  formRef
} = useUsers()



watch(
  () => props.singleuser,
  (userWrapper) => {
    const user = userWrapper?.user;
    if (user) {
      formdata.value.first_name = user.name || '';
      formdata.value.email = user.email || '';
      formdata.value.status = user.status ?? 1;
      formdata.value.password = '';
      formdata.value.password_confirmation = '';
    }
  },
  { immediate: true }
);

const updateForm = async (e) => {
  e.preventDefault();
  const { valid } = await formRef.value.validate();

  if (!valid) {
    return;
  }
  await updateUser(props.userId);
};
</script>
<template>
  <v-card>
    <v-row>
      <v-col cols="12">
        <v-card-title class="border-b-sm" style="background-color: lightgrey;">
          <h4 class="text-h5 py-3">Edit User</h4>
        </v-card-title>
      </v-col>
    </v-row>
    <v-card-text class="px-4 pt-4">
      <VForm @submit="updateForm" ref="formRef">
        <VRow>
          <v-col cols="12" md="6">
            <span class="fs-15 label-color font-weight-medium">Name<span class="text-red">*</span></span>
            <AppTextField name="name" v-model="formdata.first_name" placeholder="Name" :rules="[requiredValidator]"
              autocomplete="off" />
          </v-col>
          <v-col cols="12" md="6">
            <span class="fs-15 label-color font-weight-medium">Email<span class="text-red">*</span></span>
            <AppTextField name="email" type="email" v-model="formdata.email" placeholder="Email"
              :rules="[requiredValidator, emailValidator]" autocomplete="off" />
          </v-col>
          <v-col cols="12" md="6">
            <span class="fs-15 label-color font-weight-medium">Password<span class="text-red">*</span></span>
            <AppTextField name="password_fake" type="password" v-model="formdata.password" placeholder="************"
              :rules="formdata.password ? [requiredValidator, passwordValidator] : []" autocomplete="new-password" />
          </v-col>
          <v-col cols="12" md="6">
            <span class="fs-15 label-color font-weight-medium">Confirm Password<span class="text-red">*</span></span>
            <AppTextField name="password_fake" type="password" v-model="formdata.password_confirmation"
              placeholder="************"
              :rules="formdata.password ? [requiredValidator, passwordValidator, confirmedValidator(formdata.password_confirmation, formdata.password)] : []"
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
              Update User
            </VBtn>
          </v-col>
        </VRow>
      </VForm>
    </v-card-text>
  </v-card>
</template>
