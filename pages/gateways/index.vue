<script setup>
import { useGateway } from "@/composables/useGateway";
import { onMounted, ref } from "vue";
const countryCurrencyStore = useCountryCurrencyStore();
const { countries, currencies } = storeToRefs(countryCurrencyStore);
definePageMeta({
  middleware: "auth",
  permission: "gateways.index"
})
const permissionStore = usePermissionStore()
const {
  gatewaysList,
  fetchGateways,
  loading,
  loadingMessage,
  errorMessage,
  headers,
  gatewayRequirements,
  resolveStatusVariant,
  statuses,
  pagination,
} = useGateway();

const { pageNo, itemsPerPage, updateItemsPerPage, loadPage } = usePagination(
  fetchGateways,
  {
    initialPage: 1,
    initialPerPage: 10,
  }
);

const filters = ref({
  gateway_id: "",
  sending_country_id: "",
  sending_method_id: "",
  status: "",
});


const search = () => {
  const plainFilters = { ...filters.value };
  fetchGateways(plainFilters);
};

const resetFilters = () => {
  filters.value = {
    gateway_id: "",
    sending_country_id: "",
    sending_method_id: "",
    status: "",
  };
  fetchGateways();
};

definePageMeta({
  middleware: "auth",
});
</script>

<template>
  <v-card>
    <v-row>
      <v-col cols="12">
        <v-card-title class="border-b-sm">
          <h4 class="text-h5 py-3">Search Gateways</h4>
        </v-card-title>
      </v-col>
    </v-row>

    <v-card-text class="pt-1 my-4 pb-3">
      <v-row class="ps-0">
        <v-col cols="12" sm="6" md="3">
          <span class="fs-15 label-color font-weight-medium">Gateway</span>

          <AppAutocomplete v-model="filters.gateway_id" name="gateway_id" :items="gatewayRequirements.gateways || []"
            item-title="text" item-value="value" placeholder="Select Gateway" />
        </v-col>
        <v-col cols="12" sm="6" md="3">
          <span class="fs-16 label-color font-weight-medium">Sending Country</span>
          <AppAutocomplete v-model="filters.sending_country_id" name="sending_country_id"
            :items="gatewayRequirements.sending_countries || []" item-title="text" item-value="value"
            placeholder="Select Sending Country" />
        </v-col>
        <VCol cols="12" sm="6" md="3">
          <span class="fs-16 label-color font-weight-medium">Sending Method</span>
          <AppAutocomplete v-model="filters.sending_method_id" name="sending_method_id"
            :items="gatewayRequirements.sending_methods || []" item-title="text" item-value="value"
            placeholder="Select Sending Method" />
        </VCol>
        <VCol cols="12" sm="6" md="3">
          <span class="fs-16 label-color font-weight-medium">Status</span>
          <AppAutocomplete v-model="filters.status" name="selestatusctedStatus" :items="statuses" item-title="text"
            item-value="value" placeholder="Select Status" />
        </VCol>

        <v-col cols="12 d-flex gap-2 align-end" sm="10" md="2">
          <VBtn @click="search" variant="tonal" class="login-btn">Search</VBtn>
          <VBtn @click="resetFilters" variant="tonal"  color="secondary"
            >Reset</VBtn
          >
        </v-col>
      </v-row>
    </v-card-text>
    <v-divider></v-divider>
    <VCardText class="d-flex flex-wrap gap-4 pb-2">
      <div class="me-3 d-flex gap-3">
         <ItemsPerPageSelector
          v-model="itemsPerPage"
          @update:model-value="updateItemsPerPage"
        />
      </div>
      <VSpacer />

      <!-- 👉 Add user button -->
      <VBtn
        color="primary"
        variant="elevated"
        prepend-icon="tabler-plus"
        to="/gateways/add-gateway" v-if="permissionStore.hasPermission('gateways.store')"
      >
        Add New Gateway
      </VBtn>
    </VCardText>

    <VCardText class="px-0 border-t-sm">
      <VDatableComponent
        :headers="headers"
        :items="gatewaysList"
        :loading="loading"
        :search="search"
        :pagination="pagination"
        :pageNo="pageNo"
        @update:pageNo="pageNo = $event"
      >
        <!-- Forward the custom slot templates -->
        <template #item.status="{ item }">
          <VChip
            :color="resolveStatusVariant(item.status).color"
            class="font-weight-medium"
            size="small"
          >
            {{ resolveStatusVariant(item.status).text }}
          </VChip>
        </template>

        <template #item.action="{ item }"  v-if="permissionStore.hasPermission('gateways.update')">
          <div class="d-flex gap-1">
            <IconBtn>
              <NuxtLink :to="`/gateways/edit-gateway/${item.id}`" :data="item">
                <VIcon icon="tabler-edit" />
              </NuxtLink>
            </IconBtn>
          </div>
        </template>
      </VDatableComponent>
    </VCardText>
  </v-card>
</template>
