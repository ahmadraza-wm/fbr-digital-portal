<script setup>
import { ref, reactive, watch, onMounted } from 'vue'
import { storeToRefs } from "pinia"
import { usePaymentDetailExport } from '@/composables/exports/usePaymentDetailExport'
import { useBeneficiaryUpdate } from "@/composables/useBeneficiaryUpdate"
import { usePayments } from "@/composables/usePayments"
const { fetchPayers, payersList } = useBeneficiaryUpdate()
const { resolveStatusVariant } = usePayments()
const { exportCompressedPaymentDetail, exportPaymentDetail } = usePaymentDetailExport()
definePageMeta({
  middleware: "auth",
  permission: "payment.detail.export"
})
const permissionStore = usePermissionStore()
// country store
const countryCurrencyStore = useCountryCurrencyStore()
const { sending_countries, receiving_countries } = storeToRefs(countryCurrencyStore)
const formKey = ref(null);
const set_date_format = (input_date) => {
  const now = new Date(input_date);
  const day = String(now.getDate()).padStart(2, '0');
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const year = now.getFullYear();
  return `${day}-${month}-${year}`;
};
const currentDate = new Date();
const previousDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, currentDate.getDate() + 1);
const formState = reactive({
  sending_countries: 'All',
  receiving_countries: 'All',
  payer: 'All',
  from_date: set_date_format(previousDate),
  to_date: set_date_format(currentDate),
  sending_range: 'All',


})
watch(
  () => formState.receiving_countries,
  async (newCountry) => {
    try {
      if (!newCountry || newCountry === 'all') {
        await fetchPayers({ country_id: null })
      } else {
        await fetchPayers({ country_id: newCountry })
      }
      payers.value = [{ id: 'all', name: 'All Payers' }, ...payers.value]

    } catch (e) {
      console.error('Error fetching payers:', e)
    }

    formState.payer = ''
  }
)


const rangeItem = ref([
  { title: "All", value: "" },
  { title: "0 to 50", value: "0-50" },
  { title: "50 to 100", value: "50-100" },
  { title: "100 to 150", value: "100-150" },
  { title: "150 to 200", value: "150-200" },
  { title: "200 to 300", value: "200-300" },
  { title: "300 to 400", value: "300-400" },
  { title: "400 to 500", value: "400-500" },
  { title: "500 to 1000", value: "500-1000" },
  { title: "1000+", value: "1000-" }
])
onMounted(async () => {
  if (formState.receiving_countries === 'all') {
    await fetchPayers()
  }
  await fetchPayers()

})

</script>
<template>
  <v-card>
    <v-row>
      <v-col cols="12">
        <v-card-title class="border-b-sm">
          <h4 class="text-h5 py-3">Payment Detail Export</h4>
        </v-card-title>
      </v-col>
    </v-row>

    <v-card-text class="pt-1 my-4 pb-3">
      <VForm @submit.prevent="" :key="formKey">
        <v-row class="ps-0">
          <v-col cols="12" sm="6" md="3">
            <span class="fs-15 label-color font-weight-medium">From</span>
            <AppDateTimePicker name="from" v-model="formState.from_date" placeholder="dd/mm/yyyy" :config="{ dateFormat: 'd/m/Y' }" />
          </v-col>
          <v-col cols="12" sm="6" md="3">
            <span class="fs-15 label-color font-weight-medium">To</span>
            <AppDateTimePicker name="to" v-model="formState.to_date" placeholder="dd/mm/yyyy" :config="{ dateFormat: 'd/m/Y' }" />
          </v-col>
          <v-col cols="12" sm="6" md="3">
            <span class="fs-15 label-color font-weight-medium">Sending Countries</span>
            <AppAutocomplete :items="sending_countries" item-title="name" item-id="id"
              v-model="formState.sending_countries" placeholder="Select sending sountries" />
          </v-col>
          <v-col cols="12" sm="6" md="3">
            <span class="fs-15 label-color font-weight-medium">Receiving Countries</span>
            <AppAutocomplete :items="receiving_countries" item-title="name" item-value="id"
              v-model="formState.receiving_countries" placeholder="Select receiving countries" />

          </v-col>
          <v-col cols="12" sm="6" md="3">
            <span class="fs-15 label-color font-weight-medium">Payer</span>
            <AppAutocomplete v-model="formState.payer" :items="payersList" item-title="name" item-value="id"
              placeholder="Select Payer" />
          </v-col>
          <v-col cols="12" sm="6" md="3">
            <span class="fs-15 label-color font-weight-medium">Sending Range</span>
            <AppAutocomplete :items="rangeItem" v-model="formState.sending_range" placeholder="Select Range" />
          </v-col>
          <v-col cols="12 d-flex gap-2 pt-md-8 justify-start" sm="6" md="3">
            <VBtn type="submit" class="login-btn" variant="tonal" @click="exportPaymentDetail(formState)">
              Export
            </VBtn>
            <VBtn color="secondary" variant="tonal" @click="exportCompressedPaymentDetail(formState)" v-if="permissionStore.hasPermission('payment.detail.export.compressed')">
              Export Compressed
            </VBtn>
          </v-col>
        </v-row>
      </VForm>
    </v-card-text>
  </v-card>
</template>
