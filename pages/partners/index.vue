<script setup>
import ItemsPerPageSelector from "@/components/ItemsPerPageSelector.vue";
import { usePartners } from "@/composables/usePartners";
import { ref } from "vue";
definePageMeta({
  middleware: "auth",
  permission: "partners.index"
})
const permissionStore = usePermissionStore()
const countryCurrencyStore = useCountryCurrencyStore();
const { countries, currencies } = storeToRefs(countryCurrencyStore);

const {
  partners,
  fetchPartners,
  headers,
  resolveStatusVariant,
  deletePartner,
  pagination
} = usePartners();

const { pageNo, itemsPerPage, updateItemsPerPage, loadPage } = usePagination(
  fetchPartners,
  {
    initialPage: 1,
    initialPerPage: 10,
  },
);

const filters = ref({
  name: "",
  username: "",
  currency_id: "",
  country_id: "",
});

const deleteUser = async (id) => {
  await deletePartner(id);
};

// Fetch on mount

const search = () => {
  fetchPartners(filters.value);
};

const resetFilters = () => {
  filters.value = { name: "", username: "", currency_id: "", country_id: "" };
  fetchPartners();
};
const options = ref({
  itemsPerPage: 5,
  page: 1,
});
definePageMeta({
  middleware: "auth",
});

const router = useRouter();
function goToCreatePartner() {
  router.push({
    path: '/partners/create-partner',
    state: { partnerList: true }
  });
}

</script>

<template>
  <v-card>
    <v-card-title>
      <h4 class="text-h5 py-3">Partner List</h4>
    </v-card-title>

    <v-divider></v-divider>

    <v-card-text class="pt-1 my-4 pb-3">
      <v-row class="ps-0">
        <v-col cols="12" sm="10" md="10" class="ps-1">
          <v-row>
            <v-col cols="12" sm="6" md="3">
              <span class="fs-16 label-color">Name</span>
              <AppTextField v-model="filters.name" name="name" placeholder="Name" />
            </v-col>
            <v-col cols="12" sm="6" md="3">
              <span class="fs-16 label-color">Username</span>
              <AppTextField v-model="filters.username" name="username" placeholder="Username" />
            </v-col>
            <v-col cols="12" sm="6" md="3">
              <span class="fs-16 label-color">Settlement Currency</span>
              <AppAutocomplete v-model="filters.currency_id" :items="currencies" :item-title="(item) => {
                const n = item?.code ?? '';
                const m = item?.name ?? '';
                return n && m ? `${n} - ${m}` : n || m;
              }" item-value="id" placeholder="Select Currency">
                <template #item="{ item, props, selected }">
                  <div v-bind="props" class="px-3 py-1 mb-2" :class="selected ? 'bg-primary text-white' : 'text-body'"
                    style="border-radius: 4px;">
                    {{ item?.code || item?.raw?.code }} - <b class="bg-primary px-1 py-1 rounded">{{ item?.name ||
                      item?.raw?.name }}</b>
                  </div>
                </template>

                <template #selection="{ item }">
                  <span v-if="item">
                    {{ item?.code || item?.raw?.code }} - <b class="text-primary">{{ item?.name || item?.raw?.name
                      }}</b>
                  </span>
                  <span v-else>Select base currency</span>
                </template>
              </AppAutocomplete>
            </v-col>
            <v-col cols="12" sm="6" md="3">
              <span class="fs-16 label-color">Country</span>
              <AppAutocomplete v-model="filters.country_id" :items="countries" item-title="name" item-value="id"
                placeholder="Select Country" />
            </v-col>
          </v-row>
        </v-col>
        <v-col cols="12 d-flex gap-2 align-end" sm="10" md="2">
          <VBtn @click="search" variant="tonal" class="login-btn">Search</VBtn>
          <VBtn @click="resetFilters" variant="tonal" color="secondary">Reset</VBtn>
        </v-col>
      </v-row>
    </v-card-text>

    <VCardText class="d-flex justify-space-between gap-4 border-t-sm pb-2">
      <div class="me-3 d-flex gap-3 pt-5">
        <ItemsPerPageSelector v-model="itemsPerPage" @update:model-value="updateItemsPerPage" />
      </div>
      <VBtn color="primary" class="mt-5" variant="elevated" @click="goToCreatePartner"
        v-if="permissionStore.hasPermission('partners.store')">
        Create Partner
      </VBtn>
    </VCardText>

    <v-card-text v-if="loading">Loading partners...</v-card-text>
    <v-card-text v-else-if="error" class="text-error">{{ error }}</v-card-text>
    <v-card-text v-else class="px-0 border-t-sm">
      <VDatableComponent :headers="headers" :items="partners" :loading="loading" :search="filters.name"
        :pagination="pagination" :pageNo="pageNo" @update:pageNo="pageNo = $event">
        <!-- <PaginatedDataTable :headers="headers" :items="partners" :options="options" :loading="loading"
        :search="filters.name" @update:options="(val) => (options = val)"> -->
        <!-- status column -->
        <template #item.status="{ item }">
          <VChip :color="resolveStatusVariant(item.status).color" class="font-weight-medium" size="small">
            {{ resolveStatusVariant(item.status).text }}
          </VChip>
        </template>
        <template #item.type="{ item }">
          <p class="font-weight-medium mb-0 lh-22 text-color text-uppercase">{{ item.type }}</p>
        </template>
        <!-- actions column -->
        <template #item.action="{ item }">
          <div class="d-flex gap-1">
            <IconBtn @click="deleteUser(item.id)" class="d-none">
              <VIcon icon="tabler-trash" />
            </IconBtn>

            <IconBtn>
              <a :href="`/partners/view-partner/${item.id}`" target="_blank" rel="noopener" class="menu-link">
                <VIcon icon="tabler-eye" />
              </a>
            </IconBtn>

            <VBtn icon variant="text" color="medium-emphasis">
              <VMenu>
                <template #activator="{ props }">
                  <VBtn icon variant="text" color="medium-emphasis" v-bind="props">
                    <VIcon icon="tabler-dots-vertical" />
                  </VBtn>
                </template>

                <VList>
                  <VListItem :to="`/partners/edit-partner/${item.id}`"
                    v-if="permissionStore.hasPermission('partners.update')">
                    <VListItemTitle>Edit</VListItemTitle>
                  </VListItem>

                  <VListItem :to="`partners/payer-partner?id=${item.id}`"
                    v-if="permissionStore.hasPermission('partner.payers.list')">
                    <VListItemTitle>Payer</VListItemTitle>
                  </VListItem>
                </VList>
              </VMenu>
            </VBtn>
          </div>
        </template>
      </VDatableComponent>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  methods: {
    editUser(user) {
    },
    deleteUser(id) {
    },
  },
};
</script>
