<script setup>
import { useFbrStore } from '@/stores/useFbrStore'

definePageMeta({
  // middleware: 'auth',
  name: 'fbr-print',
  layout: false,
})

const route = useRoute()
const fbrStore = useFbrStore()
const { generateQrDataUrl } = useQrCode()

const idx = Number(route.query.idx ?? 0)
const type = route.query.type ?? 'submitted'

const record = computed(() => {
  const list = type === 'validated'
    ? fbrStore.validatedInvoices
    : fbrStore.submittedInvoices
  return list[idx] ?? null
})

const company = reactive({
  name: 'Your Company Name (Pvt.) Ltd.',
  ntn: '0000000',
  address: 'Office No. 1, Business Avenue, Karachi, Pakistan',
  phone: '+92-21-0000000',
  email: 'info@yourcompany.com',
})

const qrDataUrl = ref('')
const logoDataUrl = ref('')
const printReady = ref(false)
const showSettings = ref(false)

onMounted(async () => {
  if (import.meta.client) {
    const savedLogo = localStorage.getItem('fbr_company_logo')
    if (savedLogo) logoDataUrl.value = savedLogo
    const savedCompany = localStorage.getItem('fbr_company_info')
    if (savedCompany) Object.assign(company, JSON.parse(savedCompany))
  }
  if (record.value) {
    const qrContent = [
      record.value.response?.invoiceNumber || 'N/A',
      record.value.sellerNTNCNIC,
      record.value.invoiceDate,
      record.value.invoiceType,
    ].join('|')
    qrDataUrl.value = await generateQrDataUrl(qrContent, 150)
  }
  printReady.value = true
})

const onLogoUpload = (event) => {
  const file = event.target.files[0]
  if (!file) return
  const reader = new FileReader()
  reader.onload = (e) => {
    logoDataUrl.value = e.target.result
    localStorage.setItem('fbr_company_logo', e.target.result)
  }
  reader.readAsDataURL(file)
}

const saveCompanyInfo = () => {
  localStorage.setItem('fbr_company_info', JSON.stringify({ ...company }))
  showSettings.value = false
}

const doPrint = () => window.print()

const inv = computed(() => record.value ?? {})
const invoiceNumber = computed(() => inv.value.response?.invoiceNumber || 'N/A')
const invoiceDate = computed(() => inv.value.invoiceDate || '')
const invoiceType = computed(() => inv.value.invoiceType || 'Sale Invoice')
const sellerName = computed(() => inv.value.sellerBusinessName || '')
const sellerNtn = computed(() => inv.value.sellerNTNCNIC || '')
const sellerProvince = computed(() => inv.value.sellerProvince || '')
const sellerAddress = computed(() => inv.value.sellerAddress || '')
const buyerName = computed(() => inv.value.buyerBusinessName || '')
const buyerNtn = computed(() => inv.value.buyerNTNCNIC || '')
const buyerProvince = computed(() => inv.value.buyerProvince || '')
const buyerAddress = computed(() => inv.value.buyerAddress || '')
const buyerRegType = computed(() => inv.value.buyerRegistrationType || '')
const items = computed(() => inv.value.items || [])
const status = computed(() => inv.value.status || '')

