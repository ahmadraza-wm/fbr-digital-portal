<script setup>
definePageMeta({
  middleware: "auth",
  permission: "transactions.send_to_partner"
})
const permissionStore = usePermissionStore()
import { usePayments } from "@/composables/usePayments";
import { onMounted } from "vue";

const {
  headers,
  payments,
  loading,
  partners,
  hideLoading,
  showLoading,
  options,
  showError,
  total_transactions,
  total_sending_amount,
  total_charges,
  total_receiving_amount,
  fetchTransactions,
  resolveStatusVariant,
  getPartnerLink,
  getPartnerStatus,
  pagination,
} = usePayments();

const defaultFilters = { status: ["send_to_partner"] };

const { pageNo, itemsPerPage, updateItemsPerPage, loadPage } = usePagination(
  (params) => fetchTransactions({ ...defaultFilters, ...params }),
  {
    initialPage: 1,
    initialPerPage: 50,
  }
);


const invoice = ref("");
const code = ref("");
const countryVal = ref(null);
const showDetails = ref(false);
const transactionDetails = ref(null);

const checkStatus = ref(false);


const searchHandler = async () => {

  if (invoice.value || code.value || countryVal.value) {
    showLoading();
    try {
      const filterParams = {
        invoice_no: invoice.value,
        transaction_code: code.value,
        partner_id: countryVal.value,
      };

      const result = await getPartnerStatus(filterParams);

      if (result) {
        transactionDetails.value = result;
        showDetails.value = true;
      } else {
        transactionDetails.value = null;
        showDetails.value = false;



        const messages = result?.errors
          ? Object.values(result.errors).flat()
          : result?.message || "Failed to fetch partner status";
        showError(messages);
      }
    } catch (err) {
      const messages = err.response?.data?.errors
        ? Object.values(err.response.data.errors).flat()
        : err.response?.data?.message || "Failed to fetch partner status";
      showError(messages);
    } finally {
      hideLoading();
    }
  } else {
    showError("Please enter at least one input before searching");
  }
};

const openTransactionDialog = (id) => {
  const transactiondata = payments.value.find((payment) => payment.id === id);
  if (transactiondata) {
    transactionDetails.value = transactiondata;
    showDetails.value = true;
    checkStatus.value = true;
  }
};


const showAdvancedSearch = ref(false);
const formatText = (text) => {
  if (!text) return "";
  return text.replace(/_/g, " ").toUpperCase();
};


onMounted(() => {
  loadPage();
});

const onFilterUpdated = (filters) => {
  fetchTransactions({ ...defaultFilters, ...filters });
};



const onFilterReset = () => {
  fetchTransactions(defaultFilters);
};
</script>

