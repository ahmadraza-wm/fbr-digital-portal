<script setup>
import { useEnterpriseApi } from '@/composables/useEnterpriseApi'

definePageMeta({ name: 'admin-companies' })

const { getCompanies, deleteCompany } = useEnterpriseApi()

const companies = ref([])
const loading = ref(false)
const search = ref('')
const deleteDialog = ref(false)
const deletingId = ref(null)
const snackbar = reactive({ show: false, text: '', color: 'success' })

const headers = [
  { title: 'Logo', key: 'logo', sortable: false, width: '70px' },
  { title: 'Company Name', key: 'name' },
  { title: 'NTN', key: 'ntn' },
  { title: 'ST Reg #', key: 'st_registration' },
  { title: 'Province', key: 'province' },
  { title: 'Phone', key: 'phone' },
  { title: 'Users', key: 'users_count', align: 'center' },
  { title: 'FBR Token', key: 'fbr_token_set', align: 'center' },
  { title: 'Status', key: 'is_active', align: 'center' },
  { title: 'Actions', key: 'actions', sortable: false, align: 'center' },
]

const fetchCompanies = async () => {
  loading.value = true
  try {
    const res = await getCompanies({ search: search.value })
    companies.value = res.data?.data || res.data || []
  }
  catch (e) {
    showSnack(e?.response?.data?.message || 'Failed to load companies', 'error')
  }
  finally { loading.value = false }
}

const confirmDelete = (id) => {
  deletingId.value = id
  deleteDialog.value = true
}

const doDelete = async () => {
  try {
    await deleteCompany(deletingId.value)
    showSnack('Company deleted successfully')
    fetchCompanies()
  }
  catch (e) {
    showSnack(e?.response?.data?.message || 'Delete failed', 'error')
  }
  finally { deleteDialog.value = false }
}

const showSnack = (text, color = 'success') => {
  snackbar.text = text
  snackbar.color = color
  snackbar.show = true
}

const getLogoUrl = logo => logo ? logo : null

onMounted(fetchCompanies)
watch(search, useDebounceFn(fetchCompanies, 400))
</script>

<template>
  <div>
    <!-- Header -->
    <VRow class="mb-4">
      <VCol cols="12">
        <div class="d-flex align-center justify-space-between flex-wrap gap-3">
          <div>
            <h4 class="text-h5 font-weight-bold">Companies</h4>
            <p class="text-body-2 text-medium-emphasis mb-0">Manage all registered companies</p>
          </div>
          <VBtn color="primary" prepend-icon="tabler-plus" :to="{ name: 'admin-companies-create' }">
            Add Company
          </VBtn>
        </div>
      </VCol>
    </VRow>

    <VCard>
      <VCardText class="pb-0">
        <VRow>
          <VCol cols="12" sm="4">
            <VTextField
              v-model="search"
              placeholder="Search companies..."
              prepend-inner-icon="tabler-search"
              variant="outlined"
              density="compact"
              clearable
            />
          </VCol>
        </VRow>
      </VCardText>

      <VDataTable
        :headers="headers"
        :items="companies"
        :loading="loading"
        :search="search"
        hover
      >
        <!-- Logo -->
        <template #item.logo="{ item }">
          <VAvatar size="36" color="primary" variant="tonal" class="my-1">
            <VImg v-if="getLogoUrl(item.logo)" :src="getLogoUrl(item.logo)" />
            <VIcon v-else icon="tabler-building" size="20" />
          </VAvatar>
        </template>

        <!-- Name -->
        <template #item.name="{ item }">
          <div>
            <p class="text-body-2 font-weight-semibold mb-0">{{ item.name }}</p>
            <p class="text-caption text-medium-emphasis mb-0">{{ item.email }}</p>
          </div>
        </template>

        <!-- FBR Token -->
        <template #item.fbr_token_set="{ item }">
          <VChip
            :color="item.fbr_token ? 'success' : 'error'"
            size="x-small"
            variant="tonal"
          >
            {{ item.fbr_token ? 'Set' : 'Not Set' }}
          </VChip>
        </template>

        <!-- Status -->
        <template #item.is_active="{ item }">
          <VChip
            :color="item.is_active ? 'success' : 'warning'"
            size="x-small"
            variant="tonal"
          >
            {{ item.is_active ? 'Active' : 'Inactive' }}
          </VChip>
        </template>

        <!-- Actions -->
        <template #item.actions="{ item }">
          <div class="d-flex gap-1 justify-center">
            <VBtn icon size="small" variant="text" color="primary" :to="{ name: 'admin-companies-edit', params: { id: item.id } }">
              <VIcon icon="tabler-edit" size="18" />
              <VTooltip activator="parent">Edit</VTooltip>
            </VBtn>
            <VBtn icon size="small" variant="text" color="info" :to="{ name: 'admin-companies-view', params: { id: item.id } }">
              <VIcon icon="tabler-eye" size="18" />
              <VTooltip activator="parent">View</VTooltip>
            </VBtn>
            <VBtn icon size="small" variant="text" color="error" @click="confirmDelete(item.id)">
              <VIcon icon="tabler-trash" size="18" />
              <VTooltip activator="parent">Delete</VTooltip>
            </VBtn>
          </div>
        </template>

        <template #no-data>
          <div class="text-center py-8">
            <VIcon icon="tabler-building-off" size="48" class="text-medium-emphasis mb-2" />
            <p class="text-body-2 text-medium-emphasis">No companies found</p>
          </div>
        </template>
      </VDataTable>
    </VCard>

    <!-- Delete Confirm -->
    <VDialog v-model="deleteDialog" max-width="400">
      <VCard>
        <VCardText class="pt-5 text-center">
          <VIcon icon="tabler-alert-triangle" size="56" color="error" class="mb-3" />
          <h5 class="text-h6 mb-2">Delete Company?</h5>
          <p class="text-body-2 text-medium-emphasis">This will also delete all associated users, customers and products. This action cannot be undone.</p>
        </VCardText>
        <VCardActions class="justify-center pb-4 gap-3">
          <VBtn variant="tonal" @click="deleteDialog = false">Cancel</VBtn>
          <VBtn color="error" @click="doDelete">Delete</VBtn>
        </VCardActions>
      </VCard>
    </VDialog>

    <VSnackbar v-model="snackbar.show" :color="snackbar.color" timeout="3000">
      {{ snackbar.text }}
    </VSnackbar>
  </div>
</template>
