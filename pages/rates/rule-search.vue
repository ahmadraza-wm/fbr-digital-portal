<script setup>
import ItemsPerPageSelector from "@/components/ItemsPerPageSelector.vue";
import { useRules } from "@/composables/useRules";
import { onMounted, ref } from "vue";
const permissionStore = usePermissionStore()
definePageMeta({
  middleware: "auth",
  permission: "rules.index"
})

const showAdvancedSearch = ref(false);

const {
  rules,
  headers,
  ruleData,
  loading,
  loadingMessage,
  errorMessage,
  successMessage,
  fetchRules,
  fetchRuleDetails,
  saveRule,
  deleteRule,
  channels,
  types,
  validities,
  countriesWithAll,
  agentsWithAll,
  pagination,
} = useRules();

const { pageNo, itemsPerPage, updateItemsPerPage, loadPage } = usePagination(fetchRules, {
  initialPage: 1,
  initialPerPage: 10,
});

const { agents, fetchAgents } = useAgents();

const filters = ref({
  name: "",
  channel: "all",
  country_id: "all",
  validity: "all",
  agent_id: "all",
  type: "all",
});

const deleteUser = async (id) => {
  await deleteRule(id);
};

const search = () => {
  fetchRules(filters.value)
};

const resetFilters = () => {
  filters.value = {
    name: "",
    channel: "all",
    country_id: "all",
    validity: "all",
    agent_id: "all",
    type: "all",
  };
  // pageNo.value = 1;
  // loadPage();
  fetchRules(filters.value)
};
definePageMeta({
  middleware: "auth",
});

const isExpired = (start, end) => {
  const now = new Date();
  const startDate = new Date(start);
  const endDate = new Date(end);

  return now < startDate || now > endDate;
};
onMounted(() => {
  fetchAgents({}, false);
});
</script>

<template>
  <v-card>
    <v-card-title class="pt-5">
      <h4 class="text-h5">Rules Search</h4>
    </v-card-title>

    <v-card-text class="pt-4 my-4 pb-3 border-t-sm" v-if="permissionStore.hasPermission('rules.search')">
      <VForm @submit.prevent="search">
        <v-row>
          <v-col cols="12" sm="6" md="3">
            <span class="fs-15 label-color">Name</span>
            <AppTextField v-model="filters.name" name="name" placeholder="Name" autocomplete="off" />
          </v-col>

          <v-col cols="12" sm="6" md="3">
            <span class="fs-15 label-color">Channel</span>
            <AppAutocomplete v-model="filters.channel" :items="channels" />
          </v-col>

          <v-col cols="12" sm="6" md="3">
            <span class="fs-15 label-color">Agents</span>
            <AppAutocomplete v-model="filters.agent_id" :items="agents" item-title="name" item-value="id" />
          </v-col>

          <v-col cols="12" sm="6" md="3">
            <span class="fs-15 label-color">Type</span>
            <AppAutocomplete v-model="filters.type" :items="types" />
          </v-col>

          <template v-if="showAdvancedSearch">
            <v-col cols="12" sm="6" md="3">
              <span class="fs-15 label-color">Zone</span>
              <AppAutocomplete v-model="filters.country_id" :items="countriesWithAll" item-title="name"
                item-value="id" />
            </v-col>
            <v-col cols="12" sm="6" md="3">
              <span class="fs-15 label-color">Validity</span>
              <AppAutocomplete v-model="filters.validity" :items="validities" />
            </v-col>
          </template>

          <v-col cols="12" sm="10" md="4" class="d-flex gap-2 align-end justify-start">
            <VBtn type="button" variant="elevated" :color="!showAdvancedSearch ? 'primary' : 'error'"
              @click="showAdvancedSearch = !showAdvancedSearch">
              {{ showAdvancedSearch ? "Hide Advanced Search" : "Advanced Search" }}
            </VBtn>
            <VBtn type="submit" variant="tonal" class="login-btn">Search</VBtn>
            <VBtn type="button" variant="tonal" color="secondary" @click="resetFilters">
              Reset
            </VBtn>
          </v-col>
        </v-row>
      </VForm>
    </v-card-text>
    <v-divider />
    <VCardText class="d-flex flex-wrap gap-4 justify-space-between pb-2">
      <div class="me-3 d-flex gap-3">
        <ItemsPerPageSelector v-model="itemsPerPage" @update:model-value="updateItemsPerPage" />
      </div>

      <VBtn color="primary" variant="elevated" to="add-rule" prepend-icon="tabler-plus" v-if="permissionStore.hasPermission('rules.store')">
        Add Rule
      </VBtn>
    </VCardText>

    <VCardText class="px-0">
      <VDatableComponent :headers="headers" :items="rules" :loading="loading" :pagination="pagination" :pageNo="pageNo"
        @update:pageNo="loadPage" class="border-t">
        <template #item.type="{ item }">
          <div class="d-flex flex-wrap gap-1">
            <VChip size="small" :color="item.validity_status === 'expired' ? 'error' : 'success'" variant="tonal">
              {{ item.validity_status }}
            </VChip>

            <VChip size="small" color="primary" variant="tonal">
              {{ item.channel }}
            </VChip>

            <!-- Type -->
            <VChip size="small" color="default" variant="tonal">
              {{ item.type }}
            </VChip>

            <!-- Expiry Status -->
          </div>
        </template>

        <!-- Actions Column -->
        <template #item.action="{ item }">
          <div class="d-flex gap-1">
            <IconBtn @click="deleteUser(item.id)" class="d-none">
              <VIcon icon="tabler-trash" />
            </IconBtn>

            <IconBtn>
              <a :href="`/rates/edit-rule/${item.id}`" target="_blank" rel="noopener" class="menu-link" v-if="permissionStore.hasPermission('rules.update')">
                <VIcon icon="tabler-edit" />
              </a>
            </IconBtn>
          </div>
        </template>
      </VDatableComponent>
    </VCardText>
  </v-card>
</template>
