<script setup>
import { useEnterpriseApi } from '@/composables/useEnterpriseApi'

definePageMeta({ name: 'admin-users-create' })

const { createUser, getCompanies } = useEnterpriseApi()

const loading = ref(false)
const companies = ref([])
const showPass = ref(false)
const snackbar = reactive({ show: false, text: '', color: 'success' })

const form = reactive({
  name: '',
  email: '',
  phone: '',
  password: '',
  password_confirmation: '',
  role: 'user',
  company_id: null,
  is_active: true,
})

const roles = [
  { title: 'Super Admin', value: 'admin' },
  { title: 'Company Admin', value: 'company_admin' },
  { title: 'User', value: 'user' },
]

onMounted(async () => {
  try {
    const res = await getCompanies()
    companies.value = (res.data?.data || res.data || []).map(c => ({ title: c.name, value: c.id }))
  }
  catch {}
})

const submit = async () => {
  loading.value = true
  try {
    await createUser(form)
    showSnack('User created successfully')
    setTimeout(() => navigateTo({ name: 'admin-users' }), 1000)
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
          <VBtn icon variant="text" :to="{ name: 'admin-users' }">
            <VIcon icon="tabler-arrow-left" />
          </VBtn>
          <div>
            <h4 class="text-h5 font-weight-bold">Add User</h4>
            <p class="text-body-2 text-medium-emphasis mb-0">Create a new system user</p>
          </div>
        </div>
      </VCol>
    </VRow>

    <VRow justify="center">
      <VCol cols="12" md="8">
        <VCard>
          <VCardItem><VCardTitle>User Details</VCardTitle></VCardItem>
          <VDivider />
          <VCardText>
            <VRow>
              <VCol cols="12" sm="6">
                <VTextField v-model="form.name" label="Full Name *" variant="outlined" density="compact" />
              </VCol>
              <VCol cols="12" sm="6">
                <VTextField v-model="form.email" label="Email *" type="email" variant="outlined" density="compact" />
              </VCol>
              <VCol cols="12" sm="6">
                <VTextField v-model="form.phone" label="Phone" variant="outlined" density="compact" />
              </VCol>
              <VCol cols="12" sm="6">
                <VSelect v-model="form.role" :items="roles" label="Role *" variant="outlined" density="compact" />
              </VCol>
              <VCol cols="12">
                <VSelect
                  v-model="form.company_id"
                  :items="companies"
                  label="Assign to Company *"
                  variant="outlined"
                  density="compact"
                  clearable
                />
              </VCol>
              <VCol cols="12" sm="6">
                <VTextField
                  v-model="form.password"
                  label="Password *"
                  :type="showPass ? 'text' : 'password'"
                  variant="outlined"
                  density="compact"
                  :append-inner-icon="showPass ? 'tabler-eye-off' : 'tabler-eye'"
                  @click:append-inner="showPass = !showPass"
                />
              </VCol>
              <VCol cols="12" sm="6">
                <VTextField
                  v-model="form.password_confirmation"
                  label="Confirm Password *"
                  :type="showPass ? 'text' : 'password'"
                  variant="outlined"
                  density="compact"
                />
              </VCol>
              <VCol cols="12">
                <VSwitch v-model="form.is_active" label="Active" color="success" inset />
              </VCol>
            </VRow>
          </VCardText>
        </VCard>

        <div class="d-flex gap-3 mt-4">
          <VBtn color="primary" size="large" prepend-icon="tabler-device-floppy" :loading="loading" @click="submit">
            Create User
          </VBtn>
          <VBtn variant="tonal" size="large" :to="{ name: 'admin-users' }">Cancel</VBtn>
        </div>
      </VCol>
    </VRow>

    <VSnackbar v-model="snackbar.show" :color="snackbar.color" timeout="4000">{{ snackbar.text }}</VSnackbar>
  </div>
</template>
