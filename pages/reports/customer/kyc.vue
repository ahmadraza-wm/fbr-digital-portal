<script setup>
import { useKycReports } from '@/composables/reports/useKycReports'
const permissionStore = usePermissionStore()
const {
  userList,
  loading,
  fetchKycReports,
  exportKycReports,
} = useKycReports()
definePageMeta({
  middleware: "auth",
  permission: "kyc.notes.report"
})
const formKey = ref(null);
const category = ref('all');
const options = ref({
  page: 1,
  itemsPerPage: 5,
  sortBy: [""],
  sortDesc: [false],
});
const set_date_format = (input_date) => {
  const now = new Date(input_date);
  const day = String(now.getDate()).padStart(2, '0');
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const year = now.getFullYear();
  return `${day}-${month}-${year}`;
};

const form = reactive({
  date_from: set_date_format(new Date(new Date().getFullYear(), new Date().getMonth(), 1)),
  date_to: set_date_format(new Date()),
  category: 'all',

});
const resetFilters = () => {
  date_from = oneMonthAgo
  date_to = defaultFromDate
  category = 'all',
    formKey.value++
};

const categoryItem = ref([
  {
    title: "Initial Due Deligence",
    value: "initial_due_diligence",
  },
  {
    title: "Enhance Due Deligence",
    value: "enhance_due_diligence",
  },
  {
    title: "Commitments",
    value: "commitments",
  },
  {
    title: "Deposit",
    value: "deposit",
  },
  {
    title: "Multiple transactions/ Beneficiaries",
    value: "multiple_transactions_beneficiaries",
  },
  {
    title: "SAR (Suspicious Activity Report)",
    value: "sar_(suspicious_activity_report)",
  },
  {
    title: "Cancellations",
    value: "cancellations",
  },
  {
    title: "Others",
    value: "others",
  },
])


const headers = [
  { title: "#", key: "sr_no" },
  { title: "Customer Remarks", key: "note" },
  { title: "Category", key: "category" },
  { title: "Attachment", key: "attachment" },
  { title: "Issued Date", key: "issuance_date" },
  { title: "Expiry Date", key: "expiry_date" },
  { title: "Added By", key: "created_by" },
  { title: "Payment", key: "transaction_code" },
  { title: "Created At", key: "created_at" }
];

onMounted(() => {
  fetchKycReports(form);
});
</script>
<template>
  <v-card>
    <v-row>
      <v-col cols="12">
        <v-card-title class="border-b-sm">
          <h4 class="text-h5 py-3">KYC Report</h4>
        </v-card-title>
      </v-col>
    </v-row>

    <v-card-text class="pt-1 my-4 pb-3">
      <VForm @submit.prevent="" :key="formKey">
        <v-row class="ps-0">
          <v-col cols="12" sm="6" md="3">
            <span class="fs-15 label-color font-weight-medium">Date From<span class="text-red">*</span></span>
            <AppDateTimePicker name="from" v-model="form.date_from" placeholder="dd/mm/yyyy"
              :config="{ dateFormat: 'd-m-Y' }" :rules="[requiredValidator]" />
          </v-col>
          <v-col cols="12" sm="6" md="3">
            <span class="fs-15 label-color font-weight-medium">Date To<span class="text-red">*</span></span>
            <AppDateTimePicker name="to" v-model="form.date_to" placeholder="dd/mm/yyyy"
              :config="{ dateFormat: 'd-m-Y' }" :rules="[requiredValidator]" />
          </v-col>
          <v-col cols="12" sm="6" md="3">
            <span class="fs-15 label-color font-weight-medium">Categories</span>
            <AppAutocomplete :items="categoryItem" v-model="form.category" item-title="title" item-value="value"
              placeholder="Select categories" />
          </v-col>
          <v-col cols="12 d-flex gap-2 pt-md-8 justify-start" sm="6" md="3">
            <VBtn @click="fetchKycReports(form)" type="submit" class="login-btn" variant="tonal">
              search
            </VBtn>
            <VBtn @click="resetFilters" type="reset" color="secondary" variant="tonal">
              Reset
            </VBtn>
          </v-col>
        </v-row>
      </VForm>
    </v-card-text>
    <VCardText class="flex-wrap justify-space-between gap-4 d-flex align-center border-t-sm">
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
      <div class="gap-3 pt-6" v-if="permissionStore.hasPermission('kyc.notes.report.export')">
        <VBtn variant="tonal" color="secondary" @click="exportKycReports(form)">
          <VIcon icon="tabler-upload" class="mr-1" />
          Export.csv
        </VBtn>
      </div>
    </VCardText>

    <VCardText class="px-0">
      <PaginatedDataTable :headers="headers" :items="userList" :options="options" :loading="loading" :search="search"
        @update:options="options = $event">
        <!-- <template #item.sr_no="{ index }">
          {{ (options.page - 1) * options.itemsPerPage + index + 1 }}
        </template> -->
        <template #item.transaction_code="{ item }">
          <td class="text-wr">{{ item.transaction_code }}</td>
        </template>
        <template #item.attachment="{ item }">
          <a :href="item.attachment?.url" target="_blank">
            View
          </a>
        </template>
        <template #bottom>
          <VCardText class="pt-2 pb-0">
            <div class="d-flex flex-wrap justify-space-between align-center gap-y-2 mt-2">
              <span class="text-caption text-muted">
                Showing
                {{ (options.page - 1) * options.itemsPerPage + 1 }}
                to
                {{ Math.min(options.page * options.itemsPerPage, userList.length) }}
                of {{ userList.length }} entries
              </span>
              <VPagination v-model="options.page" :total-visible="$vuetify.display.smAndDown ? 3 : 5"
                :length="Math.ceil(userList.length / options.itemsPerPage)" />
            </div>
          </VCardText>
        </template>
      </PaginatedDataTable>
    </VCardText>
  </v-card>
</template>
