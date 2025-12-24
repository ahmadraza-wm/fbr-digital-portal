<script setup>
import data from "@/views/demos/forms/tables/data-table/datatable";
const currentDate = new Date();
const previousDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() - 7);
const from = ref(previousDate)
const to = ref(currentDate)
const formKey = ref(null)
const partner = ref('');
const dateError = ref(false)
const userList = ref([]);
const options = ref({
  page: 1,
  itemsPerPage: 5,
  sortBy: [""],
  sortDesc: [false],
});

const search = () => {
  if (partner.value && !dateError.value) {
    userList.value = JSON.parse(JSON.stringify(data));
  }
}

const resetFilters = () => {
  from.value = previousDate
  to.value = currentDate
  partner.value = ''
  dateError.value = false
  userList.value = []
  formKey.value += 1
};

const partnersList = ref([{
  title: "Please Select",
  value: ''
},
{
  title: "Muhammad Ali",
  value: 1
},
{
  title: "Ali Raza",
  value: 1
}
])


const headers = [{
  title: "#",
  key: "sr_no",
},
{
  title: "Batch ID",
  key: "bid",
},
{
  title: "Total",
  key: "total",
},
{
  title: "Created On",
  key: "created_on",
},
{
  title: "Action",
  key: "action",
}
];

const parseDate = (str) => {
  const [day, month, year] = str.split('/').map(Number)
  return new Date(year, month - 1, day)
}

const validateDate = () => {
  if (!from.value || !to.value) {
    dateError.value = false
    return
  }

  const fromDate = typeof from.value === 'string' ? parseDate(from.value) : new Date(from.value)
  const toDate = typeof to.value === 'string' ? parseDate(to.value) : new Date(to.value)

  if (isNaN(fromDate) || isNaN(toDate)) {
    dateError.value = false
    return
  }

  const diffInMs = toDate.getTime() - fromDate.getTime()
  const diffInDays = diffInMs / (1000 * 60 * 60 * 24)

  dateError.value = diffInDays > 92
}

watch([() => from.value, () => to.value], validateDate)

</script>
<template>
  <v-card>
    <v-row>
      <v-col cols="12">
        <v-card-title class="border-b-sm">
          <h4 class="text-h5 py-3">Partner File Format Export</h4>
        </v-card-title>
      </v-col>
    </v-row>
    <v-card-text class="pt-1 my-4 pb-3" v-if="dateError">
      <v-row class="px-2 py-3">
        <v-col cols="12 py-5 px-6 border-sm rounded d-flex align-center text-error"
          style=" border-color: #d19693cc !important;background-color: #f8d7da;">
          <VIcon icon="tabler-point-filled" class="mr-1" size="18" />
          <span class="fs-15">Date range cannot be more than 3 months</span>
        </v-col>
      </v-row>
    </v-card-text>
    <v-card-text class="pt-1 my-4 pb-3">
      <VForm @submit.prevent="" :key="formKey">
        <v-row class="ps-0">
          <v-col cols="12" sm="6" md="3">
            <span class="fs-15 label-color font-weight-medium">Date From<span class="text-red">*</span></span>
            <AppDateTimePicker name="from" v-model="from" @change="validateDate" placeholder="dd/mm/yyyy"
              :config="{ dateFormat: 'd/m/Y' }" :rules="[requiredValidator]" />
          </v-col>
          <v-col cols="12" sm="6" md="3">
            <span class="fs-15 label-color font-weight-medium">Date To<span class="text-red">*</span></span>
            <AppDateTimePicker name="to" v-model="to" @change="validateDate" placeholder="dd/mm/yyyy"
              :config="{ dateFormat: 'd/m/Y' }" :rules="[requiredValidator]" />
          </v-col>
          <v-col cols="12" sm="6" md="3">
            <span class="fs-15 label-color font-weight-medium">Partner<span class="text-red">*</span></span>
            <AppAutocomplete :items="partnersList" v-model="partner" placeholder="Select partner"
              :rules="[requiredValidator]" />
          </v-col>
          <v-col cols="12 d-flex gap-2 pt-md-8 justify-start" sm="6" md="3">
            <VBtn @click="search" :disabled="dateError" type="submit" class="login-btn" variant="tonal">
              search
            </VBtn>
            <VBtn @click="resetFilters" type="reset" color="secondary" variant="tonal">
              Reset
            </VBtn>
          </v-col>
        </v-row>
      </VForm>
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
      <div class="gap-3 pt-6">
        <VBtn variant="elevated" color="primary" v-if="userList.length">
          <VIcon icon="tabler-download" class="mr-1" />
          Download All
        </VBtn>
      </div>
    </VCardText>

    <VCardText class="px-0">
      <PaginatedDataTable :headers="headers" :items="userList" :options="options" :loading="loading" :search="search"
        @update:options="options = $event">
        <template #item.bid="{ item }">
          <div class="fs-13 text-wrap">
            424dd5d5-a67b-4ada-8279-3c3c79b1a975
          </div>
        </template>
        <template #item.total="{ item }">
          <div class="fs-13 text-wrap">
            {{ item.id }}
          </div>
        </template>
        <template #item.action="{ item }">
          <div class="fs-13 text-wrap">
            <VBtn variant="text" color="primary">
              <u>Download</u>
            </VBtn>
          </div>
        </template>
        <template #item.created_on="{ item }">
          <div class="fs-13 text-wrap">
            05 May, 2025 05:31 PM
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
