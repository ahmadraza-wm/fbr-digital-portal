<script setup>
definePageMeta({
  middleware: "auth",
  permission: "customer.external.sar.export"
})
import { useCustomerSarExport } from '@/composables/exports/useCustomerSarExport';
const {
  exportCustomerSar
} = useCustomerSarExport();

const categoryList = ref([
  { title: 'Please Select', value: '' },
  { title: 'Initial Due Deligence', value: 'initial_due_diligence' },
  { title: 'Enhance Due Deligence', value: 'enhance_due_diligence' },
  { title: 'Commitments', value: 'commitments' },
  { title: 'Consent Given By', value: 'consent_given_by' },
  { title: 'Deposit', value: 'deposit' },
  { title: 'Multiple transactions/ Beneficiaries', value: 'multiple_transactions_beneficiaries' },
  { title: 'SAR (Suspicious Activity Report)', value: 'sar_(suspicious_activity_report' },
  { title: 'Cancellations', value: 'cancellations' },
  { title: 'Others', value: 'others' },
])
const currentDate = new Date();
const previousDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, currentDate.getDate() + 1);
const formKey = ref(null);
const set_date_format = (input_date) => {
  const now = new Date(input_date);
  const day = String(now.getDate()).padStart(2, '0');
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const year = now.getFullYear();
  return `${day}-${month}-${year}`;
};
const form = reactive({
  from_date: set_date_format(previousDate),
  to_date: set_date_format(currentDate),
 category: ''

});
</script>
<template>
  <v-card>
    <v-row>
      <v-col cols="12">
        <v-card-title class="border-b-sm">
          <h4 class="text-h5 py-3">Customer External SAR Export</h4>
        </v-card-title>
      </v-col>
    </v-row>

    <v-card-text class="pt-1 my-4 pb-3">
      <VForm @submit.prevent="">
        <v-row class="ps-0">
          <v-col cols="12" sm="6" md="3">
            <span class="fs-15 label-color font-weight-medium">From<span class="text-red">*</span></span>
            <AppDateTimePicker name="from" v-model="form.from_date" placeholder="dd-mm-yyyy" :config="{ dateFormat: 'd-m-Y' }"
              :rules="[requiredValidator]" />
          </v-col>
          <v-col cols="12" sm="6" md="3">
            <span class="fs-15 label-color font-weight-medium">To<span class="text-red">*</span></span>
            <AppDateTimePicker name="to" v-model="form.to_date" placeholder="dd-mm-yyyy" :config="{ dateFormat: 'd-m-Y' }"
              :rules="[requiredValidator]" />
          </v-col>
          <v-col cols="12" sm="6" md="3">
            <span class="fs-15 label-color font-weight-medium">Category<span class="text-red">*</span></span>
            <AppAutocomplete :items="categoryList" v-model="form.category" placeholder="Select category"
              :rules="[requiredValidator]" />
          </v-col>
          <v-col cols="12 d-flex gap-2 pt-sm-8 justify-start" sm="6" md="3">
            <VBtn type="submit" class="login-btn" variant="tonal" @click="exportCustomerSar(form)">
              Export
            </VBtn>
          </v-col>
        </v-row>
      </VForm>
    </v-card-text>
  </v-card>
</template>
