<script setup>
import SearchFilter from "@/components/modification/search-filter.vue";
import { useMarkPaid } from "@/composables/useMarkPaid";
const { $axios } = useNuxtApp();
const permissionStore = usePermissionStore()
definePageMeta({
  middleware: "auth",
  permission: "modification.mark.as.paid"
})
const {
  payments,
  headers,
  fetchTransactions,
  pagination,
  resolveStatusVariant,

} = useMarkPaid();

const { pageNo, itemsPerPage, updateItemsPerPage, loadPage } = usePagination(
  fetchTransactions,
  {
    initialPage: 1,
    initialPerPage: 10,
  }
);
const {
  loading,

  showSuccess,
  showError,
} = useUiFeedback();
const markPaid = ref(false);
const markAllpaid = ref(false);
const userList = ref([]);
const mark = ref(false);
const selectedTransactionId = ref(null);
const selectedItems = ref([]);
const rowActionItem = ref(null);




const handleCheckboxChange = (value, checked) => {
  rowActionItem.value = null;

  if (checked) {
    if (!selectedItems.value.includes(value)) {
      selectedItems.value.push(value);
    }
  } else {
    selectedItems.value = selectedItems.value.filter(v => v !== value);
  }
};


const markPaidForm = async () => {
  const itemsToMark = rowActionItem.value !== null ? [rowActionItem.value] : selectedItems.value;
  const transactionIds = itemsToMark.map(item => item.transaction_id);
  try {
    await $axios.patch("/mark/as/paid", null, {
      params: {
        transaction_ids: transactionIds,
      },
    });
    showSuccess("Payment Mark as Paid");
    rowActionItem.value = null;
    selectedItems.value = [];
    markAllpaid.value = false;
    fetchTransactions();

  } catch (err) {
    console.error(err);
    showError("Failed to mark as paid  the payment.");
  }
};



const onFilterUpdated = (filters) => {
  fetchTransactions({ ...filters });
};
const onFilterReset = () => {
  fetchTransactions();
};

