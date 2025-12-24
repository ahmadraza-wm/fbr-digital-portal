<script setup>

import { ref, computed, watch, reactive } from 'vue'
import { useAgents } from "@/composables/useAgents";
import { usePartners } from "@/composables/usePartners";
import { usePayments } from "@/composables/usePayments";
const permissionStore = usePermissionStore();

const showAdvancedSearch = ref(false);
const countryCurrencyStore = useCountryCurrencyStore();
const { sending_countries, receiving_countries } = storeToRefs(countryCurrencyStore);

const funds = ref(false);

const emit = defineEmits(['update:modelValue', 'filter-updated', 'filter-reset'])
const props = defineProps({
  showPartner: { type: Boolean, default: false },
  isView: { type: Boolean, default: false },
  modelValue: { type: Object, default: () => ({}) }


})

const dateRange = ref([]);


const {
  agents,
  fetchAgents,
} = useAgents();

const {
  partners,
  fetchPartners,
} = usePartners();

const {
  fetchTransactions,
} = usePayments();


const filters = ref({
  channel: '',
  main_agent_id: '',
  sub_agent_id: '',
  sending_method: '',
  receiving_method: '',
  transaction_code: '',
  invoice_no: '',
  customer_id: '',
  beneficiary_id: '',
  partner_id: '',
  status: [],
  sending_country_id: '',
  receiving_country_id: '',
  customer_first_name: '',
  customer_last_name: '',
  customer_phone: '',
  customer_email: '',
  beneficiary_first_name: '',
  beneficiary_last_name: '',
  beneficiary_phone: '',
  complaints: '',
  start_date: '',
  end_date: '',
  ...props.modelValue





});


watch(dateRange, (val) => {
  const [start, end] = val?.split?.(' - ') || [];
  filters.value.start_date = start?.trim() || '';
  filters.value.end_date = end?.trim() || '';
});


const channel = [
  { title: 'All', value: 'all' },
  { title: 'Agent', value: 'agent' },
  { title: 'Online', value: 'online' },
]


const complaint = [
  { title: 'All', value: 'all' },
  { title: 'Yes', value: 1 },
  { title: 'No', value: 0 },
]

const autocomplaince = [
  { title: 'All', value: 'all' },
  { title: 'True', value: 1 },
  { title: 'False', value: 0 },
]





const applyFilters = () => {
  const activeFilters = {};

  for (const key in filters.value) {
    const value = filters.value[key];
    if (Array.isArray(value)) {
      if (value.length > 0) {
        activeFilters[key] = value;
      }
    } else if (value !== '' && value !== null && value !== 'all') {
      activeFilters[key] = value;
    }
  }
  emit('filter-updated', activeFilters);
  console.log(activeFilters);
};


const resetfilter = () => {
  filters.value = {
    channel: '',
    main_agent_id: '',
    sub_agent_id: '',
    sending_method: '',
    receiving_method: '',
    transaction_code: '',
    invoice_no: '',
    customer_id: '',
    beneficiary_id: '',
    partner_id: '',
    status: [],
    sending_country_id: '',
    receiving_country_id: '',
    customer_first_name: '',
    customer_last_name: '',
    customer_phone: '',
    customer_email: '',
    beneficiary_first_name: '',
    beneficiary_last_name: '',
    beneficiary_phone: '',
    complaints: '',




  };

  dateRange.value = []
  emit('filter-reset');


}

onMounted(async () => {
  await fetchAgents({force_fetch:true});
  await fetchPartners({force_fetch:true});

});



const getPartners = computed(() => {
  return partners.value
    .map(partner => ({
      title: partner.name,
      value: partner.id
    }));

});



const getMainAgents = computed(() => {
  return agents.value
    .filter(agent => agent.type === 'main_agent')
    .map(agent => ({
      title: agent.name,
      value: agent.id
    }));

});

const getSubAgents = computed(() => {
  return agents.value
    .filter(agent =>
      agent.type === 'sub_agent')
    .map(agent => ({
      title: agent.name,
      value: agent.id
    }));
});


const sending_methods_tags = [
  { title: "All", value: "all" },
  { title: "Bank Transfer", value: "Bank_transfer" },
  { title: "Cash", value: "cash" },
  { title: "Digital Wallet", value: "digital_wallet" },
  { title: "Debit Card", value: "debit_card" },
  { title: "Credit Card", value: "credit_card" },
];

const receiving_methods_tags = [
  { title: "All", value: "all" },
  { title: "Bank", value: "bank" },
  { title: "Cash", value: "cash" },
  { title: "Mobile Wallet", value: "mobile_wallet" },
];

