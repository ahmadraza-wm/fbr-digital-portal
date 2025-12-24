<script setup>
import AuditLog from '@/components/AuditLog.vue';
const countryCurrencyStore = useCountryCurrencyStore();
const { countries, currencies } = storeToRefs(countryCurrencyStore);
const del = ref(false)
const userList = ref([]);
const partner = ref('all')
const country_id = ref('all')
const method = ref('all')
const type = ref('all')
const amount = ref('')

const partneritem = ref([
  { label: 'All', value: 'all' },
  { label: 'JS Bank File (PKR)', value: 1 },
  { label: 'Test buyer (GMD)', value: 3 },
  { label: 'GCC Remit (GBP)', value: 4 },
  { label: 'JS Bank Online (PKR)', value: 5 },
  { label: 'JS Bank Agent (PKR)', value: 6 },
  { label: 'Naira Gram GBP (GBP)', value: 7 },
  { label: 'ABL Online (PKR)', value: 8 },
  { label: 'ABL Offline (PKR)', value: 9 },
  { label: 'UBL Bank File (PKR)', value: 10 }
]);

const methoditem = ref([
  { title: "All", value: "all" },
  { title: "Bank", value: "bank" },
  { title: "Cash", value: "cash" },
  { title: "Mobile Wallet", value: "mobile_wallet" },
])

const typeitem = ref([
  { title: "All", value: "all" },
  { title: "Fixed", value: "fixed" },
  { title: "Percentage", value: "percentage" },
])

const options = ref({
  page: 1,
  itemsPerPage: 5,
  sortBy: [""],
  sortDesc: [false],
});

const resolveStatusVariant = (status) => {
  if (status === 1)
    return {
      color: "primary",
      text: "Current",
    };
  else if (status === 2)
    return {
      color: "success",
      text: "Professional",
    };
  else if (status === 3)
    return {
      color: "error",
      text: "Rejected",
    };
  else if (status === 4)
    return {
      color: "warning",
      text: "Resigned",
    };
  else
    return {
      color: "info",
      text: "Applied",
    };
};

const countriesWithAll = computed(() => {
  return [{ id: 'all', name: 'All' }, ...countries.value];
});



const resetFilters = () => {
  partner.value = "all"
  country_id.value = "all"
  method.value = "all"
  type.value = "all"
  amount.value = ''
}

