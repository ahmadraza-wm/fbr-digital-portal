<script setup>
import { useFbrStore } from '@/stores/useFbrStore'

definePageMeta({
  // middleware: 'auth',
  name: 'fbr-settings',
})

const fbrStore = useFbrStore()
const fbrToken = useCookie('fbrToken', { maxAge: 60 * 60 * 24 * 365 * 5 })

const tokenInput = ref(fbrToken.value || '')
const showToken = ref(false)
const saved = ref(false)

const saveToken = () => {
  fbrToken.value = tokenInput.value.trim()
  saved.value = true
  setTimeout(() => { saved.value = false }, 3000)
}

const clearToken = () => {
  fbrToken.value = null
  tokenInput.value = ''
}

const envSubtitle = computed(() => {
  return fbrStore.isSandbox
    ? 'Using sandbox token - safe for testing'
    : 'Using production token - live data'
})

const apiEndpoints = computed(() => [
  { label: 'Post Invoice', sandbox: 'https://gw.fbr.gov.pk/di_data/v1/di/postinvoicedata_sb', production: 'https://gw.fbr.gov.pk/di_data/v1/di/postinvoicedata', method: 'POST' },
  { label: 'Validate Invoice', sandbox: 'https://gw.fbr.gov.pk/di_data/v1/di/validateinvoicedata_sb', production: 'https://gw.fbr.gov.pk/di_data/v1/di/validateinvoicedata', method: 'POST' },
  { label: 'Provinces', sandbox: 'https://gw.fbr.gov.pk/pdi/v1/provinces', production: 'https://gw.fbr.gov.pk/pdi/v1/provinces', method: 'GET' },
  { label: 'Document Types', sandbox: 'https://gw.fbr.gov.pk/pdi/v1/doctypecode', production: 'https://gw.fbr.gov.pk/pdi/v1/doctypecode', method: 'GET' },
  { label: 'HS Item Codes', sandbox: 'https://gw.fbr.gov.pk/pdi/v1/itemdesccode', production: 'https://gw.fbr.gov.pk/pdi/v1/itemdesccode', method: 'GET' },
  { label: 'UOM List', sandbox: 'https://gw.fbr.gov.pk/pdi/v1/uom', production: 'https://gw.fbr.gov.pk/pdi/v1/uom', method: 'GET' },
  { label: 'STATL Check', sandbox: 'https://gw.fbr.gov.pk/dist/v1/statl', production: 'https://gw.fbr.gov.pk/dist/v1/statl', method: 'POST' },
  { label: 'Registration Type', sandbox: 'https://gw.fbr.gov.pk/dist/v1/Get_Reg_Type', production: 'https://gw.fbr.gov.pk/dist/v1/Get_Reg_Type', method: 'POST' },
])
</script>

