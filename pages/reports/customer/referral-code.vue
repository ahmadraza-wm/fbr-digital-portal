<script setup>
import { ref, reactive } from 'vue';
const countryCurrencyStore = useCountryCurrencyStore();
const { countries } =
  storeToRefs(countryCurrencyStore);
import data from "@/views/demos/forms/tables/data-table/datatable";
const country = ref(null)
const name = ref(null)
const code = ref(null)
const userList = ref([]);
const options = ref({
  page: 1,
  itemsPerPage: 5,
  sortBy: [""],
  sortDesc: [false],
});

const search = () => {

};

const resetFilters = () => {
  name.value = null
  country.value = null
  code.value = null
};

const countryItem = ref([{
  title: "Canada",
  value: "canada"
},
{
  title: "Ireland",
  value: "ireland"
},
{
  title: "Switzerland",
  value: "switzerland"
}
])

const copiedCodeMap = reactive({})

const copyToClipboard = (text, index) => {
  navigator.clipboard.writeText(text).then(() => {
    copiedCodeMap[index] = true
    setTimeout(() => {
      copiedCodeMap[index] = false
    }, 2000) // 2 seconds delay
  })
}

const headers = [{
  title: "#",
  key: "sr_no",
},
{
  title: "Referral Code",
  key: "code",
},
{
  title: "Customer",
  key: "customer_id",
},
{
  title: "Customer Email",
  key: "c_email",
},
{
  title: "Customer Status",
  key: "status",
},
{
  title: "Customer Verified",
  key: "verify",
},
{
  title: "Agent Name",
  key: "fullName",
},
{
  title: "Country",
  key: "country",
},
{
  title: "Agent Email",
  key: "email",
},
{
  title: "Agent Phone",
  key: "phone",
},
{
  title: "Copy Code",
  key: "action",
}
];

onMounted(() => {
  userList.value = JSON.parse(JSON.stringify(data));
});
</script>
<template>
  <v-card>
    <v-row>
      <v-col cols="12">
        <v-card-title class="border-b-sm">
          <h4 class="text-h5 py-3">Referral Code Details Report</h4>
        </v-card-title>
      </v-col>
    </v-row>
    <v-card-text class="pt-1 my-4 pb-3">
      <VForm @submit.prevent="">
        <v-row class="ps-0">
          <v-col cols="12" sm="6" md="3">
            <span class="fs-15 label-color font-weight-medium">Country</span>
            <AppAutocomplete :items="countries" item-title="name" item-value="id" v-model="country"
              placeholder="Select country" />
          </v-col>
          <v-col cols="12" sm="6" md="3">
            <span class="fs-15 label-color font-weight-medium">Agent Name</span>
            <AppTextField name="name" type="text" v-model="name" placeholder="Agent name" autocomplete="off" />
          </v-col>
          <v-col cols="12" sm="6" md="3">
            <span class="fs-15 label-color font-weight-medium">Referral Code</span>
            <AppTextField name="code" type="text" v-model="code" placeholder="Search referral code" autocomplete="off" />
          </v-col>
          <v-col cols="12 d-flex gap-2 pt-md-8 justify-start" sm="6" md="3">
            <VBtn @click="search" type="submit" class="login-btn" variant="tonal">
              search
            </VBtn>
            <VBtn @click="resetFilters" type="reset" color="secondary" variant="tonal">
              Reset
            </VBtn>
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
        <template #item.customer_id="{ item }">
          <div class="fs-13 text-wrap">
            talha waris -
            <VBtn variant="text" color="primary" target="_blank" class="fs-13" to="/customers/view/1">
              <u>01</u>
            </VBtn>
          </div>
        </template>
        <template #item.code="{ item }">
          <div class="fs-13 text-wrap">
            MT001
          </div>
        </template>
        <template #item.c_email="{ item }">
          <div class="fs-13 text-wrap">
            talha8018+1@gmail.com
          </div>
        </template>
        <template #item.status="{ item }">
          <div class="fs-13 text-wrap">
            <VChip :color="item.status === 1 ? 'success' : 'error'" size="small">
              {{ item.status === 1 ? 'Active' : 'Inactive' }}</VChip>
          </div>
        </template>
        <template #item.verify="{ item }">
          <div class="fs-13 text-wrap">
            <VChip :color="item.status === 1 ? 'success' : 'error'" size="small">
              {{ item.status === 1 ? 'Verified' : ' Unverified' }}</VChip>
          </div>
        </template>
        <template #item.country="{ item }">
          <div class="fs-13 text-wrap">Pakistan</div>
        </template>
        <template #item.phone="{ item }">
          <div class="fs-13 text-wrap">+442147483647</div>
        </template>
        <template #item.action="{ item, index }">
          <div class="d-flex align-center gap-2 fs-13 text-wrap">
            <VBtn icon variant="plain" color="primary" @click="copyToClipboard(item.status, index)">
              <VIcon :icon="copiedCodeMap[index] ? 'tabler-check' : 'tabler-copy'" size="20" />
              <v-tooltip activator="parent" location="top">
                {{ copiedCodeMap[index] ? 'Copied!' : 'Copy Code' }}
              </v-tooltip>
            </VBtn>
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
