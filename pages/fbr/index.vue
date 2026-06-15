<script setup>
import { useFbrStore } from '@/stores/useFbrStore'

definePageMeta({
  // middleware: 'auth',
  name: 'fbr-dashboard',
})

const fbrStore = useFbrStore()
const { fbrToken, getProvinces, getUomList, getTransactionTypes } = useFbrApi()

const stats = computed(() => [
  {
    title: 'Submitted Invoices',
    value: fbrStore.submittedInvoices.length,
    icon: 'tabler-file-invoice',
    color: 'primary',
    subtitle: 'This session',
  },
  {
    title: 'Validated Invoices',
    value: fbrStore.validatedInvoices.length,
    icon: 'tabler-file-check',
    color: 'success',
    subtitle: 'This session',
  },
  {
    title: 'Environment',
    value: fbrStore.environmentLabel,
    icon: 'tabler-server',
    color: fbrStore.environmentColor,
    subtitle: fbrStore.isSandbox ? 'Testing mode' : 'Live mode',
  },
  {
    title: 'Token Status',
    value: fbrToken.value ? 'Configured' : 'Not Set',
    icon: 'tabler-key',
    color: fbrToken.value ? 'success' : 'error',
    subtitle: fbrToken.value ? 'Ready to use' : 'Set token first',
  },
])

const recentInvoices = computed(() =>
  fbrStore.submittedInvoices.slice(0, 5),
)

const quickLinks = [
  { title: 'Submit Invoice', icon: 'tabler-send', to: 'fbr-submit', color: 'primary', desc: 'Post invoice data to FBR in real-time' },
  { title: 'Validate Invoice', icon: 'tabler-shield-check', to: 'fbr-validate', color: 'success', desc: 'Validate invoice before submission' },
  { title: 'Reference Data', icon: 'tabler-database', to: 'fbr-reference', color: 'info', desc: 'Browse HS codes, UOM, rates & more' },
  { title: 'STATL Lookup', icon: 'tabler-search', to: 'fbr-statl', color: 'warning', desc: 'Check taxpayer registration status' },
  { title: 'Settings', icon: 'tabler-settings', to: 'fbr-settings', color: 'secondary', desc: 'Configure API token & environment' },
  { title: 'Invoice History', icon: 'tabler-history', to: 'fbr-history', color: 'error', desc: 'View submitted & validated invoices' },
]
</script>

<template>
  <div>
    <!-- Header -->
    <VRow class="mb-4">
      <VCol cols="12">
        <div class="d-flex align-center justify-space-between flex-wrap gap-3">
          <div class="d-flex align-center gap-3">
            <VAvatar size="48" color="primary" variant="tonal">
              <VIcon icon="tabler-receipt-tax" size="28" />
            </VAvatar>
            <div>
              <h4 class="text-h5 font-weight-bold">
                FBR Digital Invoicing
              </h4>
              <p class="text-body-2 text-medium-emphasis mb-0">
                PRAL DI API Integration — Version 1.12
              </p>
            </div>
          </div>
          <div class="d-flex align-center gap-2">
            <VChip :color="fbrStore.environmentColor" variant="tonal" size="small" prepend-icon="tabler-server">
              {{ fbrStore.environmentLabel }}
            </VChip>
            <VBtn :color="fbrStore.isSandbox ? 'warning' : 'success'" variant="tonal" size="small"
              prepend-icon="tabler-switch-horizontal" @click="fbrStore.toggleEnvironment()">
              Switch to {{ fbrStore.isSandbox ? 'Production' : 'Sandbox' }}
            </VBtn>
          </div>
        </div>
      </VCol>
    </VRow>

    <!-- Token Warning -->
    <VRow v-if="!fbrToken" class="mb-2">
      <VCol cols="12">
        <VAlert type="warning" variant="tonal" prominent border="start">
          <template #prepend>
            <VIcon icon="tabler-alert-triangle" />
          </template>
          <strong>API Token Not Configured</strong> — Please go to
          <NuxtLink to="/fbr/settings" class="text-warning font-weight-bold">
            Settings
          </NuxtLink>
          and enter your PRAL-issued Bearer token before using the API.
        </VAlert>
      </VCol>
    </VRow>

    <!-- Stats Cards -->
    <VRow class="mb-2">
      <VCol v-for="stat in stats" :key="stat.title" cols="12" sm="6" lg="3">
        <VCard>
          <VCardText>
            <div class="d-flex align-center justify-space-between">
              <div>
                <p class="text-body-2 text-medium-emphasis mb-1">
                  {{ stat.title }}
                </p>
                <h4 class="text-h5 font-weight-bold">
                  {{ stat.value }}
                </h4>
                <p class="text-caption text-medium-emphasis mb-0">
                  {{ stat.subtitle }}
                </p>
              </div>
              <VAvatar :color="stat.color" variant="tonal" size="48">
                <VIcon :icon="stat.icon" size="24" />
              </VAvatar>
            </div>
          </VCardText>
        </VCard>
      </VCol>
    </VRow>

    <!-- Quick Links -->
    <VRow class="mb-2">
      <VCol cols="12">
        <h5 class="text-h6 font-weight-semibold mb-3">
          Quick Actions
        </h5>
      </VCol>
      <VCol v-for="link in quickLinks" :key="link.title" cols="12" sm="6" md="4">
        <VCard :to="{ name: link.to }" hover class="cursor-pointer">
          <VCardText class="d-flex align-center gap-4 pa-5">
            <VAvatar :color="link.color" variant="tonal" size="44">
              <VIcon :icon="link.icon" size="22" />
            </VAvatar>
            <div>
              <p class="text-body-1 font-weight-semibold mb-0">
                {{ link.title }}
              </p>
              <p class="text-caption text-medium-emphasis mb-0">
                {{ link.desc }}
              </p>
            </div>
            <VSpacer />
            <VIcon icon="tabler-chevron-right" size="18" class="text-medium-emphasis" />
          </VCardText>
        </VCard>
      </VCol>
    </VRow>

    <!-- Recent Submissions -->
    <VRow v-if="recentInvoices.length">
      <VCol cols="12">
        <VCard>
          <VCardItem>
            <VCardTitle>Recent Submissions</VCardTitle>
            <template #append>
              <NuxtLink to="/fbr/history" class="text-primary text-body-2">
                View All
              </NuxtLink>
            </template>
          </VCardItem>
          <VDivider />
          <VTable>
            <thead>
              <tr>
                <th>Invoice Number</th>
                <th>Seller NTN</th>
                <th>Invoice Type</th>
                <th>Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="inv in recentInvoices" :key="inv.submittedAt">
                <td>
                  <span class="text-body-2 font-weight-medium">
                    {{ inv.response?.invoiceNumber || '—' }}
                  </span>
                </td>
                <td>{{ inv.sellerNTNCNIC }}</td>
                <td>{{ inv.invoiceType }}</td>
                <td>{{ inv.invoiceDate }}</td>
                <td>
                  <VChip :color="inv.status === 'Valid' ? 'success' : 'error'" size="small" variant="tonal">
                    {{ inv.status }}
                  </VChip>
                </td>
              </tr>
            </tbody>
          </VTable>
        </VCard>
      </VCol>
    </VRow>
  </div>
</template>
