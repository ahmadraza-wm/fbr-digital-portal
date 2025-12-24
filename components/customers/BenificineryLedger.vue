<script setup>
import { defineProps } from "vue";

const getStatusColor = (status) => {
  switch (status) {
    case "Paid":
      return "success";
    case "Incomplete":
      return "warning";
    case "Canceled":
      return "error";
    default:
      return "default";
  }
};

const props = defineProps({
  ledger: {
    type: Array,
    default: () => [],
  },
});
</script>
<template>
  <v-row>
    <v-col cols="12">
      <v-card-title style="background-color: lightgray">
        <h4 class="text-h4 py-3">Beneficiary Ledger</h4>
      </v-card-title>
    </v-col>
  </v-row>
  <v-card-text class="pb-10 px-0">
    <v-table class="text-no-wrap" :height="ledger.length > 5 ? '310px' : '100%'" fixed-header>
      <thead>
        <tr>
          <th>Date and Pin</th>
          <th>Bene Name (1)</th>
          <th>Bene Relation</th>
          <th>Contact #</th>
          <th>Sending Method</th>
          <th>Sending Purpose</th>
          <th>Sending Amount</th>
          <th>Receiving Amount</th>
          <th>Status</th>
        </tr>
      </thead>

      <tbody>
        <tr v-if="ledger.length === 0">
          <td colspan="5" class="text-center">No records found</td>
        </tr>
        <tr v-for="item in ledger" :key="item.id">
          <td>
            {{ item.date }}
            <br />
            <li style="color: green">
              <span class="text-decoration-underline">{{
                item.transaction_code
              }}</span>
            </li>
          </td>
          <td>{{ item.beneficiary_first_name }}</td>
          <td>{{ item.bene_relation }}</td>
          <td>{{ item.bene_phone }}</td>
          <td>
            {{ item.sending_method }}
            <br />
            <span v-if="item.sending_method === 'card'" class="fs-13"
              >(Debit/Credit)</span
            >
          </td>
          <td>{{ item.sending_reason }}</td>
          <td>{{ item.sending_amount }}</td>
          <td>{{ item.receiving_amount }}</td>
          <td>
            <VChip :color="getStatusColor(item.status)">
              {{ item.status }}
            </VChip>
          </td>
        </tr>
      </tbody>
    </v-table>
  </v-card-text>
</template>
