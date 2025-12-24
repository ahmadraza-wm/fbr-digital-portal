<script setup>
import { useAgents } from "@/composables/useAgents";
import data from "@/views/demos/forms/tables/data-table/datatable";
const permissionStore = usePermissionStore()
const countryCurrencyStore = useCountryCurrencyStore();
const { countries, currencies } = storeToRefs(countryCurrencyStore);
const userList = ref([]);
definePageMeta({
  middleware: "auth",
  permission: "agents.index"
})

const {
  agents,
  pagination,
  filterAgents,
  fetchAgents,
  isEditing,
  loading,
  formData,
  saveAgents,
} = useAgents();

const { pageNo, itemsPerPage, updateItemsPerPage, loadPage } = usePagination(
  fetchAgents,
  {
    initialPage: 1,
    initialPerPage: 10,
  },
);

const filters = ref({
  name: "",
  agent_code: "",
  country_id: "",
  postal_code: "",
  type: "",
  channel: "",
});

const search = () => {
  const plainFilters = {
    ...filters.value,
    type: filters.value.type === "all" ? "" : filters.value.type,
    channel: filters.value.channel === "all" ? "" : filters.value.channel,
  };

  filterAgents(plainFilters);
};

const resetFilters = () => {
  filters.value = {
    name: "",
    agent_code: "",
    country_id: "",
    postal_code: "",
    type: "",
    channel: "",
  };
  fetchAgents();
};

const form = reactive({
  name: "",
  code: "",
  postal: "",
});

// Dropdown Options
const channels = ref([
  { title: "All", value: "all" },
  { title: "Agent", value: "agent" },
  { title: "Online", value: "online" },
]);
const typeAgent = [
  { title: "All", value: "all" },
  { title: "Main Agent", value: "main_agent" },
  { title: "Sub Agent", value: "sub_agent" },
  { title: "Officer", value: "officer" },
];
const country = ref([
  { title: "United States", value: "US" },
  { title: "Pakistan", value: "PAK" },
  { title: "Ireland", value: "IE" },
]);
const options = ref({
  page: 1,
  itemsPerPage: 5,
  sortBy: [""],
  sortDesc: [false],
});

const headers = [
  {
    title: "#",
    key: "sr_no",
  },
  {
    title: "Name",
    key: "nameWithId",
  },
  {
    title: "Email/Phone",
    key: "contact",
  },
  {
    title: "Address",
    key: "address",
  },
  {
    title: "Channel",
    key: "channel",
  },
  {
    title: "Main Agent",
    key: "main_agent",
  },
  {
    title: "ACTION",
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
});
const router = useRouter();
function goToCreateAgent() {
  router.push({
    path: "/agents/create-agent/",
    state: { agentList: true },
  });
}
</script>

