<script setup>
import { useFbrStore } from '@/stores/useFbrStore'

definePageMeta({
  // middleware: 'auth',
  name: 'fbr-history',
})

const fbrStore = useFbrStore()
const activeTab = ref('submitted')
const detailDialog = ref(false)
const selectedRecord = ref(null)

const viewDetail = (record) => {
  selectedRecord.value = record
  detailDialog.value = true
}

const clearHistory = () => {
  fbrStore.clearHistory()
}

const exportJson = (data) => {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `fbr-invoice-${Date.now()}.json`
  a.click()
  URL.revokeObjectURL(url)
}

const printInvoice = (index, type = 'submitted') => {
  navigateTo({ name: 'fbr-print', query: { idx: index, type } })
}
</script>

<template>
  <div>
    <VRow class="mb-4">
      <VCol cols="12">
        <div class="d-flex align-center justify-space-between gap-3 flex-wrap">
          <div class="d-flex align-center gap-3">
            <VBtn icon variant="text" :to="{ name: 'fbr-dashboard' }">
              <VIcon icon="tabler-arrow-left" />
            </VBtn>
            <div>
              <h4 class="text-h5 font-weight-bold">
                Invoice History
              </h4>
              <p class="text-body-2 text-medium-emphasis mb-0">
                Session log of submitted and validated invoices
              </p>
            </div>
          </div>
          <VBtn color="error" variant="tonal" prepend-icon="tabler-trash"
            :disabled="!fbrStore.submittedInvoices.length && !fbrStore.validatedInvoices.length" @click="clearHistory">
            Clear History
          </VBtn>
        </div>
      </VCol>
    </VRow>

    <VAlert type="info" variant="tonal" class="mb-4" density="compact">
      History is stored in memory for this session only. It will be cleared when you refresh the page.
    </VAlert>

    <VCard>
      <VTabs v-model="activeTab">
        <VTab value="submitted" prepend-icon="tabler-send">
          Submitted
          <VChip v-if="fbrStore.submittedInvoices.length" size="x-small" color="primary" class="ms-2">
            {{ fbrStore.submittedInvoices.length }}
          </VChip>
        </VTab>
        <VTab value="validated" prepend-icon="tabler-shield-check">
          Validated
          <VChip v-if="fbrStore.validatedInvoices.length" size="x-small" color="success" class="ms-2">
            {{ fbrStore.validatedInvoices.length }}
          </VChip>
        </VTab>
      </VTabs>
      <VDivider />

      <VWindow v-model="activeTab">
        <!-- Submitted Invoices -->
        <VWindowItem value="submitted">
          <div v-if="!fbrStore.submittedInvoices.length" class="text-center py-12">
            <VIcon icon="tabler-inbox" size="64" class="text-medium-emphasis mb-3" />
            <p class="text-body-1 text-medium-emphasis">
              No submitted invoices yet
            </p>
            <VBtn color="primary" variant="tonal" :to="{ name: 'fbr-submit' }" class="mt-2">
              Submit an Invoice
            </VBtn>
          </div>
          <VTable v-else>
            <thead>
              <tr>
                <th>FBR Invoice No</th>
                <th>Seller NTN</th>
                <th>Buyer NTN</th>
                <th>Invoice Type</th>
                <th>Date</th>
                <th>Status</th>
                <th>Submitted At</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="inv in fbrStore.submittedInvoices" :key="inv.submittedAt">
                <td>
                  <span class="text-caption font-weight-medium text-primary">
                    {{ inv.response?.invoiceNumber || '—' }}
                  </span>
                </td>
                <td>{{ inv.sellerNTNCNIC }}</td>
                <td>{{ inv.buyerNTNCNIC || '—' }}</td>
                <td>{{ inv.invoiceType }}</td>
                <td>{{ inv.invoiceDate }}</td>
                <td>
                  <VChip :color="inv.status === 'Valid' ? 'success' : 'error'" size="small" variant="tonal">
                    {{ inv.status }}
                  </VChip>
                </td>
                <td class="text-caption">
                  {{ new Date(inv.submittedAt).toLocaleString() }}
                </td>
                <td>
                  <div class="d-flex gap-1">
                    <VBtn icon size="small" variant="text" color="primary" @click="viewDetail(inv)">
                      <VIcon icon="tabler-eye" />
                    </VBtn>
                    <VBtn icon size="small" variant="text" color="warning"
                      @click="printInvoice(fbrStore.submittedInvoices.indexOf(inv), 'submitted')">
                      <VIcon icon="tabler-printer" />
                    </VBtn>
                    <VBtn icon size="small" variant="text" color="success" @click="exportJson(inv)">
                      <VIcon icon="tabler-download" />
                    </VBtn>
                  </div>
                </td>
              </tr>
            </tbody>
          </VTable>
        </VWindowItem>

        <!-- Validated Invoices -->
        <VWindowItem value="validated">
          <div v-if="!fbrStore.validatedInvoices.length" class="text-center py-12">
            <VIcon icon="tabler-inbox" size="64" class="text-medium-emphasis mb-3" />
            <p class="text-body-1 text-medium-emphasis">
              No validated invoices yet
            </p>
            <VBtn color="success" variant="tonal" :to="{ name: 'fbr-validate' }" class="mt-2">
              Validate an Invoice
            </VBtn>
          </div>
          <VTable v-else>
            <thead>
              <tr>
                <th>Seller NTN</th>
                <th>Buyer NTN</th>
                <th>Invoice Type</th>
                <th>Date</th>
                <th>Status</th>
                <th>Validated At</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="inv in fbrStore.validatedInvoices" :key="inv.validatedAt">
                <td>{{ inv.sellerNTNCNIC }}</td>
                <td>{{ inv.buyerNTNCNIC || '—' }}</td>
                <td>{{ inv.invoiceType }}</td>
                <td>{{ inv.invoiceDate }}</td>
                <td>
                  <VChip :color="inv.status === 'Valid' ? 'success' : 'error'" size="small" variant="tonal">
                    {{ inv.status }}
                  </VChip>
                </td>
                <td class="text-caption">
                  {{ new Date(inv.validatedAt).toLocaleString() }}
                </td>
                <td>
                  <div class="d-flex gap-1">
                    <VBtn icon size="small" variant="text" color="primary" @click="viewDetail(inv)">
                      <VIcon icon="tabler-eye" />
                    </VBtn>
                    <VBtn icon size="small" variant="text" color="warning"
                      @click="printInvoice(fbrStore.validatedInvoices.indexOf(inv), 'validated')">
                      <VIcon icon="tabler-printer" />
                    </VBtn>
                    <VBtn icon size="small" variant="text" color="success" @click="exportJson(inv)">
                      <VIcon icon="tabler-download" />
                    </VBtn>
                  </div>
                </td>
              </tr>
            </tbody>
          </VTable>
        </VWindowItem>
      </VWindow>
    </VCard>

    <!-- Detail Dialog -->
    <VDialog v-model="detailDialog" max-width="700" scrollable>
      <VCard v-if="selectedRecord">
        <VCardItem>
          <VCardTitle>Invoice Detail</VCardTitle>
          <template #append>
            <VBtn icon variant="text" @click="detailDialog = false">
              <VIcon icon="tabler-x" />
            </VBtn>
          </template>
        </VCardItem>
        <VDivider />
        <VCardText>
          <!-- Header Info -->
          <VRow class="mb-3">
            <VCol cols="6" sm="4">
              <p class="text-caption text-medium-emphasis mb-0">
                Invoice Type
              </p>
              <p class="text-body-2 font-weight-medium mb-0">
                {{ selectedRecord.invoiceType }}
              </p>
            </VCol>
            <VCol cols="6" sm="4">
              <p class="text-caption text-medium-emphasis mb-0">
                Invoice Date
              </p>
              <p class="text-body-2 font-weight-medium mb-0">
                {{ selectedRecord.invoiceDate }}
              </p>
            </VCol>
            <VCol cols="6" sm="4">
              <p class="text-caption text-medium-emphasis mb-0">
                Status
              </p>
              <VChip :color="selectedRecord.status === 'Valid' ? 'success' : 'error'" size="small" variant="tonal">
                {{ selectedRecord.status }}
              </VChip>
            </VCol>
            <VCol cols="6" sm="4">
              <p class="text-caption text-medium-emphasis mb-0">
                Seller NTN
              </p>
              <p class="text-body-2 font-weight-medium mb-0">
                {{ selectedRecord.sellerNTNCNIC }}
              </p>
            </VCol>
            <VCol cols="6" sm="4">
              <p class="text-caption text-medium-emphasis mb-0">
                Buyer NTN
              </p>
              <p class="text-body-2 font-weight-medium mb-0">
                {{ selectedRecord.buyerNTNCNIC || '—' }}
              </p>
            </VCol>
            <VCol v-if="selectedRecord.response?.invoiceNumber" cols="12">
              <p class="text-caption text-medium-emphasis mb-0">
                FBR Invoice Number
              </p>
              <p class="text-body-1 font-weight-bold text-primary mb-0">
                {{ selectedRecord.response.invoiceNumber }}
              </p>
            </VCol>
          </VRow>

          <VDivider class="mb-3" />

          <!-- Items -->
          <p class="text-body-2 font-weight-semibold mb-2">
            Items ({{ selectedRecord.items?.length || 0 }})
          </p>
          <div v-for="(item, i) in selectedRecord.items" :key="i" class="pa-3 rounded border mb-2">
            <div class="d-flex justify-space-between mb-1">
              <span class="text-caption font-weight-semibold">Item {{ i + 1 }}</span>
              <VChip size="x-small" variant="tonal" color="primary">
                {{ item.hsCode }}
              </VChip>
            </div>
            <p class="text-caption mb-1">
              {{ item.productDescription }}
            </p>
            <div class="d-flex gap-4 flex-wrap">
              <span class="text-caption">Rate: <strong>{{ item.rate }}</strong></span>
              <span class="text-caption">Qty: <strong>{{ item.quantity }}</strong></span>
              <span class="text-caption">Value: <strong>PKR {{ item.valueSalesExcludingST }}</strong></span>
              <span class="text-caption">ST: <strong>PKR {{ item.salesTaxApplicable }}</strong></span>
            </div>
          </div>

          <VDivider class="my-3" />

          <!-- Raw Response -->
          <VExpansionPanels>
            <VExpansionPanel title="Full JSON Payload + Response">
              <VExpansionPanelText>
                <pre class="text-caption overflow-auto" style="max-block-size: 300px;">{{ JSON.stringify(selectedRecord, null,
                  2) }}</pre>
              </VExpansionPanelText>
            </VExpansionPanel>
          </VExpansionPanels>
        </VCardText>
        <VCardActions>
          <VSpacer />
          <VBtn color="warning" variant="tonal" prepend-icon="tabler-printer"
            @click="printInvoice(activeTab === 'submitted' ? fbrStore.submittedInvoices.indexOf(selectedRecord) : fbrStore.validatedInvoices.indexOf(selectedRecord), activeTab)">
            Print Invoice
          </VBtn>
          <VBtn color="success" variant="tonal" prepend-icon="tabler-download" @click="exportJson(selectedRecord)">
            Export JSON
          </VBtn>
          <VBtn variant="tonal" @click="detailDialog = false">
            Close
          </VBtn>
        </VCardActions>
      </VCard>
    </VDialog>
  </div>
</template>
