<script setup>
const permissionStore = usePermissionStore()
definePageMeta({
  middleware: "auth",
  permission: "transactions.show"
})
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import useUiFeedback from "@/composables/useUiFeedback";

import TransferDetail from "@/components/payment-detail/transfer-detail.vue";
import SenderDetail from "@/components/payment-detail/sender-detail.vue";
import BeneficiaryDetail from "@/components/payment-detail/beneficiary-detail.vue";
import CustomerDocuments from "@/components/customers/CustomerDocuments.vue";
import SenderDocuments from "@/components/payment-detail/sender-documents.vue";
import AdditionalDocument from "@/components/payment-detail/addition-documents.vue";
import BeneficiaryDocuments from "@/components/payment-detail/beneficiary-documents.vue";
import PaymentGateway from "@/components/payment-detail/payment-gateway.vue";
import CustomerLedger from "@/components/payment-detail/customer-ledger.vue";
import BeneficiaryLedger from "@/components/payment-detail/beneficiary-ledger.vue";
import LinkReports from "@/components/payment-detail/reports.vue";
import TransactionRemarks from "@/components/payment-detail/transaction-remarks.vue";
import SupportRemarks from "@/components/payment-detail/support-remarks.vue";
import KycNotes from "@/components/customers/KycNotes.vue";
import Complaints from "@/components/payment-detail/complaints.vue";
import ResponseHistory from "@/components/payment-detail/response-history.vue";
import AutomationRule from "@/components/payment-detail/automation-rule.vue";
import TransferRefrense from "@/components/payment-detail/transfer-refrense.vue";
import { usePayments } from "@/composables/usePayments";
const {
  headers,
  payments,
  options,
  filters,
  transactionDetail,
  getPartnerLink,
  cancelTransaction,
  verifyTransaction,
  resolveStatusVariant,
  fetchTransactions,
  fetchComplaints,
} = usePayments();


const {
        showLoading,
        hideLoading,
        showSuccess,
        showError,
        confirmAction,
    } = useUiFeedback();

const route = useRoute();
const transactionId = route.params.id;

const transactionData = ref(null);
const complaints = ref([]);
const loading = ref(false);
const error = ref(null);
const payment_canceling = ref(false);
onMounted(async () => {
  const data = await transactionDetail(transactionId);
  transactionData.value = data;
   if (data?.transaction?.transaction_code) {
    complaints.value = await fetchComplaints(data.transaction.transaction_code);
  }
  payment_canceling.value = data?.transaction?.status == 'canceling';
  if (payment_canceling.value) {
    amount.value = `${data?.transaction?.sending_currency} ${data?.transaction?.sending_amount}`;
  }
});

const documentsRefreshKey = ref(0);
const amount = ref('')
const remarks = ref(null)
const formRef = ref(null);

function refreshDocumentsComponent() {
  documentsRefreshKey.value += 1;
}

const handleAccept = async () => {

  const { valid } = await formRef.value.validate();

  if (!valid) {
    return;
  }
  try {
    showLoading();
    console.log('accept id and remarks',transactionId,remarks.value);
    await cancelTransaction(transactionId, remarks.value);
    showSuccess("Transaction canceled successfully");
      const updated = await transactionDetail(transactionId);
      transactionData.value = updated;
      payment_canceling.value = transactionData?.status;
  } catch (e) {
    showError(e?.response?.data?.message || "Failed to cancel");
  } finally {
    hideLoading();
  }
};

const handleReject = async () => {
    const { valid } = await formRef.value.validate();

  if (!valid) {
    return;
  }
  try {
    showLoading();
       console.log('reject id and remarks',transactionId,remarks.value);
    await verifyTransaction(transactionId, remarks.value);
    showSuccess("Transaction successfully processed");
   const updated = await transactionDetail(transactionId);
        transactionData.value = updated;
      payment_canceling.value = transactionData?.status;

  } catch (e) {
    showError(e?.response?.data?.message || "Failed to verify");
  } finally {
    hideLoading();
  }
};

</script>

