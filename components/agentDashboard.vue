<script setup>
// definePageMeta({
//   middleware: "auth",
//   permission: ""
// })
// const permissionStore = usePermissionStore()
import { ref, onMounted,onBeforeMount } from "vue";
import { useNuxtApp } from "#app";
import { useAgentDashboard } from "@/composables/agentPortal/useDashboard";
const { $axios } = useNuxtApp();
const {fetchDashBoardStats, dashboardStats,getBanners,banners} = useAgentDashboard();
onMounted(async()=>{
  await getBanners();
  await fetchDashBoardStats();
});
</script>

<template>
  <v-row>
    <v-col cols="12" md="8">
      <v-card>
        <v-card-title class="mb-4 d-flex align-center" style="background-color: lightgrey;">
          <h4 class="text-h4 py-2 px-2">Dashboard</h4>
        </v-card-title>
        <v-card-text>
          <v-carousel height="400" show-arrows="hover" cycle hide-delimiter-background>
            <v-carousel-item v-for="(banner, i) in banners" :key="i">
              <v-img :src="banner.image" height="100%" cover></v-img>
            </v-carousel-item>
          </v-carousel>
        </v-card-text>
      </v-card>
      <v-row class="px-2 py-3">
        <v-col cols="12 px-1" lg="6">
          <v-card>
            <v-card-title class="d-flex align-center" style="background-color: lightgrey;">
              <h4 class="text-h4 py-2 px-2">Stats</h4>
            </v-card-title>
          </v-card>
          <v-container>
            <v-row>
              <v-col cols="6 px-0 py-0 mb-1">
                <div class="bg-white px-2 py-2 mr-1 rounded">
                  <p>Current Balance</p>
                  <h2>{{dashboardStats.current_balance}}</h2>
                </div>
              </v-col>
              <v-col cols="6 px-0 py-0 mb-1">
                <div class="bg-white px-2 py-2 rounded">
                  <p>Pending Deposits</p>
                  <h2>{{dashboardStats.pending_deposits}}</h2>
                </div>
              </v-col>
              <v-col cols="6 px-0 py-0 mb-1">
                <div class="bg-white px-2 py-2 mr-1 rounded">
                  <p>Today's Transactions</p>
                  <h2>{{dashboardStats.today_transactions}}</h2>
                </div>
              </v-col>
              <v-col cols="6 px-0 py-0 mb-1">
                <div class="bg-white px-2 py-2 rounded">
                  <p>Hold Transactions</p>
                  <h2>{{dashboardStats.hold_transactions || 0}}</h2>
                </div>
              </v-col>
              <v-col cols="12 px-0 py-0 mb-1">
                <div class="bg-white px-4 py-5 rounded d-flex align-center justify-space-between">
                    <VBtn variant="text" color="error" to="/agent/complaints">
                      <VIcon size="30" icon="tabler-alert-triangle-filled" />
                      <h2 class="pl-2 mb-0 text-error ">Complaints</h2>
                    </VBtn>
                  <h2 class="text-error">{{dashboardStats.complaints}}</h2>
                </div>
              </v-col>
            </v-row>
          </v-container>
        </v-col>
        <v-col cols="12 px-1" lg="6">
          <v-card>
            <v-card-title class="d-flex align-center" style="background-color: lightgrey;">
              <h4 class="text-h4 py-2 px-2">Payment Status (till now)</h4>
            </v-card-title>
            <v-card-text class="px-0 pb-0">
              <v-table>
                <tbody>
                  <tr>
                    <td class="bg-grey">Incomplete Payments</td>
                    <td>{{dashboardStats.incomplete_payments}}</td>
                  </tr>
                  <tr>
                    <td class="bg-grey">Pending Payments</td>
                    <td>{{dashboardStats.pending_payments}}</td>
                  </tr>
                  <tr>
                    <td class="bg-grey">Verifying Payments</td>
                    <td>{{dashboardStats.verifying_payments}}</td>
                  </tr>
                  <tr>
                    <td class="bg-grey">Processing Payments</td>
                    <td>{{dashboardStats.processing_payments}}</td>
                  </tr>
                  <tr>
                    <td class="bg-grey">Send to Partner Payments</td>
                    <td>{{dashboardStats.send_to_partner_payments}}</td>
                  </tr>
                  <tr>
                    <td class="bg-grey">Canceling Payments</td>
                    <td>{{dashboardStats.cancelling_payments}}</td>
                  </tr>
                </tbody>
              </v-table>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

    </v-col>

    <v-col cols="12" md="4">
      <v-card class="mb-3">
        <v-card-title class="mb-4 d-flex align-center" style="background-color: lightgrey;">
          <h4 class="text-h4 py-2 px-2">News</h4>
        </v-card-title>
        <v-card-text>
          <p class="text-error mb-0 text-center">Sorry! No News Found</p>
        </v-card-text>
      </v-card>
      <v-card>
        <v-card-title class="mb-4 d-flex align-center" style="background-color: lightgrey;">
          <h4 class="text-h4 py-2 px-2">Terms</h4>
        </v-card-title>
        <v-card-text>
          <h4 class="mb-0">Terms are described as following:</h4>
          <div class="d-flex align-center">
            <h4 class="mb-0">28 Feb, 2023</h4>
            <VBtn type="submit" variant="plain" color="primary" class="pl-2">Privacy Policy</VBtn>
          </div>
          <div class="d-flex align-center">
            <h4 class="mb-0">28 Feb, 2023</h4>
            <VBtn type="submit" variant="plain" color="primary" class="pl-2">Terms & Conditions</VBtn>
          </div>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>
