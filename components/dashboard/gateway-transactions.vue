<script setup>
import { computed } from 'vue'

const props = defineProps({
  gateway_wise: {
    type: Object,
    required: true,
  },
})

const totalCount = computed(() => {
  return props.gateway_wise.gateway_wise_transactions?.reduce(
    (sum, item) => sum + Number(item.count), 0
  ) || 0
})

const totalVolume = computed(() => {
  return props.gateway_wise.gateway_wise_transactions?.reduce(
    (sum, item) => sum + parseFloat(item.volume), 0
  ).toFixed(2) || '0.00'
})
</script>

<template>
  <v-card class="mt-5">
    <v-card-title class="d-flex align-center" style="background-color: #d5d1fb;">
      <h4 class="text-h5 py-3">Gateway Wise Transactions</h4>
    </v-card-title>

    <v-card-text class="px-0 pb-0">
      <v-table>
        <thead>
          <tr>
            <th>Gateway</th>
            <th>Count</th>
            <th>Volume</th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="(item, index) in gateway_wise.gateway_wise_transactions" :key="index">
            <td class="text-wrap">{{ item.gateway }}</td>
            <td>{{ item.count }}</td>
            <td>{{ item.volume }} {{item.currency}}</td>
          </tr>
        </tbody>

        <tfoot>
          <tr>
            <th>Total</th>
            <th>{{ totalCount }}</th>
            <th>{{ totalVolume }}</th>
          </tr>
        </tfoot>
      </v-table>
    </v-card-text>
  </v-card>
</template>
