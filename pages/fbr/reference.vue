<script setup>
definePageMeta({
  // middleware: 'auth',
  name: 'fbr-reference',
})

const {
  getProvinces, getDocTypes, getItemCodes, getSroItemCodes,
  getTransactionTypes, getUomList, getRates, getHsUom, getSroItems,
} = useFbrApi()

const activeTab = ref('provinces')
const loading = ref(false)
const error = ref(null)

// Data stores per tab
const data = reactive({
  provinces: [],
  docTypes: [],
  itemCodes: [],
  sroItemCodes: [],
  transTypes: [],
  uomList: [],
  rates: [],
  hsUom: [],
  sroItems: [],
})

// Filters for searchable tables
const search = reactive({
  itemCodes: '',
  uomList: '',
  transTypes: '',
})

// Rate query params
const rateQuery = ref({ date: new Date().toISOString().split('T')[0], transTypeId: 18, originationSupplier: 1 })
const hsUomQuery = ref({ hsCode: '', annexureId: 3 })
const sroItemQuery = ref({ date: new Date().toISOString().split('T')[0], sroId: '' })

const tabs = [
  { value: 'provinces', label: 'Provinces', icon: 'tabler-map-pin' },
  { value: 'docTypes', label: 'Doc Types', icon: 'tabler-file-description' },
  { value: 'uomList', label: 'UOM', icon: 'tabler-ruler' },
  { value: 'transTypes', label: 'Transaction Types', icon: 'tabler-arrows-exchange' },
  { value: 'itemCodes', label: 'HS Codes', icon: 'tabler-barcode' },
  { value: 'rates', label: 'Rates', icon: 'tabler-percentage' },
  { value: 'hsUom', label: 'HS + UOM', icon: 'tabler-link' },
  { value: 'sroItems', label: 'SRO Items', icon: 'tabler-list-details' },
]

const loadTab = async (tab) => {
  activeTab.value = tab
  if (data[tab]?.length) return // already loaded

  loading.value = true
  error.value = null
  try {
    switch (tab) {
      case 'provinces': data.provinces = await getProvinces(); break
      case 'docTypes': data.docTypes = await getDocTypes(); break
      case 'itemCodes': data.itemCodes = await getItemCodes(); break
      case 'sroItemCodes': data.sroItemCodes = await getSroItemCodes(); break
      case 'transTypes': data.transTypes = await getTransactionTypes(); break
      case 'uomList': data.uomList = await getUomList(); break
    }
  }
  catch (err) {
    error.value = err?.message || 'Failed to load reference data. Check your API token.'
  }
  finally {
    loading.value = false
  }
}

const loadRates = async () => {
  loading.value = true
  error.value = null
  try {
    data.rates = await getRates(rateQuery.value.date, rateQuery.value.transTypeId, rateQuery.value.originationSupplier)
  }
  catch (err) {
    error.value = err?.message || 'Failed to load rates.'
  }
  finally {
    loading.value = false
  }
}

const loadHsUom = async () => {
  if (!hsUomQuery.value.hsCode) return
  loading.value = true
  error.value = null
  try {
    data.hsUom = await getHsUom(hsUomQuery.value.hsCode, hsUomQuery.value.annexureId)
  }
  catch (err) {
    error.value = err?.message || 'Failed to load HS UOM.'
  }
  finally {
    loading.value = false
  }
}

const loadSroItems = async () => {
  if (!sroItemQuery.value.sroId) return
  loading.value = true
  error.value = null
  try {
    data.sroItems = await getSroItems(sroItemQuery.value.date, sroItemQuery.value.sroId)
  }
  catch (err) {
    error.value = err?.message || 'Failed to load SRO items.'
  }
  finally {
    loading.value = false
  }
}

const filteredItemCodes = computed(() => {
  if (!search.itemCodes) return data.itemCodes.slice(0, 100)
  return data.itemCodes.filter(i =>
    i.hS_CODE?.includes(search.itemCodes) ||
    i.description?.toLowerCase().includes(search.itemCodes.toLowerCase()),
  ).slice(0, 100)
})

const filteredUom = computed(() => {
  if (!search.uomList) return data.uomList
  return data.uomList.filter(u => u.description?.toLowerCase().includes(search.uomList.toLowerCase()))
})

