<script setup>
import { useFbrStore } from '@/stores/useFbrStore'

definePageMeta({
  // middleware: 'auth',
  name: 'dashboard',
})

const authStore = useAuthStore()
const fbrStore = useFbrStore()
const userRole = useCookie('roles')

if (authStore.roles === null)
  authStore.roles = userRole.value

// ── Computed stats from store ─────────────────────────────────────────────────
const totalSubmitted = computed(() => fbrStore.submittedInvoices.length)
const totalValidated = computed(() => fbrStore.validatedInvoices.length)

const totalSalesValue = computed(() =>
  fbrStore.submittedInvoices.reduce((sum, inv) =>
    sum + (inv.items || []).reduce((s, i) => s + Number(i.valueSalesExcludingST || 0), 0), 0),
)

const totalSalesTax = computed(() =>
  fbrStore.submittedInvoices.reduce((sum, inv) =>
    sum + (inv.items || []).reduce((s, i) => s + Number(i.salesTaxApplicable || 0), 0), 0),
)

const validInvoices = computed(() =>
  fbrStore.submittedInvoices.filter(i => i.status === 'Valid').length,
)

const invalidInvoices = computed(() =>
  fbrStore.submittedInvoices.filter(i => i.status !== 'Valid').length,
)

const validRate = computed(() =>
  totalSubmitted.value > 0
    ? Math.round((validInvoices.value / totalSubmitted.value) * 100)
    : 0,
)

// ── Recent invoices (last 5) ──────────────────────────────────────────────────
const recentInvoices = computed(() => fbrStore.submittedInvoices.slice(0, 5))

// ── Monthly chart data (mock from store) ─────────────────────────────────────
const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const currentMonth = new Date().getMonth()

const chartSalesData = computed(() => {
  const data = Array(12).fill(0)
  fbrStore.submittedInvoices.forEach((inv) => {
    const m = new Date(inv.invoiceDate || inv.submittedAt).getMonth()
    const val = (inv.items || []).reduce((s, i) => s + Number(i.valueSalesExcludingST || 0), 0)
    data[m] += val
  })
  return data
})

const chartTaxData = computed(() => {
  const data = Array(12).fill(0)
  fbrStore.submittedInvoices.forEach((inv) => {
    const m = new Date(inv.invoiceDate || inv.submittedAt).getMonth()
    const val = (inv.items || []).reduce((s, i) => s + Number(i.salesTaxApplicable || 0), 0)
    data[m] += val
  })
  return data
})

// ── Top products from submitted invoices ─────────────────────────────────────
const topProducts = computed(() => {
  const map = {}
  fbrStore.submittedInvoices.forEach((inv) => {
    (inv.items || []).forEach((item) => {
      const key = item.productDescription
      if (!map[key]) map[key] = { name: key, hsCode: item.hsCode, total: 0, tax: 0, qty: 0 }
      map[key].total += Number(item.valueSalesExcludingST || 0)
      map[key].tax += Number(item.salesTaxApplicable || 0)
      map[key].qty += Number(item.quantity || 0)
    })
  })
  return Object.values(map).sort((a, b) => b.total - a.total).slice(0, 5)
})

// ── Quick actions ─────────────────────────────────────────────────────────────
const quickActions = [
  { title: 'Submit Invoice', icon: 'tabler-send', color: 'primary', to: 'fbr-submit', desc: 'Post to FBR in real-time' },
  { title: 'Validate Invoice', icon: 'tabler-shield-check', color: 'success', to: 'fbr-validate', desc: 'Check before submitting' },
  { title: 'Add Customer', icon: 'tabler-user-plus', color: 'info', to: 'customers-create', desc: 'Register new buyer' },
  { title: 'Add Product', icon: 'tabler-package', color: 'warning', to: 'products-create', desc: 'Add to catalog' },
  { title: 'Invoice History', icon: 'tabler-history', color: 'secondary', to: 'fbr-history', desc: 'View all invoices' },
  { title: 'Reference Data', icon: 'tabler-database', color: 'error', to: 'fbr-reference', desc: 'HS codes, UOM, rates' },
]

