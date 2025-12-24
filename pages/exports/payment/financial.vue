<script setup>
import { usepaymentFinancialExport } from '@/composables/exports/usePaymentFinancialExport';
const { exportPaymentFinancial } = usepaymentFinancialExport();
const set_date_format = (input_date) => {
  const now = new Date(input_date);
  const day = String(now.getDate()).padStart(2, '0');
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const year = now.getFullYear();
  return `${day}-${month}-${year}`;
};
definePageMeta({
  middleware: "auth",
  permission: "payment.financial.export"
})
const formKey = ref(null);
const currentDate = new Date();
const previousDate = new Date(currentDate.getFullYear(), currentDate.getMonth() -1 , currentDate.getDate() + 1);
const form = reactive({ 
  invoice_id: '',
  from_date: set_date_format(previousDate),
  to_date: set_date_format(currentDate),

})
</script>
<template>
  <v-card>
    <v-row>
      <v-col cols="12">
        <v-card-title class="border-b-sm">
          <h4 class="text-h5 py-3">Payments Financial Export</h4>
        </v-card-title>
      </v-col>
    </v-row>

    <v-card-text class="pt-1 my-4 pb-3">
      <VForm @submit.prevent="" :key="formKey">
        <v-row>
          <v-col cols="12" sm="6" md="3">
            <span class="fs-15 label-color font-weight-medium">Invoice Id #</span>
            <AppTextField name="id" type="text" v-model="form.invoice_id" placeholder="**********" autocomplete="off" />
          </v-col>
          <v-col cols="12" sm="6" md="3">
            <span class="fs-15 label-color font-weight-medium">From<span class="text-red">*</span></span>
            <AppDateTimePicker name="from" v-model="form.from_date" placeholder="dd-mm-yyyy" :config="{ dateFormat: 'd-m-Y' }" />
          </v-col>
          <v-col cols="12" sm="6" md="3">
            <span class="fs-15 label-color font-weight-medium">To<span class="text-red">*</span></span>
            <AppDateTimePicker name="to" v-model="form.to_date" placeholder="dd-mm-yyyy" :config="{ dateFormat: 'd-m-Y' }" />
          </v-col>
          <v-col cols="12 d-flex gap-2 pt-md-8 justify-start" sm="6" md="3">
            <VBtn type="submit" class="login-btn" variant="tonal" @click="exportPaymentFinancial(form)">
              Export
            </VBtn>
          </v-col>
        </v-row>
      </VForm>
    </v-card-text>
  </v-card>
</template>