// Load first tab on mount
onMounted(() => loadTab('provinces'))
</script>

<template>
  <div>
    <VRow class="mb-4">
      <VCol cols="12">
        <div class="d-flex align-center gap-3">
          <VBtn icon variant="text" :to="{ name: 'fbr-dashboard' }">
            <VIcon icon="tabler-arrow-left" />
          </VBtn>
          <div>
            <h4 class="text-h5 font-weight-bold">
              Reference Data
            </h4>
            <p class="text-body-2 text-medium-emphasis mb-0">
              Browse FBR lookup data — HS codes, UOM, rates, provinces and more
            </p>
          </div>
        </div>
      </VCol>
    </VRow>

    <VCard>
      <VTabs v-model="activeTab" show-arrows>
        <VTab v-for="tab in tabs" :key="tab.value" :value="tab.value" :prepend-icon="tab.icon"
          @click="loadTab(tab.value)">
          {{ tab.label }}
        </VTab>
      </VTabs>
      <VDivider />

      <VCardText>
        <!-- Error -->
        <VAlert v-if="error" type="error" variant="tonal" class="mb-4">
          {{ error }}
        </VAlert>

        <!-- Loading -->
        <div v-if="loading" class="text-center py-10">
          <VProgressCircular indeterminate color="primary" />
          <p class="text-body-2 text-medium-emphasis mt-3">
            Loading from FBR API...
          </p>
        </div>

        <!-- Provinces -->
        <VWindow v-model="activeTab">
          <VWindowItem value="provinces">
            <VTable v-if="data.provinces.length && !loading">
              <thead>
                <tr>
                  <th>Province Code</th>
                  <th>Province Name</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="p in data.provinces" :key="p.stateProvinceCode">
                  <td>{{ p.stateProvinceCode }}</td>
                  <td>{{ p.stateProvinceDesc }}</td>
                </tr>
              </tbody>
            </VTable>
          </VWindowItem>

          <!-- Doc Types -->
          <VWindowItem value="docTypes">
            <VTable v-if="data.docTypes.length && !loading">
              <thead>
                <tr>
                  <th>Doc Type ID</th>
                  <th>Description</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="d in data.docTypes" :key="d.docTypeId">
                  <td>{{ d.docTypeId }}</td>
                  <td>{{ d.docDescription }}</td>
                </tr>
              </tbody>
            </VTable>
          </VWindowItem>

          <!-- UOM -->
          <VWindowItem value="uomList">
            <VTextField v-model="search.uomList" placeholder="Search UOM..." variant="outlined" density="compact"
              prepend-inner-icon="tabler-search" class="mb-4" style="max-inline-size: 300px;" />
            <VTable v-if="data.uomList.length && !loading">
              <thead>
                <tr>
                  <th>UOM ID</th>
                  <th>Description</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="u in filteredUom" :key="u.uoM_ID">
                  <td>{{ u.uoM_ID }}</td>
                  <td>{{ u.description }}</td>
                </tr>
              </tbody>
            </VTable>
          </VWindowItem>

          <!-- Transaction Types -->
          <VWindowItem value="transTypes">
            <VTable v-if="data.transTypes.length && !loading">
              <thead>
                <tr>
                  <th>Transaction Type ID</th>
                  <th>Description</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="t in data.transTypes" :key="t.transactioN_TYPE_ID">
                  <td>{{ t.transactioN_TYPE_ID }}</td>
                  <td>{{ t.transactioN_DESC }}</td>
                </tr>
              </tbody>
            </VTable>
          </VWindowItem>

          <!-- HS Codes -->
          <VWindowItem value="itemCodes">
            <VTextField v-model="search.itemCodes" placeholder="Search HS Code or description..." variant="outlined"
              density="compact" prepend-inner-icon="tabler-search" class="mb-4" style="max-inline-size: 400px;" />
            <p v-if="data.itemCodes.length" class="text-caption text-medium-emphasis mb-2">
              Showing {{ filteredItemCodes.length }} of {{ data.itemCodes.length }} records
            </p>
            <VTable v-if="data.itemCodes.length && !loading">
              <thead>
                <tr>
                  <th>HS Code</th>
                  <th>Description</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in filteredItemCodes" :key="item.hS_CODE">
                  <td>
                    <VChip size="small" variant="tonal" color="primary">
                      {{ item.hS_CODE }}
                    </VChip>
                  </td>
                  <td class="text-caption">
                    {{ item.description }}
                  </td>
                </tr>
              </tbody>
            </VTable>
          </VWindowItem>

          <!-- Rates (parameterized) -->
          <VWindowItem value="rates">
            <VRow class="mb-4">
              <VCol cols="12" sm="4">
                <VTextField v-model="rateQuery.date" label="Date" type="date" variant="outlined" density="compact" />
              </VCol>
              <VCol cols="12" sm="4">
                <VTextField v-model.number="rateQuery.transTypeId" label="Transaction Type ID" type="number"
                  variant="outlined" density="compact" />
              </VCol>
              <VCol cols="12" sm="4">
                <VTextField v-model.number="rateQuery.originationSupplier" label="Province ID (Origination)"
                  type="number" variant="outlined" density="compact" />
              </VCol>
              <VCol cols="12">
                <VBtn color="primary" prepend-icon="tabler-search" :loading="loading" @click="loadRates">
                  Fetch Rates
                </VBtn>
              </VCol>
            </VRow>
            <VTable v-if="data.rates.length && !loading">
              <thead>
                <tr>
                  <th>Rate ID</th>
                  <th>Description</th>
                  <th>Rate Value</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="r in data.rates" :key="r.ratE_ID">
                  <td>{{ r.ratE_ID }}</td>
                  <td>{{ r.ratE_DESC }}</td>
                  <td>
                    <VChip color="success" size="small" variant="tonal">
                      {{ r.ratE_VALUE }}%
                    </VChip>
                  </td>
                </tr>
              </tbody>
            </VTable>
          </VWindowItem>

          <!-- HS + UOM -->
          <VWindowItem value="hsUom">
            <VRow class="mb-4">
              <VCol cols="12" sm="5">
                <VTextField v-model="hsUomQuery.hsCode" label="HS Code" placeholder="e.g. 5904.9000" variant="outlined"
                  density="compact" />
              </VCol>
              <VCol cols="12" sm="3">
                <VTextField v-model.number="hsUomQuery.annexureId" label="Annexure ID" type="number" variant="outlined"
                  density="compact" />
              </VCol>
              <VCol cols="12" sm="4">
                <VBtn color="info" prepend-icon="tabler-search" :loading="loading" @click="loadHsUom">
                  Fetch UOM for HS Code
                </VBtn>
              </VCol>
            </VRow>
            <VTable v-if="data.hsUom.length && !loading">
              <thead>
                <tr>
                  <th>UOM ID</th>
                  <th>Description</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="u in data.hsUom" :key="u.uoM_ID">
                  <td>{{ u.uoM_ID }}</td>
                  <td>{{ u.description }}</td>
                </tr>
              </tbody>
            </VTable>
          </VWindowItem>

          <!-- SRO Items -->
          <VWindowItem value="sroItems">
            <VRow class="mb-4">
              <VCol cols="12" sm="4">
                <VTextField v-model="sroItemQuery.date" label="Date" type="date" variant="outlined" density="compact" />
              </VCol>
              <VCol cols="12" sm="4">
                <VTextField v-model="sroItemQuery.sroId" label="SRO ID" placeholder="e.g. 389" variant="outlined"
                  density="compact" />
              </VCol>
              <VCol cols="12" sm="4">
                <VBtn color="warning" prepend-icon="tabler-search" :loading="loading" @click="loadSroItems">
                  Fetch SRO Items
                </VBtn>
              </VCol>
            </VRow>
            <VTable v-if="data.sroItems.length && !loading">
              <thead>
                <tr>
                  <th>SRO Item ID</th>
                  <th>Description</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="s in data.sroItems" :key="s.srO_ITEM_ID">
                  <td>{{ s.srO_ITEM_ID }}</td>
                  <td>{{ s.srO_ITEM_DESC }}</td>
                </tr>
              </tbody>
            </VTable>
          </VWindowItem>
        </VWindow>
      </VCardText>
    </VCard>
  </div>
</template>
