<script setup>
definePageMeta({
  middleware: "auth",
  permission: "agentDeposits.index"
})
const permissionStore = usePermissionStore()
import { ref, reactive, onMounted, watch } from "vue";
import { useNuxtApp } from "#app";
import { useAgentDeposits } from "@/composables/useAgentDeposits";
import { useAgents } from "@/composables/useAgents";
import AuditLog from '@/components/AuditLog.vue'
const requiredValidator = (v) => !!v || "This field is required";

const selectedId = ref(null)

const openAuditLog = (item) => {
  if (selectedId.value === item.id) {
    selectedId.value = null
  } else {
    selectedId.value = item.id
  }
}
const searched = ref(false);
const userList = ref([]);
const dateRange = ref([]);

const filters = ref({
  agent_name: "",
  agent_code: "",
  status: "all",
  from_date: "",
  to_date: "",
});

const {
  agentdeposits,
  fetchAgentDeposits,
  popup_acp,
  popup_rej,
  status,
  selectedDeposit,
  submitStatusUpdate,
  remarks,
  pagination,
} = useAgentDeposits();

const { pageNo, itemsPerPage, updateItemsPerPage, loadPage } = usePagination(
  fetchAgentDeposits,
  {
    initialPage: 1,
    initialPerPage: 10,
  }
);

const { agents, fetchAgents } = useAgents();

const getMainAgents = computed(() => {
  return agents.value
    .filter((agent) => agent.type === "main_agent")
    .map((agent) => ({
      label: agent.name,
      value: agent.name,
    }));
});

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

const openAcceptPopup = (item) => {
  selectedDeposit.value = item;
  status.value = "accepted";
  popup_acp.value = true;
};

const openRejectPopup = (item) => {
  selectedDeposit.value = item;
  status.value = "rejected";
  popup_rej.value = true;
};

watch(dateRange, (val) => {
  const [from, to] = val?.split?.(" - ") || [];
  filters.value.from_date = from?.trim() || "";
  filters.value.to_date = to?.trim() || "";
});

const headers = [
  { title: "#", key: "sr_no" },
  { title: "NAME", key: "name" },
  { title: "NOTES", key: "deposit_notes" },
  { title: "AMOUNT", key: "deposit_amount" },
  { title: "STATUS", key: "status" },
  { title: "DATE", key: "date" },
  { title: "ACTION BY", key: "username" },
  { title: "ACTION", key: "action" },
];

const search = () => {
  searched.value = true;

  const plainFilters = {
    ...filters.value,
    status: filters.value.status === "all" ? "" : filters.value.status,
  };

  fetchAgentDeposits(plainFilters);
};

const resetfilter = () => {
  filters.value = {
    agent_name: "",
    agent_code: "",
    status: "all",
    from_date: "",
    to_date: "",
  };

  dateRange.value = [];

  searched.value = false;
};

onMounted(() => {
  fetchAgents({force_fetch:true}, false);
})
</script>