// const payment_status = [
//   { title: "Incomplete", value: "incomplete" },
//   { title: "Awaiting Funds", value: "awaiting_funds" },
//   { title: "Verifying Transfer", value: "verifying_transfer" },
//   { title: "Compliance Review", value: "compliance_review" },
//   { title: "Compliance Held", value: "compliance_held" },
//   { title: "Operation Hold", value: "operation_hold" },
//   { title: "Processing Transfer", value: "processing_transfer" },
//   { title: "Available for Collection", value: "available_for_collection" },
//   { title: "Send to Partner", value: "send_to_partner" },
//   { title: "Paid", value: "paid" },
//   { title: "Canceled", value: "canceled" },
//   { title: "Canceling", value: "canceling" },
//   { title: "Refunded", value: "refunded" },
// ];

const allPaymentStatuses = [
  { title: "Incomplete", value: "incomplete", permission: "transactions.incomplete" },
  { title: "Awaiting Funds", value: "awaiting_funds", permission: "transactions.awaiting_funds" },
  { title: "Verifying Transfer", value: "verifying_transfer", permission: "transactions.verifying_transfer" },
  { title: "Compliance Review", value: "compliance_review", permission: "transactions.compliance_review" },
  { title: "Compliance Held", value: "compliance_held", permission: "transactions.compliance_held" },
  { title: "Operation Hold", value: "operation_hold", permission: "transactions.operation_hold" },
  { title: "Processing Transfer", value: "processing_transfer", permission: "transactions.processing_transfer" },
  { title: "Available for Collection", value: "available_for_collection", permission: "transactions.available_for_collection" },
  { title: "Send to Partner", value: "send_to_partner", permission: "transactions.send_to_partner" },
  { title: "Paid", value: "paid", permission: "transactions.paid" },
  { title: "Canceled", value: "canceled", permission: "transactions.canceled" },
  { title: "Canceling", value: "canceling", permission: "transactions.canceling" },
  { title: "Refunded", value: "refunded", permission: "transactions.refunded" },
];

const payment_status = computed(() => {
  return allPaymentStatuses.filter(status =>
    permissionStore.hasPermission(status.permission)
  );
});

