<script setup>
definePageMeta({
  middleware: "auth",
  permission: "partners.list"
})
import { usePartners } from '@/composables/usePartners';
const { fetchPartners, deletePartner, PartnersList, loading } = usePartners();
const permissionStore = usePermissionStore()
const options = ref({
  page: 1,
  itemsPerPage: 50,
  sortBy: [""],
  sortDesc: [false],
});

const headers = computed(() => {
  const baseheaders = [
    { title: "#", key: "sr_no" },
    { title: "Name", key: "name" },
    { title: "Prefix", key: "prefix" },
    { title: "Type", key: "partner_type" },
    { title: "country", key: "country" },
    { title: "status", key: "status" },
    { title: "Created At", key: "created_at" },
    { title: "Action", key: "action" }
  ]

  return baseheaders
});
const formatDate = (date) => {
  if (!date) return '---'

  const d = new Date(date)
  if (isNaN(d)) return '---'

  return d.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

onMounted(async () => {
  fetchPartners();
});
</script>
<template>
  <v-card>
    <v-row>
      <v-col cols="12">
        <v-card-title class="border-b-sm bg-primary">
          <h4 class="text-h5 py-3 text-white">Partners</h4>
        </v-card-title>
      </v-col>
    </v-row>
    <VCardText class="flex-wrap gap-4 d-flex justify-space-between align-center border-t-sm">
      <div class="me-3 d-flex gap-3">
        <span class="fs-16 pt-2">Show</span>
        <AppAutocomplete v-model="options.itemsPerPage" :items="[
          { value: -1, title: 'All' },
          { value: 50, title: '50' },
          { value: 100, title: '100' },
        ]" style="inline-size: 6.25rem;" @update:model-value="itemsPerPage = parseInt($event, 10)" />
      </div>
    </VCardText>

    <VCardText class="px-0">
      <PaginatedDataTable :headers="headers" :items="PartnersList" :options="options" :loading="loading"
        :search="search" @update:options="options = $event">
        <template #item.country="{ item }">
          {{ item.country?.name }}
        </template>
        <template #item.status="{ item }">
          <div>
            <VChip :color="item.status ? 'success' : 'error'" class="font-weight-light p-1" size="small"
              variant="elevated">
              {{ item.status ? 'Active' : 'Inactive' }}
            </VChip>
          </div>
        </template>
        <template #item.created_at="{ item }">
          {{ formatDate(item.created_at) }}
        </template>
        <template #item.action="{ item }">
          <div class="d-flex gap-1">
            <VBtn icon variant="text" :to="`/partners/view/${item.id}`" color="medium-emphasis"
              v-if="permissionStore.hasPermission('partners.show')">
              <VIcon icon="tabler-eye" />
            </VBtn>
            <VBtn icon variant="text" color="medium-emphasis">
              <VIcon icon="tabler-dots-vertical" />
              <VMenu activator="parent">
                <VList>
                  <VListItem :to="`/partners/edit/${item.id}`" v-if="permissionStore.hasPermission('partners.update')">
                    <VListItemTitle>Edit</VListItemTitle>
                  </VListItem>
                </VList>
              </VMenu>
            </VBtn>
            <VBtn icon variant="text" color="medium-emphasis" @click="deletePartner(item.id)"
              v-if="permissionStore.hasPermission('partners.delete')">
              <VIcon icon="tabler-trash" color="error" />
            </VBtn>
          </div>
        </template>
        <template #bottom>
          <VCardText class="pt-2 pb-0 border-t-sm">
            <div class="d-flex flex-wrap justify-space-between align-center gap-y-2 mt-2">
              <span class="text-caption text-muted">
                Showing
                {{ (options.page - 1) * options.itemsPerPage + 1 }}
                to
                {{ Math.min(options.page * options.itemsPerPage, PartnersList.length) }}
                of {{ PartnersList.length }} entries
              </span>
              <VPagination v-model="options.page" :total-visible="$vuetify.display.smAndDown ? 3 : 5"
                :length="Math.ceil(PartnersList.length / options.itemsPerPage)" />
            </div>
          </VCardText>
        </template>
      </PaginatedDataTable>
    </VCardText>
  </v-card>
</template>
