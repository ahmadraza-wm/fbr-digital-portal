<script setup>
import { ref, onMounted, computed } from "vue";
import { useNuxtApp } from "#app";
import stat_1 from "@images/svg/stat1.svg?raw";
import stat_2 from "@images/svg/stat2.svg?raw";
import stat_3 from "@images/svg/stat3.svg?raw";
import stat_4 from "@images/svg/stat4.svg?raw";
import stat_5 from "@images/svg/stat5.svg?raw";

import transactionSummary from "@/components/dashboard/transaction-summary.vue";
import agentTransactions from "@/components/dashboard/agent-transactions.vue";
import countryWiseTrans from "@/components/dashboard/countryWise-transaction.vue";
import gatewayTransactions from "@/components/dashboard/gateway-transactions.vue";
import corridorTarget from "@/components/dashboard/corridor-target.vue";
import customerStats from "@/components/dashboard/customer-stats.vue";
import partnerBalance from "@/components/dashboard/partner-balance.vue";
import transferStats from "@/components/dashboard/transfer-stats.vue";

import { VIcon } from "vuetify/components";

const dashboardSummary = ref({});
const loading = ref(false);

const { $axios } = useNuxtApp();

const fetchDashboardSummary = async (fromDate, toDate, agent_id = "") => {
  loading.value = true;
  try {
    const { data } = await $axios.get(`/dashboard-summary`, {
      params: {
        start_date: fromDate,
        end_date: toDate,
        agent_id: agent_id,
      },
    });
    dashboardSummary.value = data;
    console.log("dashboard summary", dashboardSummary.value);
  } catch (err) {
    console.error(err);
  } finally {
    loading.value = false;
  }
};

// initial load with today’s date
onMounted(() => {
  const today = new Date();
  fetchDashboardSummary(today, today);
});

const onDateChange = ({ from, to }) => {
  fetchDashboardSummary(from, to);
};
const onHourlyFiltersChanged = ({ agent_id, from_date, to_date }) => {

  console.log('its working', from_date);
  fetchDashboardSummary(from_date, to_date, agent_id);
};

const statCards = computed(() => [
  {
    icon: stat_1,
    color: "#7c3aed",
    value: dashboardSummary.value.today_total_transactions ?? 0,
    label: "Today's Total Transaction",
  },
  {
    icon: stat_2,
    color: "#ff9f43",
    value: dashboardSummary.value.total_open_complaints ?? 0,
    label: "Total Open Complaints",
  },
  {
    icon: stat_3,
    color: "#ff4c51",
    value: dashboardSummary.value.total_online_customers ?? 0,
    label: "Total Online Customers",
  },
  {
    icon: stat_4,
    color: "#00bad1c2",
    value: dashboardSummary.value.total_unique_customers_today ?? 0,
    label: "Total Today Unique Customers",
  },
  {
    icon: stat_5,
    color: "#05d246",
    value: dashboardSummary.value.best_day_of_week ?? "-",
    label: "Best Day of the Week",
  },
]);
</script>

<template>
  <v-container fluid class="px-0 pt-0">
    <!-- Stats -->
    <v-row>
      <v-col v-for="(card, index) in statCards" :key="index">
        <v-card
          class="pa-4 d-flex align-center elevation-2 h-100"
          :style="`border-block-end: 3px solid ${card.color}`"
        >
          <v-row>
            <v-col cols="12 pb-2 d-flex align-center">
              <VIcon v-html="card.icon" size="40" />
              <span class="text-h4 font-weight-medium ps-3">
                {{ card.value }}
              </span>
            </v-col>
            <v-col cols="12 text-body-1 text-grey-darken-1 pt-1 pb-2">
              {{ card.label }}
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>
    <transactionSummary
      :statusWise="dashboardSummary.status_wise_transactions"
      @date-change="onDateChange"
    />
    <agentTransactions :agents="dashboardSummary.agent_wise_transactions" />
    <countryWiseTrans :currencies="dashboardSummary" />
    <v-row class="py-3">
      <v-col cols="12 py-0" lg="5">
        <gatewayTransactions :gateway_wise="dashboardSummary" />
      </v-col>
      <v-col cols="12 py-0" lg="7">
        <corridorTarget />
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" md="6">
        <customerStats :summary="dashboardSummary" />
      </v-col>
      <v-col cols="12" md="6">
        <partnerBalance :ledger="dashboardSummary" />
      </v-col>
    </v-row>
    <transferStats
      :hourlyData="dashboardSummary.last_24_hours_transactions"
  @filtersChanged="onHourlyFiltersChanged"
    />
  </v-container>
</template>