<template>
  <v-card elevation="2" class="mb-3">
    <v-card-title class="bg-grey d-flex justify-space-between align-center">
      <h1 class="mb-0 text-h4 py-2">Transaction Details</h1>
      <VBtn color="secondary" variant="tonal" prepend-icon="tabler-upload">
        Transaction invoice
      </VBtn>
    </v-card-title>

    <v-card-text class="mt-5 mb-0 pb-0">
      <TransferDetail :transaction="transactionData?.transaction" />
    </v-card-text>

    <v-card-text class="px-0 pb-0 mt-5 bg-grey">
      <h1 class="text-h5 px-5 py-4">Sender Details</h1>
    </v-card-text>

    <v-card-text class="pt-0 my-7 pb-2">
      <div class="border pb-2">
        <SenderDetail :sender="transactionData?.sender" :ledger="transactionData?.customerLedger" />
      </div>
    </v-card-text>

    <v-card-text class="px-0 pb-0 mt-5 bg-grey">
      <h1 class="text-h5 px-5 py-4">Beneficiary Details</h1>
    </v-card-text>

    <v-card-text class="pt-0 my-7 pb-2">
      <div class="border pb-2">
        <BeneficiaryDetail :beneficiary="transactionData?.beneficiary" :transaction="transactionData?.transaction"  />
      </div>
    </v-card-text>
  </v-card>
  <VRow class="px-3">
    <VCol cols="12" class="pa-0">
      <SenderDocuments :key="documentsRefreshKey" :showStatus="true" :customer="transactionData?.senderDocuments"
        :customer_id="transactionData?.transaction?.customer?.id" @refetchSenderDocuments="refreshDocumentsComponent" v-if="permissionStore.hasPermission('customer.document.view')"/>

      <AdditionalDocument :key="documentsRefreshKey" :showStatus="true" :customer="transactionData?.additionalDocuments"
        :customer_id="transactionData?.transaction?.customer?.id"
        @refetchadditionalDocuments="refreshDocumentsComponent" v-if="permissionStore.hasPermission('customer.document.view')"/>
      <BeneficiaryDocuments :key="documentsRefreshKey" :beneficiary="transactionData?.beneficiaryDocuments"
        :beneficiary_id="transactionData?.transaction?.beneficiary?.id"
        @refetchSenderDocuments="refreshDocumentsComponent" v-if="permissionStore.hasPermission('beneficiary.document.view')"/>
    </VCol>
    <VCol cols="12 px-0 pt-0" v-if="payment_canceling">
      <VCard class="border mb-2">
        <v-card-title class="border-b-sm d-flex align-center bg-grey">
          <h4 class="text-h5 py-3">Cancel Payment</h4>
        </v-card-title>
        <VCardText class="pt-3">
          <VForm @submit.prevent="" ref="formRef">
            <VRow>
              <VCol cols="12" md="4">
                <span class="fs-13 label-color">Cancellation Amount<span class="text-red">*</span></span>
                <AppTextField placeholder="Amount" v-model="amount" :rules="[requiredValidator]" disabled />
              </VCol>
              <VCol cols="12" md="8">
                <span class="fs-13 label-color">Cancellation Remarks<span class="text-red">*</span></span>
                <AppTextarea placeholder="Type here...." rows="2" v-model="remarks" :rules="[requiredValidator]" />
              </VCol>
              <VCol cols="12" class="d-flex gap-4 justify-end">
                <VBtn type="submit" color="error" variant="elevated" @click="handleAccept"> Accept </VBtn>
                <VBtn type="submit" variant="tonal" class="login-btn" @click="handleReject"  :loading="loading">
                  Reject
                </VBtn>
              </VCol>
            </VRow>
          </VForm>
        </VCardText>
      </VCard>
    </VCol>
    <VCol cols="6" class="pa-0">
      <PaymentGateway />
    </VCol>

    <VCol cols="12" class="pa-0" v-if="permissionStore.hasPermission('customer.ledger.details')">
      <CustomerLedger headingType="ledger" :ledger="transactionData?.customerLedger"
        :customer_id="transactionData?.transaction?.customer?.id"/>
    </VCol>

    <VCol cols="12" class="pa-0" v-if="permissionStore.hasPermission('beneficiary.ledger.details')">
      <BeneficiaryLedger :ledger="transactionData?.beneficiaryLedger"
        :beneficiary_id="transactionData?.transaction?.beneficiary?.id" />
    </VCol>

    <VCol cols="12" class="pa-0">
      <LinkReports :transaction_id="transactionData?.transaction?.id" />
    </VCol>

    <VCol cols="12" class="pa-0" v-if="permissionStore.hasPermission('transactions.remarks.index')">
      <TransactionRemarks :key="documentsRefreshKey" :remarks="transactionData?.transactionRemarks"
        :transaction_id="transactionData?.transaction?.id" @refetchSenderDocuments="refreshDocumentsComponent" />
    </VCol>

    <VCol cols="12" class="pa-0" v-if="permissionStore.hasPermission('transactions.support.index')">
      <SupportRemarks :key="documentsRefreshKey" :support_remarks="transactionData?.supportRemarks"
        :transaction_id="transactionData?.transaction?.id" @refetchSenderDocuments="refreshDocumentsComponent"/>
    </VCol>

    <VCol cols="12" class="pa-0" v-if="permissionStore.hasPermission('kyc_notes.index')">
      <KycNotes :key="documentsRefreshKey" :kyc_notes="transactionData?.kycNotes"
        :transaction_id="transactionData?.transaction?.id" :customer_id="transactionData?.transaction?.customer?.id"
        @refetchSenderDocuments="refreshDocumentsComponent" />
    </VCol>

    <VCol cols="12" class="pa-0" v-if="permissionStore.hasPermission('transactions.complaints')">
      <Complaints :complaints="complaints" />
    </VCol>

    <VCol cols="12" class="pa-0" v-if="permissionStore.hasPermission('partner_response_detail')">
      <ResponseHistory :partner_responses="transactionData?.transaction?.partner_responses || []"/>
    </VCol>

    <VCol cols="12" class="pa-0">
      <AutomationRule />
    </VCol>

    <VCol cols="12" class="pa-0">
      <TransferRefrense />
    </VCol>

     <VCol cols="12" class="pa-0 mt-4">
      <AuditLog module="Transaction" :id="transactionData?.transaction?.id"/>
    </VCol>

  </VRow>
</template>
