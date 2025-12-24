<script setup>
defineProps({
  transactionDetails: Object,
});
</script>

<template>
  <template v-if="transactionDetails">
    <VCol class="border-b-sm px-4 mt-2" style="background-color: #fbfafa">
      <h4 class="text-h5 py-2">Payment Details</h4>
    </VCol>

    <v-card-text class="py-2 border-b-sm">
      <VRow>
        <VCol cols="3">
          <p class="fs-15 font-weight-medium text-color mb-1">Transfer Code</p>
          <p class="text-color1 mb-0 fs-15 font-weight-medium">
            {{ transactionDetails?.transaction_id || "---" }}
          </p>
        </VCol>
        <VCol cols="3">
          <p class="fs-15 font-weight-medium text-color mb-1">Beneficiary</p>
          <p class="text-color1 mb-0 fs-15 font-weight-medium">
            {{ transactionDetails?.beneficiary_name || "---" }}
          </p>
        </VCol>
        <VCol cols="3">
          <p class="fs-15 font-weight-medium text-color mb-1">Sender</p>
          <p class="text-color1 mb-0 fs-15 font-weight-medium">
            {{ transactionDetails?.customer_name || "---" }}
          </p>
        </VCol>
        <VCol cols="3">
          <p class="fs-15 font-weight-medium text-color mb-1">Sending Country</p>
          <p class="text-color1 mb-0 fs-15 font-weight-medium">
            {{ transactionDetails?.sending_country || "---" }}
          </p>
        </VCol>
      </VRow>
    </v-card-text>

    <v-card-text class="py-2 mt-4 border-b-sm">
      <VRow>
        <VCol cols="3">
          <p class="fs-15 font-weight-medium text-color mb-1">Receiving Country</p>
          <p class="text-color1 mb-0 fs-15 font-weight-medium">
            {{ transactionDetails?.receiving_country || "---" }}
          </p>
        </VCol>
        <VCol cols="3">
          <p class="fs-15 font-weight-medium text-color mb-1">Sending Amount</p>
          <p class="text-color1 mb-0 fs-15 font-weight-medium">
            {{ transactionDetails?.sending_currency || "---" }}
            {{ transactionDetails?.sending_amount || "0" }}
          </p>
        </VCol>
        <VCol cols="3">
          <p class="fs-15 font-weight-medium text-color mb-1">Receiving Amount</p>
          <p class="text-color1 mb-0 fs-15 font-weight-medium">
            {{ transactionDetails?.receiving_currency || "---" }}
            {{ transactionDetails?.receiving_amount || "0" }}
          </p>
        </VCol>
        <VCol cols="3">
          <p class="fs-15 font-weight-medium text-color mb-1">Agent Rate</p>
          <p class="text-color1 mb-0 fs-15 font-weight-medium">
            {{ transactionDetails?.agent_rate || "---" }}
          </p>
        </VCol>
      </VRow>
    </v-card-text>

    <v-card-text class="py-2 mt-4">
      <VRow>
        <VCol cols="3">
          <p class="fs-15 font-weight-medium text-color mb-1">Customer Rate</p>
          <p class="text-color1 mb-0 fs-15 font-weight-medium">
            {{ transactionDetails?.customer_rate || "---" }}
          </p>
        </VCol>
        <VCol cols="3">
          <p class="fs-15 font-weight-medium text-color mb-1">Status</p>
          <VChip
            :color="transactionDetails?.status_value === 'processing' ? 'success' : 'grey'"
            size="small"
          >
            {{ transactionDetails?.status || "---" }}
          </VChip>
        </VCol>
        <VCol cols="3">
          <p class="fs-15 font-weight-medium text-color mb-1">Partner Code</p>
          <p class="text-color1 mb-0 fs-15 font-weight-medium">
            {{ transactionDetails?.id || "---" }}
          </p>
        </VCol>
        <VCol cols="3">
          <p class="fs-15 font-weight-medium text-color mb-1">Partner Name</p>
          <p class="text-color1 mb-0 fs-15 font-weight-medium">
            {{ transactionDetails?.partner_name || "---" }}
          </p>
        </VCol>
      </VRow>
    </v-card-text>

    <v-card-text class="px-0">
      <VCol class="border-b-sm px-4 mt-2" style="background-color: #fbfafa">
        <h4 class="text-h5 py-2">Partner Status</h4>
      </VCol>
      <VRow class="border-b-sm px-5 pt-3">
        <VCol cols="3">
          <p class="fs-15 font-weight-medium text-color mb-1">Status</p>
          <p class="text-color1 mb-0 fs-15 font-weight-medium">
            {{ transactionDetails?.status || "---" }}
          </p>
        </VCol>
        <VCol cols="6">
          <p class="fs-15 font-weight-medium text-color mb-1">Description</p>
          <p class="text-color1 mb-0 fs-15 font-weight-medium">
            {{ transactionDetails?.sanction_description || "---" }}
          </p>
        </VCol>
      </VRow>
    </v-card-text>
  </template>
</template>
