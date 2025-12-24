<script setup>
const permissionStore = usePermissionStore()
definePageMeta({
  middleware: "auth",
  permission: "paid.summary.report"
})
import { usePaidSummaryReport } from "@/composables/reports/usePaidSummaryReport";
const { fetchPaidSummaryReport, paidSummary } = usePaidSummaryReport();
const {
  loading,
  showLoading,
  hideLoading,
  showSuccess,
  showError,
  // confirmAction,
} = useUiFeedback();
const { pageNo, itemsPerPage, updateItemsPerPage, loadPage } = usePagination(
  fetchPaidSummaryReport,
  {
    initialPage: 1,
    initialPerPage: 10,
  }
);
const set_date_format = (input_date) => {
  const now = new Date(input_date);
  const day = String(now.getDate()).padStart(2, '0');
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const year = now.getFullYear();
  return `${day}-${month}-${year}`;
};
const formKey = ref(null);
const currentDate = new Date();
const previousDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, currentDate.getDate() + 1);
const form = ({
  start_date: set_date_format(previousDate),
  end_date: set_date_format(currentDate),
})
const userList = ref([]);
const options = ref({
  page: 1,
  itemsPerPage: 5,
  sortBy: [""],
  sortDesc: [false],
});


const resetFilters = () => {
  from.value = oneMonthAgo
  to.value = defaultToDate
};
 

onMounted(() => {
  userList.value = JSON.parse(JSON.stringify(data));
});
</script>
<template>
  <v-card>
    <v-row>
      <v-col cols="12">
        <v-card-title class="border-b-sm">
          <h4 class="text-h5 py-3">Paid Summery Report</h4>
        </v-card-title>
      </v-col>
    </v-row>

    <v-card-text class="pt-1 my-4 pb-3">
      <VForm @submit.prevent="" :key="formKey">
        <v-row class="ps-0">
          <v-col cols="12" sm="6" md="3">
            <span class="fs-15 label-color font-weight-medium">Date From</span>
            <AppDateTimePicker name="from" v-model="form.start_date" placeholder="dd-mm-yyyy"
              :config="{ dateFormat: 'd-m-Y' }" />
          </v-col>
          <v-col cols="12" sm="6" md="3">
            <span class="fs-15 label-color font-weight-medium">Date To</span>
            <AppDateTimePicker name="to" v-model="form.end_date" placeholder="dd-mm-yyyy"
              :config="{ dateFormat: 'd-m-Y' }" />
          </v-col>
          <v-col cols="12 d-flex gap-2 align-end justify-start" sm="6" md="3">
            <VBtn type="submit" class="login-btn" variant="tonal" @click="fetchPaidSummaryReport(form)">
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
        <ItemsPerPageSelector v-model="itemsPerPage" @update:model-value="updateItemsPerPage" />

      </div>
      <div class="gap-3 pt-6" v-if="permissionStore.hasPermission('paid.summary.report.export')">
        <VBtn variant="tonal" color="secondary">
          <VIcon icon="tabler-upload" class="mr-1" />
          Export.csv
        </VBtn>
      </div>
    </VCardText>

    <VCardText class="px-0">
      <VDatableComponent :headers="headers" :items="paidSummary" :options="options" :loading="loading" :search="search"
        :pagination="pagination" :pageNo="pageNo" @update:pageNo="pageNo = $event">
        <template #item.samount="{ item }">
          <div class="fs-13 text-wrap">
            {{ item.sending_amount }}<br>
            {{ item.sending_country }}
          </div>
        </template>
        <template #item.ramount="{ item }">
          <div class="fs-13 text-wrap">
            {{ item.receiving_amount }}<br>
            {{ item.receiving_country }}
          </div>
        </template>
        
      </VDatableComponent>
    </VCardText>
  </v-card>
</template>
