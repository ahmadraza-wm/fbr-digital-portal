<script setup>
definePageMeta({
  middleware: "auth",
  permission: "customer.live.transaction.export"
})
import { onMounted } from "vue";
import { useCustomerLiveTransaction } from "@/composables/exports/useCustomerLiveTransaction";
const { exportCustomerLiveTransaction } = useCustomerLiveTransaction();

const currencies = ref([])
const { $axios } = useNuxtApp();

const formKey = ref(null);
const set_date_format = (input_date) => {
  const now = new Date(input_date);
  const day = String(now.getDate()).padStart(2, '0');
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const year = now.getFullYear();
  return `${day}-${month}-${year}`;
};
const currentDate = new Date();
const previousDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, currentDate.getDate() + 1);
const form = reactive({
  start_date: set_date_format(previousDate),
  end_date: set_date_format(currentDate),
  status: '',
  sending_currency: ('all'),
  receiving_currency: ('all'),
});
const cleanFilter = computed(() => {
  return Object.fromEntries(
    Object.entries({
      ...form,
      sending_currency: form.sending_currency === "all" ? null : form.sending_currency,
      receiving_currency: form.receiving_currency === "all" ? null : form.receiving_currency
    }).filter(([_, v]) => v !== null && v !== "")
  )
})
const statusItems = ref([
  { title: "All", value: "" },
  { title: "Incomplete", value: "incomplete" },
  { title: "Awaiting Funds", value: "awaiting_funds" },
  { title: "Verifying Transfer", value: "verifying_transfer" },
  { title: "Compliance Review", value: "compliance_review" },
  { title: "Compliance Held", value: "compliance_held" },
  { title: "Operation Hold", value: "operation_hold" },
  { title: "Processing Transfer", value: "processing_transfer" },
  { title: "Available for Collection", value: "available_for_collection" },
  { title: "Send to Partner", value: "send_to_partner" },
  { title: "Paid", value: "paid" },
  { title: "Canceled", value: "canceled" },
  { title: "Canceling", value: "canceling" },
  { title: "Refunded", value: "refunded" },
]);
const fetchCurrencies = async () => {
  const res = await $axios.get("/get/currencies/list", {

    params: { pagination: false },
  });

  currencies.value = res.data.data
};
onMounted(() => {
  fetchCurrencies(); 
})
</script>
<template>
  <v-card>
    <v-row>
      <v-col cols="12">
        <v-card-title class="border-b-sm">
          <h4 class="text-h5 py-3">Customer Transaction Live Export</h4>
        </v-card-title>
      </v-col>
    </v-row>

    <v-card-text class="pt-1 my-4 pb-3">
      <VForm @submit.prevent="" :key="formKey">
        <v-row class="ps-0">
          <v-col cols="12" sm="6" md="3">
            <span class="fs-15 label-color font-weight-medium">From<span class="text-red">*</span></span>
            <AppDateTimePicker name="from" v-model="form.start_date" placeholder="dd-mm-yyyy" :config="{ dateFormat: 'd-m-Y' }"
              :rules="[requiredValidator]" />
          </v-col>
          <v-col cols="12" sm="6" md="3">
            <span class="fs-15 label-color font-weight-medium">To<span class="text-red">*</span></span>
            <AppDateTimePicker name="to" v-model="form.end_date" placeholder="dd-mm-yyyy" :config="{ dateFormat: 'd-m-Y' }"
              :rules="[requiredValidator]" />
          </v-col>
          <v-col cols="12" sm="6" md="3">
            <span class="fs-15 label-color font-weight-medium">Sending Currency</span>
            <AppAutocomplete :items="currencies" item-title="code" item-id="id" v-model="form.sending_currency"
              placeholder="Select sending currency" />
          </v-col>
          <v-col cols="12" sm="6" md="3">
            <span class="fs-15 label-color font-weight-medium">Receiving Currency</span>
            <AppAutocomplete :items="currencies" item-title="code" item-id="id" v-model="form.receiving_currency"
              placeholder="Select receiving currency" />
          </v-col>
          <v-col cols="12" sm="6" md="3">
            <span class="fs-15 label-color font-weight-medium">Transaction Status</span>
            <AppAutocomplete :items="statusItems" v-model="form.status" placeholder="Select status" />
          </v-col>

          <v-col cols="12 d-flex gap-2 pt-sm-8 justify-start" sm="6" md="3">
            <VBtn type="submit" class="login-btn" variant="tonal" @click="exportCustomerLiveTransaction(cleanFilter)">
              Export
            </VBtn>
          </v-col>
        </v-row>
      </VForm>
    </v-card-text>
  </v-card>
</template>
