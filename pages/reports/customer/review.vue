<script setup>
import { useCustomerReview } from "@/composables/reports/useCustomerReview";
definePageMeta({
  middleware: "auth",
  permission: "customer.review.report"
})
const permissionStore = usePermissionStore()
// const status = ref('all');
// const country = ref()
// const count = ref(6)
// const from = ref('01/01/2000')
// const to = ref(new Date().toLocaleDateString('en-GB'));

const filters = reactive({
  status: null,
  sending_country_id: null,
  less_than_count: 6,
  date_from: "01/01/2000",
  date_to: new Date().toLocaleDateString("en-GB"),
});

const options = ref({
  page: 1,
  itemsPerPage: 5,
  sortBy: [""],
  sortDesc: [false],
});

const {
  customer_reviews,
  fetchCustomerReview,
  loading,
  countries,
  payment_status,
  exportCustomerLeeds,
} = useCustomerReview();

const statusItem = ref([
  { title: "All", value: "all" },
  { title: "Verifying Transfer", value: "VER" },
  { title: "Compliance Held", value: "CMH" },
  { title: "Available for Collection", value: "PAY" },
  { title: "Paid", value: "PAI" },
  { title: "Canceled", value: "CAN" },
  { title: "Refunded", value: "REF" },
  { title: "Canceling", value: "CNL" },
  { title: "Processing Transfer", value: "PRC" },
  { title: "Awaiting funds", value: "PEN" },
  { title: "Incomplete", value: "INC" },
  { title: "Send to Partner", value: "STP" },
  { title: "Operation Hold", value: "OPH" },
]);

const resetFilters = () => {
  filters.status = null;
  filters.date_from = "01/01/2000";
  filters.date_to = new Date().toLocaleDateString("en-GB");
  filters.less_than_count = 6;
  filters.sending_country_id = null;
  fetchCustomerReview();
};

const headers = [
  {
    title: "#",
    key: "sr_no",
  },
  {
    title: "Customer ID",
    key: "customer_id",
  },
  {
    title: "Full Name",
    key: "full_name",
  },
  {
    title: "Contact",
    key: "contact",
  },
  {
    title: "Last Tran. Date",
    key: "last_transaction_date",
  },
  {
    title: "Sending Country",
    key: "sending_country",
  },
  {
    title: "Receving Country",
    key: "receiving_country",
  },
  {
    title: "Status",
    key: "status",
  },
  {
    title: "# of Trans.",
    key: "transaction_count",
  },
];

