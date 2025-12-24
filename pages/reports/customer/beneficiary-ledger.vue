<script setup>
import { useBeneficiaryLedger } from "@/composables/reports/useBeneficiaryLedger";
definePageMeta({
  middleware: "auth",
  permission: "beneficiary.ledger.report"
})
const { userList, loading, showData, fetchBeneficiaryLedger } =
  useBeneficiaryLedger();
const options = ref({
  page: 1,
  itemsPerPage: 5,
  sortBy: [""],
  sortDesc: [false],
});
const formkey = ref(null);
const form = reactive({
  customer_id: ""
});
const resetFilters = () => {
  customer_id.value = null
  showData.value = false
};



const headers = [{
  title: "#",
  key: "sr_no",
},
{
  title: "Date",
  key: "created_at",
},
{
  title: "Pin",
  key: "transaction_code",
},
{
  title: "Bene Name",
  key: "bene_name",
},
{
  title: "Bene Relation",
  key: "bene_relation",
},
{
  title: "Contact #",
  key: "bene_phone",
},
{
  title: "Sending Method",
  key: "sending_method",
},
{
  title: "Sending Purpose",
  key: "sending_reason",
},
{
  title: "Sending Amount",
  key: "sending_amount",
}
];

</script>
<template>
  <v-card>
    <v-row>
      <v-col cols="12">
        <v-card-title class="border-b-sm">
          <h4 class="text-h5 py-3">Beneficiary Ledger Report</h4>
        </v-card-title>
      </v-col>
    </v-row>

    <v-card-text class="pt-1 my-4 pb-3">
      <VForm @submit.prevent="" :key="formkey">
        <v-row class="ps-0">
          <v-col cols="12" sm="6" md="3">
            <span class="fs-15 label-color font-weight-medium">Customer Id<span class="text-red">*</span></span>
            <AppTextField name="id" type="number" v-model="form.customer_id" placeholder="Customer id"
              :rules="[requiredValidator]" autocomplete="off" />
          </v-col>
          <v-col cols="12 d-flex gap-2 pt-md-8 justify-start" sm="6" md="3">
            <VBtn @click="fetchBeneficiaryLedger(form)" type="submit" class="login-btn" variant="tonal">
              search
            </VBtn>
            <VBtn @click="resetFilters" type="reset" color="secondary" variant="tonal">
              Reset
            </VBtn>
          </v-col>
        </v-row>
      </VForm>
    </v-card-text>
    <VCardText class="flex-wrap gap-4 d-flex align-center border-t-sm" v-if="showData">
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

    <VCardText class="px-0" v-if="showData">
      <PaginatedDataTable :headers="headers" :items="userList" :options="options" :loading="loading" :search="search"
        @update:options="options = $event">
        <template #item.transaction_code="{ item }">
          <NuxtLink :to="`payments/detail/${item.id}`" target="_blank">{{ item.transaction_code }}</NuxtLink>
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
