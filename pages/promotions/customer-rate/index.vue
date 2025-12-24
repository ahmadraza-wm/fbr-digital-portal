<script setup>
import { useNuxtApp } from "#app";
import { useCustomerRate } from "@/composables/useCustomerRate";
import useUiFeedback from "@/composables/useUiFeedback";
import data from "@/views/demos/forms/tables/data-table/datatable";
import { storeToRefs } from "pinia";
definePageMeta({
  middleware: "auth",
  permission: "customerRates.index"
})
const permissionStore = usePermissionStore()

const { submitForm, headers, bankList, fetchBanks, deleteBank, pagination } = useCustomerRate();

  const { pageNo, itemsPerPage, updateItemsPerPage, loadPage } = usePagination(fetchBanks, {
  initialPage: 1,
  initialPerPage: 10,
});

const {
  loading,
  showLoading,
  hideLoading,
  showSuccess,
  showError,
  confirmAction,
} = useUiFeedback();

const { $axios } = useNuxtApp();
const countryCurrencyStore = useCountryCurrencyStore();
const { sending_countries, receiving_countries } = storeToRefs(countryCurrencyStore);

const customer_id = ref(null);
const s_country = ref("all");
const r_country = ref("all");
const promotionalType = ref("all");
const rate = ref("all");
const expire = ref(null);
const userList = ref([]);
const viewRates = ref(false);

const deleteUser = async (id) => {
  await deleteBank(id);
};

const search = () => {
  const filterParams = {
    customer_id: customer_id.value,
    sending_country_id: s_country.value !== "all" ? s_country.value : null,
    receiving_country_id: r_country.value !== "all" ? r_country.value : null,
    promotional_type: promotionalType.value !== "all" ? promotionalType.value : null,
    rate_type: rate.value !== "all" ? rate.value : null,
    expiry_date: expire.value ? expire.value : null,
  };

  // Clean out nulls so backend doesn’t get empty filters
  const cleanedParams = Object.fromEntries(
    Object.entries(filterParams).filter(([_, v]) => v !== null)
  );

  fetchBanks(cleanedParams);
};

const customerRateData = ref(null);

const viewCustomerRate = async (id) => {
  try {
    showLoading("Fetching customer rate...");
    const res = await $axios.get(`/customerRates/${id}`);
    customerRateData.value = res.data;
    viewRates.value = true;
  } catch (error) {
    console.error("Error fetching customer rate:", error);
    showError("Failed to load customer rate.");
  } finally {
    hideLoading();
  }
};

const resetFilters = () => {
  s_country.value = "all";
  r_country.value = "all";
  promotionalType.value = "all";
  rate.value = "all";
  customer_id.value = null;
  expire.value = null;

  fetchBanks();
};

const ratesItem = ref([
  {
    title: "All",
    value: "all",
  },
  {
    title: "Increment",
    value: "increment",
  },
  {
    title: "Decrement",
    value: "decrement",
  },
]);

const promotionalItem = ref([
  {
    title: "All",
    value: "all",
  },
  {
    title: "Country",
    value: "country",
  },
  {
    title: "Customer",
    value: "customer",
  },
]);

onMounted(() => {
  userList.value = JSON.parse(JSON.stringify(data));
});

const isRateExpired = computed(() => {
  const rawDate = customerRateData.value?.data?.expiry_date;
  if (!rawDate) return false;

  // Expecting "21-06-2025"
  const [day, month, year] = rawDate.split("-").map(Number);
  const expiry = new Date(year, month - 1, day); // JS months are 0-based
  const today = new Date();

  return expiry < today;
});

