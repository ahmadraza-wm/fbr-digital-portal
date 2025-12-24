<script setup>
definePageMeta({
  middleware: "auth",
  permission: "agent.send.money.details"
})
import { ref, onMounted, computed, watch } from 'vue';
const { $axios } = useNuxtApp();
import { useNuxtApp } from "#app";
import senderDetails from '@/components/agent-portal/send-money/sender-details.vue';
import receiverDetails from '@/components/agent-portal/send-money/receiver-details.vue';
import { useAgentProfile } from '@/composables/agentPortal/useProfile';
import { useAgentSendMoney } from '@/composables/agentPortal/useSendMoney';
import useUiFeedback from "@/composables/useUiFeedback";
const { fetchProfileDetail, userDetails } = useAgentProfile();
const countryCurrencyStore = useCountryCurrencyStore();
const { nationalities, countries } = storeToRefs(countryCurrencyStore);
const {
  RecivingCountries,
  getRecivingCountries,
  formData,
  fetchSendMoneyDetails,
  sendMoneyDetails,
  sendingReasons,
  cashDesitinations,
  fetchCashDestinationsLocations,
  storeTransactions,
  transactionSuccess,
  getGateways,
  paymentGateway
} = useAgentSendMoney();
const {
  loading,
  showLoading,
  hideLoading,
  showSuccess,
  showError,
  confirmAction,
} = useUiFeedback();
const formRef = ref('');
const sending_country = ref();
const editrate = ref(false);
const selectedRate = ref(null)
const selectedCustomer = ref(null);
const payerMethods = ref([]);
const filteredPayers = ref([]);
const showCur = ref(false);
const payerLimits = ref({ min: null, max: null });
const capitalize = (str) => str ? str.charAt(0).toUpperCase() + str.slice(1).toLowerCase() : ''
const admin_fee = ref(0.00);
const finaltotalAmount = ref(0.00)
const sendingMethods = ref([])
const resetKey = ref(0);
const isAddReciver = computed(() => {
  return !!(formData.value.payer_id && formData.value.customer_id)
})

watch(
  () => sendMoneyDetails.value,
  (newVal) => {
    if (!newVal) {
      formData.value.receiving_method = ''
      formData.value.sending_method = ''
      payerMethods.value = []
      sendingMethods.value = []
      return
    }

    const payers = newVal.payers || []

    // 🔹 RECEIVING METHODS (cash, bank etc.)
    payerMethods.value = [
      ...new Set(payers.map(p => p.method).filter(Boolean))
    ].map(method => ({
      label: capitalize(method.replace(/_/g, ' ')),
      value: method
    }))

    // 🔹 SENDING METHOD TAGS (Bank Transfer, Card, Wallet)
    const sendingTags = payers.flatMap(
      p => p.sending_method_tags || []
    )

    sendingMethods.value = Array.from(
      new Map(sendingTags.map(tag => [tag.id, tag])).values()
    ).map(tag => ({
      label: tag.name,
      value: tag.id
    }))
  },
  { immediate: true }
)


watch(
  () => [formData.value.receiving_method, formData.value.sending_method],
  ([receivingMethod, sendingMethod]) => {
    filteredPayers.value = []
    formData.value.payer_id = null

    if (!receivingMethod) return

    const payers = sendMoneyDetails.value?.payers || []

    filteredPayers.value = payers.filter(payer => {
      // receiving method match
      const receivingMatch = payer.method === receivingMethod

      // sending method match (tags)
      const sendingMatch = sendingMethod
        ? payer.sending_method_tags?.some(tag =>
          tag.name
            .toLowerCase()
            .replace(/[\s()/]/g, '_') ===
          sendingMethod.toLowerCase().replace(/[\s()/]/g, '_')
        )
        : true

      return receivingMatch && sendingMatch
    })

    // ❌ No payer found
    if (!filteredPayers.value.length) {
      showError('Payer not exists for selected sending / receiving method')
    }
  },
  { immediate: true }
)


