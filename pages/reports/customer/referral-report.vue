<script setup>
import { useCustomerReferralReport } from "@/composables/reports/useCustomerReferralReport";

definePageMeta({
  middleware: "auth",
  permission: "customer.referral.report"
})
const permissionStore = usePermissionStore()
// const currentDate = new Date()
// const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).toLocaleDateString('en-GB')
// const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).toLocaleDateString('en-GB')
// const from = ref(startOfMonth)
// const to = ref(endOfMonth)
const {
  userList,
  loading,
  fetchCustomerReferralReport,
  exportCustomerReferralReport,
  resolveStatusVariant,
} = useCustomerReferralReport();


const formKey = ref(null);
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
  referral_code: '',
  referral_customer_id: '',
  referrer_customer_id: '',

});

const resetFilters = () => {
  form.date_from = set_date_format(new Date(new Date().getFullYear(), new Date().getMonth(), 1))
  form.date_to = set_date_format(new Date())
  form.referral_code = null
  form.referral_customer_id = null
  form.referrer_customer_id = null
  fetchCustomerReferralReport(form);

}

const headers = [{
  title: "#",
  key: "sr_no",
},
{
  title: "Referral Code",
  key: "referrer_code",
},
{
  title: "Referrer Name",
  key: "referrer_name",
},
{
  title: "Referral Name",
  key: "referral_name",
},
{
  title: "Transaction Id",
  key: "transaction_code",
},
{
  title: "Status",
  key: "status",
},
{
  title: "Date",
  key: "date",
}
];

onMounted(() => {
  // userList.value = JSON.parse(JSON.stringify(data));
  fetchCustomerReferralReport(form);
});
</script>
<template>
  <v-card>
    <v-row>
      <v-col cols="12">
        <v-card-title class="border-b-sm">
          <h4 class="text-h5 py-3">Customer Referral Report</h4>
        </v-card-title>
      </v-col>
    </v-row>
    <v-card-text class="pt-1 my-4 pb-3">
      <VForm @submit.prevent="" :key="formKey">
        <v-row class="ps-0">
          <v-col cols="12" sm="6" md="3">
            <span class="fs-15 label-color font-weight-medium">Referral Code</span>
            <AppTextField name="code" type="text" v-model="form.referral_code" placeholder="Referral code" autocomplete="off" />
          </v-col>
          <v-col cols="12" sm="6" md="3">
            <span class="fs-15 label-color font-weight-medium">Referral Customer ID</span>
            <AppTextField name="id" type="text" v-model="form.referral_customer_id" placeholder="Referral id" autocomplete="off" />
          </v-col>
          <v-col cols="12" sm="6" md="3">
            <span class="fs-15 label-color font-weight-medium">Referrer Customer ID</span>
            <AppTextField name="id" type="text" v-model="form.referrer_customer_id" placeholder="Referrer id" autocomplete="off" />
          </v-col>
          <v-col cols="12" sm="6" md="3">
            <span class="fs-15 label-color font-weight-medium">Date From</span>
            <AppDateTimePicker name="from" v-model="form.date_from" placeholder="dd-mm-yyyy"
              :config="{ dateFormat: 'd-m-Y' }" />
          </v-col>
          <v-col cols="12" sm="6" md="3">
            <span class="fs-15 label-color font-weight-medium">Date To</span>
            <AppDateTimePicker name="to" v-model="form.date_to" placeholder="dd-mm-yyyy"
              :config="{ dateFormat: 'd-m-Y' }" />
          </v-col>
          <v-col cols="12 d-flex gap-2 align-end justify-start" sm="6" md="3">
            <VBtn @click="fetchCustomerReferralReport(form)" type="submit" class="login-btn" variant="tonal">
              search
            </VBtn>
            <VBtn @click="resetFilters" type="reset" color="secondary" variant="tonal">
              Reset
            </VBtn>
          </v-col>
        </v-row>
      </VForm>
    </v-card-text>
    <VCardText class="flex-wrap gap-4 justify-space-between d-flex align-center border-t-sm">
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
      <div class="gap-3 pt-6" v-if="permissionStore.hasPermission('customer.referral.export')">
        <VBtn variant="tonal" color="secondary" @click="exportCustomerReferralReport(form)">
          <VIcon icon="tabler-upload" class="mr-1" />
          Export.csv
        </VBtn>
      </div>
    </VCardText>

    <VCardText class="px-0">
      <PaginatedDataTable :headers="headers" :items="userList" :options="options" :loading="loading" :search="search"
        @update:options="options = $event">
        <template #item.referrer_name="{ item }">
          <NuxtLink :to="`/customers/view/${item.id}`" target="_blank">
            {{ item.referrer_name }}
          </NuxtLink>
        </template>
        <template #item.referral_name="{ item }">
          <NuxtLink :to="`/customers/view/${item.id}`" target="_blank">
            {{ item.referral_name }}
          </NuxtLink>
        </template>
        <template #item.transaction_code="{ item }">
          <td class="text-wrap">{{ item.transaction_code ?? "--" }}</td>
        </template>
        <template #item.status="{ item }">
          <VChip :style="{
            ...resolveStatusVariant(item.status),
            fontSize: '12px',
            marginTop: '4px',
            marginBottom: '5px',
          }" class="font-weight-regular p-1" size="small">
            {{ resolveStatusVariant(item.status).text }}
          </VChip>
        </template>
        <template #item.created_at="{ item }">
          <td class="text-wrap">{{ item.created_at ?? "--" }}</td>

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
