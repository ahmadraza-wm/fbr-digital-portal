<script setup>
import { useEnterpriseApi } from '@/composables/useEnterpriseApi'

definePageMeta({ name: 'products-edit' })

const route = useRoute()
const { getProduct, updateProduct } = useEnterpriseApi()
const loading = ref(false)
const fetchLoading = ref(true)
const snackbar = reactive({ show: false, text: '', color: 'success' })

const form = reactive({
  name: '', description: '', hs_code: '', sale_type: 'Goods at standard rate (default)',
  rate: '18%', uom: '', unit_price: '', fixed_notified_price: 0, is_active: true,
})

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
const rateOptions = ['0%', '5%', '8%', '10%', '13%', '17%', '18%', '25%']
const uomOptions = ['Numbers, pieces, units', 'KG', 'Litre', 'Metre', 'Square Metre', 'KWH', 'Dozen', 'Ton', 'Gram', 'Millilitre']

onMounted(async () => {
  try {
    const res = await getProduct(route.params.id)
    Object.assign(form, res.data?.data || res.data)
  }
  catch (e) { showSnack('Failed to load product', 'error') }
  finally { fetchLoading.value = false }
})

const submit = async () => {
  loading.value = true
  try {
    await updateProduct(route.params.id, form)
    showSnack('Product updated successfully')
  }
  catch (e) {
    const errors = e?.response?.data?.errors
    const msg = errors ? Object.values(errors).flat().join(', ') : (e?.response?.data?.message || 'Failed')
    showSnack(msg, 'error')
  }
  finally { loading.value = false }
}

const showSnack = (text, color = 'success') => {
  snackbar.text = text; snackbar.color = color; snackbar.show = true
}
</script>

<template>
  <div>
    <VRow class="mb-4">
      <VCol cols="12">
        <div class="d-flex align-center gap-3">
          <VBtn icon variant="text" :to="{ name: 'products' }">
            <VIcon icon="tabler-arrow-left" />
          </VBtn>
          <div>
            <h4 class="text-h5 font-weight-bold">Edit Product</h4>
            <p class="text-body-2 text-medium-emphasis mb-0">Update product details</p>
          </div>
        </div>
      </VCol>
    </VRow>

    <div v-if="fetchLoading" class="text-center py-12">
      <VProgressCircular indeterminate color="primary" />
    </div>

    <VRow v-else justify="center">
      <VCol cols="12" md="9">
        <VCard>
          <VCardItem><VCardTitle>Product Details</VCardTitle></VCardItem>
          <VDivider />
          <VCardText>
            <VRow>
              <VCol cols="12" sm="8">
                <VTextField v-model="form.name" label="Product Name *" variant="outlined" density="compact" />
              </VCol>
              <VCol cols="12" sm="4">
                <VTextField v-model="form.hs_code" label="HS Code *" variant="outlined" density="compact" placeholder="e.g. 6006.1000" />
              </VCol>
              <VCol cols="12">
                <VTextField v-model="form.description" label="Description" variant="outlined" density="compact" />
              </VCol>
              <VCol cols="12" sm="6">
                <VSelect v-model="form.sale_type" :items="saleTypes" label="Sale Type *" variant="outlined" density="compact" />
              </VCol>
              <VCol cols="12" sm="3">
                <VSelect v-model="form.rate" :items="rateOptions" label="Tax Rate *" variant="outlined" density="compact" />
              </VCol>
              <VCol cols="12" sm="3">
                <VSelect v-model="form.uom" :items="uomOptions" label="UOM *" variant="outlined" density="compact" />
              </VCol>
              <VCol cols="12" sm="6">
                <VTextField v-model="form.unit_price" label="Unit Price (PKR)" type="number" variant="outlined" density="compact" prefix="PKR" />
              </VCol>
              <VCol cols="12" sm="6">
                <VTextField v-model="form.fixed_notified_price" label="Fixed / Notified Price" type="number" variant="outlined" density="compact" prefix="PKR" />
              </VCol>
              <VCol cols="12">
                <VSwitch v-model="form.is_active" label="Active" color="success" inset />
              </VCol>
            </VRow>
          </VCardText>
        </VCard>

        <div class="d-flex gap-3 mt-4">
          <VBtn color="primary" size="large" prepend-icon="tabler-device-floppy" :loading="loading" @click="submit">
            Update Product
          </VBtn>
          <VBtn variant="tonal" size="large" :to="{ name: 'products' }">Cancel</VBtn>
        </div>
      </VCol>
    </VRow>

    <VSnackbar v-model="snackbar.show" :color="snackbar.color" timeout="4000">{{ snackbar.text }}</VSnackbar>
  </div>
</template>