const calculateTotalWithFee = (sendingAmount, payerId) => {
  if (!sendingAmount || !payerId) return { totalAmount: null, fee: null }

  const payer = sendMoneyDetails.value.payers.find(p => p.id === payerId)
  if (!payer || !payer.rule) return { totalAmount: parseFloat(sendingAmount), fee: 0 }

  const ruleRanges = payer.rule.rule_ranges || []
  const amount = parseFloat(sendingAmount)

  let fee = 0

  for (const range of ruleRanges) {
    const from = parseFloat(range.from)
    const to = parseFloat(range.to)
    if (amount >= from && amount <= to) {
      if (range.type === 'flat') {
        fee = parseFloat(range.margin)
      } else if (range.type === 'percentage') {
        fee = (amount * parseFloat(range.margin)) / 100
      }
      break
    }
  }

  const totalAmount = +(amount + fee).toFixed(4)
  fee = +fee.toFixed(4)

  return { totalAmount, fee }
}

watch(
  () => formData.value.payer_id,
  (payer_id) => {
    if (!payer_id) {
      formData.value.customer_rate = null;
      formData.value.customer_rate = null;
      formData.value.agent_rate = null;
      formData.value.cash_destination_id = null;
      showCur.value = false;
      payerLimits.value = { min: null, max: null };
      return;
    }
    if (formData.value.receiving_method === 'cash') {
      formData.value.cash_destination_id = null;
      fetchCashDestinationsLocations(formData.value.payer_id);
    }
    formData.value.sending_currency = sendMoneyDetails?.value?.sending_country?.currency ||'';
    formData.value.receiving_currency = sendMoneyDetails?.value?.receiving_country?.currency ||'';
    const rateObj = sendMoneyDetails.value?.rates?.find(r => r.payer_id === payer_id)
    formData.value.customer_rate = rateObj ? rateObj.rate : null
    formData.value.agent_rate = rateObj ? rateObj.rate : null
    formData.value.main_agent_rate = rateObj ? rateObj.main_agent_rate : null
    selectedRate.value = rateObj ? rateObj.rate : null
    showCur.value = true;

    const payerObj = filteredPayers.value.find(p => p.id === payer_id);
    if (payerObj) {
      payerLimits.value = {
        min: parseFloat(payerObj.min_limit),
        max: parseFloat(payerObj.max_limit),
      };
    } else {
      payerLimits.value = { min: null, max: null };
    }

  })


// Handle customer selection from sender-details component
const handleCustomerSelected = (customer) => {
  selectedCustomer.value = customer;
  console.log('Selected Customer in Send Money Page:', customer?.id);
  formData.value.customer_id = customer?.id;
};

const handelReciverSelected = (Reciver) => {
  console.log('Selected Customer in Send Money Page:', Reciver?.id);
  formData.value.beneficiary_id = Reciver?.id;
};

const recivingCountryName = computed(() => {
  const country = RecivingCountries.value.find(
    c => c.id === formData.value.country_id
  )
  return country ? country.name : ''
})


watch(
  () => formData.value.country_id,
  (newVal, oldVal) => {
    if (!newVal) return
    if (newVal === oldVal) return

    fetchSendMoneyDetails(newVal)
  }
)

watch(
  () => formData.value.sending_amount,
  (newVal) => {
    if (!newVal || !formData.value.payer_id) {
      formData.value.receiving_amount = null;
      finaltotalAmount.value = 0;
      admin_fee.value = 0;
      return
    }
    formData.value.receiving_amount =
      +(formData.value.sending_amount * formData.value.customer_rate).toFixed(4)
    const { totalAmount, fee } = calculateTotalWithFee(formData.value.sending_amount, formData.value.payer_id);
    finaltotalAmount.value = totalAmount;
    admin_fee.value = fee;
  }
)

watch(
  () => formData.value.receiving_amount,
  (newVal) => {
    if (!newVal || !formData.value.payer_id) {
      formData.value.sending_amount = null
      return
    }
    formData.value.sending_amount =
      +(formData.value.receiving_amount / formData.value.customer_rate).toFixed(4)
  }
)