// ── Stat cards ────────────────────────────────────────────────────────────────
const statCards = computed(() => [
  {
    title: 'Total Invoices',
    value: totalSubmitted.value,
    icon: 'tabler-file-invoice',
    color: 'primary',
    trend: '+12%',
    trendUp: true,
    sub: 'This session',
  },
  {
    title: 'Sales Value',
    value: 'PKR ' + formatCompact(totalSalesValue.value),
    icon: 'tabler-currency-rupee',
    color: 'success',
    trend: '+8.5%',
    trendUp: true,
    sub: 'Excl. Sales Tax',
  },
  {
    title: 'Sales Tax',
    value: 'PKR ' + formatCompact(totalSalesTax.value),
    icon: 'tabler-receipt-tax',
    color: 'warning',
    trend: '+8.5%',
    trendUp: true,
    sub: 'Total ST collected',
  },
  {
    title: 'Valid Rate',
    value: validRate.value + '%',
    icon: 'tabler-circle-check',
    color: validRate.value >= 90 ? 'success' : 'error',
    trend: validInvoices.value + ' valid',
    trendUp: validRate.value >= 90,
    sub: invalidInvoices.value + ' invalid',
  },
])

// ── Helpers ───────────────────────────────────────────────────────────────────
const formatPKR = val => Number(val || 0).toLocaleString('en-PK', { minimumFractionDigits: 0, maximumFractionDigits: 0 })
const formatCompact = (val) => {
  if (val >= 10000000) return (val / 10000000).toFixed(1) + 'Cr'
  if (val >= 100000) return (val / 100000).toFixed(1) + 'L'
  if (val >= 1000) return (val / 1000).toFixed(1) + 'K'
  return val.toFixed(0)
}

