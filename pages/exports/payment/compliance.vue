<script setup>
import data from "@/views/demos/forms/tables/data-table/datatable";

const currentDate = new Date();
const previousDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, currentDate.getDate() + 1);
const from = ref(previousDate)
const to = ref(currentDate)
const userList = ref([]);
const options = ref({
  page: 1,
  itemsPerPage: 5,
  sortBy: [""],
  sortDesc: [false],
});

const headers = [{
  title: "#",
  key: "sr_no",
},
{
  title: "Date",
  key: "date",
},
{
  title: "Name",
  key: "name",
},
{
  title: "Status",
  key: "status",
},
{
  title: "Created By",
  key: "fullName",
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
          <h4 class="text-h5 py-3">Compliance Export</h4>
        </v-card-title>
      </v-col>
    </v-row>

    <v-card-text class="pt-1 my-4 pb-3">
      <VForm @submit.prevent="">
        <v-row class="ps-0">
          <v-col cols="12" sm="6" md="5">
            <span class="fs-15 label-color font-weight-medium">From</span>
            <AppDateTimePicker name="from" v-model="from" placeholder="dd/mm/yyyy" :config="{ dateFormat: 'd/m/Y' }" />
          </v-col>
          <v-col cols="12" sm="6" md="5">
            <span class="fs-15 label-color font-weight-medium">To</span>
            <AppDateTimePicker name="to" v-model="to" placeholder="dd/mm/yyyy" :config="{ dateFormat: 'd/m/Y' }" />
          </v-col>
          <v-col cols="12 d-flex gap-2 pt-md-8 justify-start" md="2">
            <VBtn type="submit" class="login-btn" variant="tonal">
              Export
            </VBtn>
          </v-col>
        </v-row>
      </VForm>
    </v-card-text>
  </v-card>
  <v-card class="mt-5">
    <v-row>
      <v-col cols="12">
        <v-card-title>
          <h4 class="text-h5 py-3">Download Exports</h4>
        </v-card-title>
      </v-col>
    </v-row>
    <VCardText class="flex-wrap gap-4 d-flex align-center border-t-sm">
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
    </VCardText>

    <VCardText class="px-0">
      <PaginatedDataTable :headers="headers" :items="userList" :options="options" :loading="loading" :search="search"
        @update:options="options = $event">
        <template #item.date="{ item }">
          <div class="fs-13 text-wrap">
            20 May, 2025
          </div>
        </template>
        <template #item.name="{ item }">
          <div class="fs-13 text-wrap">
            Compliance Export
          </div>
        </template>
        <template #item.status="{ item }">
          <div class="fs-13 text-wrap">
            <VChip :style="{
              backgroundColor:
                item.status == 1 ? '#28C76F29' : '#7367F04D',
              color: item.status == 1 ? '#28C76F' : '#7367F0',

              marginTop: '2px',
            }" class="font-weight-light fs-12 p-1" size="small">
              {{ item.status == 1 ? "Queue" : "In Progress" }}
            </VChip>
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
