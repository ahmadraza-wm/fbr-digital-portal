<script setup>
import { useEnterpriseApi } from '@/composables/useEnterpriseApi'

definePageMeta({ name: 'admin-companies-create' })

const { createCompany } = useEnterpriseApi()

const loading = ref(false)
const snackbar = reactive({ show: false, text: '', color: 'success' })
const logoPreview = ref(null)
const logoFile = ref(null)

const form = reactive({
  name: '',
  ntn: '',
  st_registration: '',
  cnic: '',
  email: '',
  phone: '',
  address: '',
  city: '',
  province: '',
  postal_code: '',
  head_office: '',
  sub_office: '',
  fbr_token: '',
  is_active: true,
})

const provinces = ['Punjab', 'Sindh', 'KPK', 'Balochistan', 'AJK', 'GB', 'ICT']

const onLogoChange = (e) => {
  const file = e.target.files[0]
  if (!file) return
  logoFile.value = file
  logoPreview.value = URL.createObjectURL(file)
}

const removeLogo = () => {
  logoPreview.value = null
  logoFile.value = null
}

const submit = async () => {
  loading.value = true
  try {
    const fd = new FormData()
    Object.entries(form).forEach(([k, v]) => fd.append(k, v ?? ''))
    if (logoFile.value) fd.append('logo', logoFile.value)

    await createCompany(fd)
    showSnack('Company created successfully')
    setTimeout(() => navigateTo({ name: 'admin-companies' }), 1000)
  }
  catch (e) {
    showSnack(e?.response?.data?.message || 'Failed to create company', 'error')
  }
  finally { loading.value = false }
}

const showSnack = (text, color = 'success') => {
  snackbar.text = text
  snackbar.color = color
  snackbar.show = true
}
</script>

<template>
  <div>
    <VRow class="mb-4">
      <VCol cols="12">
        <div class="d-flex align-center gap-3">
          <VBtn icon variant="text" :to="{ name: 'admin-companies' }">
            <VIcon icon="tabler-arrow-left" />
          </VBtn>
          <div>
            <h4 class="text-h5 font-weight-bold">Add Company</h4>
            <p class="text-body-2 text-medium-emphasis mb-0">Register a new company in the system</p>
          </div>
        </div>
      </VCol>
    </VRow>

    <VRow>
      <!-- Logo Upload -->
      <VCol cols="12" md="3">
        <VCard>
          <VCardText class="text-center pa-6">
            <div class="mb-4">
              <VAvatar size="100" color="primary" variant="tonal" class="mb-3">
                <VImg v-if="logoPreview" :src="logoPreview" />
                <VIcon v-else icon="tabler-building" size="48" />
              </VAvatar>
            </div>
            <p class="text-body-2 font-weight-semibold mb-1">Company Logo</p>
            <p class="text-caption text-medium-emphasis mb-3">PNG, JPG up to 2MB</p>
            <VBtn variant="tonal" size="small" prepend-icon="tabler-upload" tag="label" block>
              Upload Logo
              <input type="file" accept="image/*" class="d-none" @change="onLogoChange">
            </VBtn>
            <VBtn v-if="logoPreview" variant="text" color="error" size="small" class="mt-2" block @click="removeLogo">
              Remove
            </VBtn>
          </VCardText>
        </VCard>

        <!-- FBR Token Card -->
        <VCard class="mt-4">
          <VCardItem>
            <template #prepend>
              <VAvatar color="warning" variant="tonal" size="32">
                <VIcon icon="tabler-key" size="18" />
              </VAvatar>
            </template>
            <VCardTitle class="text-body-1">FBR API Token</VCardTitle>
          </VCardItem>
          <VDivider />
          <VCardText>
            <VTextField
              v-model="form.fbr_token"
              label="Bearer Token"
              type="password"
              variant="outlined"
              density="compact"
              hint="PRAL-issued token for this company"
              persistent-hint
            />
          </VCardText>
        </VCard>
      </VCol>

      <!-- Main Form -->
      <VCol cols="12" md="9">
        <VCard>
          <VCardItem>
            <VCardTitle>Company Information</VCardTitle>
          </VCardItem>
          <VDivider />
          <VCardText>
            <VRow>
              <VCol cols="12" sm="6">
                <VTextField v-model="form.name" label="Company Name *" variant="outlined" density="compact" />
              </VCol>
              <VCol cols="12" sm="6">
                <VTextField v-model="form.email" label="Email *" type="email" variant="outlined" density="compact" />
              </VCol>
              <VCol cols="12" sm="4">
                <VTextField v-model="form.ntn" label="NTN *" variant="outlined" density="compact" hint="7 digit NTN" persistent-hint />
              </VCol>
              <VCol cols="12" sm="4">
                <VTextField v-model="form.st_registration" label="ST Registration #" variant="outlined" density="compact" />
              </VCol>
              <VCol cols="12" sm="4">
                <VTextField v-model="form.cnic" label="CNIC (if applicable)" variant="outlined" density="compact" hint="13 digits" persistent-hint />
              </VCol>
              <VCol cols="12" sm="6">
                <VTextField v-model="form.phone" label="Phone" variant="outlined" density="compact" />
              </VCol>
              <VCol cols="12" sm="6">
                <VSelect v-model="form.province" :items="provinces" label="Province *" variant="outlined" density="compact" />
              </VCol>
              <VCol cols="12">
                <VTextField v-model="form.head_office" label="Head Office Address" variant="outlined" density="compact" />
              </VCol>
              <VCol cols="12">
                <VTextField v-model="form.sub_office" label="Sub Office Address" variant="outlined" density="compact" />
              </VCol>
              <VCol cols="12" sm="4">
                <VTextField v-model="form.city" label="City" variant="outlined" density="compact" />
              </VCol>
              <VCol cols="12" sm="4">
                <VTextField v-model="form.postal_code" label="Postal Code" variant="outlined" density="compact" />
              </VCol>
              <VCol cols="12" sm="4">
                <VSwitch v-model="form.is_active" label="Active" color="success" inset />
              </VCol>
            </VRow>
          </VCardText>
        </VCard>

        <div class="d-flex gap-3 mt-4">
          <VBtn color="primary" size="large" prepend-icon="tabler-device-floppy" :loading="loading" @click="submit">
            Save Company
          </VBtn>
          <VBtn variant="tonal" size="large" :to="{ name: 'admin-companies' }">Cancel</VBtn>
        </div>
      </VCol>
    </VRow>

    <VSnackbar v-model="snackbar.show" :color="snackbar.color" timeout="3000">{{ snackbar.text }}</VSnackbar>
  </div>
</template>
