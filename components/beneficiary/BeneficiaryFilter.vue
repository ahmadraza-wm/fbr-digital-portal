<script setup>
import { ref } from "vue";

const countryCurrencyStore = useCountryCurrencyStore();
const { sending_countries, receiving_countries, countries } =
  storeToRefs(countryCurrencyStore);

const emit = defineEmits(["filter", "reset"]);

const customerID = ref("");
const customerName = ref("");
const customerEmail = ref("");
const customerPhone = ref("");
const selectedCountry = ref(null);
const beneficiaryID = ref(null);
const beneficiaryName = ref("");
const beneficiaryPhone = ref("");
const selectedChannel = ref(null);
const showAdvancedSearch = ref(false);

const channelOptions = [
  { title: "Online", value: "online" },
  { title: "Agent", value: "agent" },
];

function onSubmit() {
  emit("filter", {
    customer_id: customerID.value,
    customer_name: customerName.value,
    customer_email: customerEmail.value,
    customer_phone: customerPhone.value,
    channel: selectedChannel.value,
    customer_country: selectedCountry.value,
    beneficiary_id: beneficiaryID.value,
    beneficiary_name: beneficiaryName.value,
    beneficiary_phone: beneficiaryPhone.value,
  });
}

function onReset() {
  customerID.value = "";
  customerName.value = "";
  customerEmail.value = "";
  customerPhone.value = "";
  beneficiaryID.value = "";
  beneficiaryName.value = "";
  beneficiaryPhone.value = "";
  selectedCountry.value = null;
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
        <AppTextField name="customerId" type="number" v-model="customerID" placeholder="Customer ID" autocomplete="off" />
      </v-col>
      <v-col cols="12" sm="6" md="3">
        <span class="fs-15 label-color font-weight-medium">Customer Name</span>
        <AppTextField name="customerName" v-model="customerName" placeholder="Customer Name" />
      </v-col>
      <v-col cols="12" sm="6" md="3">
        <span class="fs-15 label-color font-weight-medium">Customer Email</span>
        <AppTextField name="customerEmail" type="email" v-model="customerEmail" placeholder="Customer email" autocomplete="off" />
      </v-col>
      <v-col cols="12" sm="6" md="3">
        <span class="fs-15 label-color font-weight-medium">Customer Phone</span>
        <AppTextField name="customerPhone" type="number" v-model="customerPhone" placeholder="Customer phone" />
      </v-col>
      <v-col cols="12" sm="6" md="3">
        <span class="fs-15 label-color font-weight-medium">Customer Country</span>
        <AppAutocomplete :items="countries" item-title="name" item-value="id" v-model="selectedCountry"
          placeholder="Select country"/>
      </v-col>
      <v-col cols="12" sm="6" md="3">
        <span class="fs-15 label-color font-weight-medium">Beneficiary ID</span>
        <AppTextField name="beneficiaryID" type="number" v-model="beneficiaryID" placeholder="******" autocomplete="off" />
      </v-col>
      <v-col cols="12" sm="6" md="3">
        <span class="fs-15 label-color font-weight-medium">Beneficiary Name</span>
        <AppTextField name="beneficiaryName" v-model="beneficiaryName" placeholder="Beneficiary name" autocomplete="off" />
      </v-col>
      <template v-if="showAdvancedSearch">
        <v-col cols="12" sm="6" md="3">
          <span class="fs-15 label-color font-weight-medium">Beneficiary Phone</span>
          <AppTextField name="beneficiaryPhone" type="number" v-model="beneficiaryPhone"
            placeholder="Beneficiary phone" />
        </v-col>
        <v-col cols="12" sm="6" md="3">
          <span class="fs-15 label-color font-weight-medium">Channel</span>
          <AppAutocomplete :items="channelOptions" v-model="selectedChannel" placeholder="Choose channel" autocomplete="off" />
        </v-col>
      </template>
      <v-col cols="12 d-flex gap-2 align-end justify-start" sm="6" md="4" xl="3">
        <VBtn type="button" variant="elevated" :color="!showAdvancedSearch? 'primary' : 'error'" @click="showAdvancedSearch = !showAdvancedSearch">
          {{ showAdvancedSearch ? "Hide Advance Search" : "Advance Search" }}
        </VBtn>
        <VBtn type="submit" class="login-btn" variant="tonal">Search</VBtn>
        <VBtn type="reset" color="secondary" variant="tonal"> Reset </VBtn>
      </v-col>
    </v-row>
  </VForm>
</template>