<template>
  <div>
    <VRow>
      <VCol cols="12">
        <div class="d-flex align-center gap-3 mb-6">
          <VBtn icon variant="text" :to="{ name: 'fbr-dashboard' }">
            <VIcon icon="tabler-arrow-left" />
          </VBtn>
          <div>
            <h4 class="text-h5 font-weight-bold">
              FBR API Settings
            </h4>
            <p class="text-body-2 text-medium-emphasis mb-0">
              Configure your PRAL-issued Bearer token and environment
            </p>
          </div>
        </div>
      </VCol>
    </VRow>

    <VRow>
      <!-- Token Configuration -->
      <VCol cols="12" md="6">
        <VCard>
          <VCardItem>
            <template #prepend>
              <VAvatar color="primary" variant="tonal">
                <VIcon icon="tabler-key" />
              </VAvatar>
            </template>
            <VCardTitle>API Bearer Token</VCardTitle>
            <VCardSubtitle>Issued by PRAL - Valid for 5 years</VCardSubtitle>
          </VCardItem>
          <VDivider />
          <VCardText class="pt-4">
            <VAlert type="info" variant="tonal" class="mb-4" density="compact">
              This token is passed in the Authorization: Bearer header of every API request.
            </VAlert>

            <VTextField v-model="tokenInput" :type="showToken ? 'text' : 'password'" label="Bearer Token"
              placeholder="Enter your PRAL-issued token" variant="outlined"
              :append-inner-icon="showToken ? 'tabler-eye-off' : 'tabler-eye'"
              @click:append-inner="showToken = !showToken" />

            <div class="d-flex gap-2 mt-3">
              <VBtn color="primary" prepend-icon="tabler-device-floppy" :disabled="!tokenInput" @click="saveToken">
                Save Token
              </VBtn>
              <VBtn color="error" variant="tonal" prepend-icon="tabler-trash" :disabled="!fbrToken" @click="clearToken">
                Clear
              </VBtn>
            </div>

            <VAlert v-if="saved" type="success" variant="tonal" class="mt-3" density="compact">
              Token saved successfully!
            </VAlert>

            <VAlert v-if="fbrToken" type="success" variant="tonal" class="mt-3" density="compact"
              prepend-icon="tabler-circle-check">
              Token is configured and active.
            </VAlert>
          </VCardText>
        </VCard>
      </VCol>

      <!-- Environment Toggle -->
      <VCol cols="12" md="6">
        <VCard>
          <VCardItem>
            <template #prepend>
              <VAvatar :color="fbrStore.environmentColor" variant="tonal">
                <VIcon icon="tabler-server" />
              </VAvatar>
            </template>
            <VCardTitle>Environment</VCardTitle>
            <VCardSubtitle>Sandbox or Production routing</VCardSubtitle>
          </VCardItem>
          <VDivider />
          <VCardText class="pt-4">
            <VAlert type="warning" variant="tonal" class="mb-4" density="compact">
              Routing is determined by the security token. The same API URLs are used for both environments.
            </VAlert>

            <div class="d-flex align-center justify-space-between pa-4 rounded border mb-4">
              <div>
                <p class="text-body-1 font-weight-semibold mb-0">
                  Current Environment
                </p>
                <p class="text-caption text-medium-emphasis mb-0">
                  {{ envSubtitle }}
                </p>
              </div>
              <VChip :color="fbrStore.environmentColor" variant="tonal" size="large">
                {{ fbrStore.environmentLabel }}
              </VChip>
            </div>

            <VBtn :color="fbrStore.isSandbox ? 'warning' : 'success'" block prepend-icon="tabler-switch-horizontal"
              @click="fbrStore.toggleEnvironment()">
              Switch to {{ fbrStore.isSandbox ? 'Production' : 'Sandbox' }}
            </VBtn>

            <VAlert v-if="!fbrStore.isSandbox" type="error" variant="tonal" class="mt-3" density="compact">
              <strong>Warning:</strong> Production mode will submit real invoices to FBR.
            </VAlert>
          </VCardText>
        </VCard>
      </VCol>

      <!-- API Endpoints Reference -->
      <VCol cols="12">
        <VCard>
          <VCardItem>
            <template #prepend>
              <VAvatar color="info" variant="tonal">
                <VIcon icon="tabler-api" />
              </VAvatar>
            </template>
            <VCardTitle>API Endpoints Reference</VCardTitle>
            <VCardSubtitle>All FBR DI API endpoints used in this integration</VCardSubtitle>
          </VCardItem>
          <VDivider />
          <VTable>
            <thead>
              <tr>
                <th>Endpoint</th>
                <th>Method</th>
                <th>URL</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="ep in apiEndpoints" :key="ep.label">
                <td>
                  <span class="font-weight-medium">{{ ep.label }}</span>
                </td>
                <td>
                  <VChip :color="ep.method === 'POST' ? 'primary' : 'success'" size="x-small" variant="tonal">
                    {{ ep.method }}
                  </VChip>
                </td>
                <td>
                  <div class="text-caption">
                    <div v-if="ep.sandbox !== ep.production">
                      <span class="text-warning font-weight-medium">SB: </span>{{ ep.sandbox }}<br>
                      <span class="text-success font-weight-medium">PROD: </span>{{ ep.production }}
                    </div>
                    <span v-else>{{ ep.sandbox }}</span>
                  </div>
                </td>
              </tr>
            </tbody>
          </VTable>
        </VCard>
      </VCol>
    </VRow>
  </div>
</template>
