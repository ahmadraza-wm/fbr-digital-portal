<script setup>
const props = defineProps({
  currencies: {
    type: Object,
    required: true,
  },
});
</script>

<template>
  <!-- Country Wise Transactions (Sending) -->
  <v-card class="mt-5">
    <v-card-title class="d-flex align-center" style="background-color: #dcf0f0">
      <h4 class="text-h5 py-3">Country Wise Transactions (Sending)</h4>
    </v-card-title>
    <v-card-text class="px-0 pb-0">
      <v-row>
        <!-- Sending Countries List -->
        <v-col cols="2" class="pr-0">
          <v-table style="background-color: #f1f1f1">
            <thead>
              <tr>
                <th>Country</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(row, idx) in currencies.sending_countries" :key="'send-' + idx">
                <td>{{ row.country }}</td>
              </tr>
            </tbody>
          </v-table>
        </v-col>

        <!-- Sending Details -->
        <v-col cols="10" class="px-0">
          <v-table>
            <thead>
              <tr>
                <th>No. of trans</th>
                <th>Total Cust</th>
                <th>Currency</th>
                <th>Trans Volume</th>
                <th>Agent Fee</th>
                <th>Company Fee</th>
                <th>ATS (Sending)</th>
                <th>ATS (Receiving)</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(row, idx) in currencies.sending_countries"
                :key="'send-det-' + idx"
              >
                <td>{{ row.no_of_trans }}</td>
                <td>{{ row.total_customers }}</td>
                <td>{{ row.currency }}</td>
                <td>{{ row.trans_volume }}</td>
                <td>{{ row.agent_fee }}</td>
                <td>{{ row.company_fee }}</td>
                <td>{{ row.ats_sending }}</td>
                <td>{{ row.ats_receiving }}</td>
              </tr>
            </tbody>
          </v-table>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>

  <!-- Country Wise Transactions (Receiving) -->
  <v-card class="mt-5">
    <v-card-title class="d-flex align-center" style="background-color: #dcf0f0">
      <h4 class="text-h5 py-3">Country Wise Transactions (Receiving)</h4>
    </v-card-title>
    <v-card-text class="px-0 pb-0">
      <v-row>
        <!-- Receiving Countries List -->
        <v-col cols="2" class="pr-0">
          <v-table style="background-color: #f1f1f1">
            <thead>
              <tr>
                <th>Country</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(row, idx) in currencies.receiving_countries"
                :key="'recv-' + idx"
              >
                <td>{{ row.country }}</td>
              </tr>
            </tbody>
          </v-table>
        </v-col>

        <!-- Receiving Details -->
        <v-col cols="10" class="px-0">
          <v-table>
            <thead>
              <tr>
                <th>No. of trans</th>
                <th>Total Cust</th>
                <th>Currency</th>
                <th>Trans Volume</th>
                <th>Agent Fee</th>
                <th>Company Fee</th>
                <th>ATS (Sending)</th>
                <th>ATS (Receiving)</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(row, idx) in currencies.receiving_countries"
                :key="'recv-det-' + idx"
              >
                <td>{{ row.no_of_trans }}</td>
                <td>{{ row.total_customers }}</td>
                <td>{{ row.currency }}</td>
                <td>{{ row.trans_volume }}</td>
                <td>{{ row.agent_fee }}</td>
                <td>{{ row.company_fee }}</td>
                <td>{{ row.ats_sending }}</td>
                <td>{{ row.ats_receiving }}</td>
              </tr>
            </tbody>
          </v-table>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>
