<script setup>
import { useThreshold } from "@/composables/useThreshold";
import data from "@/views/demos/forms/tables/data-table/datatable";
import { ref } from "vue";
const countryCurrencyStore = useCountryCurrencyStore();
const { sending_countries, receiving_countries } =
  storeToRefs(countryCurrencyStore);
definePageMeta({
  middleware: "auth",
  permission: "thresholds.index"
})
const permissionStore = usePermissionStore()
const userList = ref([]);

const filters = ref({
  name: "",
  sending_country_id: "",
  receiving_country_id: "",
});

const {
  fetchThreshold,
  deleteThreshold,
  thresholdlists,
  loading,
  filterThreshold,
  pagination,
} = useThreshold();

const { pageNo, itemsPerPage, updateItemsPerPage, loadPage } = usePagination(
  filterThreshold,
  {
    initialPage: 1,
    initialPerPage: 10,
  }
);

const resetFilters = () => {
  filters.value = {
    name: "",
    sending_country_id: "",
    receiving_country_id: "",
  };
  fetchThreshold();
};

const confirmDelete = (id) => {
  deleteThreshold(id);
};

const submitFilter = () => {
  filterThreshold(filters.value);
};

const country = ref([
  { title: "Pakistan", value: "Pakistan" },
  { title: "UK", value: "UK" },
  { title: "USA", value: "USA" },
]);

const headers = [
  {
    title: "#",
    key: "sr_no",
  },
  {
    title: "Name",
    key: "name",
  },
  {
    title: "Channel",
    key: "channel",
  },
  {
    title: "Sending Country",
    key: "sendingcountry",
  },

  {
    title: "Action",
    key: "action",
  },
];

const resolveStatusVariant = (status) => {
  if (status === 1)
    return {
      color: "primary",
      text: "Current",
    };
  else if (status === 2)
    return {
      color: "success",
      text: "Professional",
    };
  else if (status === 3)
    return {
      color: "error",
      text: "Rejected",
    };
  else if (status === 4)
    return {
      color: "warning",
      text: "Resigned",
    };
  else
    return {
      color: "info",
      text: "Applied",
    };
};

onMounted(() => {
  userList.value = JSON.parse(JSON.stringify(data));
  fetchThreshold();
});
</script>

<template>
  <v-card class="mt-5">
    <v-row>
      <v-col cols="12">
        <v-card-title class="border-b-sm py-0">
          <h4 class="text-h5 py-6 mb-0">Compliance Threshold</h4>
        </v-card-title>
      </v-col>
    </v-row>

    <v-card-text class="border-b-sm">
      <VForm @submit.prevent="submitFilter">
        <VRow>
          <VCol cols="10">
            <VRow>
              <VCol cols="4">
                <span class="fs-14 label-color font-weight-regular">Name</span>
                <AppTextField
                  name="name"
                  placeholder="Name"
                  v-model="filters.name"
                  autocomplete="off"
                />
              </VCol>

              <VCol cols="4">
                <span class="fs-14 label-color font-weight-regular"
                  >Sending Country</span
                >
                <AppAutocomplete
                  v-model="filters.sending_country_id"
                  :items="sending_countries"
                  name="country"
                  item-title="name"
                  item-value="id"
                  placeholder="Sending Country"
                  autocomplete="off"
                />
              </VCol>
              <VCol cols="4">
                <span class="fs-14 label-color font-weight-regular"
                  >Receiving Country</span
                >
                <AppAutocomplete
                  v-model="filters.receiving_country_id"
                  :items="receiving_countries"
                  item-title="name"
                  item-value="id"
                  name="country"
                  placeholder="Receiving Country"
                  autocomplete="off"
                />
              </VCol>
            </VRow>
          </VCol>
          <VCol cols="2" class="d-flex align-end">
            <div class="d-flex align-center justify-center align-center gap-2">
              <VBtn class="login-btn" variant="tonal" type="submit"
                >Search</VBtn
              >
              <VBtn
                color="secondary"
                type="reset"
                variant="tonal"
                @click="resetFilters"
                >Reset</VBtn
              >
            </div>
          </VCol>
        </VRow>
      </VForm>
    </v-card-text>
    <VCardText class="d-flex flex-wrap gap-4 justify-between mt-6 pb-2">
      <div class="me-3 d-flex gap-3">
        <ItemsPerPageSelector
          v-model="itemsPerPage"
          @update:model-value="updateItemsPerPage"
        />
      </div>
      <VSpacer />
      <VBtn
        color="primary"
        variant="elevated"
        prepend-icon="tabler-plus"
        :to="'threshold/add'" v-if="permissionStore.hasPermission('thresholds.store')"
        >Add Threshold</VBtn
      >
    </VCardText>

    <VCardText class="px-0 border-t">
      <VDatableComponent
        :headers="headers"
        :items="thresholdlists"
        :loading="loading"
        :search="search"
        :pagination="pagination"
        :pageNo="pageNo"
        @update:pageNo="pageNo = $event"
      >
        <template #item.name="{ item }">
          <div>{{ item.name }}</div>
        </template>

        <template #item.channel="{ item }">
          <div>
            {{ item.channel }}
          </div>
        </template>

        <template #item.sendingcountry="{ item }">
          <div>
            {{ item.sending_country }}
          </div>
        </template>
        <!-- Actions -->
        <template #item.action="{ item }">
          <IconBtn class="text-color d-none" @click="confirmDelete(item.id)">
            <NuxtLink class="menu-link">
              <VIcon icon="tabler-trash" />
            </NuxtLink>
          </IconBtn>
          <IconBtn class="text-color">
            <NuxtLink class="menu-link" :to="`threshold/edit/${item.id}`" v-if="permissionStore.hasPermission('thresholds.update')">
              <VIcon icon="tabler-edit" />
            </NuxtLink>
          </IconBtn>
        </template>
      </VDatableComponent>
    </VCardText>
  </v-card>
</template>
