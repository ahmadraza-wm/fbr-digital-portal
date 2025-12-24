<script setup>
import { useCustomerLoginLogs } from '@/composables/exports/useCustomerLoginLogs';
const { exportCustomerLoginLogs } = useCustomerLoginLogs();
definePageMeta({
  middleware: "auth",
  permission: "customer.login.logs.export"
})

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
  customer_id: '',
  email: '',

});
</script>
<template>
  <v-card>
    <v-row>
      <v-col cols="12">
        <v-card-title class="border-b-sm">
          <h4 class="text-h5 py-3">Customer Login Logs Export</h4>
        </v-card-title>
      </v-col>
    </v-row>

    <v-card-text class="pt-1 my-4 pb-3">
      <VForm @submit.prevent="" :key="formKey">
        <v-row class="ps-0">
          <v-col cols="12" sm="6" md="3">
            <span class="fs-15 label-color font-weight-medium">From</span>
            <AppDateTimePicker name="from" v-model="form.from_date" placeholder="dd-mm-yyyy" :config="{ dateFormat: 'd-m-Y' }" />
          </v-col>
          <v-col cols="12" sm="6" md="3">
            <span class="fs-15 label-color font-weight-medium">To</span>
            <AppDateTimePicker name="to" v-model="form.to_date" placeholder="dd-mm-yyyy" :config="{ dateFormat: 'd-m-Y' }" />
          </v-col>
          <v-col cols="12" sm="6" md="3">
            <span class="fs-15 label-color font-weight-medium">Customer Id</span>
            <AppTextField name="id" type="number" v-model="form.customer_id" placeholder="Customer id" autocomplete="off"/>
          </v-col>
          <v-col cols="12" sm="6" md="3">
            <span class="fs-15 label-color font-weight-medium">Customer Email</span>
            <AppTextField name="email" type="email" v-model="form.email" placeholder="Email" autocomplete="off" />
          </v-col>
          <v-col cols="12 d-flex gap-2 justify-start" sm="6" md="3">
            <VBtn type="submit" class="login-btn" variant="tonal" @click="exportCustomerLoginLogs(form)">
              Export
            </VBtn>
          </v-col>
        </v-row>
      </VForm>
    </v-card-text>
  </v-card>
</template>
