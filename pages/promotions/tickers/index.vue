<script setup>
import { useTickers } from "@/composables/useTickers";
const countryCurrencyStore = useCountryCurrencyStore();
const { sending_countries, receiving_countries } =
  storeToRefs(countryCurrencyStore);
import AuditLog from '@/components/AuditLog.vue'
definePageMeta({
  middleware: "auth",
  permission: "tickers.index"
})
const permissionStore = usePermissionStore()
const {
  agents,
  deleteBank,
  statusItem,
  fetchBanks,
  bankList,
  channelItem,
  importanceItem,
  headers,
  pagination,
  createTicker,
} = useTickers();


const { pageNo, itemsPerPage, updateItemsPerPage, loadPage } = usePagination(fetchBanks, {
  initialPage: 1,
  initialPerPage: 10,
});

const channel = ref("all");
const s_country = ref("all");
const r_country = ref("all");
const status = ref("all");

const userList = ref([]);

const selectedId = ref(null)

const openAuditLog = (item) => {
  if (selectedId.value === item.id) {
    selectedId.value = null
  } else {
    selectedId.value = item.id
  }
}

const filters = computed(() => {
  const f = {};

  if (channel.value !== "all") f.channel = channel.value;
  if (s_country.value !== "all") f.sending_country_id = s_country.value;
  if (r_country.value !== "all") f.receiving_country_id = r_country.value;
  if (status.value !== "all") f.status = status.value;

  return f;
});

const search = () => {
  console.log('filters', filters.value);
  fetchBanks({ ...filters.value });
};

const resetFilters = () => {
  channel.value = "all";
  s_country.value = "all";
  r_country.value = "all";
  status.value = "all";
  fetchBanks(); // Load all tickers
};
const deleteUser = async (id) => {
  await deleteBank(id);
};
</script>
<template>
  <v-card>
    <v-card-title class="border-b-sm">
      <h4 class="text-h5 py-3">Search Tickers</h4>
    </v-card-title>
    <v-card-text class="pt-1 my-4 mb-0 pb-3 border-b-sm" v-if="permissionStore.hasPermission('tickers.search')">
      <v-row class="ps-0">
        <v-col cols="12" sm="6" md="3">
          <span class="fs-15 label-color font-weight-medium">Channel</span>
          <AppAutocomplete :items="channelItem" placeholder="Select channel" v-model="channel" />
        </v-col>
        <v-col cols="12" sm="6" md="3">
          <span class="fs-15 label-color font-weight-medium">Sending Country</span>
          <AppAutocomplete :items="sending_countries" v-model="s_country" item-title="name" item-value="id"
            placeholder="Select country" />
        </v-col>
        <v-col cols="12" sm="6" md="3">
          <span class="fs-15 label-color font-weight-medium">Receiving Country</span>
          <AppAutocomplete :items="receiving_countries" v-model="r_country" item-title="name" item-value="id"
            placeholder="Select country" />
        </v-col>
        <v-col cols="12" sm="6" md="3">
          <span class="fs-15 label-color font-weight-medium">Status</span>
          <AppAutocomplete :items="statusItem" placeholder="All" v-model="status" />
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
      <div class="me-3 d-flex gap-3 mt-5">
         <ItemsPerPageSelector
          v-model="itemsPerPage"
          @update:model-value="updateItemsPerPage"
        />
      </div>
      <div class="gap-3 mt-2"  v-if="permissionStore.hasPermission('tickers.store')">
        <VBtn variant="elevated" color="primary" to="/promotions/tickers/add-ticker">
          Add Tickers
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
        <template #item.channel="{ item }">
          <VChip :style="{
            backgroundColor: item.channel == 'agent' ? '#28C76F29' : '#FFEAD4',
            color: item.channel == 'agent' ? '#28C76F' : '#FFA44D',

            marginTop: '2px',
          }" class="font-weight-light fs-12 p-1" size="small">
            {{ item.channel == 'agent' ? "agent" : "online" }}
          </VChip>
        </template>


        <template #item.agent="{ item }">
          <div class="text-wrap">
            {{ item.main_agent }} {{ item.sub_agent }}
          </div>
        </template>

        <template #item.added_by="{ item }">
          <div>
            {{ item.created_by }}
          </div>
        </template>
        <template #item.status="{ item }">
          <VChip :style="{
            backgroundColor: item.status == 'active' ? '#28C76F29' : '#FFEAD4',
            color: item.status == 'active' ? '#28C76F' : '#FFA44D',

            marginTop: '2px',
          }" class="font-weight-light fs-12 p-1" size="small">
            {{ item.status == 'active' ? "active" : "expired" }}
          </VChip>
        </template>
        <template #item.action="{ item }">
          <div class="d-flex gap-1">
              <VBtn
                icon
                variant="text"
                color="medium-emphasis"
                @click="openAuditLog(item)"
              >
              <VIcon icon="tabler-history" />
            </VBtn>
            <!-- <IconBtn @click="deleteUser(item.id)">
              <VIcon icon="tabler-trash" />
            </IconBtn> -->
          </div>
        </template>
      </VDatableComponent>
    </VCardText>
  </v-card>
     <AuditLog
      v-if="selectedId"
      module="Ticker"
      :id="selectedId"
      class="mt-4"
    />
</template>
