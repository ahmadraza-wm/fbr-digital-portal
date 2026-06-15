<script setup>
import { useFbrStore } from '@/stores/useFbrStore'

definePageMeta({
  // middleware: 'auth',
  name: 'fbr-validate',
})

const fbrStore = useFbrStore()
const { validateInvoice, validateInvoiceSandbox, getProvinces, getUomList } = useFbrApi()
const fbrToken = useCookie('fbrToken')

const loading = ref(false)
const response = ref(null)
const errorMsg = ref(null)

const invoiceHeader = ref({
  invoiceType: 'Sale Invoice',
  invoiceDate: new Date().toISOString().split('T')[0],
  sellerNTNCNIC: '',
  sellerBusinessName: '',
  sellerProvince: '',
  sellerAddress: '',
  buyerNTNCNIC: '',
  buyerBusinessName: '',
  buyerProvince: '',
  buyerAddress: '',
  buyerRegistrationType: 'Registered',
  invoiceRefNo: '',
  scenarioId: '',
})

const items = ref([createEmptyItem()])

function createEmptyItem() {
  return {
    hsCode: '',
    productDescription: '',
    rate: '',
    uoM: '',
    quantity: 1,
    totalValues: 0,
    valueSalesExcludingST: 0,
    fixedNotifiedValueOrRetailPrice: 0,
    salesTaxApplicable: 0,
    salesTaxWithheldAtSource: 0,
    extraTax: 0,
    furtherTax: 0,
    sroScheduleNo: '',
    fedPayable: 0,
    discount: 0,
    saleType: 'Goods at standard rate (default)',
    sroItemSerialNo: '',
  }
}

const addItem = () => items.value.push(createEmptyItem())
const removeItem = index => items.value.splice(index, 1)

const provinces = ref([])
const uomList = ref([])

onMounted(async () => {
  try {
    const [prov, uom] = await Promise.all([getProvinces(), getUomList()])
    provinces.value = prov.map(p => p.stateProvinceDesc)
    uomList.value = uom.map(u => u.description)
  }
  catch {
    provinces.value = ['Punjab', 'Sindh', 'KPK', 'Balochistan', 'AJK', 'GB', 'ICT']
    uomList.value = ['Numbers, pieces, units', 'KG', 'Litre', 'Metre', 'Square Metre', 'KWH', 'Dozen']
  }
})

const invoiceTypes = ['Sale Invoice', 'Debit Note']
const registrationTypes = ['Registered', 'Unregistered']
const saleTypes = [
  'Goods at standard rate (default)', 'Goods at Reduced Rate', 'Exempt Goods',
  'Goods at zero-rate', '3rd Schedule Goods', 'Cotton Ginners',
  'Telecommunication services', 'Toll Manufacturing', 'Petroleum Products',
  'Electricity Supply to Retailers', 'Gas to CNG stations', 'Mobile Phones',
  'Processing/ Conversion of Goods', 'Goods (FED in ST Mode)', 'Services (FED in ST Mode)',
  'Services', 'Electric Vehicle', 'Cement /Concrete Block', 'Potassium Chlorate',
  'CNG Sales', 'Goods as per SRO.297(|)/2023', 'Non-Adjustable Supplies',
  'Steel Melting and re-rolling', 'Ship breaking',
]
const sandboxScenarios = [
  'SN001', 'SN002', 'SN003', 'SN004', 'SN005', 'SN006', 'SN007',
  'SN008', 'SN009', 'SN010', 'SN011', 'SN012', 'SN013', 'SN014',
  'SN015', 'SN016', 'SN017', 'SN018', 'SN019', 'SN020', 'SN021',
  'SN022', 'SN023', 'SN024', 'SN025', 'SN026', 'SN027', 'SN028',
]
const rateOptions = ['0%', '5%', '8%', '10%', '13%', '17%', '18%', '25%']

const payload = computed(() => {
  const base = { ...invoiceHeader.value, items: items.value }
  if (!fbrStore.isSandbox) delete base.scenarioId
  if (base.invoiceType !== 'Debit Note') delete base.invoiceRefNo
  return base
})

const validateInvoiceData = async () => {
  if (!fbrToken.value) {
    errorMsg.value = 'API token not configured. Please go to Settings first.'
    return
  }
  loading.value = true
  response.value = null
  errorMsg.value = null
  try {
    const fn = fbrStore.isSandbox ? validateInvoiceSandbox : validateInvoice
    const result = await fn(payload.value)
    response.value = result
    fbrStore.addValidatedInvoice(payload.value, result)
  }
  catch (err) {
    errorMsg.value = err?.data?.message || err?.message || 'Validation request failed.'
  }
  finally {
    loading.value = false
  }
}

const isValid = computed(() => response.value?.validationResponse?.status === 'Valid')

const proceedToSubmit = () => {
  navigateTo({ name: 'fbr-submit' })
}
</script>

