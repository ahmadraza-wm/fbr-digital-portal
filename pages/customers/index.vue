<script setup>
import { useEnterpriseApi } from '@/composables/useEnterpriseApi'

definePageMeta({ name: 'customers' })

const { getCustomers, deleteCustomer } = useEnterpriseApi()

const customers = ref([])
const loading = ref(false)
const search = ref('')
const deleteDialog = ref(false)
const deletingId = ref(null)
const snackbar = reactive({ show: false, text: '', color: 'success' })

const headers = [
  { title: 'Business Name', key: 'business_name' },
  { title: 'NTN/CNIC', key: 'ntn_cnic' },
  { title: 'Registration', key: 'registration_type', align: 'center' },
  { title: 'Province', key: 'province' },
  { title: 'Phone', key: 'phone' },
  { title: 'Email', key: 'email' },
  { title: 'Status', key: 'is_active', align: 'center' },
  { title: 'Actions', key: 'actions', sortable: false, align: 'center' },
]

const fetchCustomers = async () => {
  loading.value = true
  try {
    const res = await getCustomers({ search: search.value })
    customers.value = res.data?.data || res.data || []
  }
  catch (e) { showSnack('Failed to load customers', 'error') }
  finally { loading.value = false }
}

const confirmDelete = id => { deletingId.value = id; deleteDialog.value = true }

const doDelete = async () => {
  try {
    await deleteCustomer(deletingId.value)
    showSnack('Customer deleted')
    fetchCustomers()
  }
  catch (e) { showSnack('Delete failed', 'error') }
  finally { deleteDialog.value = false }
}

const showSnack = (text, color = 'success') => {
  snackbar.text = text; snackbar.color = color; snackbar.show = true
}

onMounted(fetchCustomers)
watch(search, useDebounceFn(fetchCustomers, 400))
</script>

<template>
  <div>
    <VRow class="mb-4">
      <VCol cols="12">
        <div class="d-flex align-center justify-space-between flex-wrap gap-3">
          <div>
            <h4 class="text-h5 font-weight-bold">Customers</h4>
            <p class="text-body-2 text-medium-emphasis mb-0">Manage your buyers / customers</p>
          </div>
          <VBtn color="primary" prepend-icon="tabler-plus" :to="{ name: 'customers-create' }">
            Add Customer
          </VBtn>
        </div>
      </VCol>
    </VRow>

    <VCard>
      <VCardText class="pb-0">
        <VTextField
          v-model="search"
          placeholder="Search by name, NTN..."
          prepend-inner-icon="tabler-search"
          variant="outlined"
          density="compact"
          clearable
          style="max-inline-size: 340px;"
        />
      </VCardText>

      <VDataTable :headers="headers" :items="customers" :loading="loading" hover>
        <template #item.business_name="{ item }">
          <div>
            <p class="text-body-2 font-weight-semibold mb-0">{{ item.business_name }}</p>
            <p class="text-caption text-medium-emphasis mb-0">{{ item.address }}</p>
          </div>
        </template>

        <template #item.registration_type="{ item }">
          <VChip
            :color="item.registration_type === 'Registered' ? 'success' : 'warning'"
            size="x-small"
            variant="tonal"
          >
            {{ item.registration_type }}
          </VChip>
        </template>

        <template #item.is_active="{ item }">
          <VChip :color="item.is_active ? 'success' : 'error'" size="x-small" variant="tonal">
            {{ item.is_active ? 'Active' : 'Inactive' }}
          </VChip>
        </template>

        <template #item.actions="{ item }">
          <div class="d-flex gap-1 justify-center">
            <VBtn icon size="small" variant="text" color="primary" :to="{ name: 'customers-edit', params: { id: item.id } }">
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
            <VIcon icon="tabler-users-off" size="48" class="text-medium-emphasis mb-2" />
            <p class="text-body-2 text-medium-emphasis">No customers found</p>
            <VBtn color="primary" variant="tonal" size="small" class="mt-2" :to="{ name: 'customers-create' }">
              Add First Customer
            </VBtn>
          </div>
        </template>
      </VDataTable>
    </VCard>

    <VDialog v-model="deleteDialog" max-width="380">
      <VCard>
        <VCardText class="pt-5 text-center">
          <VIcon icon="tabler-alert-triangle" size="52" color="error" class="mb-3" />
          <h5 class="text-h6 mb-2">Delete Customer?</h5>
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
