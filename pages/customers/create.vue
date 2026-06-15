<script setup>
import { useEnterpriseApi } from '@/composables/useEnterpriseApi'

definePageMeta({ name: 'customers-create' })

const { createCustomer } = useEnterpriseApi()
const loading = ref(false)
const snackbar = reactive({ show: false, text: '', color: 'success' })

const form = reactive({
  business_name: '',
  ntn_cnic: '',
  registration_type: 'Registered',
  province: '',
  address: '',
  phone: '',
  email: '',
  contact_person: '',
  is_active: true,
})

const provinces = ['Punjab', 'Sindh', 'KPK', 'Balochistan', 'AJK', 'GB', 'ICT']
const regTypes = ['Registered', 'Unregistered']

const submit = async () => {
  loading.value = true
  try {
    await createCustomer(form)
    showSnack('Customer created successfully')
    setTimeout(() => navigateTo({ name: 'customers' }), 1000)
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
          <VBtn icon variant="text" :to="{ name: 'customers' }">
            <VIcon icon="tabler-arrow-left" />
          </VBtn>
          <div>
            <h4 class="text-h5 font-weight-bold">Add Customer</h4>
            <p class="text-body-2 text-medium-emphasis mb-0">Register a new buyer / customer</p>
          </div>
        </div>
      </VCol>
    </VRow>

    <VRow justify="center">
      <VCol cols="12" md="8">
        <VCard>
          <VCardItem><VCardTitle>Customer Details</VCardTitle></VCardItem>
          <VDivider />
          <VCardText>
            <VRow>
              <VCol cols="12" sm="6">
                <VTextField v-model="form.business_name" label="Business Name *" variant="outlined" density="compact" />
              </VCol>
              <VCol cols="12" sm="6">
                <VTextField
                  v-model="form.ntn_cnic"
                  label="NTN / CNIC"
                  variant="outlined"
                  density="compact"
                  hint="7 digits NTN or 13 digits CNIC"
                  persistent-hint
                />
              </VCol>
              <VCol cols="12" sm="6">
                <VSelect
                  v-model="form.registration_type"
                  :items="regTypes"
                  label="Registration Type *"
                  variant="outlined"
                  density="compact"
                />
              </VCol>
              <VCol cols="12" sm="6">
                <VSelect v-model="form.province" :items="provinces" label="Province *" variant="outlined" density="compact" />
              </VCol>
              <VCol cols="12">
                <VTextField v-model="form.address" label="Address" variant="outlined" density="compact" />
              </VCol>
              <VCol cols="12" sm="6">
                <VTextField v-model="form.phone" label="Phone" variant="outlined" density="compact" />
              </VCol>
              <VCol cols="12" sm="6">
                <VTextField v-model="form.email" label="Email" type="email" variant="outlined" density="compact" />
              </VCol>
              <VCol cols="12" sm="6">
                <VTextField v-model="form.contact_person" label="Contact Person" variant="outlined" density="compact" />
              </VCol>
              <VCol cols="12" sm="6">
                <VSwitch v-model="form.is_active" label="Active" color="success" inset />
              </VCol>
            </VRow>
          </VCardText>
        </VCard>

        <div class="d-flex gap-3 mt-4">
          <VBtn color="primary" size="large" prepend-icon="tabler-device-floppy" :loading="loading" @click="submit">
            Save Customer
          </VBtn>
          <VBtn variant="tonal" size="large" :to="{ name: 'customers' }">Cancel</VBtn>
        </div>
      </VCol>
    </VRow>

    <VSnackbar v-model="snackbar.show" :color="snackbar.color" timeout="4000">{{ snackbar.text }}</VSnackbar>
  </div>
</template>