<template>
  <div>
    <VRow class="mb-4">
      <VCol cols="12">
        <div class="d-flex align-center gap-3">
          <VBtn icon variant="text" :to="{ name: 'fbr-dashboard' }">
            <VIcon icon="tabler-arrow-left" />
          </VBtn>
          <div class="flex-grow-1">
            <h4 class="text-h5 font-weight-bold">
              Validate Invoice
            </h4>
            <p class="text-body-2 text-medium-emphasis mb-0">
              Validate invoice data without submitting — no invoice number is issued
            </p>
          </div>
          <VChip :color="fbrStore.environmentColor" variant="tonal" prepend-icon="tabler-server">
            {{ fbrStore.environmentLabel }}
          </VChip>
        </div>
      </VCol>
    </VRow>

    <VAlert type="info" variant="tonal" class="mb-4" density="compact">
      <strong>Validate vs Submit:</strong> Validation checks your data without registering the invoice. No FBR invoice
      number is issued. Use this to test your data before going live.
    </VAlert>

    <VRow>
      <VCol cols="12" lg="8">
        <!-- Invoice Header -->
        <VCard class="mb-4">
          <VCardItem>
            <template #prepend>
              <VAvatar color="success" variant="tonal" size="36">
                <VIcon icon="tabler-shield-check" size="20" />
              </VAvatar>
            </template>
            <VCardTitle>Invoice Header</VCardTitle>
          </VCardItem>
          <VDivider />
          <VCardText>
            <VRow>
              <VCol cols="12" sm="6">
                <VSelect v-model="invoiceHeader.invoiceType" :items="invoiceTypes" label="Invoice Type *"
                  variant="outlined" />
              </VCol>
              <VCol cols="12" sm="6">
                <VTextField v-model="invoiceHeader.invoiceDate" label="Invoice Date *" type="date" variant="outlined" />
              </VCol>
              <VCol cols="12">
                <p class="text-body-2 font-weight-semibold text-primary mb-2">
                  Seller
                </p>
              </VCol>
              <VCol cols="12" sm="6">
                <VTextField v-model="invoiceHeader.sellerNTNCNIC" label="Seller NTN/CNIC *" variant="outlined" />
              </VCol>
              <VCol cols="12" sm="6">
                <VTextField v-model="invoiceHeader.sellerBusinessName" label="Seller Business Name *"
                  variant="outlined" />
              </VCol>
              <VCol cols="12" sm="6">
                <VSelect v-model="invoiceHeader.sellerProvince" :items="provinces" label="Seller Province *"
                  variant="outlined" />
              </VCol>
              <VCol cols="12" sm="6">
                <VTextField v-model="invoiceHeader.sellerAddress" label="Seller Address *" variant="outlined" />
              </VCol>
              <VCol cols="12">
                <p class="text-body-2 font-weight-semibold text-success mb-2">
                  Buyer
                </p>
              </VCol>
              <VCol cols="12" sm="6">
                <VTextField v-model="invoiceHeader.buyerNTNCNIC" label="Buyer NTN/CNIC" variant="outlined" />
              </VCol>
              <VCol cols="12" sm="6">
                <VTextField v-model="invoiceHeader.buyerBusinessName" label="Buyer Business Name *"
                  variant="outlined" />
              </VCol>
              <VCol cols="12" sm="6">
                <VSelect v-model="invoiceHeader.buyerProvince" :items="provinces" label="Buyer Province *"
                  variant="outlined" />
              </VCol>
              <VCol cols="12" sm="6">
                <VTextField v-model="invoiceHeader.buyerAddress" label="Buyer Address *" variant="outlined" />
              </VCol>
              <VCol cols="12" sm="6">
                <VSelect v-model="invoiceHeader.buyerRegistrationType" :items="registrationTypes"
                  label="Buyer Registration Type *" variant="outlined" />
              </VCol>
              <VCol v-if="fbrStore.isSandbox" cols="12" sm="6">
                <VSelect v-model="invoiceHeader.scenarioId" :items="sandboxScenarios" label="Scenario ID (Sandbox) *"
                  variant="outlined" />
              </VCol>
            </VRow>
          </VCardText>
        </VCard>

        <!-- Items -->
        <VCard v-for="(item, index) in items" :key="index" class="mb-4">
          <VCardItem>
            <template #prepend>
              <VAvatar color="info" variant="tonal" size="36">
                <VIcon icon="tabler-package" size="20" />
              </VAvatar>
            </template>
            <VCardTitle>Item {{ index + 1 }}</VCardTitle>
            <template #append>
              <VBtn v-if="items.length > 1" icon variant="text" color="error" size="small" @click="removeItem(index)">
                <VIcon icon="tabler-trash" />
              </VBtn>
            </template>
          </VCardItem>
          <VDivider />
          <VCardText>
            <VRow>
              <VCol cols="12" sm="6">
                <VTextField v-model="item.hsCode" label="HS Code *" variant="outlined" />
              </VCol>
              <VCol cols="12" sm="6">
                <VTextField v-model="item.productDescription" label="Product Description *" variant="outlined" />
              </VCol>
              <VCol cols="12" sm="6">
                <VSelect v-model="item.saleType" :items="saleTypes" label="Sale Type *" variant="outlined" />
              </VCol>
              <VCol cols="12" sm="3">
                <VSelect v-model="item.rate" :items="rateOptions" label="Rate *" variant="outlined" />
              </VCol>
              <VCol cols="12" sm="3">
                <VSelect v-model="item.uoM" :items="uomList" label="UOM *" variant="outlined" />
              </VCol>
              <VCol cols="12" sm="3">
                <VTextField v-model.number="item.quantity" label="Quantity *" type="number" variant="outlined" />
              </VCol>
              <VCol cols="12" sm="3">
                <VTextField v-model.number="item.valueSalesExcludingST" label="Value Excl. ST *" type="number"
                  variant="outlined" prefix="PKR" />
              </VCol>
              <VCol cols="12" sm="3">
                <VTextField v-model.number="item.salesTaxApplicable" label="Sales Tax *" type="number"
                  variant="outlined" prefix="PKR" />
              </VCol>
              <VCol cols="12" sm="3">
                <VTextField v-model.number="item.totalValues" label="Total Value *" type="number" variant="outlined"
                  prefix="PKR" />
              </VCol>
              <VCol cols="12" sm="3">
                <VTextField v-model.number="item.salesTaxWithheldAtSource" label="ST Withheld *" type="number"
                  variant="outlined" prefix="PKR" />
              </VCol>
              <VCol cols="12" sm="3">
                <VTextField v-model.number="item.fixedNotifiedValueOrRetailPrice" label="Fixed/Retail Price *"
                  type="number" variant="outlined" prefix="PKR" />
              </VCol>
            </VRow>
          </VCardText>
        </VCard>

        <VBtn variant="tonal" color="success" prepend-icon="tabler-plus" class="mb-4" @click="addItem">
          Add Item
        </VBtn>

        <div class="d-flex gap-3 flex-wrap">
          <VBtn color="success" size="large" prepend-icon="tabler-shield-check" :loading="loading" :disabled="!fbrToken"
            @click="validateInvoiceData">
            Validate Invoice
          </VBtn>
          <VBtn v-if="isValid" color="primary" size="large" variant="tonal" prepend-icon="tabler-send"
            @click="proceedToSubmit">
            Proceed to Submit
          </VBtn>
        </div>
      </VCol>

      <!-- Response Panel -->
      <VCol cols="12" lg="4">
        <VCard class="sticky-top">
          <VCardItem>
            <template #prepend>
              <VAvatar :color="response ? (isValid ? 'success' : 'error') : 'secondary'" variant="tonal" size="36">
                <VIcon :icon="response ? (isValid ? 'tabler-circle-check' : 'tabler-circle-x') : 'tabler-shield'"
                  size="20" />
              </VAvatar>
            </template>
            <VCardTitle>Validation Result</VCardTitle>
          </VCardItem>
          <VDivider />
          <VCardText>
            <div v-if="!response && !errorMsg && !loading" class="text-center py-8">
              <VIcon icon="tabler-shield-check" size="48" class="text-medium-emphasis mb-3" />
              <p class="text-body-2 text-medium-emphasis">
                Validation result will appear here.
              </p>
            </div>

            <div v-if="loading" class="text-center py-8">
              <VProgressCircular indeterminate color="success" class="mb-3" />
              <p class="text-body-2 text-medium-emphasis">
                Validating...
              </p>
            </div>

            <VAlert v-if="errorMsg" type="error" variant="tonal" class="mb-3">
              {{ errorMsg }}
            </VAlert>

            <template v-if="response">
              <VAlert :type="isValid ? 'success' : 'error'" variant="tonal" class="mb-3">
                <strong>{{ response.validationResponse?.status }}</strong>
                <span class="d-block text-caption mt-1">{{ response.dated }}</span>
              </VAlert>

              <div v-if="response.validationResponse?.invoiceStatuses" class="mb-3">
                <p class="text-body-2 font-weight-semibold mb-2">
                  Item Results
                </p>
                <div v-for="s in response.validationResponse.invoiceStatuses" :key="s.itemSNo"
                  class="pa-2 rounded border mb-1">
                  <div class="d-flex align-center justify-space-between">
                    <span class="text-caption font-weight-medium">Item {{ s.itemSNo }}</span>
                    <VChip :color="s.statusCode === '00' ? 'success' : 'error'" size="x-small" variant="tonal">
                      {{ s.status }}
                    </VChip>
                  </div>
                  <span v-if="s.error" class="text-caption text-error d-block mt-1">
                    Error {{ s.errorCode }}: {{ s.error }}
                  </span>
                </div>
              </div>

              <VExpansionPanels>
                <VExpansionPanel title="Raw JSON">
                  <VExpansionPanelText>
                    <pre class="text-caption overflow-auto"
                      style="max-block-size: 250px;">{{ JSON.stringify(response, null, 2) }}</pre>
                  </VExpansionPanelText>
                </VExpansionPanel>
              </VExpansionPanels>
            </template>
          </VCardText>
        </VCard>
      </VCol>
    </VRow>
  </div>
</template>

<style scoped>
.sticky-top {
  position: sticky;
  inset-block-start: 80px;
}
</style>
