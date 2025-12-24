<script setup>
import KycNotes from "@/components/customers/KycNotes.vue";
import AdditionalDocument from "@/components/payment-detail/addition-documents.vue";
import SenderDocuments from "@/components/payment-detail/sender-documents.vue";
import BeneficiaryDocuments from "@/components/payment-detail/beneficiary-documents.vue";
import BeneficiaryLedger from "@/components/payment-detail/beneficiary-ledger.vue";
import CustomerLedger from "@/components/payment-detail/customer-ledger.vue";
import TransactionAction from "@/components/payment-detail/transaction-action.vue";
import VerifyingCustomer from "@/components/payment-detail/verifying-customer.vue";
import { usePayments } from "@/composables/usePayments";

const {
  headers,
  payments,
  options,
  filters,
  transactionDetail,
  getPartnerLink,
  resolveStatusVariant,
  fetchTransactions,
} = usePayments();

const route = useRoute();
const transactionId = route.params.id;

const transactionData = ref(null);
const loading = ref(false);
const error = ref(null);

onMounted(async () => {
  const data = await transactionDetail(transactionId);
  transactionData.value = data;
});

</script>

<template>

  <VCol cols="12" class="pa-0">

  </VCol>
  <VCardTitle class="bg-grey d-flex justify-space-between align-center">
    <h1 class="mb-0 text-h4 py-2">
      Customer Details
    </h1>
  </VCardTitle>
  <VCardText class="mt-5 d-flex justify-space-between align-center border-b-sm pb-0 mb-2">
    <h1 class="text-h4 mb-0 py-2">
      Back Office (ONLINE CUS)
    </h1>
    <VBtn color="primary" variant="elevated" class="cursor-pointer" :to="'detail'" target="_blank">
      Transaction Code:<span class="text-decoration-underline">{{transactionData?.transaction?.transaction_code}}</span>
    </VBtn>
  </VCardText>
  <VCardText>
    <VerifyingCustomer  :sender="transactionData?.sender"  :transaction="transactionData?.transaction" />
  </VCardText>
  <VCardText class="px-0 pb-0 mt-5">
    <h1 class="text-h4 px-5 border-b-sm">
      Documents
    </h1>

  </VCardText>
  <VCol cols="12" class="pa-0">

    <SenderDocuments color-class="header-bg" :show-s-q-c="true" :show-view="true" :customer="transactionData?.senderDocuments"  :customer_id="transactionData?.transaction?.customer?.id" />
    <AdditionalDocument color-class="header-bg" :show-s-q-c="true" :show-view="true" />

    <BeneficiaryDocuments color-class="header-bg" :show-s-q-c="true" :show-view="true" :actionBtn="true" :beneficiary="transactionData?.beneficiaryDocuments" :beneficiary_id="transactionData?.transaction?.beneficiary?.id"/>
    <CustomerLedger heading-type="threshold" :ledger="transactionData?.customerLedger" :customer_id="transactionData?.transaction?.customer?.id"/>
  </VCol>
  <VCol cols="12" class="pa-0">
    <PaymentGateway />
  </VCol>
  <VCol cols="12" class="pa-0">
    <BeneficiaryLedger :ledger="transactionData?.beneficiaryLedger" :beneficiary_id="transactionData?.transaction?.beneficiary?.id"/>
  </VCol>
  <VCol cols="12" class="pa-0">
    <KycNotes />
  </VCol>
  <VCol cols="12" class="pa-0">
    <TransactionAction :transaction="transactionData?.transaction"/>
  </VCol>
</template>
