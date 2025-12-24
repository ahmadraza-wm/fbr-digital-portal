<script setup>
import { ref } from "vue";
import data from "@/views/demos/forms/tables/data-table/datatable";
import { useSuggestion } from "@/composables/useSuggestion";
definePageMeta({
  middleware: "auth",
  permission: "suggesstions.index"
})
const permissionStore = usePermissionStore()
import AuditLog from '@/components/AuditLog.vue'
const sendingCountry = ref(null);
const receivingCountry = ref(null);
const userList = ref([]);
const suggestionDetail = ref(false);
const suggestDetails = ref(false);

const isReopened = ref(false);

const toggleComplaintStatus = () => {
  isReopened.value = !isReopened.value;
};

const {
  fetchSuggestions,
  suggestionlists,
  filtersuggestions,
  filters,
  resetFilters,
  pagination,
} = useSuggestion();

const selectedId = ref(null)

const openAuditLog = (item) => {
  if (selectedId.value === item.id) {
    selectedId.value = null
  } else {
    selectedId.value = item.id
  }
}

const { pageNo, itemsPerPage, updateItemsPerPage, loadPage } = usePagination(
  fetchSuggestions,
  {
    initialPage: 1,
    initialPerPage: 10,
  }
);

const searchfilter = () => {
  filtersuggestions(filters.value);
};

const country = ref([
  { title: "Pakistan", value: "Pakistan" },
  { title: "UK", value: "UK" },
  { title: "USA", value: "USA" },
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
    title: "Customer ID	",
    key: "customerid",
  },
  {
    title: "Customers",
    key: "fullName",
  },

  {
    title: "Rating",
    key: "rating",
  },
  {
    title: "Created At",
    key: "created_at",
  },

  {
    title: "Details",
    key: "action",
  },
];

const openSuggestionsDialog = (id) => {
  const suggestionData = suggestionlists.value.find(
    (suggestion) => suggestion.id === id
  );
  if (suggestionData) {
    suggestDetails.value = suggestionData;
    suggestionDetail.value = true;
  }
};

const resolveStatusVariant = (status) => {
  if (status === 1)
    return {
      color: "primary",
      text: "open",
    };
  else if (status === 2)
    return {
      color: "success",
      text: "close",
    };
  else if (status === 3)
    return {
      color: "success",
      text: "close",
    };
  else if (status === 4)
    return {
      color: "primary",
      text: "open",
    };
  else
    return {
      color: "info",
      text: "Applied",
    };
};
</script>

