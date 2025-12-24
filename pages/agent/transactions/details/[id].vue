<script setup>
import { ref, onMounted } from 'vue';
const route = useRoute();
import paymentRemarks from '@/components/agent-portal/payment-remarks.vue';
// import customerDocuments from '@/components/agent-portal/customerDocuments.vue';
import { useAgentTransactions } from '@/composables/agentPortal/useTransctions';
const { fetchTransactionsDetailsById, transactionsDetails } = useAgentTransactions();
const transactionInfo = ref();
const customerDetails = ref();
onMounted(async () => {
  await fetchTransactionsDetailsById(route.params.id);
  transactionInfo.value = transactionsDetails?.value.transaction;
  customerDetails.value = transactionsDetails?.value.transaction?.customer;
});
</script>
<template>
  <v-card class="mb-3">
    <v-card-title class="bg-grey d-flex justify-space-between align-center">
      <h1 class="mb-0 text-h4 py-2">Transaction Details</h1>
      <div class="d-flex gap-2">
        <VBtn color="primary" variant="elevated">
          Download Invoice
        </VBtn>
        <VBtn color="error" variant="elevated">
          Request For Cancellation
        </VBtn>
      </div>
    </v-card-title>
    <v-card-text class="px-1 pt-3 pb-3">
      <v-row>
        <v-col cols="12 bg-grey mr-sm-0 mx-5 my-3 d-flex text-center align-center justify-center" sm="4">
          <div>
            <p class="mb-0">To Receive</p>
            <h3 class="mb-0">{{ transactionInfo?.receiving_amount }} {{ transactionInfo?.receiving_currency }}</h3>
            <p class="mb-0 text-capitalize">{{ transactionInfo?.receiving_method }} </p>
          </div>
        </v-col>
        <v-col class="px-5">
          <VDataTable hide-default-footer class="border">
            <tbody>
              <tr>
                <td class="bg-grey">
                  <p class="fs-16 text-truncate font-weight-bold text-color mb-0">
                    Trx. Code
                  </p>
                </td>
                <td>
                  <p class="text-grey mb-0 fs-16 font-weight-medium">
                    {{ transactionInfo?.transaction_code }}
                  </p>
                </td>
                <td class="bg-grey">
                  <p class="fs-16 text-truncate font-weight-bold text-color mb-0">
                    Trx. ID
                  </p>
                </td>
                <td>
                  <p class="text-grey mb-0 fs-16 font-weight-medium">
                    {{ transactionInfo?.id }}
                  </p>
                </td>
              </tr>
              <tr>
                <td class="bg-grey">
                  <p class="fs-16 text-truncate font-weight-bold text-color mb-0">
                    Sending Date
                  </p>
                </td>
                <td>
                  <p class="text-grey mb-0 fs-16 font-weight-medium">
                    19 Nov 2025 05:47 PM
                  </p>
                </td>
                <td class="bg-grey">
                  <p class="fs-16 text-truncate font-weight-bold text-color mb-0">
                    Receiving Date
                  </p>
                </td>
                <td>
                  <p class="text-grey text-truncate mb-0 fs-16 font-weight-medium">
                    21 Nov 2025 05:47 PM
                  </p>
                </td>
              </tr>
              <tr>
                <td class="bg-grey">
                  <p class="fs-16 text-truncate font-weight-bold text-color mb-0">
                    {{ transactionInfo?.sending_currency }} 1
                  </p>
                </td>
                <td>
                  <p class="text-grey text-truncate mb-0 fs-16 font-weight-medium">
                    {{ transactionInfo?.receiving_currency }} {{ transactionInfo?.agent_rate }}
                  </p>
                </td>
                <td class="bg-grey">
                  <p class="fs-16 text-truncate font-weight-bold text-color mb-0">
                    Amount
                  </p>
                </td>
                <td>
                  <p class="text-grey mb-0 fs-16 font-weight-medium">
                    {{ transactionInfo?.sending_amount }} {{ transactionInfo?.sending_currency }}
                  </p>
                </td>

              </tr>
              <tr>
                <td class="bg-grey">
                  <p class="fs-16 text-truncate font-weight-bold text-color mb-0">
                    Fee
                  </p>
                </td>
                <td>
                  <p class="text-grey mb-0 fs-16 font-weight-medium">
                    {{ transactionInfo?.admin_fee }} {{ transactionInfo?.sending_currency }}
                  </p>
                </td>
                <td class="bg-grey">
                  <p class="fs-16 text-truncate font-weight-bold text-color mb-0">
                    Surcharge
                  </p>
                </td>
                <td>
                  <p class="text-grey text-truncate mb-0 fs-16 font-weight-medium">
                    0.00 {{ transactionInfo?.sending_currency }}
                  </p>
                </td>
              </tr>
              <tr>
                <td class="bg-grey" colspan="2">
                  <p class="fs-16 text-center font-weight-bold text-color mb-0">
                    Total
                  </p>
                </td>
                <td colspan="2">
                  <p class="text-grey text-center mb-0 fs-16 font-weight-medium">
                    {{ transactionInfo?.total_amount_to_pay }} {{ transactionInfo?.sending_currency }}
                  </p>
                </td>
              </tr>
            </tbody>
          </VDataTable>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
  <v-container fluid class="px-0 py-2 mb-3">
    <v-row>
      <v-col cols="12" sm="6">
        <v-card>
          <v-card-title class="bg-grey">
            <h1 class="mb-0 text-h4 py-2">Agent Details</h1>
          </v-card-title>
          <v-card-text class="px-2 py-2">
            <VDataTable hide-default-footer class="border">
              <tbody>
                <tr>
                  <td class="bg-grey">
                    <p class="fs-16 text-truncate font-weight-bold text-color mb-0">
                      Name
                    </p>
                  </td>
                  <td>
                    <p class="text-grey mb-0 fs-16 font-weight-medium">
                      Roze Remit Head Office
                    </p>
                  </td>
                </tr>
                <tr>
                  <td class="bg-grey">
                    <p class="fs-16 text-truncate font-weight-bold text-color mb-0">
                      Phone
                    </p>
                  </td>
                  <td>
                    <p class="text-grey mb-0 fs-16 font-weight-medium">
                      02039947333
                    </p>
                  </td>
                </tr>
                <tr>
                  <td class="bg-grey">
                    <p class="fs-16 text-truncate font-weight-bold text-color mb-0">
                      Address
                    </p>
                  </td>
                  <td>
                    <p class="text-grey mb-0 fs-16 font-weight-medium">
                      14 High Street Barkingside IG6 2DF United Kingdom
                    </p>
                  </td>
                </tr>
                <tr>
                  <td class="bg-grey">
                    <p class="fs-16 text-truncate font-weight-bold text-color mb-0">
                      Sending Method
                    </p>
                  </td>
                  <td>
                    <p class="text-grey mb-0 fs-16 font-weight-medium">
                      {{transactionInfo?.sending_method}}
                    </p>
                  </td>
                </tr>
              </tbody>
            </VDataTable>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" sm="6">
        <v-card>
          <v-card-title class="bg-grey">
            <h1 class="mb-0 text-h4 py-2">Destination Details</h1>
          </v-card-title>
          <v-card-text class="px-2 py-2">
            <VDataTable hide-default-footer class="border">
              <tbody>
                <tr>
                  <td class="bg-grey">
                    <p class="fs-16 text-truncate font-weight-bold text-color mb-0">
                      Country
                    </p>
                  </td>
                  <td>
                    <p class="text-grey mb-0 fs-16 font-weight-medium">
                      {{ transactionInfo?.beneficiary?.country }}
                    </p>
                  </td>
                </tr>
                <tr>
                  <td class="bg-grey">
                    <p class="fs-16 text-truncate font-weight-bold text-color mb-0">
                      Payer
                    </p>
                  </td>
                  <td>
                    <p class="text-grey mb-0 fs-16 font-weight-medium">
                      {{ transactionInfo?.payer?.name }}
                    </p>
                  </td>
                </tr>
                <tr>
                  <td class="bg-grey">
                    <p class="fs-16 text-truncate font-weight-bold text-color mb-0">
                      Destination
                    </p>
                  </td>
                  <td>
                    <p class="text-grey mb-0 fs-16 font-weight-medium">
                      {{ transactionInfo?.cash_destination?.destination_name }}

                    </p>
                  </td>
                </tr>
              </tbody>
            </VDataTable>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12">
        <v-card>
          <v-card-title class="bg-grey d-flex justify-space-between align-center">
            <h1 class="mb-0 text-h4 py-2">Destination Details</h1>
            <VBtn color="primary" variant="elevated" :to="`/agent/customers/documents/${customerDetails?.id}`" target="_blank">Customer Documents</VBtn>
          </v-card-title>
          <v-card-text class="px-2 py-2">
            <VDataTable hide-default-footer class="border">
              <tbody>
                <tr>
                  <td class="bg-grey">
                    <p class="fs-16 text-truncate font-weight-bold text-color mb-0">
                      Cust. ID
                    </p>
                  </td>
                  <td>
                    <p class="text-grey mb-0 fs-16 font-weight-medium">
                      {{ customerDetails?.id }}
                    </p>
                  </td>
                  <td class="bg-grey">
                    <p class="fs-16 text-truncate font-weight-bold text-color mb-0">
                      ID Number
                    </p>
                  </td>
                  <td>
                    <p class="text-grey mb-0 fs-16 font-weight-medium">
                      {{ transactionsDetails?.customer_documents[0].id }}

                    </p>
                  </td>
                  <td class="bg-grey">
                    <p class="fs-16 text-truncate font-weight-bold text-color mb-0">
                      ID Type
                    </p>
                  </td>
                  <td>
                    <p class="text-grey mb-0 fs-16 font-weight-medium">
                      {{ transactionsDetails?.customer_documents[0].type }}
                    </p>
                  </td>
                </tr>
                <tr>
                  <td class="bg-grey">
                    <p class="fs-16 text-truncate font-weight-bold text-color mb-0">
                      First Name
                    </p>
                  </td>
                  <td>
                    <p class="text-grey mb-0 fs-16 font-weight-medium">
                      {{ customerDetails?.user?.first_name }}
                    </p>
                  </td>
                  <td class="bg-grey">
                    <p class="fs-16 text-truncate font-weight-bold text-color mb-0">
                      Last Name
                    </p>
                  </td>
                  <td>
                    <p class="text-grey mb-0 fs-16 font-weight-medium">
                      {{ customerDetails?.user?.last_name || '----' }}
                    </p>
                  </td>
                  <td class="bg-grey">
                    <p class="fs-16 text-truncate font-weight-bold text-color mb-0">
                      Gender
                    </p>
                  </td>
                  <td>
                    <p class="text-grey mb-0 fs-16 font-weight-medium text-capitalize">
                      {{ customerDetails?.customer_detail?.gender }}
                    </p>
                  </td>
                </tr>
                <tr>
                  <td class="bg-grey">
                    <p class="fs-16 text-truncate font-weight-bold text-color mb-0">
                      Del. Date
                    </p>
                  </td>
                  <td>
                    <p class="text-grey mb-0 fs-16 font-weight-medium">
                      12 Jan 2000
                    </p>
                  </td>
                  <td class="bg-grey">
                    <p class="fs-16 text-truncate font-weight-bold text-color mb-0">
                      Exp. Date
                    </p>
                  </td>
                  <td>
                    <p class="text-grey mb-0 fs-16 font-weight-medium">
                      04 Dec 2025
                    </p>
                  </td>
                  <td class="bg-grey">
                    <p class="fs-16 text-truncate font-weight-bold text-color mb-0">
                      Email
                    </p>
                  </td>
                  <td>
                    <p class="text-grey mb-0 fs-16 font-weight-medium">
                      {{ customerDetails?.user?.email }}
                    </p>
                  </td>
                </tr>
                <tr>
                  <td class="bg-grey">
                    <p class="fs-16 text-truncate font-weight-bold text-color mb-0">
                      Del. Country
                    </p>
                  </td>
                  <td>
                    <p class="text-grey mb-0 fs-16 font-weight-medium">
                      {{ customerDetails?.sending_country?.name }}
                    </p>
                  </td>
                  <td class="bg-grey">
                    <p class="fs-16 text-truncate font-weight-bold text-color mb-0">
                      Country
                    </p>
                  </td>
                  <td>
                    <p class="text-grey mb-0 fs-16 font-weight-medium">
                      {{ customerDetails?.sending_country?.name }}
                    </p>
                  </td>
                  <td class="bg-grey">
                    <p class="fs-16 text-truncate font-weight-bold text-color mb-0">
                      Occupation
                    </p>
                  </td>
                  <td>
                    <p class="text-grey mb-0 fs-16 font-weight-medium">
                      {{ customerDetails?.customer_detail?.occupation }}
                    </p>
                  </td>
                </tr>
                <tr>
                  <td class="bg-grey">
                    <p class="fs-16 text-truncate font-weight-bold text-color mb-0">
                      City
                    </p>
                  </td>
                  <td>
                    <p class="text-grey mb-0 fs-16 font-weight-medium">
                      {{ customerDetails?.customer_detail?.city || '----' }}
                    </p>
                  </td>
                  <td class="bg-grey">
                    <p class="fs-16 text-truncate font-weight-bold text-color mb-0">
                      Address
                    </p>
                  </td>
                  <td>
                    <p class="text-grey mb-0 fs-16 font-weight-medium">
                      {{ customerDetails?.customer_detail?.address }}
                      {{ customerDetails?.customer_detail?.street_address }}
                      {{ customerDetails?.customer_detail?.postal_code }}
                    </p>
                  </td>
                </tr>
              </tbody>
            </VDataTable>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12">
        <v-card>
          <v-card-title class="bg-grey">
            <h1 class="mb-0 text-h4 py-2">Beneficiary Information</h1>
          </v-card-title>
          <v-card-text class="px-2 py-2">
            <VDataTable hide-default-footer class="border">
              <tbody>
                <tr>
                  <td class="bg-grey">
                    <p class="fs-16 text-truncate font-weight-bold text-color mb-0">
                      Bene. ID
                    </p>
                  </td>
                  <td>
                    <p class="text-grey mb-0 fs-16 font-weight-medium">
                      {{ transactionInfo?.beneficiary?.id }}
                    </p>
                  </td>
                  <td class="bg-grey">
                    <p class="fs-16 text-truncate font-weight-bold text-color mb-0">
                      First Name
                    </p>
                  </td>
                  <td>
                    <p class="text-grey mb-0 fs-16 font-weight-medium">
                      {{ transactionInfo?.beneficiary_first_name }}
                    </p>
                  </td>
                  <td class="bg-grey">
                    <p class="fs-16 text-truncate font-weight-bold text-color mb-0">
                      Last Name
                    </p>
                  </td>
                  <td>
                    <p class="text-grey mb-0 fs-16 font-weight-medium">
                      {{ transactionInfo?.beneficiary_last_name }}
                    </p>
                  </td>
                </tr>
                <tr>
                  <td class="bg-grey">
                    <p class="fs-16 text-truncate font-weight-bold text-color mb-0">
                      Gender
                    </p>
                  </td>
                  <td>
                    <p class="text-grey mb-0 fs-16 font-weight-medium text-capitalize">
                      {{ transactionInfo?.beneficiary?.gender }}
                    </p>
                  </td>
                  <td class="bg-grey">
                    <p class="fs-16 text-truncate font-weight-bold text-color mb-0">
                      Phone
                    </p>
                  </td>
                  <td>
                    <p class="text-grey mb-0 fs-16 font-weight-medium">
                      {{ transactionInfo?.beneficiary_phone }}
                    </p>
                  </td>
                  <td class="bg-grey">
                    <p class="fs-16 text-truncate font-weight-bold text-color mb-0">
                      Email
                    </p>
                  </td>
                  <td>
                    <p class="text-grey mb-0 fs-16 font-weight-medium">
                      {{ transactionInfo?.beneficiary?.email || '-----' }}
                    </p>
                  </td>
                </tr>
                <tr>
                  <td class="bg-grey">
                    <p class="fs-16 text-truncate font-weight-bold text-color mb-0">
                      Country
                    </p>
                  </td>
                  <td>
                    <p class="text-grey mb-0 fs-16 font-weight-medium">
                      {{ transactionInfo?.beneficiary?.country }}
                    </p>
                  </td>
                  <td class="bg-grey">
                    <p class="fs-16 text-truncate font-weight-bold text-color mb-0">
                      Sending Reason
                    </p>
                  </td>
                  <td>
                    <p class="text-grey mb-0 fs-16 font-weight-medium">
                      {{ transactionInfo?.sending_reason }}
                    </p>
                  </td>
                  <td class="bg-grey">
                    <p class="fs-16 text-truncate font-weight-bold text-color mb-0">
                      Message
                    </p>
                  </td>
                  <td>
                    <p class="text-grey mb-0 fs-16 font-weight-medium">
                      2
                    </p>
                  </td>
                </tr>
              </tbody>
            </VDataTable>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
  <paymentRemarks :transaction_id="route.params.id"/>
  <!-- <customerDocuments :isView="true" /> -->
</template>
