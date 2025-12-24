<script setup>
import { ref } from "vue";

const countryCurrencyStore = useCountryCurrencyStore();
const { sending_countries, receiving_countries } = storeToRefs(countryCurrencyStore);

const emit = defineEmits(["filter", "reset"]);

const customerID = ref("");
const customerName = ref("");
const customerEmail = ref("");
const customerPhome = ref("");
const selectedCountry = ref(null);
const selectedStatus = ref(null);
const customerDob = ref("");
const dateRange = ref("");
const promo_code = ref("");
const receivingCountry = ref(null);
const isVerified = ref(null);
const company = ref(null);
const advancedCountry = ref(null);
const selectedChannel = ref(null);
const showAdvancedSearch = ref(false);

const isVerifiedOptions = [
  { title: "Yes", value: 1 },
  { title: "No", value: 0 },
];

const channelOptions = [
  { title: "Online", value: "online" },
  { title: "Agent", value: "agent" },
];

const statuss = [
  { title: "Active", value: 1 },
  { title: "Inactive", value: 0 },
];

function onSubmit() {
  emit("filter", {
    customer_id: customerID.value,
    customer_name: customerName.value,
    customer_email: customerEmail.value,
    customer_phone: customerPhome.value,
    channel: selectedChannel.value,
    country_id: selectedCountry.value,
    customer_status: selectedStatus.value,
    customer_dob: customerDob.value,
    dateRange: dateRange.value,
    promo_code: promo_code.value,
    receiving_country_id: receivingCountry.value,
    is_verified: isVerified.value,
    advancedCountry: advancedCountry.value,
  });
}

function onReset() {
  customerID.value = "";
  customerName.value = "";
  customerEmail.value = "";
  customerPhome.value = "";
  selectedCountry.value = null;
  selectedStatus.value = null;
  customerDob.value = "";
  dateRange.value = "";
  promo_code.value = "";
  receivingCountry.value = null;
  isVerified.value = null;
  company.value = null;
  advancedCountry.value = null;
  showAdvancedSearch.value = false;
  selectedChannel.value = null;

  emit("reset");
}

</script>

<template>
  <VForm @submit.prevent="onSubmit" @reset.prevent="onReset">
    <v-row class="ps-0">
      <v-col cols="12" sm="6" md="3">
        <span class="fs-15 label-color font-weight-medium">Customer ID</span>
        <AppTextField name="customerId" type="number" v-model="customerID" placeholder="Customer ID" autocomplete="off"/>
      </v-col>

      <v-col cols="12" sm="6" md="3">
        <span class="fs-15 label-color font-weight-medium">Customer Name</span>
        <AppTextField name="customerName" v-model="customerName" placeholder="Customer Name" autocomplete="off" />
      </v-col>
      <v-col cols="12" sm="6" md="3">
        <span class="fs-15 label-color font-weight-medium">Customer Email</span>
        <AppTextField name="customerEmail" v-model="customerEmail" placeholder="Customer Email" autocomplete="off" />
      </v-col>
      <v-col cols="12" sm="6" md="3">
        <span class="fs-15 label-color font-weight-medium">Customer Phone</span>
        <AppTextField name="customerPhome" v-model="customerPhome" placeholder="Customer Phone" autocomplete="off" />
      </v-col>

      <v-col cols="12" sm="6" md="3">
        <span class="fs-15 label-color font-weight-medium">Country</span>
        <AppAutocomplete v-model="selectedCountry" :items="sending_countries" item-title="name" item-value="id"
          placeholder="Algeria" autocomplete="off" />
      </v-col>

      <v-col cols="12" sm="6" md="3">
        <span class="fs-15 label-color font-weight-medium">Status</span>
        <AppAutocomplete v-model="selectedStatus" :items="statuss" item-title="title" item-value="value"
          placeholder="Active" autocomplete="off" />
      </v-col>

      <template v-if="showAdvancedSearch">
        <v-col cols="12" sm="6" md="3">
          <span class="fs-15 label-color font-weight-medium">Customer DOB</span>
          <AppDateTimePicker name="dob" v-model="customerDob" placeholder="Customer DOB" autocomplete="off" />
        </v-col>
        <v-col cols="12" sm="6" md="3">
          <span class="fs-15 label-color font-weight-medium">Receiving Country</span>
          <AppAutocomplete v-model="receivingCountry" :items="receiving_countries" item-title="name" item-value="id"
            placeholder="PK" autocomplete="off" />
        </v-col>

        <v-col cols="12" sm="6" md="3">
          <span class="fs-15 label-color font-weight-medium">Channel</span>
          <AppAutocomplete v-model="selectedChannel" :items="channelOptions" item-title="title" item-value="value"
            placeholder="Online" />
        </v-col>

        <v-col cols="12" sm="6" md="3">
          <span class="fs-15 label-color font-weight-medium">Is Verified?</span>
          <AppAutocomplete v-model="isVerified" :items="isVerifiedOptions" placeholder="Yes" />
        </v-col>
        <v-col cols="12" sm="6" md="3">
          <span class="fs-15 label-color font-weight-medium">Date Range</span>
          <AppDateTimePicker v-model="dateRange" placeholder="Select date" :config="{ mode: 'range' }" />
        </v-col>
        <v-col cols="12" sm="6" md="3">
          <span class="fs-15 label-color font-weight-medium">Promotional Code</span>
          <AppTextField name="code" v-model="promo_code" placeholder="code..." />
        </v-col>
      </template>

      <v-col cols="12 d-flex gap-2 align-end justify-start" sm="10" md="4">
        <VBtn type="button" variant="elevated" :color="!showAdvancedSearch? 'primary' : 'error'" @click="showAdvancedSearch = !showAdvancedSearch">
          {{ showAdvancedSearch ? "Hide Advance Search" : "Advance Search" }}
        </VBtn>
        <VBtn type="submit" variant="tonal" class="login-btn">Search</VBtn>
        <VBtn type="reset" color="secondary" variant="tonal">Reset</VBtn>
      </v-col>
    </v-row>
  </VForm>
</template>
