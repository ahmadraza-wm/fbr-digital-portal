<script setup>
import { useEnterpriseApi } from '@/composables/useEnterpriseApi'

definePageMeta({ name: 'products' })

const { getProducts, deleteProduct } = useEnterpriseApi()

const products = ref([])
const loading = ref(false)
const search = ref('')
const deleteDialog = ref(false)
const deletingId = ref(null)
const snackbar = reactive({ show: false, text: '', color: 'success' })

const headers = [
  { title: 'Product Name', key: 'name' },
  { title: 'HS Code', key: 'hs_code' },
  { title: 'Sale Type', key: 'sale_type' },
  { title: 'Rate', key: 'rate', align: 'center' },
  { title: 'UOM', key: 'uom', align: 'center' },
  { title: 'Unit Price', key: 'unit_price', align: 'end' },
  { title: 'Status', key: 'is_active', align: 'center' },
  { title: 'Actions', key: 'actions', sortable: false, align: 'center' },
]

const fetchProducts = async () => {
  loading.value = true
  try {
    const res = await getProducts({ search: search.value })
    products.value = res.data?.data || res.data || []
  }
  catch (e) { showSnack('Failed to load products', 'error') }
  finally { loading.value = false }
}

const confirmDelete = id => { deletingId.value = id; deleteDialog.value = true }

const doDelete = async () => {
  try {
    await deleteProduct(deletingId.value)
    showSnack('Product deleted')
    fetchProducts()
  }
  catch (e) { showSnack('Delete failed', 'error') }
  finally { deleteDialog.value = false }
}

const showSnack = (text, color = 'success') => {
  snackbar.text = text; snackbar.color = color; snackbar.show = true
}

const formatPKR = val => Number(val || 0).toLocaleString('en-PK', { minimumFractionDigits: 2 })

onMounted(fetchProducts)
watch(search, useDebounceFn(fetchProducts, 400))
</script>

<template>
  <div>
    <VRow class="mb-4">
      <VCol cols="12">
        <div class="d-flex align-center justify-space-between flex-wrap gap-3">
          <div>
            <h4 class="text-h5 font-weight-bold">Products</h4>
            <p class="text-body-2 text-medium-emphasis mb-0">Manage your product catalog with HS codes</p>
          </div>
          <VBtn color="primary" prepend-icon="tabler-plus" :to="{ name: 'products-create' }">
            Add Product
          </VBtn>
        </div>
      </VCol>
    </VRow>

    <VCard>
      <VCardText class="pb-0">
        <VTextField
          v-model="search"
          placeholder="Search by name, HS code..."
          prepend-inner-icon="tabler-search"
          variant="outlined"
          density="compact"
          clearable
          style="max-inline-size: 340px;"
        />
      </VCardText>

      <VDataTable :headers="headers" :items="products" :loading="loading" hover>
        <template #item.name="{ item }">
          <div>
            <p class="text-body-2 font-weight-semibold mb-0">{{ item.name }}</p>
            <p class="text-caption text-medium-emphasis mb-0">{{ item.description }}</p>
          </div>
        </template>

        <template #item.hs_code="{ item }">
          <VChip size="small" variant="tonal" color="primary" class="font-weight-medium">
            {{ item.hs_code }}
          </VChip>
        </template>

        <template #item.rate="{ item }">
          <VChip size="x-small" variant="tonal" color="info">{{ item.rate }}</VChip>
        </template>

        <template #item.unit_price="{ item }">
          <span class="font-weight-medium">PKR {{ formatPKR(item.unit_price) }}</span>
        </template>

        <template #item.is_active="{ item }">
          <VChip :color="item.is_active ? 'success' : 'error'" size="x-small" variant="tonal">
            {{ item.is_active ? 'Active' : 'Inactive' }}
          </VChip>
        </template>

        <template #item.actions="{ item }">
          <div class="d-flex gap-1 justify-center">
            <VBtn icon size="small" variant="text" color="primary" :to="{ name: 'products-edit', params: { id: item.id } }">
              <VIcon icon="tabler-edit" size="18" />
              <VTooltip activator="parent">Edit</VTooltip>
            </VBtn>
            <VBtn icon size="small" variant="text" color="error" @click="confirmDelete(item.id)">
              <VIcon icon="tabler-trash" size="18" />
              <VTooltip activator="parent">Delete</VTooltip>
            </VBtn>
          </div>
        </template>

        <template #no-data>
          <div class="text-center py-8">
            <VIcon icon="tabler-package-off" size="48" class="text-medium-emphasis mb-2" />
            <p class="text-body-2 text-medium-emphasis">No products found</p>
            <VBtn color="primary" variant="tonal" size="small" class="mt-2" :to="{ name: 'products-create' }">
              Add First Product
            </VBtn>
          </div>
        </template>
      </VDataTable>
    </VCard>

    <VDialog v-model="deleteDialog" max-width="380">
      <VCard>
        <VCardText class="pt-5 text-center">
          <VIcon icon="tabler-alert-triangle" size="52" color="error" class="mb-3" />
          <h5 class="text-h6 mb-2">Delete Product?</h5>
          <p class="text-body-2 text-medium-emphasis">This cannot be undone.</p>
        </VCardText>
        <VCardActions class="justify-center pb-4 gap-3">
          <VBtn variant="tonal" @click="deleteDialog = false">Cancel</VBtn>
          <VBtn color="error" @click="doDelete">Delete</VBtn>
        </VCardActions>
      </VCard>
    </VDialog>

    <VSnackbar v-model="snackbar.show" :color="snackbar.color" timeout="3000">{{ snackbar.text }}</VSnackbar>
  </div>
</template>
