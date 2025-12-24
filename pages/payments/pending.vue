<script setup>
import { onMounted } from "vue";
import CustomerFilter from "@/components/customers/CustomerFilter.vue";
import { usePayments } from "@/composables/usePayments";
import useUiFeedback from "@/composables/useUiFeedback";
const { $axios } = useNuxtApp();
definePageMeta({
  middleware: "auth",
  permission: "transactions.awaiting_funds"
})
const permissionStore = usePermissionStore()
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

const defaultFilters = { status: ["awaiting_funds"] };

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

const funds = ref(false);
const selectedTransactionId = ref(null);
const selectedTransactionCode = ref(null);
const attachment = ref(null);
const description = ref("");

const cancelDialog = ref(false);
const transactionToCancel = ref(null);

const requiredValidator = (v) =>
  v !== null && v !== undefined && v !== "" ? true : "This field is required";
const receiveFundsForm = ref(null);

const showAdvancedSearch = ref(false);
const formatText = (text) => {
  if (!text) return "";
  return text.replace(/_/g, " ").toUpperCase();
};
onMounted(() => {
  loadPage();
});
const submitReceiveFunds = async () => {
  let responseSuccessful = false;

  const {valid} = await receiveFundsForm.value.validate();
  if (valid) {
    return;
  }

  const formData = new FormData();
  formData.append("transaction_id", selectedTransactionId.value);
  formData.append("description", description.value);

  if (attachment.value) {
    formData.append("attachment", attachment.value);
  }

  try {
    const res = await $axios.post("/funds/receive", formData);
    if(res.data.success){
      showSuccess(res.data.message);
      responseSuccessful = true;
    }
    else{
      showError(res.data.message);
    }
  } catch (err) {
      const data = err.response?.data;

      const msg =
        data?.message ||
        (data?.errors ? Object.values(data.errors).flat().join(", ") : null);

      showError(msg || "Something went wrong.");
    }


  if (responseSuccessful) {
    // showSuccess("Fund Added!");
    fetchTransactions({ status: ["awaiting_funds"] });

    funds.value = false;
    description.value = "";
    attachment.value = null;
    receiveFundsForm.value.resetValidation();
  }
};

const canceled = (transaction_id) => {
  transactionToCancel.value = transaction_id;
  cancelDialog.value = true;
};

const confirmCancelTransaction = async () => {
  try {
    showLoading();
   const res = await $axios.post("/cancel/transaction", {
      transaction_id: transactionToCancel.value,
    });
    if(res.data.success){
      showSuccess(res.data.message);
      fetchTransactions({ status: ["awaiting_funds"] });
    }
    else{
      showError(res.data.message);
    }
    //showSuccess("Marked as Canceled");
  } catch (error) {
    showError("Failed to cancel.");
    console.error(error);
  } finally {
    hideLoading();
    cancelDialog.value = false;
    transactionToCancel.value = null;
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
          <h4 class="text-h5 py-3">Search Pending Payments</h4>
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
      <template #item.funds="{ item }">
        <NuxtLink
          @click.prevent="
            selectedTransactionId = item.id;
            selectedTransactionCode = item.transaction_id;
            funds = true;
          "
          target="_blank"
          size="xsmall"
          class="fs-13 text-success cursor-pointer font-weight-regular text-decoration-underline" v-if="permissionStore.hasPermission('mark_receive_funds')"
        >
          Receive Funds
        </NuxtLink>
        <NuxtLink
          @click.prevent="canceled(item.id)"
          class="fs-13 text-truncate text-red font-weight-regular text-decoration-underline cursor-pointer" v-if="permissionStore.hasPermission('mark_cancelled')"
        >
          Mark canceled
        </NuxtLink>
      </template>
      <template #item.details="{ item }">
        <div>
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
    <v-dialog v-model="funds" max-width="800" transition="scale-transition">
      <v-card>
        <VCardTitle
          class="border-b-sm d-flex align-center justify-space-between"
        >
          <h4 class="text-h4 pt-3">Receive funds</h4>
          <IconBtn @click="funds = false">
            <VIcon icon="tabler-x" />
          </IconBtn>
        </VCardTitle>
        <VCardText class="pt-2">
          <VForm ref="receiveFundsForm" @submit.prevent="submitReceiveFunds">
            <VRow>
              <VCol cols="12">
                <span class="fs-13 label-color">Transfer Code </span>
                <AppTextField
                  name="code"
                  :model-value="selectedTransactionCode"
                  readonly
                  style="background-color: #e9ecef"
                />
              </VCol>
              <VCol cols="12">
                <span class="fs-13 label-color">Attachment <span class="text-red">*</span></span>
                <span
                  class="fs-13 choose-file"
                  v-if="!attachment || attachment.length === 0"
                >
                  Choose File
                </span>
                <VFileInput
                  v-model="attachment"
                  chips
                  name="attachment"
                  :rules="[requiredValidator]"
                />
              </VCol>
              <VCol cols="12">
                <span class="fs-13 label-color">Description <span class="text-red">*</span></span>
                <AppTextarea
                  v-model="description"
                  rows="2"
                  name="description"
                  class="cursor-pointer"
                  placeholder="Type here"
                  :rules="[requiredValidator]"
                />
              </VCol>

              <VCol class="text-end">
                <VBtn
                  color="white"
                  variant="elevated"
                  type="submit"
                  class="me-3 login-btn"
                  @click="funds = false"
                >
                  Fund Received</VBtn
                >
              </VCol>
            </VRow>
          </VForm>
        </VCardText>
      </v-card>
    </v-dialog>
  </div>

  <v-dialog v-model="cancelDialog" max-width="500">
    <v-card>
      <v-card-title class="text-h6 border-b-sm">Confirm Cancellation</v-card-title>
      <v-card-text
        >Are you sure you want to mark this transaction as
        canceled?</v-card-text
      >
      <v-card-actions class="justify-end">
        <v-btn color="error" class="px-3" @click="confirmCancelTransaction" variant="elevated">Yes, Cancel</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
