<script setup>
import { useOnlinePromotions } from "@/composables/useOnlinePromotions";
const countryCurrencyStore = useCountryCurrencyStore();
const { countries } = storeToRefs(countryCurrencyStore);
definePageMeta({
  middleware: "auth",
  permission: "promotions.index"
})
const permissionStore = usePermissionStore()

const {
  typeItem,
  agents,
  headers,
  statusItem,
  deleteBank,
  createOnlinePromotion,
  bankList,
  fetchBanks,
  pagination,
} = useOnlinePromotions();

const { pageNo, itemsPerPage, updateItemsPerPage, loadPage } = usePagination(fetchBanks, {
  initialPage: 1,
  initialPerPage: 10,
});

const country = ref("all");
const status = ref("all");

const userList = ref([]);


const filters = computed(() => {
  const f = {};

  if (country.value !== "all") f.country_id = country.value;
  if (status.value !== "all") f.status = status.value;

  return f;
});

const search = () => {
  fetchBanks({ ...filters.value });
};

const resetFilters = () => {
  country.value = "all";
  status.value = "all";
  fetchBanks();
};

onMounted(() => {
  fetchBanks();
});
const deleteUser = async (id) => {
  await deleteBank(id);
};

const openImage = (item) => {
 const imageUrl = item.documents?.[0]?.media?.[0]?.url;
  if (imageUrl) {
    window.open(imageUrl, "_blank");
  } else {
    showError("No image attached to this promotion.");
  }
};
</script>
<template>
  <v-card>

    <v-card-title class="border-b-sm">
      <h4 class="text-h5 py-3">Search Promotions</h4>
    </v-card-title>
    <v-card-text class="pt-1 border-b-sm my-4 mb-0 pb-5" v-if="permissionStore.hasPermission('promotions.search')">
      <v-row class="ps-0">
        <v-col cols="12" sm="6" md="4">
          <span class="fs-15 label-color font-weight-medium">Country</span>
          <AppAutocomplete
            :items="countries"
            item-title="name"
            item-value="id"
            v-model="country"
            placeholder="Select country"
          />
        </v-col>
        <v-col cols="12" sm="6" md="4">
          <span class="fs-15 label-color font-weight-medium">Status</span>
          <AppAutocomplete :items="statusItem" placeholder="All" v-model="status" />
        </v-col>
        <v-col cols="12 d-flex gap-2 align-end justify-start" sm="6" md="4">
          <VBtn @click="search" type="submit" class="login-btn" variant="tonal">
            search
          </VBtn>
          <VBtn @click="resetFilters" type="reset" color="secondary" variant="tonal">
            Reset
          </VBtn>
        </v-col>
      </v-row>
    </v-card-text>
    <VCardText
      class="flex-wrap gap-4 d-flex justify-space-between align-center pb-2"
    >
      <div class="me-3 d-flex gap-3 pt-6">
        <ItemsPerPageSelector
          v-model="itemsPerPage"
          @update:model-value="updateItemsPerPage"
        />
      </div>
      <div class="gap-3 pt-3" v-if="permissionStore.hasPermission('promotions.store')">
        <VBtn
          variant="elevated"
          color="primary"
          to="/promotions/online-promotions/add-promotions"
        >
          Add Promotions
        </VBtn>
      </div>
    </VCardText>

    <VCardText class="px-0 border-t-sm">
      <VDatableComponent
        :headers="headers"
        :items="bankList"
        :loading="loading"
        :search="filters.name"
        :pagination="pagination"
        :pageNo="pageNo"
        @update:pageNo="pageNo = $event"
      >
        <template #item.status="{ item }">
          <div style="display: flex; align-items: center">
            <VChip
              :style="{
                backgroundColor: item.status == 'active' ? '#28C76F29' : '#FE5F574F',
                color: item.status == 'active' ? '#28C76F' : '#FE5F57',

                marginTop: '2px',
              }"
              class="font-weight-light fs-12 p-1"
              size="small"
            >
              {{ item.status == "active" ? "Active" : "Expired" }}
            </VChip>
          </div>
        </template>
        <template #item.channel="{ item }">
          <VChip
            :style="{
              backgroundColor: item.status == 1 ? '#28C76F29' : '#FFEAD4',
              color: item.status == 1 ? '#28C76F' : '#FFA44D',

              marginTop: '2px',
            }"
            class="font-weight-light fs-12 p-1"
            size="small"
          >
            {{ item.status == 1 ? "Online" : "Agent" }}
          </VChip>
        </template>
        <template #item.action="{ item }">
          <div class="d-flex gap-1">
            <VBtn icon variant="text" color="medium-emphasis" @click="openImage(item)">
              <VIcon icon="tabler-eye" />
            </VBtn>
            <NuxtLink
              :to="`/promotions/online-promotions/edit-promotions/${item.id}`"
              class="menu-link"
            >
              <VBtn icon variant="text" color="medium-emphasis">
                <VIcon icon="tabler-edit" v-if="permissionStore.hasPermission('promotions.update')"/>
              </VBtn>
            </NuxtLink>

            <IconBtn @click="deleteUser(item.id)" class="d-none">
              <VIcon icon="tabler-trash" />
            </IconBtn>
          </div>
        </template>
      </VDatableComponent>
    </VCardText>
  </v-card>
</template>
