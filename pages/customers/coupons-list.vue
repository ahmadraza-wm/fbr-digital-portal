<script setup>
import { useCustomerCoupon } from "@/composables/useCustomerCoupon";
import data from "@/views/demos/forms/tables/data-table/datatable";
const countryCurrencyStore = useCountryCurrencyStore();
const { sending_countries, receiving_countries } = storeToRefs(countryCurrencyStore);
const permissionStore = usePermissionStore()
definePageMeta({
  middleware: "auth",
  permission: "customer.coupons.index"
})
import AuditLog from '@/components/AuditLog.vue'

const coupon_code = ref(null);
const sending_country_id = ref('all')
const receiving_country_id = ref('all')
const sending_methods = ref('all')
const receiving_methods = ref('all')


const resetFilters = () => {
  sending_country_id.value = 'all'
  receiving_country_id.value = 'all'
  sending_methods.value = 'all'
  receiving_methods.value = 'all'
  coupon_code.value = null

  fetchCustomerCoupons()
};

const selectedId = ref(null)

const openAuditLog = (item) => {
  if (selectedId.value === item.id) {
    selectedId.value = null
  } else {
    selectedId.value = item.id
  }
}


const options = ref({
  page: 1,
  itemsPerPage: 5,
  sortBy: [""],
  sortDesc: [false],
});

const smethodItem = ref([
  { title: "All", value: "all" },
  { title: "Bank Transfer", value: "Bank Transfer" },
  { title: "PAY BY CARD (Debit/Credit)", value: "PAY BY CARD (Debit/Credit)" },
  { title: "Credit Card", value: "Credit Card" },
  { title: "PAY BY INTRAC", value: "PAY BY INTRAC" },
  { title: "Digital Wallet", value: "Digital Wallet" }
])


const rmethodItem = ref([
  { title: "All", value: "all" },
  { title: "Bank", value: "bank" },
  { title: "Cash", value: "cash" },
  { title: "Mobile Wallet", value: "mobile_wallet" }
])


const {

  fetchCustomerCoupons,
  customercoupons,
  deleteCoupon,
  filterCustomerCoupons,
  pagination,
} = useCustomerCoupon()

const { pageNo, itemsPerPage, updateItemsPerPage, loadPage } = usePagination(
  fetchCustomerCoupons,
  {
    initialPage: 1,
    initialPerPage: 10,
  }
);

const headers = [
  {
    title: "#",
    key: "sr_no",
  },
  {
    title: "Coupon Code",
    key: "coupon_code",
  },
  {
    title: "Customer",
    key: "customer_names",
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
    title: "Sending Method",
    key: "sending_methods",
  },
  {
    title: "Receiving Method",
    key: "receiving_methods",
  },
  {
    title: "Discount Type",
    key: "discount_type",
  },
  {
    title: "Value (%)",
    key: "discount_value",
  },
  {
    title: "Min. Sending Amount",
    key: "min_sending_amount",
  },
  {
    title: "Start At",
    key: "starts_at",
  },
  {
    title: "Expire At",
    key: "expires_at",
  },
  {
    title: "ACTION",
    key: "action",
  },
];


const search = () => {
  const filterParams = {};

  if (coupon_code.value && coupon_code.value.trim() !== '') {
    filterParams.coupon_code = coupon_code.value.trim();
  }

  if (sending_country_id.value && sending_country_id.value !== 'all') {
    filterParams.sending_country_id = sending_country_id.value;
  }

  if (receiving_country_id.value && receiving_country_id.value !== 'all') {
    filterParams.receiving_country_id = receiving_country_id.value;
  }

  if (sending_methods.value && sending_methods.value !== 'all') {
    filterParams.sending_methods = sending_methods.value;
  }

  if (receiving_methods.value && receiving_methods.value !== 'all') {
    filterParams.receiving_methods = receiving_methods.value;
  }

  filterCustomerCoupons(filterParams);
};

</script>
<template>
  <v-card>
    <v-row>
      <v-col cols="12">
        <v-card-title class="border-b-sm">
          <h4 class="text-h5 py-3">Search Coupon</h4>
        </v-card-title>
      </v-col>
    </v-row>

    <v-card-text class="pt-1 my-4 pb-3">
      <v-row class="ps-0">
        <v-col cols="12" sm="6" md="3">
          <span class="fs-15 label-color font-weight-medium">Coupon Code</span>
          <AppTextField name="code" v-model="coupon_code" placeholder="Coupon code" autocomplete="off" />
        </v-col>
        <v-col cols="12" sm="6" md="3">
          <span class="fs-15 label-color font-weight-medium">Sending Country</span>
          <AppAutocomplete :items="sending_countries" item-title="name" item-value="id" v-model="sending_country_id"
            placeholder="Select country" />
        </v-col>
        <v-col cols="12" sm="6" md="3">
          <span class="fs-15 label-color font-weight-medium">Receiving Country</span>
          <AppAutocomplete :items="receiving_countries" item-title="name" item-value="id" v-model="receiving_country_id"
            placeholder="Select country" />
        </v-col>
        <v-col cols="12" sm="6" md="3">
          <span class="fs-15 label-color font-weight-medium">Sending Method</span>
          <AppAutocomplete :items="smethodItem" v-model="sending_methods" placeholder="Select method" />
        </v-col>
        <v-col cols="12" sm="6" md="3">
          <span class="fs-15 label-color font-weight-medium">Receiving Method</span>
          <AppAutocomplete :items="rmethodItem" v-model="receiving_methods" placeholder="Select method" />
        </v-col>
        <v-col cols="12 d-flex gap-2 align-end justify-start" sm="6" md="3">
          <VBtn @click="search" type="submit" class="login-btn" variant="tonal">
            search
          </VBtn>
          <VBtn @click="resetFilters" type="reset" color="secondary" variant="tonal">
            Reset
          </VBtn>
        </v-col>
      </v-row>
    </v-card-text>
    <VCardText class="flex-wrap gap-4 d-flex justify-space-between align-center border-t-sm border-b-sm pb-3">
      <div class="me-3 d-flex gap-3 pt-6">
        <ItemsPerPageSelector
          v-model="itemsPerPage"
          @update:model-value="updateItemsPerPage"
        />
      </div>
      <div class="gap-3 pt-3" v-if="permissionStore.hasPermission('customer.coupons.store')">
        <VBtn variant="elevated" color="primary" to="/customers/add-coupon">
          Add Coupon
        </VBtn>
      </div>
    </VCardText>

    <VCardText class="px-0 pb-0">
      <VDatableComponent
        :headers="headers"
        :items="customercoupons"
        :loading="loading"
        :search="search"
        :pagination="pagination"
        :pageNo="pageNo"
        @update:pageNo="pageNo = $event"
      >

       <template #item.action="{ item }">
             <VBtn
                icon
                variant="text"
                color="medium-emphasis"
                @click="openAuditLog(item)"
              >
                <VIcon icon="tabler-history" />
              </VBtn>
       </template>
      </VDatableComponent>
    </VCardText>
  </v-card>
  <AuditLog v-if="selectedId" module="CustomerCoupon" :id="selectedId" class="mt-4" />

</template>

