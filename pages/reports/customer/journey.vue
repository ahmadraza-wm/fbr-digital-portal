<script setup>
import { useCustomerJourney } from '@/composables/reports/useCustomerJourney';
const countryCurrencyStore = useCountryCurrencyStore();
const { sending_countries, receiving_countries } =
  storeToRefs(countryCurrencyStore);
definePageMeta({
  middleware: "auth",
  permission: "customer.journey.report"
})
const permissionStore = usePermissionStore()
const formKey = ref(null);
const options = ref({
  page: 1,
  itemsPerPage: 5,
  sortBy: [""],
  sortDesc: [false],
});
const {
  userList,
  loading,
  fetchCustomerJourney,
  exportCustomerJourney,
} = useCustomerJourney();
const advannceSearch = ref(false);
const set_date_format = (input_date) => {
  const now = new Date(input_date);
  const day = String(now.getDate()).padStart(2, '0');
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const year = now.getFullYear();
  return `${day}-${month}-${year}`;
};

const form = reactive({
  search: 1,
  to_date: set_date_format(new Date()),
  from_date: (() => {
    const date = new Date();
    date.setMonth(date.getMonth() - 3);
    return set_date_format(date);
  })(),
  fullmonth: '',
  month: '',
  customer_name: null,
  customer_type: "",
  email: null,
  phone_number: "",
  gender: "",
  is_verified: "",
  sending_country_id: "",
  receiving_country_id: "",
  device: "",
  introducer_customer: "",
  customer_status: "",
});
const extractAndSetMonth = (date) => {
  const parts = date.split('-');
  if (parts.length === 2) {
    const onlyMonth = parts[1];
    form.month = onlyMonth;
    console.log("Updated form.month:", form.month);
  }
};

watch(() => form.fullmonth, (val) => {
  if (val && val.includes("-")) {
    extractAndSetMonth(val);
  }
});

const resetFilters = () => {
  form.search = 1;
  form.to = null;
  form.from = null;
  form.custmer = null;
  form.customertype = "";
  form.email = null;
  form.phone = null;
  form.gender = "";
  form.isverified = "";
  form.scountry = "";
  form.rcountry = "";
  form.device = "";
  form.inCustomers = "";
  form.status = "";
  form.month = null;
  formKey.value += 1; // Force component refresh if needed
  fetchCustomerJourney();
};

const searchItem = ref([
  {
    title: "Search By Date",
    value: 1,
  },
  {
    title: "Search By Month",
    value: 2,
  },
]);



const customerItem = ref([
  {
    title: "Please Select",
    value: "",
  },
  {
    title: "Online",
    value: "online",
  },
  {
    title: "Agent",
    value: "agent",
  },
]);

const genderItem = ref([
  {
    title: "Please Select",
    value: "",
  },
  {
    title: "Male",
    value: "male",
  },
  {
    title: "Female",
    value: "female",
  },
  {
    title: "Other",
    value: "other",
  },
]);

const isstatusItem = ref([
  {
    title: "Please Select",
    value: "",
  },
  {
    title: "Yes",
    value: "1",
  },
  {
    title: "No",
    value: "0",
  },
]);

const introItem = ref([
  {
    title: "Please Select",
    value: "",
  },
  {
    title: "Yes",
    value: "yes",
  },
  {
    title: "No",
    value: "no",
  },
]);

const statusItem = ref([
  {
    title: "Please Select",
    value: "",
  },
  {
    title: "Active",
    value: 1,
  },
  {
    title: "Inactive",
    value: 0,
  },
]);

const deviceItem = ref([
  {
    title: "Please Select",
    value: "",
  },
  {
    title: "Android",
    value: "android",
  },
  {
    title: "IOS",
    value: "ios",
  },
  {
    title: "Web",
    value: "web",
  },
]);
const headers = [
  {
    title: "#",
    key: "sr_no",
  },
  {
    title: "Customer ID",
    key: "id",
  },
  {
    title: "Customer Name",
    key: "customer_name",
  },
  {
    title: "Email/Phone",
    key: "email",
  },
  {
    title: "Gender",
    key: "gender",
  },
  {
    title: "Sign-up Status",
    key: "sign_up_status",
  },
  {
    title: "Main Agent",
    key: "main_agent",
  },
  {
    title: "Country",
    key: "sending_country",
  },
  {
    title: "Sending to Country",
    key: "receiving_country",
  },
  {
    title: "City",
    key: "city",
  },
  {
    title: "# of Transaction",
    key: "no_of_transactions",
  },
  {
    title: "Total Volume",
    key: "total_volume",
  },
  {
    title: "First Transaction Date",
    key: "first_transaction_date",
  },
  {
    title: "Last Transaction Date",
    key: "last_transaction_date",
  },
  {
    title: "Last Transaction Status",
    key: "last_transaction_status",
  },
  {
    title: "Sign-Up Date",
    key: "signup_date",
  },
  {
    title: "Marketing Remarks",
    key: "marketing_remarks",
  },
  {
    title: "Is Verified?",
    key: "is_verified",
  },
];