const today = new Date().toLocaleDateString('en-PK', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
</script>

<template>
  <div>
    <!-- ── Welcome Header ── -->
    <VRow class="mb-2">
      <VCol cols="12">
        <div class="d-flex align-center justify-space-between flex-wrap gap-3">
          <div>
            <h4 class="text-h5 font-weight-bold mb-1">
              Welcome back 👋
            </h4>
            <p class="text-body-2 text-medium-emphasis mb-0">
              {{ today }}
            </p>
          </div>
          <div class="d-flex align-center gap-2">
            <VChip
              :color="fbrStore.environmentColor"
              variant="tonal"
              size="small"
              prepend-icon="tabler-server"
            >
              FBR {{ fbrStore.environmentLabel }}
            </VChip>
            <VBtn
              size="small"
              variant="tonal"
              :color="fbrStore.isSandbox ? 'warning' : 'success'"
              prepend-icon="tabler-switch-horizontal"
              @click="fbrStore.toggleEnvironment()"
            >
              Switch to {{ fbrStore.isSandbox ? 'Production' : 'Sandbox' }}
            </VBtn>
          </div>
        </div>
      </VCol>
    </VRow>

    <!-- ── Stat Cards ── -->
    <VRow class="mb-2">
      <VCol
        v-for="card in statCards"
        :key="card.title"
        cols="12"
        sm="6"
        lg="3"
      >
        <VCard>
          <VCardText>
            <div class="d-flex align-start justify-space-between">
              <div class="flex-grow-1">
                <p class="text-body-2 text-medium-emphasis mb-2">
                  {{ card.title }}
                </p>
                <h4 class="text-h5 font-weight-bold mb-1">
                  {{ card.value }}
                </h4>
                <div class="d-flex align-center gap-1">
                  <VIcon
                    :icon="card.trendUp ? 'tabler-trending-up' : 'tabler-trending-down'"
                    :color="card.trendUp ? 'success' : 'error'"
                    size="14"
                  />
                  <span
                    class="text-caption font-weight-medium"
                    :class="card.trendUp ? 'text-success' : 'text-error'"
                  >
                    {{ card.trend }}
                  </span>
                  <span class="text-caption text-medium-emphasis">{{ card.sub }}</span>
                </div>
              </div>
              <VAvatar
                :color="card.color"
                variant="tonal"
                size="52"
                rounded="lg"
              >
                <VIcon
                  :icon="card.icon"
                  size="26"
                />
              </VAvatar>
            </div>
          </VCardText>
        </VCard>
      </VCol>
    </VRow>

    <!-- ── Charts Row ── -->
    <VRow class="mb-2">
      <!-- Monthly Sales Chart -->
      <VCol
        cols="12"
        lg="8"
      >
        <VCard height="100%">
          <VCardItem>
            <VCardTitle>Monthly Sales Overview</VCardTitle>
            <VCardSubtitle>Sales value vs Sales Tax — current year</VCardSubtitle>
            <template #append>
              <div class="d-flex gap-3">
                <div class="d-flex align-center gap-1">
                  <div
                    class="rounded-circle"
                    style="background: #1a3a6b;block-size: 10px;inline-size: 10px;"
                  />
                  <span class="text-caption">Sales Value</span>
                </div>
                <div class="d-flex align-center gap-1">
                  <div
                    class="rounded-circle"
                    style="background: #4caf50;block-size: 10px;inline-size: 10px;"
                  />
                  <span class="text-caption">Sales Tax</span>
                </div>
              </div>
            </template>
          </VCardItem>
          <VDivider />
          <VCardText>
            <!-- Simple bar chart using CSS -->
            <div class="chart-container">
              <div
                v-for="(val, i) in chartSalesData"
                :key="i"
                class="chart-bar-group"
              >
                <div class="chart-bars">
                  <div
                    class="chart-bar sales-bar"
                    :style="{ height: chartSalesData[i] > 0 ? Math.max(4, (chartSalesData[i] / Math.max(...chartSalesData, 1)) * 140) + 'px' : '4px' }"
                    :title="'Sales: PKR ' + formatPKR(chartSalesData[i])"
                  />
                  <div
                    class="chart-bar tax-bar"
                    :style="{ height: chartTaxData[i] > 0 ? Math.max(4, (chartTaxData[i] / Math.max(...chartSalesData, 1)) * 140) + 'px' : '4px' }"
                    :title="'Tax: PKR ' + formatPKR(chartTaxData[i])"
                  />
                </div>
                <span
                  class="chart-label"
                  :class="{ 'chart-label-active': i === currentMonth }"
                >
                  {{ months[i] }}
                </span>
              </div>
            </div>
          </VCardText>
        </VCard>
      </VCol>

      <!-- Invoice Status Donut -->
      <VCol
        cols="12"
        lg="4"
      >
        <VCard height="100%">
          <VCardItem>
            <VCardTitle>Invoice Status</VCardTitle>
            <VCardSubtitle>Valid vs Invalid breakdown</VCardSubtitle>
          </VCardItem>
          <VDivider />
          <VCardText class="d-flex flex-column align-center justify-center pa-6">
            <!-- SVG Donut -->
            <div class="donut-wrap mb-4">
              <svg
                viewBox="0 0 120 120"
                width="160"
                height="160"
              >
                <circle
                  cx="60"
                  cy="60"
                  r="48"
                  fill="none"
                  stroke="#f5f5f5"
                  stroke-width="16"
                />
                <circle
                  cx="60"
                  cy="60"
                  r="48"
                  fill="none"
                  stroke="#4caf50"
                  stroke-width="16"
                  stroke-dasharray="301.6"
                  :stroke-dashoffset="301.6 - (301.6 * validRate / 100)"
                  stroke-linecap="round"
                  transform="rotate(-90 60 60)"
                />
                <text
                  x="60"
                  y="56"
                  text-anchor="middle"
                  font-size="20"
                  font-weight="700"
                  fill="#1a1a1a"
                >
                  {{ validRate }}%
                </text>
                <text
                  x="60"
                  y="72"
                  text-anchor="middle"
                  font-size="9"
                  fill="#888"
                >
                  Valid Rate
                </text>
              </svg>
            </div>

            <div class="d-flex gap-6 justify-center w-100">
              <div class="text-center">
                <div class="d-flex align-center gap-1 justify-center mb-1">
                  <div
                    class="rounded-circle"
                    style="background: #4caf50;block-size: 10px;inline-size: 10px;"
                  />
                  <span class="text-caption text-medium-emphasis">Valid</span>
                </div>
                <p class="text-h6 font-weight-bold mb-0 text-success">
                  {{ validInvoices }}
                </p>
              </div>
              <div class="text-center">
                <div class="d-flex align-center gap-1 justify-center mb-1">
                  <div
                    class="rounded-circle"
                    style="background: #f44336;block-size: 10px;inline-size: 10px;"
                  />
                  <span class="text-caption text-medium-emphasis">Invalid</span>
                </div>
                <p class="text-h6 font-weight-bold mb-0 text-error">
                  {{ invalidInvoices }}
                </p>
              </div>
              <div class="text-center">
                <div class="d-flex align-center gap-1 justify-center mb-1">
                  <div
                    class="rounded-circle"
                    style="background: #9e9e9e;block-size: 10px;inline-size: 10px;"
                  />
                  <span class="text-caption text-medium-emphasis">Total</span>
                </div>
                <p class="text-h6 font-weight-bold mb-0">
                  {{ totalSubmitted }}
                </p>
              </div>
            </div>
          </VCardText>
        </VCard>
      </VCol>
    </VRow>

    <!-- ── Quick Actions + Top Products ── -->
    <VRow class="mb-2">
      <!-- Quick Actions -->
      <VCol
        cols="12"
        lg="4"
      >
        <VCard height="100%">
          <VCardItem>
            <VCardTitle>Quick Actions</VCardTitle>
          </VCardItem>
          <VDivider />
          <VCardText class="pa-3">
            <div class="d-flex flex-column gap-2">
              <VBtn
                v-for="action in quickActions"
                :key="action.title"
                :to="{ name: action.to }"
                variant="tonal"
                :color="action.color"
                class="justify-start"
                height="52"
              >
                <template #prepend>
                  <VAvatar
                    :color="action.color"
                    variant="tonal"
                    size="32"
                  >
                    <VIcon
                      :icon="action.icon"
                      size="18"
                    />
                  </VAvatar>
                </template>
                <div class="text-start ms-1">
                  <p class="text-body-2 font-weight-semibold mb-0">
                    {{ action.title }}
                  </p>
                  <p class="text-caption text-medium-emphasis mb-0">
                    {{ action.desc }}
                  </p>
                </div>
              </VBtn>
            </div>
          </VCardText>
        </VCard>
      </VCol>

      <!-- Top Products -->
      <VCol
        cols="12"
        lg="8"
      >
        <VCard height="100%">
          <VCardItem>
            <VCardTitle>Top Products by Sales</VCardTitle>
            <VCardSubtitle>Based on submitted invoices</VCardSubtitle>
            <template #append>
              <VBtn
                size="small"
                variant="text"
                :to="{ name: 'products' }"
              >
                View All
              </VBtn>
            </template>
          </VCardItem>
          <VDivider />
          <VCardText
            v-if="topProducts.length"
            class="pa-0"
          >
            <div
              v-for="(prod, i) in topProducts"
              :key="prod.name"
              class="product-row"
              :class="{ 'border-b': i < topProducts.length - 1 }"
            >
              <div class="d-flex align-center gap-3">
                <VAvatar
                  size="36"
                  color="primary"
                  variant="tonal"
                  rounded="lg"
                >
                  <span class="text-caption font-weight-bold">{{ i + 1 }}</span>
                </VAvatar>
                <div class="flex-grow-1">
                  <p class="text-body-2 font-weight-semibold mb-0">
                    {{ prod.name }}
                  </p>
                  <p class="text-caption text-medium-emphasis mb-0">
                    HS: {{ prod.hsCode }} &bull; Qty: {{ prod.qty }}
                  </p>
                </div>
                <div class="text-end">
                  <p class="text-body-2 font-weight-bold mb-0">
                    PKR {{ formatPKR(prod.total) }}
                  </p>
                  <p class="text-caption text-success mb-0">
                    ST: {{ formatPKR(prod.tax) }}
                  </p>
                </div>
              </div>
              <!-- Progress bar -->
              <VProgressLinear
                :model-value="topProducts[0].total > 0 ? (prod.total / topProducts[0].total) * 100 : 0"
                color="primary"
                height="3"
                rounded
                class="mt-2"
              />
            </div>
          </VCardText>
          <VCardText
            v-else
            class="text-center py-8"
          >
            <VIcon
              icon="tabler-package-off"
              size="48"
              class="text-medium-emphasis mb-2"
            />
            <p class="text-body-2 text-medium-emphasis">
              No product data yet
            </p>
          </VCardText>
        </VCard>
      </VCol>
    </VRow>

    <!-- ── Recent Invoices ── -->
    <VRow>
      <VCol cols="12">
        <VCard>
          <VCardItem>
            <VCardTitle>Recent Invoices</VCardTitle>
            <VCardSubtitle>Latest submitted invoices to FBR</VCardSubtitle>
            <template #append>
              <VBtn
                size="small"
                variant="text"
                color="primary"
                :to="{ name: 'fbr-history' }"
              >
                View All
              </VBtn>
            </template>
          </VCardItem>
          <VDivider />

          <div
            v-if="recentInvoices.length"
            class="pa-0"
          >
            <VTable hover>
              <thead>
                <tr>
                  <th>FBR Invoice No</th>
                  <th>Seller</th>
                  <th>Buyer</th>
                  <th>Date</th>
                  <th class="text-end">
                    Sales Value
                  </th>
                  <th class="text-end">
                    Sales Tax
                  </th>
                  <th class="text-center">
                    Items
                  </th>
                  <th class="text-center">
                    Status
                  </th>
                  <th class="text-center">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="(inv, idx) in recentInvoices"
                  :key="idx"
                >
                  <td>
                    <span class="text-caption font-weight-medium text-primary font-mono">
                      {{ inv.response?.invoiceNumber || 'N/A' }}
                    </span>
                  </td>
                  <td>
                    <div>
                      <p class="text-body-2 font-weight-medium mb-0">
                        {{ inv.sellerBusinessName }}
                      </p>
                      <p class="text-caption text-medium-emphasis mb-0">
                        NTN: {{ inv.sellerNTNCNIC }}
                      </p>
                    </div>
                  </td>
                  <td>
                    <div>
                      <p class="text-body-2 mb-0">
                        {{ inv.buyerBusinessName }}
                      </p>
                      <p class="text-caption text-medium-emphasis mb-0">
                        {{ inv.buyerRegistrationType }}
                      </p>
                    </div>
                  </td>
                  <td>
                    <span class="text-body-2">{{ inv.invoiceDate }}</span>
                  </td>
                  <td class="text-end">
                    <span class="text-body-2 font-weight-medium">
                      PKR {{ formatPKR((inv.items || []).reduce((s, i) => s + Number(i.valueSalesExcludingST || 0), 0)) }}
                    </span>
                  </td>
                  <td class="text-end">
                    <span class="text-body-2 text-success">
                      PKR {{ formatPKR((inv.items || []).reduce((s, i) => s + Number(i.salesTaxApplicable || 0), 0)) }}
                    </span>
                  </td>
                  <td class="text-center">
                    <VChip
                      size="x-small"
                      variant="tonal"
                      color="info"
                    >
                      {{ (inv.items || []).length }}
                    </VChip>
                  </td>
                  <td class="text-center">
                    <VChip
                      :color="inv.status === 'Valid' ? 'success' : 'error'"
                      size="x-small"
                      variant="tonal"
                    >
                      {{ inv.status }}
                    </VChip>
                  </td>
                  <td class="text-center">
                    <div class="d-flex gap-1 justify-center">
                      <VBtn
                        icon
                        size="x-small"
                        variant="text"
                        color="primary"
                        :to="{ name: 'fbr-print', query: { idx, type: 'submitted' } }"
                      >
                        <VIcon icon="tabler-printer" size="16" />
                        <VTooltip activator="parent">Print</VTooltip>
                      </VBtn>
                      <VBtn
                        icon
                        size="x-small"
                        variant="text"
                        color="secondary"
                        :to="{ name: 'fbr-history' }"
                      >
                        <VIcon icon="tabler-eye" size="16" />
                        <VTooltip activator="parent">View</VTooltip>
                      </VBtn>
                    </div>
                  </td>
                </tr>
              </tbody>
            </VTable>
          </div>

          <VCardText
            v-else
            class="text-center py-10"
          >
            <VIcon
              icon="tabler-file-off"
              size="56"
              class="text-medium-emphasis mb-3"
            />
            <p class="text-body-1 text-medium-emphasis mb-3">
              No invoices submitted yet
            </p>
            <VBtn
              color="primary"
              prepend-icon="tabler-send"
              :to="{ name: 'fbr-submit' }"
            >
              Submit First Invoice
            </VBtn>
          </VCardText>
        </VCard>
      </VCol>
    </VRow>
  </div>
</template>

<style scoped>
/* ── Bar Chart ── */
.chart-container {
  position: relative;
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  block-size: 180px;
  gap: 4px;
  padding-block-end: 24px;
}

.chart-bar-group {
  display: flex;
  flex: 1;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.chart-bars {
  display: flex;
  align-items: flex-end;
  block-size: 140px;
  gap: 2px;
}

.chart-bar {
  border-radius: 3px 3px 0 0;
  cursor: pointer;
  inline-size: 10px;
  min-block-size: 4px;
  transition: block-size 0.4s ease;
}

.chart-bar:hover {
  opacity: 0.8;
}

.sales-bar {
  background: #1a3a6b;
}

.tax-bar {
  background: #4caf50;
}

.chart-label {
  color: #999;
  font-size: 9px;
  margin-block-start: 4px;
  white-space: nowrap;
}

.chart-label-active {
  color: #1a3a6b;
  font-weight: 700;
}

/* ── Product rows ── */
.product-row {
  padding-block: 12px;
  padding-inline: 16px;
}

.border-b {
  border-block-end: 1px solid rgba(0, 0, 0, 6%);
}

/* ── Misc ── */
.font-mono {
  font-family: monospace;
}

.donut-wrap {
  position: relative;
}
</style>