</script>
<template>
  <v-card>
    <v-row>
      <v-col cols="12">
        <v-card-title class="border-b-sm">
          <h4 class="text-h5 py-3">Partner Commission</h4>
        </v-card-title>
      </v-col>
    </v-row>

    <v-card-text class="pt-1 my-4 pb-3">
      <v-row class="ps-0">
        <v-col cols="12" sm="6" md="3">
          <span class="fs-15 label-color font-weight-medium">Partner</span>
          <AppAutocomplete :items="partneritem" item-title="label" item-value="value" v-model="partner"
            placeholder="Select partner" />
        </v-col>
        <v-col cols="12" sm="6" md="3">
          <span class="fs-15 label-color font-weight-medium">Country</span>
          <AppAutocomplete :items="countriesWithAll" item-title="name" item-value="id" v-model="country_id"
            placeholder="Select country">
            <option value="all">All</option>
          </AppAutocomplete>
        </v-col>
        <v-col cols="12" sm="6" md="3">
          <span class="fs-15 label-color font-weight-medium">Method</span>
          <AppAutocomplete :items="methoditem" placeholder="All" v-model="method" />
        </v-col>
        <v-col cols="12" sm="6" md="3">
          <span class="fs-15 label-color font-weight-medium">Type</span>
          <AppAutocomplete :items="typeitem" placeholder="All" v-model="type" />
        </v-col>
        <v-col cols="12" sm="6" md="3">
          <span class="fs-15 label-color font-weight-medium">Commission Amount</span>
          <AppTextField name="amount" v-model="amount" placeholder="Commission amount" autocomplete="off" />
        </v-col>
        <v-col cols="12 d-flex gap-2 align-end justify-start" sm="10" md="4">
          <VBtn type="submit" class="login-btn" variant="tonal">
            search
          </VBtn>
          <VBtn type="reset" color="secondary" variant="tonal" @click="resetFilters">
            Reset
          </VBtn>
        </v-col>
      </v-row>
    </v-card-text>
    <VCardText class="flex-wrap gap-4 d-flex justify-space-between align-center border-t-sm">
      <div class="me-3 d-flex gap-3 pt-6">
        <span class="fs-16 pt-2">Show</span>
        <AppSelect v-model="options.itemsPerPage" :items="[
          { value: 5, title: '5' },
          { value: 10, title: '10' },
          { value: 25, title: '25' },
          { value: 50, title: '50' },
          { value: 100, title: '100' },
          { value: -1, title: 'All' },
        ]" style="inline-size: 6.25rem;" @update:model-value="itemsPerPage = parseInt($event, 10)" />
      </div>
      <div class="gap-3 pt-6">
        <VBtn variant="elevated" :to="`/partners/add-commission`" color="primary">
          Add Partner Commission
        </VBtn>
      </div>
    </VCardText>

    <VCardText class="px-0 pb-0">
      <VTable :options="options" @update:options="options = $event" class="border-t">
        <thead>
          <tr>
            <th>#</th>
            <th>Partner Name</th>
            <th>Country</th>
            <th>Method</th>
            <th>Type</th>
            <th>Commission Amount</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>1</td>
            <td>Naira Gram GBP</td>
            <td>Benin</td>
            <td>Mobile Wallet</td>
            <td>Fixed</td>
            <td>0.90</td>
            <td>
              <VBtn icon variant="text" color="medium-emphasis" to="/partners/edit-commission">
                <VIcon icon="tabler-edit" />
              </VBtn>
              <VBtn icon variant="text" color="medium-emphasis" @click="del = true" class="d-none">
                <VIcon icon="tabler-trash" />
              </VBtn>
            </td>
          </tr>
          <tr class="listtbody">
            <td :rowspan="2">2</td>
            <td :rowspan="2">Naira Gram GBP</td>
            <td :rowspan="2" class="border-e">Canada</td>
            <td>Cash</td>
            <td>Fixed</td>
            <td>0.91</td>
            <td :rowspan="2" class="border-s">
              <VBtn icon variant="text" color="medium-emphasis" to="/partners/edit-commission">
                <VIcon icon="tabler-edit" />
              </VBtn>
              <VBtn icon variant="text" color="medium-emphasis" @click="del = true" class="d-none">
                <VIcon icon="tabler-trash" />
              </VBtn>
            </td>
          </tr>
          <tr class="listtbody">
            <td>Mobile Wallet</td>
            <td>Fixed</td>
            <td>0.90</td>
          </tr>
          <tr>
            <td>3</td>
            <td>Naira Gram GBP</td>
            <td>Pakistan</td>
            <td>Mobile Wallet</td>
            <td>Fixed</td>
            <td>0.90</td>
            <td>
              <VBtn icon variant="text" color="medium-emphasis" to="/partners/edit-commission">
                <VIcon icon="tabler-edit" />
              </VBtn>
              <VBtn icon variant="text" color="medium-emphasis" @click="del = true" class="d-none">
                <VIcon icon="tabler-trash" />
              </VBtn>
            </td>
          </tr>
        </tbody>
      </VTable>
    </VCardText>
  </v-card>
  <AuditLog />
  <v-dialog v-model="del" max-width="550" persistent transition="scale-transition">
    <v-card>
      <VCardTitle class="border-b">
        <h4 class="text-h4">Attention</h4>
      </VCardTitle>
      <VForm @submit.prevent="">
        <VCardText class="pt-2">
          <VRow>
            <VCol cols="12 pb-1">
              <span class="text-h5 text-error">
                Are you sure you want to delete this partner commission?
              </span>
            </VCol>
          </VRow>
        </VCardText>
        <VCardText class="border-t pb-3">
          <VRow class="pt-3">
            <VCol class="d-flex justify-end">
              <VBtn color="seconadry" variant="tonal" class="mr-2" @click="del = false">Discard</VBtn>
              <VBtn color="white" variant="elevated" type="submit" class="login-btn" @click="del = false">
                Approve</VBtn>
            </VCol>
          </VRow>
        </VCardText>
      </VForm>
    </v-card>
  </v-dialog>
</template>
<style lang="scss">
.listtbody {
  background-color: #f8f7fa;
}
</style>
