<script setup>
import { useAdminFee } from "@/composables/useAdminFee";
import { computed, onMounted, ref } from "vue";
const permissionStore = usePermissionStore()
definePageMeta({
  middleware: "auth",
  permission: "admin_fee.index"
})
const {
  rules,
  headers,
  ruleData,
  loading,
  fetchRules,
  pagination,
  countries,
  payers,
  fetchAgents,
  agents,
  filteredPayers
} = useAdminFee();


const { pageNo, itemsPerPage, updateItemsPerPage, loadPage } = usePagination(fetchRules, {
  initialPage: 1,
  initialPerPage: 10,
});



const channels = computed(() => [
  { title: "All", value: "all" },
  { title: "Online", value: "online" },
  { title: "Agent", value: "agent" },
]);


const userList = ref([]);
const showAdvancedSearch = ref(false);

const payersList = ref([]);
const error = ref(null);
const loadingMessage = ref(null);



const filters = ref({
  channel: "all",
  country_id: "",
  sending_method: "all",
  agent_id: "all",
  receiving_method: "all",
  payer_id: "all",
  force_fetch: true
});


const resetFilters = () => {
  filters.value = {
    channel: "all",
    country_id: "",
    sending_method: "all",
    agent_id: "all",
    receiving_method: "all",
    payer_id: "all",
    force_fetch: true
  };
  // pageNo.value = 1;
  // loadPage();
  fetchRules(filters.value)
};



const search = () => {
  fetchRules(filters.value)
};


const options = ref({
  page: 1,
  itemsPerPage: 5,
  sortBy: [""],
  sortDesc: [false],
});

onMounted(() => {
  fetchAgents({}, false);
  fetchRules(filters.value);
})

const sending_methods_tags = [
  { title: "All", value: "all" },
  { title: "Bank Transfer", value: "bank_transfer" },
  { title: "Cash", value: "cash" },
  { title: "Digital Wallet", value: "digital_wallet" },
  { title: "Debit Card", value: "debit_card" },
  { title: "Credit Card", value: "credit_card" },
];

const receiving_methods_tags = [
  { title: "All", value: "all" },
  { title: "Bank", value: "bank" },
  { title: "Cash", value: "cash" },
  { title: "Mobile Wallet", value: "mobile_wallet" },
];


</script>
<style>
.border-left {
  border-left: 1px solid #e7e1e1;
  ;
}

.border-right {
  border-right: 1px solid #bababa;
}


.border-bottom {
  border-bottom: 1px solid #e7e1e1;
  ;
}

.v-table>.v-table__wrapper>table>tbody>tr>td:nth-last-child(-n + 3) {
  padding-block: 0 !important;
  padding-inline: 0 !important;
}
</style>
<template>
  <v-card>
    <v-row>
      <v-col cols="12">
        <v-card-title class="border-b-sm">
          <h4 class="text-h5 py-3">Admin Fee</h4>
        </v-card-title>
      </v-col>
    </v-row>

    <v-card-text class="pt-1 my-4 pb-3">
      <VForm @submit.prevent="search">
        <v-row class="ps-0">

          <v-col cols="12" sm="6" md="3">
            <span class="fs-15 label-color font-weight-medium" v-html="requiredLabel('Channel')"></span>
            <AppAutocomplete :items="channels" placeholder="All" :rules="[requiredValidator]"
              v-model="filters.channel" />
          </v-col>
          <v-col cols="12" sm="6" md="3">
            <span class="fs-15 label-color font-weight-medium">Agents</span>
            <AppAutocomplete placeholder="Agents" :items="agents" item-title="name" item-value="id"
              v-model="filters.agent_id" />
          </v-col>

          <v-col cols="12" sm="6" md="3">
            <span class="fs-15 label-color font-weight-medium">Payers</span>
            <AppAutocomplete placeholder="Payers" :items="filteredPayers" item-title="name" item-value="id"
              v-model="filters.payer_id" />
          </v-col>

          <v-col cols="12" sm="6" md="3">
            <span class="fs-15 label-color font-weight-medium">Country</span>
            <AppAutocomplete :items="countries" placeholder="All" item-title="name" v-model="filters.country_id"
              item-value="id" />
          </v-col>
          <v-col cols="12" sm="6" md="3">
            <span class="fs-15 label-color font-weight-medium">Sending Methods</span>
            <AppAutocomplete v-model="filters.sending_method" :items="sending_methods_tags" placeholder="All" />
          </v-col>
          <template v-if="showAdvancedSearch">


            <v-col cols="12" sm="6" md="3">
              <span class="fs-15 label-color font-weight-medium">Receiving Methods</span>
              <AppAutocomplete v-model="filters.receiving_method" :items="receiving_methods_tags" placeholder="All" />
            </v-col>
          </template>
          <v-col cols="12 d-flex gap-2 align-end justify-start" sm="10" md="4">
            <VBtn type="button" variant="elevated" :color="!showAdvancedSearch ? 'primary' : 'error'"
              @click="showAdvancedSearch = !showAdvancedSearch">
              {{
                showAdvancedSearch ? "Hide Advance Search" : "Advance Search"
              }}
            </VBtn>
            <VBtn type="submit" class="login-btn" variant="tonal">
              search
            </VBtn>
            <VBtn type="reset" color="secondary" variant="tonal" @click="resetFilters">
              Reset
            </VBtn>
          </v-col>
        </v-row>
      </VForm>
    </v-card-text>

    <VCardText class="px-0">
      <VDatableComponent :headers="headers" :items="rules" :loading="loading" :pagination="pagination" :pageNo="pageNo"
        @update:pageNo="loadPage" class="border-t">

        <template #item.from="{ item }">
          <div v-if="item.rule_ranges?.length" class="my-2">
            <div v-for="(range, index) in item.rule_ranges" :key="range.id" class="py-1 ps-2" :class="[
              { 'border-top': index === 0 },
              { 'border-bottom': index !== item.rule_ranges.length - 1 },
            ]">
              {{ range.from }}
            </div>
          </div>
          <div v-else>–</div>
        </template>

        <template #item.to="{ item }">
          <div v-if="item.rule_ranges?.length">
            <div v-for="(range, index) in item.rule_ranges" :key="range.id" class="py-1 ps-2" :class="[
              'border-left',
              { 'border-top': index === 0 },
              { 'border-bottom': index !== item.rule_ranges.length - 1 },
            ]">
              {{ range.to }}
            </div>
          </div>
          <div v-else>–</div>
        </template>

        <template #item.margin="{ item }">
          <div v-if="item.rule_ranges?.length" class="me-5">
            <div v-for="(range, index) in item.rule_ranges" :key="range.id" class="py-1 ps-2" :class="[
              'border-left',

              { 'border-top': index === 0 },
              { 'border-bottom': index !== item.rule_ranges.length - 1 },
            ]">
              {{ range.margin }}
            </div>
          </div>
          <div v-else>–</div>
        </template>
        <template #item.type="{ item }">
          <div v-if="item.rule_ranges?.length" class="me-5">
            <div v-for="(range, index) in item.rule_ranges" :key="range.id" class="py-1 ps-2" :class="[
              'border-left',

              { 'border-top': index === 0 },
              { 'border-bottom': index !== item.rule_ranges.length - 1 },
            ]">
              {{ range.type }}
            </div>
          </div>
          <div v-else>–</div>
        </template>


        <!-- Actions Column -->
        <template #item.action="{ item }">
          <div class="d-flex gap-1">


          </div>
        </template>
      </VDatableComponent>
    </VCardText>
  </v-card>
</template>