<template>
  <v-card>
    <v-row>
      <v-col cols="12">
        <v-card-title class="border-b-sm">
          <h4 class="text-h5 py-3">Agent Deposits</h4>
        </v-card-title>
      </v-col>
    </v-row>

    <v-card-text class="pt-1 my-4 pb-3">
      <v-row class="ps-0">
        <v-col cols="12" sm="6" md="3">
          <span class="fs-15 label-color font-weight-medium">Agent Name</span>
          <AppAutocomplete
            type="text"
            v-model="filters.agent_name"
            :items="getMainAgents"
            item-title="label"
            item-value="value"
            placeholder="Name"
          />
        </v-col>
        <v-col cols="12" sm="6" md="3">
          <span class="fs-15 label-color font-weight-medium">Code/Prefix</span>
          <AppTextField v-model="filters.agent_code" placeholder="****" />
        </v-col>
        <v-col cols="12" sm="6" md="3">
          <span class="fs-15 label-color font-weight-medium">Status</span>
          <AppAutocomplete
            :items="statuss"
            v-model="filters.status"
            placeholder="Choose status"
          />
        </v-col>
        <v-col cols="12" sm="6" md="3">
          <span class="fs-14 label-color font-weight-regular">Date Range</span>
          <AppDateRange
            class="cursor-pointer"
            placeholder="DD/MM/YYYY"
            v-model="dateRange"
          />
        </v-col>
        <v-col cols="12 d-flex gap-2 align-end justify-start" sm="10" md="4">
          <VBtn type="submit" class="login-btn" variant="tonal" @click="search"
            >Search</VBtn
          >
          <VBtn
            type="reset"
            color="secondary"
            variant="tonal"
            @click="resetfilter"
            >Reset</VBtn
          >
        </v-col>
      </v-row>
    </v-card-text>

    <v-card-text>
     <VDatableComponent
        :headers="headers"
        :items="searched ? agentdeposits : []"
        :loading="loading"
        :search="search"
        :pagination="pagination"
        :pageNo="pageNo"
        @update:pageNo="pageNo = $event"
      >
        <template #top>
          <VCol
            class="d-flex justify-space-between align-center border-t-sm border-b-sm py-5"
          >
            <div class="me-3 d-flex align-center">
              <ItemsPerPageSelector
                v-model="itemsPerPage"
                @update:model-value="updateItemsPerPage"
              />
            </div>
            <VBtn variant="elevated" to="/agents/add-deposit" color="primary" v-if="permissionStore.hasPermission('agentDeposits.store')">
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
          <VChip
            :style="{
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
            }"
            class="font-weight-light fs-12 p-1"
            size="small"
          >
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

        <template #item.date="{ item }">
          <div>{{ item.created_at }}</div>
        </template>

        <template #item.username="{ item }">
          <div class="text-wrap">{{ item.username }}</div>
        </template>

        <template #item.action="{ item }">
          <div class="d-flex">
            <VBtn
             v-if="item.media?.length"
              icon
              variant="text"
              color="medium-emphasis"
              :href="item.media[0].url"
              target="_blank"
            >
              <VIcon icon="tabler-eye" />
            </VBtn>
            <VBtn
                icon
                variant="text"
                color="medium-emphasis"
                @click="openAuditLog(item)"
              >
                <VIcon icon="tabler-history" />
              </VBtn>
              <VBtn
              icon
              variant="text"
              color="medium-emphasis"
              v-if="item.status === 'pending' && permissionStore.hasPermission('agentDeposits.update')"
            >
              <VIcon icon="tabler-dots-vertical" />
              <VMenu activator="parent">
                <VList>
                  <VListItem
                    class="border-b text-success"
                    @click="openAcceptPopup(item)"
                  >
                    <VListItemTitle>Accept</VListItemTitle>
                  </VListItem>
                  <VListItem class="text-error" @click="openRejectPopup(item)">
                    <VListItemTitle>Reject</VListItemTitle>
                  </VListItem>
                </VList>
              </VMenu>
            </VBtn>
          </div>
        </template>
      </VDatableComponent>
    </v-card-text>
  </v-card>
   <AuditLog
    v-if="selectedId"
    module="AgentDeposit"
    :id="selectedId"
    class="mt-4"
  />
  <div class="text-center pa-4">
    <!-- Dialog -->
    <v-dialog
      v-model="popup_acp"
      max-width="600"
      persistent
      transition="scale-transition"
    >
      <v-card>
        <VCardTitle class="border-b">
          <h4 class="text-h4 text-success">Accepted</h4>
        </VCardTitle>
        <VCardText class="pt-6" v-if="selectedDeposit">
          <VRow class="bg-grey border-b">
            <VCol cols="4" class="py-2">
              <span class="fs-15 font-weight-bold">Name</span>
            </VCol>
            <VCol cols="8" class="py-2">
              <span class="fs-15">{{ selectedDeposit.main_agent?.name }}</span>
            </VCol>
          </VRow>
          <VRow class="border-b">
            <VCol cols="4" class="py-2">
              <span class="fs-15 font-weight-bold">Code</span>
            </VCol>
            <VCol cols="8" class="py-2">
              <span class="fs-15">{{
                selectedDeposit.main_agent?.agent_code
              }}</span>
            </VCol>
          </VRow>
          <VRow class="bg-grey border-b">
            <VCol cols="4" class="py-2">
              <span class="fs-15 font-weight-bold">Amount</span>
            </VCol>
            <VCol cols="8" class="py-2">
              <span class="fs-15">{{ selectedDeposit.deposit_amount }}</span>
            </VCol>
          </VRow>
          <VRow class="border-b">
            <VCol cols="4" class="py-2">
              <span class="fs-15 font-weight-bold">Description</span>
            </VCol>
            <VCol cols="8" class="py-2">
              <span class="fs-15">{{ selectedDeposit.deposit_notes }}</span>
            </VCol>
          </VRow>
        </VCardText>
        <VForm @submit.prevent="">
          <VCardText class="pt-0">
            <VRow>
              <VCol cols="12 pb-3" class="pb-0 px-1 pt-3">
                <span class="fs-15 label-color"
                  >Remarks<span class="text-red">*</span></span
                >
                <AppTextarea
                  rows="2"
                  placeholder="Type here..."
                  :rules="[requiredValidator]"
                  v-model="remarks"
                />
              </VCol>
            </VRow>
          </VCardText>
          <VCardText class="border-t pb-0">
            <VRow class="py-3">
              <VCol class="d-flex justify-end px-1">
                <VBtn
                  color="secondary"
                  variant="tonal"
                  class="me-3"
                  @click="popup_acp = false"
                  >Discard</VBtn
                >
                <VBtn
                  color="white"
                  variant="elevated"
                  type="submit"
                  class="login-btn"
                  @click="submitStatusUpdate"
                >
                  Approve</VBtn
                >
              </VCol>
            </VRow>
          </VCardText>
        </VForm>
      </v-card>
    </v-dialog>
    <v-dialog
      v-model="popup_rej"
      max-width="600"
      persistent
      transition="scale-transition"
    >
      <v-card>
        <VCardTitle class="border-b">
          <h4 class="text-h4 text-error">Rejected</h4>
        </VCardTitle>
        <VCardText class="pt-6" v-if="selectedDeposit">
          <VRow class="bg-grey border-b">
            <VCol cols="4" class="py-2">
              <span class="fs-15 font-weight-bold">Name</span>
            </VCol>
            <VCol cols="8" class="py-2">
              <span class="fs-15">{{ selectedDeposit.main_agent?.name }}</span>
            </VCol>
          </VRow>
          <VRow class="border-b">
            <VCol cols="4" class="py-2">
              <span class="fs-15 font-weight-bold">Code</span>
            </VCol>
            <VCol cols="8" class="py-2">
              <span class="fs-15">{{
                selectedDeposit.main_agent?.agent_code
              }}</span>
            </VCol>
          </VRow>
          <VRow class="bg-grey border-b">
            <VCol cols="4" class="py-2">
              <span class="fs-15 font-weight-bold">Amount</span>
            </VCol>
            <VCol cols="8" class="py-2">
              <span class="fs-15">{{ selectedDeposit.deposit_amount }}</span>
            </VCol>
          </VRow>
          <VRow class="border-b">
            <VCol cols="4" class="py-2">
              <span class="fs-15 font-weight-bold">Description</span>
            </VCol>
            <VCol cols="8" class="py-2">
              <span class="fs-15">{{ selectedDeposit.deposit_notes }}</span>
            </VCol>
          </VRow>
        </VCardText>
        <VForm @submit.prevent="">
          <VCardText class="pt-0">
            <VRow>
              <VCol cols="12 pb-3" class="pb-0 px-1 pt-3">
                <span class="fs-15 label-color"
                  >Remarks<span class="text-red">*</span></span
                >
                <AppTextarea
                  rows="2"
                  placeholder="Type here..."
                  :rules="[requiredValidator]"
                  v-model="remarks"
                />
              </VCol>
            </VRow>
          </VCardText>
          <VCardText class="border-t pb-0">
            <VRow class="py-3">
              <VCol class="d-flex justify-end px-1">
                <VBtn
                  color="secondary"
                  variant="tonal"
                  class="me-3"
                  @click="popup_rej = false"
                  >Discard</VBtn
                >
                <VBtn
                  color="white"
                  variant="elevated"
                  type="submit"
                  class="login-btn"
                  @click="submitStatusUpdate"
                >
                  Approve</VBtn
                >
              </VCol>
            </VRow>
          </VCardText>
        </VForm>
      </v-card>
    </v-dialog>
  </div>
</template>