</script>
<template>
  <v-card-text class="pt-1 my-4 pb-3 border-b-sm">
    <VForm @submit.prevent="">
      <v-row class="ps-0">
        <v-col cols="12" sm="6" md="3">
          <span class="fs-14 label-color font-weight-regular">Code</span>
          <AppTextField name="code" placeholder="12345" v-model="filters.transaction_code" autocomplete="off" />
        </v-col>

        <v-col cols="12" sm="6" md="3">
          <span class="fs-14 label-color font-weight-regular">Invoice</span>
          <AppTextField name="invoice" placeholder="Nii Welback" v-model="filters.invoice_no" autocomplete="off" />
        </v-col>
        <v-col cols="12" sm="6" md="3">
          <span class="fs-14 label-color font-weight-regular">Sending Country</span>
          <AppAutocomplete :items="sending_countries" item-title="name" item-value="id" placeholder="Algeria"
            v-model="filters.sending_country_id" />
        </v-col>
        <v-col cols="12" sm="6" md="3">
          <span class="fs-14 label-color font-weight-regular">Channel</span>
          <AppAutocomplete :items="channel" placeholder="channel" v-model="filters.channel" />
        </v-col>

      </v-row>
      <v-row class="mt-0">

        <template v-if="showAdvancedSearch">
          <v-col cols="12" sm="6" md="3">
            <div class="">
              <span class="fs-14 label-color font-weight-regular">Customer Id</span>
              <AppTextField name="customerId" placeholder="Cutomer ID" v-model="filters.customer_id" autocomplete="off" />
            </div>
            <div class="pt-2">
              <span class="fs-14 label-color font-weight-regular">Cust F.Name</span>
              <AppTextField name="customerName" placeholder="Write here" v-model="filters.customer_first_name" autocomplete="off" />
            </div>
            <div class="pt-2">
              <span class="fs-14 label-color font-weight-regular">Cust L.Name</span>
              <AppTextField name="lastName" placeholder="Write here" v-model="filters.customer_last_name" autocomplete="off" />
            </div>

            <div class="pt-2">
              <span class="fs-14 label-color font-weight-regular">Customer Phone #</span>
              <AppTextField name="customerPhone" placeholder="Cutomer Phone" v-model="filters.customer_phone" />
            </div>
            <div class="pt-2">
              <span class="fs-14 label-color font-weight-regular">Customer Email</span>
              <AppTextField name="customerEmail" placeholder="Cutomer Email" v-model="filters.customer_email" autocomplete="off" />
            </div>
          </v-col>

          <v-col cols="12" sm="6" md="3">
            <div>
              <span class="fs-14 label-color font-weight-regular">Bene Id</span>
              <AppTextField type="number" name="boneId" placeholder="1254" v-model="filters.beneficiary_id" />
            </div>
            <div class="pt-2">
              <span class="fs-14 label-color font-weight-regular">Bene F.Name
              </span>
              <AppTextField name="beneFname" placeholder="Write here" v-model="filters.beneficiary_first_name" />
            </div>
            <div class="pt-2">
              <span class="fs-14 label-color font-weight-regular">Bene L.Name</span>
              <AppTextField name="beneLName" placeholder="Write here" v-model="filters.beneficiary_last_name" />
            </div>
            <div class="pt-2">
              <span class="fs-14 label-color font-weight-regular">Bene Phone #
              </span>
              <AppTextField name="benePhone" type="text" placeholder="Bene Phone No"
                v-model="filters.beneficiary_phone" />
            </div>
            <div class="pt-2">
              <span class="fs-14 label-color font-weight-regular">Auto Compliance </span>
              <AppAutocomplete :items="autocomplaince" disabled />
            </div>
          </v-col>


          <v-col cols="12" sm="6" md="3">
            <div class="pt-2">
              <span class="fs-14 label-color font-weight-regular">Receiving Country</span>
              <AppAutocomplete :items="receiving_countries" item-title="name" item-value="id" placeholder="Active"
                v-model="filters.receiving_country_id" />
            </div>

            <div class="pt-2">
              <span class="fs-14 label-color font-weight-regular">Sending Method</span>
              <AppAutocomplete :items="sending_methods_tags" item-title="title" item-value="value" name="sendingMethod"
                placeholder="All" v-model="filters.sending_method" />
            </div>
            <div class="pt-2">
              <span class="fs-14 label-color font-weight-regular">Receiving Method</span>
              <AppAutocomplete :items="receiving_methods_tags" item-title="title" item-value="value"
                name="receivingMethod" placeholder="All" v-model="filters.receiving_method" autocomplete="off" />
            </div>
            <div class="pt-2" v-if="isView">
              <span class="fs-14 label-color font-weight-regular">Payment Status</span>
              <AppAutocomplete :items="payment_status" multiple chip name="paymentStatus" item-title="title"
                item-value="value" v-model="filters.status" placeholder="Select Status" />
            </div>
          </v-col>

          <v-col cols="12" sm="6" md="3">

            <div class="pt-2">
              <span class="fs-14 label-color font-weight-regular">Agents</span>
              <AppAutocomplete :items="getMainAgents" item-title="title" item-value="value" placeholder="All"
                v-model="filters.main_agent_id" />
            </div>
            <div class="pt-2">
              <span class="fs-14 label-color font-weight-regular">Sub Agents</span>
              <AppAutocomplete :items="getSubAgents" item-title="title" item-value="value" placeholder="All"
                v-model="filters.sub_agent_id" :disabled="filters.channel == 'online'" />
              <div class="pt-2">
                <span class="fs-14 label-color font-weight-regular">Complaint</span>
                <AppAutocomplete :items="complaint" placeholder="All" v-model="filters.complaints" />
              </div>
              <div class="pt-2" v-if="showPartner">
                <span class="fs-14 label-color font-weight-regular">Partner</span>
                <AppAutocomplete :items="getPartners" item-title="title" item-value="value"
                  v-model="filters.partner_id" />
              </div>
              <div class="pt-2">
                <span class="fs-14 label-color font-weight-regular">Date Range</span>
                <AppDateRange class="cursor-pointer" placeholder="DD/MM/YYYY" v-model="dateRange" />
              </div>
            </div>
          </v-col>

        </template>
        <v-col cols="12 d-flex gap-2 pb-5 align-end justify-start" sm="10" md="4">
          <VBtn type="button" variant="elevated" :color="!showAdvancedSearch ? 'primary' : 'error' " @click="showAdvancedSearch = !showAdvancedSearch">
            {{
              showAdvancedSearch ? "Hide Advance Search" : "Advance Search"
            }}
          </VBtn>
          <VBtn type="submit"  class="login-btn" variant="tonal" @click="applyFilters">
            search
          </VBtn>
          <VBtn color="secondary" variant="tonal" @click="resetfilter">
            Reset
          </VBtn>
        </v-col>
      </v-row>
    </VForm>
  </v-card-text>
</template>
