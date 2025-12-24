<script setup>
import { useUsers } from "@/composables/useUsers";
import data from "@/views/demos/forms/tables/data-table/datatable";
const permissionStore = usePermissionStore()
definePageMeta({
  middleware: "auth",
  permission: "backofficeuser.index"
})
const userList = ref([]);

const options = ref({
  page: 1,
  itemsPerPage: 5,
  sortBy: [""],
  sortDesc: [false],
});

const {
  users,
  loading,
  filterUserlist,
  fetchUsers,
  filters,
  resetFilters,
  pagination,
} = useUsers();

const { pageNo, itemsPerPage, updateItemsPerPage, loadPage } = usePagination(
  fetchUsers,
  {
    initialPage: 1,
    initialPerPage: 10,
  }
);

const search = () => {
  const plainFilters = {
    ...filters.value,
    status: filters.value.status === "all" ? "" : filters.value.status,
  };

  filterUserlist(plainFilters);
};

const statusItem = ref([
  { title: "All", value: "all" },
  { title: "Active", value: 1 },
  { title: "Inactive", value: 0 },
]);

const headers = computed(() => {
  const baseHeaders = [
    { title: "#", key: "sr_no" },
    { title: "Name", key: "name" },
    { title: "Email", key: "email" },
    { title: "Status", key: "status" },
    { title: "Created At", key: "created_at" },
  ];
  if (permissionStore.hasPermission("backofficeuser.show")) {
    baseHeaders.push({ title: "ACTION", key: "action" });
  }
  return baseHeaders;
});
</script>
<template>
  <v-card>
        <v-card-title class="border-b-sm mb-3">
          <h4 class="text-h5 py-3">Search User</h4>
        </v-card-title>
    <v-card-text class="pt-1 my-4 pb-6 border-b-sm" v-if="permissionStore.hasPermission('backofficeuser.search')">
      <v-row class="ps-0">
        <v-col cols="12" sm="6" md="3">
          <span class="fs-15 label-color font-weight-medium">Name</span>
          <AppTextField
            name="name"
            v-model="filters.name"
            placeholder="Name"
            autocomplete="off"
          />
        </v-col>
        <v-col cols="12" sm="6" md="3">
          <span class="fs-15 label-color font-weight-medium">Email</span>
          <AppTextField
            name="email"
            v-model="filters.email"
            placeholder="Email"
            autocomplete="off"
          />
        </v-col>
        <v-col cols="12" sm="6" md="3">
          <span class="fs-15 label-color font-weight-medium">Status</span>
          <AppAutocomplete
            :items="statusItem"
            placeholder="All"
            v-model="filters.status"
          />
        </v-col>
        <v-col cols="12 d-flex gap-2 align-end justify-start" sm="6" md="3">
          <VBtn @click="search" type="submit" class="login-btn" variant="tonal">
            search
          </VBtn>
          <VBtn
            @click="resetFilters"
            type="reset"
            color="secondary"
            variant="tonal"
          >
            Reset
          </VBtn>
        </v-col>
      </v-row>
    </v-card-text>
    <VCardText
      class="flex-wrap gap-4 d-flex justify-space-between align-center border-b-sm pb-3"
    >
      <div class="me-3 d-flex gap-3 pt-3">
        <ItemsPerPageSelector
          v-model="itemsPerPage"
          @update:model-value="updateItemsPerPage"
        />
      </div>
      <div class="gap-3 pt-0">
        <VBtn variant="elevated" color="primary" to="/users/add-user" v-if="permissionStore.hasPermission('register.backoffice.user')">
          Add User
        </VBtn>
      </div>
    </VCardText>

    <VCardText class="px-0">
      <VDatableComponent
        :headers="headers"
        :items="users"
        :loading="loading"
        :search="search"
        :pagination="pagination"
        :pageNo="pageNo"
        @update:pageNo="pageNo = $event"
      >
        <template #item.name="{ item }">
          <div class="fs-13">{{ item.user?.name }}</div>
        </template>
        <template #item.email="{ item }">
          <div class="fs-13">{{ item.user?.email }}</div>
        </template>
        <template #item.status="{ item }">
          <div style="display: flex; align-items: center">
            <VChip
              :style="{
                backgroundColor:
                  item.user?.status == 1 ? '#28C76F29' : '#FE5F574F',
                color: item.user?.status == 1 ? '#28C76F' : '#FE5F57',

                marginTop: '2px',
              }"
              class="font-weight-light fs-12 p-1"
              size="small"
            >
              {{ item.user?.status == 1 ? "Active" : "In-active" }}
            </VChip>
          </div>
        </template>
        <template #item.created_at="{ item }">
          <div class="fs-13">{{ item.created_at }}</div>
        </template>
        <template #item.action="{ item }">
          <div class="d-flex gap-1">
            <VBtn
              icon
              variant="text"
              color="medium-emphasis"
              :to="`/users/${item.id}`" v-if="permissionStore.hasPermission('backofficeuser.show')"
            >
              <VIcon icon="tabler-eye" />
            </VBtn>
          </div>
        </template>
      </VDatableComponent>
    </VCardText>
  </v-card>
</template>