onMounted(() => {
  // userList.value = JSON.parse(JSON.stringify(data));
  fetchCustomerJourney(form);
});
</script>
<template>
  <v-card>
    <v-row>
      <v-col cols="12">
        <v-card-title class="border-b-sm">
          <h4 class="text-h5 py-3">Customer Journey Report</h4>
        </v-card-title>
      </v-col>
    </v-row>

    <v-card-text class="pt-1 my-4 pb-3">
      <VForm @submit.prevent="" :key="formKey">
        <v-row class="ps-0">
          <v-col cols="12" sm="6" md="3">
            <span class="fs-15 label-color font-weight-medium">Search By<span class="text-red">*</span></span>
            <AppAutocomplete :items="searchItem" v-model="form.search" placeholder="Select method"
              :rules="[requiredValidator]" />
          </v-col>
          <v-col cols="12" sm="6" md="3" v-if="form.search === 2">
            <span class="fs-15 label-color font-weight-medium">Month<span class="text-red">*</span></span>
            <AppTextField name="email" type="month" :class="'monthYear test'" v-model="form.fullmonth"
              placeholder="--------- ----" :rules="[requiredValidator]" />
          </v-col>

          <v-col cols="12" sm="6" md="3" v-if="form.search === 1">
            <span class="fs-15 label-color font-weight-medium">Date From<span class="text-red">*</span></span>
            <AppDateTimePicker name="from" v-model="form.from_date" placeholder="dd/mm/yyyy"
              :config="{ dateFormat: 'd-m-Y' }" :rules="[requiredValidator]" />
          </v-col>
          <v-col cols="12" sm="6" md="3" v-if="form.search === 1">
            <span class="fs-15 label-color font-weight-medium">Date To<span class="text-red">*</span></span>
            <AppDateTimePicker name="to" v-model="form.to_date" placeholder="dd/mm/yyyy"
              :config="{ dateFormat: 'd-m-Y' }" :rules="[requiredValidator]" />
          </v-col>
          <v-col cols="12" sm="6" md="3">
            <span class="fs-15 label-color font-weight-medium">Customer Name</span>
            <AppTextField name="customer" type="text" v-model="form.customer_name" placeholder="Customer" />
          </v-col>
          <v-col cols="12" sm="6" md="3">
            <span class="fs-15 label-color font-weight-medium">Customer Type</span>
            <AppAutocomplete :items="customerItem" v-model="form.customer_type" placeholder="Select customer type" />
          </v-col>
          <v-col cols="12" sm="6" md="3" v-if="advannceSearch">
            <span class="fs-15 label-color font-weight-medium">Email</span>
            <AppTextField name="email" type="email" v-model="form.email" placeholder="Email" />
          </v-col>
          <v-col cols="12" sm="6" md="3" v-if="advannceSearch">
            <span class="fs-15 label-color font-weight-medium">Phone</span>
            <AppTextField name="phone" type="number" v-model="form.phone_number" placeholder="Phone" />
          </v-col>
          <v-col cols="12" sm="6" md="3" v-if="advannceSearch">
            <span class="fs-15 label-color font-weight-medium">Gender</span>
            <AppAutocomplete :items="genderItem" v-model="form.gender" placeholder="Select gender" />
          </v-col>
          <v-col cols="12" sm="6" md="3" v-if="advannceSearch">
            <span class="fs-15 label-color font-weight-medium">Is Verified?</span>
            <AppAutocomplete :items="isstatusItem" item-title="title" item-value="value" v-model="form.is_verified"
              placeholder="Select status" />
          </v-col>

          <v-col cols="12" sm="6" md="3" v-if="advannceSearch">
            <span class="fs-15 label-color font-weight-medium">Sending Country</span>
            <AppAutocomplete :items="sending_countries" item-title="name" item-value="id" placeholder="Algeria"
              v-model="form.sending_country_id" />
          </v-col>
          <v-col cols="12" sm="6" md="3" v-if="advannceSearch">
            <span class="fs-15 label-color font-weight-medium">Receving Country</span>
            <AppAutocomplete :items="receiving_countries" item-title="name" item-value="id" placeholder="Active"
              v-model="form.receiving_country_id" />
          </v-col>
          <v-col cols="12" sm="6" md="3" v-if="advannceSearch">
            <span class="fs-15 label-color font-weight-medium">City</span>
            <AppTextField name="city" type="text" v-model="form.city" placeholder="City" />
          </v-col>
          <v-col cols="12" sm="6" md="3" v-if="advannceSearch">
            <span class="fs-15 label-color font-weight-medium">Customer Device</span>
            <AppAutocomplete :items="deviceItem" v-model="form.device" placeholder="Select customer device" />
          </v-col>
          <v-col cols="12" sm="6" md="3" v-if="advannceSearch">
            <span class="fs-15 label-color font-weight-medium">Introducer Customers</span>
            <AppAutocomplete :items="introItem" v-model="form.introducer_customer" placeholder="Select introducer" />
          </v-col>
          <v-col cols="12" sm="6" md="3" v-if="advannceSearch">
            <span class="fs-15 label-color font-weight-medium">Customer Status</span>
            <AppAutocomplete :items="statusItem" item-title="title" item-value="value" v-model="form.customer_status"
              placeholder="Select customer status" />
          </v-col>
          <v-col cols="12 d-flex gap-2 align-end justify-start" md="6">
            <VBtn @click="advannceSearch = !advannceSearch" :color="!advannceSearch ? 'primary' : 'error'" variant="elevated">
              {{ advannceSearch ? "Hide" : "" }} Advance Search
            </VBtn>
            <VBtn @click="fetchCustomerJourney(form)" type="submit" class="login-btn" variant="tonal">
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
        <AppSelect v-model="options.itemsPerPage" :items="[
          { value: -1, title: 'All' },
          { value: 5, title: '5' },
          { value: 10, title: '10' },
          { value: 25, title: '25' },
          { value: 50, title: '50' },
          { value: 100, title: '100' },
        ]" style="inline-size: 6.25rem;" @update:model-value="itemsPerPage = parseInt($event, 10)" />
      </div>
      <div class="gap-3 pt-6" v-if="permissionStore.hasPermission('customer.journey.report.export')">
        <VBtn variant="tonal" color="secondary" @click="exportCustomerJourney(form)">
          <VIcon icon="tabler-upload" class="mr-1" />
          Export.csv
        </VBtn>
      </div>
    </VCardText>

    <VCardText class=" px-0">
      <VDataTable :headers="headers" :items="userList" :options="options" :loading="loading" :search="search"
        @update:options="options = $event" />
      <template #item.id="{ item }">
        <div class="fs-13  text-center">
          <NuxtLink variant="text" color="primary" target="_blank" :to="`/customers/view/${item.id}`">
            <u>{{ item.id }}</u>
          </NuxtLink>
          <p class="mb-0">{{ item.device_details }}</p>
        </div>
      </template>
      <template #item.customer_name="{ item }">
        <div class="fs-13 text-wrap text-center">
          <NuxtLink color="primary" target="_blank" :to="`/customers/view/${item.id}`">
            <u>{{ item.customer_name }} </u>
          </NuxtLink>
          <br />
          <span>{{ item.channel }}</span>
        </div>
      </template>
      <template #item.email="{ item }">
        <div class="fs-13 text-wrap">
          {{ item.email }} <br />
          {{ item.phone_number }}
        </div>
      </template>

      <template #item.transaction="{ item }">
        <div class="fs-13 text-wrap">
          <VBtn variant="text" color="primary" target="_blank" to="/payments/search">
            <u>{{ item.status }}</u>
          </VBtn>
        </div>
      </template>
      <template #item.volume="{ item }">
        <div class="fs-13 text-wrap">0.00</div>
      </template>
      <template #item.ftd="{ item }">
        <div class="fs-13 text-wrap">-</div>
      </template>
      <template #item.ltd="{ item }">
        <div class="fs-13 text-wrap">-</div>
      </template>
      <template #item.lts="{ item }">
        <div class="fs-13 text-wrap">-</div>
      </template>
      <template #item.sign-up="{ item }">
        <div class="fs-13 text-wrap">16 Jun,2025 14:50:25</div>
      </template>
      <template #item.remarks="{ item }">
        <div class="fs-13 text-wrap">-</div>
      </template>
      <template #item.is_verified="{ item }">
        <div class="fs-13 text-wrap">
          <VChip :color="item.is_verified ? 'success' : 'error'" class="font-weight-light fs-12 p-1" size="small">
            {{ item.is_verified ? "Yes" : "No" }}
          </VChip>
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
                Math.min(options.page * options.itemsPerPage, userList.length)
              }}
              of {{ userList.length }} entries
            </span>
            <VPagination v-model="options.page" :total-visible="$vuetify.display.smAndDown ? 3 : 5"
              :length="Math.ceil(userList.length / options.itemsPerPage)" />
          </div>
        </VCardText>
      </template>
    </VCardText>
  </v-card>
</template>
