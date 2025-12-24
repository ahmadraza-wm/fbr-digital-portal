<script setup>
// const countryCurrencyStore = useCountryCurrencyStore();
// const { sending_countries, receiving_countries } =
//   storeToRefs(countryCurrencyStore);
// definePageMeta({
//   middleware: "auth",
//   permission: "corridor.target.report"
// })
import { useCountries } from '@/composables/useCountries';
const {fetchCountries,CountriesList} = useCountries();
const permissionStore = usePermissionStore()
const userList = ref([]);
const options = ref({
  page: 1,
  itemsPerPage: 5,
  sortBy: [""],
  sortDesc: [false],
});

const set_date_format = (input_date) => {
  const now = new Date(input_date);
  const day = String(now.getDate()).padStart(2, '0');
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const year = now.getFullYear();
  return `${day}-${month}-${year}`;
};
const today = new Date();
const previousMonthDate = new Date(today.getFullYear(), today.getMonth() - 1, today.getDate());
const form = reactive({
  sending_countries: "",
  receiving_countries: "",
  frequency: "",
  date_from: set_date_format(previousMonthDate),
  date_to: set_date_format(new Date()),

});
const resetFilters = () => {
  scountry.value = 'all'
  rcountry.value = 'all'
  from.value = null
  to.value = null
  frequency.value = 'all'
};

const headers = [
  { title: "#", key: "sr_no" },
  { title: "Country Name", key: "name" },
  { title: "Currency", key: "currency" },
  { title: "Capital", key: "capital" },
  { title: "ISO2", key: "iso2" },
  { title: "ISO3", key: "iso3" },
  { title: "Phone Code", key: "dial_code"},
];

onMounted(async() => {
  await fetchCountries();
});
</script>
<template>
  <v-card>
    <v-row>
      <v-col cols="12">
        <v-card-title class="border-b-sm">
          <h4 class="text-h5 py-3">Countries</h4>
        </v-card-title>
      </v-col>
    </v-row>
    <!-- <v-card-text class="pt-1 my-4 pb-3">
      <VForm @submit.prevent="" :key="formKey">
        <v-row class="ps-0">
          <v-col cols="12" sm="6" md="3">
            <span class="fs-15 label-color font-weight-medium">Sending Country</span>
            <AppAutocomplete :items="sending_countries" item-title="name" item-value="id"
              v-model="form.sending_countries" placeholder="Select country" hide-details />
          </v-col>
          <v-col cols="12" sm="6" md="3">
            <span class="fs-15 label-color font-weight-medium">Receiving Country</span>
            <AppAutocomplete :items="receiving_countries" item-title="name" item-value="id"
              v-model="form.receiving_countries" placeholder="Select country" />
          </v-col>
          <v-col cols="12" sm="6" md="3">
            <span class="fs-15 label-color font-weight-medium">Date From</span>
            <AppDateTimePicker name="from" v-model="form.date_from" placeholder="dd-mm-yyyy"
              :config="{ dateFormat: 'd-m-Y' }" />
          </v-col>
          <v-col cols="12" sm="6" md="3">
            <span class="fs-15 label-color font-weight-medium">Date To</span>
            <AppDateTimePicker name="to" v-model="form.date_to" placeholder="dd-mm-yyyy"
              :config="{ dateFormat: 'd-m-Y' }" />
          </v-col>
          <v-col cols="12" sm="6" md="3">
            <span class="fs-15 label-color font-weight-medium">Frequency</span>
            <AppAutocomplete :items="frequencyItem" v-model="form.frequency" placeholder="Select frequency" />
          </v-col>
          <v-col cols="12 d-flex gap-2 align-end justify-start" sm="6" md="3">
            <VBtn @click="fetchCorridorTarget(form)" type="submit" class="login-btn" variant="tonal">
              search
            </VBtn>
            <VBtn @click="resetFilters" type="reset" color="secondary" variant="tonal">
              Reset
            </VBtn>
          </v-col>
        </v-row>
      </VForm>
    </v-card-text> -->
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
      <div class="gap-3 pt-6" v-if="permissionStore.hasPermission('corridor.target.report.export')">
        <VBtn variant="tonal" color="secondary" @click="exportCorridorTarget(form)">
          <VIcon icon="tabler-upload" class="mr-1" />
          Export.csv
        </VBtn>
      </div>
    </VCardText>

    <VCardText class="px-0">
      <PaginatedDataTable :headers="headers" :items="CountriesList" :options="options" :loading="loading" :search="search"
        @update:options="options = $event">

        <template #bottom>
          <VCardText class="pt-2 pb-0">
            <div class="d-flex flex-wrap justify-space-between align-center gap-y-2 mt-2">
              <span class="text-caption text-muted">
                Showing
                {{ (options.page - 1) * options.itemsPerPage + 1 }}
                to
                {{ Math.min(options.page * options.itemsPerPage, CountriesList.length) }}
                of {{ CountriesList.length }} entries
              </span>
              <VPagination v-model="options.page" :total-visible="$vuetify.display.smAndDown ? 3 : 5"
                :length="Math.ceil(CountriesList.length / options.itemsPerPage)" />
            </div>
          </VCardText>
        </template>
      </PaginatedDataTable>
    </VCardText>
  </v-card>
</template>
