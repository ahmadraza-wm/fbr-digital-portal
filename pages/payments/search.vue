<script setup>
definePageMeta({
  middleware: "auth",
  permission: "transactions.track_all"
})
const permissionStore = usePermissionStore()
import { onMounted } from "vue";
import CustomerFilter from "@/components/customers/CustomerFilter.vue";
import itemPerPage from "@/components/itemPerPage.vue";
import { usePayments } from "@/composables/usePayments";
import { usePaginatedTable } from "@/composables/usePaginatedTable";
import { useRoute, useRouter } from "vue-router";
const route = useRoute();
const router = useRouter();
const {
  headers,
  payments,
  loading,
  total_transactions,
  total_sending_amount,
  total_charges,
  total_receiving_amount,
  fetchTransactions,
  resolveStatusVariant,
  getPartnerLink,
  currentPage,
  lastPage,
  pagination,
  total,
} = usePayments();

const { pageNo, itemsPerPage, updateItemsPerPage, loadPage } = usePagination(
  fetchTransactions,
  {
    initialPage: 1,
    initialPerPage: 50,
  },
);

const filters = ref({
  customer_id: "",
});


const showAdvancedSearch = ref(false);
const formatText = (text) => {
  if (!text) return "";
  return text.replace(/_/g, " ").toUpperCase();
};

const onFilterUpdated = (filters) => {
  fetchTransactions(filters, true);
};

const onFilterReset = () => {
  fetchTransactions({}, true);
};


onMounted(() => {
  const queryFilters = {
    customer_id: route.query.customer_id || "",
    from: route.query.from || "",
    to: route.query.to || "",
  }

  filters.value = { ...filters.value, ...queryFilters }
  fetchTransactions({
    status: [null],
    ...filters.value,
  });
});
</script>

