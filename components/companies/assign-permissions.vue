<script setup>
import { ref, computed, onMounted } from 'vue'
import useUiFeedback from "@/composables/useUiFeedback";
import { useNuxtApp } from "#app";
const verifying = ref(false);
const permissionStore = usePermissionStore()
const { $axios } = useNuxtApp();
const emit = defineEmits(['permissions-updated'])
const searchTerm = ref('')
const selectedPermissions = ref([])
const options = ref({
  page: 1,
  itemsPerPage: -1,
})

import { useCompanies } from "@/composables/useCompanies";
const { unassignPermissionsByUserId } = useCompanies();

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
   user_permissions: null
});
const userId = computed(() => props.userId)

const permissionHeaders = [
  { title: '', key: 'select' },
  { title: '#', key: 'sr_no' },
  { title: 'Permission', key: 'display_name' },
  { title: 'Group', key: 'group_name' },
];


const assign_per = computed(() => props.user_permissions || [])

const filteredPermissions = computed(() => {
  if (!searchTerm.value) return assign_per.value
  const term = searchTerm.value.toLowerCase()
  return assign_per.value.filter(item =>
    item.display_name.toLowerCase().includes(term) ||
    item.group_name.toLowerCase().includes(term)
  )
})

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

const handleRevoke = async() => {
  if (selectedPermissions.value.length === 0) {
    showError('Please select at least one permission.')
    return
  }

  await unassignPermissionsByUserId(userId.value, selectedPermissions.value);
  selectedPermissions.value = []
  emit('permissions-updated')
  verifying.value = false;
  verifying.value = false;
}
</script>

<template>
  <VCard class="mb-4">
    <v-card-title class="border-b-sm bg-secondary">
      <h4 class="text-h5 py-3 text-white">Assigned Permissions</h4>
    </v-card-title>
    <VCardText class="px-4 pt-4 pb-4">
      <VRow>
        <VCol cols="12">
          <p class="font-weight-medium text-color mb-0 lh-22">Search</p>
          <v-text-field v-model="searchTerm" clearable outlined dense
            placeholder="Enter 2 character to search Permission" />
        </VCol>
        <VCol cols="12" class="d-flex justify-end">
          <VBtn variant="elevated" color="error" @click="verifying = true" :loading="loading" v-if="permissionStore.hasPermission('user_permissions.revoke')">
            Unassign Permission(s)
          </VBtn>
        </VCol>
      </VRow>
    </VCardText>
    <VCardText class="px-0 pb-0">
      <v-data-table :headers="permissionHeaders" :items="paginatedPer" item-key="id"
        :height="paginatedPer.length > 10 ? '560px' : '100%'" fixed-header hide-default-footer
        class="text-no-wrap border-t-sm">
        <template #header.select>
          <VCheckbox v-model="isCheckedAll" />
        </template>
        <!-- Checkbox column -->
        <template #item.select="{ item }">
          <VCheckbox :value="item.id" v-model="selectedPermissions" />
        </template>

        <!-- Serial number column -->
        <template #item.sr_no="{ index }">
          {{ startIndex + index + 1 }}
        </template>

        <!-- Permission name column -->
        <template #item.permission_name="{ item }">
          <span class="text-wrap">{{ item.permission_name }}</span>
        </template>

        <!-- Group column -->
        <template #item.group_name="{ item }">
          <span class="text-wrap text-capitalize">{{ item.group_name }}</span>
        </template>

        <!-- Empty state -->
        <template #no-data>
            <span class="text-center">No permissions found.</span>
        </template>
      </v-data-table>

    </VCardText>
  </VCard>
  <v-dialog v-model="verifying" max-width="500" transition="scale-transition">
    <v-card>
      <VCardTitle class="d-flex justify-space-between align-center border-b-sm bg-primary">
        Unassign Permission(S)
        <IconBtn @click="verifying = false">
          <VIcon icon="tabler-x" />
        </IconBtn>
      </VCardTitle>
      <VCardText class="px-3 pb-4 pt-3">
        <VForm @submit.prevent="handleRevoke()">
          <VRow>
            <VCol cols="12 border-b-sm">
              <span class="fs-16 text-error font-weight-bold">Do you want to continue?</span>
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
