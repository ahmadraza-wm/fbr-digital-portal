<script setup>
import { useRefrelCode } from "@/composables/useRefrelCode";
import { useCountryCurrencyStore } from "@/stores/useCountryCurrencyStore";
import { storeToRefs } from "pinia";
import { computed, ref } from "vue";
import { useRoute } from "vue-router";
definePageMeta({
  middleware: "auth",
  permission: "referral.store"
})
const route = useRoute();
const countryCurrencyStore = useCountryCurrencyStore();
const { sending_countries, receiving_countries, countries } =
  storeToRefs(countryCurrencyStore);

const {
  headers,
  transferItem,
  agents,
  deleteBank,
  fetchAgents,
  createFreeFeeTransfer,
  bankList,
  fetchBanks,
} = useRefrelCode();

const requiredValidator = (v) =>
  v !== null && v !== undefined && v !== "" ? true : "This field is required";

// Form Refs
const formKey = ref(0);
const agent_name = ref(null);
const country = ref(null);
const phone = ref(null);
const email = ref(null);
const transferStatus = ref(null);
const no_transaction = ref(null);
const no_days = ref(null);
const ref_code = ref(null);
const formRef = ref(null);

const showField = computed(() => transferStatus.value === 1);

const selectedDialCode = computed(() => {
  const selected = countries.value.find((c) => c.id === country.value);
  return selected ? selected.dial_code : "";
});

const selectedCountry = computed(() =>
  countries.value.find((c) => c.id === country.value)
);

watch(agent_name, (newAgentId) => {
  const selectedAgent = agents.value.find(agent => agent.id === newAgentId);
  if (selectedAgent && selectedAgent.country_id) {
    country.value = selectedAgent.country_id;
  } else {
    country.value = null;
  }
});


const fullPhone = computed(
  () => `+${selectedCountry.value?.dial_code || ""}${phone.value}`
);

// Submit Handler
const onSubmit = async () => {

const { valid } = await formRef.value.validate();
  if (!valid) {
    return;
  }


  const formData = new FormData();

  formData.append("agent_id", agent_name.value);
  formData.append("country_id", country.value);
  formData.append("phone", fullPhone.value);
  formData.append("email", email.value);
  formData.append("fee_free_transfers", transferStatus.value);
  formData.append("referral_code", ref_code.value);

  if (showField.value) {
    formData.append("number_of_transactions", no_transaction.value);
    formData.append("number_of_days", no_days.value);
  }

  const itemId = route.params?.id ?? null;
  await createFreeFeeTransfer(formData, false, itemId);
  resetForm();
};

// Reset Handler
const resetForm = () => {
  agent_name.value = null;
  country.value = null;
  phone.value = null;
  email.value = null;
  transferStatus.value = null;
  no_transaction.value = null;
  no_days.value = null;
  ref_code.value = null;

  formKey.value += 1;
};
</script>

<template>
  <v-card>
    <v-row>
      <v-col cols="12">
        <v-card-title class="border-b-sm" style="background-color: lightgrey;">
          <div class="d-flex align-center">
            <BackNavigation />
            <h4 class="text-h5 py-3">Add Referral Codes</h4>
          </div>
        </v-card-title>
      </v-col>
    </v-row>
    <v-card-text class="px-4 pt-4">
      <VForm @submit.prevent="onSubmit" ref="formRef">
        <VRow>
          <v-col cols="12" md="6">
            <span class="fs-15 label-color font-weight-medium">Agent Name<span class="text-red">*</span></span>
            <AppAutocomplete :items="agents" item-title="name" item-value="id" v-model="agent_name" :rules="[requiredValidator]" 
              placeholder="Select agent" />
          </v-col>
          <v-col cols="12" md="6">
            <span class="fs-15 label-color font-weight-medium">
              Country<span class="text-red">*</span>
            </span>
            <AppAutocomplete :items="countries" item-title="name" item-value="id" v-model="country"
              placeholder="Select country" :rules="[requiredValidator]" />
          </v-col>

          <v-col cols="12" md="6">
            <span class="fs-15 label-color font-weight-medium">
              Phone<span class="text-red">*</span>
            </span>
            <VTextField name="tel" type="tel" v-model="phone" placeholder="Phone number" :rules="[requiredValidator]">
              <template #prepend-inner>
                <v-chip class="ma-0" color="grey lighten-3" text-color="black"
                  style=" justify-content: center;min-inline-size: 60px;">
                  {{ selectedDialCode ? '+' : '' }} {{ selectedDialCode }}
                </v-chip>
              </template>
            </VTextField>
          </v-col>

          <v-col cols="12" md="6">
            <span class="fs-15 label-color font-weight-medium">Email<span class="text-red">*</span></span>
            <AppTextField name="email" type="email" v-model="email" placeholder="Email" :rules="[requiredValidator]" />
          </v-col>
          <v-col cols="12" md="6">
            <span class="fs-15 label-color font-weight-medium">Fee Free Transfers<span class="text-red">*</span></span>
            <AppAutocomplete :items="transferItem" v-model="transferStatus" placeholder="Select transfers status"
              :rules="[requiredValidator]" />
          </v-col>
          <v-col cols="12" md="6" v-if="showField">
            <span class="fs-15 label-color font-weight-medium">Number Of Transactions<span
                class="text-red">*</span></span>
            <AppTextField name="transactions" type="text" v-model="no_transaction" placeholder="Number of transactions"
              :rules="[requiredValidator]" :disabled="!showField" />
          </v-col>
          <v-col cols="12" md="6" v-if="showField">
            <span class="fs-15 label-color font-weight-medium">Number Of Days<span class="text-red">*</span></span>
            <AppTextField name="transactions" type="text" v-model="no_days" placeholder="Number of days"
              :rules="[requiredValidator]" :disabled="!showField" />
          </v-col>
          <v-col cols="12" md="6">
            <span class="fs-15 label-color font-weight-medium">Referral Code<span class="text-red">*</span></span>
            <AppTextField name="code" type="text" v-model="ref_code" placeholder="Referral code"
              :rules="[requiredValidator]" />
          </v-col>
          <v-col cols="12" class="d-flex justify-end gap-4">
            <VBtn type="reset" color="secondary" variant="tonal" @click="resetForm">
              Reset
            </VBtn>
            <VBtn type="submit" variant="tonal" class="login-btn">
              Create Agent Referral Code
            </VBtn>
          </v-col>
        </VRow>
      </VForm>
    </v-card-text>
  </v-card>
</template>
