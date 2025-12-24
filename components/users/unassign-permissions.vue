<script setup>
import { ref, computed, onMounted } from 'vue'
import { useUsers } from '@/composables/useUsers'
import { useRoute } from 'vue-router'
import useUiFeedback from "@/composables/useUiFeedback";
import { useNuxtApp } from "#app";
const permissionStore = usePermissionStore()
const { fetchUserPermissions, userPermissions } = useUsers()
const route = useRoute()

  const { $axios } = useNuxtApp();
const verifying = ref(false)
const searchTerm = ref('')
const selectedPermissions = ref([])
const options = ref({
  page: 1,
  itemsPerPage: -1,
})


 const {
        loading,
        showLoading,
        hideLoading,
        showSuccess,
        showError,
    } = useUiFeedback();


const props = defineProps({
  userId: {
    type: String,
    required: true,
  },


});

onMounted(async () => {
  await fetchUserPermissions(props.userId)
})

console.log('user id',route.params.id);

const unassign_per = computed(() => userPermissions.value.unassigned_permissions || [])

console.log('unassign permissions',userPermissions.value.unassigned_permissions );

const filteredPermissions = computed(() => {
  if (!searchTerm.value) return unassign_per.value
  const term = searchTerm.value.toLowerCase()
  return unassign_per.value.filter(item =>
    item.permission_name.toLowerCase().includes(term) ||
    item.group_name.toLowerCase().includes(term)
  )
})

const totalPages = computed(() =>
  Math.ceil(filteredPermissions.value.length / options.value.itemsPerPage)
)

const startIndex = computed(() => {
  if (options.value.itemsPerPage === -1) return 0
  return (options.value.page - 1) * options.value.itemsPerPage
})

const endIndex = computed(() => {
  if (options.value.itemsPerPage === -1) return filteredPermissions.value.length
  const end = startIndex.value + options.value.itemsPerPage
  return end > filteredPermissions.value.length ? filteredPermissions.value.length : end
})

const paginatedPer = computed(() => {
  return filteredPermissions.value.slice(startIndex.value, endIndex.value)
})

const isCheckedAll = computed({
  get() {
    return filteredPermissions.value.length > 0 &&
      filteredPermissions.value.every(item => selectedPermissions.value.includes(item.id))
  },
  set(val) {
    if (val) {
      const idsToAdd = filteredPermissions.value.map(item => item.id)
      selectedPermissions.value = Array.from(new Set([...selectedPermissions.value, ...idsToAdd]))
    } else {
      selectedPermissions.value = selectedPermissions.value.filter(id =>
        !filteredPermissions.value.some(item => item.id === id)
      )
    }
  }
})
const handleAssign = ()=>{
  assignPermissions();
  verifying.value = false;
}
const assignPermissions = async () => {
  if (selectedPermissions.value.length === 0) {
    showError('Please select at least one permission.')
    return
  }

  try {
    const response = await $axios.patch(`/permissions/assign/${props.userId}`, {
      permissions: selectedPermissions.value,
    })
    showSuccess(response.data.message)
    selectedPermissions.value = []
    await fetchUserPermissions(props.userId) 
  } catch (error) {
    console.error(error)
    showError(error.response?.data?.message || 'Failed to assign permissions')
  }
}

</script>

<template>
  <VCard class="mt-5">
    <v-card-title class="border-b-sm" style="background-color: lightgrey;">
      <h4 class="text-h5 py-3">Unassigned Permissions</h4>
    </v-card-title>

    <VCardText class="px-4 pt-4 pb-4">
      <VRow>
        <VCol cols="12">
          <p class="font-weight-medium text-color mb-0 lh-22">Search</p>
          <v-text-field v-model="searchTerm" clearable outlined dense placeholder="Enter 2 character to search Permission" />
        </VCol>
        <VCol cols="12" class="d-flex justify-end" v-if="permissionStore.hasPermission('permissions.assign')">
          <VBtn variant="elevated" color="primary" @click="verifying = true" :loading="loading">
            Assign Permission(s)
          </VBtn>
        </VCol>
      </VRow>
    </VCardText>

    <VCardText class="px-0 pb-0">
      <VTable class="text-no-wrap border-t-sm" :height="paginatedPer.length > 10 ? '560px' : '100%'" fixed-header>
        <thead>
          <tr>
            <th><VCheckbox v-model="isCheckedAll" /></th>
            <th>#</th>
            <th>Permission</th>
            <th>Group</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(per, index) in paginatedPer" :key="per.id">
            <td><VCheckbox :value="per.id" v-model="selectedPermissions" /></td>
            <td>{{ startIndex + index + 1 }}</td>
            <td class="text-wrap">{{ per.permission_name }}</td>
            <td>{{ per.group_name }}</td>
          </tr>
          <tr v-if="paginatedPer.length === 0">
            <td colspan="4" class="text-center">No permissions found.</td>
          </tr>
        </tbody>
      </VTable>
    </VCardText>

    <!-- <VCardText class="pt-0">
      <div class="d-flex justify-space-between align-center flex-wrap">
        <div class="fs-14 text-medium-emphasis">
          Showing
          <strong>{{ paginatedPer.length > 0 ? startIndex + 1 : 0 }}</strong>
          to
          <strong>{{ endIndex }}</strong>
          of
          <strong>{{ filteredPermissions.length }}</strong>
          entries
        </div>
        <VPagination v-model="options.page" :length="totalPages" :total-visible="5" />
      </div>
    </VCardText> -->
  </VCard>
  <v-dialog v-model="verifying" max-width="800" transition="scale-transition">
    <v-card>
      <VCardTitle class="d-flex justify-space-between align-center border-b-sm">
       Assign Permission(S)
        <IconBtn @click="verifying = false">
          <VIcon icon="tabler-x" />
        </IconBtn>
      </VCardTitle>
      <VCardText>
        <VForm @submit.prevent="handleAssign()">
          <VRow>
            <VCol cols="12">
              <span class="fs-16 text-color">Updating permissions will force logout the selected user from all sessions. Do you want to continue? </span>
            </VCol>
            <VCol class="text-end d-flex gap-3 justify-end">
              <VBtn @click="verifying = false" color="error">No</VBtn>
              <VBtn type="submit" color="success">Yes</VBtn>
            </VCol>
          </VRow>
        </VForm>
      </VCardText>
    </v-card>
  </v-dialog>
</template>
