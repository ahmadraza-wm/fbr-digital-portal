<script setup>
definePageMeta({
  middleware: "auth",
  permission: "transactions.compliance_held"
})
const permissionStore = usePermissionStore()
import { onMounted } from "vue";
import CustomerFilter from "@/components/customers/CustomerFilter.vue";
import { usePayments } from "@/composables/usePayments";
import useUiFeedback from "@/composables/useUiFeedback";

const { $axios } = useNuxtApp();

const {
  headers,
  payments,
  options,
  total_transactions,
  total_sending_amount,
  total_charges,
  total_receiving_amount,
  fetchTransactions,
  resolveStatusVariant,
  getPartnerLink,
  pagination,
} = usePayments();

const defaultFilters = { status: ["compliance_held"] };

const { pageNo, itemsPerPage, updateItemsPerPage, loadPage } = usePagination(
  (params) => fetchTransactions({ ...defaultFilters, ...params }),
  {
    initialPage: 1,
    initialPerPage: 50,
  }
);

const {
  loading,
  showLoading,
  hideLoading,
  showSuccess,
  showError,
  confirmAction,
} = useUiFeedback();

const clearForm = ref(false);
const validateForm = ref(null);

const remakrs = ref(null);
const selectedTransactionCode = ref(null);
const selectedTransactionId = ref(null);

const showAdvancedSearch = ref(false);
const formatText = (text) => {
  if (!text) return "";
  return text.replace(/_/g, " ").toUpperCase();
};
onMounted(() => {
  loadPage();
});

const clearingForm = async () => {
  let responseSuccessful = false;

  const {valid} = await validateForm.value?.validate();
  if (!valid) {
    return;
  }
  
  const formData = new FormData();
  formData.append("transaction_id", selectedTransactionId.value);
  formData.append("remarks", remakrs.value); // fixed typo

  try {
    const res = await $axios.post("/clear/from/compliance/held", formData);
    if(res.data.success){
      showSuccess(res.data.message || "Cleared successfully");
        responseSuccessful = true;
    }
    else{
      let msg = Array.isArray(res.data.message)
        ? (res.data.message.length > 0 ? res.data.message.join(", ") : "Something went wrong.")
        : res.data.message || "Something went wrong.";

      showError(msg);
    }
  } catch (err) {
    let backendMessage =
    err.response?.data?.message && err.response.data.message.length
      ? Array.isArray(err.response.data.message)
        ? err.response.data.message.join(", ")
        : err.response.data.message
      : err.response?.data?.data || null;

  showError(backendMessage || "Failed to clear the payment from compliance.");
  }

  if (responseSuccessful) {
    showSuccess("Payment Cleared!");
    fetchTransactions({ status: ["compliance_held"] });

    clearForm.value = false;
    remakrs.value = "";
  }
};

const onFilterUpdated = (filters) => {
  fetchTransactions({ ...defaultFilters, ...filters });
};

const onFilterReset = () => {
  fetchTransactions(defaultFilters);
};
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
          <h4 class="text-h5 py-3">Search Compliance Hold Payments</h4>
        </v-card-title>
      </v-col>
    </v-row>
    <V-row>
      <PaymentFilter
        @filter-updated="onFilterUpdated"
        @filter-reset="onFilterReset"
        :isView="false"
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
          <span class="fs-13">{{ item.date }}</span>
        </div>
        <div class="fs-13">{{ item.transaction_id }}</div>
        <p
          v-if="
            item.system_remarks &&
            item.system_remarks.trim() !== '' &&
            item.system_remarks !== '-'
          "
          class="fs-12 mb-0 text-truncate text-red"
        >
          Hold Remarks (System): {{ item.system_remarks }}
        </p>

        <p
          v-if="
            item.customer_remarks &&
            item.customer_remarks.trim() !== '' &&
            item.customer_remarks !== '-'
          "
          class="fs-12 mb-0 text-truncate text-red"
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
              class="fs-13 font-weight-regular text-high-emphasis text-truncate"
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
          <span class="fs-13">{{ item.beneficiary_name }}</span>
        </div>
      </template>
      <template #item.customer_phone="{ item }">
        <div class="d-flex flex-column">
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
          <p class="fs-13 mb-0 text-truncate">{{ item.sending_method }}</p>
          <p class="fs-13 mb-0">{{ formatText(item.receiving_method) }}</p>
         <p class="fs-12 mb-0 text-truncate">
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
        </div>
      </template>
      <template #item.partner_name="{ item }">
        <div class="d-flex flex-column">
          <p class="fs-13 mb-0">testing</p>
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
          <p class="fs-13 mb-0">{{ item.account_number }}</p>
        </div>
      </template>
      <template #item.details="{ item }">
        <div>
          <NuxtLink
            class="fs-13 text-truncate d-block cursor-pointer"
            @click="
              clearForm = true;
              selectedTransactionId = item.id;
              selectedTransactionCode = item.transaction_id;
            "
            target="_blank" v-if="permissionStore.hasPermission('clear_from_compliance_held')"
            >Clear From CMH
          </NuxtLink>
          <VBtn
            color="secondary"
            type="button"
            :to="`/payments/detail/${item.id}`"
            target="_blank"
            variant="tonal"
            size="small" v-if="permissionStore.hasPermission('transactions.show')"
          >
            Detail
          </VBtn>
        </div>
      </template>
    </VDatableComponent>
  </v-card>
  <div class="text-center pa-4">
    <!-- Dialog -->
    <v-dialog v-model="clearForm" max-width="800" transition="scale-transition">
      <v-card>
        <VCardTitle
          class="border-b-sm d-flex align-center justify-space-between"
        >
          <h4 class="text-h4 pt-3 border-b-sm">Clear Form CMH</h4>
         <IconBtn @click="clearForm = false; remakrs = ''">
            <VIcon icon="tabler-x" />
          </IconBtn>
        </VCardTitle>
        <VCardText class="pt-2">
          <VForm ref="validateForm" @submit.prevent="clearingForm">
            <VRow>
              <VCol cols="12 pb-1">
                <span class="fs-13 label-color">Transfer Code </span>
                <AppTextField
                  v-model="selectedTransactionCode"
                  name="code"
                  readonly
                  placeholder="12345678"
                />
              </VCol>
              <VCol cols="12 pb-1">
                <span class="fs-13 label-color"
                  >Reason For Clearing from Compliance<span class="text-red">*</span></span
                >
                <AppTextarea
                  v-model="remakrs"
                  name="reason"
                  rows="2"
                  placeholder="Type here..."
                  :rules="[(v) => !!v || 'Remarks are required']"
                />
              </VCol>

              <VCol cols="12 d-flex justify-end">
                <VBtn
                  color="transparent"
                  variant="elevated"
                  class="me-3"
                  type="submit"
                 
                  style="background-color: #fe5f574f; color: #fe5f57"
                  >Clear Payment</VBtn
                >
              </VCol>
            </VRow>
          </VForm>
        </VCardText>
      </v-card>
    </v-dialog>
  </div>
</template>
