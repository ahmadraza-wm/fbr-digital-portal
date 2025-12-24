<script setup>
import data from "@/views/demos/forms/tables/data-table/datatable";

const from = ref(null)
const to = ref(null)
const userList = ref([]);
const options = ref({
  page: 1,
  itemsPerPage: 5,
  sortBy: [""],
  sortDesc: [false],
});

const resetFilters = () => {
  from.value = null
  to.value = null
};


const headers = [
  {
    title: "#",
    key: "sr_no",
  },
  {
    title: "Customer Name",
    key: "customer",
  },
  {
    title: "Transfer Code",
    key: "code",
  },
  {
    title: "Sending Country",
    key: "s_country",
  },
  {
    title: "Sending Amount",
    key: "s_amount",
  },
  {
    title: "Receving Country",
    key: "r_country",
  },
  {
    title: "Receving Amount",
    key: "r_amount",
  },
  {
    title: "Rate",
    key: "rate",
  },
  {
    title: "Status",
    key: "status",
  },
  {
    title: "Created At",
    key: "created_at",
  },
];

onMounted(() => {
  userList.value = JSON.parse(JSON.stringify(data));
});
</script>
<template>
  <v-card>
    <v-row>
      <v-col cols="12">
        <v-card-title class="border-b-sm d-flex align-center" style="background-color: lightgrey;">
          <BackNavigation />
          <h4 class="text-h5 py-4">Fee Free Transfer Details</h4>
        </v-card-title>
      </v-col>
    </v-row>
    <v-card-text class="px-0 pt-0">
      <v-row class="px-5">
        <v-col cols="6" sm="4" md="3" class="pb-1">
          <p class="font-weight-medium text-color mb-0 lh-22">Customer</p>
          <p class="font-weight-medium mb-0 lh-22 text-color1">Muhammad Shoaib</p>
        </v-col>
        <v-col cols="6" sm="4" md="3" class="pb-1">
          <p class="font-weight-medium text-color mb-0 lh-22">Sending Country</p>
          <p class="font-weight-medium mb-0 lh-22 text-color1">United Kingdom</p>
        </v-col>
        <v-col cols="6" sm="4" md="3" class="pb-1">
          <p class="font-weight-medium text-color mb-0 lh-22">Receiving Country</p>
          <p class="font-weight-medium mb-0 lh-22 text-color1">Benin</p>
        </v-col>
        <v-col cols="6" sm="4" md="3" class="pb-1">
          <p class="font-weight-medium text-color mb-0 lh-22">Expire At</p>
          <p class="font-weight-medium mb-0 lh-22 text-color1">22 Jul 2023</p>
        </v-col>
      </v-row>
    </v-card-text>
    <v-row>
      <v-col cols="12">
        <v-card-title class="border-b border-t" style="background-color: #FAFAFA;">
          <h4 class="text-h5 py-3">Fee Free Transfer Usage Report</h4>
        </v-card-title>
      </v-col>
    </v-row>

    <v-card-text class="pt-1 my-4 pb-3">
      <v-row class="ps-0">
        <v-col cols="12" sm="6" md="4">
          <span class="fs-15 label-color font-weight-medium">Date From</span>
          <AppDateTimePicker name="from" v-model="from" placeholder="dd/mm/yyyy" :config="{ dateFormat: 'd/m/Y' }" />
        </v-col>
        <v-col cols="12" sm="6" md="4">
          <span class="fs-15 label-color font-weight-medium">Date To</span>
          <AppDateTimePicker name="to" v-model="to" placeholder="dd/mm/yyyy" :config="{ dateFormat: 'd/m/Y' }" />
        </v-col>
        <v-col cols="12 d-flex gap-2 align-end justify-start" sm="6" md="4">
          <VBtn @click="search" type="submit" class="login-btn" variant="tonal">
            search
          </VBtn>
          <VBtn @click="resetFilters" type="reset" color="secondary" variant="tonal">
            Reset
          </VBtn>
        </v-col>
      </v-row>
    </v-card-text>
    <VCardText class="px-0">
      <PaginatedDataTable :headers="headers" :items="userList" :options="options" :loading="loading" :search="search"
        @update:options="options = $event">
        <template #item.customer="{ item }">
          <div class="fs-13 text-wrap">Muhammad Shoaib</div>
        </template>
        <template #item.code="{ item }">
          <div class="fs-13 text-wrap">222335</div>
        </template>
        <template #item.s_country="{ item }">
          <div class="fs-13 text-wrap">Canada</div>
        </template>
        <template #item.s_amount="{ item }">
          <div class="fs-13 text-wrap">68788</div>
        </template>
        <template #item.r_country="{ item }">
          <div class="fs-13 text-wrap">Benin</div>
        </template>
        <template #item.r_amount="{ item }">
          <div class="fs-13 text-wrap">35467</div>
        </template>
        <template #item.rate="{ item }">
          <div class="fs-13 text-wrap">
            35467
          </div>
        </template>
        <template #item.status="{ item }">
          <div style="display: flex; align-items: center;">
            <VChip :style="{
              backgroundColor: item.status == 1 ? '#28C76F29' : '#FE5F574F',
              color: item.status == 1 ? '#28C76F' : '#FE5F57',

              marginTop: '2px',
            }" class="font-weight-light fs-12 p-1" size="small">
              {{ item.status == 1 ? "Active" : "Expired" }}
            </VChip>

          </div>
        </template>
        <template #item.created_at="{ item }">
          <div class="fs-13 text-wrap">
            18-Apr-2023 <br> 02:14 AM
          </div>
        </template>
        <template #bottom>
          <VCardText class="pt-2 pb-0">
            <div class="d-flex flex-wrap justify-space-between align-center gap-y-2 mt-2">
              <span class="text-caption text-muted">
                  Showing
                  {{ ((options.page - 1) * options.itemsPerPage) + 1 }}
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
      </PaginatedDataTable>
    </VCardText>
  </v-card>
</template>
