<script setup>
import { useAgentlimits } from "@/composables/useAgentlimits";
import { computed, onMounted, ref, watch } from "vue";
const countryCurrencyStore = useCountryCurrencyStore();
const { countries, currencies } = storeToRefs(countryCurrencyStore);
const requiredValidator = (v) => v !== null && v !== undefined && v !== '' ? true : "This field is required";

const userList = ref([]);
const searched = ref(false);


const {
  agentlimits,
  fetchAgentlimits,
  saveAgentlimit

} = useAgentlimits();

const {
  agents,
  fetchAgents,
} = useAgents();



const filters = ref({
  type: '',
  name: '',
  agent_code: '',
  country_id: 'all',
  main_agent_id: 'all'
});

const search = () => {

  searched.value = true;

  const plainFilters = {
    ...filters.value,
    main_agent_id: filters.value.main_agent_id === 'all' ? '' : filters.value.main_agent_id,
    country_id: filters.value.country_id === 'all' ? '' : filters.value.country_id,
  };

  fetchAgentlimits(plainFilters);
};

watch(() => filters.value.type, () => {
  filters.value.main_agent_id = 'all';
});


const resetFilters = () => {

  filters.value = {
    type: '',
    name: '',
    agent_code: '',
    country_id: 'all',
    main_agent_id: 'all'

  };
  fetchAgentlimits();

  searched.value = false;

};


const AgentsSelectType = computed(() => {
  if (filters.value.type === 'main_agent') {
    return [{ label: 'All', value: 'all' }];
  }

  if (filters.value.type === 'sub_agent') {
    return [
      { label: 'All', value: 'all' },
      ...agents.value
        .filter(agent => agent.type === 'main_agent')
        .map(agent => ({
          label: agent.name,
          value: agent.id
        }))
    ];
  }

  return [{ label: 'All', value: 'all' }];
});



const main_agents_all = [
  { title: "All", value: "all" },
  { title: "MAUK - Muhammad Talha", value: "MAUK_Muhammad_Talha" },
  { title: "Ahmad Raza", value: "Ahmad_Raza" },
  { title: "Ali Raza", value: "Ali_Raza" },
];

const main_agents = computed(() => {
  return filters.type === "main-agent"
    ? [{ title: "All", value: "all" }]
    : main_agents_all;
});

const country = ref([
  { title: "All", value: "all" },
  { title: "Canada", value: "CA" },
  { title: "Switzerland", value: "CH" },
  { title: "Ireland", value: "IE" },
  { title: "United Kingdom", value: "UK" },
]);

const type = ref([
  { title: "Main Agent", value: "main_agent" },
  { title: "Sub Agent", value: "sub_agent" }
]);

const options = ref({
  page: 1,
  itemsPerPage: 5,
  sortBy: [],
  sortDesc: [],
});

const headers = [
  { title: '#', key: 'id' },
  { title: 'NAME', key: 'name' },
  { title: 'CODE', key: 'code' },
  { title: 'COUNTRY', key: 'country' },
  { title: 'DAILY TRANSFER', key: 'dailyTransfer' },
  { title: 'WEEKLY TRANSFER', key: 'weeklyTransfer' },
  { title: 'CREDIT LIMIT', key: 'creditLimit' },
  { title: 'STATUS', key: 'status' },
];


onMounted(() => {
  userList.value = [
    {
      id: '01',
      name: {
        label: 'MAUK',
        sub: 'Muhammad Talha'
      },
      code: '#033',
      country: 'United Kingdom',
      dailyTransfer: '5000.00',
      weeklyTransfer: '25000.00',
      creditLimit: '100000.00',
      status: 1,
    },
    {
      id: '02',
      name: {
        label: 'ARZA',
        sub: 'Ahmad Raza'
      },
      code: '#034',
      country: 'Canada',
      dailyTransfer: '4000.00',
      weeklyTransfer: '20000.00',
      creditLimit: '80000.00',
      status: 0,
    }
  ];
  fetchAgents({}, false);

});



const submitForm = () => {
  saveAgentlimit(agentlimits.value);
};


</script>

