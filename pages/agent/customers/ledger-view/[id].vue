<script setup>
definePageMeta({
  middleware: "auth",
  permission: "agent.customer.ledger.details"
})
const permissionStore = usePermissionStore()
import { onMounted } from "vue";
import { useCustomer } from "@/composables/agentPortal/useCustomers";
import { useRoute, useRouter } from "vue-router";
const route = useRoute();
const { fetchCustomerLedger, cusLedger, fetchCustomerById, form } = useCustomer();
const headers = [
  { title: "#", key: "sr_no" },
  { title: "Date", key: "date" },
  { title: "Beneficiary Name", key: "beneficiary" },
  { title: "Payment #", key: "transaction_code" },
  { title: "Status", key: "status" },
  { title: "FC Amount", key: "sending_amount" },
  { title: "LC Amount", key: "receiving_amount" },
  { title: "Action", key: "action" },
];

const resolveStatusVariant = (status_value) => {
  const variants = {
    incomplete: {
      color: "#FFFFFF",
      background: "#FF5733", // Bright Red
      text: "INCOMPLETE",
    },
    awaiting_funds: {
      color: "#FFFFFF",
      background: "#FF9800", // Orange
      text: "AWAITING FUNDS",
    },
    verifying_transfer: {
      color: "#FFFFFF",
      background: "#4CAF50", // Green
      text: "VERIFYING TRANSFER",
    },
    compliance_review: {
      color: "#FFFFFF",
      background: "#673AB7", // Purple
      text: "COMPLIANCE REVIEW",
    },
    compliance_held: {
      color: "#FFFFFF",
      background: "#009688", // Teal
      text: "COMPLIANCE HELD",
    },
    processing_transfer: {
      color: "#FFFFFF",
      background: "#2196F3", // Blue
      text: "PROCESSING TRANSFER",
    },
    available_for_collection: {
      color: "#FFFFFF",
      background: "#9C27B0", // Deep Purple
      text: "AVAILABLE FOR COLLECTION",
    },
    send_to_partner: {
      color: "#FFFFFF",
      background: "#795548", // Brown
      text: "SEND TO PARTNER",
    },
    paid: {
      color: "#FFFFFF",
      background: "#4CAF50", // Green
      text: "PAID",
    },
    canceled: {
      color: "#FFFFFF",
      background: "#F44336", // Red
      text: "CANCELED",
    },
    canceling: {
      color: "#FFFFFF",
      background: "#FF5722", // Deep Orange
      text: "CANCELING",
    },
    refunded: {
      color: "#FFFFFF",
      background: "#607D8B", // Blue Grey
      text: "REFUNDED",
    },
    reward_granted: {
      color: "#FFFFFF",
      background: "#198754", // Blue Grey
      text: "Reward Granted",
    },
    pending: {
      color: "#FFFFFF",
      background: "#FF5733",
      text: "Pending",
    },
  };

  return (
    variants[status_value] || {
      color: "#757575", // Default color (gray)
      background: "#E0E0E0", // Default background (light gray)
      text: "UNKNOWN",
    }
  );
};


const totalFcAmount = computed(() => {
  return (cusLedger.value || []).reduce((sum, row) => {
    const num = parseFloat(
      String(row?.sending_amount || 0).replace(/,/g, '')
    )
    return sum + (isNaN(num) ? 0 : num)
  }, 0)
})


const totalLcAmount = computed(() => {
  return (cusLedger.value || []).reduce((sum, row) => {
    const num = parseFloat(
      String(row?.receiving_amount || 0).replace(/,/g, '')
    )
    return sum + (isNaN(num) ? 0 : num)
  }, 0)
})

onMounted(() => {
  fetchCustomerById(route.params.id);
  fetchCustomerLedger(route.params.id);
});

</script>

<template>
  <v-card>
    <v-row>
      <v-col cols="12">
        <v-card-title class="border-b-sm" style="background-color: lightgrey;">
          <h4 class="text-h5 py-3">Customer Ledger</h4>
        </v-card-title>
      </v-col>
    </v-row>
    <v-card-text class="border-b-sm d-flex align-center gap-1 text-capitalize">
      <VIcon size="20" icon="tabler-user-filled" />
      <h3>{{ form?.first_name }} Payment Ledger</h3>
    </v-card-text>
    <VCardText class="d-flex flex-wrap gap-4 justify-space-between mt-5 pb-2">
      <div class="me-3 d-flex gap-3">
        <ItemsPerPageSelector v-model="itemsPerPage" @update:model-value="updateItemsPerPage" />
      </div>
    </VCardText>
    <v-data-table :headers="headers" :items="cusLedger" item-key="name" hide-default-footer
      class="border-t-sm border-b-sm">
      <template #item.beneficiary="{ item }">
        <div class="text-wrap text-capitalize">{{ item.beneficiary?.name }}</div>
      </template>
      <template #item.status="{ item }">
        <div>
          <VChip :style="{
            ...resolveStatusVariant(item.status_value),
            fontSize: '10px',
            marginTop: '2px',
          }" class="font-weight-light p-1" size="small">
            {{ resolveStatusVariant(item.status_value).text }}
          </VChip>
        </div>
      </template>
      <template #item.sending_amount="{ item }">
        <div class="text-grey">
          {{ item.sending_amount }} {{ item.sending_currency }} 
        </div>
      </template>
      <template #item.receiving_amount="{ item }">
        <div class="text-grey">
          {{ item.receiving_amount}} {{ item.receiving_currency }} 
        </div>
      </template>
      <template #tfoot>
        <tr>
          <td colspan="5" class="border-t-sm"></td>
          <td class="pl-2 fs-16 py-2 text-dark font-weight-bold border-t-sm">
            {{ totalFcAmount }}
          </td>
          <td class="pl-2 fs-16 py-2 text-dark font-weight-bold border-t-sm" colspan="2">
            {{ totalLcAmount }}
          </td>
        </tr>
      </template>

      <template #item.action="{ item }">
        <div class="d-flex gap-2">
          <VBtn color="primary" type="button" :to="`/agent/customers/ledger-view/${item.id}`" target="_blank"
            variant="elevated" size="small" disabled="">
            Download
          </VBtn>
        </div>
      </template>
    </v-data-table>
  </v-card>
</template>
