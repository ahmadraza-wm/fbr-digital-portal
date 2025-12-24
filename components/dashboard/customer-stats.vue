<script setup>
defineProps({
  summary: {
    type: Object,
    required: true,
  },
})
</script>

<template>
  <v-card>
    <v-card-title style="background-color: #ff9f434d;">
      <h4 class="text-h5 py-3">Customer Stats</h4>
    </v-card-title>
    <v-card-text class="px-0 pb-0">
      <v-table >
        <tbody>
          <tr>
            <td class="stats_td">Total Customers</td>
            <td>{{ summary.total_customers }}</td>
          </tr>
          <tr>
            <td class="stats_td">Total Active Customers</td>
            <td>{{ summary.total_active_customers }}</td>
          </tr>
          <tr>
            <td class="stats_td">Total Online Customers</td>
            <td>{{ summary.total_online_customers }}</td>
          </tr>
          <tr>
            <td class="stats_td">Total Active Online Customers</td>
            <td>{{ summary.total_active_online_customers }}</td>
          </tr>
          <tr>
            <td class="stats_td">Total Agent Customers</td>
            <td>{{ summary.total_agent_customers }}</td>
          </tr>
          <tr>
            <td class="stats_td">Total Active Agent Customers</td>
            <td>{{ summary.total_active_agent_customers }}</td>
          </tr>
          <tr>
            <td class="stats_td">Blocked</td>
            <td>{{ summary.blocked_customers }}</td>
          </tr>
          <tr>
            <td class="stats_td">Verified</td>
            <td>{{ summary.verified_customers }}</td>
          </tr>
          <tr>
            <td class="stats_td">Unverified</td>
            <td>{{ summary.unverified_customers }}</td>
          </tr>
          <tr>
            <td class="stats_td">New (Today)</td>
            <td>{{ summary.new_customers_today }}</td>
          </tr>
          <tr>
            <td class="stats_td">New (This Week)</td>
            <td>{{ summary.new_customers_this_week }}</td>
          </tr>
           <tr>
            <td class="stats_td">First Time Transfer</td>
            <td>{{ summary.new_customers_today }}</td>
          </tr>
          <tr>
            <td class="stats_td">Dormant Customers (60 Days)</td>
            <td>{{ summary.new_customers_this_week }}</td>
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