<template>
  <v-card>
    <v-card-title class="border-b-sm">
      <h4 class="text-h5 py-3">Agent Limits</h4>
    </v-card-title>

    <v-card-text class="pt-1 my-4 pb-3">
      <v-row class="ps-0">
        <v-col cols="12" sm="6" md="3">
          <span class="fs-15">Type</span>
          <AppAutocomplete :items="type" v-model="filters.type" placeholder="Select type" />
        </v-col>
        <v-col cols="12" sm="6" md="3">
          <span class="fs-15">Main Agent</span>
          <AppAutocomplete :items="AgentsSelectType" item-title="label" item-value="value"
            v-model="filters.main_agent_id" placeholder="Select main agent" />
        </v-col>
        <v-col cols="12" sm="6" md="3">
          <span class="fs-15">Name</span>
          <AppTextField v-model="filters.name" placeholder="Name" />
        </v-col>
        <v-col cols="12" sm="6" md="3">
          <span class="fs-15">Code</span>
          <AppTextField v-model="filters.agent_code" placeholder="****" />
        </v-col>
        <v-col cols="12" sm="6" md="3">
          <span class="fs-15">Country</span>
          <AppAutocomplete :items="countries" item-title="name" item-value="id" v-model="filters.country_id"
            placeholder="Select country" />
        </v-col>
        <v-col cols="12" sm="6" md="4" class="d-flex gap-2 align-end">
          <VBtn type="submit" variant="tonal" class="login-btn" @click="search">Search</VBtn>
          <VBtn type="reset" color="secondary" variant="tonal" @click="resetFilters">Reset</VBtn>
        </v-col>
      </v-row>
    </v-card-text>

    <v-card-text v-if="searched" class="px-0">
      <VForm @submit.prevent="submitForm">
        <PaginatedDataTable :headers="headers" :items="agentlimits" :options="options" :loading="loading"
          :search="search" @update:options="options = $event">
          <!-- TOP SLOT -->
          <template #top>
            <div class="d-flex align-center mb-2 px-5 py-5 border-b-sm">
              <span class="mr-2">Show</span>
              <v-select
                :items="[{ text: '5', value: 5 }, { text: '10', value: 10 }, { text: '25', value: 25 }, { text: '50', value: 50 }, { text: 'All', value: -1 }]"
                v-model="options.itemsPerPage" item-title="text" item-value="value" dense hide-details class="ma-0"
                style="max-inline-size: 100px;" />
              <span class="ml-2">items</span>
            </div>
          </template>

          <template #item.id="{ item }">
            <div>
              <div>{{ item.id }}</div>
            </div>
          </template>
          <template #item.name="{ item }">
            <div>
              <div>{{ item.name }}</div>
              <div class="text-caption text-grey">{{ item.main_agent_name }}</div>
            </div>
          </template>
          <template #item.code="{ item }">
            <div>
              <div>{{ item.agent_code }}</div>
            </div>
          </template>
          <!-- DAILY TRANSFER column input -->
          <template #item.dailyTransfer="{ item }">
            <v-text-field v-model="item.daily_transfer_limit" :rules="[requiredValidator]" hide-details
              density="compact" variant="outlined" style="max-inline-size: 120px;" />
          </template>

          <template #item.weeklyTransfer="{ item }">
            <v-text-field v-model="item.weekly_transfer_limit" :rules="[requiredValidator]" hide-details
              density="compact" variant="outlined" style="max-inline-size: 120px;" />
          </template>

          <template #item.creditLimit="{ item }">
            <v-text-field v-model="item.credit_limit" :rules="[requiredValidator]" hide-details density="compact"
              variant="outlined" style="max-inline-size: 120px;" />
          </template>

          <template #item.status="{ item }">
            <VChip :style="{
              backgroundColor: item.status === 'Active' ? '#28C76F29' : '#FF9F4329',
              color: item.status === 'Active' ? '#28C76F' : '#FF9F43',
              marginTop: '2px',
            }" class="font-weight-light fs-12 p-1" size="small">
              {{ item.status === 'Active' ? "Active" : "Inactive" }}
            </VChip>
          </template>

          <template #bottom>
            <VCol class="d-flex align-center pt-0">
              <VBtn type="submit" variant="tonal" class="login-btn">Update Limits</VBtn>
              <VCardText>
                <div class="d-flex justify-end">
                  <VPagination v-model="options.page"
                    :length="Math.ceil(agentlimits.length / (options.itemsPerPage === -1 ? agentlimits.length : options.itemsPerPage))" />
                </div>
              </VCardText>
            </VCol>
          </template>
        </PaginatedDataTable>
      </VForm>
    </v-card-text>

  </v-card>
</template>