watch(
  () => [formData.value.country_id, formData.value.payer_id],
  async ([countryId, payerId], [oldCountryId, oldPayerId]) => {

    if (!countryId || !payerId) return
    if (countryId === oldCountryId && payerId === oldPayerId) return
    if (!userDetails.value?.country_id) return

    const payload = {
      sending_country_id: userDetails.value.country_id,
      receiving_country_id: countryId,
      payer_id: payerId
    }

    await getGateways(payload)

    const gateways = paymentGateway.value?.gateways || paymentGateway.value || []

    if (!gateways.length) {
      formData.value.gateway_country_id = null
      showError('No gateway available for selected country & payer')
      return
    }

    const matchedGateway = gateways.find(
      g => g.sending_method === formData.value.sending_method
    )

    if (!matchedGateway) {
      formData.value.gateway_country_id = null
      showError('No gateway available for selected sending method')
      return
    }

    formData.value.gateway_country_id = matchedGateway.id
  }
)




const submitForm = async () => {
  const { valid } = await formRef.value.validate();
  if (!valid) {
    return;
  }
  if (sendMoneyDetails.value.agent?.pending_all_payments === 1) {
    formData.value.status = 'awaiting_funds'
  }
  else {
    formData.value.status = 'verifying'
  }
  // formData.value.gateway_country_id = 8;
  formData.value.receiving_rate = formData.value.customer_rate;
  await storeTransactions(formData.value);
  if(transactionSuccess.value){
     resetForm();
  }
}

const resetForm = () => {
  // Reset parent state first
  selectedCustomer.value = null;
  showCur.value = false;
  editrate.value = false;
  payerLimits.value = { min: null, max: null };
  
  // Increment resetKey to trigger child component watchers
  resetKey.value++;
  
  // Reset form validation
  if (formRef.value) {
    formRef.value.reset();
    formRef.value.resetValidation();
  }
  
  sending_country.value = userDetails.value.country_id;
};