<template>
  <div>
    <PaymentCard
      :totalTransactions="total_transactions"
      :totalSendingAmount="total_sending_amount"
      :totalCharges="total_charges"
      :totalReceivingAmount="total_receiving_amount"
    />
  </div>
  <v-card class="mt-5">
    <v-row>
      <v-col cols="12">
        <v-card-title class="border-b-sm">
          <h4 class="text-h5 py-3">Track all payments</h4>
        </v-card-title>
      </v-col>
    </v-row>
    <V-row>
      <PaymentFilter
        @filter-updated="onFilterUpdated"
        @filter-reset="onFilterReset"
        :isView="true"
        v-model="filters"
      />
    </V-row>
    <VCardText class="d-flex flex-wrap gap-4 justify-space-between pb-2">
      <div class="me-3 d-flex gap-3">
         <itemPerPage
          v-model="itemsPerPage"
          @update:model-value="updateItemsPerPage"
        />
      </div>
    </VCardText>


     <VDatableComponent
        :headers="headers"
        :items="payments"
        :loading="loading"
        :search="search"
        :pagination="pagination"
        :pageNo="pageNo"
        @update:pageNo="pageNo = $event"
        class="border-t-sm"
      >
      <template #item.date="{ item }">
        <div style="display: flex; align-items: center">
          <span class="fs-13 text-wrap">{{ item.date }}</span>
        </div>
        <div class="fs-13">{{ item.transaction_id }}</div>
        <p
          v-if="
            item.system_remarks &&
            item.system_remarks.trim() !== '' &&
            item.system_remarks !== '-'
          "
          class="fs-12 mb-0 text-wrap text-red"
          style="white-space: normal !important; word-break: break-word"
        >
          Hold Remarks (System): {{ item.system_remarks }}
        </p>

        <p
          v-if="
            item.customer_remarks &&
            item.customer_remarks.trim() !== '' &&
            item.customer_remarks !== '-'
          "
          class="fs-12 mb-0 text-wrap text-red"
        >
          Hold Remarks (For Customer): {{ item.customer_remarks }}
        </p>
      </template>
      <template #item.status="{ item }">
        <div>
          <VChip
            :style="{
              ...resolveStatusVariant(item.status_value),
              fontSize: '10px',
              marginTop: '2px',
            }"
            class="font-weight-light p-1"
            size="small"
          >
            {{ resolveStatusVariant(item.status_value).text }}
          </VChip>
        </div>
        <div class="fs-13">{{ item.channel }}</div>
      </template>
       <template #item.ban="{ item }">
        <!-- Sender Sanction -->
        <div class="d-flex align-items-center">
          <div class="fs-13" :class="item.sender_sanction == 1 ? 'text-success' : 'text-danger'">
            <template v-if="item.sender_sanction == 1"> 
              <NuxtLink :to="`/compliance/sanction-list?name=${item.customer_name}`" target="_blank"  class="text-success">Pass</NuxtLink>
            </template>
            <template v-else>
              <NuxtLink :to="`/compliance/sanction-list?name=${item.customer_name}`" target="_blank" class="link-color">Ban</NuxtLink>
            </template>
          </div>
          <span class="mx-2">-</span>
          <p class="mb-0 fs-13">{{ item.customer_id }}</p>
        </div>

        <!-- Beneficiary Sanction -->
        <div class="d-flex align-items-center">
          <div class="fs-13" :class="item.beneficiary_sanction == 1 ? 'text-success' : 'text-danger'
            ">
            <template v-if="item.beneficiary_sanction == 1"> 
                <NuxtLink :to="`/compliance/sanction-list?name=${item.beneficiary_name}`" target="_blank"  class="text-success">Pass</NuxtLink>
            </template>
            <template v-else>
              <NuxtLink :to="`/compliance/sanction-list?name=${item.beneficiary_name}`" target="_blank" class="link-color">Ban</NuxtLink>
            </template>
          </div>
          <span class="mx-2">-</span>
          <p class="mb-0 fs-13">{{ item.beneficiary_id }}</p>
        </div>
      </template>

      <!---Address-->
      <template #item.customer_name="{ item }">
        <div class="d-flex flex-column ms-3">
          <div class="d-flex align-items-center">
            <span
              class="fs-13 font-weight-regular text-high-emphasis text-wrap"
            >
              {{ item.customer_name }}
            </span>
            <VChip
              v-if="item.first_transaction"
              color="success"
              class="ml-2"
              size="x-small"
              variant="elevated"
              style="font-size: 10px"
            >
              1st Transaction
            </VChip>
          </div>
          <span class="fs-12 font-weight-bold text-wrap">{{
            item.beneficiary_name
          }}</span>
        </div>
      </template>

      <template #item.customer_phone="{ item }">
        <div>
          <p class="fs-13 mb-0">{{ item.customer_phone }}</p>
          <p class="fs-13 mb-0">{{ item.beneficiary_phone }}</p>
        </div>
      </template>
      <template #item.sending_country="{ item }">
        <div>
          <P class="fs-13 mb-0">{{ item.sending_country }}</P>
          <P class="fs-13 mb-0">{{ item.receiving_country }}</P>
        </div>
      </template>
      <template #item.sending_method="{ item }">
        <div class="d-flex flex-column">
          <p class="fs-13 mb-0 text-wrap">{{ item.sending_method }}</p>
          <p class="fs-13 mb-0">{{ formatText(item.receiving_method) }}</p>
          <p
            class="fs-12 mb-0 text-wrap font-weight-bold"
            style="white-space: normal !important; word-break: break-word"
          >
            {{
              item.sending_method === "Bank Transfer"
                ? "Bank Transfer:"
                : item.sending_method === "Cash"
                ? "Cash:"
                : item.sending_method === "Card"
                ? "Pay By Card(Debit/Credit):"
                : item.sending_method + ":"
            }}
          </p>
        </div>
      </template>
      <template #item.sending_rate="{ item }">
        <div>
          <p class="fs-13 mb-0 text-truncate">
            {{ item.sending_currency }} {{ item.sending_rate }}
          </p>
          <p class="fs-13 mb-0 text-truncate">
            {{ item.receiving_currency }} {{ item.receiving_rate }}
          </p>
        </div>
      </template>
      <template #item.sending_amount="{ item }">
        <div>
          <p class="fs-13 mb-0 text-truncate">
            {{ item.sending_currency }} {{ item.sending_amount }}
          </p>
          <p class="fs-13 mb-0 text-truncate">
            {{ item.receiving_currency }} {{ item.receiving_amount }}
          </p>
          <p class="fs-12 mb-0 text-wrap text-success">
            DC Rate = Nil |SC Rate = Nil
          </p>
        </div>
      </template>
      <template #item.partner_name="{ item }">
        <div class="d-flex flex-column">
          <p class="fs-13 mb-0 text-wrap">
            {{ item.partner_name }} {{ item.partner_currency }}
          </p>
        </div>
      </template>
      <template #item.other_info="{ item }">
        <div>
          <VBtn
            color="success"
            variant="tonal"
            :to="getPartnerLink(item)"
            target="_blank"
            size="xsmall"
            class="fs-13 px-2 font-weight-regular"
          >
            {{ item.other_info }}
          </VBtn>
          <p
            class="fs-13 mb-0"
            style="white-space: normal !important; word-break: break-word"
          >
            {{ item.account_number }}
          </p>
        </div>
      </template>

      <template #item.details="{ item }">
        <div v-if="permissionStore.hasPermission('transactions.show')">
          <VBtn
            color="secondary"
            type="button"
            :to="`/payments/detail/${item.id}`"
            target="_blank"
            variant="tonal"
            size="small"
          >
            Detail
          </VBtn>
        </div>
      </template>
    </VDatableComponent>
  </v-card>
</template>
