<script setup>
const showAdvancedSearch = ref(false);
const dateRange = ref("");
const funds = ref(false);
const countryCurrencyStore = useCountryCurrencyStore();
const { sending_countries, receiving_countries } =
  storeToRefs(countryCurrencyStore);
import { usePartners } from "@/composables/usePartners";
const { fetchPartners, partners } = usePartners();
const emit = defineEmits(["filter-updated", "filter-reset"]);

const props = defineProps({
  showPartner: { type: Boolean, default: false },
});

const filters = ref({
  transaction_code: "",
  sending_country_id: null,
  customer_phone: "",
  from_date: "",
  to_date: "",
  channel: null,
  receiving_country_id: null,
  sending_method: null,
  receiving_method: null,
  partner_id: null,
});
const resetfilter = () => {
  filters.value = {
    transaction_code: "",
    sending_country_id: "",
    customer_phone: "",
    from_date: "",
    to_date: "",
    channel: "",
    receiving_country_id: "",
    sending_method: "",
    receiving_method: "",
    partner_id: null,
  };
  emit("filter-reset");
};
const sending_methods_tags = [
  { title: "All", value: "all" },
  { title: "Bank Transfer", value: "Bank_transfer" },
  { title: "Pay By Card(Debit / Credit)", value: "pay-by-card-debitcredit" },
  { title: "Cash", value: "cash" },
  { title: "Digital Wallet", value: "digital_wallet" },
];

const receiving_methods_tags = [
  { title: "All", value: "all" },
  { title: "Bank", value: "bank" },
  { title: "Cash", value: "cash" },
  { title: "Mobile Wallet", value: "mobile_wallet" },
];
const complaint_payments = [
  { title: "All", value: "all" },
  { title: "Yes", value: "Yes" },
  { title: "No", value: "No" },
];
const channel = [
  { title: "All", value: "all" },
  { title: "Agent", value: "agent" },
  { title: "Online", value: "online" },
];

const applyFilters = () => {
  const activeFilters = {};

  for (const key in filters.value) {
    const value = filters.value[key];
    if (Array.isArray(value)) {
      if (value.length > 0) {
        activeFilters[key] = value;
      }
    } else if (value !== "" && value !== null && value !== "all") {
      activeFilters[key] = value;
    }
  }
  emit("filter-updated", activeFilters);
};
onMounted(() => {
  if (props.showPartner) {
    fetchPartners({ pagination: 0 });
  }
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
          <span class="fs-14 label-color font-weight-regular">Customer Phone #</span>
          <AppTextField name="phoneNumber" placeholder="Phone #" v-model="filters.customer_phone" autocomplete="off" />
        </v-col>
        <v-col cols="12" sm="6" md="3">
          <span class="fs-14 label-color font-weight-regular">From Date</span>
          <AppDateTimePicker name="fromDate" :config="{ dateFormat: 'd-m-Y' }" placeholder="mm/dd/yyyy"
            v-model="filters.from_date" />
        </v-col>
        <v-col cols="12" sm="6" md="3">
          <span class="fs-14 label-color font-weight-regular">To Date</span>
          <AppDateTimePicker name="toDate" :config="{ dateFormat: 'd-m-Y' }" placeholder="mm/dd/yyyy"
            v-model="filters.to_date" />
        </v-col>
      </v-row>
      <v-row class="mt-0 py-2">
        <template v-if="showAdvancedSearch">
          <v-col cols="12" sm="6" md="3">
            <span class="fs-14 label-color font-weight-regular">Channel</span>
            <AppAutocomplete :items="channel" name="channel" placeholder="Channel" v-model="filters.channel" />
          </v-col>
          <v-col cols="12" sm="6" md="3">
            <span class="fs-14 label-color font-weight-regular">Sending Country</span>
            <AppAutocomplete :items="sending_countries" item-title="name" item-value="id" placeholder="Algeria"
              v-model="filters.sending_country_id" autocomplete="off" />
          </v-col>
          <v-col cols="12" sm="6" md="3">
            <span class="fs-14 label-color font-weight-regular">Receiving Country</span>
            <AppAutocomplete :items="receiving_countries" item-title="name" item-value="id" placeholder="Active"
              v-model="filters.receiving_country_id" />
          </v-col>
          <v-col cols="12" sm="6" md="3">
            <span class="fs-14 label-color font-weight-regular">Sending Method</span>
            <AppAutocomplete :items="sending_methods_tags" name="sendingMethod" placeholder="Sending Method"
              v-model="filters.sending_method" />
          </v-col>
          <v-col cols="12" sm="6" md="3">
            <span class="fs-14 label-color font-weight-regular">Receiving Method</span>
            <AppAutocomplete :items="receiving_methods_tags" name="receivingMethod" placeholder="Receiving Method"
              v-model="filters.receiving_method" autocomplete="off"/>
          </v-col>
          <v-col cols="12" sm="6" md="3">
            <span class="fs-14 label-color font-weight-regular">Complaint Payments</span>
            <AppAutocomplete :items="complaint_payments" name="complaintPayments" placeholder="Complaint Payments"
              disabled />
          </v-col>
          <v-col cols="12" sm="6" md="3" v-if="showPartner">
            <span class="fs-14 label-color font-weight-regular">Partner</span>
            <AppAutocomplete :items="partners" item-title="name" item-value="id" v-model="filters.partner_id"
              placeholder="Select Partner" />
          </v-col>
        </template>
        <v-col cols="12 d-flex gap-2 justify-start align-end" sm="10" md="4">
          <VBtn type="button" variant="elevated" :color="!showAdvancedSearch ? 'primary' : 'error'" @click="showAdvancedSearch = !showAdvancedSearch">
            {{ showAdvancedSearch ? "Hide Advance Search" : "Advance Search" }}
          </VBtn>
          <VBtn type="submit" class="login-btn" variant="tonal" @click="applyFilters">
            search
          </VBtn>
          <VBtn type="reset" color="seconadry" variant="tonal" @click="resetfilter">
            Reset
          </VBtn>
        </v-col>
      </v-row>
    </VForm>
  </v-card-text>
</template>