<template>
  <v-card class="mt-5">
    <v-row>
      <v-col cols="12">
        <v-card-title class="border-b-sm py-0">
          <h4 class="text-h5 py-6 mb-0">Search Suggestions</h4>
        </v-card-title>
      </v-col>
    </v-row>

    <v-card-text class="border-b-sm mb-7" v-if="permissionStore.hasPermission('suggestions.search')">
      <VForm @submit.prevent="searchfilter">
        <VRow>
          <VCol cols="4">
            <span class="fs-14 label-color font-weight-regular"
              >Customer Id</span
            >
            <AppTextField
              type="number"
              name="customerID"
              placeholder="Customer Id"
              v-model="filters.customer_id"
            />
          </VCol>
          <VCol cols="2" class="d-flex align-end">
            <div class="d-flex align-center justify-center align-center gap-2">
              <VBtn class="login-btn" variant="tonal" type="submit"
                >Search</VBtn
              >
              <VBtn
                color="secondary"
                type="reset"
                variant="tonal"
                @click="resetFilters"
                >Reset</VBtn
              >
            </div>
          </VCol>
        </VRow>
      </VForm>
    </v-card-text>
    <VCardText class="d-flex flex-wrap gap-4 justify-between pt-6 pb-3">
        <ItemsPerPageSelector
          v-model="itemsPerPage"
          @update:model-value="updateItemsPerPage"
        />
    </VCardText>

    <VCardText class="px-0 border-t-sm">
      <VDatableComponent
        :headers="headers"
        :items="suggestionlists"
        :loading="loading"
        :search="search"
        :pagination="pagination"
        :pageNo="pageNo"
        @update:pageNo="pageNo = $event"
      >
        <template #item.customerid="{ item }">
          <div>{{ item.customer.id }}</div>
        </template>

        <template #item.fullName="{ item }">
          <NuxtLink :to="`/customers/view/${item.customer.id}`">{{
            item.full_name
          }}</NuxtLink>
        </template>

        <template #item.rating="{ item }">
          <div>{{ item.rating }}</div>
        </template>

        <template #item.created_at="{ item }">
          <div>{{ item.created_at }}</div>
        </template>

        <!-- Actions -->
        <template #item.action="{ item }">
          <VBtn
                icon
                variant="text"
                color="medium-emphasis"
                @click="openAuditLog(item)"
              >
              <VIcon icon="tabler-history" />
            </VBtn>
          <IconBtn class="text-color">
            <NuxtLink class="menu-link" @click="openSuggestionsDialog(item.id)">
              <VIcon icon="tabler-eye" />
            </NuxtLink>
          </IconBtn>
        </template>
      </VDatableComponent>
    </VCardText>
  </v-card>

  <div class="text-center">
    <V-dialog
      v-model="suggestionDetail"
      max-width="1000"
      transition="scale-transition"
    >
      <v-card>
        <VForm>
          <v-row>
            <v-col cols="12">
              <v-card-title
                class="border-b-sm border-t-sm d-flex justify-space-between align-center"
                style="background-color: #fbfafa"
              >
                <h4 class="text-h5 py-3">Suggestion Details</h4>
                <IconBtn @click="suggestionDetail = false">
                  <VIcon icon="tabler-x" />
                </IconBtn>
              </v-card-title>
            </v-col>
          </v-row>
          <v-card-text class="px-3">
            <v-row class="px-5 border-b-sm">
              <v-col cols="6" sm="4" md="3" class="pb-1">
                <p class="font-weight-medium text-color mb-0 lh-22">
                  Customer ID
                </p>
                <p class="font-weight-medium mb-0 lh-22 text-color1">
                  {{ suggestDetails?.customer.id }}
                </p>
              </v-col>
              <v-col cols="6" sm="4" md="3" class="pb-1">
                <p class="font-weight-medium text-color mb-0 lh-22">
                  Customer Name
                </p>
                <p class="font-weight-medium mb-0 lh-22 text-color1">
                  {{ suggestDetails?.full_name }}
                </p>
              </v-col>
              <v-col cols="6" sm="4" md="3" class="pb-1">
                <p class="font-weight-medium text-color mb-0 lh-22">Rating</p>
                <p class="font-weight-medium mb-0 lh-22 text-color1">
                  {{ suggestDetails?.rating }}
                </p>
              </v-col>
              <v-col cols="6" sm="4" md="3" class="pb-1 px-0">
                <p class="font-weight-medium text-color mb-0 lh-22">
                  Created At
                </p>
                <p class="font-weight-medium mb-0 lh-22 text-color1">
                  {{ suggestDetails?.created_at }}
                </p>
              </v-col>
            </v-row>
            <v-row class="px-5 border-b-sm">
              <v-col cols="12" sm="12" md="12" class="pb-1">
                <p class="font-weight-medium text-color mb-0 lh-22">
                  Description
                </p>
                <p class="font-weight-medium mb-0 lh-22 text-color1">
                  {{ suggestDetails?.suggestion }}
                </p>
              </v-col>
            </v-row>
            <v-row
              class="px-5 border-b-sm"
              v-if="suggestDetails?.document?.url"
            >
              <v-col cols="12" sm="12" md="12" class="pb-1">
                <p class="font-weight-medium text-color mb-0 lh-22">
                  Uploaded Document
                </p>
                <v-img
                  :src="suggestDetails.document.url"
                  :alt="suggestDetails.document.original_name"
                  max-width="300"
                  class="mt-2"
                  contain
                />
                <div class="mt-2">
                  <a
                    :href="suggestDetails.document.url"
                    target="_blank"
                    rel="noopener"
                  >
                    View Document
                  </a>
                </div>
              </v-col>
            </v-row>
          </v-card-text>
        </VForm>
      </v-card>
    </V-dialog>
  </div>
    <AuditLog
    v-if="selectedId"
    module="Suggestion"
    :id="selectedId"
    class="mt-4"
  />
</template>