onMounted(async () => {
  await fetchProfileDetail();
  await getRecivingCountries();
  if (userDetails.value?.country_id) {
    sending_country.value = userDetails.value.country_id
  }
});
</script>
<template>
  <VForm @submit.prevent="submitForm" ref="formRef">
    <v-card>
      <v-row>
        <v-col cols="12">
          <v-card-title class="border-b-sm" style="background-color: lightgrey;">
            <h4 class="text-h5 py-3">Transactions Details</h4>
          </v-card-title>
        </v-col>
      </v-row>
      <v-card-text>
        <VRow>
          <VCol cols="12" md="6">
            <VCol>
              <span class="fs-13 label-color">Sending Country<span class="text-red">*</span></span>
              <!-- <AppTextField placeholder="Sending country" disabled v-model="sending_country" :rules="[requiredValidator]" /> -->
              <AppAutocomplete :items="countries" disabled item-title="name" item-value="id" v-model="sending_country"
                placeholder="Choose customer type" :rules="[requiredValidator]" />
            </VCol>
            <VCol>
              <span class="fs-13 label-color">Destination Country<span class="text-red">*</span></span>
              <AppAutocomplete :items="RecivingCountries" item-title="name" item-value="id"
                v-model="formData.country_id" placeholder="Choose destination country" :rules="[requiredValidator]" />
            </VCol>
            <VCol>
              <span class="fs-13 label-color">Sending Payment Method<span class="text-red">*</span></span>
              <AppAutocomplete :items="sendingMethods" item-title="label" item-value="label"
                v-model="formData.sending_method" placeholder="Choose SendingMethod" :rules="[requiredValidator]" />
            </VCol>
            <VCol>
              <span class="fs-13 label-color">Receiving Payment Method<span class="text-red">*</span></span>
              <AppAutocomplete :items="payerMethods" item-title="label" item-value="value"
                v-model="formData.receiving_method" placeholder="Choose Receiving Method"
                :rules="[requiredValidator]" />
            </VCol>
            <VCol>
              <span class="fs-13 label-color">Payers<span class="text-red">*</span></span>
              <AppAutocomplete :items="filteredPayers" item-title="name" item-value="id" v-model="formData.payer_id"
                placeholder="Choose Payer" :rules="[requiredValidator]" />
            </VCol>
            <VCol v-if="formData.receiving_method === 'cash'">
              <span class="fs-13 label-color">Cash Pickup Location<span class="text-red">*</span></span>
              <AppAutocomplete :items="cashDesitinations" item-title="destination_name" item-value="id"
                v-model="formData.cash_destination_id" placeholder="Choose Cash Pickup Location"
                :rules="formData.receiving_method === 'cash' ? [requiredValidator] : []" />
            </VCol>
            <VCol>
              <span class="fs-13 label-color">Purpose of Sending<span class="text-red">*</span></span>
              <AppAutocomplete :items="sendingReasons" item-title="text" item-value="value"
                v-model="formData.sending_reason" placeholder="Propose Of Sending" :rules="[requiredValidator]" />
            </VCol>
          </VCol>
          <VCol cols="12" md="6">
            <VCol>
              <span class="fs-13 label-color">Customer Rate<span class="text-red">*</span></span>
              <VRow>
                <VCol cols="12" :md="sendMoneyDetails?.agent?.edit_rate_allow === 1 ? '9' : '12'">
                  <AppTextField placeholder="Customer Rate" v-model="formData.customer_rate"
                    :rules="[requiredValidator]" :disabled="!editrate">
                    <VChip color="error" class="mr-1" v-if="showCur">{{ formData.sending_currency }} 1 = {{
                      formData.receiving_currency }}</VChip>
                  </AppTextField>
                </VCol>
                <VCol cols="12 d-flex align-center" md="3" v-if="sendMoneyDetails?.agent?.edit_rate_allow === 1">
                  <VCheckbox v-model="editrate" />Edit Rate
                </VCol>
              </VRow>
            </VCol>
            <VCol>
              <span class="fs-13 label-color">Sending Amount<span class="text-red">*</span></span>
              <AppTextField placeholder="Sending Amount" v-model="formData.sending_amount"
                :rules="[requiredValidator]">
                <VChip color="error" class="mr-1" v-if="showCur">{{ formData.sending_currency }}</VChip>
              </AppTextField>
            </VCol>
            <VCol>
              <span class="fs-13 label-color">Reciver Amount<span class="text-red">*</span></span>
              <AppTextField placeholder="Reciver Amount" v-model="formData.receiving_amount"
                :rules="[requiredValidator, betweenValidator(formData.receiving_amount, payerLimits.min, payerLimits.max)]">
                <VChip color="error" class="mr-1" v-if="showCur">{{ formData.receiving_currency }}</VChip>
              </AppTextField>
            </VCol>
            <VCol class="py-8">
              <VTable class="border rounded">
                <tbody>
                  <tr>
                    <th class="bg-grey">Fee</th>
                    <td class="text-center font-weight-bold">{{ admin_fee }}</td>
                  </tr>
                  <tr>
                    <th class="bg-grey">Surcharge</th>
                    <td class="text-center font-weight-bold">0.00</td>
                  </tr>
                  <!-- <tr>
                    <th class="bg-grey">Admin Fee</th>
                    <td class="text-center font-weight-bold">0.00</td>
                  </tr> -->
                  <tr>
                    <th class="bg-grey">Promo Code</th>
                    <td class="text-center font-weight-bold">0.00</td>
                  </tr>
                  <tr>
                    <th class="bg-grey">Total Amount to Pay</th>
                    <td class="text-center font-weight-bold">{{ finaltotalAmount }}</td>
                  </tr>
                </tbody>
              </VTable>
            </VCol>
          </VCol>
        </VRow>
      </v-card-text>
      <v-row class="px-3">
        <sender-details @customerSelected="handleCustomerSelected"    :reset-key="resetKey" />
        <receiverDetails :senderCustomerId="selectedCustomer?.id" :recivingCountryId="formData.country_id"
          :recivingCountryName="recivingCountryName" @ReciverSelected="handelReciverSelected"
          :isAddReciver="isAddReciver"   :reset-key="resetKey"/>
      </v-row>
      <v-card-text class="d-flex justify-end gap-3">
        <VBtn color="secondary" variant="tonal" @click="resetForm"> Cancel </VBtn>
        <VBtn type="submit" variant="tonal" class="login-btn" :loading="loading">
          Send Money
        </VBtn>
      </v-card-text>
    </v-card>
  </VForm>
</template>
