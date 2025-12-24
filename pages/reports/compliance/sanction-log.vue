<script setup>
import { ref } from 'vue'
// import { useSanctionDetailReport } from '@/composables/reports/useSanctionDetailReport';
import useUiFeedback from "@/composables/useUiFeedback";

// const {
//   userList,
//   fetchSanctionDetail,
//   exportSanctionDetailReport
// } = useSanctionDetailReport();
const {
  loading,
  showLoading,
  hideLoading,
  showSuccess,
  showError,
  confirmAction,
} = useUiFeedback();
const userList = ([]);

const set_date_format = (input_date) => {
  const now = new Date(input_date);
  const day = String(now.getDate()).padStart(2, '0');
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const year = now.getFullYear();
  return `${day}-${month}-${year}`;
};
const today = new Date();
const previousMonthDate = new Date(today.getFullYear(), today.getMonth() - 1, today.getDate());
const form = reactive({

  date_from: set_date_format(previousMonthDate),
  date_to: set_date_format(new Date()),


});
const resetFilter = () => {
  form.date_from = null;
  form.date_to = null;
}

const options = ref({
  page: 1,
  itemsPerPage: 5,
  sortBy: [""],
  sortDesc: [false],
});

const headers = [{
  title: "#",
  key: "sr_no",
},
{
  title: "Sanction Type",
  key: "stype",
},
{
  title: "Description",
  key: "description",
},
{
  title: "Uploaded By",
  key: "uploadBy",
},
{
  title: "Uploaded At",
  key: "uploadAt",
}
];

onMounted(() => {
});

</script>
<template>
  <v-card>
    <v-row>
      <v-col cols="12">
        <v-card-title class="border-b-sm">
          <h4 class="text-h5 py-3">Sanction Log Report</h4>
        </v-card-title>
      </v-col>
    </v-row>
    <v-card-text>
      <VForm @submit.prevent="" :key="formKey">
        <v-row>
          <v-col cols="12" sm="6" md="4">
            <span class="fs-15 label-color font-weight-medium">Date From</span>
            <AppDateTimePicker name="from" v-model="form.date_from" placeholder="dd-mm-yyyy"
              :config="{ dateFormat: 'd-m-Y' }" />
          </v-col>
          <v-col cols="12" sm="6" md="4">
            <span class="fs-15 label-color font-weight-medium">Date To</span>
            <AppDateTimePicker name="to" v-model="form.date_to" placeholder="dd-mm-yyyy"
              :config="{ dateFormat: 'd-m-Y' }" />
          </v-col>
          <v-col cols="12" md="4" class="d-flex gap-4 pt-md-8">
            <VBtn type="submit" @click="fetchSanctionLog(form)" variant="tonal" class="login-btn">Search</VBtn>
            <VBtn type="reset" @click="resetFilter" color="secondary" variant="tonal"> Reset </VBtn>
          </v-col>
        </v-row>
      </VForm>
    </v-card-text>
    <VCardText class="flex-wrap gap-4 d-flex align-center border-t-sm">
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
    </VCardText>

    <VCardText class="px-0">
      <PaginatedDataTable :headers="headers" :items="userList" :options="options" :loading="loading" :search="search"
        @update:options="options = $event">
        <template #item.stype="{ item }">
          <div class="fs-13 text-wrap">
            PEP
          </div>
        </template>
        <template #item.description="{ item }">
          <div class="fs-13 text-wrap">
            PEP List Updated by Muhammad
          </div>
        </template>
        <template #item.uploadBy="{ item }">
          <div class="fs-13 text-wrap">
            Muhammad
          </div>
        </template>
        <template #item.uploadAt="{ item }">
          <div class="fs-13 text-wrap">
            17 May, 2025 09:10 am
          </div>
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
