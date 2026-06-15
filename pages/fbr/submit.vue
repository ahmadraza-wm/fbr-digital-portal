<script setup>
import { useFbrStore } from '@/stores/useFbrStore'

definePageMeta({
  // middleware: 'auth',
  name: 'fbr-submit',
})

const fbrStore = useFbrStore()
const { postInvoice, postInvoiceSandbox, getProvinces, getUomList } = useFbrApi()
const fbrToken = useCookie('fbrToken')

// ─── Form State ───────────────────────────────────────────────────────────────
const loading = ref(false)
const response = ref(null)
const errorMsg = ref(null)
const formRef = ref(null)

// Invoice Header
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

// Invoice Items
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

// ─── Reference Data ───────────────────────────────────────────────────────────
const provinces = ref([])
const uomList = ref([])

onMounted(async () => {
  try {
    const [prov, uom] = await Promise.all([getProvinces(), getUomList()])
    provinces.value = prov.map(p => p.stateProvinceDesc)
    uomList.value = uom.map(u => u.description)
  }
  catch {
    // Use fallback static values if API not reachable
    provinces.value = ['Punjab', 'Sindh', 'KPK', 'Balochistan', 'AJK', 'GB', 'ICT']
    uomList.value = ['Numbers, pieces, units', 'KG', 'Litre', 'Metre', 'Square Metre', 'KWH', 'Dozen']
  }
})

const invoiceTypes = ['Sale Invoice', 'Debit Note']
const registrationTypes = ['Registered', 'Unregistered']
const saleTypes = [
  'Goods at standard rate (default)',
  'Goods at Reduced Rate',
  'Exempt Goods',
  'Goods at zero-rate',
  '3rd Schedule Goods',
  'Cotton Ginners',
  'Telecommunication services',
  'Toll Manufacturing',
  'Petroleum Products',
  'Electricity Supply to Retailers',
  'Gas to CNG stations',
  'Mobile Phones',
  'Processing/ Conversion of Goods',
  'Goods (FED in ST Mode)',
  'Services (FED in ST Mode)',
  'Services',
  'Electric Vehicle',
  'Cement /Concrete Block',
  'Potassium Chlorate',
  'CNG Sales',
  'Goods as per SRO.297(|)/2023',
  'Non-Adjustable Supplies',
  'Steel Melting and re-rolling',
  'Ship breaking',
]

const sandboxScenarios = [
  'SN001', 'SN002', 'SN003', 'SN004', 'SN005', 'SN006', 'SN007',
  'SN008', 'SN009', 'SN010', 'SN011', 'SN012', 'SN013', 'SN014',
  'SN015', 'SN016', 'SN017', 'SN018', 'SN019', 'SN020', 'SN021',
  'SN022', 'SN023', 'SN024', 'SN025', 'SN026', 'SN027', 'SN028',
]

const rateOptions = ['0%', '5%', '8%', '10%', '13%', '17%', '18%', '25%']

// ─── Computed Payload ─────────────────────────────────────────────────────────
const payload = computed(() => {
  const base = { ...invoiceHeader.value, items: items.value }
  if (!fbrStore.isSandbox) delete base.scenarioId
  if (base.invoiceType !== 'Debit Note') delete base.invoiceRefNo
  return base
})

// ─── Submit ───────────────────────────────────────────────────────────────────
const submitInvoice = async () => {
  if (!fbrToken.value) {
    errorMsg.value = 'API token not configured. Please go to Settings first.'
    return
  }

  loading.value = true
  response.value = null
  errorMsg.value = null

  try {
    const fn = fbrStore.isSandbox ? postInvoiceSandbox : postInvoice
    const result = await fn(payload.value)
    response.value = result
    fbrStore.addSubmittedInvoice(payload.value, result)
    fbrStore.setLastResponse(result)
  }
  catch (err) {
    errorMsg.value = err?.data?.message || err?.message || 'An error occurred while submitting the invoice.'
    fbrStore.setLastError(errorMsg.value)
  }
  finally {
    loading.value = false
  }
}

const resetForm = () => {
  invoiceHeader.value = {
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
  }
  items.value = [createEmptyItem()]
  response.value = null
  errorMsg.value = null
}

const isValid = computed(() => response.value?.validationResponse?.status === 'Valid')
const isInvalid = computed(() => response.value?.validationResponse?.status === 'Invalid' || response.value?.validationResponse?.status === 'invalid')
</script>

