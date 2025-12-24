<script setup>
const dateRange = ref(null)
const status = ref([])
const transferCode = ref(null)
const referralCode = ref(null)
const userList = ref([]);
const options = ref({
  page: 1,
  itemsPerPage: 5,
  sortBy: [""],
  sortDesc: [false],
});

const search = () => {

}

const resetFilters = () => {
  referralCode.value = null
  transferCode.value = null
  dateRange.value = null
  status.value = []
};

const statusItem = ref([
  { title: "Awaiting funds", value: "PEN" },
  { title: "Incomplete", value: "INC" },
  { title: "Verifying Transfer", value: "VER" },
  { title: "Compliance Held", value: "CMH" },
  { title: "Operation Hold", value: "OPH" },
  { title: "Available for Collection", value: "PAY" },
  { title: "Processing Transfer", value: "PRC" },
  { title: "Send to Partner", value: "STP" },
  { title: "Paid", value: "PAI" },
  { title: "Canceled", value: "CAN" },
  { title: "Canceling", value: "CNL" },
  { title: "Refunded", value: "REF" }
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
  title: "Customer Name",
  key: "fullName",
},
{
  title: "Customer Phone",
  key: "phone",
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
  title: "Sub Agent Rate",
  key: "sRate",
},
{
  title: "Rate",
  key: "rate",
},
{
  title: "Transaction Rate",
  key: "tRate",
},
{
  title: "Agent Commission",
  key: "commission",
}
];
</script>
<template>
  <v-card>
    <v-row>
      <v-col cols="12">
        <v-card-title class="border-b-sm">
          <h4 class="text-h5 py-3">Commission For Agent Report</h4>
        </v-card-title>
      </v-col>
    </v-row>
    <v-card-text class="pt-1 my-4 pb-3">
      <VForm @submit.prevent="">
        <v-row class="ps-0">
          <v-col cols="12" sm="6" md="3">
            <span class="fs-15 label-color font-weight-medium">Referral Code<span class="text-red">*</span></span>
            <AppTextField name="code" type="text" v-model="referralCode" placeholder="Referral code"
              :rules="[requiredValidator]" autocomplete="off" />
          </v-col>
          <v-col cols="12" sm="6" md="3">
            <span class="fs-15 label-color font-weight-medium">Transfer Code</span>
            <AppTextField name="code" type="text" v-model="transferCode" placeholder="Transfer code" autocomplete="off" />
          </v-col>
          <v-col cols="12" sm="6" md="3">
            <span class="fs-15 label-color font-weight-medium">Date Range</span>
            <AppDateRange class="cursor-pointer" placeholder="DD/MM/YYYY" v-model="dateRange" />
          </v-col>
          <v-col cols="12" sm="6" md="3">
            <span class="fs-15 label-color font-weight-medium">Status</span>
            <AppAutocomplete :items="statusItem" v-model="status" placeholder="Select status" multiple chips
              closable-chips />
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
      </VForm>
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
        <template #item.fullName="{ item }">
          <div class="fs-13 text-wrap text-break">

          </div>
        </template>
        <template #item.phone="{ item }">
          <div class="fs-13 text-wrap"></div>
        </template>
        <template #item.pdate="{ item }">
          <div class="fs-13 text-wrap"></div>
        </template>
        <template #item.mRate="{ item }">
          <div class="fs-13 text-wrap">

          </div>
        </template>
        <template #item.sRate="{ item }">
          <div class="fs-13 text-wrap">

          </div>
        </template>
        <template #item.rate="{ item }">
          <div class="fs-13 text-wrap">
          </div>
        </template>
        <template #item.tRate="{ item }">
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