</script>
<template>
  <v-card>

     <v-card-title class="border-b-sm">
     <h4 class="text-h5 py-3">Search Customer Rates</h4>
    </v-card-title>
    <v-card-text class="pt-1 my-4 mb-0 pb-5 border-b-sm" v-if="permissionStore.hasPermission('customerRates.search')">
      <v-row class="ps-0">
        <v-col cols="12" sm="6" md="3">
          <span class="fs-15 label-color font-weight-medium">Promotional Type</span>
          <AppAutocomplete :items="promotionalItem" v-model="promotionalType" placeholder="Select country" />
        </v-col>
        <v-col cols="12" sm="6" md="3">
          <span class="fs-15 label-color font-weight-medium">Customer Id</span>
          <AppTextField name="customer_id" v-model="customer_id" placeholder="Customer Id" autocomplete="off" />
        </v-col>
        <v-col cols="12" sm="6" md="3">
          <span class="fs-15 label-color font-weight-medium">Sending Country</span>
          <AppAutocomplete :items="sending_countries" v-model="s_country" item-title="name" item-value="id"
            placeholder="Select country" />
        </v-col>
        <v-col cols="12" sm="6" md="3">
          <span class="fs-15 label-color font-weight-medium">Receiving Country</span>
          <AppAutocomplete :items="receiving_countries" v-model="r_country" item-title="name" item-value="id"
            placeholder="Select country" />
        </v-col>
        <v-col cols="12" sm="6" md="3">
          <span class="fs-15 label-color font-weight-medium">Expire Date</span>
          <AppDateTimePicker name="expire" v-model="expire" placeholder="dd/mm/yyyy"
            :config="{ dateFormat: 'd-m-Y' }" />
        </v-col>
        <v-col cols="12" sm="6" md="3">
          <span class="fs-15 label-color font-weight-medium">Rate Type</span>
          <AppAutocomplete :items="ratesItem" v-model="rate" placeholder="Select country" />
        </v-col>
        <v-col cols="12 d-flex gap-2 align-end justify-start" sm="6" md="3">
          <VBtn @click="search" class="login-btn" variant="tonal"> Search </VBtn>
          <VBtn @click="resetFilters" color="secondary" variant="tonal"> Reset </VBtn>
        </v-col>
      </v-row>
    </v-card-text>
    <VCardText class="flex-wrap gap-4 d-flex justify-space-between align-center pb-2">
      <div class="me-3 d-flex gap-3 pt-6">
        <ItemsPerPageSelector
          v-model="itemsPerPage"
          @update:model-value="updateItemsPerPage"
        />
      </div>
      <div class="gap-3 pt-3">
        <VBtn variant="elevated" color="primary" :to="'/promotions/customer-rate/add-rates'" v-if="permissionStore.hasPermission('customerRates.store')">
          Add Customer Rates
        </VBtn>
      </div>
    </VCardText>

    <VCardText class="px-0 border-t-sm">
    <VDatableComponent
        :headers="headers"
        :items="bankList"
        :loading="loading"
        :search="search"
        :pagination="pagination"
        :pageNo="pageNo"
        @update:pageNo="pageNo = $event"
      >
        <template #item.customer_id="{ item }">
          <div class="fs-13 text-wrap">
            <template v-if="item.customer_id">
              <VBtn variant="text" color="primary" target="_blank" :to="`/customers/view/${item.customer_id}`"
                class="pa-0 min-w-0">
                <u>{{ item.customer_id }}</u>
              </VBtn>
            </template>
            <template v-else>
              <span>---</span>
            </template>
          </div>
        </template>

        <template #item.action="{ item }">
          <div class="d-flex gap-1">
            <VBtn icon variant="text" color="medium-emphasis" @click="viewCustomerRate(item.id)" v-if="permissionStore.hasPermission('customerRates.show')">
              <VIcon icon="tabler-eye" />
            </VBtn>
            <VBtn icon variant="text" color="medium-emphasis" :to="`/promotions/customer-rate/edit-rates/${item.id}`">
              <VIcon icon="tabler-edit" v-if="permissionStore.hasPermission('customerRates.update')" />
            </VBtn>

            <IconBtn @click="deleteUser(item.id)" class="d-none">
              <VIcon icon="tabler-trash" />
            </IconBtn>
          </div>
        </template>
      </VDatableComponent>
    </VCardText>
  </v-card>
  <div class="text-center">
    <v-dialog v-model="viewRates" max-width="900" transition="scale-transition">
      <v-card>
        <v-row>
          <v-col cols="12">
            <v-card-title class="d-flex align-center border-b-sm justify-space-between">
              <h5 class="text-h4 py-1">
                View Customer Rate
                <span :class="isRateExpired ? 'text-error' : 'text-success'">
                  {{ isRateExpired ? "Expired" : "(Active)" }}
                </span>
              </h5>

              <IconBtn @click="viewRates = false">
                <VIcon icon="tabler-x" />
              </IconBtn>
            </v-card-title>
          </v-col>
        </v-row>
        <V-card-text class="pt-0 px-0 pb-0">
          <VDataTable hide-default-footer class="Tablebody border-b">
            <tbody v-if="customerRateData && customerRateData.data">
              <tr>
                <td class="font-weight-bold">Sending Country</td>
                <td>
                  {{ customerRateData.data.sending_country || "---" }}
                </td>
                <td class="font-weight-bold">Receiving Country</td>
                <td>
                  {{ customerRateData.data.receiving_country || "---" }}
                </td>
              </tr>
              <tr>
                <td class="font-weight-bold">Customer ID</td>
                <td>{{ customerRateData.data.customer?.id || "---" }}</td>
                <td class="font-weight-bold">Customer Name</td>
                <td>
                  {{ customerRateData.data.customer?.user?.name || "---" }}
                </td>
              </tr>
              <tr>
                <td class="font-weight-bold">Type</td>
                <td>{{ customerRateData.data.rate_type }}</td>
                <td class="font-weight-bold">Rate</td>
                <td>{{ customerRateData.data.rate }}</td>
              </tr>
              <tr>
                <td class="font-weight-bold">Min Amount</td>
                <td>{{ customerRateData.data.minimum_sending_amount }}</td>
                <td class="font-weight-bold">Max Amount</td>
                <td>{{ customerRateData.data.maximum_sending_amount }}</td>
              </tr>
              <tr>
                <td class="font-weight-bold">No. of Trans.</td>
                <td>{{ customerRateData.data.no_of_transactions }}</td>
                <td class="font-weight-bold">Expiry Date</td>
                <td class="text-success">
                  {{ customerRateData.data.expiry_date }}
                </td>
              </tr>
              <tr>
                <td class="font-weight-bold">Verified Status</td>
                <td>{{ customerRateData.data.verified_status || "---" }}</td>
                <td class="font-weight-bold">Days Since Trans.</td>
                <td>
                  {{ customerRateData.data.days_since_transaction || "---" }}
                </td>
              </tr>
              <tr>
                <td class="font-weight-bold">Signup From</td>
                <td>{{ customerRateData.data.signup_from || "---" }}</td>
                <td class="font-weight-bold">Signup To</td>
                <td>{{ customerRateData.data.signup_to || "---" }}</td>
              </tr>
              <tr>
                <td class="font-weight-bold">Sales Code</td>
                <td>
                  {{ customerRateData.data.sales_code || "---" }}
                </td>
              </tr>
            </tbody>
          </VDataTable>
        </V-card-text>
        <v-row>
          <v-col cols="12">
            <v-card-title class="d-flex align-center justify-end">
              <VBtn @click="viewRates = false" color="secondary" variant="tonal">
                Close
              </VBtn>
            </v-card-title>
          </v-col>
        </v-row>
      </v-card>
    </v-dialog>
  </div>
</template>
