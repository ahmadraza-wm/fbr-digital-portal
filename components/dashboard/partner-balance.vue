<script setup>
const props = defineProps({
  ledger: {
    type: Object,
    required: true,
  },
});
function formatBalance(balance) {
  // Add commas & parentheses if negative
  const num = parseFloat(balance.replace(/,/g, ""));
  if (isNaN(num)) return balance;
  const abs = Math.abs(num).toLocaleString();
  return num < 0 ? `(${abs})` : abs;
}
</script>

<template>
  <v-card class="mt-0">
    <v-card-title
      class="d-flex align-center"
      style="background-color: #ff9f434d"
    >
      <h4 class="text-h5 py-3">Partner Balance</h4>
    </v-card-title>

    <v-card-text class="px-0 pb-0">
      <v-table height="651px">
        <tbody>
          <tr v-for="(row, index) in ledger.partner_ledgers" :key="index">
            <td class="stats_td">{{ row.partner }}</td>
            <td
              :class="
                parseFloat(row.balance.replace(/,/g, '')) < 0
                  ? 'text-error'
                  : 'text-success'
              "
            >
              {{ formatBalance(row.balance) }}
            </td>
          </tr>
        </tbody>
      </v-table>
    </v-card-text>
  </v-card>
</template>

<style scoped>
.stats_td {
  background-color: #f1f1f1;
  font-weight: 600;
}
</style>
