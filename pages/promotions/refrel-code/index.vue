<script setup>
import { useRefrelCode } from "@/composables/useRefrelCode";
import { storeToRefs } from "pinia";
import { computed, onMounted, ref } from "vue";
import AuditLog from '@/components/AuditLog.vue'
definePageMeta({
  middleware: "auth",
  permission: "referral.index"
})
const permissionStore = usePermissionStore()
const countryCurrencyStore = useCountryCurrencyStore();
const { sending_countries, receiving_countries, countries } = storeToRefs(
  countryCurrencyStore
);

const {
  headers,
  transferItem,
  agents,
  deleteBank,
  fetchAgents,
  createFreeFeeTransfer,
  bankList,
  pagination,
  fetchBanks,
} = useRefrelCode();

  const { pageNo, itemsPerPage, updateItemsPerPage, loadPage } = usePagination(fetchBanks, {
  initialPage: 1,
  initialPerPage: 10,
});


const referral_code = ref(null);
const country = ref("all");
const agent_name = ref(null);
const transfers_status = ref("all");

const options = ref({
  page: 1,
  itemsPerPage: 5,
  sortBy: [""],
  sortDesc: [false],
});

const filters = computed(() => {
  const f = {};
  if (country.value !== "all") f.country_id = country.value;
  if (transfers_status.value !== "all") f.fee_free_transfers = transfers_status.value;
  if (referral_code.value) f.referral_code = referral_code.value;
  if (agent_name.value) f.agent_name = agent_name.value;
  return f;
});

const search = () => {
  console.log(filters.value);
  fetchBanks({ ...filters.value});
};

const resetFilters = () => {
  country.value = "all";
  agent_name.value = null;
  referral_code.value = null;
  fetchBanks();
};


const selectedId = ref(null)

const openAuditLog = (item) => {
  if (selectedId.value === item.id) {
    selectedId.value = null
  } else {
    selectedId.value = item.id
  }
}

// Delete item
const deleteUser = async (id) => {
  await deleteBank(id);
};
</script>
<template>
  <v-card>
    <v-row>
      <v-col cols="12">
        <v-card-title class="border-b-sm">
          <h4 class="text-h5 py-3">Search Referral Codes</h4>
        </v-card-title>
      </v-col>
    </v-row>

    <v-card-text class="pt-1 my-4 pb-3">
      <v-row class="ps-0">
        <v-col cols="12" sm="6" md="3">
          <span class="fs-15 label-color font-weight-medium">Referral Code</span>
          <AppTextField name="referral_code" v-model="referral_code" placeholder="Referral code" autocomplete="off" />
        </v-col>
        <v-col cols="12" sm="6" md="3">
          <span class="fs-15 label-color font-weight-medium">Country</span>
          <AppAutocomplete :items="countries" item-title="name" item-value="id" v-model="country"
            placeholder="Select country" />
        </v-col>
        <v-col cols="12" sm="6" md="3">
          <span class="fs-15 label-color font-weight-medium">Agent Name</span>
          <AppTextField name="agent_name" v-model="agent_name" placeholder="Agent" />
        </v-col>
        <v-col cols="12" sm="6" md="3">
          <span class="fs-15 label-color font-weight-medium">Fee Free Transfers</span>
          <AppAutocomplete :items="transferItem" v-model="transfers_status" placeholder="Select status" />
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
    <VCardText class="flex-wrap gap-4 d-flex justify-space-between align-center border-t-sm pb-2">
      <div class="me-3 d-flex gap-3 pt-6">
         <ItemsPerPageSelector
          v-model="itemsPerPage"
          @update:model-value="updateItemsPerPage"
        />
      </div>
      <div class="gap-3 pt-3" v-if="permissionStore.hasPermission('referral.store')">
        <VBtn variant="elevated" color="primary" to="/promotions/refrel-code/add-referral-code">
          Add Referral Codes
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
              backgroundColor:
                item.fee_free_transfers == 'enabled' ? '#28C76F29' : '#FE5F574F',
              color: item.fee_free_transfers == 'enabled' ? '#28C76F' : '#FE5F57',
              marginTop: '2px',
            }" class="font-weight-light fs-12 p-1" size="small">
              {{ item.fee_free_transfers == "enabled" ? "Enable" : "Disable" }}
            </VChip>
          </div>
        </template>

        <template #item.action="{ item }">
          <div>
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
      module="ReferralCode"
      :id="selectedId"
      class="mt-4"
    />
</template>
