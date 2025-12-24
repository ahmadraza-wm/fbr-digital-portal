<script setup>
import { useFreeFeeTransfer } from "@/composables/useFreeFeeTransfer";
import { storeToRefs } from "pinia";
import { computed, onMounted, ref } from "vue";
definePageMeta({
  middleware: "auth",
  permission: "fee_free_transfers.index"
})
const permissionStore = usePermissionStore()

const countryCurrencyStore = useCountryCurrencyStore();
const { sending_countries, receiving_countries } =
  storeToRefs(countryCurrencyStore);

const { headers, deleteBank, createFreeFeeTransfer, bankList, fetchBanks,pagination } =
  useFreeFeeTransfer();

  const { pageNo, itemsPerPage, updateItemsPerPage, loadPage } = usePagination(fetchBanks, {
  initialPage: 1,
  initialPerPage: 10,
});


// Filter variables
const customer_id = ref("");
const s_country = ref("all");
const r_country = ref("all");
const start = ref(null);
const expire = ref(null);


const filters = computed(() => {
  const f = {};
  if (customer_id.value !== "all") f.customer_id = customer_id.value;
  if (s_country.value !== "all") f.sending_country_id = s_country.value;
  if (r_country.value !== "all") f.receiving_country_id = r_country.value;
  if (start.value) f.starts_at = start.value;
  if (expire.value) f.expires_at = expire.value;

  return f;
});

const search = () => {
  fetchBanks({ ...filters.value });
};

const resetFilters = () => {
  customer_id.value = "";
  s_country.value = "all";
  r_country.value = "all";
  start.value = null;
  expire.value = null;
  fetchBanks();
};

const deleteUser = async (id) => {
  await deleteBank(id);
};
</script>

<template>
  <v-card>
    <v-card-title class="border-b-sm">
      <h4 class="text-h5 py-3">Search Free Transfers</h4>
    </v-card-title>
    <v-card-text class="pt-1 my-4 mb-0 pb-5 border-b-sm" v-if="permissionStore.hasPermission('fee_free_transfers.search')">
      <v-row class="ps-0">
        <v-col cols="12" sm="6" md="3">
          <span class="fs-15 label-color font-weight-medium">Customer Id</span>
          <AppTextField name="customer_id" v-model="customer_id" placeholder="Customer Id" autocomplete="off"/>
        </v-col>
        <v-col cols="12" sm="6" md="3">
          <span class="fs-15 label-color font-weight-medium">Sending Country</span>
          <AppAutocomplete :items="sending_countries" item-title="name" item-value="id" v-model="s_country"
            placeholder="Select country" />
        </v-col>
        <v-col cols="12" sm="6" md="3">
          <span class="fs-15 label-color font-weight-medium">Receiving Country</span>
          <AppAutocomplete :items="receiving_countries" item-title="name" item-value="id" v-model="r_country"
            placeholder="Select country" />
        </v-col>
        <v-col cols="12" sm="6" md="3">
          <span class="fs-15 label-color font-weight-medium">Start At</span>
          <AppDateTimePicker name="start" v-model="start" placeholder="dd/mm/yyyy" :config="{ dateFormat: 'd-m-Y' }" />
        </v-col>
        <v-col cols="12" sm="6" md="3">
          <span class="fs-15 label-color font-weight-medium">Expire At</span>
          <AppDateTimePicker name="expire" v-model="expire" placeholder="dd/mm/yyyy"
            :config="{ dateFormat: 'd-m-Y' }" />
        </v-col>
        <v-col cols="12 d-flex gap-2 align-end justify-start" sm="6" md="3">
          <VBtn @click="search" type="submit" class="login-btn" variant="tonal">
            search
          </VBtn>
          <VBtn @click="resetFilters" type="reset" color="secondary" variant="tonal">
            Reset
          </VBtn>
        </v-col>
      </v-row>
    </v-card-text>
    <VCardText class="flex-wrap gap-4 d-flex justify-space-between align-center pb-2">
      <div class="me-3 d-flex gap-3 pt-6">
        <ItemsPerPageSelector
          v-model="itemsPerPage"
          @update:model-value="updateItemsPerPage"
        />
      </div>
      <div class="gap-3 pt-3" v-if="permissionStore.hasPermission('fee_free_transfers.store')">
        <VBtn variant="elevated" color="primary" to="/promotions/free-fee-transfer/add-transfer">
          Add Fee Free Transfers
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
          <div style="display: flex; align-items: center;">
            <VChip :style="{
              backgroundColor: item.status == 'active' ? '#28C76F29' : '#FE5F574F',
              color: item.status == 'active' ? '#28C76F' : '#FE5F57',

              marginTop: '2px',
            }" class="font-weight-light fs-12 p-1" size="small">
              {{ item.status == 'active' ? "Active" : "Expired" }}
            </VChip>

          </div>
        </template>
        <template #item.customer="{ item }">
          <div class="fs-13 text-wrap">
            {{ item.customer?.user?.name || '--' }}
          </div>
        </template>
        <template #item.sending_country="{ item }">
          <div class="fs-13 text-wrap">
            {{ item.sending_country || '--' }}
          </div>
        </template>
         <template #item.receiving_country="{ item }">
          <div class="fs-13 text-wrap">
            {{ item.receiving_country || '--' }}
          </div>
        </template>
        <template #item.action="{ item }">
          <div class="d-flex gap-1">
            <VBtn icon variant="text" color="medium-emphasis"
              :to="`/promotions/free-fee-transfer/edit-transfer/${item.id}`">
              <VIcon icon="tabler-edit" v-if="permissionStore.hasPermission('fee_free_transfers.update')"/>
            </VBtn>
            <VBtn icon variant="text" color="medium-emphasis" to="/promotions/free-fee-transfer/transfers-details">
              <VIcon icon="tabler-eye" />
            </VBtn>
            <IconBtn @click="deleteUser(item.id)" class="d-none">
              <VIcon icon="tabler-trash" />
            </IconBtn>
          </div>
        </template>
      </VDatableComponent>
    </VCardText>
  </v-card>
</template>
