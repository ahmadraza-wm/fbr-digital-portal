<script setup>
import PartnerStatus from "@/components/payment-detail/partner-status-detail.vue";
import { usePayments } from "@/composables/usePayments";
import useUiFeedback from "@/composables/useUiFeedback";
import { ref } from "vue";
definePageMeta({
  middleware: "auth",
  permission: "payments.partner.status"
})
const { $axios } = useNuxtApp();

const invoice = ref("");
const code = ref("");
const countryVal = ref(null);
const showDetails = ref(false);
const transactionDetails = ref(null);

const {
  headers,
  payments,
  options,
  partners,
  total_transactions,
  total_sending_amount,
  total_charges,
  total_receiving_amount,
  fetchTransactions,
  resolveStatusVariant,
  getPartnerLink,
  getPartnerStatus,
} = usePayments();

const {
  loading,
  showLoading,
  hideLoading,
  showSuccess,
  showError,
  confirmAction,
} = useUiFeedback();
const country = ref([
  { title: "USA", value: "USA" },
  { title: "Pakistan", value: "Pakistan" },
]);

const searchHandler = async () => {
  if (invoice.value || code.value || countryVal.value) {
    showLoading();
    try {
      const filterParams = {
        invoice_no: invoice.value,
        transaction_code: code.value,
        partner_id: countryVal.value,
      };

      const result = await getPartnerStatus(filterParams);

      if (result) {
        transactionDetails.value = result;
        showDetails.value = true;
      } else {
        transactionDetails.value = null;
        showDetails.value = false;
        showError("No transaction found.");
      }
    } catch (err) {
      showError("Failed to fetch partner status.");
    } finally {
      hideLoading();
    }
  } else {
    showError("Please enter at least one input before searching");
  }
};
</script>

<template>
  <v-card>
    <VCardTitle class="border-b-sm d-flex align-center justify-space-between" style="background-color: #e6e6e6;">
      <h4 class="text-h5 pt-4 pb-3 mb-0 float-start">View Partner Status</h4>
    </VCardTitle>

    <VForm @submit.prevent="searchHandler">
      <VCardText class="pt-3 mb-3">
        <VRow class="pt-3 d-flex align-end">
          <VCol cols="3" class="pb-1">
            <span class="fs-13 label-color">Invoice #</span>
            <AppTextField v-model="invoice" name="invoice" placeholder="*****" autocomplete="off"/>
          </VCol>
          <VCol cols="3" class="pb-1">
            <span class="fs-13 label-color">Transfer Code</span>
            <AppTextField v-model="code" name="code" placeholder="125698" autocomplete="off" />
          </VCol>
          <VCol cols="3" class="pb-1">
            <span class="fs-13 label-color">Partners</span>
            <AppAutocomplete v-model="countryVal" :items="partners" item-title="name" item-value="id"
              placeholder="GCC REmit" />
          </VCol>
          <VCol cols="3" class="pb-1">
            <VBtn variant="tonal" class="me-3 login-btn" type="submit">Search</VBtn>
            <VBtn color="secondary" variant="tonal" class="me-3" @click="
              () => {
                invoice = '';
                code = '';
                countryVal = null;
                showDetails = false;
              }
            ">Reset</VBtn>
          </VCol>
        </VRow>
      </VCardText>
    </VForm>

    <!-- Payment Details Section -->
    <template v-if="showDetails">
      <template v-if="showDetails">
        <PartnerStatus :transactionDetails="transactionDetails" />
      </template>
    </template>
  </v-card>
</template>
