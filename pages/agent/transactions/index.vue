<script setup>
definePageMeta({
  middleware: "auth",
  permission: "agent.transactions.index"
})
const permissionStore = usePermissionStore()
import { useAgentTransactions } from "@/composables/agentPortal/useTransctions";
import { onMounted, ref } from "vue";
const { fetchAgentTransactions, pagination, transactions, resolveStatusVariant } = useAgentTransactions();
const { pageNo, itemsPerPage, updateItemsPerPage, loadPage } = usePagination(
  fetchAgentTransactions,
  {
    initialPage: 1,
    initialPerPage: 50,
  }
);
const filters = ref({});
const headers = [
  { title: "#", key: "sr_no" },
  { title: "Date", key: "date" },
  { title: "Sender Info", key: "customer" },
  { title: "Beneficiary Info", key: "beneficiary" },
  { title: "Transfer Code", key: "transaction_code" },
  { title: "Sending Amount", key: "sending_amount" },
  { title: "Receiving Amount", key: "receiving_amount" },
  { title: "Action", key: "action" },
];

function handleFilter(payload) {
  // empty values remove (best practice)
  filters.value = Object.fromEntries(
    Object.entries(payload).filter(([_, v]) => v !== "" && v !== null)
  );

  // page reset
  pageNo.value = 1;

  fetchAgentTransactions({
    page: pageNo.value,
    per_page: itemsPerPage.value,
    ...filters.value,
  });
}


function handleReset() {
  filters.value = {};
  pageNo.value = 1;

  fetchAgentTransactions({
    page: pageNo.value,
    per_page: itemsPerPage.value,
  });
}


onMounted(() => {
  fetchAgentTransactions();
});
</script>

<template>
  <v-card>
    <v-row>
      <v-col cols="12">
        <v-card-title class="border-b-sm" style="background-color: lightgrey;">
          <h4 class="text-h5 py-3">Transactions List</h4>
        </v-card-title>
      </v-col>
    </v-row>
    <TransactionsFilter @filter="handleFilter" @reset="handleReset" />
    <VCardText class="d-flex flex-wrap gap-4 justify-space-between pb-2">
      <div class="me-3 d-flex gap-3">
        <itemPerPage v-model="itemsPerPage" @update:model-value="updateItemsPerPage" />
      </div>
    </VCardText>


    <VDatableComponent :headers="headers" :items="transactions" :loading="loading" :search="search"
      :pagination="pagination" :pageNo="pageNo" @update:pageNo="pageNo = $event" class="border-t-sm">
      <template #item.customer="{ item }">
        <div class="text-grey">{{ item.customer?.user?.name }}</div>
        <div class="text-wrap text-capitalize font-weight-bold">{{ item.customer?.phone_number }}</div>
      </template>
      <template #item.beneficiary="{ item }">
        <div class="text-grey">{{ item.beneficiary?.name }}</div>
        <div class="text-wrap text-capitalize font-weight-bold">{{ item.beneficiary?.phone_number }}</div>
      </template>
      <template #item.transaction_code="{ item }">
        <div class="text-grey">{{ item.transaction_code }}</div>
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
        <div class="text-grey">{{ item.sending_amount }}</div>
        <div class="text-wrap text-capitalize font-weight-bold">{{ item.sending_method }}</div>
      </template>
      <template #item.receiving_amount="{ item }">
        <div class="text-grey">{{ item.receiving_amount }}</div>
        <div class="text-wrap text-capitalize font-weight-bold">{{ item.receiving_method }}</div>
      </template>
      <template #item.action="{ item }">
        <div>
          <VBtn color="secondary" type="button" :to="`/agent/transactions/details/${item.id}`" target="_blank"
            variant="tonal" size="small">
            Detail
          </VBtn>
        </div>
      </template>
    </VDatableComponent>
  </v-card>
</template>
