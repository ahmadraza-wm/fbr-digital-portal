<script setup>

import { computed, ref } from 'vue';
const permissionStore = usePermissionStore();
const emit = defineEmits(["filter", "reset"]);

const showAdvancedSearch = ref(false);
const countryCurrencyStore = useCountryCurrencyStore();
const { sending_countries, receiving_countries } = storeToRefs(countryCurrencyStore);

const filters = ref({
  transaction_code: null,
  start_date: '',
  end_date: '',
  customer_first_name: '',
  beneficiary_phone: '',
  beneficiary_first_name: '',
  customer_phone: '',
  receiving_country_id: null,
  status: []
});

const onSubmit = () => {
  emit("filter", filters.value);
};

const onReset = () => {
  filters.value.start_date = '';
  filters.value.end_date = '';
  emit('reset');
}

const allPaymentStatuses = [
  { title: "Incomplete", value: "incomplete", permission: "agent.transactions.incomplete" },
  { title: "Awaiting Funds", value: "awaiting_funds", permission: "agent.transactions.awaiting_funds" },
  { title: "Verifying Transfer", value: "verifying_transfer", permission: "agent.transactions.verifying_transfer" },
  { title: "Compliance Review", value: "compliance_review", permission: "agent.transactions.compliance_review" },
  { title: "Compliance Held", value: "compliance_held", permission: "agent.transactions.compliance_held" },
  { title: "Operation Hold", value: "operation_hold", permission: "agent.transactions.operation_hold" },
  { title: "Processing Transfer", value: "processing_transfer", permission: "agent.transactions.processing_transfer" },
  { title: "Available for Collection", value: "available_for_collection", permission: "agent.transactions.available_for_collection" },
  { title: "Send to Partner", value: "send_to_partner", permission: "agent.transactions.send_to_partner" },
  { title: "Paid", value: "paid", permission: "agent.transactions.paid" },
  { title: "Canceled", value: "canceled", permission: "agent.transactions.canceled" },
  { title: "Canceling", value: "canceling", permission: "agent.transactions.canceling" },
  { title: "Refunded", value: "refunded", permission: "agent.transactions.refunded" },
];

const payment_status = computed(() => {
  return allPaymentStatuses.filter(status =>
    permissionStore.hasPermission(status.permission)
  );
});

</script>
<template>
  <v-card-text class="pt-1 mb-4 pb-3 border-b-sm">
    <VForm @submit.prevent="onSubmit" @reset.prevent="onReset">
      <v-row class="ps-0">
        <v-col cols="12" sm="6" md="3">
          <span class="fs-14 label-color font-weight-regular">Transfer Code</span>
          <AppTextField name="code" placeholder="Transfer Code" v-model="filters.transaction_code" autocomplete="off" />
        </v-col>
        <v-col cols="12" sm="6" md="3">
          <span class="fs-15 label-color font-weight-medium">Date From</span>
          <AppDateTimePicker name="from" v-model="filters.start_date" placeholder="dd/mm/yyyy"
            :config="{ dateFormat: 'Y/m/d' }" />
        </v-col>
        <v-col cols="12" sm="6" md="3">
          <span class="fs-15 label-color font-weight-medium">Date To</span>
          <AppDateTimePicker name="to" v-model="filters.end_date" placeholder="dd/mm/yyyy"
            :config="{ dateFormat: 'Y/m/d' }" />
        </v-col>
        <v-col>
          <span class="fs-14 label-color font-weight-regular">Sender Name</span>
          <AppTextField name="lastName" placeholder="Sender Name" v-model="filters.customer_first_name"
            autocomplete="off" />
        </v-col>
      </v-row>
      <v-row class="mt-0">
        <template v-if="showAdvancedSearch">
          <v-col cols="12" sm="6" md="3">
            <span class="fs-14 label-color font-weight-regular">Sender Phone #</span>
            <AppTextField name="customerPhone" placeholder="Sender Phone" v-model="filters.customer_phone" />
          </v-col>

          <v-col cols="12" sm="6" md="3">
            <span class="fs-14 label-color font-weight-regular">Beneficiary Name
            </span>
            <AppTextField name="beneFname" placeholder="Bene Name" v-model="filters.beneficiary_first_name" />
          </v-col>
          <v-col cols="12" sm="6" md="3">
            <span class="fs-14 label-color font-weight-regular">Beneficiary Phone #
            </span>
            <AppTextField name="benePhone" type="text" placeholder="Bene Phone No"
              v-model="filters.beneficiary_phone" />
          </v-col>
          <v-col cols="12" sm="6" md="3">
            <span class="fs-14 label-color font-weight-regular">Receiving Country</span>
            <AppAutocomplete :items="receiving_countries" item-title="name" item-value="id" placeholder="Country"
              v-model="filters.receiving_country_id" />
          </v-col>
          <v-col cols="12" sm="6" md="3">
            <span class="fs-14 label-color font-weight-regular">Payment Status</span>
            <AppAutocomplete :items="payment_status" chip multiple name="paymentStatus" item-title="title"
              item-value="value" v-model="filters.status" placeholder="Select Status" />
          </v-col>
        </template>
        <v-col cols="12 d-flex gap-2 pb-5 pt-md-8 align-end justify-start" sm="10" md="4">
          <VBtn type="button" variant="elevated" :color="!showAdvancedSearch ? 'primary' : 'error'"
            @click="showAdvancedSearch = !showAdvancedSearch">
            {{
              showAdvancedSearch ? "Hide Advance Search" : "Advance Search"
            }}
          </VBtn>
          <VBtn type="submit" class="login-btn" variant="tonal" @click="applyFilters">
            search
          </VBtn>
          <VBtn type='reset' color="secondary" variant="tonal" @click="resetfilter">
            Reset
          </VBtn>
        </v-col>
      </v-row>
    </VForm>
  </v-card-text>
</template>
