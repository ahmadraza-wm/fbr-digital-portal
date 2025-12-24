<script setup>
const dateRange = ref(null)
const formkey = ref(null)
const introCustomer = ref('')
const paidTransfer = ref('')
const displayData = ref(false)
const userList = ref([]);
const options = ref({
  page: 1,
  itemsPerPage: 5,
  sortBy: [""],
  sortDesc: [false],
});

const search = () => {
  if (introCustomer.value) {
    displayData.value = true
  }
}

const resetFilters = () => {
  dateRange.value = null
  introCustomer.value = ''
  paidTransfer.value = ''
  displayData.value = false
  formkey.value += 1
};

const introItem = ref([
  { title: "Please Select", value: "" },
  { title: "Bertin Tuma Tsonewa", value: "BT" }
])


const headers = [{
  title: "#",
  key: "sr_no",
},
{
  title: "Transfer Code",
  key: "code",
},
{
  title: "Sending Amount",
  key: "samount",
},
{
  title: "Receiving Amount",
  key: "ramount",
},
{
  title: "Sending Country",
  key: "scountry"
},
{
  title: "Receiving Country",
  key: "rcountry",
},
{
  title: "Status",
  key: "status",
},
{
  title: "Payment Date",
  key: "pdate",
},
{
  title: "Main Agent Rate",
  key: "mRate",
},
{
  title: "Agent Rate",
  key: "rate",
},
{
  title: "Customer Rate",
  key: "cRate",
},
{
  title: "Commission",
  key: "commission",
}
];
</script>
<template>
  <v-card>
    <v-row>
      <v-col cols="12">
        <v-card-title class="border-b-sm">
          <h4 class="text-h5 py-3">Commission For Introducer Report</h4>
        </v-card-title>
      </v-col>
    </v-row>
    <v-card-text class="pt-1 my-4 pb-3">
      <VForm @submit.prevent="" :key="formkey">
        <v-row class="ps-0">
          <v-col cols="12" sm="6" md="3">
            <span class="fs-15 label-color font-weight-medium">Introducer Customer<span class="text-red">*</span></span>
            <AppAutocomplete :items="introItem" v-model="introCustomer" placeholder="Select introducer customer"
              :rules="[requiredValidator]" />
          </v-col>
          <v-col cols="12" sm="6" md="3">
            <span class="fs-15 label-color font-weight-medium">Date Range</span>
            <AppDateRange class="cursor-pointer" placeholder="DD/MM/YYYY" v-model="dateRange" />
          </v-col>
          <v-col cols="12" sm="6" md="3">
            <span class="d-flex align-center fs-16 text-error mt-md-5">
              <VCheckbox value="paid_transfer" v-model="paidTransfer" /> Paid Transfers Only
            </span>
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
    <v-card-text class="px-0" v-if="displayData">
      <v-row class="mt-0">
        <v-col cols="12">
          <v-card-title class="border-b-sm border-t-sm py-4 d-flex justify-space-between align-center"
            style="background-color: lightgray;">
            <h4 class="text-h4 fw-bolder">Introducer Details</h4>
          </v-card-title>
        </v-col>
      </v-row>
      <v-row class="border-b-sm px-6">
        <v-col cols="12" sm="6" md="4" class="pb-1">
          <p class="font-weight-medium text-color mb-0 lh-22">
            Introducer Id</p>
          <p class="font-weight-medium mb-0 lh-22 text-color1">
            <VBtn variant="text" color="primary" target="_blank" to="/customers/view/1">
              <u>33323</u>
            </VBtn>
          </p>
        </v-col>
        <v-col cols="12" sm="6" md="4" class="pb-1">
          <p class="font-weight-medium text-color mb-0 lh-22">Introducer Name</p>
          <p class="font-weight-medium mb-0 lh-22 text-color1">
            Bertin Tuma Tsonewa Tuma Tsonewa
          </p>
        </v-col>
        <v-col cols="12" sm="6" md="4" class="pb-1">
          <p class="font-weight-medium text-color mb-0 lh-22">Introducer Email</p>
          <p class="font-weight-medium mb-0 lh-22 text-color1">
            bertintuma@yahoo.com
          </p>
        </v-col>
      </v-row>
      <v-row class="px-6">
        <v-col cols="12" sm="6" md="4" class="pb-1">
          <p class="font-weight-medium text-color mb-0 lh-22">
            Introducer Phone
          </p>
          <p class="font-weight-medium mb-0 lh-22 text-color1">
            +447858959999
          </p>
        </v-col>
        <v-col cols="12" sm="6" md="4" class="pb-1">
          <p class="font-weight-medium text-color mb-0 lh-22">Introducer Address</p>
          <p class="font-weight-medium mb-0 lh-22 text-color1">
            Bearwood Road Flat1, 223 Smethwick B664NA
          </p>
        </v-col>
      </v-row>
    </v-card-text>
    <v-row>
      <v-col cols="12">
        <v-card-title class="border-t-sm">
          <h4 class="text-h5 py-3">Payments Commission List</h4>
        </v-card-title>
      </v-col>
    </v-row>
    <VCardText class="flex-wrap gap-4 d-flex justify-space-between align-center border-t-sm">
      <div class="me-3 d-flex gap-3">
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
      <div class="gap-3 pt-6">
        <VBtn variant="elevated" color="secondary" v-if="userList.length">
          <VIcon icon="tabler-upload" class="mr-1" />
          Export.csv
        </VBtn>
      </div>
    </VCardText>

    <VCardText class="px-0">
      <PaginatedDataTable :headers="headers" :items="userList" :options="options" :loading="loading" :search="search"
        @update:options="options = $event">
        <template #item.code="{ item }">
          <div class="fs-13 text-wrap">
            03 Dec, 2024 07:21 pm
          </div>
        </template>
        <template #item.samount="{ item }">
          <div class="fs-13 text-wrap">

          </div>
        </template>
        <template #item.ramount="{ item }">
          <div class="fs-13 text-wrap text-break">

          </div>
        </template>
        <template #item.scountry="{ item }">
          <div class="fs-13 text-wrap text-break">

          </div>
        </template>
        <template #item.rcountry="{ item }">
          <div class="fs-13 text-wrap"></div>
        </template>
        <template #item.pdate="{ item }">
          <div class="fs-13 text-wrap"></div>
        </template>
        <template #item.mRate="{ item }">
          <div class="fs-13 text-wrap">

          </div>
        </template>
        <template #item.status="{ item }">
          <div class="fs-13 text-wrap">

          </div>
        </template>
        <template #item.rate="{ item }">
          <div class="fs-13 text-wrap">
          </div>
        </template>
        <template #item.cRate="{ item }">
          <div class="fs-13 text-wrap">

          </div>
        </template>
        <template #item.commission="{ item }">
          <div class="fs-13 text-wrap">

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