<template>
  <v-card>
    <v-row>
      <v-col cols="12">
        <v-card-title class="border-b-sm">
          <h4 class="text-h5 py-3">Agent List</h4>
        </v-card-title>
      </v-col>
    </v-row>

    <v-card-text class="pt-1 my-4 pb-3">
      <v-row class="ps-0">
        <v-col cols="12" sm="6" md="3">
          <span class="fs-15 label-color font-weight-medium">Name</span>
          <AppTextField name="name" v-model="filters.name" placeholder="Name" autocomplete="off" />
        </v-col>
        <v-col cols="12" sm="6" md="3">
          <span class="fs-15 label-color font-weight-medium">Code</span>
          <AppTextField
            name="code"
            v-model="filters.agent_code"
            placeholder="****" autocomplete="off"
          />
        </v-col>
        <v-col cols="12" sm="6" md="3">
          <span class="fs-15 label-color font-weight-medium">Country</span>
          <AppAutocomplete
            :items="countries"
            item-title="name"
            item-value="id"
            v-model="filters.country_id"
            placeholder="Select country"
          />
        </v-col>
        <v-col cols="12" sm="6" md="3">
          <span class="fs-15 label-color font-weight-medium">Postal Code</span>
          <AppTextField
            name="postalCode"
            v-model="filters.postal_code"
            placeholder="******"
          />
        </v-col>
        <v-col cols="12" sm="6" md="3">
          <span class="fs-15 label-color font-weight-medium">Type</span>
          <AppAutocomplete
            :items="typeAgent"
            placeholder="All"
            v-model="filters.type"
          />
        </v-col>
        <v-col cols="12" sm="6" md="3">
          <span class="fs-15 label-color font-weight-medium">Channel</span>
          <AppAutocomplete
            :items="channels"
            placeholder="All"
            v-model="filters.channel"
          />
        </v-col>
        <v-col cols="12 d-flex gap-2 align-end justify-start" sm="10" md="4">
          <VBtn
            @click="search"
            type="submit"
            class="login-btn"
            variant="tonal"
          >
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
      class="flex-wrap gap-4 d-flex justify-space-between align-center border-t-sm pb-0"
    >
      <div class="me-3 d-flex gap-3 pt-6">
        <ItemsPerPageSelector
          v-model="itemsPerPage"
          @update:model-value="updateItemsPerPage"
        />
      </div>
      <div class="gap-3 pt-1" v-if="permissionStore.hasPermission('agents.store')">
        <VBtn
          variant="elevated"
          @click="goToCreateAgent"
          color="primary"
          :agentList="true"
        >
          Create Agent
        </VBtn>
      </div>
    </VCardText>

    <VCardText class="px-0 pb-0 border-t-sm">
      <VDatableComponent
        :headers="headers"
        :items="agents"
        :loading="loading"
        :search="search"
        :pagination="pagination"
        :pageNo="pageNo"
        @update:pageNo="pageNo = $event"
      >
        <!-- Name with id and status -->
        <template #item.nameWithId="{ item }">
          <div style="display: flex; align-items: center">
            <span>{{ item.agent_code }}</span>
          </div>
          <div class="fs-13 text-wrap">{{ item.name }}</div>
        </template>

        <!-- Email/Phone -->
        <template #item.contact="{ item }">
          <div>
            <div class="fs-13">{{ item.email }}</div>
            <div>{{ item.phone }}</div>
          </div>
        </template>

        <!-- Address -->
        <template #item.address="{ item }">
          <div>
            <div>{{ item.address }}</div>
          </div>
          <div class="fs-13">{{ item.country }}</div>
        </template>

        <!-- Channel + Status Chip -->
        <template #item.channel="{ item }">
          <div class="fs-13">{{ item.channel }}</div>
          <div style="display: flex; align-items: center">
            <VChip
              :style="{
                backgroundColor: item.status == 1 ? '#28C76F29' : '#FF9F4329',
                color: item.status == 1 ? '#28C76F' : '#FF9F43',
                marginTop: '2px',
              }"
              class="font-weight-light fs-12 p-1"
              size="small"
            >
              {{ item.status == 1 ? "Active" : "Inactive" }}
            </VChip>
          </div>
        </template>

        <!-- Main Agent -->
        <template #item.main_agent="{ item }">
          <div>
            <div class="text-wrap">{{ item.main_agent_name }}</div>
          </div>
        </template>

        <!-- Status -->
        <template #item.status="{ item }">
          <VChip
            :color="resolveStatusVariant(item.status).color"
            class="font-weight-medium"
            size="small"
          >
            {{ resolveStatusVariant(item.status).text }}
          </VChip>
        </template>

        <!-- Actions -->
        <template #item.action="{ item }">
          <div class="d-flex gap-1">
            <VBtn
              icon
              variant="text"
              :to="`/agents/view-agent/${item.id}`"
              color="medium-emphasis"  v-if="permissionStore.hasPermission('agents.show')" 
            >
              <VIcon icon="tabler-eye" />
            </VBtn>
            <VBtn icon variant="text" color="medium-emphasis">
              <VIcon icon="tabler-dots-vertical" />
              <VMenu activator="parent">
                <VList>
                  <VListItem :to="`/agents/edit-agent/${item.id}`"  v-if="permissionStore.hasPermission('agents.update')">
                    <VListItemTitle>Edit</VListItemTitle>
                  </VListItem>
                  <VListItem :to="`/agents/documents/${item.id}`"  v-if="permissionStore.hasPermission('agent_documents.store')">
                    <VListItemTitle>Add Document</VListItemTitle>
                  </VListItem>
                  <VListItem
                    v-if="item.type !== 'main_agent' && permissionStore.hasPermission('agent_login_ip.index')"
                    :to="`/agents/login-ip/${item.id}`"
                  >
                    <VListItemTitle>Login Ip Settings</VListItemTitle>
                  </VListItem>
                  <!-- <VListItem
                    v-if="item.type === 'main_agent'"
                    :to="'/agents/agent-commission'"
                  >
                    <VListItemTitle>Agent Commission</VListItemTitle>
                  </VListItem> -->
                </VList>
              </VMenu>
            </VBtn>
          </div>
        </template>
      </VDatableComponent>
    </VCardText>
  </v-card>
</template>