<template>
  <div>
    <PaymentCard :totalTransactions="total_transactions" :totalSendingAmount="total_sending_amount"
      :totalCharges="total_charges" :totalReceivingAmount="total_receiving_amount" />
  </div>
  <v-card class="mt-5">
    <v-row>
      <v-col cols="12">
        <v-card-title class="border-b-sm">
          <h4 class="text-h5 py-3">
            Search Forwarded Payments (You can only search Send to Partner
            Payments here)
          </h4>
        </v-card-title>
      </v-col>
    </v-row>
    <V-row>
      <PaymentFilter :showPartner="true" @filter-updated="onFilterUpdated" @filter-reset="onFilterReset"
        :isView="false" />
    </V-row>
    <VCardText class="d-flex flex-wrap gap-4 justify-space-between pb-2">
      <div class="me-3 d-flex gap-3">
        <itemPerPage
          v-model="itemsPerPage"
          @update:model-value="updateItemsPerPage"
        />
      </div>
    </VCardText>

   <CustomDataTableComponent
      :headers="headers"
      :items="payments"
      :loading="loading"
      :search="search"
      :pagination="pagination"
      :pageNo="pageNo"
      @update:pageNo="pageNo = $event"
      class="border-t-sm"
    >
      <template #item.sr_no="{ item }">
          {{ item.index }}
      </template>

      <template #row-extra="{ item }">
          <template
            v-if="
              (item.partner_response_message && item.partner_response_message.trim() !== '' && permissionStore.hasPermission('partner_response')) && item.partner_response_message !== '-' ||
              (item.system_remarks && item.system_remarks.trim() !== '' && item.system_remarks !== '-') ||
              (item.customer_remarks && item.customer_remarks.trim() !== '' && item.customer_remarks !== '-') ||
              (item.partner_transaction_reference && permissionStore.hasPermission('partner_response'))
            "
          >
            <tr class="py-0">
              <td class="h-auto my-2"></td>

              <td :colspan="headers.length / 2" class="h-auto my-2">

                <!-- Partner Response -->
                <div
                  v-if="item.partner_response_message && item.partner_response_message.trim() !== '' && permissionStore.hasPermission('partner_response') && item.partner_response_message !== '-'"
                  class="fs-13"
                >
                  <span style="color: red;" class="font-weight-bold">Partner Response: </span>
                  <span style="color: red;">{{ item.partner_response_message }}</span>
                </div>

                <!-- System Remarks -->
                <p
                  v-if="item.system_remarks && item.system_remarks.trim() !== '' && item.system_remarks !== '-'"
                  class="fs-12 mb-0 text-truncate text-red"
                >
                  Hold Remarks (System): {{ item.system_remarks }}
                </p>

                <!-- Customer Remarks -->
                <p
                  v-if="item.customer_remarks && item.customer_remarks.trim() !== '' && item.customer_remarks !== '-'"
                  class="fs-12 mb-0 text-truncate text-red"
                >
                  Hold Remarks (For Customer): {{ item.customer_remarks }}
                </p>
              </td>

              <td :colspan="(headers.length - 1) / 2" class="h-auto my-2">
                <span class="fs-12 mb-0 text-truncate">
                  {{
                    item.sending_method === "Bank Transfer"
                      ? "Bank Transfer:"
                      : item.sending_method === "Cash"
                      ? "Cash:"
                      : item.sending_method === "Card"
                      ? "Pay By Card(Debit/Credit):"
                      : item.sending_method + ":"
                  }}
                </span>

                <!-- Partner Transaction Reference -->
                <span
                  v-if="item.partner_transaction_reference && permissionStore.hasPermission('partner_response') && item.partner_transaction_reference !== '-'"
                  class="fs-13 mb-0"
                >
                  {{ formatText(item.partner_transaction_reference) }}
                </span>
              </td>
            </tr>
          </template>
        </template>

      <template #item.date="{ item }">
        <div style="display: flex; align-items: center;">
          <span class="fs-13">{{ item.date }}</span>
        </div>
        <div class="fs-13">{{ item.transaction_id }}</div>
      </template>
      <template #item.status="{ item }">
        <div>
          <VChip :style="{
            ...resolveStatusVariant(item.status_value),
            fontSize: '10px',
            marginTop: '2px',
          }" class="font-weight-light p-1" size="small">
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
            <span class="fs-13 font-weight-regular text-high-emphasis text-truncate">
              {{ item.customer_name }}
            </span>
            <VChip v-if="item.first_transaction" color="success" class="ml-2" size="x-small" variant="elevated"
              style="font-size: 10px;">
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
          <p class="fs-12 mb-0 text-wrap text-success">DC Rate = {{ item.dc_rate }} | SC Rate = {{ item.sc_rate }}</p>
        </div>
      </template>
      <template #item.partner_name="{ item }">
        <div class="d-flex flex-column">
          <p class="fs-13 mb-0 text-wrap"> {{ item.partner_name }} {{ item.partner_currency }}</p>
        </div>
      </template>
      <template #item.other_info="{ item }">
        <div>
          <VBtn color="success" variant="tonal" :to="getPartnerLink(item)" target="_blank" size="xsmall"
            class="fs-13 px-2 font-weight-regular">
            {{ item.other_info }}
          </VBtn>
          <p class="fs-13 mb-0">{{ item.account_number }}</p>
        </div>
      </template>
      <template #item.details="{ item }">
        <div class="py-1">
          <VBtn color="secondary" type="button" :to="`/payments/detail/${item.id}`" target="_blank" variant="tonal"
            size="small" v-if="permissionStore.hasPermission('transactions.show')">
            Detail
          </VBtn>
          <NuxtLink class="fs-13 text-truncate d-block cursor-pointer pt-2" @click="openTransactionDialog(item.id)" v-if="permissionStore.hasPermission('payments.partner.status')">
            Check Status
          </NuxtLink>
        </div>
      </template>
    </CustomDataTableComponent>
  </v-card>
  <!--payment status pop up design by usman faiz -->
  <div class="text-center pa-4">
    <!-- Dialog -->
    <v-dialog v-model="checkStatus" max-width="1000" persistent transition="scale-transition">
      <v-card>
        <VCardTitle class="border-b-sm d-flex align-center justify-space-between" style="background-color: #fbfafa;">
          <h4 class="text-h5 pt-4 pb-3 mb-0 float-start">
            View Partner Status
          </h4>
          <IconBtn @click="checkStatus = false">
            <VIcon icon="tabler-x" />
          </IconBtn>
        </VCardTitle>
        <VForm @submit.prevent="searchHandler">
          <VCardText class="pt-3 mb-3">
            <VRow class="pt-3 d-flex align-end">
              <VCol cols="3" class="pb-1">
                <span class="fs-13 label-color">Invoice #</span>
                <AppTextField v-model="invoice" name="invoice" placeholder="*****" />
              </VCol>
              <VCol cols="3" class="pb-1">
                <span class="fs-13 label-color">Transfer Code</span>
                <AppTextField v-model="code" name="code" placeholder="125698" />
              </VCol>
              <VCol cols="3" class="pb-1">
                <span class="fs-13 label-color">Partners</span>
                <AppAutocomplete v-model="countryVal" :items="partners" item-title="name" item-value="id"
                  placeholder="GCCEmit" />
              </VCol>
              <VCol cols="3" class="pb-1">
                <VBtn variant="tonal" class="me-3 login-btn" type="submit">Search</VBtn>
                <VBtn color="secondary" variant="tonal" class="me-3" @click="
                  () => {
                    invoice = '';
                    code = '';
                    countryVal = null;
                    showDetails = false;
                  }
                ">Reset</VBtn>
              </VCol>
            </VRow>
          </VCardText>
        </VForm>
        <v-card-text class="py-2 border-b-sm">
          <VRow>
            <VCol cols="3">
              <p class="fs-15 font-weight-medium text-color mb-1">Transfer Code</p>
              <p class="text-color1 mb-0 fs-15 font-weight-medium">
                {{ transactionDetails?.transaction_id || "---" }}
              </p>
            </VCol>
            <VCol cols="3">
              <p class="fs-15 font-weight-medium text-color mb-1">Beneficiary</p>
              <p class="text-color1 mb-0 fs-15 font-weight-medium">
                {{ transactionDetails?.beneficiary_name || "---" }}
              </p>
            </VCol>
            <VCol cols="3">
              <p class="fs-15 font-weight-medium text-color mb-1">Sender</p>
              <p class="text-color1 mb-0 fs-15 font-weight-medium">
                {{ transactionDetails?.customer_name || "---" }}
              </p>
            </VCol>
            <VCol cols="3">
              <p class="fs-15 font-weight-medium text-color mb-1">Sending Country</p>
              <p class="text-color1 mb-0 fs-15 font-weight-medium">
                {{ transactionDetails?.sending_country || "---" }}
              </p>
            </VCol>
          </VRow>
        </v-card-text>

        <v-card-text class="py-2 mt-4 border-b-sm">
          <VRow>
            <VCol cols="3">
              <p class="fs-15 font-weight-medium text-color mb-1">Receiving Country</p>
              <p class="text-color1 mb-0 fs-15 font-weight-medium">
                {{ transactionDetails?.receiving_country || "---" }}
              </p>
            </VCol>
            <VCol cols="3">
              <p class="fs-15 font-weight-medium text-color mb-1">Sending Amount</p>
              <p class="text-color1 mb-0 fs-15 font-weight-medium">
                {{ transactionDetails?.sending_currency || "---" }}
                {{ transactionDetails?.sending_amount || "0" }}
              </p>
            </VCol>
            <VCol cols="3">
              <p class="fs-15 font-weight-medium text-color mb-1">Receiving Amount</p>
              <p class="text-color1 mb-0 fs-15 font-weight-medium">
                {{ transactionDetails?.receiving_currency || "---" }}
                {{ transactionDetails?.receiving_amount || "0" }}
              </p>
            </VCol>
            <VCol cols="3">
              <p class="fs-15 font-weight-medium text-color mb-1">Agent Rate</p>
              <p class="text-color1 mb-0 fs-15 font-weight-medium">
                {{ transactionDetails?.agent_rate || "---" }}
              </p>
            </VCol>
          </VRow>
        </v-card-text>

        <v-card-text class="py-2 mt-4">
          <VRow>
            <VCol cols="3">
              <p class="fs-15 font-weight-medium text-color mb-1">Customer Rate</p>
              <p class="text-color1 mb-0 fs-15 font-weight-medium">
                {{ transactionDetails?.customer_rate || "---" }}
              </p>
            </VCol>
            <VCol cols="3">
              <p class="fs-15 font-weight-medium text-color mb-1">Status</p>
              <VChip :color="transactionDetails?.status_value === 'processing' ? 'success' : 'grey'" size="small">
                {{ transactionDetails?.status || "---" }}
              </VChip>
            </VCol>
            <VCol cols="3">
              <p class="fs-15 font-weight-medium text-color mb-1">Partner Code</p>
              <p class="text-color1 mb-0 fs-15 font-weight-medium">
                {{ transactionDetails?.id || "---" }}
              </p>
            </VCol>
            <VCol cols="3">
              <p class="fs-15 font-weight-medium text-color mb-1">Partner Name</p>
              <p class="text-color1 mb-0 fs-15 font-weight-medium">
                {{ transactionDetails?.partner_name || "---" }}
              </p>
            </VCol>
          </VRow>
        </v-card-text>

        <v-card-text class="px-0">
          <VCol class="border-b-sm px-4 mt-2" style="background-color: #fbfafa;">
            <h4 class="text-h5 py-2">Partner Status</h4>
          </VCol>
          <VRow class="border-b-sm px-5 pt-3">
            <VCol cols="3">
              <p class="fs-15 font-weight-medium text-color mb-1">Status</p>
              <p class="text-color1 mb-0 fs-15 font-weight-medium">
                {{ transactionDetails?.status || "---" }}
              </p>
            </VCol>
            <VCol cols="6">
              <p class="fs-15 font-weight-medium text-color mb-1">Description</p>
              <p class="text-color1 mb-0 fs-15 font-weight-medium">
                {{ transactionDetails?.sanction_description || "---" }}
              </p>
            </VCol>
          </VRow>
        </v-card-text>
        <VCol>
          <VBtn color="secondary" variant="tonal" class="mb-2 float-end" @click="checkStatus = false">Close
          </VBtn>
        </VCol>
      </v-card>
    </v-dialog>
  </div>
</template>
