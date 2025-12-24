<script setup>
import { useCustomerBeneficiaryReport } from "@/composables/reports/useCustomerBeneficiaryDetailReport";
definePageMeta({
  middleware: "auth",
  permission: "customer.beneficiary.details.report"
})
const permissionStore = usePermissionStore()
const { userList, loading, showData, fetchCustomerBeneficiary, exportCustomerBeneficiaryReport } =
  useCustomerBeneficiaryReport();
const options = ref({
  page: 1,
  itemsPerPage: 5,
  sortBy: [""],
  sortDesc: [false],
});
const formkey = ref(null);
const form = reactive({
  first_name: "",
  last_name: "",
});
const formRef = ref(null);

const requiredValidator = value => {
  return value?.trim() ? true : 'This field is required';
};

const submitForm = async () => {
  const { valid } = await formRef.value.validate();

  if (valid) {
    fetchCustomerBeneficiary(form);
  }
};

const resetFilters = () => {
  customer_id.value = null
  showData.value = false
};

const headers = [{
  title: "#",
  key: "sr_no",
},
{
  title: "Customer ID",
  key: "customer_id",
},
{
  title: "First Name",
  key: "first_name",
},
{
  title: "Last Name",
  key: "last_name",
},
{
  title: "DOB",
  key: "dob",
},
{
  title: "Postal Code",
  key: "postal_code",
},
{
  title: "Beneficiary Name",
  key: "beneficiary_name",
},
{
  title: "No. of Payments.",
  key: "no_of_payments",
},
{
  title: "Total Volume",
  key: "total_volume",
},
{
  title: "Phone",
  key: "phone_number",
},
{
  title: "Address",
  key: "address",
},
];

</script>
<template>
  <v-card>
    <v-row>
      <v-col cols="12">
        <v-card-title class="border-b-sm">
          <h4 class="text-h5 py-3">Customer Beneficiary Detail Report</h4>
        </v-card-title>
      </v-col>
    </v-row>

    <v-card-text class="pt-1 my-4 pb-3">
      <VForm ref="formRef" @submit.prevent="submitForm" :key="formkey">
        <v-row class="ps-0">
          <v-col cols="12" sm="6" md="3">
            <span class="fs-15 label-color font-weight-medium">Customer First Name<span class="text-red">*</span></span>
            <AppTextField name="first_name" type="text" v-model="form.first_name" placeholder="First name"
              :rules="[requiredValidator]" autocomplete="off"/>
          </v-col>
          <v-col cols="12" sm="6" md="3">
            <span class="fs-15 label-color font-weight-medium">Customer Last Name</span>
            <AppTextField name="last_name" type="text" v-model="form.last_name" placeholder="Last name"
             autocomplete="off" />
          </v-col>
          <v-col cols="12 d-flex gap-2 pt-md-8 justify-start" sm="6" md="3">
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
    <VCardText class="flex-wrap gap-4 d-flex justify-space-between align-center border-t-sm" v-if="showData">
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
      <div class="gap-3 pt-6" v-if="permissionStore.hasPermission('customer.beneficiary.details.export')">
        <VBtn variant="tonal" color="secondary" @click="exportCustomerBeneficiaryReport(form)">
          <VIcon icon="tabler-upload" class="mr-1" />
          Export.csv
        </VBtn>
      </div>
    </VCardText>

    <VCardText class="px-0" v-if="showData">
      <PaginatedDataTable :headers="headers" :items="userList" :options="options" :loading="loading" :search="search"
        @update:options="options = $event">
        <template #item.customer_id="{ item }">
          <div class="fs-13 text-wrap">
            <NuxtLink variant="text" color="primary" target="_blank" to="/customers/view/1">
              <span class="font-weight-bold text-decoration-underline"> {{ item.customer_id }}</span>
            </NuxtLink>
          </div>
        </template>
        <!-- <template #item.fname="{ item }">
          <div class="fs-13 text-wrap">
            Faiz
          </div>
        </template>
        <template #item.lname="{ item }">
          <div class="fs-13 text-wrap">
            Subhani
          </div>
        </template>
        <template #item.phone="{ item }">
          <div class="fs-13 text-wrap">
            3338913130
          </div>
        </template>
        <template #item.dob="{ item }">
          <div class="fs-13 text-wrap">
            10 May, 2023
          </div>
        </template>
        <template #item.postal="{ item }">
          <div class="fs-13 text-wrap">NSJ</div>
        </template>
        <template #item.be_name="{ item }">
          <div class="fs-13 text-wrap">Muhammad Talha</div>
        </template>
        <template #item.transaction="{ item }">
          <div class="fs-13 text-wrap">
            <VBtn variant="text" color="primary" target="_blank" to="/payments/search">
              <u>{{ item.status }}</u>
            </VBtn>
          </div>
        </template>
        <template #item.volume="{ item }">
          <div class="fs-13 text-wrap">
            221.00
          </div>
        </template>
        <template #item.address="{ item }">
          <div class="fs-13 text-wrap">
            Unit 0 Test Lane Southampton United Kingdom
          </div>
        </template> -->
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
