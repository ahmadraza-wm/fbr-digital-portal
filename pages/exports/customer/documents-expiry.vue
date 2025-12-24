<script setup>
definePageMeta({
  middleware: "auth",
  permission: "customer.documents.near.expiry.export"
})
import { useCustomerExpiryDocument } from '@/composables/exports/useCustomerExpiryDocument';
const { exportCustomerExpiryDocs } = useCustomerExpiryDocument();
const set_date_format = (input_date) => {
  const now = new Date(input_date);
  const day = String(now.getDate()).padStart(2, '0');
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const year = now.getFullYear();
  return `${day}-${month}-${year}`;
};
const formKey = ref(null);
const currentDate = new Date();
const previousDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, currentDate.getDate() + 1);
const form = reactive({
  from_date: set_date_format(previousDate),
  to_date: set_date_format(currentDate),
  expiry_from: '',
  expiry_to: '',

  
})
</script>
<template>
  <v-card>
    <v-row>
      <v-col cols="12">
        <v-card-title class="border-b-sm">
          <h4 class="text-h5 py-3">Documents Near Expiry Export</h4>
        </v-card-title>
      </v-col>
    </v-row>

    <v-card-text class="pt-1 my-4 pb-3">
      <VForm @submit.prevent="" :key="formKey">
        <v-row class="ps-0">
          <v-col cols="12" sm="6" md="3">
            <span class="fs-15 label-color font-weight-medium">Created From<span class="text-red">*</span></span>
            <AppDateTimePicker name="from" v-model="form.from_date" placeholder="dd-mm-yyyy" :config="{ dateFormat: 'd-m-Y' }"
              :rules="[requiredValidator]" />
          </v-col>
          <v-col cols="12" sm="6" md="3">
            <span class="fs-15 label-color font-weight-medium">Created To<span class="text-red">*</span></span>
            <AppDateTimePicker name="to" v-model="form.to_date" placeholder="dd-mm-yyyy" :config="{ dateFormat: 'd-m-Y' }"
              :rules="[requiredValidator]" />
          </v-col>
          <v-col cols="12" sm="6" md="3">
            <span class="fs-15 label-color font-weight-medium">Expiry From<span class="text-red">*</span></span>
            <AppDateTimePicker name="from" v-model="form.expiry_from" placeholder="dd-mm-yyyy"
              :config="{ dateFormat: 'd-m-Y' }" :rules="[requiredValidator]"/>
          </v-col>
          <v-col cols="12" sm="6" md="3">
            <span class="fs-15 label-color font-weight-medium">Expiry To<span class="text-red">*</span></span>
            <AppDateTimePicker name="to" v-model="form.expiry_to" placeholder="dd-mm-yyyy" :config="{ dateFormat: 'd-m-Y' }" :rules="[requiredValidator]" />
          </v-col>
          <v-col cols="12 d-flex gap-2 justify-start">
            <VBtn type="submit" class="login-btn" variant="tonal" @click="exportCustomerExpiryDocs(form)">
              Export
            </VBtn>
          </v-col>
        </v-row>
      </VForm>
    </v-card-text>
  </v-card>
</template>
