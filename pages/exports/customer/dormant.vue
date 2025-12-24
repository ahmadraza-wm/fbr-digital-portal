<script setup>
definePageMeta({
  middleware: "auth",
  permission: "dormant.customer.export"
})
import { useDormantCustomerExport } from '@/composables/exports/useDormantCustomerExport';
const {
  exportDormantCustomer
} = useDormantCustomerExport();
const countryCurrencyStore = useCountryCurrencyStore();
const { sending_countries, receiving_countries } = storeToRefs(countryCurrencyStore);

const daysList = ref([
  { title: "Please Select", value: "" },
  { title: "15 Days", value: "15" },
  { title: "30 Days", value: "30" },
  { title: "45 Days", value: "45" },
  { title: "60 Days", value: "60" }
])
const form = reactive({
  sending_country_id: '',
  receiving_country_id:'',
  no_of_days: ''

});
</script>
<template>
  <v-card>
    <v-row>
      <v-col cols="12">
        <v-card-title class="border-b-sm">
          <h4 class="text-h5 py-3">Dormant Customer Export</h4>
        </v-card-title>
      </v-col>
    </v-row>

    <v-card-text class="pt-1 my-4 pb-3">
      <VForm @submit.prevent="" :key="formKey">
        <v-row class="ps-0">
          <v-col cols="12" sm="6" md="3">
            <span class="fs-15 label-color font-weight-medium">Sending Country<span class="text-red">*</span></span>
            <AppAutocomplete v-model="form.sending_country_id" :items="sending_countries" item-title="name"
              item-value="id" placeholder="Algeria" :rules="[requiredValidator]" />
          </v-col>
          <v-col cols="12" sm="6" md="3">
            <span class="fs-15 label-color font-weight-medium">Receiving Country<span class="text-red">*</span></span>
            <AppAutocomplete v-model="form.receiving_country_id" :items="receiving_countries" item-title="name"
              item-value="id" placeholder="Algeria" :rules="[requiredValidator]" />
          </v-col>
          <v-col cols="12" sm="6" md="3">
            <span class="fs-15 label-color font-weight-medium">Select Days<span class="text-red">*</span></span>
            <AppAutocomplete :items="daysList" item-title="title" v-model="form.no_of_days" placeholder="Select status"
              :rules="[requiredValidator]" />
          </v-col>
          <v-col cols="12 d-flex gap-2 pt-sm-8 justify-start" sm="6" md="3">
            <VBtn type="submit" class="login-btn" variant="tonal" @click="exportDormantCustomer(form)">
              Export
            </VBtn>
          </v-col>
        </v-row>
      </VForm>
    </v-card-text>
  </v-card>
</template>