onMounted(() => {
  // userList.value = JSON.parse(JSON.stringify(data));
  fetchCustomerReview();
});
</script>
<template>
  <v-card>
    <v-row>
      <v-col cols="12">
        <v-card-title class="border-b-sm">
          <h4 class="text-h5 py-3">Customer Review Report</h4>
        </v-card-title>
      </v-col>
    </v-row>

    <v-card-text class="pt-1 my-4 pb-3">
      <v-row class="ps-0">
        <v-col cols="12" sm="6" md="3">
          <span class="fs-15 label-color font-weight-medium">Date From</span>
          <AppDateTimePicker name="from" v-model="filters.date_from" placeholder="dd/mm/yyyy"
            :config="{ dateFormat: 'd/m/Y' }" />
        </v-col>
        <v-col cols="12" sm="6" md="3">
          <span class="fs-15 label-color font-weight-medium">Date To</span>
          <AppDateTimePicker name="to" v-model="filters.date_to" placeholder="dd/mm/yyyy"
            :config="{ dateFormat: 'd/m/Y' }" />
        </v-col>
        <v-col cols="12" sm="6" md="3">
          <span class="fs-15 label-color font-weight-medium">Less Than Count</span>
          <AppTextField name="count" type="number" v-model="filters.less_than_count" placeholder="Less than count" />
        </v-col>
        <v-col cols="12" sm="6" md="3">
          <span class="fs-15 label-color font-weight-medium">Country</span>
          <AppAutocomplete :items="countries" item-title="name" item-value="id" v-model="filters.sending_country_id"
            placeholder="Select country" />
        </v-col>
        <v-col cols="12" sm="6" md="3">
          <span class="fs-15 label-color font-weight-medium">Status</span>
          <AppAutocomplete :items="payment_status" item-title="title" v-model="filters.status"
            placeholder="Select status" />
        </v-col>
        <v-col cols="12 d-flex gap-2 align-end justify-start" sm="6" md="3">
          <VBtn @click="fetchCustomerReview(filters)" type="submit" class="login-btn" variant="tonal">
            search
          </VBtn>
          <VBtn @click="resetFilters" type="reset" color="secondary" variant="tonal">
            Reset
          </VBtn>
        </v-col>
      </v-row>
    </v-card-text>
    <VCardText class="flex-wrap gap-4 d-flex justify-space-between align-center border-t-sm">
      <div class="me-3 d-flex gap-3 pt-6">
        <span class="fs-16 pt-2">Show</span>
        <AppAutocomplete v-model="options.itemsPerPage" :items="[
          { value: -1, title: 'All' },
          { value: 5, title: '5' },
          { value: 10, title: '10' },
          { value: 25, title: '25' },
          { value: 50, title: '50' },
          { value: 100, title: '100' },
        ]" style="inline-size: 6.25rem;" @update:model-value="itemsPerPage = parseInt($event, 10)" />
      </div>
      <div class="gap-3 pt-6" v-if="permissionStore.hasPermission('customer.review.report.export')">
        <VBtn variant="tonal" color="secondary" @click="exportCustomerLeeds(filters)">
          <VIcon icon="tabler-upload" class="mr-1" />
          Export Csv
        </VBtn>
      </div>
    </VCardText>

    <VCardText class="px-0">
      <PaginatedDataTable :headers="headers" :items="customer_reviews" :options="options" :loading="loading"
        :search="search" @update:options="options = $event">
        <template #item.customer_id="{ item }">
          <div class="fs-13 text-wrap">
            <VBtn variant="text" color="primary" target="_blank" :to="`/customers/view/${item.id}`">
              <u>{{ item.id }}</u>
            </VBtn>
          </div>
        </template>
        <template #item.name="{ item }">
          <div class="fs-13 text-wrap">
            {{ item.full_name }}
          </div>
        </template>
        <template #item.contact="{ item }">
          <div class="fs-13 text-wrap">
            {{ item.contact }}
          </div>
        </template>
        <template #item.last_trans="{ item }">
          <div class="fs-13 text-wrap">
            {{ item.last_transaction_date }}
          </div>
        </template>
        <template #item.sending_country="{ item }">
          <div class="fs-13 text-wrap">{{ item.sending_country }}</div>
        </template>
        <template #item.receiving_country="{ item }">
          <div class="fs-13 text-wrap">{{ item.receiving_country }}</div>
        </template>
        <template #item.transaction="{ item }">
          <div class="fs-13 text-wrap">
            <VBtn variant="text" color="primary" target="_blank" to="/payments/search">
              <u>{{ item.transaction_count }}</u>
            </VBtn>
          </div>
        </template>
        <template #item.status="{ item }">
          <div class="fs-13 text-wrap">
            {{ item.status }}
          </div>
        </template>
        <template #bottom>
          <VCardText class="pt-2 pb-0">
            <div class="d-flex flex-wrap justify-space-between align-center gap-y-2 mt-2">
              <span class="text-caption text-muted">
                Showing
                {{ (options.page - 1) * options.itemsPerPage + 1 }}
                to
                {{
                  Math.min(
                    options.page * options.itemsPerPage,
                    customer_reviews.length
                  )
                }}
                of {{ customer_reviews.length }} entries
              </span>
              <VPagination v-model="options.page" :total-visible="$vuetify.display.smAndDown ? 3 : 5" :length="Math.ceil(customer_reviews.length / options.itemsPerPage)
                " />
            </div>
          </VCardText>
        </template>
      </PaginatedDataTable>
    </VCardText>
  </v-card>
</template>
