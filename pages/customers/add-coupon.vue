<script setup>
import { useCustomerCoupon } from "@/composables/useCustomerCoupon";
import data from "@/views/demos/forms/tables/data-table/datatable";
import { computed, ref } from "vue";
const requiredValidator = (v) => !!v || "This field is required";
definePageMeta({
  middleware: "auth",
  permission: "customer.coupons.store"
})
const countryCurrencyStore = useCountryCurrencyStore();
const { sending_countries, receiving_countries } = storeToRefs(countryCurrencyStore);
const showCustomers = ref(false);

const userList = ref([]);
const options = ref({
  page: 1,
  itemsPerPage: 10,
  sortBy: [""],
  sortDesc: [false],
});

const {
  form,
  resetForm,
  saveCustomerCoupon,
  fetchCustomersFilters,
  filterscustomer,
  formKey,
  resetCustomerFilters,
  selectedCustomers,
} = useCustomerCoupon();

const {
  customersList,
  fetchCustomers,
} = useCustomer();

const { pageNo, itemsPerPage, updateItemsPerPage, loadPage } = usePagination(
  fetchCustomers,
  {
    initialPage: 1,
    initialPerPage: 10,
  }
);

const statusItem = [
  { title: "All", value: "all" },
  { title: "Verified", value: "verified" },
  { title: "Unverified", value: "unverified" },
];

const smethodItem = [
  { title: "Bank Transfer", value: "Bank Transfer" },
  { title: "PAY BY CARD (Debit/Credit)", value: "PAY BY CARD (Debit/Credit)" },
  { title: "Credit Card", value: "Credit Card" },
  { title: "PAY BY INTRAC", value: "PAY BY INTRAC" },
  { title: "Digital Wallet", value: "Digital Wallet" },
];

const rmethodItem = [
  { title: "Bank", value: "bank" },
  { title: "Cash", value: "cash" },
  { title: "Mobile Wallet", value: "mobile_wallet" },
];

const discountItem = [
  { title: "Full Amount", value: "full_amount" },
  { title: "Charges", value: "charges" },
];

const discountypeItem = [
  { title: "Flat", value: "flat" },
  { title: "Percentage", value: "percentage" },
];

const headers = [
  {
    title: "",
    key: "checkbox",
    sortable: false,
  },
  {
    title: "#",
    key: "sr_no",
  },
  {
    title: "Customer Id",
    key: "id",
  },
  {
    title: "Customer Name",
    key: "fullName",
  },
  {
    title: "Email",
    key: "email",
  },
  {
    title: "phone",
    key: "phone",
  },
  {
    title: "Created At",
    key: "created_at",
  },
];

const isAllSelected = computed(() => {
  return (
    customersList.value.length > 0 &&
    selectedCustomers.value.length === customersList.value.length
  );
});

const someSelected = computed(() => {
  return (
    selectedCustomers.value.length > 0 &&
    selectedCustomers.value.length < customersList.value.length
  );
});

const toggleAll = (val) => {
  if (val) {
    selectedCustomers.value = customersList.value.map((customer) => customer.id);
  } else {
    selectedCustomers.value = [];
  }
};

onMounted(() => {
  userList.value = JSON.parse(JSON.stringify(data));
  fetchCustomers();
});

const discountCheck = computed(() => form.discount_applied === "charges");
watch(
  () => form.discount_applied,
  (newVal) => {
    if (newVal === "charges") {
      form.discount_type = "percentage";
    } else {
      form.discount_type = null;
    }
  }
);

const submitForm = () => {
  saveCustomerCoupon(form, selectedCustomers.value);
};

const submitcustomerfilters = () => {
  const filterParams = {};

  if (filterscustomer.value.customer_id) {
    filterParams.customer_id = filterscustomer.value.customer_id;
  }

  if (filterscustomer.value.from) {
    const [day, month, year] = filterscustomer.value.from.split("-");
    filterParams.from = `${year}-${month}-${day}`;
  }

  if (filterscustomer.value.to) {
    const [day, month, year] = filterscustomer.value.to.split("-");
    filterParams.to = `${year}-${month}-${day}`;
  }

  // Use correct key as expected by Laravel (country_id)
  if (filterscustomer.value.country_id !== "all") {
    filterParams.country_id = filterscustomer.value.country_id;
  }

  if (filterscustomer.value.receiving_country_id !== "all") {
    filterParams.receiving_country_id = filterscustomer.value.receiving_country_id;
  }

  fetchCustomersFilters(filterParams);
};
</script>

