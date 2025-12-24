<script setup>
definePageMeta({
  middleware: "auth",
  permission: "exports"
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
            <h4 class="text-h5 py-2">Payment Exports</h4>
          </div>
        </v-card-title>
        <VCardText class="px-6">
          <VRow class="pt-6 pb-3 px-2">
            <VCol cols="12 pb-0 pt-0 px-0 elevation-8 rounded-lg mt-3" v-if="permissionStore.hasPermission('payment.detail.export')">
              <RouterLink to="/exports/payment/detail" target="_blank">
                <div
                  class="elevation-8 py-2 px-4 rounded-t-lg d-flex align-center justify-space-between w-100 text-dark"
                  style="background-color: white; cursor: pointer;">
                  <span class="fs-15 text-grey-darken-2">Payment Detail Export</span>
                  <VIcon icon="tabler-arrow-narrow-right" size="28" />
                </div>
              </RouterLink>
              <VCol cols="12 fs-14 py-2 text-justify">
                Export the complete comprehensive breakdown of all payment transactions, including essential details.
              </VCol>
            </VCol>
            <VCol cols="12 pb-0 pt-0 px-0 elevation-8 rounded-lg mt-3">
              <RouterLink to="/exports/payment/compliance" target="_blank">
                <div
                  class="elevation-8 py-2 px-4 rounded-t-lg d-flex align-center justify-space-between w-100 text-dark"
                  style="background-color: white; cursor: pointer;">
                  <span class="fs-15 text-grey-darken-2">Compliance Export</span>
                  <VIcon icon="tabler-arrow-narrow-right" size="28" />
                </div>
              </RouterLink>
              <VCol cols="12 fs-14 py-2 text-justify">
                Export compliance report ensures adherence to regulatory standards and internal policies.
              </VCol>
            </VCol>
            <VCol cols="12 pb-0 pt-0 px-0 elevation-8 rounded-lg mt-3" v-if="permissionStore.hasPermission('hold.file.for.ams.export')">
              <RouterLink to="/exports/payment/hold-file" target="_blank">
                <div
                  class="elevation-8 py-2 px-4 rounded-t-lg d-flex align-center justify-space-between w-100 text-dark"
                  style="background-color: white; cursor: pointer;">
                  <span class="fs-15 text-grey-darken-2">Hold File for Ams Export</span>
                  <VIcon icon="tabler-arrow-narrow-right" size="28" />
                </div>
              </RouterLink>
              <VCol cols="12 fs-14 py-2 text-justify">
                Export the list from the hold file prepared for AMS processing, containing data.
              </VCol>
            </VCol>
            <VCol cols="12 pb-0 pt-0 px-0 elevation-8 rounded-lg mt-3" v-if="permissionStore.hasPermission('cancel.file.for.ams.export')">
              <RouterLink to="/exports/payment/cancel-file" target="_blank">
                <div
                  class="elevation-8 py-2 px-4 rounded-t-lg d-flex align-center justify-space-between w-100 text-dark"
                  style="background-color: white; cursor: pointer;">
                  <span class="fs-15 text-grey-darken-2">Cancel File for Ams Export</span>
                  <VIcon icon="tabler-arrow-narrow-right" size="28" />
                </div>
              </RouterLink>
              <VCol cols="12 fs-14 py-2 text-justify">
                Export the list of files flagged for cancellation within the AMS system, including relevant details for
                review.
              </VCol>
            </VCol>
            <VCol cols="12 pb-0 pt-0 px-0 elevation-8 rounded-lg mt-3" v-if="permissionStore.hasPermission('paid.file.for.ams.export')">
              <RouterLink to="/exports/payment/paid-file" target="_blank">
                <div
                  class="elevation-8 py-2 px-4 rounded-t-lg d-flex align-center justify-space-between w-100 text-dark"
                  style="background-color: white; cursor: pointer;">
                  <span class="fs-15 text-grey-darken-2">Paid File for Ams Export</span>
                  <VIcon icon="tabler-arrow-narrow-right" size="28" />
                </div>
              </RouterLink>
              <VCol cols="12 fs-14 py-2 text-justify">
                Export the paid file for AMS containing completed transactions marked as paid for reconciliation.
              </VCol>
            </VCol>
            <VCol cols="12 pb-0 pt-0 px-0 elevation-8 rounded-lg mt-3" v-if="permissionStore.hasPermission('payment.financial.export')">
              <RouterLink to="/exports/payment/financial" target="_blank">
                <div
                  class="elevation-8 py-2 px-4 rounded-t-lg d-flex align-center justify-space-between w-100 text-dark"
                  style="background-color: white; cursor: pointer;">
                  <span class="fs-15 text-grey-darken-2">Payments Financial Export</span>
                  <VIcon icon="tabler-arrow-narrow-right" size="28" />
                </div>
              </RouterLink>
              <VCol cols="12 fs-14 py-2 text-justify">
                Export report with detailed transactions, including customer info, amounts, rates, and status.
              </VCol>
            </VCol>
            <VCol cols="12 pb-0 pt-0 px-0 elevation-8 rounded-lg mt-3" v-if="permissionStore.hasPermission('partner.commission.export')">
              <RouterLink to="/exports/payment/partner-commission" target="_blank">
                <div
                  class="elevation-8 py-2 px-4 rounded-t-lg d-flex align-center justify-space-between w-100 text-dark"
                  style="background-color: white; cursor: pointer;">
                  <span class="fs-15 text-grey-darken-2">Partner Commission Export</span>
                  <VIcon icon="tabler-arrow-narrow-right" size="28" />
                </div>
              </RouterLink>
              <VCol cols="12 fs-14 py-2 text-justify">
                Export the Partner Commission Report with details on commission data for each partner.
              </VCol>
            </VCol>
          </VRow>
        </VCardText>
      </v-card>
    </VCol>
    <!-- 2 -->
    <!-- <VCol cols="12" md="4">
      <v-card>
        <v-card-title class="border-b-sm" style="background-color: lightgrey;">
          <div class="d-flex align-center">
            <h4 class="text-h5 py-2">Partner Exports</h4>
          </div>
        </v-card-title>
        <VCardText class="px-6">
          <VRow class="pt-6 pb-3 px-2">
            <VCol cols="12 pb-0 pt-0 px-0 elevation-8 rounded-lg mt-3">
              <RouterLink to="/exports/partner" target="_blank">
                <div class="elevation-8 py-2 px-4 rounded-t-lg d-flex align-center justify-space-between w-100 text-dark"
                  style="background-color: white; cursor: pointer;">
                  <span class="fs-15 text-grey-darken-2">Partner File Format</span>
                  <VIcon icon="tabler-arrow-narrow-right" size="28" />
                </div>
              </RouterLink>
              <VCol cols="12 fs-14 py-2 text-justify">
                Export the partner file format, outlining the structure and necessary fields for data submission.
              </VCol>
            </VCol>
          </VRow>
        </VCardText>
      </v-card>
    </VCol> -->
    <!-- 3 -->
    <VCol cols="12" md="4">
      <v-card>
        <v-card-title class="border-b-sm" style="background-color: lightgrey;">
          <div class="d-flex align-center">
            <h4 class="text-h5 py-2">Customer Exports</h4>
          </div>
        </v-card-title>
        <VCardText class="px-6">
          <VRow class="pt-6 pb-3 px-2">
            <VCol cols="12 pb-0 pt-0 px-0 elevation-8 rounded-lg mt-3" v-if="permissionStore.hasPermission('customer.profile.export')">
              <RouterLink to="/exports/customer/profile" target="_blank">
                <div
                  class="elevation-8 py-2 px-4 rounded-t-lg d-flex align-center justify-space-between w-100 text-dark"
                  style="background-color: white; cursor: pointer;">
                  <span class="fs-15 text-grey-darken-2">Customer Profile Export</span>
                  <VIcon icon="tabler-arrow-narrow-right" size="28" />
                </div>
              </RouterLink>
              <VCol cols="12 fs-14 py-2 text-justify">
                Export a list of customers with their profile information, including personal details.
              </VCol>
            </VCol>
            <VCol cols="12 pb-0 pt-0 px-0 elevation-8 rounded-lg mt-3" v-if="permissionStore.hasPermission('customer.list.export')">
              <RouterLink to="/exports/customer/list" target="_blank">
                <div
                  class="elevation-8 py-2 px-4 rounded-t-lg d-flex align-center justify-space-between w-100 text-dark"
                  style="background-color: white; cursor: pointer;">
                  <span class="fs-15 text-grey-darken-2">Customer List Export</span>
                  <VIcon icon="tabler-arrow-narrow-right" size="28" />
                </div>
              </RouterLink>
              <VCol cols="12 fs-14 py-2 text-justify">
                Export a complete list of customers for reference, reporting, or further processing.
              </VCol>
            </VCol>
            <VCol cols="12 pb-0 pt-0 px-0 elevation-8 rounded-lg mt-3" v-if="permissionStore.hasPermission('new.customer.export')">
              <RouterLink to="/exports/customer/new-customer" target="_blank">
                <div
                  class="elevation-8 py-2 px-4 rounded-t-lg d-flex align-center justify-space-between w-100 text-dark"
                  style="background-color: white; cursor: pointer;">
                  <span class="fs-15 text-grey-darken-2">New Customer Export</span>
                  <VIcon icon="tabler-arrow-narrow-right" size="28" />
                </div>
              </RouterLink>
              <VCol cols="12 fs-14 py-2 text-justify">
                Export data for newly added customers, including registration details for tracking and analysis.
              </VCol>
            </VCol>
            <VCol cols="12 pb-0 pt-0 px-0 elevation-8 rounded-lg mt-3" v-if="permissionStore.hasPermission('customer.external.sar.export')">
              <RouterLink to="/exports/customer/external-sar" target="_blank">
                <div
                  class="elevation-8 py-2 px-4 rounded-t-lg d-flex align-center justify-space-between w-100 text-dark"
                  style="background-color: white; cursor: pointer;">
                  <span class="fs-15 text-grey-darken-2">Customer External SAR Export</span>
                  <VIcon icon="tabler-arrow-narrow-right" size="28" />
                </div>
              </RouterLink>
              <VCol cols="12 fs-14 py-2 text-justify">
                Export customer data for external SAR filing, including details for compliance.
              </VCol>
            </VCol>
            <VCol cols="12 pb-0 pt-0 px-0 elevation-8 rounded-lg mt-3" v-if="permissionStore.hasPermission('customer.live.transaction.export')">
              <RouterLink to="/exports/customer/transaction" target="_blank">
                <div
                  class="elevation-8 py-2 px-4 rounded-t-lg d-flex align-center justify-space-between w-100 text-dark"
                  style="background-color: white; cursor: pointer;">
                  <span class="fs-15 text-grey-darken-2">Customer Transaction Live Export</span>
                  <VIcon icon="tabler-arrow-narrow-right" size="28" />
                </div>
              </RouterLink>
              <VCol cols="12 fs-14 py-2 text-justify">
                Export live transaction data for customers, including real-time transaction details.
              </VCol>
            </VCol>
            <VCol cols="12 pb-0 pt-0 px-0 elevation-8 rounded-lg mt-3" >
              <RouterLink to="/exports/customer/alert-activity" target="_blank">
                <div
                  class="elevation-8 py-2 px-4 rounded-t-lg d-flex align-center justify-space-between w-100 text-dark"
                  style="background-color: white; cursor: pointer;">
                  <span class="fs-15 text-grey-darken-2">Customer Alert Activity Export</span>
                  <VIcon icon="tabler-arrow-narrow-right" size="28" />
                </div>
              </RouterLink>
              <VCol cols="12 fs-14 py-2 text-justify">
                Export customer alert activity data, including details of triggered alerts for monitoring and
                investigation.
              </VCol>
            </VCol>
            <VCol cols="12 pb-0 pt-0 px-0 elevation-8 rounded-lg mt-3" v-if="permissionStore.hasPermission('customer.block.list.export')">
              <RouterLink to="/exports/customer/block-list" target="_blank">
                <div
                  class="elevation-8 py-2 px-4 rounded-t-lg d-flex align-center justify-space-between w-100 text-dark"
                  style="background-color: white; cursor: pointer;">
                  <span class="fs-15 text-grey-darken-2">Customer Block List Export</span>
                  <VIcon icon="tabler-arrow-narrow-right" size="28" />
                </div>
              </RouterLink>
              <VCol cols="12 fs-14 py-2 text-justify">
                Download the list of customers blocked from accessing our system.
              </VCol>
            </VCol>
            <VCol cols="12 pb-0 pt-0 px-0 elevation-8 rounded-lg mt-3" v-if="permissionStore.hasPermission('customer.large.volumn.export')">
              <RouterLink to="/exports/customer/larger-volume" target="_blank">
                <div
                  class="elevation-8 py-2 px-4 rounded-t-lg d-flex align-center justify-space-between w-100 text-dark"
                  style="background-color: white; cursor: pointer;">
                  <span class="fs-15 text-grey-darken-2">Customer Large Volumn Export</span>
                  <VIcon icon="tabler-arrow-narrow-right" size="28" />
                </div>
              </RouterLink>
              <VCol cols="12 fs-14 py-2 text-justify">
                Export data for customers with a high volume of transactions.
              </VCol>
            </VCol>
            <VCol cols="12 pb-0 pt-0 px-0 elevation-8 rounded-lg mt-3" v-if="permissionStore.hasPermission('customer.documents.export')">
              <RouterLink to="/exports/customer/documents" target="_blank">
                <div
                  class="elevation-8 py-2 px-4 rounded-t-lg d-flex align-center justify-space-between w-100 text-dark"
                  style="background-color: white; cursor: pointer;">
                  <span class="fs-15 text-grey-darken-2">Customer Document Export</span>
                  <VIcon icon="tabler-arrow-narrow-right" size="28" />
                </div>
              </RouterLink>
              <VCol cols="12 fs-14 py-2 text-justify">
                Export documents associated with customers, including identification and other required records.
              </VCol>
            </VCol>
            <VCol cols="12 pb-0 pt-0 px-0 elevation-8 rounded-lg mt-3" v-if="permissionStore.hasPermission('dormant.customer.export')">
              <RouterLink to="/exports/customer/dormant" target="_blank">
                <div
                  class="elevation-8 py-2 px-4 rounded-t-lg d-flex align-center justify-space-between w-100 text-dark"
                  style="background-color: white; cursor: pointer;">
                  <span class="fs-15 text-grey-darken-2">Dormant Customer Export</span>
                  <VIcon icon="tabler-arrow-narrow-right" size="28" />
                </div>
              </RouterLink>
              <VCol cols="12 fs-14 py-2 text-justify">
                Export data for dormant customers who have not made any transactions for a specified period.
              </VCol>
            </VCol>
            <VCol cols="12 pb-0 pt-0 px-0 elevation-8 rounded-lg mt-3" v-if="permissionStore.hasPermission('customer.login.logs.export')">
              <RouterLink to="/exports/customer/login-logs" target="_blank">
                <div
                  class="elevation-8 py-2 px-4 rounded-t-lg d-flex align-center justify-space-between w-100 text-dark"
                  style="background-color: white; cursor: pointer;">
                  <span class="fs-15 text-grey-darken-2">Customer Login Logs Export</span>
                  <VIcon icon="tabler-arrow-narrow-right" size="28" />
                </div>
              </RouterLink>
              <VCol cols="12 fs-14 py-2 text-justify">
                Export customer login logs, including details of login attempts, IP addresses etc.
              </VCol>
            </VCol>
            <VCol cols="12 pb-0 pt-0 px-0 elevation-8 rounded-lg mt-3" v-if="permissionStore.hasPermission('customer.documents.near.expiry.export')">
              <RouterLink to="/exports/customer/documents-expiry" target="_blank">
                <div
                  class="elevation-8 py-2 px-4 rounded-t-lg d-flex align-center justify-space-between w-100 text-dark"
                  style="background-color: white; cursor: pointer;">
                  <span class="fs-15 text-grey-darken-2">Documents Near Expiry Export</span>
                  <VIcon icon="tabler-arrow-narrow-right" size="28" />
                </div>
              </RouterLink>
              <VCol cols="12 fs-14 py-2 text-justify">
                Export a list of customers with documents nearing expiry for compliance tracking.
              </VCol>
            </VCol>
          </VRow>
        </VCardText>
      </v-card>
    </VCol>
  </VRow>
</template>
