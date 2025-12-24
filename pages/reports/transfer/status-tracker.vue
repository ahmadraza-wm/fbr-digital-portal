<script setup>
import { useStatusTracker } from '@/composables/reports/useStatusTracker';
import { loadWasm } from 'shiki';
definePageMeta({
  middleware: "auth",
  permission: "status.tracker.report"
})
const permissionStore = usePermissionStore()
const { fetchStatusTracker, exportStatusTracker, userList, loading } = useStatusTracker();
const options = ref({
  page: 1,
  itemsPerPage: 5,
  sortBy: [""],
  sortDesc: [false],
});
const formRef = ref(null);
const formKey = ref(null);
const set_date_format = (input_date) => {
  const now = new Date(input_date);
  const day = String(now.getDate()).padStart(2, '0');
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const year = now.getFullYear();
  return `${day}-${month}-${year}`;
};
const currentDate = new Date();
const previousDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, currentDate.getDate() + 1);
const form = reactive({
  date_from: set_date_format(previousDate),
  date_to: set_date_format(currentDate),
  transaction_code: ''

});

const resetFilters = () => {
  form.transaction_code = ''
  form.date_from = previousDate
  form.date_to = currentDate
  fetchStatusTracker(form)
};

const headers = [{
  title: "#",
  key: "sr_no",
},
{
  title: "Transfer Code",
  key: "transaction_code",
},
{
  title: "Transfer Status",
  key: "status",
},
{
  title: "Total Time",
  key: "total_duration",
},
{
  title: "Awaiting Funds",
  key: "funds",
},
{
  title: "Incomplete",
  key: "incomplete",
},
{
  title: "Verifying Transfer",
  key: "transfer",
},
{
  title: "COMPLIANCE REVIEW",
  key: "review",
},
{
  title: "Compliance Held",
  key: "held",
},
{
  title: "Operation Hold",
  key: "hold",
},
{
  title: "Available For Collection",
  key: "collection",
},
{
  title: "Processing Transfer",
  key: "ptransfer",
},
{
  title: "Send To Partner",
  key: "partner",
},
{
  title: "Paid",
  key: "paid",
},
{
  title: "Canceled",
  key: "canceled",
},
{
  title: "Canceling",
  key: "canceling",
},
{
  title: "REFUNDED",
  key: "refunded"
}
];
const reqField = computed(() => form.transaction_code);

const submitForm = async () => {
   fetchStatusTracker(form)
};

onMounted(() => {
  fetchStatusTracker(form)
});
</script>
<template>
  <v-card>
    <v-row>
      <v-col cols="12">
        <v-card-title class="border-b-sm">
          <h4 class="text-h5 py-3">Status Tracker Report</h4>
        </v-card-title>
      </v-col>
    </v-row>

    <v-card-text class="pt-1 my-4 pb-3">
      <VForm @submit.prevent="submitForm" ref="formRef" :key="formKey">
        <v-row class="ps-0">
          <v-col cols="12" sm="6" md="3">
            <span class="fs-15 label-color font-weight-medium">Transfer Code<span v-if="reqField"
                class="text-red">*</span></span>
            <AppTextField name="code" type="text" v-model="form.transaction_code" placeholder="Transfer code"
              autocomplete="off" :rules="reqField ? [requiredValidator] : []" />
          </v-col>
          <v-col cols="12" sm="6" md="3">
            <span class="fs-15 label-color font-weight-medium">Date From<span v-if="!reqField"
                class="text-red">*</span></span>
            <AppDateTimePicker name="from" v-model="form.date_from" placeholder="dd-mm-yyyy"
              :config="{ dateFormat: 'd-m-Y' }" :rules="!reqField ? [requiredValidator] : []" />
          </v-col>
          <v-col cols="12" sm="6" md="3">
            <span class="fs-15 label-color font-weight-medium">Date To<span v-if="!reqField"
                class="text-red">*</span></span>
            <AppDateTimePicker name="to" v-model="form.date_to" placeholder="dd-mm-yyyy"
              :config="{ dateFormat: 'd-m-Y' }" :rules="!reqField ? [requiredValidator] : []" />
          </v-col>
          <v-col cols="12 d-flex gap-2 justify-start pt-md-8" sm="6" md="3">
            <VBtn type="submit" class="login-btn" variant="tonal">
              search
            </VBtn>
            <VBtn @click="resetFilters" type="reset" color="secondary" variant="tonal">
              Reset
            </VBtn>
          </v-col>
        </v-row>
      </VForm>
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
      <div class="gap-3 pt-6" v-if="permissionStore.hasPermission('status.tracker.report.export')">
        <VBtn variant="tonal" color="secondary" @click="exportStatusTracker(form)">
          <VIcon icon="tabler-upload" class="mr-1" />
          Export.csv
        </VBtn>
      </div>
    </VCardText>

    <VCardText class="px-0">
      <PaginatedDataTable :headers="headers" :items="userList" :options="options" :loading="loading" :search="search"
        @update:options="options = $event">

        <template #item.funds="{ item }">
          <div v-html="item.funds" class="text-center"></div>
        </template>
        <template #item.incomplete="{ item }">
          <div v-html="item.incomplete" class="text-center"></div>
        </template>
        <template #item.transfer="{ item }">
          <div v-html="item.transfer" class="text-center"></div>
        </template>
        <template #item.review="{ item }">
          <div v-html="item.review" class="text-center"></div>
        </template>
        <template #item.held="{ item }">
          <div v-html="item.held" class="text-center"></div>
        </template>
        <template #item.hold="{ item }">
          <div v-html="item.hold" class="text-center"></div>
        </template>
        <template #item.collection="{ item }">
          <div v-html="item.collection" class="text-center"></div>
        </template>
        <template #item.ptransfer="{ item }">
          <div v-html="item.ptransfer" class="text-center"></div>
        </template>
        <template #item.partner="{ item }">
          <div v-html="item.partner" class="text-center"></div>
        </template>
        <template #item.paid="{ item }">
          <div v-html="item.paid" class="text-center"></div>
        </template>
        <template #item.canceled="{ item }">
          <div v-html="item.canceled" class="text-center"></div>
        </template>
        <template #item.canceling="{ item }">
          <div v-html="item.canceling" class="text-center"></div>
        </template>
        <template #item.refunded="{ item }">
          <div v-html="item.refunded" class="text-center"></div>
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