const totalSalesExclST = computed(() => items.value.reduce((s, i) => s + Number(i.valueSalesExcludingST || 0), 0))
const totalSalesTax = computed(() => items.value.reduce((s, i) => s + Number(i.salesTaxApplicable || 0), 0))
const totalFurtherTax = computed(() => items.value.reduce((s, i) => s + Number(i.furtherTax || 0), 0))
const totalExtraTax = computed(() => items.value.reduce((s, i) => s + Number(i.extraTax || 0), 0))
const totalFed = computed(() => items.value.reduce((s, i) => s + Number(i.fedPayable || 0), 0))
const totalDiscount = computed(() => items.value.reduce((s, i) => s + Number(i.discount || 0), 0))
const grandTotal = computed(() => totalSalesExclST.value + totalSalesTax.value + totalFurtherTax.value + totalExtraTax.value + totalFed.value - totalDiscount.value)
const formatPKR = val => Number(val || 0).toLocaleString('en-PK', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
</script>

<template>
  <div>
    <!-- Screen Toolbar - hidden on print -->
    <div class="no-print">
      <VAppBar elevation="1" color="surface">
        <VBtn icon variant="text" :to="{ name: 'fbr-history' }">
          <VIcon icon="tabler-arrow-left" />
        </VBtn>
        <VAppBarTitle>
          <span class="text-body-1 font-weight-semibold">Invoice Preview</span>
          <VChip :color="status === 'Valid' ? 'success' : 'error'" size="x-small" variant="tonal" class="ms-2">
            {{ status || 'No Data' }}
          </VChip>
        </VAppBarTitle>
        <template #append>
          <div class="d-flex gap-2 me-2">
            <VBtn variant="tonal" size="small" prepend-icon="tabler-building" @click="showSettings = true">
              Company Info
            </VBtn>
            <VBtn variant="tonal" size="small" prepend-icon="tabler-upload" tag="label">
              Upload Logo
              <input type="file" accept="image/*" class="d-none" @change="onLogoUpload">
            </VBtn>
            <VBtn color="primary" size="small" prepend-icon="tabler-printer" :disabled="!printReady" @click="doPrint">
              Print / Save PDF
            </VBtn>
          </div>
        </template>
      </VAppBar>

      <!-- No record warning -->
      <VAlert v-if="!record" type="warning" variant="tonal" class="ma-4">
        No invoice data found. Please go back to History and click the print icon on an invoice.
        <template #append>
          <VBtn variant="text" size="small" :to="{ name: 'fbr-history' }">Go to History</VBtn>
        </template>
      </VAlert>
    </div>

    <!-- Invoice Paper -->
    <div class="inv-page-bg no-print-bg">
      <div id="invoice-print" class="inv-paper">

        <!-- ===== HEADER ===== -->
        <div class="inv-header">
          <!-- Left: Company -->
          <div class="inv-company-block">
            <div class="inv-logo-wrap">
              <img v-if="logoDataUrl" :src="logoDataUrl" alt="Company Logo" class="inv-logo-img">
              <div v-else class="inv-logo-placeholder">
                <span>LOGO</span>
              </div>
            </div>
            <div class="inv-company-info">
              <div class="inv-company-name">{{ company.name }}</div>
              <div class="inv-company-line">NTN: {{ company.ntn }}</div>
              <div class="inv-company-line">{{ company.address }}</div>
              <div class="inv-company-line">Tel: {{ company.phone }}</div>
              <div class="inv-company-line">{{ company.email }}</div>
            </div>
          </div>

          <!-- Right: FBR + Invoice Info -->
          <div class="inv-right-block">
            <div class="fbr-badge">
              <div class="fbr-badge-top">FBR</div>
              <div class="fbr-badge-bottom">DIGITAL INVOICING SYSTEM</div>
            </div>
            <div class="inv-type-title">{{ invoiceType.toUpperCase() }}</div>
            <table class="inv-meta-table">
              <tr>
                <td class="inv-meta-label">Invoice No:</td>
                <td class="inv-meta-value">{{ invoiceNumber }}</td>
              </tr>
              <tr>
                <td class="inv-meta-label">Date:</td>
                <td class="inv-meta-value">{{ invoiceDate }}</td>
              </tr>
              <tr>
                <td class="inv-meta-label">Status:</td>
                <td class="inv-meta-value">
                  <span :class="status === 'Valid' ? 'badge-valid' : 'badge-invalid'">{{ status ||
                    'N/A'
                    }}</span>
                </td>
              </tr>
            </table>
          </div>
        </div>

        <!-- Blue divider -->
        <div class="inv-rule"></div>

        <!-- ===== SELLER / BUYER ===== -->
        <div class="inv-parties-row">
          <div class="inv-party-box">
            <div class="inv-party-heading">SELLER DETAILS</div>
            <div class="inv-party-name">{{ sellerName }}</div>
            <div class="inv-party-line"><b>NTN/CNIC:</b> {{ sellerNtn }}</div>
            <div class="inv-party-line"><b>Province:</b> {{ sellerProvince }}</div>
            <div class="inv-party-line"><b>Address:</b> {{ sellerAddress }}</div>
          </div>
          <div class="inv-party-gap"></div>
          <div class="inv-party-box">
            <div class="inv-party-heading">BUYER DETAILS</div>
            <div class="inv-party-name">{{ buyerName }}</div>
            <div class="inv-party-line"><b>NTN/CNIC:</b> {{ buyerNtn || 'N/A' }}</div>
            <div class="inv-party-line"><b>Province:</b> {{ buyerProvince }}</div>
            <div class="inv-party-line"><b>Address:</b> {{ buyerAddress }}</div>
            <div class="inv-party-line"><b>Registration:</b> {{ buyerRegType }}</div>
          </div>
        </div>

        <div class="inv-rule"></div>

        <!-- ===== ITEMS TABLE ===== -->
        <div class="inv-items-table-wrap">
          <table class="inv-items-table">
            <thead>
              <tr>
                <th>#</th>
                <th>HS Code</th>
                <th>Description</th>
                <th>Sale Type</th>
                <th>UOM</th>
                <th>Qty</th>
                <th>Rate</th>
                <th>Value Excl. ST</th>
                <th>Sales Tax</th>
                <th>Further Tax</th>
                <th>Item Total</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, i) in items" :key="i">
                <td class="tc">{{ i + 1 }}</td>
                <td class="tc mono">{{ item.hsCode }}</td>
                <td>{{ item.productDescription }}</td>
                <td class="tc small">{{ item.saleType }}</td>
                <td class="tc">{{ item.uoM }}</td>
                <td class="tr">{{ item.quantity }}</td>
                <td class="tc">{{ item.rate }}</td>
                <td class="tr">{{ formatPKR(item.valueSalesExcludingST) }}</td>
                <td class="tr">{{ formatPKR(item.salesTaxApplicable) }}</td>
                <td class="tr">{{ formatPKR(item.furtherTax) }}</td>
                <td class="tr bold">{{ formatPKR(Number(item.valueSalesExcludingST || 0) +
                  Number(item.salesTaxApplicable || 0) + Number(item.furtherTax || 0)) }}</td>
              </tr>
              <tr v-if="!items.length">
                <td colspan="11" class="tc" style="padding: 12px;color: #999;">No items</td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- ===== FOOTER: QR + TOTALS ===== -->
        <div class="inv-footer-row">

          <!-- QR Code -->
          <div class="inv-qr-block">
            <img v-if="qrDataUrl" :src="qrDataUrl" alt="FBR QR Code" class="inv-qr-img">
            <div v-else class="inv-qr-placeholder">QR</div>
            <div class="inv-qr-label">Scan to Verify</div>
            <div class="inv-qr-num">{{ invoiceNumber }}</div>
            <div class="inv-qr-spec">QR v2.0 (25x25) | 1.0 x 1.0 inch</div>
          </div>

          <!-- Totals -->
          <div class="inv-totals-block">
            <div class="inv-total-row">
              <span>Value of Sales (Excl. ST)</span>
              <span>PKR {{ formatPKR(totalSalesExclST) }}</span>
            </div>
            <div class="inv-total-row">
              <span>Sales Tax / FED in ST Mode</span>
              <span>PKR {{ formatPKR(totalSalesTax) }}</span>
            </div>
            <div v-if="totalFurtherTax > 0" class="inv-total-row">
              <span>Further Tax</span>
              <span>PKR {{ formatPKR(totalFurtherTax) }}</span>
            </div>
            <div v-if="totalExtraTax > 0" class="inv-total-row">
              <span>Extra Tax</span>
              <span>PKR {{ formatPKR(totalExtraTax) }}</span>
            </div>
            <div v-if="totalFed > 0" class="inv-total-row">
              <span>FED Payable</span>
              <span>PKR {{ formatPKR(totalFed) }}</span>
            </div>
            <div v-if="totalDiscount > 0" class="inv-total-row inv-discount-row">
              <span>Discount</span>
              <span>- PKR {{ formatPKR(totalDiscount) }}</span>
            </div>
            <div class="inv-grand-total-row">
              <span>GRAND TOTAL</span>
              <span>PKR {{ formatPKR(grandTotal) }}</span>
            </div>
          </div>
        </div>

        <!-- ===== BOTTOM STRIP ===== -->
        <div class="inv-bottom-strip">
          <div>
            <span class="strip-lbl">FBR Invoice No: </span>
            <span class="strip-val">{{ invoiceNumber }}</span>
          </div>
          <div class="strip-mid">
            This invoice is digitally registered with FBR Pakistan under the Digital Invoicing System.
            Verify at <b>fbr.gov.pk</b>
          </div>
          <div>
            <span class="strip-lbl">Status: </span>
            <span class="strip-val" :style="status === 'Valid' ? 'color:#2e7d32' : 'color:#c62828'">{{
              status
            }}</span>
          </div>
        </div>

      </div>
    </div>

    <!-- Company Info Dialog -->
    <VDialog v-model="showSettings" max-width="480" class="no-print">
      <VCard>
        <VCardItem>
          <VCardTitle>Company Information</VCardTitle>
          <VCardSubtitle>Appears on all printed invoices</VCardSubtitle>
          <template #append>
            <VBtn icon variant="text" size="small" @click="showSettings = false">
              <VIcon icon="tabler-x" />
            </VBtn>
          </template>
        </VCardItem>
        <VDivider />
        <VCardText class="pt-4 d-flex flex-column gap-3">
          <VTextField v-model="company.name" label="Company Name" variant="outlined" density="compact" />
          <VTextField v-model="company.ntn" label="NTN" variant="outlined" density="compact" />
          <VTextField v-model="company.address" label="Address" variant="outlined" density="compact" />
          <VTextField v-model="company.phone" label="Phone" variant="outlined" density="compact" />
          <VTextField v-model="company.email" label="Email" variant="outlined" density="compact" />
        </VCardText>
        <VCardActions>
          <VSpacer />
          <VBtn color="primary" prepend-icon="tabler-device-floppy" @click="saveCompanyInfo">Save</VBtn>
        </VCardActions>
      </VCard>
    </VDialog>
  </div>
