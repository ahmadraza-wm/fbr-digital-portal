<script setup>
import { computed } from "vue";

const props = defineProps({
  agents: {
    type: Object,
    default: () => ({}),
  },
});

const uniqueAgents = computed(() => {
  const names = new Set();
  Object.values(props.agents).forEach((transactions) => {
    transactions.forEach((t) => {
      if (t.agent) names.add(t.agent);
    });
  });
  return Array.from(names);
});

const normalizedData = computed(() => {
  const result = {};

  for (const [currency, transactions] of Object.entries(props.agents)) {
    result[currency] = uniqueAgents.value.map((agentName) => {
      const record =
        transactions.find((t) => t.agent === agentName) || {
          agent: agentName,
          no_of_trans: 0,
          trans_volume: 0,
          agent_fee: 0,
          company_fee: 0,
          ats: 0,
        };
      return {
        agent: agentName,
        no_of_trans: Number(record.no_of_trans || 0),
        trans_volume: Number(record.trans_volume || 0),
        agent_fee: Number(record.agent_fee || 0),
        company_fee: Number(record.company_fee || 0),
        ats: Number(record.ats || 0),
      };
    });
  }

  return result;
});
</script>

<template>
  <v-card class="mt-5">
    <v-card-title>
      <h4 class="text-h5 py-3">Agent Wise Transactions</h4>
    </v-card-title>

    <v-card-text>
      <v-row>
        <!-- Left: unique agents -->
        <v-col cols="12" sm="3" md="2">
          <v-table>
            <thead>
              <tr><th>Currency</th></tr>
            </thead>
            <tbody>
             <tr><th>--------</th></tr>
              <tr v-for="(agent, index) in uniqueAgents" :key="index">
                <td>{{ agent }}</td>
              </tr>
            </tbody>
          </v-table>
        </v-col>

        <!-- Right: currency tables -->
        <v-col cols="12" sm="8" md="10" style="overflow-y: auto; flex-wrap: wrap;">
          <v-row>
            <v-col
              v-for="(transactions, currency) in normalizedData"
              :key="currency"
             
            >
              <v-table>
                <thead>
                  <tr style="background-color: #ffedbc">
                    <th colspan="6">{{ currency }}</th>
                  </tr>
                  <tr>
                    <th>No. of trans</th>
                    <th>Trans Volume</th>
                    <th>Agent Fee</th>
                    <th>Company Fee</th>
                    <th>ATS</th>
                  </tr>
                </thead>

                <tbody>
                  <tr v-for="(t, index) in transactions" :key="index">
                    <td>{{ t.no_of_trans }}</td>
                    <td>{{ t.trans_volume }}</td>
                    <td>{{ t.agent_fee }}</td>
                    <td>{{ t.company_fee }}</td>
                    <td>{{ t.ats }}</td>
                  </tr>
                </tbody>

                <tfoot>
                  <tr>
                    <th>{{ transactions.reduce((s, t) => s + t.no_of_trans, 0) }}</th>
                    <th>{{ transactions.reduce((s, t) => s + t.trans_volume, 0).toFixed(2) }}</th>
                    <th>{{ transactions.reduce((s, t) => s + t.agent_fee, 0).toFixed(2) }}</th>
                    <th>{{ transactions.reduce((s, t) => s + t.company_fee, 0).toFixed(2) }}</th>
                    <th>{{ transactions.reduce((s, t) => s + t.ats, 0).toFixed(2) }}</th>
                  </tr>
                </tfoot>
              </v-table>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>
