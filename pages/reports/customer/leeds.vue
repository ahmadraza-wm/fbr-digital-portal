<script setup>
import { useCustomerLeeds } from "@/composables/reports/useCustomerLeeds";
import { onMounted } from "vue";
definePageMeta({
  middleware: "auth",
  permission: "customer.leeds.report"
})
const permissionStore = usePermissionStore()
const filters = reactive({
  sending_country_id: null,
  receiving_country_id: null,
  email: null,
  phone_number: null,
  promo_code: null,
});

const options = ref({
  page: 1,
  itemsPerPage: 5,
  sortBy: [""],
  sortDesc: [false],
});
const { customer_leeds, fetchCustomerLeeds, sending_countries, receiving_countries, exportCustomerLeeds, loading } = useCustomerLeeds();
const resetFilters = () => {
  filters.sending_country_id = null;
  filters.receiving_country_id = null;
  filters.phone_number = null;
  filters.email = null;
  filters.promo_code = null;
  fetchCustomerLeeds();
}


const headers = [{
  title: "#",
  key: "sr_no",
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
  title: "Email",
  key: "email",
},
{
  title: "Phone",
  key: "phone_number",
},
{
  title: "Promo Code",
  key: "promo_code",
}
];

onMounted(() => {
  fetchCustomerLeeds();
});

</script>
<template>
  <v-card>
    <v-row>
      <v-col cols="12">
        <v-card-title class="border-b-sm">
          <h4 class="text-h5 py-3">Customer Leeds Report</h4>
        </v-card-title>
      </v-col>
    </v-row>

    <v-card-text class="pt-1 my-4 pb-3">
      <v-row class="ps-0">
        <v-col cols="12" sm="6" md="3">
          <span class="fs-15 label-color font-weight-medium">Sending Country</span>
          <AppAutocomplete :items="sending_countries" item-title="name" item-value="id"
            v-model="filters.sending_country_id" placeholder="Select country" />
        </v-col>
        <v-col cols="12" sm="6" md="3">
          <span class="fs-15 label-color font-weight-medium">Receiving Country</span>
          <AppAutocomplete :items="receiving_countries" item-title="name" item-value="id"
            v-model="filters.receiving_country_id" placeholder="Select country" />
        </v-col>
        <v-col cols="12" sm="6" md="3">
          <span class="fs-15 label-color font-weight-medium">Email</span>
          <AppTextField name="email" type="email" v-model="filters.email" placeholder="Email" autocomplete="off" />
        </v-col>
        <v-col cols="12" sm="6" md="3">
          <span class="fs-15 label-color font-weight-medium">Phone</span>
          <AppTextField name="phone" type="number" v-model="filters.phone_number" placeholder="Phone" />
        </v-col>
        <v-col cols="12" sm="6" md="3">
          <span class="fs-15 label-color font-weight-medium">Promo Code</span>
          <AppTextField name="promo" type="text" v-model="filters.promo_code" placeholder="Promo code" />
        </v-col>
        <v-col cols="12 d-flex gap-2 align-end justify-start" sm="6" md="3">
          <VBtn @click="fetchCustomerLeeds(filters)" type="submit" class="login-btn" variant="tonal">
            search
          </VBtn>
          <VBtn @click="resetFilters" type="reset" color="secondary" variant="tonal">
            Reset
          </VBtn>
        </v-col>
      </v-row>
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
      <div class="gap-3 pt-6" v-if="permissionStore.hasPermission('customer.leeds.report.export')">
        <VBtn variant="tonal" color="secondary" @click="exportCustomerLeeds(form)">
          <VIcon icon="tabler-upload" class="mr-1" />
          Export Csv
        </VBtn>
      </div>
    </VCardText>

    <VCardText class="px-0">
      <PaginatedDataTable :headers="headers" :items="customer_leeds" :options="options" :loading="loading"
        @update:options="options = $event">
        <!-- <template #item.customer_id="{ item }">
          <div class="fs-13 text-wrap">
            <VBtn variant="text" color="primary" target="_blank" to="/customers/view/1">
              <u>01</u>
            </VBtn>
          </div>
        </template> -->
        <template #item.sending_country="{ item }">
          <div class="fs-13 text-wrap">{{ item.sending_country }}</div>
        </template>
        <template #item.receiving_country="{ item }">
          <div class="fs-13 text-wrap">{{ item.receiving_country }}</div>
        </template>
        <template #item.email="{ item }">
          <div class="fs-13 text-wrap">
            {{ item.email }}
          </div>
        </template>
        <template #item.phone_number="{ item }">
          <div class="fs-13 text-wrap">
            {{ item.phone_number }}
          </div>
        </template>
        <template #item.promo_code="{ item }">
          <div class="fs-13 text-wrap">
            {{ item.promo_code }}
          </div>
        </template>
        <template #bottom>
          <VCardText class="pt-2 pb-0">
            <div class="d-flex flex-wrap justify-space-between align-center gap-y-2 mt-2">
              <span class="text-caption text-muted">
                Showing
                {{ (options.page - 1) * options.itemsPerPage + 1 }}
                to
                {{ Math.min(options.page * options.itemsPerPage, customer_leeds.length) }}
                of {{ customer_leeds.length }} entries
              </span>
              <VPagination v-model="options.page" :total-visible="$vuetify.display.smAndDown ? 3 : 5"
                :length="Math.ceil(customer_leeds.length / options.itemsPerPage)" />
            </div>
          </VCardText>
        </template>
      </PaginatedDataTable>
    </VCardText>
  </v-card>
</template>