</template>

<style scoped>
/* ── Page background ── */
.inv-page-bg {
  background: #e8eaf0;
  min-block-size: calc(100vh - 64px);
  padding-block: 24px 40px;
  padding-inline: 0;
}

/* ── A4 Paper ── */
.inv-paper {
  box-sizing: border-box;
  background: #fff;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 18%);
  color: #1a1a1a;
  font-family: Arial, Helvetica, sans-serif;
  font-size: 9pt;
  inline-size: 210mm;
  margin-block: 0;
  margin-inline: auto;
  min-block-size: 297mm;
  padding-block: 14mm 12mm;
  padding-inline: 16mm;
}

/* ── Header ── */
.inv-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-block-end: 10px;
}

.inv-company-block {
  display: flex;
  flex: 1;
  align-items: flex-start;
  gap: 12px;
}

.inv-logo-wrap {
  flex-shrink: 0;
}

.inv-logo-img {
  padding: 4px;
  border: 1px solid #ddd;
  border-radius: 6px;
  block-size: 80px;
  inline-size: 80px;
  object-fit: contain;
}

.inv-logo-placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px dashed #bbb;
  border-radius: 6px;
  block-size: 80px;
  color: #aaa;
  font-size: 10pt;
  font-weight: 700;
  inline-size: 80px;
}