<template>
  <v-card>
    <v-row>
      <v-col cols="12">
        <v-card-title class="border-b-sm" style="background-color: lightgrey">
          <div class="d-flex align-center">
            <BackNavigation />
            <h4 class="text-h5 py-3">Add Coupon</h4>
          </div>
        </v-card-title>
      </v-col>
    </v-row>
    <VForm @submit.prevent="submitForm" :key="formKey">
      <v-card-text class="px-4 pt-4">
        <VRow>
          <v-col cols="12" md="6">
            <span class="fs-15 label-color font-weight-medium">Sending Country</span>
            <AppAutocomplete
              :items="sending_countries"
              item-title="name"
              item-value="id"
              v-model="form.sending_country_id"
              placeholder="Select sending country"
            />
          </v-col>

          <v-col cols="12" md="6">
            <span class="fs-15 label-color font-weight-medium">Receiving Country</span>
            <AppAutocomplete
              :items="receiving_countries"
              item-title="name"
              item-value="id"
              v-model="form.receiving_country_id"
              placeholder="Select receiving country"
            />
          </v-col>

          <v-col cols="12" md="6">
            <span class="fs-15 label-color font-weight-medium">Sending Method</span>
            <AppAutocomplete
              :items="smethodItem"
              v-model="form.sending_methods"
              placeholder="Select sending method"
            />
          </v-col>

          <v-col cols="12" md="6">
            <span class="fs-15 label-color font-weight-medium">Receiving Method</span>
            <AppAutocomplete
              :items="rmethodItem"
              v-model="form.receiving_methods"
              placeholder="Select receiving method"
            />
          </v-col>

          <v-col cols="12" md="6">
            <span class="fs-15 label-color font-weight-medium"
              >Coupon Code<span class="text-red">*</span></span
            >
            <AppTextField
              v-model="form.coupon_code"
              placeholder="Coupon code"
              :rules="[requiredValidator]"
            />
          </v-col>

          <v-col cols="12" md="6">
            <span class="fs-15 label-color font-weight-medium"
              >Customer Status<span class="text-red">*</span></span
            >
            <AppAutocomplete
              :items="statusItem"
              v-model="form.customer_status"
              placeholder="Select customer status"
              :rules="[requiredValidator]"
            />
          </v-col>

          <v-col cols="12" md="6">
            <span class="fs-15 label-color font-weight-medium"
              >Discount Applied<span class="text-red">*</span></span
            >
            <AppAutocomplete
              :items="discountItem"
              v-model="form.discount_applied"
              placeholder="Select discount applied"
              :rules="[requiredValidator]"
            />
          </v-col>

          <v-col cols="12" md="6">
            <span class="fs-15 label-color font-weight-medium"
              >Discount Type<span class="text-red">*</span></span
            >
            <AppAutocomplete
              :items="discountypeItem"
              v-model="form.discount_type"
              placeholder="Select discount type"
              :rules="[requiredValidator]"
              :disabled="discountCheck"
            />
          </v-col>

          <v-col cols="12" md="6">
            <span class="fs-15 label-color font-weight-medium">Customer ID</span>
            <AppTextField
              v-model="selectedCustomers"
              placeholder="Customer ID Selected"
              disabled
            />
          </v-col>
          <v-col cols="12" md="6">
            <span class="fs-15 label-color font-weight-medium"
              >Value {{ discountCheck ? "(%)" : "" }}<span class="text-red">*</span></span
            >
            <AppTextField
              type="number"
              v-model="form.discount_value"
              placeholder="Value"
              :rules="[requiredValidator]"
            />
          </v-col>

          <v-col cols="12" md="6">
            <span class="fs-15 label-color font-weight-medium">Signup From</span>
            <AppDateTimePicker
              v-model="form.signup_from"
              placeholder="dd/mm/yyyy"
              :config="{ dateFormat: 'd-m-Y' }"
            />
          </v-col>

          <v-col cols="12" md="6">
            <span class="fs-15 label-color font-weight-medium">Signup To</span>
            <AppDateTimePicker
              v-model="form.signup_to"
              placeholder="dd/mm/yyyy"
              :config="{ dateFormat: 'd-m-Y' }"
            />
          </v-col>

          <v-col cols="12" md="6">
            <span class="fs-15 label-color font-weight-medium"
              >Min Sending Amount<span class="text-red">*</span></span
            >
            <AppTextField
              type="text"
              v-model="form.min_sending_amount"
              placeholder="Min sending amount"
              :rules="[requiredValidator]"
            />
          </v-col>

          <v-col cols="12" md="6">
            <span class="fs-15 label-color font-weight-medium"
              >Start At<span class="text-red">*</span></span
            >
            <AppDateTimePicker
              v-model="form.starts_at"
              :rules="[requiredValidator]"
              placeholder="dd/mm/yyyy"
              :config="{ dateFormat: 'd-m-Y' }"
            />
          </v-col>

          <v-col cols="12" md="6">
            <span class="fs-15 label-color font-weight-medium"
              >Expire At<span class="text-red">*</span></span
            >
            <AppDateTimePicker
              v-model="form.expires_at"
              :rules="[requiredValidator]"
              placeholder="dd/mm/yyyy"
              :config="{ dateFormat: 'd-m-Y' }"
            />
          </v-col>

          <v-col cols="12" class="d-flex justify-end gap-4">
            <VBtn type="reset" color="secondary" variant="tonal" @click="resetForm"
              >Reset</VBtn
            >
            <VBtn type="submit" variant="tonal" class="login-btn">Add Coupon</VBtn>
          </v-col>
        </VRow>
      </v-card-text>
      <v-row>
        <v-col cols="12">
          <v-card-title
            class="elevation-8 px-6 d-flex justify-space-between align-center"
          >
            <h4 class="text-h5 py-4">Customers List</h4>
            <div>
              <VBtn
                variant="elevated"
                color="warning"
                class="mr-1"
                disabled
                v-if="selectedCustomers.length"
              >
                {{ selectedCustomers.length }} Customer(s) Selected!
              </VBtn>
              <VBtn
                variant="elevated"
                color="secondary"
                class="mr-1"
                v-if="selectedCustomers.length"
                @click="selectedCustomers = []"
              >
                reset
              </VBtn>
              <VBtn
                variant="elevated"
                :color="showCustomers ? 'error' : 'primary'"
                @click="showCustomers = !showCustomers"
              >
                <VIcon icon="tabler-users" class="mr-1" />
                {{ showCustomers ? "Hide" : "Show" }} Customers
              </VBtn>
            </div>
          </v-card-title>
        </v-col>
      </v-row>
      <v-card-text class="px-0 pt-0" v-if="showCustomers">
        <v-row class="px-4 py-4">
          <v-col cols="12" sm="6" md="3">
            <span class="fs-15 label-color font-weight-medium">Customer Id</span>
            <AppTextField
              name="customer_id"
              v-model="filterscustomer.customer_id"
              placeholder="Customer Id"
              autocomplete="off"
            />
          </v-col>
          <v-col cols="12" sm="6" md="3">
            <span class="fs-15 label-color font-weight-medium">Sending Country</span>
            <AppAutocomplete
              :items="sending_countries"
              v-model="filterscustomer.country_id"
              item-title="name"
              item-value="id"
              placeholder="Select country"
            />
          </v-col>
          <v-col cols="12" sm="6" md="3">
            <span class="fs-15 label-color font-weight-medium">Receiving Country</span>
            <AppAutocomplete
              :items="receiving_countries"
              v-model="filterscustomer.receiving_country_id"
              item-title="name"
              item-value="id"
              placeholder="Select country"
            />
          </v-col>
          <v-col cols="12" sm="6" md="3">
            <span class="fs-15 label-color font-weight-medium"
              >Registration Date From</span
            >
            <AppDateTimePicker
              name="start"
              v-model="filterscustomer.from"
              placeholder="dd/mm/yyyy"
              :config="{ dateFormat: 'd-m-Y' }"
            />
          </v-col>
          <v-col cols="12" sm="6" md="3">
            <span class="fs-15 label-color font-weight-medium">Registration Date To</span>
            <AppDateTimePicker
              name="expire"
              v-model="filterscustomer.to"
              placeholder="dd/mm/yyyy"
              :config="{ dateFormat: 'd-m-Y' }"
            />
          </v-col>
          <v-col cols="12 d-flex gap-2 align-end justify-start" sm="6" md="3">
            <VBtn class="login-btn" variant="tonal" @click="submitcustomerfilters">
              search
            </VBtn>
            <VBtn
              @click="resetCustomerFilters"
              type="reset"
              color="secondary"
              variant="tonal"
            >
              Reset
            </VBtn>
          </v-col>
        </v-row>
        <VDatableComponent
          :headers="headers"
          :items="customersList"
          :loading="loading"
          :search="search"
          :pagination="pagination"
          :pageNo="pageNo"
          @update:pageNo="pageNo = $event"
        >
          <template #header.checkbox="{ selectAll }">
            <VCheckbox
              :model-value="isAllSelected"
              :indeterminate="someSelected"
              @update:model-value="toggleAll"
            />
          </template>
          <template #item.checkbox="{ item }">
            <VCheckbox :value="item.id" v-model="selectedCustomers" />
          </template>

          <template #item.phone="{ item }">
            <div class="fs-13 text-wrap">
              {{ item.phone }}
            </div>
          </template>
          <template #item.created_at="{ item }">
            <div class="fs-13 text-wrap">
              {{ item.created_at }}
            </div>
          </template>
        </VDatableComponent>
      </v-card-text>
    </VForm>
  </v-card>
</template>