<template>
  <div>
    <!-- Page Header -->
    <VRow class="mb-4">
      <VCol cols="12">
        <div class="d-flex align-center gap-3">
          <VBtn icon variant="text" :to="{ name: 'fbr-dashboard' }">
            <VIcon icon="tabler-arrow-left" />
          </VBtn>
          <div class="flex-grow-1">
            <h4 class="text-h5 font-weight-bold">
              Submit Invoice to FBR
            </h4>
            <p class="text-body-2 text-medium-emphasis mb-0">
              Post invoice data in real-time via PRAL DI API
            </p>
          </div>
          <VChip :color="fbrStore.environmentColor" variant="tonal" prepend-icon="tabler-server">
            {{ fbrStore.environmentLabel }}
          </VChip>
        </div>
      </VCol>
    </VRow>

    <!-- Token Warning -->
    <VRow v-if="!fbrToken">
      <VCol cols="12">
        <VAlert type="error" variant="tonal" class="mb-4">
          API token not configured.
          <NuxtLink to="/fbr/settings" class="text-error font-weight-bold">
            Go to Settings
          </NuxtLink>
        </VAlert>
      </VCol>
    </VRow>

    <VRow>
      <!-- Form -->
      <VCol cols="12" lg="8">
        <!-- Invoice Header -->
        <VCard class="mb-4">
          <VCardItem>
            <template #prepend>
              <VAvatar color="primary" variant="tonal" size="36">
                <VIcon icon="tabler-file-invoice" size="20" />
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

              <!-- Seller Info -->
              <VCol cols="12">
                <p class="text-body-2 font-weight-semibold text-primary mb-2">
                  Seller Information
                </p>
              </VCol>
              <VCol cols="12" sm="6">
                <VTextField v-model="invoiceHeader.sellerNTNCNIC" label="Seller NTN/CNIC *"
                  placeholder="7 or 13 digit NTN/CNIC" variant="outlined" :hint="'7 digits for NTN, 13 digits for CNIC'"
                  persistent-hint />
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

              <!-- Buyer Info -->
              <VCol cols="12">
                <p class="text-body-2 font-weight-semibold text-success mb-2">
                  Buyer Information
                </p>
              </VCol>
              <VCol cols="12" sm="6">
                <VTextField v-model="invoiceHeader.buyerNTNCNIC" label="Buyer NTN/CNIC"
                  placeholder="Optional if Unregistered" variant="outlined"
                  :hint="invoiceHeader.buyerRegistrationType === 'Unregistered' ? 'Optional for unregistered buyers' : 'Required for registered buyers'"
                  persistent-hint />
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

              <!-- Debit Note Ref -->
              <VCol v-if="invoiceHeader.invoiceType === 'Debit Note'" cols="12" sm="6">
                <VTextField v-model="invoiceHeader.invoiceRefNo" label="Reference Invoice No *"
                  placeholder="22 digits (NTN) or 28 digits (CNIC)" variant="outlined" hint="Required for Debit Note"
                  persistent-hint />
              </VCol>

              <!-- Sandbox Scenario -->
              <VCol v-if="fbrStore.isSandbox" cols="12" sm="6">
                <VSelect v-model="invoiceHeader.scenarioId" :items="sandboxScenarios" label="Scenario ID (Sandbox) *"
                  variant="outlined" hint="Required for sandbox testing" persistent-hint />
              </VCol>
            </VRow>
          </VCardText>
        </VCard>

        <!-- Invoice Items -->
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
                <VTextField v-model="item.hsCode" label="HS Code *" placeholder="e.g. 0101.2100" variant="outlined" />
              </VCol>
              <VCol cols="12" sm="6">
                <VTextField v-model="item.productDescription" label="Product Description *" variant="outlined" />
              </VCol>
              <VCol cols="12" sm="6">
                <VSelect v-model="item.saleType" :items="saleTypes" label="Sale Type *" variant="outlined" />
              </VCol>
              <VCol cols="12" sm="3">
                <VSelect v-model="item.rate" :items="rateOptions" label="Tax Rate *" variant="outlined" />
              </VCol>
              <VCol cols="12" sm="3">
                <VSelect v-model="item.uoM" :items="uomList" label="Unit of Measure *" variant="outlined" />
              </VCol>
              <VCol cols="12" sm="3">
                <VTextField v-model.number="item.quantity" label="Quantity *" type="number" variant="outlined" />
              </VCol>
              <VCol cols="12" sm="3">
                <VTextField v-model.number="item.valueSalesExcludingST" label="Value Excl. ST *" type="number"
                  variant="outlined" prefix="PKR" />
              </VCol>
              <VCol cols="12" sm="3">
                <VTextField v-model.number="item.salesTaxApplicable" label="Sales Tax Applicable *" type="number"
                  variant="outlined" prefix="PKR" />
              </VCol>
              <VCol cols="12" sm="3">
                <VTextField v-model.number="item.totalValues" label="Total Value (Incl. Tax) *" type="number"
                  variant="outlined" prefix="PKR" />
              </VCol>
              <VCol cols="12" sm="3">
                <VTextField v-model.number="item.salesTaxWithheldAtSource" label="ST Withheld at Source *" type="number"
                  variant="outlined" prefix="PKR" />
              </VCol>
              <VCol cols="12" sm="3">
                <VTextField v-model.number="item.fixedNotifiedValueOrRetailPrice" label="Fixed/Notified/Retail Price *"
                  type="number" variant="outlined" prefix="PKR" />
              </VCol>
              <VCol cols="12" sm="3">
                <VTextField v-model.number="item.furtherTax" label="Further Tax" type="number" variant="outlined"
                  prefix="PKR" />
              </VCol>
              <VCol cols="12" sm="3">
                <VTextField v-model.number="item.extraTax" label="Extra Tax" type="number" variant="outlined"
                  prefix="PKR" />
              </VCol>
              <VCol cols="12" sm="3">
                <VTextField v-model.number="item.fedPayable" label="FED Payable" type="number" variant="outlined"
                  prefix="PKR" />
              </VCol>
              <VCol cols="12" sm="3">
                <VTextField v-model.number="item.discount" label="Discount" type="number" variant="outlined"
                  prefix="PKR" />
              </VCol>
              <VCol cols="12" sm="3">
                <VTextField v-model="item.sroScheduleNo" label="SRO Schedule No" variant="outlined" />
              </VCol>
              <VCol cols="12" sm="3">
                <VTextField v-model="item.sroItemSerialNo" label="SRO Item Serial No" variant="outlined" />
              </VCol>
            </VRow>
          </VCardText>
        </VCard>

        <!-- Add Item Button -->
        <VBtn variant="tonal" color="primary" prepend-icon="tabler-plus" class="mb-4" @click="addItem">
          Add Another Item
        </VBtn>

        <!-- Action Buttons -->
        <div class="d-flex gap-3 flex-wrap">
          <VBtn color="primary" size="large" prepend-icon="tabler-send" :loading="loading" :disabled="!fbrToken"
            @click="submitInvoice">
            Submit to FBR
          </VBtn>
          <VBtn variant="tonal" size="large" prepend-icon="tabler-refresh" @click="resetForm">
            Reset Form
          </VBtn>
        </div>
      </VCol>

      <!-- Response Panel -->
      <VCol cols="12" lg="4">
        <VCard class="sticky-top">
          <VCardItem>
            <template #prepend>
              <VAvatar :color="response ? (isValid ? 'success' : 'error') : 'secondary'" variant="tonal" size="36">
                <VIcon :icon="response ? (isValid ? 'tabler-circle-check' : 'tabler-circle-x') : 'tabler-api'"
                  size="20" />
              </VAvatar>
            </template>
            <VCardTitle>API Response</VCardTitle>
          </VCardItem>
          <VDivider />
          <VCardText>
            <!-- No response yet -->
            <div v-if="!response && !errorMsg && !loading" class="text-center py-8">
              <VIcon icon="tabler-send" size="48" class="text-medium-emphasis mb-3" />
              <p class="text-body-2 text-medium-emphasis">
                Fill the form and submit to see the FBR response here.
              </p>
            </div>

            <!-- Loading -->
            <div v-if="loading" class="text-center py-8">
              <VProgressCircular indeterminate color="primary" class="mb-3" />
              <p class="text-body-2 text-medium-emphasis">
                Submitting to FBR...
              </p>
            </div>

            <!-- Error -->
            <VAlert v-if="errorMsg" type="error" variant="tonal" class="mb-3">
              {{ errorMsg }}
            </VAlert>

            <!-- Success Response -->
            <template v-if="response">
              <VAlert :type="isValid ? 'success' : 'error'" variant="tonal" class="mb-3">
                <strong>{{ response.validationResponse?.status }}</strong>
                <span v-if="response.invoiceNumber" class="d-block text-caption mt-1">
                  Invoice No: {{ response.invoiceNumber }}
                </span>
              </VAlert>

              <!-- Invoice Number -->
              <div v-if="response.invoiceNumber" class="pa-3 rounded border mb-3">
                <p class="text-caption text-medium-emphasis mb-1">
                  FBR Invoice Number
                </p>
                <p class="text-body-2 font-weight-bold mb-0">
                  {{ response.invoiceNumber }}
                </p>
                <p class="text-caption text-medium-emphasis mb-0">
                  {{ response.dated }}
                </p>
              </div>

              <!-- Item Statuses -->
              <div v-if="response.validationResponse?.invoiceStatuses" class="mb-3">
                <p class="text-body-2 font-weight-semibold mb-2">
                  Item Statuses
                </p>
                <div v-for="s in response.validationResponse.invoiceStatuses" :key="s.itemSNo"
                  class="d-flex align-center justify-space-between pa-2 rounded border mb-1">
                  <div>
                    <span class="text-caption font-weight-medium">Item {{ s.itemSNo }}</span>
                    <span v-if="s.error" class="d-block text-caption text-error">{{ s.error }}</span>
                    <span v-if="s.invoiceNo" class="d-block text-caption text-medium-emphasis">{{ s.invoiceNo }}</span>
                  </div>
                  <VChip :color="s.statusCode === '00' ? 'success' : 'error'" size="x-small" variant="tonal">
                    {{ s.status }}
                  </VChip>
                </div>
              </div>

              <!-- Raw JSON -->
              <VExpansionPanels>
                <VExpansionPanel title="Raw JSON Response">
                  <VExpansionPanelText>
                    <pre class="text-caption overflow-auto"
                      style="max-block-size: 300px;">{{ JSON.stringify(response, null, 2) }}</pre>
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