</script>
<template>
  <v-card class="mt-5">
    <v-row>
      <v-col cols="12">
        <v-card-title class="border-b-sm">
          <h4 class="text-h5 py-3">
            Mark as Paid (You can search Send to Partner and Available for
            Collection payments here.)
          </h4>
        </v-card-title>
      </v-col>
    </v-row>
    <V-row>
      <SearchFilter :showPartner="true" @filter-updated="onFilterUpdated" @filter-reset="onFilterReset" />
    </V-row>

    <VCardText class="d-flex flex-wrap gap-4 justify-space-between pb-2">
      <div class="me-3 d-flex gap-3">
        <ItemsPerPageSelector
          v-model="itemsPerPage"
          @update:model-value="updateItemsPerPage"
        />
      </div>
      <VSpacer />
      <VBtn color="red" v-show="selectedItems.length > 0" @click="markAllpaid = true">
        Mark {{ selectedItems.length > 1 ? 'All' : '' }} as Paid
      </VBtn>
    </VCardText>

    <VCardText class="px-0 border-t-sm">
      <VDatableComponent
        :headers="headers"
        :items="payments"
        :loading="loading"
        :search="search"
        :pagination="pagination"
        :pageNo="pageNo"
        @update:pageNo="pageNo = $event"
      >

        <template #item.sr_no="{ item }">
          <div class="d-flex align-center gap-2">

            <VCheckbox :model-value="selectedItems.some(i => i.transaction_id === item.transaction_id)"
              @update:model-value="(val) => handleCheckboxChange(item, val)" hide-details density="compact" v-if="permissionStore.hasPermission('modification.mark.as.paid.request')" />
            <span>{{ item.index }}</span>
          </div>
        </template>

        <template #item.date="{ item }">
          <div style="display: flex; align-items: center;">
            <span>{{ item.date }}</span>
          </div>
        </template>
        <template #item.paymentstatus="{ item }">
          <div>
            <p class="fs-12 pt-1 mb-1">{{ item.code }}</p>
            <div class="d-flex">
              <VChip size="small" color="success" variant="tonal" class="ms-1 fs-11 py-1 mb-0 font-weight-semibold">
                {{ item.channel }}
              </VChip>
            </div>
            <VChip :style="{
              ...resolveStatusVariant(item.status_value),
              fontSize: '12px',
              marginTop: '4px',
              marginBottom: '5px',
            }" class="font-weight-regular p-1" size="small">
              {{ resolveStatusVariant(item.status_value).text }}
            </VChip>
          </div>
        </template>
        <template #item.sender="{ item }">
          <p class="mb-0 fs-13 d-flex">
          <p :class="item.sender_sanction == 1 ? 'verify-user' : 'unverify-user'">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none"
              :stroke="item.sender_sanction == 1 ? '#ffffff' : '#fdf7f7'" stroke-width="3" stroke-linecap="round"
              stroke-linejoin="round">
              <path v-if="item.sender_sanction == 1" d="M5 12l5 5l10 -10" />
              <g v-else>
                <path d="M18 6l-12 12" />
                <path d="M6 6l12 12" />
              </g>
            </svg>
          </p>
          {{ item.customer_id }}- {{ item.customer_name }}
          </p>
          <p class="mb-0 fs-13">{{ item.customer_phone }}</p>
          <p class="mb-0 fs-13">
            {{ item.sending_country }}
            <span class="fs-12">
              <VChip color="warning py-1" size="small" class="fs-12 font-weight-regular">{{ item.sending_method }}
              </VChip>
            </span>
          </p>
        </template>
        <template #item.beneficiary="{ item }">
          <p class="mb-0 fs-13 d-flex">
          <p :class="item.beneficiary_sanction == 1 ? 'verify-user' : 'unverify-user'">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none"
              :stroke="item.sender_sanction == 1 ? '#ffffff' : '#fdf7f7'" stroke-width="3" stroke-linecap="round"
              stroke-linejoin="round">
              <path v-if="item.sender_sanction == 1" d="M5 12l5 5l10 -10" />
              <g v-else>
                <path d="M18 6l-12 12" />
                <path d="M6 6l12 12" />
              </g>
            </svg>
          </p>
          {{ item.beneficiary_id }}- {{ item.beneficiary_name }}
          </p>
          <p class="mb-0 fs-13">{{ item.beneficiary_phone }}</p>
          <p class="mb-0 fs-13">
            {{ item.beneficiary_country }}
            <span>
              <VChip color="warning py-1" size="small" class="fs-12 font-weight-regular">
                {{item.receiving_method.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}}
              </VChip>
            </span>
          </p>
        </template>

        <!----Payment Rate-->
        <template #item.amount="{ item }">
          <div>
            <p class="fs-13 mb-0 text-truncate">{{ item.sending_amount }} {{ item.sending_currency }}</p>
            <p class="fs-13 mb-0 text-truncate">1 {{ item.sending_currency }} = {{ item.sending_rate }} {{
              item.receiving_currency }}</p>
            <p class="fs-13 mb-0 text-truncate">{{ item.receiving_amount }} {{ item.receiving_currency }}</p>
          </div>
        </template>

        <!-- Actions -->
        <template #item.action="{ item }">
          <NuxtLink class="text-red text-decoration-underline cursor-pointer" @click="() => {
            rowActionItem = item;
            markAllpaid = true;
          }"  v-if="permissionStore.hasPermission('modification.mark.as.paid.request')">
            Mark as Paid
          </NuxtLink>
        </template>

      </VDatableComponent>

    </VCardText>
  </v-card>

  <!--mark paid Pop up design by usman faiz--->
  <div class="text-center pa-4">
    <!-- Dialog -->
    <v-dialog v-model="markPaid" max-width="800" transition="scale-transition">
      <v-card>
        <VCardTitle class="border-b-sm d-flex align-center justify-space-between">
          <h4 class="text-h4 py-2">Attention</h4>
          <IconBtn @click="markPaid = false">
            <VIcon icon="tabler-x" />
          </IconBtn>
        </VCardTitle>
        <v-card-text>
          <VForm @submit.prevent="">
            <VRow>
              <VCol cols="12">
                <p class="fs-18 mb-0 py-3 text-red">
                  Are you sure you want to mark this payment as paid? This
                  cannot be undone.
                  {{ selectedTransactionId }}
                </p>
              </VCol>
            </VRow>
            <VRow>
              <VCol cols="12" class="d-flex justify-end">
                <VBtn color="white" class="login-btn" @click="markPaid = false">Mark</VBtn>
              </VCol>
            </VRow>
          </VForm>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
  <div class="text-center pa-4">
    <!-- Dialog -->
    <v-dialog v-model="markAllpaid" max-width="800" transition="scale-transition">
      <v-card>
        <VCardTitle class="border-b-sm d-flex align-center justify-space-between">
          <h4 class="text-h4 py-2">Confirmation</h4>
          <IconBtn @click="markAllpaid = false">
            <VIcon icon="tabler-x" />
          </IconBtn>
        </VCardTitle>
        <v-card-text>
          <VForm @submit.prevent="markPaidForm">
            <VRow>
              <VCol cols="12">
                <p class="fs-18 mb-0 py-3">
                  Are you sure you want to mark payment{{ rowActionItem ? '' : 's' }} with Transfer Code (
                  <strong>
                    {{rowActionItem?.code || selectedItems.map(item => item.code).join(', ')}}
                  </strong>
                  )
                  as Paid?
                </p>
              </VCol>
            </VRow>

            <VRow>
              <VCol cols="12" class="d-flex justify-end border-t-sm">
                <VBtn color="red" type="submit">
                  Mark {{ selectedItems.length > 1 ? 'All' : '' }} as Paid
                </VBtn>
              </VCol>
            </VRow>
          </VForm>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>