.inv-company-info {
  flex: 1;
}

.inv-company-name {
  color: #1a3a6b;
  font-size: 13pt;
  font-weight: 700;
  margin-block-end: 4px;
}

.inv-company-line {
  color: #555;
  font-size: 8pt;
  line-height: 1.6;
}

/* Right block */
.inv-right-block {
  min-inline-size: 190px;
  text-align: end;
}

.fbr-badge {
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  border-radius: 5px;
  background: #1a3a6b;
  color: #fff;
  margin-block-end: 8px;
  padding-block: 5px;
  padding-inline: 14px;
}

.fbr-badge-top {
  font-size: 16pt;
  font-weight: 900;
  letter-spacing: 3px;
  line-height: 1;
}

.fbr-badge-bottom {
  font-size: 5.5pt;
  letter-spacing: 1.5px;
  margin-block-start: 1px;
  opacity: 0.9;
}

.inv-type-title {
  color: #1a3a6b;
  font-size: 13pt;
  font-weight: 700;
  margin-block-end: 6px;
}

.inv-meta-table {
  margin-inline-start: auto;
}

.inv-meta-table td {
  font-size: 8pt;
  padding-block: 1px;
  padding-inline: 4px;
}

.inv-meta-label {
  color: #777;
  white-space: nowrap;
}

.inv-meta-value {
  color: #1a1a1a;
  font-family: monospace;
  font-weight: 600;
}

