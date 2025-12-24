<script setup>
import { usePayments } from "@/composables/usePayments";
const {
  headers,
  payments,
  loading,
  options,
  fetchTransactions,
  resolveStatusVariant,
  getPartnerLink,
} = usePayments();

const props = defineProps({
  transaction: Object,
});
const isHighAlert = ref(false);
</script>
<template>
  <v-expansion-panels class="my-5 border rounded" elevation="0">
    <v-expansion-panel>
      <v-expansion-panel-title :class="[
        isHighAlert ? 'bg-error' : 'bg-lightheader',
        'py-1',
        'ps-0',
        'pe-7',
        'border-b-sm',
      ]">
        <VCol cols=" 12" class="d-flex justify-space-between align-center">
          <p class="fs-15 font-weight-medium mb-0 text-uppercase">
            Transfer Details
          </p>
          <v-checkbox label="Mark as high alert" v-model="isHighAlert"></v-checkbox>
          <p class="mb-0 text-primary">
            {{ transaction?.transaction_code || "---" }}
          </p>
        </VCol>
      </v-expansion-panel-title>
      <v-expansion-panel-text class="px-0">
        <VDataTable hide-default-footer>
          <tbody>
            <tr>
              <td class="bg-grey">
                <p class="fs-16 text-truncate font-weight-bold text-color mb-0">
                  Sending Country
                </p>
              </td>
              <td>
                <p class="text-grey mb-0 fs-16 font-weight-medium">
                  {{ transaction?.customer?.sending_country?.name || "---" }}
                </p>
              </td>
              <td class="bg-grey">
                <p class="fs-16 text-truncate font-weight-bold text-color mb-0">
                  Sender Sanction
                </p>
              </td>
              <td class="d-flex py-1 px-2">
                <p class="text-grey text-truncate mb-0 fs-16 font-weight-medium my-0 w-100"
                  :class="[transaction.sender_sanction == 1 ? 'bg-success' : 'bg-error']">
                  &nbsp;
                </p>
              </td>
              <td class="bg-grey">
                <p class="fs-16 text-truncate font-weight-bold text-color mb-0">
                  Sending Method
                </p>
              </td>
              <td>
                <p class="text-grey text-truncate mb-0 fs-16 font-weight-medium">
                  {{ transaction?.sending_method || "---" }}
                </p>
              </td>
            </tr>
            <tr>
              <td class="bg-grey">
                <p class="fs-16 text-truncate font-weight-bold text-color mb-0">
                  Receiving Country
                </p>
              </td>
              <td>
                <p class="text-grey mb-0 fs-16 font-weight-medium">
                  {{ transaction?.payer?.country || "---" }}
                </p>
              </td>
              <td class="bg-grey">
                <p class="fs-16 text-truncate font-weight-bold text-color mb-0">
                  Receiver Sanction
                </p>
              </td>
              <td class="d-flex py-1 px-2">
                <p class="text-grey text-truncate mb-0 fs-16 font-weight-medium my-0 w-100"
                  :class="[transaction.beneficiary_sanction == 1 ? 'bg-success' : 'bg-error']">
                  &nbsp;
                </p>
              </td>
              <td class="bg-grey">
                <p class="fs-16 text-truncate font-weight-bold text-color mb-0">
                  Receiving Method
                </p>
              </td>
              <td>
                <p class="text-grey text-truncate mb-0 fs-16 font-weight-medium">
                  {{ transaction?.receiving_method || "---" }}
                </p>
              </td>
            </tr>
            <tr>
              <td class="bg-grey">
                <p class="fs-16 text-truncate font-weight-bold text-color mb-0">
                  Main Agent
                </p>
              </td>
              <td>
                <p class="text-grey mb-0 fs-16 font-weight-medium">
                  {{ transaction?.customer?.main_agent || "---" }}
                </p>
              </td>
              <td class="bg-grey">
                <p class="fs-16 text-truncate font-weight-bold text-color mb-0">
                  Sub Agent
                </p>
              </td>
              <td>
                <p class="text-grey text-truncate mb-0 fs-16 font-weight-medium">
                  {{ transaction?.customer?.sub_agent || "---" }}
                </p>
              </td>
              <td class="bg-grey">
                <p class="fs-16 text-truncate font-weight-bold text-color mb-0">
                  Officer
                </p>
              </td>
              <td>
                <p class="text-grey text-truncate mb-0 fs-16 font-weight-medium">
                  {{ transaction?.customer?.officer || "---" }}
                </p>
              </td>
            </tr>
            <tr>
              <td class="bg-grey">
                <p class="fs-16 text-truncate font-weight-bold text-color mb-0">
                  Sending Amount
                </p>
              </td>
              <td>
                <p class="text-grey mb-0 fs-16 font-weight-medium">
                  {{ transaction?.sending_currency || "---" }}
                  {{ transaction?.sending_amount || "---" }}
                </p>
              </td>
              <td class="bg-grey">
                <p class="fs-16 text-truncate font-weight-bold text-color mb-0">
                  Transaction Code
                </p>
              </td>
              <td>
                <p class="text-grey text-truncate mb-0 fs-16 font-weight-medium">
                  {{ transaction?.transaction_code || "---" }}
                </p>
              </td>
              <td class="bg-grey">
                <p class="fs-16 text-truncate font-weight-bold text-color mb-0">
                  Online Transfer
                </p>
              </td>
              <td>
                <p class="text-grey text-truncate mb-0 fs-16 font-weight-medium">
                  {{ "---" }}
                </p>
              </td>
            </tr>
            <tr>
              <td class="bg-grey">
                <p class="fs-16 text-truncate font-weight-bold text-color mb-0">
                  Agent Charges
                </p>
              </td>
              <td>
                <p class="text-grey mb-0 fs-16 font-weight-medium">
                  {{ "---" }}
                </p>
              </td>
              <td class="bg-grey">
                <p class="fs-16 text-truncate font-weight-bold text-color mb-0">
                  Invoice no.
                </p>
              </td>
              <td>
                <p class="text-grey text-truncate mb-0 fs-16 font-weight-medium">
                  {{ transaction?.invoice_no || "---" }}
                </p>
              </td>
              <td class="bg-grey">
                <p class="fs-16 text-truncate font-weight-bold text-color mb-0">
                  Deposit Slip
                </p>
              </td>
              <td>
                <p class="text-grey text-truncate mb-0 fs-16 font-weight-medium">
                  {{ "---" }}
                </p>
              </td>
            </tr>
            <tr>
              <td class="bg-grey">
                <p class="fs-16 text-truncate font-weight-bold text-color mb-0">
                  Company Charges
                </p>
              </td>
              <td>
                <p class="text-grey mb-0 fs-16 font-weight-medium">
                  {{ transaction?.sending_currency || "---" }}
                  {{ transaction?.admin_fee || "---" }}
                </p>
              </td>
              <td class="bg-grey">
                <p class="fs-16 text-truncate font-weight-bold text-color mb-0">
                  Main Agent Rate
                </p>
              </td>
              <td>
                <p class="text-grey text-truncate mb-0 fs-16 font-weight-medium">
                  {{ transaction?.receiving_currency || "---" }}
                  {{ transaction?.main_agent_rate || "---" }}
                </p>
              </td>
              <td class="bg-grey">
                <p class="fs-16 text-truncate font-weight-bold text-color mb-0">
                  Sending Reason
                </p>
              </td>
              <td>
                <p class="text-grey text-wrap mb-0 fs-16 font-weight-medium">
                  {{ transaction?.sending_reason || "---" }}
                </p>
              </td>
            </tr>
            <tr>
              <td class="bg-grey">
                <p class="fs-16 text-truncate font-weight-bold text-color mb-0">
                  Sending Amount
                </p>
              </td>
              <td>
                <p class="text-red text-decoration-underline mb-0 fs-16 font-weight-medium">
                  {{ transaction?.sending_currency || "---" }}
                  {{ transaction?.sending_amount || "---" }}
                </p>
              </td>
              <td class="bg-grey">
                <p class="fs-16 text-truncate font-weight-bold text-color mb-0">
                  Agent Rate
                </p>
              </td>
              <td>
                <p class="text-grey text-truncate mb-0 fs-16 font-weight-medium">
                  {{ transaction?.receiving_currency || "---" }}
                  {{ transaction?.agent_rate || "---" }}
                </p>
              </td>
              <td class="bg-grey">
                <p class="fs-16 text-truncate font-weight-bold text-color mb-0">
                  Payer
                </p>
              </td>
              <td>
                <p class="text-grey text-wrap mb-0 fs-16 font-weight-medium">
                  {{ transaction?.payer?.name || "---" }}
                </p>
              </td>
            </tr>
            <tr>
              <td class="bg-grey">
                <p class="fs-16 text-truncate font-weight-bold text-color mb-0">
                  Discount Amount
                </p>
              </td>
              <td>
                <p class="text-red text-decoration-underline mb-0 fs-16 font-weight-medium">
                  {{ transaction?.discounted_amount || "---" }}
                </p>
              </td>
              <td class="bg-grey">
                <p class="fs-16 text-truncate font-weight-bold text-color mb-0">
                  Customer Rate
                </p>
              </td>
              <td>
                <p class="text-red text-decoration-underline text-truncate mb-0 fs-16 font-weight-medium">
                  {{ transaction?.sending_currency || "---" }}
                  {{ transaction?.customer_rate || "---" }}
                </p>
              </td>
              <td class="bg-grey">
                <p class="fs-16 text-truncate font-weight-bold text-color mb-0">
                  Cash Pickup
                </p>
              </td>
              <td>
                <p class="text-grey text-wrap mb-0 fs-16 font-weight-medium">
                  {{ "---" }}
                </p>
              </td>
            </tr>
            <tr>
              <td class="bg-grey">
                <p class="fs-16 text-truncate font-weight-bold text-color mb-0">
                  Total Amount to Pay
                </p>
              </td>
              <td>
                <p class="text-red text-decoration-underline mb-0 fs-16 font-weight-medium">
                  {{ transaction?.sending_currency || "---" }}
                  {{
                    transaction.total_amount_to_pay
                  }}

                </p>
              </td>
              <td class="bg-grey">
                <p class="fs-16 text-truncate font-weight-bold text-color mb-0">
                  Created At (M)
                </p>
              </td>
              <td>
                <p class="text-grey text-truncate mb-0 fs-16 font-weight-medium">
                  {{ transaction?.created_at || "---" }}
                </p>
              </td>
              <td class="bg-grey">
                <p class="fs-16 text-truncate font-weight-bold text-color mb-0">
                  Coupon
                </p>
              </td>
              <td>
                <p class="text-grey text-wrap mb-0 fs-16 font-weight-medium">
                  {{ transaction?.coupon?.coupon_code || "---" }}
                </p>
              </td>
            </tr>
            <tr>
              <td class="bg-grey">
                <p class="fs-16 text-truncate font-weight-bold text-color mb-0">
                  Receiving Amount
                </p>
              </td>
              <td>
                <p class="text-red text-decoration-underline mb-0 fs-16 font-weight-medium">
                  {{ transaction?.receiving_currency || "---" }}
                  {{ transaction?.receiving_amount || "---" }}
                </p>
              </td>
              <td class="bg-grey">
                <p class="fs-16 text-truncate font-weight-bold text-color mb-0">
                  Promotional Customer Rate
                </p>
              </td>
              <td>
                <p v-if="transaction?.customer_rate_id" class="text-grey text-truncate mb-0 fs-16 font-weight-medium">
                  <NuxtLink :to="`/promotions/customer-rate/edit-rates/${transaction.customer_rate_id}`"
                    class="text-warning text-decoration-underline">
                    {{ transaction.customer_rate_id }}
                  </NuxtLink>
                </p>

                <p v-else class="text-grey text-truncate mb-0 fs-16 font-weight-medium">
                  ---
                </p>
              </td>
              <td class="bg-grey">
                <p class="fs-16 text-truncate font-weight-bold text-color mb-0">
                  Wallet
                </p>
              </td>
              <td>
                <p class="text-grey text-wrap mb-0 fs-16 font-weight-medium">
                  {{ transaction?.wallet?.name || "---" }}
                </p>
              </td>
            </tr>
            <tr>
              <td class="bg-grey">
                <p class="fs-16 text-truncate font-weight-bold text-color mb-0">
                  Status
                </p>
              </td>
              <td class="d-flex py-1 px-2">
                <p class="text-red text-decoration-underline mb-0 text-truncate fs-15 font-weight-medium w-100 d-flex justify-center align-center px-1"
                  :style="{
                    ...resolveStatusVariant(transaction.status)
                  }">
                  {{ resolveStatusVariant(transaction.status).text }}
                </p>
              </td>
              <td class="bg-grey">
                <p class="fs-16 text-truncate font-weight-bold text-color mb-0">
                  Paid At
                </p>
              </td>
              <td>
                <p class="text-grey mb-0 fs-16 font-weight-medium">
                  {{ "---" }}
                </p>
              </td>
              <td class="bg-grey">
                <p class="fs-16 text-truncate font-weight-bold text-color mb-0">
                  Fee Free Transfer
                </p>
              </td>
              <td>
                <p class="text-grey text-wrap mb-0 fs-16 font-weight-medium">
                  {{ "---" }}
                </p>
              </td>
            </tr>
            <tr>
              <td class="bg-grey">
                <p class="fs-16 text-truncate font-weight-bold text-color mb-0">
                  Ip
                </p>
              </td>
              <td class="d-flex py-1 px-2">
                <p class="text-grey mb-0 fs-16 font-weight-medium">
                  {{ transaction?.ip || "---" }}
                </p>
              </td>
              <td class="bg-grey">
                <p class="fs-16 text-truncate font-weight-bold text-color mb-0">
                  Device Details
                </p>
              </td>
              <td>
              <p class="text-grey mb-0 fs-16 font-weight-medium text-wrap">
              <div v-if="transaction?.device_details">
              <p><strong>Device:</strong> {{ transaction.device_details.device_name }} | <strong>OS:</strong> {{ transaction.device_details.os_name }} {{ transaction.device_details.os_version }} | <strong>Model:</strong> {{ transaction.device_details.model }}</p>
             
            </div>
            <div v-else>
              ---
            </div>
                </p>
              </td>
              <td class="bg-grey">
                <p class="fs-16 text-truncate font-weight-bold text-color mb-0">
                  Payment Introduced By
                </p>
              </td>
              <td>
                <p class="text-grey text-wrap mb-0 fs-16 font-weight-medium">
                  {{ "---" }}
                </p>
              </td>
            </tr>
            <tr>
              <td class="bg-grey">
                <p class="fs-16 text-truncate font-weight-bold text-color mb-0">
                  Source of Funds
                </p>
              </td>
              <td class="d-flex py-1 px-2">
                <p class="text-grey mb-0 fs-16 font-weight-medium">
                  {{ "---" }}
                </p>
              </td>
              <td class="bg-grey">
                <p class="fs-16 text-truncate font-weight-bold text-color mb-0">
                  Sales Code
                </p>
              </td>
              <td>
                <p class="text-grey mb-0 fs-16 font-weight-medium">
                  {{ "---" }}
                </p>
              </td>
              <td class="bg-grey">
                <p class="fs-16 text-truncate font-weight-bold text-color mb-0">
                  Receiver Account Validated
                </p>
              </td>
              <td>
                <p class="text-grey text-wrap mb-0 fs-16 font-weight-medium">
                  <VChip :color="0 == 1 ? 'success' : 'error'" class="font-weight-medium" size="small">
                    {{ 0 == 1 ? "Yes" : "No" }}
                  </VChip>
                </p>
              </td>
            </tr>
            <tr>
              <td class="bg-grey">
                <p class="fs-16 text-truncate font-weight-bold text-color mb-0">
                  Cancel Reason
                </p>
              </td>
              <td class="d-flex py-1 px-2">
                <p class="text-grey mb-0 fs-16 font-weight-medium">
                  {{ transaction?.cancel_reason || "---" }}
                </p>
              </td>
              <td class="bg-grey">
                <p class="fs-16 text-truncate font-weight-bold text-color mb-0">
                </p>
              </td>
              <td>
                <p class="text-grey mb-0 fs-16 font-weight-medium">
                </p>
              </td>
              <td class="bg-grey">
                <p class="fs-16 text-truncate font-weight-bold text-color mb-0">
                </p>
              </td>
              <td>
                <p class="text-grey text-wrap mb-0 fs-16 font-weight-medium">
                </p>
              </td>
            </tr>
          </tbody>
        </VDataTable>
      </v-expansion-panel-text>
    </v-expansion-panel>
  </v-expansion-panels>
</template>
<style lang="scss">
.v-expansion-panel-text__wrapper {
  padding-block: 0 !important;
  padding-inline: 0 !important;
}
</style>
