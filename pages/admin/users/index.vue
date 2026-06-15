<script setup>
import { useEnterpriseApi } from '@/composables/useEnterpriseApi'

definePageMeta({ name: 'admin-users' })

const { getUsers, deleteUser } = useEnterpriseApi()

const users = ref([])
const loading = ref(false)
const search = ref('')
const deleteDialog = ref(false)
const deletingId = ref(null)
const snackbar = reactive({ show: false, text: '', color: 'success' })

const headers = [
  { title: 'Name', key: 'name' },
  { title: 'Email', key: 'email' },
  { title: 'Company', key: 'company.name' },
  { title: 'Role', key: 'role', align: 'center' },
  { title: 'Status', key: 'is_active', align: 'center' },
  { title: 'Created', key: 'created_at' },
  { title: 'Actions', key: 'actions', sortable: false, align: 'center' },
]

const roleColor = role => ({ admin: 'error', company_admin: 'warning', user: 'info' }[role] || 'secondary')

const fetchUsers = async () => {
  loading.value = true
  try {
    const res = await getUsers({ search: search.value })
    users.value = res.data?.data || res.data || []
  }
  catch (e) { showSnack('Failed to load users', 'error') }
  finally { loading.value = false }
}

const confirmDelete = id => { deletingId.value = id; deleteDialog.value = true }

const doDelete = async () => {
  try {
    await deleteUser(deletingId.value)
    showSnack('User deleted')
    fetchUsers()
  }
  catch (e) { showSnack('Delete failed', 'error') }
  finally { deleteDialog.value = false }
}

const showSnack = (text, color = 'success') => {
  snackbar.text = text; snackbar.color = color; snackbar.show = true
}

const formatDate = d => d ? new Date(d).toLocaleDateString() : ''

onMounted(fetchUsers)
watch(search, useDebounceFn(fetchUsers, 400))
</script>

<template>
  <div>
    <VRow class="mb-4">
      <VCol cols="12">
        <div class="d-flex align-center justify-space-between flex-wrap gap-3">
          <div>
            <h4 class="text-h5 font-weight-bold">Users</h4>
            <p class="text-body-2 text-medium-emphasis mb-0">Manage system users and their company assignments</p>
          </div>
          <VBtn color="primary" prepend-icon="tabler-plus" :to="{ name: 'admin-users-create' }">
            Add User
          </VBtn>
        </div>
      </VCol>
    </VRow>

    <VCard>
      <VCardText class="pb-0">
        <VTextField
          v-model="search"
          placeholder="Search users..."
          prepend-inner-icon="tabler-search"
          variant="outlined"
          density="compact"
          clearable
          style="max-inline-size: 320px;"
        />
      </VCardText>

      <VDataTable :headers="headers" :items="users" :loading="loading" hover>
        <template #item.name="{ item }">
          <div class="d-flex align-center gap-2 py-1">
            <VAvatar size="32" color="primary" variant="tonal">
              <span class="text-caption font-weight-bold">{{ item.name?.charAt(0)?.toUpperCase() }}</span>
            </VAvatar>
            <div>
              <p class="text-body-2 font-weight-semibold mb-0">{{ item.name }}</p>
              <p class="text-caption text-medium-emphasis mb-0">{{ item.phone }}</p>
            </div>
          </div>
        </template>

        <template #item.role="{ item }">
          <VChip :color="roleColor(item.role)" size="x-small" variant="tonal">
            {{ item.role?.replace('_', ' ')?.toUpperCase() }}
          </VChip>
        </template>

        <template #item.is_active="{ item }">
          <VChip :color="item.is_active ? 'success' : 'warning'" size="x-small" variant="tonal">
            {{ item.is_active ? 'Active' : 'Inactive' }}
          </VChip>
        </template>

        <template #item.created_at="{ item }">
          <span class="text-caption">{{ formatDate(item.created_at) }}</span>
        </template>

        <template #item.actions="{ item }">
          <div class="d-flex gap-1 justify-center">
            <VBtn icon size="small" variant="text" color="primary" :to="{ name: 'admin-users-edit', params: { id: item.id } }">
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
            <p class="text-body-2 text-medium-emphasis">No users found</p>
          </div>
        </template>
      </VDataTable>
    </VCard>

    <VDialog v-model="deleteDialog" max-width="380">
      <VCard>
        <VCardText class="pt-5 text-center">
          <VIcon icon="tabler-alert-triangle" size="52" color="error" class="mb-3" />
          <h5 class="text-h6 mb-2">Delete User?</h5>
          <p class="text-body-2 text-medium-emphasis">This action cannot be undone.</p>
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