.badge-valid {
  border: 1px solid #a5d6a7;
  border-radius: 12px;
  background: #e8f5e9;
  color: #2e7d32;
  font-size: 7.5pt;
  font-weight: 700;
  padding-block: 1px;
  padding-inline: 8px;
}

.badge-invalid {
  border: 1px solid #ef9a9a;
  border-radius: 12px;
  background: #ffebee;
  color: #c62828;
  font-size: 7.5pt;
  font-weight: 700;
  padding-block: 1px;
  padding-inline: 8px;
}

/* ── Rule ── */
.inv-rule {
  border-block-start: 2.5px solid #1a3a6b;
  margin-block: 8px;
  margin-inline: 0;
}

/* ── Parties ── */
.inv-parties-row {
  display: flex;
  margin-block-end: 8px;
}

.inv-party-box {
  flex: 1;
  border-radius: 5px;
  background: #f4f6fb;
  padding-block: 8px;
  padding-inline: 12px;
}

.inv-party-gap {
  inline-size: 10px;
}

.inv-party-heading {
  border-block-end: 1px solid #1a3a6b;
  color: #1a3a6b;
  font-size: 7pt;
  font-weight: 700;
  letter-spacing: 2px;
  margin-block-end: 5px;
  padding-block-end: 3px;
}

.inv-party-name {
  color: #1a1a1a;
  font-size: 10pt;
  font-weight: 700;
  margin-block-end: 3px;
}

.inv-party-line {
  color: #555;
  font-size: 8pt;
  line-height: 1.7;
}

/* ── Items Table ── */
.inv-items-table {
  border-collapse: collapse;
  font-size: 8pt;
  inline-size: 100%;
  margin-block-end: 12px;
}

.inv-items-table thead tr {
  background: #1a3a6b;
  color: #fff;
}

.inv-items-table thead th {
  border: 1px solid #1a3a6b;
  font-size: 7.5pt;
  font-weight: 600;
  padding-block: 5px;
  padding-inline: 4px;
  text-align: center;
}

.inv-items-table tbody tr:nth-child(even) {
  background: #f5f7fb;
}

.inv-items-table tbody td {
  border: 1px solid #dde;
  padding-block: 5px;
  padding-inline: 4px;
  vertical-align: middle;
}

.tc {
  text-align: center;
}

.tr {
  text-align: end;
}

.mono {
  font-family: monospace;
}

.small {
  font-size: 7pt;
}

.bold {
  font-weight: 700;
}

/* ── Footer Row ── */
.inv-footer-row {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  margin-block-end: 12px;
}

/* QR */
.inv-qr-block {
  min-inline-size: 120px;
  text-align: center;
}

.inv-qr-img {
  display: block;
  padding: 4px;
  border: 2px solid #1a3a6b;
  border-radius: 5px;
  block-size: 96px;
  inline-size: 96px;
  margin-block: 0 4px;
  margin-inline: auto;
}

.inv-qr-placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px dashed #bbb;
  border-radius: 5px;
  block-size: 96px;
  color: #aaa;
  font-size: 11pt;
  inline-size: 96px;
  margin-block: 0 4px;
  margin-inline: auto;
}

.inv-qr-label {
  color: #1a3a6b;
  font-size: 7pt;
  font-weight: 700;
}

.inv-qr-num {
  color: #666;
  font-family: monospace;
  font-size: 6pt;
  margin-block-start: 2px;
  max-inline-size: 120px;
  word-break: break-all;
}

.inv-qr-spec {
  color: #aaa;
  font-size: 6pt;
  margin-block-start: 2px;
}

/* Totals */
.inv-totals-block {
  flex: 1;
  margin-inline-start: auto;
  max-inline-size: 300px;
}

.inv-total-row {
  display: flex;
  justify-content: space-between;
  border-block-end: 1px solid #eee;
  color: #444;
  font-size: 8.5pt;
  padding-block: 3px;
  padding-inline: 8px;
}

.inv-total-row span:last-child {
  color: #1a1a1a;
  font-family: monospace;
  font-weight: 600;
}

.inv-discount-row span:last-child {
  color: #c62828;
}

.inv-grand-total-row {
  display: flex;
  justify-content: space-between;
  border-radius: 4px;
  background: #1a3a6b;
  color: #fff;
  font-size: 10pt;
  font-weight: 700;
  margin-block-start: 5px;
  padding-block: 6px;
  padding-inline: 8px;
}

