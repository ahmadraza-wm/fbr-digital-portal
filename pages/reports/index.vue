<script setup>
definePageMeta({
  middleware: "auth",
  permission: "reports"
})
const permissionStore = usePermissionStore()
</script>
<template>
  <VRow>
    <!-- 1 -->
    <VCol cols="12" md="4">
      <v-card>
        <v-card-title class="border-b-sm" style="background-color: lightgrey;">
          <div class="d-flex align-center">
            <h4 class="text-h5 py-2">Customer Reports</h4>
          </div>
        </v-card-title>
        <VCardText class="px-6">
          <VRow class="pt-6 pb-3 px-2">
            <VCol cols="12 pb-0 pt-0 px-0 elevation-8 rounded-lg mt-3" v-if="permissionStore.hasPermission('customer.review.report')">
              <RouterLink to="/reports/customer/review" target="_blank">
                <div
                  class="elevation-8 py-2 px-4 rounded-t-lg d-flex align-center justify-space-between w-100 text-dark"
                  style="background-color: white; cursor: pointer;">
                  <span class="fs-15 text-grey-darken-2">Online Customer Review</span>
                  <VIcon icon="tabler-arrow-narrow-right" size="28" />
                </div>
              </RouterLink>
              <VCol cols="12 fs-14 py-2 text-justify">
                Review customers, including details, last transaction date, status, and transaction count.
              </VCol>
            </VCol>
            <VCol cols="12 pb-0 pt-0 px-0 elevation-8 rounded-lg mt-3" v-if="permissionStore.hasPermission('customer.leeds.report')">
              <RouterLink to="/reports/customer/leeds" target="_blank">
                <div
                  class="elevation-8 py-2 px-4 rounded-t-lg d-flex align-center justify-space-between w-100 text-dark"
                  style="background-color: white; cursor: pointer;">
                  <span class="fs-15 text-grey-darken-2">Customer Leeds</span>
                  <VIcon icon="tabler-arrow-narrow-right" size="28" />
                </div>
              </RouterLink>
              <VCol cols="12 fs-14 py-2 text-justify">
                Review the customer leads report, including details of potential customers and their engagement status.
              </VCol>
            </VCol>
            <VCol cols="112 pb-0 pt-0 px-0 elevation-8 rounded-lg mt-3" v-if="permissionStore.hasPermission('customer.journey.report')">
              <RouterLink to="/reports/customer/journey" target="_blank">
                <div
                  class="elevation-8 py-2 px-4 rounded-t-lg d-flex align-center justify-space-between w-100 text-dark"
                  style="background-color: white; cursor: pointer;">
                  <span class="fs-15 text-grey-darken-2">Customer Journey</span>
                  <VIcon icon="tabler-arrow-narrow-right" size="28" />
                </div>
              </RouterLink>
              <VCol cols="12 fs-14 py-2 text-justify">
                Track and analyze the customer journey, from engagement to conversion.
              </VCol>
            </VCol>
            <VCol cols="12 pb-0 pt-0 px-0 elevation-8 rounded-lg mt-3" v-if="permissionStore.hasPermission('customer.statement.report')"> 
              <RouterLink to="/reports/customer/statement" target="_blank">
                <div
                  class="elevation-8 py-2 px-4 rounded-t-lg d-flex align-center justify-space-between w-100 text-dark"
                  style="background-color: white; cursor: pointer;">
                  <span class="fs-15 text-grey-darken-2">Customer Statement</span>
                  <VIcon icon="tabler-arrow-narrow-right" size="28" />
                </div>
              </RouterLink>
              <VCol cols="12 fs-14 py-2 text-justify">
                Review the customer statement, including transactions, balances, and outstanding payments.
              </VCol>
            </VCol>
            <VCol cols="12 pb-0 pt-0 px-0 elevation-8 rounded-lg mt-3" v-if="permissionStore.hasPermission('beneficiary.ledger.report')">
              <RouterLink to="/reports/customer/beneficiary-ledger" target="_blank">
                <div
                  class="elevation-8 py-2 px-4 rounded-t-lg d-flex align-center justify-space-between w-100 text-dark"
                  style="background-color: white; cursor: pointer;">
                  <span class="fs-15 text-grey-darken-2">Beneficiary Ledger Report</span>
                  <VIcon icon="tabler-arrow-narrow-right" size="28" />
                </div>
              </RouterLink>
              <VCol cols="12 fs-14 py-2 text-justify">
                Review the beneficiary ledger, including transaction records and balances.
              </VCol>
            </VCol>
            <VCol cols="12 pb-0 pt-0 px-0 elevation-8 rounded-lg mt-3" v-if="permissionStore.hasPermission('customer.beneficiary.details.report')">
              <RouterLink to="/reports/customer/beneficiary-detail" target="_blank">
                <div
                  class="elevation-8 py-2 px-4 rounded-t-lg d-flex align-center justify-space-between w-100 text-dark"
                  style="background-color: white; cursor: pointer;">
                  <span class="fs-15 text-grey-darken-2">Customer Beneficiary Detail Report</span>
                  <VIcon icon="tabler-arrow-narrow-right" size="28" />
                </div>
              </RouterLink>
              <VCol cols="12 fs-14 py-2 text-justify">
                Review the customer beneficiary report, including beneficiary details and transactions.
              </VCol>
            </VCol>
            <VCol cols="12 pb-0 pt-0 px-0 elevation-8 rounded-lg mt-3">
              <RouterLink to="/reports/customer/referral-code" target="_blank">
                <div
                  class="elevation-8 py-2 px-4 rounded-t-lg d-flex align-center justify-space-between w-100 text-dark"
                  style="background-color: white; cursor: pointer;">
                  <span class="fs-15 text-grey-darken-2">Referral Code Detail Report</span>
                  <VIcon icon="tabler-arrow-narrow-right" size="28" />
                </div>
              </RouterLink>
              <VCol cols="12 fs-14 py-2 text-justify">
                Review the referral code report, including referrals, usage, and customer actions.
              </VCol>
            </VCol>
            <VCol cols="12 pb-0 pt-0 px-0 elevation-8 rounded-lg mt-3" v-if="permissionStore.hasPermission('customer.referral.report')">
              <RouterLink to="/reports/customer/referral-report" target="_blank">
                <div
                  class="elevation-8 py-2 px-4 rounded-t-lg d-flex align-center justify-space-between w-100 text-dark"
                  style="background-color: white; cursor: pointer;">
                  <span class="fs-15 text-grey-darken-2">Customer Referral Report</span>
                  <VIcon icon="tabler-arrow-narrow-right" size="28" />
                </div>
              </RouterLink>
              <VCol cols="12 fs-14 py-2 text-justify">
                Review referral data, including referrer and referral names, codes, transaction IDs, and status.
              </VCol>
            </VCol>
            <VCol cols="12 pb-0 pt-0 px-0 elevation-8 rounded-lg mt-3">
              <RouterLink to="/reports/customer/wallet-ledger" target="_blank">
                <div
                  class="elevation-8 py-2 px-4 rounded-t-lg d-flex align-center justify-space-between w-100 text-dark"
                  style="background-color: white; cursor: pointer;">
                  <span class="fs-15 text-grey-darken-2">Customer Wallet Ledger</span>
                  <VIcon icon="tabler-arrow-narrow-right" size="28" />
                </div>
              </RouterLink>
              <VCol cols="12 fs-14 py-2 text-justify">
                Review the customer wallet ledger, including transactions and balances.
              </VCol>
            </VCol>
            <VCol cols="12 pb-0 pt-0 px-0 elevation-8 rounded-lg mt-3" v-if="permissionStore.hasPermission('kyc.notes.report')">
              <RouterLink to="/reports/customer/kyc" target="_blank">
                <div
                  class="elevation-8 py-2 px-4 rounded-t-lg d-flex align-center justify-space-between w-100 text-dark"
                  style="background-color: white; cursor: pointer;">
                  <span class="fs-15 text-grey-darken-2">KYC Report</span>
                  <VIcon icon="tabler-arrow-narrow-right" size="28" />
                </div>
              </RouterLink>
              <VCol cols="12 fs-14 py-2 text-justify">
                Review the KYC report, including details of customer identity verification and compliance status.
              </VCol>
            </VCol>
          </VRow>
        </VCardText>
      </v-card>
    </VCol>
    <!-- 2 -->
    <VCol cols="12" md="4">
      <v-card>
        <v-card-title class="border-b-sm" style="background-color: lightgrey;">
          <div class="d-flex align-center">
            <h4 class="text-h5 py-2">Transfer Reports</h4>
          </div>
        </v-card-title>
        <VCardText class="px-6">
          <VRow class="pt-6 pb-3 px-2">
            <VCol cols="12 pb-0 pt-0 px-0 elevation-8 rounded-lg mt-3" v-if="permissionStore.hasPermission('paid.summary.report')">
              <RouterLink to="/reports/transfer/paid-summary" target="_blank">
                <div
                  class="elevation-8 py-2 px-4 rounded-t-lg d-flex align-center justify-space-between w-100 text-dark"
                  style="background-color: white; cursor: pointer;">
                  <span class="fs-15 text-grey-darken-2">Paid Summary Report</span>
                  <VIcon icon="tabler-arrow-narrow-right" size="28" />
                </div>
              </RouterLink>
              <VCol cols="12 fs-14 py-2 text-justify">
                Review the paid summary report, including details of completed transactions and payment statuses.
              </VCol>
            </VCol>
            <VCol cols="12 pb-0 pt-0 px-0 elevation-8 rounded-lg mt-3" v-if="permissionStore.hasPermission('status.tracker.report')">
              <RouterLink to="/reports/transfer/status-tracker" target="_blank">
                <div
                  class="elevation-8 py-2 px-4 rounded-t-lg d-flex align-center justify-space-between w-100 text-dark"
                  style="background-color: white; cursor: pointer;">
                  <span class="fs-15 text-grey-darken-2">Status Tracker</span>
                  <VIcon icon="tabler-arrow-narrow-right" size="28" />
                </div>
              </RouterLink>
              <VCol cols="12 fs-14 py-2 text-justify">
                Track the status of ongoing processes, including progress, updates, and completion stages.
              </VCol>
            </VCol>
            <VCol cols="12 pb-0 pt-0 px-0 elevation-8 rounded-lg mt-3">
              <RouterLink to="/reports/transfer/payment-gateway" target="_blank">
                <div
                  class="elevation-8 py-2 px-4 rounded-t-lg d-flex align-center justify-space-between w-100 text-dark"
                  style="background-color: white; cursor: pointer;">
                  <span class="fs-15 text-grey-darken-2">Payment Gateway Report</span>
                  <VIcon icon="tabler-arrow-narrow-right" size="28" />
                </div>
              </RouterLink>
              <VCol cols="12 fs-14 py-2 text-justify">
                Review the payment gateway report, including transaction details and performance.
              </VCol>
            </VCol>
            <VCol cols="12 pb-0 pt-0 px-0 elevation-8 rounded-lg mt-3">
              <RouterLink to="/reports/transfer/introducer-commission" target="_blank">
                <div
                  class="elevation-8 py-2 px-4 rounded-t-lg d-flex align-center justify-space-between w-100 text-dark"
                  style="background-color: white; cursor: pointer;">
                  <span class="fs-15 text-grey-darken-2">Commission For Introducer Report</span>
                  <VIcon icon="tabler-arrow-narrow-right" size="28" />
                </div>
              </RouterLink>
              <VCol cols="12 fs-14 py-2 text-justify">
                Review the commission report for introducers, including earnings and transactions.
              </VCol>
            </VCol>
            <VCol cols="12 pb-0 pt-0 px-0 elevation-8 rounded-lg mt-3">
              <RouterLink to="/reports/transfer/agent-commission" target="_blank">
                <div
                  class="elevation-8 py-2 px-4 rounded-t-lg d-flex align-center justify-space-between w-100 text-dark"
                  style="background-color: white; cursor: pointer;">
                  <span class="fs-15 text-grey-darken-2">Commission For Agent Report</span>
                  <VIcon icon="tabler-arrow-narrow-right" size="28" />
                </div>
              </RouterLink>
              <VCol cols="12 fs-14 py-2 text-justify">
                Review the commission report for agents, detailing commission earnings and associated transactions.
              </VCol>
            </VCol>
            <VCol cols="12 pb-0 pt-0 px-0 elevation-8 rounded-lg mt-3" v-if="permissionStore.hasPermission('corridor.target.report')">
              <RouterLink to="/reports/transfer/corridor-target" target="_blank">
                <div
                  class="elevation-8 py-2 px-4 rounded-t-lg d-flex align-center justify-space-between w-100 text-dark"
                  style="background-color: white; cursor: pointer;">
                  <span class="fs-15 text-grey-darken-2">Corridor Target Report</span>
                  <VIcon icon="tabler-arrow-narrow-right" size="28" />
                </div>
              </RouterLink>
              <VCol cols="12 fs-14 py-2 text-justify">
                Review the corridor target report, including performance against targets for specific corridors.
              </VCol>
            </VCol>
          </VRow>
        </VCardText>
      </v-card>
    </VCol>
    <!-- 3 -->
    <VCol cols="12" md="4">
      <v-card>
        <v-card-title class="border-b-sm" style="background-color: lightgrey;">
          <div class="d-flex align-center">
            <h4 class="text-h5 py-2">Compliance Reports</h4>
          </div>
        </v-card-title>
        <VCardText class="px-6">
          <VRow class="pt-6 pb-3 px-2">
            <VCol cols="12 pb-0 pt-0 px-0 elevation-8 rounded-lg mt-3">
              <RouterLink to="/reports/compliance/sanction-log" target="_blank">
                <div
                  class="elevation-8 py-2 px-4 rounded-t-lg d-flex align-center justify-space-between w-100 text-dark"
                  style="background-color: white; cursor: pointer;">
                  <span class="fs-15 text-grey-darken-2">Sanction Log Report</span>
                  <VIcon icon="tabler-arrow-narrow-right" size="28" />
                </div>
              </RouterLink>
              <VCol cols="12 fs-14 py-2 text-justify">
                Review logs of sanction file uploads, showing date, file type, remarks, and added by.
              </VCol>
            </VCol>
            <VCol cols="12 pb-0 pt-0 px-0 elevation-8 rounded-lg mt-3" v-if="permissionStore.hasPermission('compliance.held.report')">
              <RouterLink to="/reports/compliance/compliance-hold" target="_blank">
                <div
                  class="elevation-8 py-2 px-4 rounded-t-lg d-flex align-center justify-space-between w-100 text-dark"
                  style="background-color: white; cursor: pointer;">
                  <span class="fs-15 text-grey-darken-2">Compliance Hold Report</span>
                  <VIcon icon="tabler-arrow-narrow-right" size="28" />
                </div>
              </RouterLink>
              <VCol cols="12 fs-14 py-2 text-justify">
                Review the compliance hold report, including transactions on hold.
              </VCol>
            </VCol>
            <VCol cols="12 pb-0 pt-0 px-0 elevation-8 rounded-lg mt-3" v-if="permissionStore.hasPermission('sanction.detail.report')">
              <RouterLink to="/reports/compliance/sanction-details" target="_blank">
                <div
                  class="elevation-8 py-2 px-4 rounded-t-lg d-flex align-center justify-space-between w-100 text-dark"
                  style="background-color: white; cursor: pointer;">
                  <span class="fs-15 text-grey-darken-2">Sanction Details Report</span>
                  <VIcon icon="tabler-arrow-narrow-right" size="28" />
                </div>
              </RouterLink>
              <VCol cols="12 fs-14 py-2 text-justify">
                Review the sanction details report, including transactions and accounts impacted by sanctions.
              </VCol>
            </VCol>
          </VRow>
        </VCardText>
      </v-card>
    </VCol>
  </VRow>
</template>
