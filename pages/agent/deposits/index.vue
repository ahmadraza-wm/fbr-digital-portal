<script setup>
definePageMeta({
  middleware: "auth",
  permission: "agent.deposits.index"
})
const permissionStore = usePermissionStore()
import { ref, reactive, onMounted, watch } from "vue";
import { useNuxtApp } from "#app";
import ItemPerPage from "@/components/itemPerPage.vue";
import { useAgentDeposit } from "@/composables/agentPortal/useDeposits";
const requiredValidator = (v) => !!v || "This field is required";

const searched = ref(false);
const dateRange = ref([]);

const filters = ref({
  status: "all",
  from_date: "",
  to_date: "",
  to_date: "",
});

const activeFilters = ref({});

const {
  agentdeposits,
  fetchAgentDeposits,
  status,
  selectedDeposit,
  remarks,
  pagination,
  deleteDeposit,
  filterAgentDeposits
} = useAgentDeposit();

const fetchWithFilters = (params) => {
  return fetchAgentDeposits({ ...activeFilters.value, ...params });
}

const { pageNo, itemsPerPage, updateItemsPerPage, loadPage } = usePagination(
  fetchWithFilters,
  {
    initialPage: 1,
    initialPerPage: 50,
  }
);

const { agents, fetchAgents } = useAgents();

const statuss = ref([
  { title: "All", value: "all" },
  { title: "Accepted", value: "accepted" },
  { title: "Pending", value: "pending" },
  { title: "Rejected", value: "rejected" },
]);

const options = ref({
  page: 1,
  itemsPerPage: 5,
  sortBy: [],
  sortDesc: [],
});

watch(dateRange, (val) => {
  const [from, to] = val?.split?.(" - ") || [];
  filters.value.from_date = from?.trim() || "";
  filters.value.to_date = to?.trim() || "";
});

const headers = [
  { title: "#", key: "sr_no" },
  { title: "DATE", key: "created_at" },
  { title: "Type", key: "deposit_type" },
  { title: "AMOUNT", key: "deposit_amount" },
  { title: "Description", key: "deposit_notes" },
  { title: "STATUS", key: "status" },
  { title: "Reason", key: "reason" },
  { title: "ACTION", key: "action" },
];

const search = () => {
   searched.value = true;
  const plainFilters = {
    ...filters.value,
    status: filters.value.status === "all" ? "" : filters.value.status,
  };
  activeFilters.value = plainFilters;
  pageNo.value = 1;
  loadPage();
};

const resetfilter = () => {
  filters.value = {
    status: "all",
    from_date: "",
    to_date: "",
  };

  dateRange.value = [];

  searched.value = false;
  activeFilters.value = {};
  pageNo.value = 1;
  loadPage();
};

onMounted(() => {
  fetchAgentDeposits({},pagination);
})
</script>

<template>
  <v-card>
    <v-row>
      <v-col cols="12">
        <v-card-title class="border-b-sm">
          <h4 class="text-h5 py-3">Deposit List</h4>
        </v-card-title>
      </v-col>
    </v-row>

    <v-card-text class="pt-1 my-4 pb-3">
      <v-row class="ps-0">
        <v-col cols="12" sm="6" md="3">
          <span class="fs-14 label-color font-weight-regular">Date Range</span>
          <AppDateRange class="cursor-pointer" placeholder="DD/MM/YYYY" v-model="dateRange" />
        </v-col>
        <v-col cols="12" sm="6" md="3">
          <span class="fs-15 label-color font-weight-medium">Status</span>
          <AppAutocomplete :items="statuss" v-model="filters.status" placeholder="Choose status" />
        </v-col>
        <v-col cols="12 d-flex gap-2 align-end justify-start" sm="10" md="4">
          <VBtn type="submit" class="login-btn" variant="tonal" @click="search">Search</VBtn>
          <!-- @click="search" -->
          <VBtn type="reset" color="secondary" variant="tonal" @click="resetfilter">Reset</VBtn>
        </v-col>
      </v-row>
    </v-card-text>

    <v-card-text class="px-0">
      <VDatableComponent :headers="headers" :items="agentdeposits" :loading="loading" :search="search"
        :pagination="pagination" :pageNo="pageNo" @update:pageNo="pageNo = $event">
        <template #top>
          <VCol class="d-flex justify-space-between align-center border-t-sm border-b-sm py-5">
            <div class="me-3 d-flex align-center">
              <ItemPerPage v-model="itemsPerPage" @update:model-value="updateItemsPerPage" />
            </div>
            <VBtn variant="elevated" to="/agent/deposits/add" color="primary" >
              Add New Deposit
            </VBtn>
          </VCol>
        </template>

        <template #item.id="{ item }">
          <div>{{ item.id }}</div>
        </template>

        <template #item.name="{ item }">
          <div>
            <div class="text-caption text-grey">
              {{ item.main_agent?.agent_code }}
            </div>
            <div class="text-wrap">{{ item.main_agent?.name }}</div>
          </div>
        </template>

        <template #item.deposit_notes="{ item }">
          <div class="text-wrap">{{ item.deposit_notes }}</div>
          <div class="text-wrap">{{ item.action_remarks }}</div>
        </template>

        <template #item.deposit_amount="{ item }">
          <div>{{ item.deposit_amount }}</div>
        </template>

        <template #item.status="{ item }">
          <VChip :style="{
            backgroundColor:
              item.status === 'accepted'
                ? '#28C76F29'
                : item.status == 'pending'
                  ? '#FF9F4329'
                  : item.status == 'rejected'
                    ? '#EA545529'
                    : '#CCCCCC29',
            color:
              item.status == 'accepted'
                ? '#28C76F'
                : item.status == 'pending'
                  ? '#FF9F43'
                  : item.status == 'rejected'
                    ? '#EA5455'
                    : '#999999',
            marginTop: '2px',
          }" class="font-weight-light fs-12 p-1" size="small">
            {{
              item.status == "accepted"
                ? "Accepted"
                : item.status == "pending"
                  ? "Pending"
                  : item.status == "rejected"
                    ? "Rejected"
                    : "Unknown"
            }}
          </VChip>
        </template>

        <template #item.reason="{ item }">
          <div class="text-wrap text-capitalize">{{ item.status }}</div>
        </template>

        <template #item.action="{ item }">
          <div class="d-flex gap-2" v-if="item.status == 'pending'">
            <VBtn icon variant="text" color="primary" :to="`/agent/deposits/edit/${item.id}`">
              <VIcon size="24" icon="tabler-edit" />
            </VBtn>
            <VBtn icon variant="text" color="error" @click="deleteDeposit(item.id)">
               <VIcon size="24" icon="tabler-trash" />
            </VBtn>
          </div>
          <p v-if="item.status !== 'pending'">------</p>
        </template>
      </VDatableComponent>
    </v-card-text>
  </v-card>
</template>