.inv-grand-total-row>span {
  color: #fff;
}

/* ── Bottom Strip ── */
.inv-bottom-strip {
  display: flex;
  align-items: center;
  justify-content: space-between;
  border: 1px solid #c5cae9;
  border-radius: 4px;
  background: #eef2ff;
  font-size: 7.5pt;
  gap: 10px;
  padding-block: 6px;
  padding-inline: 12px;
}

.strip-lbl {
  color: #777;
}

.strip-val {
  font-family: monospace;
  font-weight: 700;
}

.strip-mid {
  flex: 1;
  color: #555;
  text-align: center;
}

/* ── Mobile Responsive ── */

/* Tablet: 768px se kam */
@media screen and (max-width: 768px) {
  .inv-page-bg {
    padding-block: 0;
    padding-inline: 0;
  }

  .inv-paper {
    border-radius: 0;
    box-shadow: none;
    font-size: 8pt;
    inline-size: 100%;
    min-block-size: unset;
    padding-block: 16px;
    padding-inline: 14px;
  }

  .inv-header {
    flex-direction: column;
    gap: 12px;
  }

  .inv-logo-img,
  .inv-logo-placeholder {
    block-size: 60px;
    inline-size: 60px;
  }

  .inv-company-name {
    font-size: 11pt;
  }

  .inv-right-block {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
    inline-size: 100%;
    min-inline-size: unset;
    text-align: start;
  }

  .fbr-badge {
    margin-block-end: 0;
  }

  .fbr-badge-top {
    font-size: 13pt;
  }

  .inv-type-title {
    font-size: 11pt;
  }

  .inv-meta-table {
    margin-inline-start: 0;
  }

  .inv-parties-row {
    flex-direction: column;
    gap: 8px;
  }

  .inv-party-gap {
    display: none;
  }

  .inv-party-box {
    inline-size: 100%;
  }

  .inv-items-table-wrap {
    -webkit-overflow-scrolling: touch;
    overflow-x: auto;
  }

  .inv-items-table {
    font-size: 7.5pt;
    min-inline-size: 580px;
  }

  .inv-footer-row {
    flex-direction: column;
    align-items: stretch;
    gap: 16px;
  }

  .inv-qr-block {
    display: flex;
    align-items: center;
    gap: 12px;
    min-inline-size: unset;
    text-align: start;
  }

  .inv-qr-img,
  .inv-qr-placeholder {
    flex-shrink: 0;
    margin: 0;
    block-size: 80px;
    inline-size: 80px;
  }

  .inv-qr-num {
    max-inline-size: unset;
  }

  .inv-totals-block {
    margin-inline-start: 0;
    max-inline-size: 100%;
  }

  .inv-bottom-strip {
    flex-direction: column;
    align-items: flex-start;
    font-size: 7pt;
    gap: 4px;
  }

  .strip-mid {
    text-align: start;
  }
}

/* Small mobile: 480px se kam */
@media screen and (max-width: 480px) {
  .inv-paper {
    font-size: 7.5pt;
    padding-block: 12px;
    padding-inline: 10px;
  }

  .inv-company-name {
    font-size: 10pt;
  }

  .inv-logo-img,
  .inv-logo-placeholder {
    block-size: 48px;
    inline-size: 48px;
  }

  .fbr-badge-top {
    font-size: 11pt;
    letter-spacing: 2px;
  }

  .fbr-badge-bottom {
    font-size: 5pt;
  }

  .inv-type-title {
    font-size: 10pt;
  }

  .inv-party-name {
    font-size: 9pt;
  }

  .inv-grand-total-row {
    font-size: 9pt;
  }

  .inv-total-row {
    font-size: 8pt;
  }
}

/* ── Print ── */
@media print {
  @page {
    margin: 0;
    size: a4;
  }

  body * {
    visibility: hidden;
  }

  #invoice-print,
  #invoice-print * {
    visibility: visible;
  }

  #invoice-print {
    position: fixed;
    margin: 0;
    box-shadow: none;
    inline-size: 210mm;
    inset-block-start: 0;
    inset-inline-start: 0;
    min-block-size: 297mm;
    padding-block: 12mm;
    padding-inline: 14mm;
  }

  .no-print {
    display: none !important;
  }

  .inv-page-bg {
    padding: 0;
    background: none;
  }
}
</style>
